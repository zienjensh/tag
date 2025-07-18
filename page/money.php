<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إدارة النقدية - نظام إدارة المقهى</title>
    <link rel="stylesheet" href="../css/money.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="../js/money.js"></script>
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
                <li><a href="money.php" class="nav-link active">
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
        <!-- Page Header -->
        <header class="page-header">
            <div class="header-content">
                <div class="header-left">
                    <div class="page-title">
                        <h1>إدارة النقدية</h1>
                        <p>تتبع ومراقبة جميع العمليات المالية اليومية</p>
                    </div>
                </div>
                <div class="header-right">
                    <div class="header-actions">
                        <button class="action-btn primary" id="quickAddBtn">
                            <i class="fas fa-plus"></i>
                            <span>إضافة سريعة</span>
                        </button>
                        <button class="action-btn secondary" id="exportBtn">
                            <i class="fas fa-download"></i>
                            <span>تصدير</span>
                        </button>
                        <button class="action-btn icon-only" id="refreshBtn">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <!-- Top Controls -->
        <div class="top-controls">
            <div class="date-section">
                <div class="current-date">
                    <div class="date-icon">
                        <i class="fas fa-calendar-alt"></i>
                    </div>
                    <div class="date-info">
                        <span class="date-display">الجمعة، 20 يونيو 2025</span>
                        <span class="date-subtitle">اليوم الحالي</span>
                    </div>
                </div>
                <select class="date-selector">
                    <option>اختر يوم آخر</option>
                    <option>الخميس، 19 يونيو 2025</option>
                    <option>الأربعاء، 18 يونيو 2025</option>
                </select>
            </div>
            
            <div class="shift-section">
                <button id="startNewDayBtn" class="shift-btn" onclick="toggleShift()">
                    <i class="fas fa-play-circle"></i>
                    <span>بدء يوم جديد</span>
                </button>
                <div class="shift-status">
                    <div class="status-indicator"></div>
                    <span class="status-text">الشيفت مغلق</span>
                </div>
            </div>
        </div>

        <!-- Financial Cards -->
        <div class="financial-cards">
            <div class="card balance-card" id="cashBalance">
                <div class="card-header">
                    <div class="card-icon">
                        <i class="fas fa-coins"></i>
                    </div>
                    <div class="card-menu">
                        <i class="fas fa-ellipsis-v"></i>
                    </div>
                </div>
                <div class="card-body">
                    <h3>صافي النقدية</h3>
                    <div class="amount">
                        <span class="currency">ج</span>
                        <span class="value">0.00</span>
                    </div>
                    <div class="trend positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>+5.2%</span>
                    </div>
                </div>
            </div>

            <div class="card expenses-card" id="expenses">
                <div class="card-header">
                    <div class="card-icon">
                        <i class="fas fa-arrow-down"></i>
                    </div>
                    <div class="add-btn-card" onclick="openAddExpenseModal()">
                        <i class="fas fa-plus"></i>
                    </div>
                </div>
                <div class="card-body">
                    <h3>المصروفات</h3>
                    <div class="amount">
                        <span class="currency">ج</span>
                        <span class="value">0.00</span>
                    </div>
                    <div class="trend negative">
                        <i class="fas fa-arrow-down"></i>
                        <span>-2.1%</span>
                    </div>
                </div>
            </div>

            <div class="card revenues-card" id="revenues">
                <div class="card-header">
                    <div class="card-icon">
                        <i class="fas fa-arrow-up"></i>
                    </div>
                    <div class="add-btn-card" onclick="openAddRevenueModal()">
                        <i class="fas fa-plus"></i>
                    </div>
                </div>
                <div class="card-body">
                    <h3>الإيرادات</h3>
                    <div class="amount">
                        <span class="currency">ج</span>
                        <span class="value">0.00</span>
                    </div>
                    <div class="trend positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>+8.7%</span>
                    </div>
                </div>
            </div>

            <div class="card notes-card" id="notes">
                <div class="card-header">
                    <div class="card-icon">
                        <i class="fas fa-sticky-note"></i>
                    </div>
                    <div class="add-btn-card" onclick="openAddNoteModal()">
                        <i class="fas fa-plus"></i>
                    </div>
                </div>
                <div class="card-body">
                    <h3>الملاحظات</h3>
                    <div class="notes-info">
                        <span class="notes-count">0 ملاحظة</span>
                        <span class="last-note">لا توجد ملاحظات</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tab Navigation -->
        <div class="tab-navigation">
            <button id="revenue-tab" class="tab-btn active" onclick="switchTab('revenue')">
                <i class="fas fa-chart-line"></i>
                <span>الإيرادات</span>
            </button>
            <button id="expense-tab" class="tab-btn" onclick="switchTab('expense')">
                <i class="fas fa-chart-line-down"></i>
                <span>المصروفات</span>
            </button>
        </div>

        <!-- Revenue Content -->
        <div id="revenue-content" class="tab-content active">
            <div class="revenue-summary">
                <div class="summary-card">
                    <div class="summary-icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <div class="summary-info">
                        <h4>الأوردرات</h4>
                        <span class="summary-amount">0.00 ج</span>
                        <span class="summary-count">0 أوردر</span>
                    </div>
                </div>

                <div class="summary-card">
                    <div class="summary-icon">
                        <i class="fas fa-table"></i>
                    </div>
                    <div class="summary-info">
                        <h4>فواتير التربيزات</h4>
                        <span class="summary-amount">0.00 ج</span>
                        <span class="summary-count">0 فاتورة</span>
                    </div>
                </div>

                <div class="summary-card">
                    <div class="summary-icon">
                        <i class="fas fa-desktop"></i>
                    </div>
                    <div class="summary-info">
                        <h4>فواتير الأجهزة</h4>
                        <span class="summary-amount">0.00 ج</span>
                        <span class="summary-count">0 فاتورة</span>
                    </div>
                </div>
            </div>

            <div class="data-table-section">
                <div class="table-header">
                    <h3>تفاصيل الإيرادات</h3>
                    <div class="table-actions">
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" placeholder="البحث في الإيرادات...">
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
                                <th>اسم الإيراد</th>
                                <th>قيمة الإيراد</th>
                                <th>الموظف</th>
                                <th>اسم العميل</th>
                                <th>الوقت</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="no-data-row">
                                <td colspan="6" class="no-data-cell">
                                    <div class="no-data-content">
                                        <i class="fas fa-chart-line"></i>
                                        <h4>لا توجد إيرادات</h4>
                                        <p>ابدأ بإضافة أول إيراد لليوم</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Expense Content -->
        <div id="expense-content" class="tab-content">
            <div class="expense-summary">
                <div class="summary-card">
                    <div class="summary-icon">
                        <i class="fas fa-undo-alt"></i>
                    </div>
                    <div class="summary-info">
                        <h4>المرتجعات</h4>
                        <span class="summary-amount">0.00 ج</span>
                        <span class="summary-count">0 مرتجع</span>
                    </div>
                </div>
            </div>

            <div class="data-table-section">
                <div class="table-header">
                    <h3>تفاصيل المصروفات</h3>
                    <div class="table-actions">
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" placeholder="البحث في المصروفات...">
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
                                <th>نوع المصروف</th>
                                <th>اسم المصروف</th>
                                <th>القيمة</th>
                                <th>الوقت</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="no-data-row">
                                <td colspan="5" class="no-data-cell">
                                    <div class="no-data-content">
                                        <i class="fas fa-receipt"></i>
                                        <h4>لا توجد مصروفات</h4>
                                        <p>ابدأ بإضافة أول مصروف لليوم</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Quick Add Dropdown -->
    <div id="quickAddDropdown" class="quick-add-dropdown">
        <div class="dropdown-header">
            <h4>إضافة سريعة</h4>
        </div>
        <div class="dropdown-content">
            <button class="quick-add-item" onclick="openAddRevenueModal()">
                <i class="fas fa-plus-circle"></i>
                <span>إضافة إيراد</span>
            </button>
            <button class="quick-add-item" onclick="openAddExpenseModal()">
                <i class="fas fa-minus-circle"></i>
                <span>إضافة مصروف</span>
            </button>
            <button class="quick-add-item" onclick="openAddNoteModal()">
                <i class="fas fa-sticky-note"></i>
                <span>إضافة ملاحظة</span>
            </button>
        </div>
    </div>

    <!-- Modals -->
    <div id="addExpenseModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>
                    <i class="fas fa-minus-circle"></i>
                    إضافة مصروف جديد
                </h3>
                <span class="close-btn" onclick="closeModal('addExpenseModal')">&times;</span>
            </div>
            <form>
                <div class="form-group">
                    <label>نوع المصروف</label>
                    <div class="radio-group">
                        <label class="radio-option">
                            <input type="radio" name="expenseType" value="مصروف ثابت" onchange="enableSaveButton('addExpenseModal')">
                            <span class="radio-custom"></span>
                            <span class="radio-text">مصروف ثابت</span>
                        </label>
                        <label class="radio-option">
                            <input type="radio" name="expenseType" value="مصروف متغير" onchange="enableSaveButton('addExpenseModal')">
                            <span class="radio-custom"></span>
                            <span class="radio-text">مصروف متغير</span>
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label for="addExpenseName">اسم المصروف</label>
                    <input type="text" id="addExpenseName" placeholder="مثال: إيجار، كهرباء، رواتب..." onkeyup="enableSaveButton('addExpenseModal')">
                </div>
                <div class="form-group">
                    <label for="addExpenseAmount">المبلغ</label>
                    <div class="amount-input">
                        <input type="number" id="addExpenseAmount" placeholder="0.00" onkeyup="enableSaveButton('addExpenseModal')">
                        <span class="currency-symbol">ج</span>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-cancel" onclick="closeModal('addExpenseModal')">
                        <i class="fas fa-times"></i>
                        إلغاء
                    </button>
                    <button type="submit" class="btn-save" onclick="saveExpense()" disabled>
                        <i class="fas fa-save"></i>
                        حفظ المصروف
                    </button>
                </div>
            </form>
        </div>
    </div>

    <div id="addRevenueModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>
                    <i class="fas fa-plus-circle"></i>
                    إضافة إيراد جديد
                </h3>
                <span class="close-btn" onclick="closeModal('addRevenueModal')">&times;</span>
            </div>
            <form>
                <div class="form-group">
                    <label>نوع الإيراد</label>
                    <div class="radio-group">
                        <label class="radio-option">
                            <input type="radio" name="revenueType" value="محل" onchange="toggleCustomerSelect(); enableSaveButton('addRevenueModal');">
                            <span class="radio-custom"></span>
                            <span class="radio-text">محل</span>
                        </label>
                        <label class="radio-option">
                            <input type="radio" name="revenueType" value="عميل" onchange="toggleCustomerSelect(); enableSaveButton('addRevenueModal');">
                            <span class="radio-custom"></span>
                            <span class="radio-text">عميل</span>
                        </label>
                    </div>
                </div>
                <div class="form-group" id="customerSelectContainer">
                    <label for="customerSelect">اختر العميل</label>
                    <select id="customerSelect" style="display: none;" onchange="enableSaveButton('addRevenueModal')">
                        <option value="">اختر العميل</option>
                        <option value="عميل 1">عميل 1</option>
                        <option value="عميل 2">عميل 2</option>
                        <option value="عميل 3">عميل 3</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="addRevenueName">اسم الإيراد</label>
                    <input type="text" id="addRevenueName" placeholder="مثال: فاتورة بيع، خدمة..." onkeyup="enableSaveButton('addRevenueModal')">
                </div>
                <div class="form-group">
                    <label for="addRevenueAmount">المبلغ</label>
                    <div class="amount-input">
                        <input type="number" id="addRevenueAmount" placeholder="0.00" onkeyup="enableSaveButton('addRevenueModal')">
                        <span class="currency-symbol">ج</span>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-cancel" onclick="closeModal('addRevenueModal')">
                        <i class="fas fa-times"></i>
                        إلغاء
                    </button>
                    <button type="submit" class="btn-save" onclick="saveRevenue()" disabled>
                        <i class="fas fa-save"></i>
                        حفظ الإيراد
                    </button>
                </div>
            </form>
        </div>
    </div>

    <div id="addNoteModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>
                    <i class="fas fa-sticky-note"></i>
                    إضافة ملاحظة جديدة
                </h3>
                <span class="close-btn" onclick="closeModal('addNoteModal')">&times;</span>
            </div>
            <form>
                <div class="form-group">
                    <label for="addNoteTextarea">الملاحظة</label>
                    <textarea id="addNoteTextarea" placeholder="اكتب ملاحظاتك هنا..." onkeyup="enableSaveButton('addNoteModal')"></textarea>
                </div>
                <div class="form-group">
                    <label for="notePriority">أولوية الملاحظة</label>
                    <select id="notePriority">
                        <option value="normal">عادية</option>
                        <option value="important">مهمة</option>
                        <option value="urgent">عاجلة</option>
                    </select>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-cancel" onclick="closeModal('addNoteModal')">
                        <i class="fas fa-times"></i>
                        إلغاء
                    </button>
                    <button type="submit" class="btn-save" onclick="saveNote()" disabled>
                        <i class="fas fa-save"></i>
                        حفظ الملاحظة
                    </button>
                </div>
            </form>
        </div>
    </div>

    <div id="initialCashModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="initialCashModalTitle">
                    <i class="fas fa-money-bill-wave"></i>
                    النقدية الأولية
                </h3>
                <span class="close-btn" onclick="closeModal('initialCashModal')">&times;</span>
            </div>
            <form>
                <div class="form-group">
                    <label for="initialCashAmount">المبلغ</label>
                    <div class="amount-input">
                        <input type="number" id="initialCashAmount" placeholder="0.00" onkeyup="enableSaveButton('initialCashModal')">
                        <span class="currency-symbol">ج</span>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-cancel" onclick="closeModal('initialCashModal')">
                        <i class="fas fa-times"></i>
                        إلغاء
                    </button>
                    <button type="submit" class="btn-save" onclick="saveInitialCash()" disabled>
                        <i class="fas fa-save"></i>
                        حفظ
                    </button>
                </div>
            </form>
        </div>
    </div>

</body>
</html>