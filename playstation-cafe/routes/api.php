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
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\DeviceTypeController;
use App\Http\Controllers\Api\CouponController;

// رابط تسجيل الدخول (لا يحتاج لمصادقة)
Route::post('/login', [AuthController::class, 'login']);

// الروابط المحمية بالمصادقة
Route::middleware('auth:sanctum')->group(function () {
    
    // Authentication routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Shifts Routes
    Route::get('/shifts/active', [ShiftController::class, 'getActiveShift']);
    Route::post('/shifts/start', [ShiftController::class, 'startShift']);
    Route::post('/shifts/end', [ShiftController::class, 'endShift']);
    Route::get('/shifts/history/days', [ShiftController::class, 'getShiftHistoryDays']);
    Route::post('/shifts/report/day', [ShiftController::class, 'getReportForDay']);
    Route::post('/shifts/report/period', [ShiftController::class, 'getReportForPeriod']);
    
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
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('products', ProductController::class);
    Route::apiResource('device-types', DeviceTypeController::class);
    Route::apiResource('coupons', CouponController::class);
    
    // Product restock
    Route::post('/products/{product}/restock', [ProductController::class, 'restock']);
    
    // Device management routes
    Route::get('/devices-page-data', [DeviceController::class, 'getPageData']);
    Route::apiResource('devices', DeviceController::class);
    Route::post('/devices/{device}/start-session', [DeviceController::class, 'startSession']);
    Route::post('/sessions/{session}/add-order', [DeviceController::class, 'addBuffetOrder']);
    Route::post('/sessions/{session}/end', [DeviceController::class, 'endSession']);
    Route::post('/sessions/{session}/update-time', [DeviceController::class, 'updateSessionTime']);
});