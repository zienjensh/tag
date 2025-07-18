<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Shift;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth; // مهم جداً

class ShiftController extends Controller
{
    public function getActiveShift() {
        return response()->json(Shift::where('status', 'active')->with('transactions.user')->first());
    }

    public function startShift(Request $request) {
        if (Shift::where('status', 'active')->exists()) {
            return response()->json(['message' => 'يوجد شيفت مفتوح بالفعل.'], 409);
        }
        $validated = $request->validate(['starting_cash' => 'required|numeric|min:0']);
        $shift = Shift::create([
            'user_id_started' => Auth::id(), // [الإصلاح] استخدام الـ ID الخاص بالمستخدم المسجل دخوله
            'start_time' => Carbon::now(),
            'starting_cash' => $validated['starting_cash'],
        ]);
        return response()->json($shift, 201);
    }

    public function endShift(Request $request) {
        $shift = Shift::where('status', 'active')->firstOrFail();
        $validated = $request->validate(['ending_cash' => 'required|numeric|min:0', 'notes' => 'nullable|string']);
        $shift->update([
            'user_id_ended' => Auth::id(), // [الإصلاح] استخدام الـ ID الخاص بالمستخدم المسجل دخوله
            'end_time' => Carbon::now(),
            'ending_cash' => $validated['ending_cash'],
            'status' => 'closed',
            'notes' => $request->notes
        ]);
        return response()->json($shift);
    }
    
    public function getShiftHistoryDays() {
        $dates = Shift::where('status', 'closed')->select(DB::raw('DATE(start_time) as date'))->distinct()->orderBy('date', 'desc')->limit(30)->get()->pluck('date');
        return response()->json($dates);
    }
    
    public function getReportForDay(Request $request) {
        $validated = $request->validate(['date' => 'required|date_format:Y-m-d']);
        $shifts = Shift::whereDate('start_time', $validated['date'])->where('status', 'closed')->with('transactions.user')->get();
        return response()->json($shifts);
    }
}