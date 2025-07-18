<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ShiftController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\PermissionController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\DeviceController;


// رابط تسجيل الدخول (لا يحتاج لمصادقة)
Route::post('/login', [AuthController::class, 'login']);

// [الإصلاح الجذري] كل الروابط التالية الآن محمية وتتطلب توكن
Route::middleware('auth:sanctum')->group(function () {
    
    // Shifts Routes
    Route::get('/shifts/active', [ShiftController::class, 'getActiveShift']);
    Route::post('/shifts/start', [ShiftController::class, 'startShift']);
    Route::post('/shifts/end', [ShiftController::class, 'endShift']);
    Route::get('/shifts/history/days', [ShiftController::class, 'getShiftHistoryDays']);
    Route::post('/shifts/report/day', [ShiftController::class, 'getReportForDay']);
    
    // Transactions Route
    Route::post('/transactions', [TransactionController::class, 'store']);

    // Settings & Permissions Routes
    Route::get('/settings', [SettingController::class, 'index']);
    Route::post('/settings', [SettingController::class, 'store']);
    Route::get('/pages', [PageController::class, 'index']);
    Route::get('/users/{user}/permissions', [PermissionController::class, 'getUserPermissions']);
    Route::post('/users/{user}/permissions', [PermissionController::class, 'updateUserPermissions']);

    // Resourceful Routes (CRUD)
    Route::apiResource('users', UserController::class);
    Route::apiResource('customers', CustomerController::class);
});
Route::get('/devices-page-data', [DeviceController::class, 'getPageData']);
Route::post('/devices/{device}/start-session', [DeviceController::class, 'startSession']);
Route::post('/sessions/{session}/add-order', [DeviceController::class, 'addBuffetOrder']);
Route::post('/sessions/{session}/end', [DeviceController::class, 'endSession']);