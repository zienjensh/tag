<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إدارة الأجهزة - نظام إدارة المقهى</title>
    <link rel="stylesheet" href="../css/money.css">
    <link rel="stylesheet" href="../css/devices.css">
    <link rel="stylesheet" href="../css/modal.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div id="overlay" class="overlay"></div>
    <div class="sidebar-toggle" id="sidebarToggle"><i class="fas fa-bars"></i></div>

    <div id="sidebar" class="sidebar">
        </div>

    <div class="main-content">
        <header class="page-header">
            <div class="header-content">
                <div class="page-title"><h1>شاشة الأجهزة</h1><p>متابعة وإدارة جميع الأجهزة والجلسات</p></div>
                <div class="header-actions">
                    <button class="action-btn primary" id="addDeviceModalBtn"><i class="fas fa-plus"></i><span>إضافة جهاز</span></button>
                </div>
            </div>
        </header>

        <div class="financial-cards">
            <div class="card"><div class="card-icon"><i class="fas fa-desktop"></i></div><div class="card-body"><h3>إجمالي الأجهزة</h3><span class="value" id="totalDevices">0</span></div></div>
            <div class="card busy"><div class="card-icon"><i class="fas fa-hourglass-half"></i></div><div class="card-body"><h3>الأجهزة المشغولة</h3><span class="value" id="busyDevices">0</span></div></div>
            <div class="card available"><div class="card-icon"><i class="fas fa-check-circle"></i></div><div class="card-body"><h3>الأجهزة المتاحة</h3><span class="value" id="availableDevices">0</span></div></div>
            <div class="card revenues"><div class="card-icon"><i class="fas fa-money-bill-wave"></i></div><div class="card-body"><h3>إيرادات اليوم (أجهزة)</h3><div class="amount"><span class="currency">ج</span><span class="value" id="todayDevicesRevenue">0.00</span></div></div></div>
        </div>

        <div class="tab-navigation">
            <button data-tab="devices" class="tab-btn active"><i class="fas fa-gamepad"></i><span>الأجهزة</span></button>
            <button data-tab="invoices" class="tab-btn"><i class="fas fa-receipt"></i><span>فواتير الأجهزة</span></button>
        </div>

        <div id="devices-content" class="tab-content active">
            <div class="devices-grid" id="devicesGridContainer">
                </div>
        </div>
        
        <div id="invoices-content" class="tab-content">
            <div class="table-container">
                <table class="data-table">
                    <thead><tr><th>رقم الفاتورة</th><th>الجهاز</th><th>التكلفة</th><th>الوقت</th><th>بواسطة</th></tr></thead>
                    <tbody id="invoicesTableBody">
                        </tbody>
                </table>
            </div>
        </div>
    </div>

    <div id="addDeviceModal" class="modal"><div class="modal-content"><div class="modal-header"><h3><i class="fas fa-plus-circle"></i> إضافة جهاز جديد</h3><span class="close-btn">&times;</span></div><form id="addDeviceForm"><div class="form-group"><label for="deviceName">اسم الجهاز (مثال: جهاز 1, جهاز VIP)</label><input type="text" id="deviceName" required></div><div class="form-group"><label for="deviceTypeSelect">نوع الجهاز</label><select id="deviceTypeSelect" required><option value="">اختر النوع...</option></select></div><div class="modal-footer"><button type="button" class="btn-cancel">إلغاء</button><button type="submit" class="btn-save">حفظ الجهاز</button></div></form></div></div>
    <div id="startSessionModal" class="modal"><div class="modal-content"><div class="modal-header"><h3><i class="fas fa-play-circle"></i> بدء وقت لجهاز: <span id="startSessionDeviceName"></span></h3><span class="close-btn">&times;</span></div><form id="startSessionForm"><div class="form-group"><label>اختر نوع اللعب</label><div class="play-type-options"><label><input type="radio" name="play_type" value="single" checked> فردي</label><label><input type="radio" name="play_type" value="multi"> متعدد</label></div></div><div class="modal-footer"><button type="button" class="btn-cancel">إلغاء</button><button type="submit" class="btn-save">بدء الوقت</button></div></form></div></div>
    <div id="buffetModal" class="modal"><div class="modal-content wide"><div class="modal-header"><h3><i class="fas fa-concierge-bell"></i> إضافة طلبات بوفيه</h3><span class="close-btn">&times;</span></div><div class="buffet-content"><div class="category-list" id="buffetCategoryList"></div><div class="product-grid" id="buffetProductGrid"></div><div class="order-summary" id="buffetOrderSummary"><h4>الطلبات الحالية</h4><ul id="buffetOrderList"></ul><div class="summary-total"><span>الإجمالي:</span><span id="buffetTotal">0.00 ج</span></div></div></div><div class="modal-footer"><button type="button" class="btn-cancel">إلغاء</button><button type="button" class="btn-save" id="saveBuffetOrderBtn">إضافة الطلبات للفاتورة</button></div></div></div>

    <script src="../js/main.js"></script>
    <script src="../js/devices.js"></script>
</body>
</html>