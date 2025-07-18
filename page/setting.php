<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>الإعدادات - نظام إدارة المقهى</title>
    <link rel="stylesheet" href="../css/money.css">
    <link rel="stylesheet" href="../css/setting.css">
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
                <div class="page-title"><h1>إعدادات النظام</h1><p>إدارة وتخصيص جميع إعدادات المقهى والنظام</p></div>
                <div class="header-actions">
                    <button class="action-btn primary" id="saveAllSettingsBtn"><i class="fas fa-save"></i><span>حفظ جميع التغييرات</span></button>
                </div>
            </div>
        </header>

        <div class="tab-navigation">
            <button data-tab="store-info" class="tab-btn active"><i class="fas fa-store"></i><span>معلومات المحل</span></button>
            <button data-tab="permissions" class="tab-btn"><i class="fas fa-shield-alt"></i><span>الصلاحيات</span></button>
            <button data-tab="invoice-info" class="tab-btn"><i class="fas fa-receipt"></i><span>الفاتورة</span></button>
            <button data-tab="data-management" class="tab-btn"><i class="fas fa-trash-alt"></i><span>إدارة البيانات</span></button>
        </div>
        
        <form id="settingsForm">
            <div id="store-info-content" class="tab-content active">
                <div class="settings-container">
                    <div class="settings-card">
                        <div class="card-header"><h3><i class="fas fa-store"></i> معلومات المحل الأساسية</h3></div>
                        <div class="card-content">
                            <div class="form-grid">
                                <div class="form-group"><label for="store_name"><i class="fas fa-store"></i> اسم المحل</label><input type="text" id="store_name" name="store_name"></div>
                                <div class="form-group"><label for="complaint_number"><i class="fas fa-phone"></i> رقم الشكاوى</label><input type="tel" id="complaint_number" name="complaint_number"></div>
                                <div class="form-group"><label for="reservation_number"><i class="fas fa-calendar-check"></i> رقم الحجز</label><input type="tel" id="reservation_number" name="reservation_number"></div>
                                <div class="form-group"><label for="max_discount"><i class="fas fa-percentage"></i> أعلى مبلغ للخصم (ج)</label><input type="number" id="max_discount" name="max_discount" min="0" step="0.01"></div>
                                <div class="form-group"><label for="max_delete_time"><i class="fas fa-clock"></i> أقصى مدة لحذف الوقت (دقيقة)</label><input type="number" id="max_delete_time" name="max_delete_time" min="1"></div>
                            </div>
                            <div class="logo-section">
                                <h4><i class="fas fa-image"></i> لوجو المحل</h4>
                                <div class="logo-upload-container">
                                    <div class="current-logo-display"><img id="currentLogo" src="/uploads/logo.png" alt="Current Logo"></div>
                                    <div class="upload-section"><input type="file" id="logoUpload" name="store_logo" accept="image/*" style="display: none;"><button type="button" class="upload-btn" onclick="document.getElementById('logoUpload').click()"><i class="fas fa-upload"></i><span>رفع لوجو جديد</span></button><div class="upload-info"><p><i class="fas fa-info-circle"></i> PNG, JPG - حد أقصى 2MB</p></div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="permissions-content" class="tab-content">
                 <div class="settings-container">
                     <div class="settings-card">
                         <div class="card-header"><h3><i class="fas fa-user-shield"></i> صلاحيات الموظفين</h3></div>
                         <div class="card-content">
                             <div class="form-group"><label for="employeeSelect">اختر الموظف لعرض وتعديل صلاحياته:</label><select id="employeeSelect"></select></div>
                             <hr>
                             <div id="permissionsGrid" class="pages-grid"></div>
                         </div>
                     </div>
                 </div>
            </div>
            
            <div id="invoice-info-content" class="tab-content">
                 <div class="settings-container">
                    <div class="coming-soon-card">
                        <div class="coming-soon-content">
                            <div class="coming-soon-icon"><i class="fas fa-receipt"></i></div>
                            <h3>معلومات الفاتورة</h3><p>إعدادات الفواتير والطباعة قيد التطوير...</p>
                        </div>
                    </div>
                 </div>
            </div>

            <div id="data-management-content" class="tab-content">
                 <div class="settings-container">
                    <div class="coming-soon-card">
                        <div class="coming-soon-content">
                            <div class="coming-soon-icon"><i class="fas fa-trash-alt"></i></div>
                            <h3>حذف البيانات</h3><p>أدوات إدارة وحذف بيانات النظام قيد التطوير...</p>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>

    <script src="../js/main.js"></script> 
    <script src="../js/setting.js"></script>
</body>
</html>