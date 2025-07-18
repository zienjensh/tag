// js/employees.js - النسخة الكاملة والمصححة

document.addEventListener('DOMContentLoaded', () => {
    // استدعاء الملف العام أولاً (للتأكد من بناء القائمة الجانبية)
    if (typeof buildSidebar === 'function') {
        buildSidebar();
    }
    // ثم تحميل بيانات الصفحة الحالية
    loadPageData();
    setupEventListeners();
});

// --- متغيرات عامة ---
const API_BASE_URL = 'http://127.0.0.1:8000/api';
let allPages = [];
let currentEditingId = null;

// --- إعداد الواجهة والوظائف الأساسية ---
function setupEventListeners() {
    document.getElementById('addEmployeeModalBtn')?.addEventListener('click', openAddEmployeeModal);
    
    document.getElementById('addEmployeeForm')?.addEventListener('submit', e => { e.preventDefault(); saveEmployee(); });
    document.getElementById('editEmployeeForm')?.addEventListener('submit', e => { e.preventDefault(); updateEmployee(); });
    
    document.body.addEventListener('click', function(e) {
        const button = e.target.closest('button');
        if (!button) return;

        if (button.classList.contains('close-btn') || button.classList.contains('btn-cancel')) {
            button.closest('.modal')?.classList.remove('active');
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
    } catch (error) {
        showNotification('فشل تحميل البيانات', 'error');
    }
}

function renderEmployeeTable(users) {
    const tableBody = document.getElementById('employeeTableBody');
    if (!tableBody) return;
    tableBody.innerHTML = '';
    if (!users || users.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="no-data">لا يوجد موظفين حالياً.</td></tr>`;
        return;
    }
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.username}</td>
            <td><span class="role-badge ${user.role}">${user.role === 'admin' ? 'مسؤول' : 'موظف'}</span></td>
            <td>${new Date(user.created_at).toLocaleDateString('ar-EG')}</td>
            <td class="actions">
                <button class="action-btn edit" data-action="edit" data-id="${user.id}" title="تعديل"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete" data-action="delete" data-id="${user.id}" title="حذف"><i class="fas fa-trash"></i></button>
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
        grid.innerHTML += `<div class="permission-item"><label><input type="checkbox" name="pages" value="${page.id}"><span>${page.name}</span></label></div>`;
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
    await handleRequest(sendRequest('users', 'POST', data), 'تمت إضافة الموظف بنجاح', () => {
        loadPageData();
        closeModal('addEmployeeModal');
        form.reset();
    });
}

/**
 * [الإصلاح الجذري] - هذه هي الدالة التي تم إصلاحها بالكامل
 */
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
        
        // [الشرح] 1. ننشئ مجموعة (Set) من أرقام الصفحات الخاصة بالموظف لسهولة البحث
        const userPageIds = new Set(user.pages.map(p => p.id));
        
        grid.innerHTML = '';
        allPages.forEach(page => {
            // [الشرح] 2. لكل صفحة، نتحقق إذا كان رقمها موجوداً في مجموعة صفحات الموظف
            const isChecked = userPageIds.has(page.id) ? 'checked' : '';
            grid.innerHTML += `<div class="permission-item"><label><input type="checkbox" name="pages" value="${page.id}" ${isChecked}><span>${page.name}</span></label></div>`;
        });
        openModal('editEmployeeModal');
    } catch (error) {
        showNotification('فشل في جلب بيانات الموظف', 'error');
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
    await handleRequest(sendRequest(`users/${currentEditingId}`, 'PUT', data), 'تم تحديث البيانات بنجاح', () => {
        loadPageData();
        closeModal('editEmployeeModal');
    });
}

async function deleteEmployee(id) {
    if (confirm('هل أنت متأكد من حذف هذا الموظف؟')) {
        await handleRequest(sendRequest(`users/${id}`, 'DELETE'), 'تم حذف الموظف بنجاح', loadPageData);
    }
}

// --- دوال المساعدة (API & Notifications) ---
function openModal(modalId) { document.getElementById(modalId)?.classList.add('active'); }
function closeModal(modalId) { document.getElementById(modalId)?.classList.remove('active'); }

async function sendRequest(endpoint, method, body = null) {
    try {
        const options = { method, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, };
        if (body) { options.body = JSON.stringify(body); }
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
        const data = await response.json();
        if (!response.ok) {
            const errorMessages = Object.values(data.errors || {}).flat().join('\n');
            throw new Error(errorMessages || data.message || 'حدث خطأ غير متوقع');
        }
        return data;
    } catch (error) { console.error(`API Error:`, error); throw error; }
}

async function handleRequest(requestPromise, successMessage, callback) {
    try {
        await requestPromise;
        if (successMessage) showNotification(successMessage, 'success');
        if (callback) await callback();
    } catch (error) { showNotification(`فشل: ${error.message}`, 'error'); }
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
        style.textContent = `.notification { position: fixed; top: 20px; right: 20px; background: white; padding: 15px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 10px; z-index: 10000; transform: translateX(calc(100% + 20px)); transition: transform 0.5s ease-in-out; } .notification.show { transform: translateX(0); } .notification.success { border-left: 5px solid #28a745; } .notification.error { border-left: 5px solid #dc3545; } .notification.info { border-left: 5px solid #17a2b8; }`;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        container.classList.remove('show');
        setTimeout(() => container.remove(), 500);
    }, 4000);
}
