<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إدارة العملاء - نظام إدارة المقهى</title>
    <link rel="stylesheet" href="../css/money.css">
    <link rel="stylesheet" href="../css/customer.css">
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
                <div class="page-title"><h1>إدارة العملاء</h1><p>تتبع وإدارة جميع حسابات العملاء</p></div>
                <div class="header-actions">
                    <button class="action-btn primary" id="addCustomerModalBtn"><i class="fas fa-plus"></i><span>إضافة عميل</span></button>
                    <button class="action-btn secondary"><i class="fas fa-download"></i><span>تصدير</span></button>
                </div>
            </div>
        </header>

        <div class="financial-cards">
            <div class="card balance-card">
                <div class="card-header"><div class="card-icon"><i class="fas fa-wallet"></i></div></div>
                <div class="card-body">
                    <h3>إجمالي الأموال المستحقة</h3>
                    <div class="amount"><span class="currency">ج</span><span class="value" id="totalDueAmount">0.00</span></div>
                    <div class="trend positive"><i class="fas fa-users"></i><span id="totalCustomersCount">0 عملاء</span></div>
                </div>
            </div>
        </div>

        <div class="table-container">
            <div class="table-header">
                <h3>قائمة العملاء</h3>
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" id="customerSearchInput" placeholder="ابحث بكود العميل أو اسمه...">
                </div>
            </div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>كود العميل</th>
                        <th>اسم العميل</th>
                        <th>رقم التليفون</th>
                        <th>المبلغ المستحق</th>
                        <th>آخر معاملة</th>
                        <th>الحالة</th>
                        <th>الإجراءات</th>
                    </tr>
                </thead>
                <tbody id="customerTableBody">
                    </tbody>
            </table>
        </div>
    </div>

    <div id="addCustomerModal" class="modal">
        <div class="modal-content">
            <div class="modal-header"><h3><i class="fas fa-user-plus"></i> إضافة عميل جديد</h3><span class="close-btn">&times;</span></div>
            <form id="addCustomerForm">
                <div class="form-group"><label for="customerName">اسم العميل</label><input type="text" id="customerName" required></div>
                <div class="form-group"><label for="customerPhone">رقم التليفون</label><input type="tel" id="customerPhone"></div>
                <div class="form-group"><label for="customerNotes">ملاحظات</label><textarea id="customerNotes" rows="3"></textarea></div>
                <div class="modal-footer"><button type="button" class="btn-cancel">إلغاء</button><button type="submit" class="btn-save">حفظ العميل</button></div>
            </form>
        </div>
    </div>

    <div id="editCustomerModal" class="modal">
        <div class="modal-content">
            <div class="modal-header"><h3><i class="fas fa-user-edit"></i> تعديل بيانات العميل</h3><span class="close-btn">&times;</span></div>
            <form id="editCustomerForm">
                <div class="form-group"><label for="editCustomerName">اسم العميل</label><input type="text" id="editCustomerName" required></div>
                <div class="form-group"><label for="editCustomerPhone">رقم التليفون</label><input type="tel" id="editCustomerPhone"></div>
                <div class="form-group"><label for="editCustomerNotes">ملاحظات</label><textarea id="editCustomerNotes" rows="3"></textarea></div>
                 <div class="form-group"><label class="checkbox-label"><input type="checkbox" id="editCustomerIsActive"><span class="checkmark"></span><span>العميل نشط</span></label></div>
                <div class="modal-footer"><button type="button" class="btn-cancel">إلغاء</button><button type="submit" class="btn-save">حفظ التعديلات</button></div>
            </form>
        </div>
    </div>

    <div id="customerDetailsModal" class="modal">
        <div class="modal-content">
            <div class="modal-header"><h3><i class="fas fa-info-circle"></i> تفاصيل العميل</h3><span class="close-btn">&times;</span></div>
            <div class="details-content">
                <div class="detail-item"><span>كود العميل:</span><span id="detailCustomerCode"></span></div>
                <div class="detail-item"><span>اسم العميل:</span><span id="detailCustomerName"></span></div>
                <div class="detail-item"><span>رقم التليفون:</span><span id="detailCustomerPhone"></span></div>
                <div class="detail-item"><span>المبلغ المستحق:</span><span id="detailCustomerBalance"></span></div>
                <div class="detail-item"><span>تاريخ التسجيل:</span><span id="detailCustomerSince"></span></div>
                <div class="detail-item"><span>آخر معاملة:</span><span id="detailLastTransaction"></span></div>
                <div class="detail-item"><span>الملاحظات:</span><p id="detailCustomerNotes"></p></div>
            </div>
            <div class="modal-footer"><button type="button" class="btn-cancel">إغلاق</button></div>
        </div>
    </div>

    <script src="../js/main.js"></script>
    <script src="../js/customer.js"></script>
</body>
</html>