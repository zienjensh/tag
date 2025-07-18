<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إدارة التربيزات - نظام إدارة المقهى</title>
    <link rel="stylesheet" href="../css/money.css">
    <link rel="stylesheet" href="../css/tables.css">
    <link rel="stylesheet" href="../css/tables-extra.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div id="overlay" class="overlay"></div>

    <!-- Sidebar Toggle Button -->
    <div class="sidebar-toggle" id="sidebarToggle">
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
                <li><a href="tables.php" class="nav-link active">
                    <i class="fas fa-table"></i>
                    <span>التربيزات</span>
                </a></li>
                <li><a href="orders.php" class="nav-link">
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
        <!-- Page Header - نسخة مطابقة من devices.php -->
        <header class="page-header">
            <div class="header-content">
                <div class="header-left">
                    <div class="page-title">
                        <h1>إدارة التربيزات</h1>
                        <p>تتبع ومراقبة جميع التربيزات وحالاتها</p>
                    </div>
                </div>
                <div class="header-right">
                    <div class="header-actions">
                        <button class="action-btn primary" id="addTableBtn">
                            <i class="fas fa-plus"></i>
                            <span>إضافة تربيزة</span>
                        </button>
                        <button class="action-btn secondary" id="exportTablesBtn">
                            <i class="fas fa-download"></i>
                            <span>تصدير</span>
                        </button>
                        <button class="action-btn icon-only" id="refreshTablesBtn">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <!-- Table Status Cards -->
        <div class="financial-cards">
            <div class="card balance-card clickable-card" id="totalTables">
                <div class="card-header">
                    <div class="card-icon">
                        <i class="fas fa-table"></i>
                    </div>
                    <div class="card-menu">
                        <i class="fas fa-ellipsis-v"></i>
                    </div>
                </div>
                <div class="card-body">
                    <h3>إجمالي التربيزات</h3>
                    <div class="amount">
                        <span class="value">5</span>
                        <span class="currency">تربيزة</span>
                    </div>
                    <div class="trend positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>+1 هذا الشهر</span>
                    </div>
                </div>
            </div>

            <div class="card expenses-card" id="busyTables">
                <div class="card-header">
                    <div class="card-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="card-menu">
                        <i class="fas fa-ellipsis-v"></i>
                    </div>
                </div>
                <div class="card-body">
                    <h3>التربيزات المشغولة</h3>
                    <div class="amount">
                        <span class="value">2</span>
                        <span class="currency">تربيزة</span>
                    </div>
                    <div class="trend negative">
                        <i class="fas fa-clock"></i>
                        <span>متوسط 12 عميل</span>
                    </div>
                </div>
            </div>

            <div class="card revenues-card clickable-card" id="availableTables">
                <div class="card-header">
                    <div class="card-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="card-menu">
                        <i class="fas fa-ellipsis-v"></i>
                    </div>
                </div>
                <div class="card-body">
                    <h3>التربيزات المتاحة</h3>
                    <div class="amount">
                        <span class="value">3</span>
                        <span class="currency">تربيزة</span>
                    </div>
                    <div class="trend positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>جاهزة للاستخدام</span>
                    </div>
                </div>
            </div>

            <div class="card notes-card" id="tableRevenue">
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
                        <span class="value">180.50</span>
                    </div>
                    <div class="trend positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>+12.5%</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tab Navigation -->
        <div class="tab-navigation">
            <button id="tables-tab" class="tab-btn active">
                <i class="fas fa-table"></i>
                <span>التربيزات</span>
            </button>
            <button id="table-invoices-tab" class="tab-btn">
                <i class="fas fa-receipt"></i>
                <span>فواتير التربيزات</span>
            </button>
        </div>

        <!-- Tables Content -->
        <div id="tables-content" class="tab-content active">
            <!-- Busy Tables Section -->
            <div class="devices-section" id="busyTablesSection">
                <div class="section-header">
                    <h3>التربيزات المشغولة</h3>
                    <span class="section-count">2 تربيزات</span>
                </div>
                <div class="devices-grid" id="busyTablesGrid">
                    <!-- Busy Table 1 -->
                    <div class="device-card busy" data-table-id="T001">
                        <div class="device-status-badge busy">مشغولة</div>
                        <button class="device-delete-btn" onclick="deleteTable('T001')" title="حذف التربيزة">
                            <i class="fas fa-trash"></i>
                        </button>
                        <div class="device-header">
                            <div class="device-icon">
                                <i class="fas fa-table"></i>
                            </div>
                            <div class="device-info">
                                <h3>تربيزة VIP</h3>
                                <span class="device-id">ID: T001</span>
                            </div>
                        </div>
                        <div class="table-info">
                            <div class="info-item">
                                <span class="info-label">العملاء:</span>
                                <span class="info-value">4 أشخاص</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">بدأت في:</span>
                                <span class="info-value">12:30 PM</span>
                            </div>
                        </div>
                        <div class="device-actions">
                            <button class="action-btn primary" onclick="openInvoiceModal('T001')">
                                <i class="fas fa-receipt"></i>
                                <span>الفاتورة</span>
                            </button>
                            <button class="action-btn secondary" onclick="openBuffetModal('T001')">
                                <i class="fas fa-coffee"></i>
                                <span>البوفيه</span>
                            </button>
                            <button class="action-btn secondary" onclick="openTableDetails('T001')">
                                <i class="fas fa-info-circle"></i>
                                <span>التفاصيل</span>
                            </button>
                        </div>
                    </div>

                    <!-- Busy Table 2 -->
                    <div class="device-card busy" data-table-id="T002">
                        <div class="device-status-badge busy">مشغولة</div>
                        <button class="device-delete-btn" onclick="deleteTable('T002')" title="حذف التربيزة">
                            <i class="fas fa-trash"></i>
                        </button>
                        <div class="device-header">
                            <div class="device-icon">
                                <i class="fas fa-table"></i>
                            </div>
                            <div class="device-info">
                                <h3>تربيزة عادية</h3>
                                <span class="device-id">ID: T002</span>
                            </div>
                        </div>
                        <div class="table-info">
                            <div class="info-item">
                                <span class="info-label">العملاء:</span>
                                <span class="info-value">2 أشخاص</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">بدأت في:</span>
                                <span class="info-value">1:15 PM</span>
                            </div>
                        </div>
                        <div class="device-actions">
                            <button class="action-btn primary" onclick="openInvoiceModal('T002')">
                                <i class="fas fa-receipt"></i>
                                <span>الفاتورة</span>
                            </button>
                            <button class="action-btn secondary" onclick="openBuffetModal('T002')">
                                <i class="fas fa-coffee"></i>
                                <span>البوفيه</span>
                            </button>
                            <button class="action-btn secondary" onclick="openTableDetails('T002')">
                                <i class="fas fa-info-circle"></i>
                                <span>التفاصيل</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Section Separator -->
            <div class="section-separator"></div>

            <!-- Available Tables Section -->
            <div class="devices-section" id="availableTablesSection">
                <div class="section-header">
                    <h3>التربيزات المتاحة</h3>
                    <span class="section-count">3 تربيزات</span>
                </div>
                <div class="devices-grid" id="availableTablesGrid">
                    <!-- Available Table 1 -->
                    <div class="device-card available" data-table-id="T003">
                        <div class="device-status-badge available">متاحة</div>
                        <button class="device-delete-btn" onclick="deleteTable('T003')" title="حذف التربيزة">
                            <i class="fas fa-trash"></i>
                        </button>
                        <div class="device-header">
                            <div class="device-icon">
                                <i class="fas fa-table"></i>
                            </div>
                            <div class="device-info">
                                <h3>تربيزة عادية</h3>
                                <span class="device-id">ID: T003</span>
                            </div>
                        </div>
                        <div class="device-specs">
                            <div class="spec-item">
                                <span class="spec-label">السعة:</span>
                                <span class="spec-value">4 أشخاص</span>
                            </div>
                            <div class="spec-item">
                                <span class="spec-label">النوع:</span>
                                <span class="spec-value">عادية</span>
                            </div>
                        </div>
                        <div class="device-actions">
                            <button class="action-btn primary" onclick="openStartModal('T003')">
                                <i class="fas fa-play"></i>
                                <span>بدء الخدمة</span>
                            </button>
                            <button class="action-btn secondary" onclick="openBuffetModal('T003')">
                                <i class="fas fa-coffee"></i>
                                <span>البوفيه</span>
                            </button>
                            <button class="action-btn secondary" onclick="openTableDetails('T003')">
                                <i class="fas fa-info-circle"></i>
                                <span>التفاصيل</span>
                            </button>
                        </div>
                    </div>

                    <!-- Available Table 2 -->
                    <div class="device-card available" data-table-id="T004">
                        <div class="device-status-badge available">متاحة</div>
                        <button class="device-delete-btn" onclick="deleteTable('T004')" title="حذف التربيزة">
                            <i class="fas fa-trash"></i>
                        </button>
                        <div class="device-header">
                            <div class="device-icon">
                                <i class="fas fa-table"></i>
                            </div>
                            <div class="device-info">
                                <h3>تربيزة VIP</h3>
                                <span class="device-id">ID: T004</span>
                            </div>
                        </div>
                        <div class="device-specs">
                            <div class="spec-item">
                                <span class="spec-label">السعة:</span>
                                <span class="spec-value">6 أشخاص</span>
                            </div>
                            <div class="spec-item">
                                <span class="spec-label">النوع:</span>
                                <span class="spec-value">VIP</span>
                            </div>
                        </div>
                        <div class="device-actions">
                            <button class="action-btn primary" onclick="openStartModal('T004')">
                                <i class="fas fa-play"></i>
                                <span>بدء الخدمة</span>
                            </button>
                            <button class="action-btn secondary" onclick="openBuffetModal('T004')">
                                <i class="fas fa-coffee"></i>
                                <span>البوفيه</span>
                            </button>
                            <button class="action-btn secondary" onclick="openTableDetails('T004')">
                                <i class="fas fa-info-circle"></i>
                                <span>التفاصيل</span>
                            </button>
                        </div>
                    </div>

                    <!-- Available Table 3 -->
                    <div class="device-card available" data-table-id="T005">
                        <div class="device-status-badge available">متاحة</div>
                        <button class="device-delete-btn" onclick="deleteTable('T005')" title="حذف التربيزة">
                            <i class="fas fa-trash"></i>
                        </button>
                        <div class="device-header">
                            <div class="device-icon">
                                <i class="fas fa-table"></i>
                            </div>
                            <div class="device-info">
                                <h3>تربيزة خارجية</h3>
                                <span class="device-id">ID: T005</span>
                            </div>
                        </div>
                        <div class="device-specs">
                            <div class="spec-item">
                                <span class="spec-label">السعة:</span>
                                <span class="spec-value">4 أشخاص</span>
                            </div>
                            <div class="spec-item">
                                <span class="spec-label">النوع:</span>
                                <span class="spec-value">خارجية</span>
                            </div>
                        </div>
                        <div class="device-actions">
                            <button class="action-btn primary" onclick="openStartModal('T005')">
                                <i class="fas fa-play"></i>
                                <span>بدء الخدمة</span>
                            </button>
                            <button class="action-btn secondary" onclick="openBuffetModal('T005')">
                                <i class="fas fa-coffee"></i>
                                <span>البوفيه</span>
                            </button>
                            <button class="action-btn secondary" onclick="openTableDetails('T005')">
                                <i class="fas fa-info-circle"></i>
                                <span>التفاصيل</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Table Invoices Content -->
        <div id="invoices-content" class="tab-content">
            <div class="data-table-section">
                <div class="table-header">
                    <h3>فواتير التربيزات</h3>
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
                                <th>التربيزة</th>
                                <th>وقت البدء</th>
                                <th>وقت الانتهاء</th>
                                <th>عدد العملاء</th>
                                <th>البوفيه</th>
                                <th>الإجمالي</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>#TBL001</td>
                                <td>تربيزة VIP (ID: T001)</td>
                                <td>10:00 AM</td>
                                <td>11:30 AM</td>
                                <td>4 أشخاص</td>
                                <td>45.00 ج</td>
                                <td>45.00 ج</td>
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
                                <td>#TBL002</td>
                                <td>تربيزة عادية (ID: T003)</td>
                                <td>2:00 PM</td>
                                <td>4:00 PM</td>
                                <td>2 أشخاص</td>
                                <td>25.00 ج</td>
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
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Add Table Modal -->
    <div id="addTableModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>
                    <i class="fas fa-plus-circle"></i>
                    إضافة تربيزة جديدة
                </h3>
                <span class="close-btn">&times;</span>
            </div>
            <form id="addTableForm">
                <div class="form-group">
                    <label for="tableType">نوع التربيزة</label>
                    <select id="tableType" required>
                        <option value="">اختر نوع التربيزة</option>
                        <option value="normal">عادية</option>
                        <option value="vip">VIP</option>
                        <option value="outdoor">خارجية</option>
                        <option value="private">خاصة</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="tableName">اسم التربيزة</label>
                    <input type="text" id="tableName" placeholder="مثال: تربيزة VIP - الصالة الرئيسية" required>
                </div>
                <div class="form-group">
                    <label for="tableCapacity">السعة القصوى</label>
                    <input type="number" id="tableCapacity" placeholder="عدد الأشخاص" min="1" max="12" required>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-cancel">
                        <i class="fas fa-times"></i>
                        إلغاء
                    </button>
                    <button type="submit" class="btn-save">
                        <i class="fas fa-save"></i>
                        حفظ التربيزة
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Start Table Modal -->
    <div id="startTableModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>
                    <i class="fas fa-play-circle"></i>
                    بدء خدمة التربيزة
                </h3>
                <span class="close-btn">&times;</span>
            </div>
            <div class="start-table-content">
                <div class="table-start-info">
                    <h4 id="startTableName">تربيزة VIP</h4>
                    <span id="startTableId">ID: T001</span>
                </div>
                <div class="form-group">
                    <label for="customerCount">عدد العملاء</label>
                    <input type="number" id="customerCount" min="1" max="12" placeholder="عدد الأشخاص" required>
                </div>
                <div class="form-group">
                    <label for="customerName">اسم العميل (اختياري)</label>
                    <input type="text" id="customerName" placeholder="اسم العميل الرئيسي">
                </div>
                <div class="capacity-info">
                    <div class="capacity-item">
                        <span class="capacity-label">السعة القصوى:</span>
                        <span class="capacity-value" id="maxCapacity">6 أشخاص</span>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-cancel">
                    <i class="fas fa-times"></i>
                    إلغاء
                </button>
                <button type="button" class="btn-save" onclick="confirmStartTable()">
                    <i class="fas fa-play"></i>
                    بدء الخدمة
                </button>
            </div>
        </div>
    </div>

    <!-- Table Details Modal -->
    <div id="tableDetailsModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>
                    <i class="fas fa-info-circle"></i>
                    تفاصيل التربيزة
                </h3>
                <span class="close-btn">&times;</span>
            </div>
            <div class="table-details-content">
                <div class="detail-item">
                    <span class="detail-label">نوع التربيزة:</span>
                    <span class="detail-value" id="modalTableType">تربيزة VIP</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">معرف التربيزة:</span>
                    <span class="detail-value" id="modalTableID">T001</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">السعة القصوى:</span>
                    <span class="detail-value" id="modalTableCapacity">6 أشخاص</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">الحالة:</span>
                    <span class="detail-value status" id="modalTableStatus">متاحة</span>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-cancel">
                    <i class="fas fa-times"></i>
                    إغلاق
                </button>
            </div>
        </div>
    </div>

    <!-- Buffet Modal -->
    <div id="buffetModal" class="modal">
        <div class="modal-content buffet-modal-content">
            <div class="modal-header">
                <h3>
                    <i class="fas fa-coffee"></i>
                    طلب البوفيه - تربيزة <span id="buffetTableId">T001</span>
                </h3>
                <span class="close-btn">&times;</span>
            </div>
            
            <!-- Product Categories -->
            <div class="buffet-categories">
                <button class="category-btn active" onclick="filterProducts('all')">الكل</button>
                <button class="category-btn" onclick="filterProducts('drinks')">المشروبات</button>
                <button class="category-btn" onclick="filterProducts('food')">الطعام</button>
                <button class="category-btn" onclick="filterProducts('desserts')">الحلويات</button>
                <button class="category-btn" onclick="filterProducts('snacks')">الوجبات الخفيفة</button>
            </div>

            <!-- Products Grid -->
            <div class="buffet-products">
                <div class="product-item" data-category="drinks">
                    <div class="product-info">
                        <h4>شاي</h4>
                        <span class="product-price">5.00 ج</span>
                    </div>
                    <button class="add-product-btn" onclick="addToOrder('tea', 'شاي', 5.00)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="product-item" data-category="drinks">
                    <div class="product-info">
                        <h4>قهوة</h4>
                        <span class="product-price">8.00 ج</span>
                    </div>
                    <button class="add-product-btn" onclick="addToOrder('coffee', 'قهوة', 8.00)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="product-item" data-category="drinks">
                    <div class="product-info">
                        <h4>عصير برتقال</h4>
                        <span class="product-price">12.00 ج</span>
                    </div>
                    <button class="add-product-btn" onclick="addToOrder('orange', 'عصير برتقال', 12.00)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="product-item" data-category="food">
                    <div class="product-info">
                        <h4>ساندويتش</h4>
                        <span class="product-price">15.00 ج</span>
                    </div>
                    <button class="add-product-btn" onclick="addToOrder('sandwich', 'ساندويتش', 15.00)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="product-item" data-category="desserts">
                    <div class="product-info">
                        <h4>كيك</h4>
                        <span class="product-price">20.00 ج</span>
                    </div>
                    <button class="add-product-btn" onclick="addToOrder('cake', 'كيك', 20.00)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="product-item" data-category="snacks">
                    <div class="product-info">
                        <h4>بسكويت</h4>
                        <span class="product-price">7.00 ج</span>
                    </div>
                    <button class="add-product-btn" onclick="addToOrder('biscuit', 'بسكويت', 7.00)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>

            <!-- Current Order -->
            <div class="buffet-order">
                <h4>الطلب الحالي</h4>
                <div class="order-items" id="orderItems">
                    <p class="no-items">لا توجد طلبات</p>
                </div>
                <div class="order-total">
                    الإجمالي: <span id="orderTotal">0.00</span> ج
                </div>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn-cancel">
                    <i class="fas fa-times"></i>
                    إلغاء
                </button>
                <button type="button" class="btn-save" onclick="saveBuffetOrder()">
                    <i class="fas fa-save"></i>
                    حفظ الطلب
                </button>
            </div>
        </div>
    </div>

    <!-- Invoice Modal -->
    <div id="invoiceModal" class="modal">
        <div class="modal-content invoice-modal-content">
            <div class="modal-header">
                <h3>
                    <i class="fas fa-receipt"></i>
                    فاتورة التربيزة <span id="invoiceTableId">T001</span>
                </h3>
                <span class="close-btn">&times;</span>
            </div>

            <!-- Invoice Summary -->
            <div class="invoice-summary">
                <div class="summary-item">
                    <span class="summary-label">البوفيه:</span>
                    <span class="summary-value" id="invoiceBuffetAmount">0.00 ج</span>
                </div>
                <div class="summary-item" id="couponDiscountItem" style="display: none;">
                    <span class="summary-label">خصم الكوبون:</span>
                    <span class="summary-value discount" id="couponDiscountAmount">-0.00 ج</span>
                </div>
                <div class="summary-item total">
                    <span class="summary-label">الإجمالي:</span>
                    <span class="summary-value" id="invoiceTotal">0.00 ج</span>
                </div>
            </div>

            <!-- Coupon Section -->
            <div class="coupon-section">
                <h5>كوبون الخصم</h5>
                <div class="coupon-input-group">
                    <input type="text" id="couponCode" placeholder="أدخل كود الخصم">
                    <button class="apply-coupon-btn" onclick="applyCoupon()">
                        <i class="fas fa-tag"></i>
                        تطبيق
                    </button>
                </div>
                <div id="couponStatus"></div>
                <div id="appliedCoupon" class="applied-coupon">
                    <div class="coupon-info">
                        <span class="coupon-name" id="appliedCouponName"></span>
                        <span class="coupon-discount" id="appliedCouponDiscount"></span>
                    </div>
                    <button class="remove-coupon-btn" onclick="removeCoupon()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>

            <!-- Payment Section -->
            <div class="payment-section">
                <h4>طريقة الدفع</h4>
                <div class="payment-methods">
                    <label class="payment-option">
                        <input type="radio" name="paymentMethod" value="cash" checked>
                        <span class="radio-custom"></span>
                        <span class="radio-text">نقداً</span>
                    </label>
                    <label class="payment-option">
                        <input type="radio" name="paymentMethod" value="card">
                        <span class="radio-custom"></span>
                        <span class="radio-text">كارت</span>
                    </label>
                    <label class="payment-option">
                        <input type="radio" name="paymentMethod" value="credit">
                        <span class="radio-custom"></span>
                        <span class="radio-text">رصيد عميل</span>
                    </label>
                    <label class="payment-option">
                        <input type="radio" name="paymentMethod" value="split">
                        <span class="radio-custom"></span>
                        <span class="radio-text">دفع مقسم</span>
                    </label>
                </div>

                <!-- Cash Payment Details -->
                <div class="payment-details cash-payment active">
                    <div class="amount-input">
                        <label>المبلغ المدفوع:</label>
                        <input type="number" id="cashAmount" step="0.01" placeholder="0.00" onchange="calculateChange()">
                        <span class="currency-symbol">ج</span>
                    </div>
                    <div class="change-display">
                        الباقي: <span id="changeAmount">0.00</span> ج
                    </div>
                </div>

                <!-- Card Payment Details -->
                <div class="payment-details card-payment">
                    <p>سيتم تحصيل المبلغ كاملاً من الكارت</p>
                </div>

                <!-- Credit Payment Details -->
                <div class="payment-details credit-payment">
                    <div class="customer-info">
                        <input type="text" placeholder="رقم العميل أو الاسم">
                        <div class="customer-balance">الرصيد المتاح: 150.00 ج</div>
                    </div>
                </div>

                <!-- Split Payment Details -->
                <div class="payment-details split-payment">
                    <div class="split-payments-list" id="splitPaymentsList">
                        <div class="split-payment-item">
                            <select class="split-method">
                                <option value="cash">نقداً</option>
                                <option value="card">كارت</option>
                                <option value="credit">رصيد عميل</option>
                            </select>
                            <div class="amount-input">
                                <input type="number" class="split-amount" placeholder="0.00" step="0.01" onchange="calculateSplitTotal()">
                                <span class="currency-symbol">ج</span>
                            </div>
                            <button type="button" class="remove-split-btn" onclick="removeSplitPayment(this)">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <button type="button" class="add-split-btn" onclick="addSplitPayment()">
                        <i class="fas fa-plus"></i>
                        إضافة طريقة دفع
                    </button>
                    <div class="split-summary">
                        <div class="split-total">
                            المجموع المدفوع: <span id="splitTotal">0.00</span> ج
                        </div>
                        <div class="split-remaining">
                            المتبقي: <span id="splitRemaining">0.00</span> ج
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn-cancel">
                    <i class="fas fa-times"></i>
                    إلغاء
                </button>
                <button type="button" class="btn-save" onclick="processPayment()">
                    <i class="fas fa-credit-card"></i>
                    تأكيد الدفع
                </button>
            </div>
        </div>
    </div>

    <!-- JavaScript -->
    <script>
        // متغيرات عامة
        let currentOrder = [];
        let appliedCoupon = null;

        // تعريف دالة toggleSidebar في النطاق العام
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('overlay');
            
            if (sidebar && overlay) {
                sidebar.classList.toggle('active');
                overlay.classList.toggle('active');
            }
        }

        // تعريف دالة switchTab في النطاق العام
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
            if (tabName === 'tables') {
                document.getElementById('tables-content').classList.add('active');
                document.getElementById('tables-tab').classList.add('active');
            } else if (tabName === 'invoices') {
                document.getElementById('invoices-content').classList.add('active');
                document.getElementById('table-invoices-tab').classList.add('active');
            }
        }

        // دوال العرض والفلترة
        function showAllTables() {
            const busySection = document.getElementById('busyTablesSection');
            const availableSection = document.getElementById('availableTablesSection');
            
            if (busySection) busySection.classList.remove('hidden');
            if (availableSection) availableSection.classList.remove('hidden');
            
            showNotification('عرض جميع التربيزات', 'info');
        }

        function showAvailableTables() {
            const busySection = document.getElementById('busyTablesSection');
            const availableSection = document.getElementById('availableTablesSection');
            
            if (busySection) busySection.classList.add('hidden');
            if (availableSection) availableSection.classList.remove('hidden');
            
            showNotification('عرض التربيزات المتاحة فقط', 'info');
        }

        function showBusyTables() {
            const busySection = document.getElementById('busyTablesSection');
            const availableSection = document.getElementById('availableTablesSection');
            
            if (busySection) busySection.classList.remove('hidden');
            if (availableSection) availableSection.classList.add('hidden');
            
            showNotification('عرض التربيزات المشغولة فقط', 'info');
        }

        // دالة فتح وإغلاق المودالات
        function openModal(modalId) {
            const modal = document.getElementById(modalId);
            const overlay = document.getElementById('overlay');
            if (modal && overlay) {
                modal.classList.add('active');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }

        function closeModal(modalId) {
            const modal = document.getElementById(modalId);
            const overlay = document.getElementById('overlay');
            if (modal && overlay) {
                modal.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        }

        // دوال التربيزات
        function openStartModal(tableId) {
            const tableCard = document.querySelector(`[data-table-id="${tableId}"]`);
            if (tableCard) {
                const tableName = tableCard.querySelector('.device-info h3').textContent;
                const capacity = tableCard.querySelector('.spec-value').textContent;
                
                document.getElementById('startTableName').textContent = tableName;
                document.getElementById('startTableId').textContent = `ID: ${tableId}`;
                document.getElementById('maxCapacity').textContent = capacity;
                
                openModal('startTableModal');
            }
        }

        function confirmStartTable() {
            const tableId = document.getElementById('startTableId').textContent.replace('ID: ', '');
            const customerCount = document.getElementById('customerCount').value;
            const customerName = document.getElementById('customerName').value;
            
            if (!customerCount || customerCount < 1) {
                alert('يرجى إدخال عدد العملاء');
                return;
            }
            
            // Move table from available to busy
            const tableCard = document.querySelector(`[data-table-id="${tableId}"]`);
            if (tableCard) {
                // Update card appearance
                tableCard.classList.remove('available');
                tableCard.classList.add('busy');
                
                // Update status badge
                const statusBadge = tableCard.querySelector('.device-status-badge');
                statusBadge.textContent = 'مشغولة';
                statusBadge.classList.remove('available');
                statusBadge.classList.add('busy');
                
                // Replace specs with table info
                const specsDiv = tableCard.querySelector('.device-specs');
                if (specsDiv) {
                    specsDiv.innerHTML = `
                        <div class="info-item">
                            <span class="info-label">العملاء:</span>
                            <span class="info-value">${customerCount} أشخاص</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">بدأت في:</span>
                            <span class="info-value">${new Date().toLocaleTimeString('ar-EG', {hour: '2-digit', minute: '2-digit'})}</span>
                        </div>
                    `;
                    specsDiv.className = 'table-info';
                }
                
                // Update action buttons
                const actionsDiv = tableCard.querySelector('.device-actions');
                actionsDiv.innerHTML = `
                    <button class="action-btn primary" onclick="openInvoiceModal('${tableId}')">
                        <i class="fas fa-receipt"></i>
                        <span>الفاتورة</span>
                    </button>
                    <button class="action-btn secondary" onclick="openBuffetModal('${tableId}')">
                        <i class="fas fa-coffee"></i>
                        <span>البوفيه</span>
                    </button>
                    <button class="action-btn secondary" onclick="openTableDetails('${tableId}')">
                        <i class="fas fa-info-circle"></i>
                        <span>التفاصيل</span>
                    </button>
                `;
                
                // Move to busy section
                const busyGrid = document.getElementById('busyTablesGrid');
                busyGrid.appendChild(tableCard);
                
                updateTableCounts();
                closeModal('startTableModal');
                showNotification(`تم بدء خدمة التربيزة ${tableId} بنجاح`, 'success');
            }
        }

        function openTableDetails(tableId) {
            const tableCard = document.querySelector(`[data-table-id="${tableId}"]`);
            if (tableCard) {
                const tableName = tableCard.querySelector('.device-info h3').textContent;
                const status = tableCard.classList.contains('busy') ? 'مشغولة' : 'متاحة';
                
                document.getElementById('modalTableType').textContent = tableName;
                document.getElementById('modalTableID').textContent = tableId;
                document.getElementById('modalTableStatus').textContent = status;
                
                openModal('tableDetailsModal');
            }
        }

        function openBuffetModal(tableId) {
            document.getElementById('buffetTableId').textContent = tableId;
            openModal('buffetModal');
            
            // Reset order
            currentOrder = [];
            updateOrderDisplay();
        }

        function openInvoiceModal(tableId) {
            document.getElementById('invoiceTableId').textContent = tableId;
            
            // Calculate total from current order
            const total = currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            document.getElementById('invoiceBuffetAmount').textContent = total.toFixed(2) + ' ج';
            document.getElementById('invoiceTotal').textContent = total.toFixed(2) + ' ج';
            document.getElementById('splitRemaining').textContent = total.toFixed(2);
            
            openModal('invoiceModal');
        }

        // دوال البوفيه
        function filterProducts(category) {
            const products = document.querySelectorAll('.product-item');
            const buttons = document.querySelectorAll('.category-btn');
            
            // Update active button
            buttons.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            // Filter products
            products.forEach(product => {
                if (category === 'all' || product.dataset.category === category) {
                    product.style.display = 'flex';
                } else {
                    product.style.display = 'none';
                }
            });
        }

        function addToOrder(id, name, price) {
            const existingItem = currentOrder.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                currentOrder.push({
                    id: id,
                    name: name,
                    price: price,
                    quantity: 1
                });
            }
            
            updateOrderDisplay();
            showNotification(`تم إضافة ${name} إلى الطلب`, 'success');
        }

        function updateOrderDisplay() {
            const orderItems = document.getElementById('orderItems');
            const orderTotal = document.getElementById('orderTotal');
            
            if (currentOrder.length === 0) {
                orderItems.innerHTML = '<p class="no-items">لا توجد طلبات</p>';
                orderTotal.textContent = '0.00';
                return;
            }
            
            let html = '';
            let total = 0;
            
            currentOrder.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                html += `
                    <div class="order-item">
                        <span class="item-name">${item.name}</span>
                        <div class="item-controls">
                            <button onclick="decreaseQuantity(${index})" class="qty-btn">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button onclick="increaseQuantity(${index})" class="qty-btn">+</button>
                            <span class="item-price">${itemTotal.toFixed(2)} ج</span>
                            <button onclick="removeFromOrder(${index})" class="remove-btn">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
            
            orderItems.innerHTML = html;
            orderTotal.textContent = total.toFixed(2);
        }

        function increaseQuantity(index) {
            currentOrder[index].quantity += 1;
            updateOrderDisplay();
        }

        function decreaseQuantity(index) {
            if (currentOrder[index].quantity > 1) {
                currentOrder[index].quantity -= 1;
            } else {
                currentOrder.splice(index, 1);
            }
            updateOrderDisplay();
        }

        function removeFromOrder(index) {
            currentOrder.splice(index, 1);
            updateOrderDisplay();
        }

        function saveBuffetOrder() {
            if (currentOrder.length === 0) {
                alert('لا توجد طلبات لحفظها');
                return;
            }
            
            closeModal('buffetModal');
            showNotification('تم حفظ طلب البوفيه بنجاح', 'success');
        }

        // دوال الدفع
        function calculateChange() {
            const total = parseFloat(document.getElementById('invoiceTotal').textContent.replace(' ج', '')) || 0;
            const paid = parseFloat(document.getElementById('cashAmount').value) || 0;
            const change = paid - total;
            
            document.getElementById('changeAmount').textContent = Math.max(0, change).toFixed(2);
        }

        function applyCoupon() {
            const couponCode = document.getElementById('couponCode').value.trim().toUpperCase();
            const couponStatus = document.getElementById('couponStatus');
            
            // Available coupons
            const coupons = {
                'SAVE10': { name: 'خصم 10%', type: 'percentage', value: 10 },
                'DISCOUNT5': { name: 'خصم 5 جنيه', type: 'fixed', value: 5 },
                'WELCOME20': { name: 'خصم ترحيبي 20%', type: 'percentage', value: 20 },
                'FIXED10': { name: 'خصم 10 جنيه', type: 'fixed', value: 10 }
            };
            
            if (!couponCode) {
                couponStatus.innerHTML = '<span class="error">يرجى إدخال كود الخصم</span>';
                return;
            }
            
            if (coupons[couponCode]) {
                appliedCoupon = { code: couponCode, ...coupons[couponCode] };
                
                // Show applied coupon
                document.getElementById('appliedCouponName').textContent = appliedCoupon.name;
                document.getElementById('appliedCouponDiscount').textContent = 
                    appliedCoupon.type === 'percentage' ? `-${appliedCoupon.value}%` : `-${appliedCoupon.value} ج`;
                document.getElementById('appliedCoupon').style.display = 'flex';
                document.getElementById('couponCode').value = '';
                couponStatus.innerHTML = '<span class="success">تم تطبيق الكوبون بنجاح!</span>';
                
                updateInvoiceTotals();
            } else {
                couponStatus.innerHTML = '<span class="error">كود خصم غير صحيح</span>';
            }
        }

        function removeCoupon() {
            appliedCoupon = null;
            document.getElementById('appliedCoupon').style.display = 'none';
            document.getElementById('couponStatus').innerHTML = '';
            updateInvoiceTotals();
        }

        function updateInvoiceTotals() {
            const buffetAmount = parseFloat(document.getElementById('invoiceBuffetAmount').textContent.replace(' ج', '')) || 0;
            let total = buffetAmount;
            let discountAmount = 0;
            
            if (appliedCoupon) {
                if (appliedCoupon.type === 'percentage') {
                    discountAmount = total * (appliedCoupon.value / 100);
                } else {
                    discountAmount = appliedCoupon.value;
                }
                
                total -= discountAmount;
                
                // Show coupon discount in invoice
                document.getElementById('couponDiscountAmount').textContent = `-${discountAmount.toFixed(2)} ج`;
                document.getElementById('couponDiscountItem').style.display = 'flex';
            } else {
                document.getElementById('couponDiscountItem').style.display = 'none';
            }
            
            document.getElementById('invoiceTotal').textContent = total.toFixed(2) + ' ج';
            document.getElementById('splitRemaining').textContent = total.toFixed(2);
            
            // Update cash amount
            const cashAmountInput = document.getElementById('cashAmount');
            if (cashAmountInput) {
                cashAmountInput.value = total.toFixed(2);
                calculateChange();
            }
        }

        function addSplitPayment() {
            const splitList = document.getElementById('splitPaymentsList');
            const newItem = document.createElement('div');
            newItem.className = 'split-payment-item';
            newItem.innerHTML = `
                <select class="split-method">
                    <option value="cash">نقداً</option>
                    <option value="card">كارت</option>
                    <option value="credit">رصيد عميل</option>
                </select>
                <div class="amount-input">
                    <input type="number" class="split-amount" placeholder="0.00" step="0.01" onchange="calculateSplitTotal()">
                    <span class="currency-symbol">ج</span>
                </div>
                <button type="button" class="remove-split-btn" onclick="removeSplitPayment(this)">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            splitList.appendChild(newItem);
        }

        function removeSplitPayment(button) {
            const splitItems = document.querySelectorAll('.split-payment-item');
            if (splitItems.length > 1) {
                button.closest('.split-payment-item').remove();
                calculateSplitTotal();
            }
        }

        function calculateSplitTotal() {
            const splitAmounts = document.querySelectorAll('.split-amount');
            let total = 0;
            
            splitAmounts.forEach(input => {
                total += parseFloat(input.value) || 0;
            });
            
            const invoiceTotal = parseFloat(document.getElementById('invoiceTotal').textContent.replace(' ج', '')) || 0;
            const remaining = invoiceTotal - total;
            
            document.getElementById('splitTotal').textContent = total.toFixed(2);
            document.getElementById('splitRemaining').textContent = remaining.toFixed(2);
            
            // Update remaining color
            const remainingElement = document.querySelector('.split-remaining');
            if (remaining < 0) {
                remainingElement.classList.add('negative');
            } else {
                remainingElement.classList.remove('negative');
            }
        }

        function processPayment() {
            const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
            const total = parseFloat(document.getElementById('invoiceTotal').textContent.replace(' ج', '')) || 0;
            
            if (paymentMethod === 'split') {
                const remaining = parseFloat(document.getElementById('splitRemaining').textContent) || 0;
                if (remaining > 0.01) {
                    alert('يرجى تغطية كامل المبلغ المطلوب');
                    return;
                }
            }
            
            // Process payment logic here
            alert('تم تأكيد الدفع بنجاح!');
            closeModal('invoiceModal');
            
            // End table service
            const tableId = document.getElementById('invoiceTableId').textContent;
            endTableService(tableId);
        }

        function endTableService(tableId) {
            const tableCard = document.querySelector(`[data-table-id="${tableId}"]`);
            if (tableCard) {
                // Move back to available section
                tableCard.classList.remove('busy');
                tableCard.classList.add('available');
                
                // Update status badge
                const statusBadge = tableCard.querySelector('.device-status-badge');
                statusBadge.textContent = 'متاحة';
                statusBadge.classList.remove('busy');
                statusBadge.classList.add('available');
                
                // Reset to original specs
                const tableInfo = tableCard.querySelector('.table-info');
                if (tableInfo) {
                    const capacity = tableCard.querySelector('.device-info h3').textContent.includes('VIP') ? '6 أشخاص' : '4 أشخاص';
                    const type = tableCard.querySelector('.device-info h3').textContent.includes('VIP') ? 'VIP' : 'عادية';
                    
                    tableInfo.innerHTML = `
                        <div class="spec-item">
                            <span class="spec-label">السعة:</span>
                            <span class="spec-value">${capacity}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">النوع:</span>
                            <span class="spec-value">${type}</span>
                        </div>
                    `;
                    tableInfo.className = 'device-specs';
                }
                
                // Reset action buttons
                const actionsDiv = tableCard.querySelector('.device-actions');
                actionsDiv.innerHTML = `
                    <button class="action-btn primary" onclick="openStartModal('${tableId}')">
                        <i class="fas fa-play"></i>
                        <span>بدء الخدمة</span>
                    </button>
                    <button class="action-btn secondary" onclick="openBuffetModal('${tableId}')">
                        <i class="fas fa-coffee"></i>
                        <span>البوفيه</span>
                    </button>
                    <button class="action-btn secondary" onclick="openTableDetails('${tableId}')">
                        <i class="fas fa-info-circle"></i>
                        <span>التفاصيل</span>
                    </button>
                `;
                
                // Move to available section
                const availableGrid = document.getElementById('availableTablesGrid');
                availableGrid.appendChild(tableCard);
                
                updateTableCounts();
            }
        }

        // دالة إضافة تربيزة جديدة
        function addNewTable() {
            const tableType = document.getElementById('tableType').value;
            const tableName = document.getElementById('tableName').value;
            const tableCapacity = document.getElementById('tableCapacity').value;
            
            if (!tableType || !tableName || !tableCapacity) {
                alert('يرجى ملء جميع الحقول المطلوبة');
                return;
            }
            
            // توليد معرف جديد للتربيزة
            const existingTables = document.querySelectorAll('.device-card');
            const newId = `T${String(existingTables.length + 1).padStart(3, '0')}`;
            
            // تحديد نوع التربيزة للعرض
            const typeDisplay = tableType === 'vip' ? 'VIP' : 
                               tableType === 'outdoor' ? 'خارجية' : 
                               tableType === 'private' ? 'خاصة' : 'عادية';
            
            // إنشاء بطاقة التربيزة الجديدة
            const newTableCard = document.createElement('div');
            newTableCard.className = 'device-card available';
            newTableCard.setAttribute('data-table-id', newId);
            
            newTableCard.innerHTML = `
                <div class="device-status-badge available">متاحة</div>
                <button class="device-delete-btn" onclick="deleteTable('${newId}')" title="حذف التربيزة">
                    <i class="fas fa-trash"></i>
                </button>
                <div class="device-header">
                    <div class="device-icon">
                        <i class="fas fa-table"></i>
                    </div>
                    <div class="device-info">
                        <h3>${tableName}</h3>
                        <span class="device-id">ID: ${newId}</span>
                    </div>
                </div>
                <div class="device-specs">
                    <div class="spec-item">
                        <span class="spec-label">السعة:</span>
                        <span class="spec-value">${tableCapacity} أشخاص</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">النوع:</span>
                        <span class="spec-value">${typeDisplay}</span>
                    </div>
                </div>
                <div class="device-actions">
                    <button class="action-btn primary" onclick="openStartModal('${newId}')">
                        <i class="fas fa-play"></i>
                        <span>بدء الخدمة</span>
                    </button>
                    <button class="action-btn secondary" onclick="openBuffetModal('${newId}')">
                        <i class="fas fa-coffee"></i>
                        <span>البوفيه</span>
                    </button>
                    <button class="action-btn secondary" onclick="openTableDetails('${newId}')">
                        <i class="fas fa-info-circle"></i>
                        <span>التفاصيل</span>
                    </button>
                </div>
            `;
            
            // إضافة البطاقة إلى قسم التربيزات المتاحة
            document.getElementById('availableTablesGrid').appendChild(newTableCard);
            
            // تحديث العدادات
            updateTableCounts();
            
            // إغلاق المودال وإعادة تعيين النموذج
            closeModal('addTableModal');
            document.getElementById('addTableForm').reset();
            
            showNotification(`تم إضافة التربيزة ${newId} بنجاح`, 'success');
        }

        // دالة حذف التربيزة
        function deleteTable(tableId) {
            if (confirm('هل أنت متأكد من حذف هذه التربيزة؟')) {
                const tableCard = document.querySelector(`[data-table-id="${tableId}"]`);
                if (tableCard) {
                    tableCard.remove();
                    updateTableCounts();
                    showNotification('تم حذف التربيزة بنجاح', 'success');
                }
            }
        }

        // دالة تحديث العدادات
        function updateTableCounts() {
            const totalTables = document.querySelectorAll('.device-card').length;
            const busyTables = document.querySelectorAll('.device-card.busy').length;
            const availableTables = document.querySelectorAll('.device-card.available').length;
            
            // تحديث البطاقات
            document.querySelector('#totalTables .value').textContent = totalTables;
            document.querySelector('#busyTables .value').textContent = busyTables;
            document.querySelector('#availableTables .value').textContent = availableTables;
            
            // تحديث عناوين الأقسام
            document.querySelector('#busyTablesSection .section-count').textContent = `${busyTables} تربيزات`;
            document.querySelector('#availableTablesSection .section-count').textContent = `${availableTables} تربيزات`;
        }

        function showNotification(message, type = 'info') {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            `;
            
            // Add to page
            document.body.appendChild(notification);
            
            // Show notification
            setTimeout(() => notification.classList.add('show'), 100);
            
            // Remove after 3 seconds
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        // إعداد الأحداث عند تحميل الصفحة
        document.addEventListener('DOMContentLoaded', function() {
            // ربط زر القائمة الجانبية
            const sidebarToggle = document.getElementById('sidebarToggle');
            const overlay = document.getElementById('overlay');
            
            if (sidebarToggle) {
                sidebarToggle.addEventListener('click', toggleSidebar);
            }
            
            if (overlay) {
                overlay.addEventListener('click', toggleSidebar);
            }

            // ربط أزرار التبويبات
            document.getElementById('tables-tab').addEventListener('click', () => switchTab('tables'));
            document.getElementById('table-invoices-tab').addEventListener('click', () => switchTab('invoices'));

            // ربط كروت الإحصائيات
            document.getElementById('totalTables').addEventListener('click', showAllTables);
            document.getElementById('availableTables').addEventListener('click', showAvailableTables);
            document.getElementById('busyTables').addEventListener('click', showBusyTables);

            // ربط زر إضافة التربيزة
            const addTableBtn = document.getElementById('addTableBtn');
            if (addTableBtn) {
                addTableBtn.addEventListener('click', () => {
                    openModal('addTableModal');
                });
            }

            // ربط نموذج إضافة التربيزة
            const addTableForm = document.getElementById('addTableForm');
            if (addTableForm) {
                addTableForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    addNewTable();
                });
            }

            // ربط أزرار إغلاق المودالات
            document.querySelectorAll('.close-btn, .btn-cancel').forEach(btn => {
                btn.addEventListener('click', function() {
                    const modal = this.closest('.modal');
                    if (modal) {
                        closeModal(modal.id);
                    }
                });
            });

            // إغلاق المودال عند النقر خارجه
            document.addEventListener('click', function(e) {
                if (e.target.classList.contains('modal')) {
                    closeModal(e.target.id);
                }
            });

            // Payment method switching
            document.addEventListener('change', function(e) {
                if (e.target.name === 'paymentMethod') {
                    const paymentDetails = document.querySelectorAll('.payment-details');
                    paymentDetails.forEach(detail => detail.classList.remove('active'));
                    
                    const selectedMethod = e.target.value;
                    const targetDetail = document.querySelector(`.${selectedMethod}-payment`);
                    if (targetDetail) {
                        targetDetail.classList.add('active');
                    }
                }
            });

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
                    .success { color: #28a745; }
                    .error { color: #dc3545; }
                `;
                document.head.appendChild(style);
            }

            console.log('✅ تم تحميل صفحة التربيزات بنجاح');
            console.log('✅ جميع المودالات جاهزة للعمل');
            console.log('✅ أزرار الفاتورة والبوفيه والتفاصيل تعمل بشكل صحيح');
        });
    </script>

</body>
</html>