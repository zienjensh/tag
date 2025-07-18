<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إدارة النقدية - نظام إدارة المقهى</title>
    <link rel="stylesheet" href="../css/money.css">
    <link rel="stylesheet" href="../css/modal.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div id="overlay" class="overlay"></div>
    <div class="sidebar-toggle" id="sidebarToggle"><i class="fas fa-bars"></i></div>

    <div id="sidebar" class="sidebar"></div>

    <div class="main-content">
        <header class="page-header">
            <div class="header-content">
                <div class="page-title"><h1>النقدية والشيفتات</h1><p>مراقبة التدفقات النقدية اليومية</p></div>
                <div class="top-controls">
                    <div class="date-section">
                        <div class="current-date" id="current-date-time"></div>
                        <div class="dropdown-container" id="historyDropdownContainer" style="display: none;">
                            <i class="fas fa-calendar-alt"></i>
                            <select id="daysHistorySelect"><option value="today">عرض اليوم الحالي</option></select>
                        </div>
                    </div>
                    <div class="shift-status">
                        <div class="status-dot"></div>
                        <span class="status-text">الشيفت مغلق</span>
                    </div>
                    <button class="shift-btn" id="shiftControlBtn"><i class="fas fa-play-circle"></i><span>بدء يوم جديد</span></button>
                </div>
            </div>
        </header>

        <div class="financial-cards">
            <div class="card balance-card"><div class="card-header"><div class="card-icon"><i class="fas fa-wallet"></i></div></div><div class="card-body"><h3>صافي النقدية</h3><div class="amount"><span class="currency">ج</span><span class="value" id="netCashValue">0.00</span></div></div></div>
            <div class="card expenses-card"><div class="card-header"><div class="card-icon"><i class="fas fa-arrow-down"></i></div></div><div class="card-body"><h3>إجمالي المصروفات</h3><div class="amount"><span class="currency">ج</span><span class="value" id="totalExpensesValue">0.00</span></div></div></div>
            <div class="card revenues-card"><div class="card-header"><div class="card-icon"><i class="fas fa-arrow-up"></i></div></div><div class="card-body"><h3>إجمالي الإيرادات</h3><div class="amount"><span class="currency">ج</span><span class="value" id="totalRevenuesValue">0.00</span></div></div></div>
            <div class="card notes-card"><div class="card-header"><div class="card-icon"><i class="fas fa-sticky-note"></i></div></div><div class="card-body"><h3>ملاحظات</h3><p id="shiftNotesText">لا توجد ملاحظات.</p></div></div>
        </div>

        <div class="tab-navigation">
            <button data-tab="revenue" class="tab-btn active"><i class="fas fa-chart-line"></i><span>الإيرادات</span></button>
            <button data-tab="expense" class="tab-btn"><i class="fas fa-chart-bar"></i><span>المصروفات</span></button>
        </div>

        <div id="revenue-content" class="tab-content active">
            <div class="revenue-summary">
                <div class="summary-card"><div class="summary-icon"><i class="fas fa-receipt"></i></div><div class="summary-info"><span>فواتير الأوردرات</span><span class="summary-amount" id="ordersRevenue">0.00 ج</span></div></div>
                <div class="summary-card"><div class="summary-icon"><i class="fas fa-table"></i></div><div class="summary-info"><span>فواتير التربيزات</span><span class="summary-amount" id="tablesRevenue">0.00 ج</span></div></div>
                <div class="summary-card"><div class="summary-icon"><i class="fas fa-desktop"></i></div><div class="summary-info"><span>فواتير الأجهزة</span><span class="summary-amount" id="devicesRevenue">0.00 ج</span></div></div>
            </div>
            <div class="table-container"><table class="data-table"><thead><tr><th>الوصف</th><th>الفئة</th><th>المبلغ</th><th>الوقت</th><th>بواسطة</th></tr></thead><tbody id="revenueTableBody"></tbody></table></div>
        </div>

        <div id="expense-content" class="tab-content">
            <div class="table-container"><table class="data-table"><thead><tr><th>الوصف</th><th>الفئة</th><th>المبلغ</th><th>الوقت</th><th>بواسطة</th></tr></thead><tbody id="expenseTableBody"></tbody></table></div>
        </div>
    </div>

    <div class="fab-container">
        <button id="quickAddBtn" class="fab"><i class="fas fa-plus"></i></button>
        <div class="fab-options">
            <button class="fab-option" data-modal="addRevenue"><i class="fas fa-arrow-up"></i><span>إضافة إيراد</span></button>
            <button class="fab-option" data-modal="addExpense"><i class="fas fa-arrow-down"></i><span>إضافة مصروف</span></button>
            <button class="fab-option" data-modal="addNote"><i class="fas fa-sticky-note"></i><span>إضافة ملاحظة</span></button>
        </div>
    </div>

    <div id="startShiftModal" class="modal"><div class="modal-content"><div class="modal-header"><h3><i class="fas fa-play-circle"></i> بدء شيفت جديد</h3><span class="close-btn">&times;</span></div><form id="startShiftForm"><div class="form-group"><label for="startingCash">النقدية الافتتاحية</label><div class="amount-input"><input type="number" id="startingCash" required step="0.01" min="0"><span class="currency-symbol">ج</span></div></div><div class="modal-footer"><button type="button" class="btn-cancel">إلغاء</button><button type="submit" class="btn-save">بدء الشيفت</button></div></form></div></div>
    <div id="endShiftModal" class="modal"><div class="modal-content"><div class="modal-header"><h3><i class="fas fa-stop-circle"></i> إنهاء الشيفت</h3><span class="close-btn">&times;</span></div><form id="endShiftForm"><div class="form-group"><label for="endingCash">النقدية الفعلية</label><div class="amount-input"><input type="number" id="endingCash" required step="0.01" min="0"><span class="currency-symbol">ج</span></div></div><div class="form-group"><label for="shiftNotes">ملاحظات</label><textarea id="shiftNotes" rows="3"></textarea></div><div class="modal-footer"><button type="button" class="btn-cancel">إلغاء</button><button type="submit" class="btn-save">إنهاء وحفظ</button></div></form></div></div>
    <div id="addTransactionModal" class="modal"><div class="modal-content"><div class="modal-header"><h3 id="transactionModalTitle"></h3><span class="close-btn">&times;</span></div><form id="addTransactionForm"><div class="form-group"><label for="transactionDescription">الوصف</label><input type="text" id="transactionDescription" required></div><div class="form-group"><label for="transactionAmount">المبلغ</label><div class="amount-input"><input type="number" id="transactionAmount" required step="0.01" min="0"><span class="currency-symbol">ج</span></div></div><div class="form-group"><label for="transactionCategory">الفئة</label><input type="text" id="transactionCategory" value="متنوعات" required></div><input type="hidden" id="transactionType"><div class="modal-footer"><button type="button" class="btn-cancel">إلغاء</button><button type="submit" class="btn-save">حفظ</button></div></form></div></div>
    <div id="addNoteModal" class="modal"><div class="modal-content"><div class="modal-header"><h3><i class="fas fa-sticky-note"></i> إضافة ملاحظة للشيفت</h3><span class="close-btn">&times;</span></div><form id="addNoteForm"><div class="form-group"><label for="noteContent">الملاحظة</label><textarea id="noteContent" rows="4" required></textarea></div><div class="modal-footer"><button type="button" class="btn-cancel">إلغاء</button><button type="submit" class="btn-save">حفظ</button></div></form></div></div>

    <script src="../js/main.js"></script>
    <script src="../js/money.js"></script>
</body>
</html>