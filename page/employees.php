<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إدارة الموظفين</title>
    <link rel="stylesheet" href="../css/money.css">
    <link rel="stylesheet" href="../css/employees.css">
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
                <div class="page-title"><h1>إدارة الموظفين</h1><p>إضافة وتعديل صلاحيات المستخدمين</p></div>
                <div class="header-actions">
                    <button class="action-btn primary" id="addEmployeeModalBtn"><i class="fas fa-plus"></i><span>إضافة موظف</span></button>
                </div>
            </div>
        </header>

        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>الاسم</th>
                        <th>اسم المستخدم</th>
                        <th>الدور</th>
                        <th>تاريخ الإضافة</th>
                        <th>إجراءات</th>
                    </tr>
                </thead>
                <tbody id="employeeTableBody"></tbody>
            </table>
        </div>

        <!-- [الإصلاح] إعادة إضافة الأقسام المفقودة -->
        <div class="section-separator"></div>
        <div class="detailed-analysis">
            <div class="analysis-card">
                <div class="card-header"><h3><i class="fas fa-receipt"></i> أوردرات الموظفين (آخر شهرين)</h3></div>
                <div class="card-content"><p class="no-data">هذه الميزة قيد التطوير...</p></div>
            </div>
            <div class="analysis-card">
                <div class="card-header"><h3><i class="fas fa-money-bill-wave"></i> مصاريف الموظفين (آخر شهرين)</h3></div>
                <div class="card-content"><p class="no-data">هذه الميزة قيد التطوير...</p></div>
            </div>
        </div>
    </div>

    <!-- Modals -->
    <div id="addEmployeeModal" class="modal">
        <div class="modal-content large-modal">
            <div class="modal-header"><h3><i class="fas fa-user-plus"></i> إضافة موظف جديد</h3><span class="close-btn">&times;</span></div>
            <form id="addEmployeeForm">
                <div class="form-grid">
                    <div class="form-group"><label for="name">الاسم الكامل</label><input type="text" id="name" required></div>
                    <div class="form-group"><label for="username">اسم المستخدم (للدخول)</label><input type="text" id="username" required></div>
                    <div class="form-group"><label for="password">كلمة المرور</label><input type="password" id="password" required></div>
                    <div class="form-group"><label for="password_confirmation">تأكيد كلمة المرور</label><input type="password" id="password_confirmation" required></div>
                    <div class="form-group"><label for="role">الدور</label><select id="role" required><option value="employee">موظف</option><option value="admin">مسؤول</option></select></div>
                </div>
                <hr>
                <div class="permissions-section">
                    <h4>صلاحيات الوصول للصفحات</h4>
                    <div class="permissions-grid" id="addPermissionsGrid"></div>
                </div>
                <div class="modal-footer"><button type="button" class="btn-cancel">إلغاء</button><button type="submit" class="btn-save">حفظ الموظف</button></div>
            </form>
        </div>
    </div>
    
    <div id="editEmployeeModal" class="modal">
        <div class="modal-content large-modal">
            <div class="modal-header"><h3><i class="fas fa-user-edit"></i> تعديل بيانات الموظف</h3><span class="close-btn">&times;</span></div>
            <form id="editEmployeeForm">
                 <div class="form-grid">
                    <div class="form-group"><label for="edit_name">الاسم الكامل</label><input type="text" id="edit_name" required></div>
                    <div class="form-group"><label for="edit_username">اسم المستخدم (للدخول)</label><input type="text" id="edit_username" required></div>
                    <div class="form-group"><label for="edit_role">الدور</label><select id="edit_role" required><option value="employee">موظف</option><option value="admin">مسؤول</option></select></div>
                </div>
                <hr>
                <div class="permissions-section">
                    <h4>صلاحيات الوصول للصفحات</h4>
                    <div class="permissions-grid" id="editPermissionsGrid"></div>
                </div>
                <div class="modal-footer"><button type="button" class="btn-cancel">إلغاء</button><button type="submit" class="btn-save">حفظ التعديلات</button></div>
            </form>
        </div>
    </div>

    <script src="../js/main.js"></script>
    <script src="../js/employees.js"></script>
</body>
</html>
