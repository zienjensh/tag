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
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
</head>
<body>
    <div id="overlay" class="overlay"></div>
    <div class="sidebar-toggle" id="sidebarToggle"><i class="fas fa-bars"></i></div>

    <div id="sidebar" class="sidebar"></div>

    <div class="main-content">
        <header class="page-header">
            <div class="header-content">
                <div class="page-title">
                    <h1>إدارة الأجهزة</h1>
                    <p>متابعة وإدارة جميع الأجهزة والجلسات النشطة</p>
                </div>
                <div class="header-actions">
                    <button class="action-btn primary" id="addDeviceModalBtn">
                        <i class="fas fa-plus"></i>
                        <span>إضافة جهاز</span>
                    </button>
                    <button class="action-btn secondary" onclick="loadPageData()">
                        <i class="fas fa-sync-alt"></i>
                        <span>تحديث</span>
                    </button>
                </div>
            </div>
        </header>

        <!-- بطاقات الإحصائيات -->
        <div class="financial-cards">
            <div class="card balance-card">
                <div class="card-header">
                    <div class="card-icon">
                        <i class="fas fa-desktop"></i>
                    </div>
                </div>
                <div class="card-body">
                    <h3>إجمالي الأجهزة</h3>
                    <div class="amount">
                        <span class="value" id="totalDevices">0</span>
                        <span class="currency">جهاز</span>
                    </div>
                    <div class="trend positive">
                        <i class="fas fa-chart-line"></i>
                        <span>النظام</span>
                    </div>
                </div>
            </div>

            <div class="card expenses-card">
                <div class="card-header">
                    <div class="card-icon">
                        <i class="fas fa-hourglass-half"></i>
                    </div>
                </div>
                <div class="card-body">
                    <h3>الأجهزة المشغولة</h3>
                    <div class="amount">
                        <span class="value" id="busyDevices">0</span>
                        <span class="currency">جهاز</span>
                    </div>
                    <div class="trend negative">
                        <i class="fas fa-clock"></i>
                        <span>نشط</span>
                    </div>
                </div>
            </div>

            <div class="card revenues-card">
                <div class="card-header">
                    <div class="card-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                </div>
                <div class="card-body">
                    <h3>الأجهزة المتاحة</h3>
                    <div class="amount">
                        <span class="value" id="availableDevices">0</span>
                        <span class="currency">جهاز</span>
                    </div>
                    <div class="trend positive">
                        <i class="fas fa-thumbs-up"></i>
                        <span>جاهز</span>
                    </div>
                </div>
            </div>

            <div class="card notes-card">
                <div class="card-header">
                    <div class="card-icon">
                        <i class="fas fa-money-bill-wave"></i>
                    </div>
                </div>
                <div class="card-body">
                    <h3>إيرادات اليوم</h3>
                    <div class="amount">
                        <span class="currency">ج</span>
                        <span class="value" id="todayDevicesRevenue">0.00</span>
                    </div>
                    <div class="trend positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>من الأجهزة</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- التنقل بين التبويبات -->
        <div class="tab-navigation">
            <button data-tab="devices" class="tab-btn active">
                <i class="fas fa-gamepad"></i>
                <span>الأجهزة</span>
            </button>
            <button data-tab="invoices" class="tab-btn">
                <i class="fas fa-receipt"></i>
                <span>فواتير الأجهزة</span>
            </button>
        </div>

        <!-- محتوى تبويب الأجهزة -->
        <div id="devices-content" class="tab-content active">
            <div class="data-table-section">
                <div class="table-header">
                    <h3>الأجهزة المتاحة والمشغولة</h3>
                    <div class="table-actions">
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" placeholder="البحث في الأجهزة..." onkeyup="filterDevices(this.value)">
                        </div>
                    </div>
                </div>
                <div class="devices-grid" id="devicesGridContainer">
                    <div class="loading-spinner">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>جاري تحميل الأجهزة...</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- محتوى تبويب الفواتير -->
        <div id="invoices-content" class="tab-content">
            <div class="data-table-section">
                <div class="table-header">
                    <h3>فواتير الأجهزة اليوم</h3>
                    <div class="table-actions">
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" placeholder="البحث في الفواتير...">
                        </div>
                        <button class="filter-btn">
                            <i class="fas fa-filter"></i>
                            <span>فلترة</span>
                        </button>
                    </div>
                </div>
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>رقم الفاتورة</th>
                                <th>تفاصيل الجهاز</th>
                                <th>المبلغ الإجمالي</th>
                                <th>وقت الإنشاء</th>
                                <th>الموظف</th>
                            </tr>
                        </thead>
                        <tbody id="invoicesTableBody">
                            <tr>
                                <td colspan="5" class="no-data-cell">
                                    <div class="no-data-content">
                                        <i class="fas fa-receipt"></i>
                                        <h4>لا توجد فواتير</h4>
                                        <p>لم يتم إنشاء أي فواتير اليوم</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- مودال إضافة جهاز جديد -->
    <div id="addDeviceModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-plus-circle"></i> إضافة جهاز جديد</h3>
                <span class="close-btn">&times;</span>
            </div>
            <form id="addDeviceForm">
                <div class="form-group">
                    <label for="deviceName">اسم الجهاز</label>
                    <input type="text" id="deviceName" placeholder="مثال: جهاز 1، جهاز VIP" required>
                </div>
                <div class="form-group">
                    <label for="deviceTypeSelect">نوع الجهاز</label>
                    <select id="deviceTypeSelect" required>
                        <option value="">اختر النوع...</option>
                    </select>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-cancel">إلغاء</button>
                    <button type="submit" class="btn-save">حفظ الجهاز</button>
                </div>
            </form>
        </div>
    </div>

    <!-- مودال بدء جلسة -->
    <div id="startSessionModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-play-circle"></i> بدء وقت لجهاز: <span id="startSessionDeviceName"></span></h3>
                <span class="close-btn">&times;</span>
            </div>
            <form id="startSessionForm">
                <div id="deviceTypePrices" class="device-prices-info">
                    <!-- سيتم ملؤها بواسطة JavaScript -->
                </div>
                <div class="form-group">
                    <label>اختر نوع اللعب</label>
                    <div class="radio-group">
                        <label class="radio-option">
                            <input type="radio" name="play_type" value="single" checked>
                            <span class="radio-custom"></span>
                            <span class="radio-text">فردي</span>
                        </label>
                        <label class="radio-option">
                            <input type="radio" name="play_type" value="multi">
                            <span class="radio-custom"></span>
                            <span class="radio-text">متعدد</span>
                        </label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-cancel">إلغاء</button>
                    <button type="submit" class="btn-save">بدء الوقت</button>
                </div>
            </form>
        </div>
    </div>

    <!-- مودال البوفيه -->
    <div id="buffetModal" class="modal">
        <div class="modal-content wide">
            <div class="modal-header">
                <h3><i class="fas fa-concierge-bell"></i> إضافة طلبات بوفيه - جهاز <span id="buffetTableId"></span></h3>
                <span class="close-btn">&times;</span>
            </div>
            <div class="buffet-content">
                <div class="buffet-section">
                    <h4>الأقسام</h4>
                    <div class="category-list" id="buffetCategoryList">
                        <!-- سيتم ملؤها بواسطة JavaScript -->
                    </div>
                </div>
                
                <div class="buffet-section">
                    <h4>المنتجات</h4>
                    <div class="product-grid" id="buffetProductGrid">
                        <!-- سيتم ملؤها بواسطة JavaScript -->
                    </div>
                </div>
                
                <div class="buffet-section">
                    <div class="order-summary" id="buffetOrderSummary">
                        <h4>الطلبات الحالية</h4>
                        <ul id="buffetOrderList">
                            <li class="no-items">لا توجد طلبات</li>
                        </ul>
                        <div class="summary-total">
                            <span>الإجمالي:</span>
                            <span id="buffetTotal">0.00 ج</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-cancel">إلغاء</button>
                <button type="button" class="btn-save" id="saveBuffetOrderBtn">إضافة الطلبات للفاتورة</button>
            </div>
        </div>
    </div>

    <script src="../js/main.js"></script>
    <script src="../js/devices.js"></script>
</body>
</html>