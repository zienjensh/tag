// js/setting.js - النسخة المحسنة والمستقرة

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 بدء تحميل صفحة الإعدادات...');
    
    // main.js يهتم بالقائمة الجانبية، هنا نهتم فقط ببيانات الصفحة
    if (typeof buildSidebar === 'function') {
        buildSidebar();
    }
    
    setupSettingsEventListeners();
    loadSettingsPageData();
    initializeNotificationSounds();
    
    console.log('✅ تم تحميل صفحة الإعدادات بنجاح');
});

const API_BASE_URL = 'http://127.0.0.1:8000/api';
let allPages = [];
let hasUnsavedChanges = false;
let notificationSounds = {};

// تهيئة الأصوات
function initializeNotificationSounds() {
    notificationSounds = {
        success: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'),
        error: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'),
        notification: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT')
    };
}

function playNotificationSound(type = 'notification') {
    try {
        if (notificationSounds[type]) {
            notificationSounds[type].volume = 0.3;
            notificationSounds[type].play().catch(e => console.log('Sound play failed:', e));
        }
    } catch (e) {
        console.log('Sound error:', e);
    }
}

function setupSettingsEventListeners() {
    console.log('🔗 إعداد مستمعي الأحداث...');
    
    // مراقبة أي تغيير في النموذج لتفعيل زر الحفظ
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('change', () => markAsChanged(true));
    }
    
    // زر الحفظ الرئيسي
    const saveBtn = document.getElementById('saveAllSettingsBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveAllSettings);
    }
    
    // رفع اللوجو
    const logoUpload = document.getElementById('logoUpload');
    if (logoUpload) {
        logoUpload.addEventListener('change', previewLogo);
    }
    
    // تغيير الموظف لعرض صلاحياته
    const employeeSelect = document.getElementById('employeeSelect');
    if (employeeSelect) {
        employeeSelect.addEventListener('change', (e) => loadUserPermissions(e.target.value));
    }

    // أزرار التنقل بين التبويبات
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            console.log('🔄 تبديل التبويب إلى:', tabId);
            switchTab(tabId);
        });
    });
    
    console.log('✅ تم إعداد جميع مستمعي الأحداث');
}

function switchTab(tabId) {
    if (!tabId) return;
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`${tabId}-content`)?.classList.add('active');
    document.querySelector(`.tab-btn[data-tab='${tabId}']`)?.classList.add('active');
}

async function loadSettingsPageData() {
    console.log('📡 جاري تحميل إعدادات الصفحة...');
    showNotification('جاري تحميل الإعدادات...', 'info');
    
    try {
        const [settings, users, pages] = await Promise.all([
            sendRequest('settings', 'GET'),
            sendRequest('users', 'GET'),
            sendRequest('pages', 'GET')
        ]);

        console.log('📨 تم استلام البيانات:', { settings, users, pages });

        allPages = pages;
        populateSettingsForm(settings);
        populateEmployeeSelect(users);

        if (users.length > 0) {
            const employees = users.filter(u => u.role === 'employee');
            if (employees.length > 0) {
                await loadUserPermissions(employees[0].id);
            }
        }
        
        markAsChanged(false); // إعادة تعيين زر الحفظ بعد التحميل
        
        playNotificationSound('success');
        showNotification('تم تحميل الإعدادات بنجاح', 'success');
    } catch (error) {
        console.error('❌ خطأ في تحميل البيانات:', error);
        playNotificationSound('error');
        showNotification("فشل تحميل البيانات الأولية: " + error.message, "error");
    }
}

function populateSettingsForm(settings) {
    console.log('📝 ملء نموذج الإعدادات...');
    
    // ملء الحقول بالقيم المحفوظة
    const fields = ['store_name', 'complaint_number', 'reservation_number', 'max_discount', 'max_delete_time'];
    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element && settings[field] !== undefined) {
            element.value = settings[field];
        }
    });
    
    // عرض اللوجو الحالي
    if (settings.store_logo) {
        const logoImg = document.getElementById('currentLogo');
        if (logoImg) {
            logoImg.src = `http://127.0.0.1:8000/storage/${settings.store_logo}`;
        }
    }
    
    // تحديث البيانات في ذاكرة المتصفح
    sessionStorage.setItem('settings', JSON.stringify(settings));
    
    // التأكد من أن main.js موجود قبل استدعاء دالته
    if (typeof buildSidebar === 'function') {
        buildSidebar();
    }
}

function populateEmployeeSelect(users) {
    const select = document.getElementById('employeeSelect');
    if (!select) return;
    
    select.innerHTML = '<option value="">اختر موظف...</option>';
    users.forEach(user => {
        if (user.role === 'employee') {
            select.innerHTML += `<option value="${user.id}">${user.name}</option>`;
        }
    });
}

async function loadUserPermissions(userId) {
    const grid = document.getElementById('permissionsGrid');
    if (!grid) return;
    
    grid.innerHTML = '<p>جاري تحميل الصلاحيات...</p>';
    
    try {
        const userPermissions = await sendRequest(`users/${userId}/permissions`, 'GET');
        const userPageIds = new Set(userPermissions.map(p => p.id));
        
        grid.innerHTML = '';
        allPages.forEach(page => {
            const isChecked = userPageIds.has(page.id) ? 'checked' : '';
            const pageCard = document.createElement('div');
            pageCard.className = 'page-card';
            pageCard.innerHTML = `
                <label class="page-label">
                    <input type="checkbox" name="pages" value="${page.id}" ${isChecked}>
                    <div class="page-content">
                        <div class="page-icon">
                            <i class="${page.icon_class}"></i>
                        </div>
                        <div class="page-info">
                            <h4>${page.name}</h4>
                            <p>${page.route}</p>
                        </div>
                        <div class="page-status">
                            <i class="fas fa-check"></i>
                        </div>
                    </div>
                </label>
            `;
            grid.appendChild(pageCard);
        });
    } catch (error) {
        grid.innerHTML = '<p class="error">فشل تحميل الصلاحيات: ' + error.message + '</p>';
    }
}

function previewLogo(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => { 
            const logoImg = document.getElementById('currentLogo');
            if (logoImg) {
                logoImg.src = e.target.result; 
            }
        };
        reader.readAsDataURL(file);
        markAsChanged(true);
    }
}

function markAsChanged(changed) {
    hasUnsavedChanges = changed;
    const saveButton = document.getElementById('saveAllSettingsBtn');
    if (!saveButton) return;
    
    if (changed) {
        saveButton.style.background = 'var(--warning-color)';
        saveButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>حفظ التغييرات</span>';
    } else {
        saveButton.style.background = '';
        saveButton.innerHTML = '<i class="fas fa-save"></i><span>حفظ جميع التغييرات</span>';
    }
}

async function saveAllSettings() {
    if (!hasUnsavedChanges) {
        showNotification('لا توجد تغييرات لحفظها', 'info'); 
        return;
    }
    
    console.log('💾 حفظ جميع الإعدادات...');
    showNotification('جاري حفظ الإعدادات...', 'info');
    
    try {
        // 1. حفظ إعدادات المحل العامة
        const settingsFormData = new FormData();
        const fields = ['store_name', 'complaint_number', 'reservation_number', 'max_discount', 'max_delete_time'];
        
        fields.forEach(field => {
            const element = document.getElementById(field);
            if (element && element.value) {
                settingsFormData.append(field, element.value);
            }
        });
        
        const logoFile = document.getElementById('logoUpload').files[0];
        if (logoFile) {
            settingsFormData.append('store_logo', logoFile);
        }
        
        await sendRequest('settings', 'POST', settingsFormData, true);

        // 2. حفظ صلاحيات الموظف المحدد
        const userId = document.getElementById('employeeSelect').value;
        if (userId) {
            const permissions = Array.from(document.querySelectorAll(`#permissionsGrid input[name="pages"]:checked`)).map(cb => cb.value);
            await sendRequest(`users/${userId}/permissions`, 'POST', { pages: permissions });
        }
        
        playNotificationSound('success');
        showNotification('تم حفظ جميع الإعدادات بنجاح!', 'success');
        markAsChanged(false);
        
        // إعادة تحميل كل البيانات وتحديث الواجهة بالكامل
        await loadSettingsPageData();
        
    } catch (error) {
        console.error('❌ خطأ في حفظ الإعدادات:', error);
        playNotificationSound('error');
        showNotification(`حدث خطأ أثناء الحفظ: ${error.message}`, 'error');
    }
}

async function sendRequest(endpoint, method, body = null, isFormData = false) {
    try {
        const options = { 
            method, 
            headers: { 'Accept': 'application/json' },
            credentials: 'include'
        };
        
        // إضافة التوكن
        const token = sessionStorage.getItem('authToken');
        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }
        
        if (body) {
            if (isFormData) { 
                options.body = body; 
            } else { 
                options.headers['Content-Type'] = 'application/json'; 
                options.body = JSON.stringify(body); 
            }
        }
        
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
        
        if (response.status === 401 || response.status === 419) {
            sessionStorage.clear();
            window.location.href = '/tag/index.php';
            return Promise.reject(new Error("انتهت صلاحية الجلسة"));
        }
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'فشل في الطلب');
        }
        
        return response.status !== 204 ? await response.json() : null;
    } catch (error) { 
        console.error(error); 
        throw error; 
    }
}

function showNotification(message, type = 'info') {
    const container = document.createElement('div');
    container.className = `notification show ${type}`;
    const icons = { 
        success: 'fa-check-circle', 
        error: 'fa-times-circle', 
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };
    container.innerHTML = `<i class="fas ${icons[type]}"></i><span style="margin-right: 10px;">${message}</span>`;
    document.body.appendChild(container);

    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification { 
                position: fixed; top: 20px; right: 20px; background: white; 
                padding: 15px 20px; border-radius: 8px; 
                box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; 
                align-items: center; gap: 10px; z-index: 10000; 
                transform: translateX(calc(100% + 20px)); 
                transition: transform 0.5s ease-in-out; 
            } 
            .notification.show { transform: translateX(0); } 
            .notification.success { border-left: 5px solid #28a745; color: #28a745;} 
            .notification.error { border-left: 5px solid #dc3545; color: #dc3545;} 
            .notification.info { border-left: 5px solid #17a2b8; color: #17a2b8;}
            .notification.warning { border-left: 5px solid #ffc107; color: #856404;}
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        container.classList.remove('show');
        setTimeout(() => container.remove(), 500);
    }, 4000);
}