// js/employees.js - النسخة المحسنة والكاملة مع إصلاح جميع المشاكل

document.addEventListener('DOMContentLoaded', () => {
    // استدعاء الملف العام أولاً (للتأكد من بناء القائمة الجانبية)
    if (typeof buildSidebar === 'function') {
        buildSidebar();
    }
    // ثم تحميل بيانات الصفحة الحالية
    loadPageData();
    setupEventListeners();
    initializeNotificationSounds();
});

// --- متغيرات عامة ---
const API_BASE_URL = 'http://127.0.0.1:8000/api';
let allPages = [];
let currentEditingId = null;
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

// --- إعداد الواجهة والوظائف الأساسية ---
function setupEventListeners() {
    const addEmployeeBtn = document.getElementById('addEmployeeModalBtn');
    if (addEmployeeBtn) {
        addEmployeeBtn.addEventListener('click', () => {
            console.log('Add employee button clicked');
            openAddEmployeeModal();
        });
    }
    
    const addForm = document.getElementById('addEmployeeForm');
    if (addForm) {
        addForm.addEventListener('submit', e => { 
            e.preventDefault(); 
            saveEmployee(); 
        });
    }
    
    const editForm = document.getElementById('editEmployeeForm');
    if (editForm) {
        editForm.addEventListener('submit', e => { 
            e.preventDefault(); 
            updateEmployee(); 
        });
    }
    
    document.body.addEventListener('click', function(e) {
        const button = e.target.closest('button');
        if (!button) return;

        if (button.classList.contains('close-btn') || button.classList.contains('btn-cancel')) {
            const modal = button.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
            return;
        }

        const { action, id } = button.dataset;
        if (action === 'edit') editEmployee(id);
        if (action === 'delete') deleteEmployee(id);
    });
}

// --- تحميل البيانات وعرضها ---
async function loadPageData() {
    showNotification('جاري تحميل البيانات...', 'info');
    try {
        const [users, pages] = await Promise.all([
            sendRequest('users', 'GET'),
            sendRequest('pages', 'GET')
        ]);
        
        allPages = pages;
        renderEmployeeTable(users);
        
        playNotificationSound('success');
        showNotification('تم تحميل البيانات بنجاح', 'success');
    } catch (error) {
        playNotificationSound('error');
        showNotification('فشل تحميل البيانات: ' + error.message, 'error');
    }
}

function renderEmployeeTable(users) {
    const tableBody = document.getElementById('employeeTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (!users || users.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="no-data-cell">
                    <div class="no-data-content">
                        <i class="fas fa-user-tie"></i>
                        <h4>لا يوجد موظفين حالياً</h4>
                        <p>قم بإضافة أول موظف للبدء</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.username}</td>
            <td>
                <span class="role-badge ${user.role}">
                    ${user.role === 'admin' ? 'مسؤول' : 'موظف'}
                </span>
            </td>
            <td>${new Date(user.created_at).toLocaleDateString('ar-EG')}</td>
            <td class="actions">
                <div class="action-buttons">
                    <button class="btn-action btn-edit" data-action="edit" data-id="${user.id}" title="تعديل">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action btn-delete" data-action="delete" data-id="${user.id}" title="حذف">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// --- دوال إضافة وتعديل وحذف الموظفين ---

function openAddEmployeeModal() {
    const grid = document.getElementById('addPermissionsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    allPages.forEach(page => {
        const permissionItem = document.createElement('div');
        permissionItem.className = 'permission-item';
        permissionItem.innerHTML = `
            <label class="permission-label">
                <input type="checkbox" name="pages" value="${page.id}">
                <span class="checkmark"></span>
                <span class="permission-text">${page.name}</span>
            </label>
        `;
        grid.appendChild(permissionItem);
    });
    
    openModal('addEmployeeModal');
}

async function saveEmployee() {
    const form = document.getElementById('addEmployeeForm');
    const selectedPages = Array.from(form.querySelectorAll('input[name="pages"]:checked')).map(cb => cb.value);
    
    const data = {
        name: form.name.value,
        username: form.username.value,
        password: form.password.value,
        password_confirmation: form.password_confirmation.value,
        role: form.role.value,
        pages: selectedPages
    };
    
    try {
        await sendRequest('users', 'POST', data);
        playNotificationSound('success');
        showNotification('تمت إضافة الموظف بنجاح', 'success');
        loadPageData();
        closeModal('addEmployeeModal');
        form.reset();
    } catch (error) {
        playNotificationSound('error');
        showNotification('فشل في إضافة الموظف: ' + error.message, 'error');
    }
}

async function editEmployee(id) {
    try {
        const user = await sendRequest(`users/${id}`, 'GET');
        if (!user) return;
        
        currentEditingId = id;
        const form = document.getElementById('editEmployeeForm');
        form.edit_name.value = user.name;
        form.edit_username.value = user.username;
        form.edit_role.value = user.role;
        
        const grid = document.getElementById('editPermissionsGrid');
        
        // إنشاء مجموعة (Set) من أرقام الصفحات الخاصة بالموظف لسهولة البحث
        const userPageIds = new Set(user.pages.map(p => p.id));
        
        grid.innerHTML = '';
        allPages.forEach(page => {
            // لكل صفحة، نتحقق إذا كان رقمها موجوداً في مجموعة صفحات الموظف
            const isChecked = userPageIds.has(page.id) ? 'checked' : '';
            const permissionItem = document.createElement('div');
            permissionItem.className = 'permission-item';
            permissionItem.innerHTML = `
                <label class="permission-label">
                    <input type="checkbox" name="pages" value="${page.id}" ${isChecked}>
                    <span class="checkmark"></span>
                    <span class="permission-text">${page.name}</span>
                </label>
            `;
            grid.appendChild(permissionItem);
        });
        
        openModal('editEmployeeModal');
    } catch (error) {
        playNotificationSound('error');
        showNotification('فشل في جلب بيانات الموظف: ' + error.message, 'error');
    }
}

async function updateEmployee() {
    if (!currentEditingId) return;
    
    const form = document.getElementById('editEmployeeForm');
    const selectedPages = Array.from(form.querySelectorAll('input[name="pages"]:checked')).map(cb => cb.value);
    
    const data = {
        name: form.edit_name.value,
        username: form.edit_username.value,
        role: form.edit_role.value,
        pages: selectedPages
    };
    
    try {
        await sendRequest(`users/${currentEditingId}`, 'PUT', data);
        playNotificationSound('success');
        showNotification('تم تحديث البيانات بنجاح', 'success');
        loadPageData();
        closeModal('editEmployeeModal');
    } catch (error) {
        playNotificationSound('error');
        showNotification('فشل في تحديث البيانات: ' + error.message, 'error');
    }
}

async function deleteEmployee(id) {
    if (confirm('هل أنت متأكد من حذف هذا الموظف؟')) {
        try {
            await sendRequest(`users/${id}`, 'DELETE');
            playNotificationSound('success');
            showNotification('تم حذف الموظف بنجاح', 'success');
            loadPageData();
        } catch (error) {
            playNotificationSound('error');
            showNotification('فشل في حذف الموظف: ' + error.message, 'error');
        }
    }
}

// --- دوال المساعدة (API & Notifications) ---
function openModal(modalId) { 
    console.log('Opening modal:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        console.error('Modal not found:', modalId);
    }
}

function closeModal(modalId) { 
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

async function sendRequest(endpoint, method, body = null) {
    try {
        const options = { 
            method, 
            headers: { 
                'Content-Type': 'application/json', 
                'Accept': 'application/json' 
            },
            credentials: 'include'
        };
        
        // إضافة التوكن
        const token = sessionStorage.getItem('authToken');
        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }
        
        if (body) { 
            options.body = JSON.stringify(body); 
        }
        
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
        
        if (response.status === 401 || response.status === 419) {
            sessionStorage.clear();
            window.location.href = '/tag/index.php';
            return Promise.reject(new Error("انتهت صلاحية الجلسة"));
        }
        
        if (!response.ok) {
            const data = await response.json();
            const errorMessages = data.errors ? 
                Object.values(data.errors).flat().join('\n') : 
                data.message || 'حدث خطأ غير متوقع';
            throw new Error(errorMessages);
        }
        
        return response.status !== 204 ? await response.json() : null;
    } catch (error) { 
        console.error(`API Error:`, error); 
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
            .notification.success { border-left: 5px solid #28a745; color: #28a745; } 
            .notification.error { border-left: 5px solid #dc3545; color: #dc3545; } 
            .notification.info { border-left: 5px solid #17a2b8; color: #17a2b8; }
            .notification.warning { border-left: 5px solid #ffc107; color: #856404; }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        container.classList.remove('show');
        setTimeout(() => container.remove(), 500);
    }, 4000);
}