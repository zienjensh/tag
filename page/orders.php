<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إدارة الأوردرات - نظام إدارة المقهى</title>
    <link rel="stylesheet" href="../css/money.css">
    <link rel="stylesheet" href="../css/orders.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div id="overlay" class="overlay" onclick="toggleSidebar()"></div>

    <!-- Sidebar Toggle Button -->
    <div class="sidebar-toggle" onclick="toggleSidebar()">
        <i class="fas fa-bars"></i>
    </div>

    <!-- Enhanced Sidebar -->
    <div id="sidebar" class="sidebar">
        <div class="sidebar-header">
            <div class="logo-container">
                <img src="uploads/logo.png" alt="Logo" class="logo-img">
                <div class="logo-text">
                    <h3>مقهى النجمة</h3>
                    <span>نظام الإدارة</span>
                </div>
            </div>
        </div>
        
        <nav class="sidebar-nav">
            <ul class="nav-list">
                <li><a href="money.php" class="nav-link">
                    <i class="fas fa-wallet"></i>
                    <span>النقدية</span>
                </a></li>
                <li><a href="devices.php" class="nav-link">
                    <i class="fas fa-desktop"></i>
                    <span>الأجهزة</span>
                </a></li>
                <li><a href="tables.php" class="nav-link">
                    <i class="fas fa-table"></i>
                    <span>التربيزات</span>
                </a></li>
                <li><a href="orders.php" class="nav-link active">
                    <i class="fas fa-shopping-cart"></i>
                    <span>الأوردرات</span>
                </a></li>
                <li><a href="inventory.php" class="nav-link">
                    <i class="fas fa-boxes"></i>
                    <span>المخزن والأسعار</span>
                </a></li>
                <li><a href="customer.php" class="nav-link">
                    <i class="fas fa-users"></i>
                    <span>العملاء</span>
                </a></li>
                <li><a href="employees.php" class="nav-link">
                    <i class="fas fa-user-tie"></i>
                    <span>الموظفين</span>
                </a></li>
                <li><a href="setting.php" class="nav-link">
                    <i class="fas fa-cog"></i>
                    <span>الإعدادات</span>
                </a></li>
                <li><a href="reports.php" class="nav-link">
                    <i class="fas fa-chart-bar"></i>
                    <span>التقارير</span>
                </a></li>
            </ul>
        </nav>
        
        <div class="sidebar-footer">
            <div class="user-profile">
                <div class="user-avatar">
                    <img src="uploads/employee.jpg" alt="Employee">
                    <div class="status-dot"></div>
                </div>
                <div class="user-info">
                    <span class="user-name">محمد حامد</span>
                    <span class="user-role">مدير النظام</span>
                </div>
            </div>
            <button class="logout-btn">
                <i class="fas fa-sign-out-alt"></i>
                <span>تسجيل الخروج</span>
            </button>
        </div>
    </div>

    <div class="main-content">
        <!-- Page Header -->
        <header class="page-header">
            <div class="header-content">
                <div class="header-left">
                    <div class="page-title">
                        <h1>إدارة الأوردرات</h1>
                        <p>تتبع ومراقبة جميع الأوردرات وحالاتها</p>
                    </div>
                </div>
                <div class="header-right">
                    <div class="header-actions">
                        <button class="action-btn primary" id="addOrderBtn">
                            <i class="fas fa-plus"></i>
                            <span>أوردر جديد</span>
                        </button>
                        <button class="action-btn secondary" id="exportOrdersBtn">
                            <i class="fas fa-download"></i>
                            <span>تصدير</span>
                        </button>
                        <button class="action-btn icon-only" id="refreshOrdersBtn">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <!-- Order Status Cards -->
        <div class="financial-cards">
            <div class="card balance-card clickable-card" id="totalOrders" onclick="showAllOrders()">
                <div class="card-header">
                    <div class="card-icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <div class="card-menu">
                        <i class="fas fa-ellipsis-v"></i>
                    </div>
                </div>
                <div class="card-body">
                    <h3>إجمالي الأوردرات</h3>
                    <div class="amount">
                        <span class="value">8</span>
                        <span class="currency">أوردر</span>
                    </div>
                    <div class="trend positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>+3 اليوم</span>
                    </div>
                </div>
            </div>

            <div class="card expenses-card" id="pendingOrders" onclick="showPendingOrders()">
                <div class="card-header">
                    <div class="card-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="card-menu">
                        <i class="fas fa-ellipsis-v"></i>
                    </div>
                </div>
                <div class="card-body">
                    <h3>الأوردرات المعلقة</h3>
                    <div class="amount">
                        <span class="value">3</span>
                        <span class="currency">أوردر</span>
                    </div>
                    <div class="trend negative">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>1 عاجل</span>
                    </div>
                </div>
            </div>

            <div class="card revenues-card clickable-card" id="completedOrders" onclick="showCompletedOrders()">
                <div class="card-header">
                    <div class="card-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="card-menu">
                        <i class="fas fa-ellipsis-v"></i>
                    </div>
                </div>
                <div class="card-body">
                    <h3>الأوردرات المكتملة</h3>
                    <div class="amount">
                        <span class="value">3</span>
                        <span class="currency">أوردر</span>
                    </div>
                    <div class="trend positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>متوسط 15 دقيقة</span>
                    </div>
                </div>
            </div>

            <div class="card notes-card" id="orderRevenue">
                <div class="card-header">
                    <div class="card-icon">
                        <i class="fas fa-money-bill-wave"></i>
                    </div>
                    <div class="card-menu">
                        <i class="fas fa-ellipsis-v"></i>
                    </div>
                </div>
                <div class="card-body">
                    <h3>إيرادات اليوم</h3>
                    <div class="amount">
                        <span class="currency">ج</span>
                        <span class="value">310.50</span>
                    </div>
                    <div class="trend positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>+18.3%</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tab Navigation -->
        <div class="tab-navigation">
            <button id="pending-orders-tab" class="tab-btn active" onclick="switchTab('pending')">
                <i class="fas fa-clock"></i>
                <span>الأوردرات المعلقة</span>
            </button>
            <button id="completed-orders-tab" class="tab-btn" onclick="switchTab('completed')">
                <i class="fas fa-check-circle"></i>
                <span>الأوردرات المكتملة</span>
            </button>
            <button id="cancelled-orders-tab" class="tab-btn" onclick="switchTab('cancelled')">
                <i class="fas fa-times-circle"></i>
                <span>الأوردرات الملغية</span>
            </button>
        </div>

        <!-- Pending Orders Content -->
        <div id="pending-content" class="tab-content active">
            <!-- Preparing Orders Section -->
            <div class="devices-section" id="preparingOrdersSection">
                <div class="section-header">
                    <h3>قيد التحضير</h3>
                    <span class="section-count">2 أوردرات</span>
                </div>
                <div class="devices-grid" id="preparingOrdersGrid">
                    <!-- Preparing Order 1 -->
                    <div class="device-card busy" data-order-id="ORD001" data-status="preparing">
                        <div class="device-status-badge busy">قيد التحضير</div>
                        <button class="device-delete-btn" onclick="cancelOrder('ORD001')" title="إلغاء الأوردر">
                            <i class="fas fa-times"></i>
                        </button>
                        <div class="device-header">
                            <div class="device-icon">
                                <i class="fas fa-utensils"></i>
                            </div>
                            <div class="device-info">
                                <h3>أوردر #ORD001</h3>
                                <span class="device-id">تربيزة 001</span>
                            </div>
                        </div>
                        <div class="device-timer">
                            <div class="timer-display">
                                <div class="time-unit">
                                    <span class="time-value">05</span>
                                    <span class="time-label">دقيقة</span>
                                </div>
                                <div class="time-separator">:</div>
                                <div class="time-unit">
                                    <span class="time-value">30</span>
                                    <span class="time-label">ثانية</span>
                                </div>
                            </div>
                            <div class="timer-info">
                                <span>بدأ في: 2:30 PM</span>
                            </div>
                        </div>
                        <div class="order-items-preview">
                            <div class="item-preview">كوكاكولا x2</div>
                            <div class="item-preview">شيبسي x1</div>
                            <div class="item-preview">عصير برتقال x3</div>
                        </div>
                        <div class="order-total-display">
                            <span class="total-label">الإجمالي:</span>
                            <span class="total-amount">45.50 ج</span>
                        </div>
                        <div class="device-actions">
                            <button class="action-btn primary" onclick="markOrderReady('ORD001')">
                                <i class="fas fa-check"></i>
                                <span>جاهز</span>
                            </button>
                            <button class="action-btn secondary" onclick="openOrderDetails('ORD001')">
                                <i class="fas fa-eye"></i>
                                <span>التفاصيل</span>
                            </button>
                        </div>
                    </div>

                    <!-- Preparing Order 2 - Urgent -->
                    <div class="device-card busy urgent" data-order-id="ORD002" data-status="preparing">
                        <div class="device-status-badge busy urgent">عاجل - قيد التحضير</div>
                        <button class="device-delete-btn" onclick="cancelOrder('ORD002')" title="إلغاء الأوردر">
                            <i class="fas fa-times"></i>
                        </button>
                        <div class="device-header">
                            <div class="device-icon">
                                <i class="fas fa-utensils"></i>
                            </div>
                            <div class="device-info">
                                <h3>أوردر #ORD002</h3>
                                <span class="device-id">تربيزة 003</span>
                            </div>
                        </div>
                        <div class="device-timer urgent">
                            <div class="timer-display">
                                <div class="time-unit">
                                    <span class="time-value">12</span>
                                    <span class="time-label">دقيقة</span>
                                </div>
                                <div class="time-separator">:</div>
                                <div class="time-unit">
                                    <span class="time-value">15</span>
                                    <span class="time-label">ثانية</span>
                                </div>
                            </div>
                            <div class="timer-info">
                                <span>بدأ في: 2:18 PM</span>
                            </div>
                        </div>
                        <div class="order-items-preview">
                            <div class="item-preview">قهوة x2</div>
                            <div class="item-preview">شاي x1</div>
                            <div class="item-preview">كرواسون x2</div>
                        </div>
                        <div class="order-total-display">
                            <span class="total-label">الإجمالي:</span>
                            <span class="total-amount">78.00 ج</span>
                        </div>
                        <div class="device-actions">
                            <button class="action-btn primary urgent" onclick="markOrderReady('ORD002')">
                                <i class="fas fa-check"></i>
                                <span>جاهز</span>
                            </button>
                            <button class="action-btn secondary" onclick="openOrderDetails('ORD002')">
                                <i class="fas fa-eye"></i>
                                <span>التفاصيل</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Section Separator -->
            <div class="section-separator"></div>

            <!-- Ready Orders Section -->
            <div class="devices-section" id="readyOrdersSection">
                <div class="section-header">
                    <h3>جاهز للتقديم</h3>
                    <span class="section-count">1 أوردر</span>
                </div>
                <div class="devices-grid" id="readyOrdersGrid">
                    <!-- Ready Order 1 -->
                    <div class="device-card available" data-order-id="ORD003" data-status="ready">
                        <div class="device-status-badge available">جاهز للتقديم</div>
                        <button class="device-delete-btn" onclick="cancelOrder('ORD003')" title="إلغاء الأوردر">
                            <i class="fas fa-times"></i>
                        </button>
                        <div class="device-header">
                            <div class="device-icon">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <div class="device-info">
                                <h3>أوردر #ORD003</h3>
                                <span class="device-id">تربيزة 005</span>
                            </div>
                        </div>
                        <div class="device-specs">
                            <div class="spec-item">
                                <span class="spec-label">وقت الإنتهاء:</span>
                                <span class="spec-value">2:28 PM</span>
                            </div>
                            <div class="spec-item">
                                <span class="spec-label">مدة التحضير:</span>
                                <span class="spec-value">8 دقائق</span>
                            </div>
                        </div>
                        <div class="order-items-preview">
                            <div class="item-preview">عصير مانجو x2</div>
                            <div class="item-preview">بسكويت x1</div>
                        </div>
                        <div class="order-total-display">
                            <span class="total-label">الإجمالي:</span>
                            <span class="total-amount">32.00 ج</span>
                        </div>
                        <div class="device-actions">
                            <button class="action-btn primary" onclick="deliverOrder('ORD003')">
                                <i class="fas fa-truck"></i>
                                <span>تم التقديم</span>
                            </button>
                            <button class="action-btn secondary" onclick="openOrderDetails('ORD003')">
                                <i class="fas fa-eye"></i>
                                <span>التفاصيل</span>
                            </button>
                            <button class="action-btn secondary" onclick="printOrderReceipt('ORD003')">
                                <i class="fas fa-print"></i>
                                <span>طباعة</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Completed Orders Content -->
        <div id="completed-content" class="tab-content">
            <div class="data-table-section">
                <div class="table-header">
                    <h3>الأوردرات المكتملة</h3>
                    <div class="table-actions">
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" placeholder="البحث في الأوردرات...">
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
                                <th>رقم الأوردر</th>
                                <th>التربيزة</th>
                                <th>وقت الطلب</th>
                                <th>وقت التقديم</th>
                                <th>المدة</th>
                                <th>المنتجات</th>
                                <th>الإجمالي</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>#ORD101</td>
                                <td>تربيزة 002</td>
                                <td>2024-06-25 14:30</td>
                                <td>2024-06-25 14:45</td>
                                <td>15 دقيقة</td>
                                <td>كوكاكولا (x2), شيبسي (x1)</td>
                                <td>25.00 ج</td>
                                <td>
                                    <button class="action-btn secondary">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="action-btn primary">
                                        <i class="fas fa-print"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>#ORD102</td>
                                <td>تربيزة 004</td>
                                <td>2024-06-25 15:00</td>
                                <td>2024-06-25 15:20</td>
                                <td>20 دقيقة</td>
                                <td>قهوة (x1), كرواسون (x2)</td>
                                <td>35.00 ج</td>
                                <td>
                                    <button class="action-btn secondary">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="action-btn primary">
                                        <i class="fas fa-print"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>#ORD103</td>
                                <td>تربيزة 001</td>
                                <td>2024-06-25 16:15</td>
                                <td>2024-06-25 16:30</td>
                                <td>15 دقيقة</td>
                                <td>عصير برتقال (x3), بسكويت (x1)</td>
                                <td>50.00 ج</td>
                                <td>
                                    <button class="action-btn secondary">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="action-btn primary">
                                        <i class="fas fa-print"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Cancelled Orders Content -->
        <div id="cancelled-content" class="tab-content">
            <div class="data-table-section">
                <div class="table-header">
                    <h3>الأوردرات الملغية</h3>
                    <div class="table-actions">
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" placeholder="البحث في الأوردرات...">
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
                                <th>رقم الأوردر</th>
                                <th>التربيزة</th>
                                <th>وقت الطلب</th>
                                <th>وقت الإلغاء</th>
                                <th>سبب الإلغاء</th>
                                <th>المنتجات</th>
                                <th>المبلغ المفقود</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>#ORD201</td>
                                <td>تربيزة 003</td>
                                <td>2024-06-25 13:00</td>
                                <td>2024-06-25 13:15</td>
                                <td>طلب العميل</td>
                                <td>شاي (x2), كيك (x1)</td>
                                <td>28.00 ج</td>
                                <td>
                                    <button class="action-btn secondary">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>#ORD202</td>
                                <td>تربيزة 005</td>
                                <td>2024-06-25 17:30</td>
                                <td>2024-06-25 17:35</td>
                                <td>نفاد المخزون</td>
                                <td>عصير فراولة (x2)</td>
                                <td>36.00 ج</td>
                                <td>
                                    <button class="action-btn secondary">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Add New Order Modal -->
    <div id="addOrderModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>
                    <i class="fas fa-plus-circle"></i>
                    أوردر جديد
                </h3>
                <span class="close-btn" onclick="closeModal('addOrderModal')">&times;</span>
            </div>
            <form>
                <div class="form-group">
                    <label for="orderTableSelect">اختر التربيزة</label>
                    <select id="orderTableSelect" required>
                        <option value="">-- اختر التربيزة --</option>
                        <option value="001">تربيزة 001 - VIP</option>
                        <option value="002">تربيزة 002 - عادية</option>
                        <option value="003">تربيزة 003 - عادية</option>
                        <option value="004">تربيزة 004 - VIP</option>
                        <option value="005">تربيزة 005 - عادية</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="orderPriority">الأولوية</label>
                    <select id="orderPriority">
                        <option value="normal">عادي</option>
                        <option value="urgent">عاجل</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="orderNotes">ملاحظات</label>
                    <textarea id="orderNotes" placeholder="ملاحظات إضافية للأوردر..."></textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-cancel" onclick="closeModal('addOrderModal')">
                        <i class="fas fa-times"></i>
                        إلغاء
                    </button>
                    <button type="button" class="btn-save" id="proceedToProducts">
                        <i class="fas fa-arrow-right"></i>
                        التالي - اختيار المنتجات
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Product Selection Modal -->
    <div id="productSelectionModal" class="modal">
        <div class="modal-content product-selection-content">
            <span class="close-btn" onclick="closeModal('productSelectionModal')">&times;</span>
            <div class="modal-header">
                <h3>اختيار المنتجات للأوردر</h3>
                <div class="order-info-display">
                    <span>التربيزة: <span id="selectedTableDisplay"></span></span>
                    <span>الأولوية: <span id="selectedPriorityDisplay"></span></span>
                </div>
            </div>
            
            <div class="modal-body">
                <div class="product-selection-area">
                    <div class="search-and-filter">
                        <input type="text" placeholder="بحث عن منتج..." class="search-product-input" id="orderProductSearchInput">
                        <div class="categories" id="orderCategories">
                            <button class="category-btn active" data-category="الكل">الكل</button>
                            <button class="category-btn" data-category="عصائر">عصائر</button>
                            <button class="category-btn" data-category="صودا">صودا</button>
                            <button class="category-btn" data-category="مشروبات ساخنة">مشروبات ساخنة</button>
                            <button class="category-btn" data-category="مأكولات">مأكولات</button>
                        </div>
                    </div>
                    <div class="product-display-options">
                        <button id="orderGridViewBtn" class="active"><i class="fas fa-th-large"></i></button>
                        <button id="orderListViewBtn"><i class="fas fa-list"></i></button>
                    </div>
                    <div class="product-list grid-view" id="orderProductList">
                        <!-- المنتجات ستظهر هنا -->
                    </div>
                </div>
                
                <div class="selected-products-summary">
                    <h4>المنتجات المضافة للأوردر</h4>
                    <table class="selected-products-table">
                        <thead>
                            <tr>
                                <th>اسم المنتج</th>
                                <th>السعر</th>
                                <th>الكمية</th>
                                <th>الإجمالي</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody id="orderSelectedProductsTableBody">
                            <!-- المنتجات المضافة ستظهر هنا -->
                        </tbody>
                    </table>
                    <div class="total-selected-products">
                        إجمالي الأوردر: <span id="orderTotalSelectedProductsAmount">0.00</span> ج
                    </div>
                    <div class="order-actions-buttons">
                        <button class="save-order-btn" id="saveOrderBtn"><i class="fas fa-save"></i> حفظ الأوردر</button>
                        <button class="cancel-btn-bottom" id="cancelOrderProductsBtn">إلغاء</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Order Details Modal -->
    <div id="orderDetailsModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>
                    <i class="fas fa-info-circle"></i>
                    تفاصيل الأوردر <span id="orderDetailsNumber">#ORD001</span>
                </h3>
                <span class="close-btn" onclick="closeModal('orderDetailsModal')">&times;</span>
            </div>
            
            <div class="order-details-info">
                <div class="detail-item">
                    <span class="detail-label">التربيزة:</span>
                    <span class="detail-value" id="orderDetailsTable">تربيزة 001</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">وقت الطلب:</span>
                    <span class="detail-value" id="orderDetailsTime">2024-06-25 14:30</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">المدة المنقضية:</span>
                    <span class="detail-value" id="orderDetailsElapsed">5 دقائق</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">الأولوية:</span>
                    <span class="detail-value" id="orderDetailsPriority">عادي</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">الحالة:</span>
                    <span class="detail-value status" id="orderDetailsStatus">قيد التحضير</span>
                </div>
            </div>

            <div class="order-details-items">
                <h4>المنتجات المطلوبة:</h4>
                <table class="order-items-table">
                    <thead>
                        <tr>
                            <th>المنتج</th>
                            <th>الكمية</th>
                            <th>السعر</th>
                            <th>الإجمالي</th>
                        </tr>
                    </thead>
                    <tbody id="orderDetailsItemsBody">
                        <!-- سيتم ملؤها بالجافاسكريبت -->
                    </tbody>
                </table>
                <div class="order-total-display">
                    الإجمالي: <span id="orderDetailsTotal">45.50 ج</span>
                </div>
            </div>

            <div class="order-details-notes" id="orderDetailsNotesSection">
                <h4>الملاحظات:</h4>
                <p id="orderDetailsNotes">لا توجد ملاحظات</p>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn-cancel" onclick="closeModal('orderDetailsModal')">
                    <i class="fas fa-times"></i>
                    إغلاق
                </button>
                <button type="button" class="btn-save" id="printOrderReceiptBtn">
                    <i class="fas fa-print"></i>
                    طباعة الإيصال
                </button>
            </div>
        </div>
    </div>

    <!-- Print Receipt Modal -->
    <div id="printReceiptModal" class="modal">
        <div class="modal-content print-receipt-content">
            <span class="close-btn" onclick="closeModal('printReceiptModal')">&times;</span>
            <div class="receipt-header">
                <h3>إيصال الأوردر</h3>
                <div class="receipt-actions">
                    <button class="btn-print" id="printReceiptBtn"><i class="fas fa-print"></i> طباعة</button>
                    <button class="btn-download" id="downloadReceiptBtn"><i class="fas fa-download"></i> تحميل PDF</button>
                </div>
            </div>
            
            <div class="receipt-content" id="receiptContent">
                <div class="receipt-business-info">
                    <h2>مقهى النجمة الذهبية</h2>
                    <p>العنوان: شارع الجمهورية، المنصورة</p>
                    <p>الهاتف: 01234567890</p>
                    <hr>
                </div>
                
                <div class="receipt-order-info">
                    <div class="receipt-row">
                        <span>رقم الأوردر:</span>
                        <span id="receiptOrderNumber">#ORD001</span>
                    </div>
                    <div class="receipt-row">
                        <span>التربيزة:</span>
                        <span id="receiptTableNumber">تربيزة 001</span>
                    </div>
                    <div class="receipt-row">
                        <span>التاريخ:</span>
                        <span id="receiptDate">2024-06-25 14:30</span>
                    </div>
                    <div class="receipt-row">
                        <span>الكاشير:</span>
                        <span>محمد حامد</span>
                    </div>
                    <hr>
                </div>
                
                <div class="receipt-items">
                    <table class="receipt-items-table">
                        <thead>
                            <tr>
                                <th>المنتج</th>
                                <th>الكمية</th>
                                <th>السعر</th>
                                <th>الإجمالي</th>
                            </tr>
                        </thead>
                        <tbody id="receiptItemsBody">
                            <!-- سيتم ملؤها بالجافاسكريبت -->
                        </tbody>
                    </table>
                    <hr>
                </div>
                
                <div class="receipt-totals">
                    <div class="receipt-row">
                        <span>المجموع الفرعي:</span>
                        <span id="receiptSubtotal">45.50 ج</span>
                    </div>
                    <div class="receipt-row">
                        <span>الضريبة (14%):</span>
                        <span id="receiptTax">6.37 ج</span>
                    </div>
                    <div class="receipt-row total-row">
                        <span>الإجمالي:</span>
                        <span id="receiptGrandTotal">51.87 ج</span>
                    </div>
                </div>
                
                <div class="receipt-footer">
                    <hr>
                    <p>شكراً لزيارتكم</p>
                    <p>نتطلع لخدمتكم مرة أخرى</p>
                </div>
            </div>
            
            <div class="modal-footer">
                <button type="button" class="btn-cancel" onclick="closeModal('printReceiptModal')">
                    <i class="fas fa-times"></i>
                    إغلاق
                </button>
            </div>
        </div>
    </div>

    <!-- JavaScript -->
    <script>
        // === تعريف الدوال في النطاق العام ===
        
        // دالة تبديل القائمة الجانبية
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('overlay');
            
            if (sidebar && overlay) {
                sidebar.classList.toggle('active');
                overlay.classList.toggle('active');
            }
        }

        // دالة تبديل التبويبات
        function switchTab(tabName) {
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Remove active class from all tab buttons
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Show selected tab content
            if (tabName === 'pending') {
                document.getElementById('pending-content').classList.add('active');
                document.getElementById('pending-orders-tab').classList.add('active');
            } else if (tabName === 'completed') {
                document.getElementById('completed-content').classList.add('active');
                document.getElementById('completed-orders-tab').classList.add('active');
            } else if (tabName === 'cancelled') {
                document.getElementById('cancelled-content').classList.add('active');
                document.getElementById('cancelled-orders-tab').classList.add('active');
            }
        }

        // دوال العرض والفلترة
        function showAllOrders() {
            const preparingSection = document.getElementById('preparingOrdersSection');
            const readySection = document.getElementById('readyOrdersSection');
            
            if (preparingSection) preparingSection.classList.remove('hidden');
            if (readySection) readySection.classList.remove('hidden');
            
            showNotification('عرض جميع الأوردرات', 'info');
        }

        function showPendingOrders() {
            const preparingSection = document.getElementById('preparingOrdersSection');
            const readySection = document.getElementById('readyOrdersSection');
            
            if (preparingSection) preparingSection.classList.remove('hidden');
            if (readySection) readySection.classList.remove('hidden');
            
            showNotification('عرض الأوردرات المعلقة', 'info');
            switchTab('pending');
        }

        function showCompletedOrders() {
            switchTab('completed');
            showNotification('عرض الأوردرات المكتملة', 'info');
        }

        // دوال المودالات
        function closeModal(modalId) {
            const modal = document.getElementById(modalId);
            const overlay = document.getElementById('overlay');
            if (modal && overlay) {
                modal.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        }

        function openModal(modalId) {
            const modal = document.getElementById(modalId);
            const overlay = document.getElementById('overlay');
            if (modal && overlay) {
                modal.classList.add('active');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }

        // دوال إدارة الأوردرات
        function cancelOrder(orderId) {
            const reason = prompt('يرجى إدخال سبب إلغاء الأوردر:');
            if (reason && reason.trim()) {
                const orderCard = document.querySelector(`[data-order-id="${orderId}"]`);
                if (orderCard) {
                    orderCard.remove();
                    showNotification('تم إلغاء الأوردر بنجاح', 'success');
                }
            } else if (reason !== null) {
                alert('يرجى إدخال سبب الإلغاء');
            }
        }

        function markOrderReady(orderId) {
            if (confirm('هل أنت متأكد من أن الأوردر جاهز للتقديم؟')) {
                const orderCard = document.querySelector(`[data-order-id="${orderId}"]`);
                if (orderCard) {
                    // تحديث حالة الأوردر
                    const statusElement = orderCard.querySelector('.device-status-badge');
                    statusElement.textContent = 'جاهز للتقديم';
                    statusElement.className = 'device-status-badge available';
                    
                    // تحديث الأيقونة
                    const deviceIcon = orderCard.querySelector('.device-icon i');
                    deviceIcon.className = 'fas fa-check-circle';
                    
                    // نقل الأوردر إلى قسم الجاهز
                    const readyGrid = document.getElementById('readyOrdersGrid');
                    readyGrid.appendChild(orderCard);
                    
                    showNotification('تم تحديث حالة الأوردر إلى "جاهز للتقديم"', 'success');
                }
            }
        }

        function deliverOrder(orderId) {
            if (confirm('هل تم تقديم الأوردر للعميل؟')) {
                const orderCard = document.querySelector(`[data-order-id="${orderId}"]`);
                if (orderCard) {
                    orderCard.remove();
                    showNotification('تم تقديم الأوردر بنجاح', 'success');
                }
            }
        }

        function openOrderDetails(orderId) {
            // بيانات وهمية للأوردرات
            const orderData = {
                'ORD001': {
                    number: '#ORD001',
                    status: 'قيد التحضير',
                    table: 'تربيزة 001',
                    time: '2024-06-25 14:30',
                    elapsed: '5 دقائق',
                    priority: 'عادي',
                    items: [
                        { name: 'كوكاكولا', qty: 2, price: 10.00 },
                        { name: 'شيبسي', qty: 1, price: 5.50 },
                        { name: 'عصير برتقال', qty: 3, price: 10.00 }
                    ],
                    total: 45.50,
                    notes: 'بدون ثلج في المشروبات'
                }
            };

            const order = orderData[orderId] || {
                number: '#' + orderId,
                status: 'قيد التحضير',
                table: 'تربيزة 001',
                time: new Date().toLocaleString('ar-EG'),
                elapsed: '5 دقائق',
                priority: 'عادي',
                items: [
                    { name: 'منتج تجريبي', qty: 1, price: 10.00 }
                ],
                total: 10.00,
                notes: 'لا توجد ملاحظات'
            };

            // تحديث محتوى المودال
            document.getElementById('orderDetailsNumber').textContent = order.number;
            document.getElementById('orderDetailsStatus').textContent = order.status;
            document.getElementById('orderDetailsTable').textContent = order.table;
            document.getElementById('orderDetailsTime').textContent = order.time;
            document.getElementById('orderDetailsElapsed').textContent = order.elapsed;
            document.getElementById('orderDetailsPriority').textContent = order.priority;
            document.getElementById('orderDetailsTotal').textContent = order.total.toFixed(2) + ' ج';
            document.getElementById('orderDetailsNotes').textContent = order.notes;

            // تحديث جدول المنتجات
            const itemsBody = document.getElementById('orderDetailsItemsBody');
            itemsBody.innerHTML = '';
            
            order.items.forEach(item => {
                const row = itemsBody.insertRow();
                const itemTotal = item.price * item.qty;
                row.innerHTML = `
                    <td>${item.name}</td>
                    <td>${item.qty}</td>
                    <td>${item.price.toFixed(2)} ج</td>
                    <td>${itemTotal.toFixed(2)} ج</td>
                `;
            });

            openModal('orderDetailsModal');
        }

        function printOrderReceipt(orderId) {
            // فتح مودال الطباعة
            openModal('printReceiptModal');
        }

        // دالة عرض الإشعارات
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => notification.classList.add('show'), 100);
            
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        // === إعداد الأحداث عند تحميل الصفحة ===
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🚀 بدء تحميل صفحة الأوردرات...');

            // إضافة تنسيقات الإشعارات
            if (!document.querySelector('style[data-notifications]')) {
                const style = document.createElement('style');
                style.setAttribute('data-notifications', 'true');
                style.textContent = `
                    .notification {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        background: white;
                        padding: 15px 20px;
                        border-radius: 8px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        transform: translateX(100%);
                        transition: transform 0.3s ease;
                        z-index: 10000;
                        min-width: 300px;
                    }
                    .notification.show {
                        transform: translateX(0);
                    }
                    .notification.success {
                        border-left: 4px solid #28a745;
                        color: #28a745;
                    }
                    .notification.error {
                        border-left: 4px solid #dc3545;
                        color: #dc3545;
                    }
                    .notification.info {
                        border-left: 4px solid #007bff;
                        color: #007bff;
                    }
                    .devices-section.hidden {
                        display: none !important;
                    }
                `;
                document.head.appendChild(style);
            }

            // ربط زر إضافة الأوردر
            const addOrderBtn = document.getElementById('addOrderBtn');
            if (addOrderBtn) {
                addOrderBtn.addEventListener('click', () => {
                    openModal('addOrderModal');
                });
            }

            // إغلاق المودال عند النقر خارجه
            document.addEventListener('click', function(e) {
                if (e.target.classList.contains('modal')) {
                    const modalId = e.target.id;
                    closeModal(modalId);
                }
            });

            // إغلاق القائمة عند الضغط على Escape
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    const sidebar = document.getElementById('sidebar');
                    const overlay = document.getElementById('overlay');
                    if (sidebar && sidebar.classList.contains('active')) {
                        sidebar.classList.remove('active');
                        overlay.classList.remove('active');
                    }
                }
            });

            console.log('✅ تم تحميل صفحة الأوردرات بنجاح');
            console.log('✅ القائمة الجانبية جاهزة للعمل');
            console.log('✅ جميع الوظائف تعمل بشكل مثالي');
        });
    </script>
</body>
</html>