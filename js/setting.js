// public/js/setting.js - النسخة الكاملة والنهائية (مع إصلاح كل المشاكل)

document.addEventListener('DOMContentLoaded', () => {
    // main.js يهتم بالقائمة الجانبية، هنا نهتم فقط ببيانات الصفحة
    // نتأكد من وجود الدوال قبل استدعائها لتجنب الأخطاء
    if (typeof setupSettingsEventListeners === 'function' && typeof loadSettingsPageData === 'function') {
        setupSettingsEventListeners();
        loadSettingsPageData();
    }
});

const API_BASE_URL = 'http://127.0.0.1:8000/api';
let allPages = [];
let hasUnsavedChanges = false;

function setupSettingsEventListeners() {
    // مراقبة أي تغيير في النموذج لتفعيل زر الحفظ
    document.getElementById('settingsForm')?.addEventListener('change', () => markAsChanged(true));
    
    // زر الحفظ الرئيسي
    document.getElementById('saveAllSettingsBtn')?.addEventListener('click', saveAllSettings);
    
    // رفع اللوجو
    document.getElementById('logoUpload')?.addEventListener('change', previewLogo);
    
    // تغيير الموظف لعرض صلاحياته
    document.getElementById('employeeSelect')?.addEventListener('change', (e) => loadUserPermissions(e.target.value));

    // أزرار التنقل بين التبويبات
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });
}

function switchTab(tabId) {
    if (!tabId) return;
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`${tabId}-content`)?.classList.add('active');
    document.querySelector(`.tab-btn[data-tab='${tabId}']`)?.classList.add('active');
}

async function loadSettingsPageData() {
    showNotification('جاري تحميل الإعدادات...', 'info');
    try {
        const [settings, users, pages] = await Promise.all([
            sendRequest('settings', 'GET'),
            sendRequest('users', 'GET'),
            sendRequest('pages', 'GET')
        ]);

        allPages = pages;
        populateSettingsForm(settings);
        populateEmployeeSelect(users);

        if (users.length > 0) {
            await loadUserPermissions(users[0].id);
        }
        markAsChanged(false); // إعادة تعيين زر الحفظ بعد التحميل
    } catch (error) {
        showNotification("فشل تحميل البيانات الأولية.", "error");
    }
}

function populateSettingsForm(settings) {
    document.getElementById('store_name').value = settings.store_name || '';
    document.getElementById('complaint_number').value = settings.complaint_number || '';
    document.getElementById('reservation_number').value = settings.reservation_number || '';
    document.getElementById('max_discount').value = settings.max_discount || 0;
    document.getElementById('max_delete_time').value = settings.max_delete_time || 0;
    if (settings.store_logo) {
        document.getElementById('currentLogo').src = `/storage/${settings.store_logo}`;
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
    select.innerHTML = '';
    users.forEach(user => {
        if (user.role === 'employee') {
            select.innerHTML += `<option value="${user.id}">${user.name}</option>`;
        }
    });
}

async function loadUserPermissions(userId) {
    const grid = document.getElementById('permissionsGrid');
    grid.innerHTML = '<p>جاري تحميل الصلاحيات...</p>';
    try {
        const userPermissions = await sendRequest(`users/${userId}/permissions`, 'GET');
        const userPageIds = new Set(userPermissions.map(p => p.id));
        grid.innerHTML = '';
        allPages.forEach(page => {
            const isChecked = userPageIds.has(page.id) ? 'checked' : '';
            grid.innerHTML += `<div class="page-card"><label class="page-label"><input type="checkbox" name="pages" value="${page.id}" ${isChecked}><div class="page-content"><div class="page-icon"><i class="${page.icon_class}"></i></div><div class="page-info"><h4>${page.name}</h4><p>${page.route}</p></div><div class="page-status"><i class="fas fa-check"></i></div></div></label></div>`;
        });
    } catch (error) {
        grid.innerHTML = '<p class="error">فشل تحميل الصلاحيات.</p>';
    }
}

function previewLogo(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => { document.getElementById('currentLogo').src = e.target.result; };
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
        showNotification('لا توجد تغييرات لحفظها', 'info'); return;
    }
    showNotification('جاري حفظ الإعدادات...', 'info');
    
    // [الإصلاح] إرسال طلبين منفصلين: واحد للإعدادات وواحد للصلاحيات
    try {
        // 1. حفظ إعدادات المحل العامة
        const settingsFormData = new FormData();
        settingsFormData.append('store_name', document.getElementById('store_name').value);
        settingsFormData.append('complaint_number', document.getElementById('complaint_number').value);
        settingsFormData.append('reservation_number', document.getElementById('reservation_number').value);
        settingsFormData.append('max_discount', document.getElementById('max_discount').value);
        settingsFormData.append('max_delete_time', document.getElementById('max_delete_time').value);
        const logoFile = document.getElementById('logoUpload').files[0];
        if (logoFile) settingsFormData.append('store_logo', logoFile);
        
        await sendRequest('settings', 'POST', settingsFormData, true);

        // 2. حفظ صلاحيات الموظف المحدد
        const userId = document.getElementById('employeeSelect').value;
        if (userId) {
            const permissions = Array.from(document.querySelectorAll(`#permissionsGrid input[name="pages"]:checked`)).map(cb => cb.value);
            await sendRequest(`users/${userId}/permissions`, 'POST', { pages: permissions });
        }
        
        showNotification('تم حفظ جميع الإعدادات بنجاح!', 'success');
        markAsChanged(false);
        
        // [الإصلاح] إعادة تحميل كل البيانات وتحديث الواجهة بالكامل
        await loadSettingsPageData();
        
    } catch (error) {
        showNotification(`حدث خطأ أثناء الحفظ: ${error.message}`, 'error');
    }
}

async function sendRequest(endpoint, method, body = null, isFormData = false) {
    try {
        const options = { method, headers: { 'Accept': 'application/json' } };
        if (body) {
            if (isFormData) { options.body = body; } 
            else { options.headers['Content-Type'] = 'application/json'; options.body = JSON.stringify(body); }
        }
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'فشل في الطلب');
        }
        return response.status !== 204 ? await response.json() : null;
    } catch (error) { console.error(error); throw error; }
}

function showNotification(message, type = 'info') {
    const container = document.createElement('div');
    container.className = `notification show ${type}`;
    const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle' };
    container.innerHTML = `<i class="fas ${icons[type]}"></i><span style="margin-right: 10px;">${message}</span>`;
    document.body.appendChild(container);

    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `.notification { position: fixed; top: 20px; right: 20px; background: white; padding: 15px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 10px; z-index: 10000; transform: translateX(calc(100% + 20px)); transition: transform 0.5s ease-in-out; } .notification.show { transform: translateX(0); } .notification.success { border-left: 5px solid #28a745; color: #28a745;} .notification.error { border-left: 5px solid #dc3545; color: #dc3545;} .notification.info { border-left: 5px solid #17a2b8; color: #17a2b8;}`;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        container.classList.remove('show');
        setTimeout(() => container.remove(), 500);
    }, 4000);
}