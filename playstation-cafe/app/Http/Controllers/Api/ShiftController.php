<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Shift;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ShiftController extends Controller
{
    public function getActiveShift() 
    {
        $shift = Shift::where('status', 'active')->with('transactions.user')->first();
        
        if (!$shift) {
            return response()->json(null, 404);
        }
        
        return response()->json($shift);
    }

    public function startShift(Request $request) 
    {
        // التحقق من وجود شيفت مفتوح
        if (Shift::where('status', 'active')->exists()) {
            return response()->json(['message' => 'يوجد شيفت مفتوح بالفعل.'], 409);
        }

        $validated = $request->validate([
            'starting_cash' => 'required|numeric|min:0'
        ]);

        try {
            $shift = Shift::create([
                'user_id_started' => Auth::id(),
                'start_time' => Carbon::now(),
                'starting_cash' => $validated['starting_cash'],
                'status' => 'active'
            ]);

            return response()->json([
                'message' => 'تم بدء الشيفت بنجاح',
                'shift' => $shift
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'فشل في بدء الشيفت: ' . $e->getMessage()
            ], 500);
        }
    }

    public function endShift(Request $request) 
    {
        $shift = Shift::where('status', 'active')->first();
        
        if (!$shift) {
            return response()->json(['message' => 'لا يوجد شيفت مفتوح.'], 404);
        }

        $validated = $request->validate([
            'ending_cash' => 'required|numeric|min:0',
            'notes' => 'nullable|string'
        ]);

        try {
            $shift->update([
                'user_id_ended' => Auth::id(),
                'end_time' => Carbon::now(),
                'ending_cash' => $validated['ending_cash'],
                'status' => 'closed',
                'notes' => $request->notes
            ]);

            return response()->json($shift);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'فشل في إنهاء الشيفت: ' . $e->getMessage()
            ], 500);
        }
    }
    
    public function getShiftHistoryDays() 
    {
        $dates = Shift::where('status', 'closed')
            ->select(DB::raw('DATE(start_time) as date'))
            ->distinct()
            ->orderBy('date', 'desc')
            ->limit(30)
            ->get()
            ->pluck('date');
            
        return response()->json($dates);
    }
    
    public function getReportForDay(Request $request) 
    {
        $validated = $request->validate([
            'date' => 'required|date_format:Y-m-d'
        ]);
        
        $shifts = Shift::whereDate('start_time', $validated['date'])
            ->where('status', 'closed')
            ->with('transactions.user')
            ->get();
            
        return response()->json($shifts);
    }
    
    /**
     * جلب تقرير لفترة زمنية محددة
     */
    public function getReportForPeriod(Request $request)
    {
        $validated = $request->validate([
            'from_date' => 'required|date',
            'to_date' => 'required|date|after_or_equal:from_date'
        ]);
        
        $shifts = Shift::whereBetween('start_time', [$validated['from_date'], $validated['to_date']])
            ->where('status', 'closed')
            ->with(['transactions.user'])
            ->orderBy('start_time', 'desc')
            ->get();
            
        return response()->json([
            'shifts' => $shifts,
            'period' => [
                'from' => $validated['from_date'],
                'to' => $validated['to_date']
            ]
        ]);
    }
}