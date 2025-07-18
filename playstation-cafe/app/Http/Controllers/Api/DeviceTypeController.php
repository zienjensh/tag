<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DeviceType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DeviceTypeController extends Controller
{
    /**
     * دالة لجلب جميع أنواع الأجهزة.
     * GET /api/device-types
     */
    public function index()
    {
        return response()->json(DeviceType::all());
    }

    /**
     * دالة لحفظ نوع جهاز جديد.
     * POST /api/device-types
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:device_types,name',
            'is_room' => 'required|boolean',
            'single_price' => 'required|numeric|min:0',
            'multi_price' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $deviceType = DeviceType::create($validator->validated());

        return response()->json($deviceType, 201);
    }

    /**
     * دالة لعرض بيانات نوع جهاز محدد.
     * GET /api/device-types/{id}
     */
    public function show(DeviceType $deviceType)
    {
        return response()->json($deviceType);
    }

    /**
     * دالة لتحديث بيانات نوع جهاز.
     * PUT /api/device-types/{id}
     */
    public function update(Request $request, DeviceType $deviceType)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:device_types,name,' . $deviceType->id,
            'is_room' => 'required|boolean',
            'single_price' => 'required|numeric|min:0',
            'multi_price' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $deviceType->update($validator->validated());

        return response()->json($deviceType);
    }

    /**
     * دالة لحذف نوع جهاز.
     * DELETE /api/device-types/{id}
     */
    public function destroy(DeviceType $deviceType)
    {
        $deviceType->delete();

        return response()->json(null, 204); // 204 No Content
    }
}