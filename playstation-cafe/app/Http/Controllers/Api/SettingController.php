<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        return response()->json(Setting::all()->pluck('value', 'key'));
    }

    public function store(Request $request)
    {
        if ($request->hasFile('store_logo')) {
            $path = $request->file('store_logo')->store('logos', 'public');
            Setting::updateOrCreate(['key' => 'store_logo'], ['value' => $path]);
        }
        
        // [الإصلاح] التأكد من حفظ كل الحقول المرسلة
        foreach ($request->except(['store_logo']) as $key => $value) {
            if ($value !== null) {
                Setting::updateOrCreate(['key' => $key], ['value' => $value]);
            }
        }

        return response()->json(['message' => 'تم حفظ إعدادات المحل بنجاح']);
    }
}