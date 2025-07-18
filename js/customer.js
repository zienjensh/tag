// public/js/customer.js - النسخة الكاملة والنهائية

document.addEventListener('DOMContentLoaded', () => {
    // التأكد من بناء القائمة الجانبية أولاً
    if (typeof buildSidebar === 'function') {
        buildSidebar();
    }
    loadPageData();
    setupEventListeners();
});

const API_BASE_URL = 'http://127.0.0.1:8000/api';
let currentEditingId = null;
let searchTimeout = null;

function setupEventListeners() {
    // الأزرار الثابتة
    document.getElementById('addCustomerModalBtn')?.addEventListener('click', () => openModal('addCustomerModal'));
    
    // نماذج الإضافة والتعديل
    document.getElementById('addCustomerForm')?.addEventListener('submit', e => { e.preventDefault(); saveCustomer(); });
    document.getElementById('editCustomerForm')?.addEventListener('submit', e => { e.preventDefault(); updateCustomer(); });
    
    // البحث
    document.getElementById('customerSearchInput')?.addEventListener('keyup', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            loadPageData(e.target.value);
        }, 500);
    });

    // استخدام Event Delegation للأزرار الديناميكية
    document.body.addEventListener('click', function(e) {
        const button = e.target.closest('button');
        if (!button) return;

        if (button.classList.contains('close-btn') || button.classList.contains('btn-cancel')) {
            const modal = button.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        }

        const { action, id } = button.dataset;
        if (!action || !id) return;
        
        const numericId = parseInt(id, 10);
        if (action === 'edit') editCustomer(numericId);
        if (action === 'delete') deleteCustomer(numericId);
        if (action === 'view-details') viewCustomerDetails(numericId);
    });
}

async function loadPageData(searchTerm = '') {
    showNotification('جاري تحميل بيانات العملاء...', 'info');
    try {
        const url = searchTerm ? `customers?search=${searchTerm}` : 'customers';
        const customers = await sendRequest(url, 'GET');
        
        renderCustomerTable(customers);
        updateSummaryCards(customers);
    } catch (error) {
        showNotification('فشل تحميل البيانات', 'error');
    }
}

function renderCustomerTable(customers) {
    const tableBody = document.getElementById('customerTableBody');
    if (!tableBody) return;
    tableBody.innerHTML = '';
    if (!customers || customers.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="no-data">لا يوجد عملاء مسجلين.</td></tr>`;
        return;
    }
    customers.forEach(customer => {
        const row = document.createElement('tr');
        const balanceClass = parseFloat(customer.balance) > 0 ? 'text-danger' : 'text-success';
        const lastTransaction = customer.last_transaction ? new Date(customer.last_transaction).toLocaleDateString('ar-EG') : 'لا يوجد';
        
        row.innerHTML = `
            <td>${customer.customer_code}</td>
            <td>${customer.name}</td>
            <td>${customer.phone || '-'}</td>
            <td class="${balanceClass}">${parseFloat(customer.balance).toFixed(2)} ج</td>
            <td>${lastTransaction}</td>
            <td><span class="status-badge ${customer.is_active ? 'available' : 'busy'}">${customer.is_active ? 'نشط' : 'غير نشط'}</span></td>
            <td class="actions">
                <button class="action-btn view" data-action="view-details" data-id="${customer.id}" title="تفاصيل"><i class="fas fa-info-circle"></i></button>
                <button class="action-btn edit" data-action="edit" data-id="${customer.id}" title="تعديل"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete" data-action="delete" data-id="${customer.id}" title="حذف"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function updateSummaryCards(customers) {
    const totalDue = customers.reduce((sum, cust) => sum + parseFloat(cust.balance), 0);
    document.getElementById('totalDueAmount').textContent = totalDue.toFixed(2);
    document.getElementById('totalCustomersCount').textContent = `${customers.length} عملاء`;
}

async function saveCustomer() {
    const form = document.getElementById('addCustomerForm');
    const data = {
        name: form.customerName.value,
        phone: form.customerPhone.value,
        notes: form.customerNotes.value
    };
    await handleRequest(sendRequest('customers', 'POST', data), 'تمت إضافة العميل بنجاح', () => {
        loadPageData();
        closeModal('addCustomerModal');
        form.reset();
    });
}

async function editCustomer(id) {
    try {
        const customer = await sendRequest(`customers/${id}`, 'GET');
        if (!customer) return;
        
        currentEditingId = id;
        const form = document.getElementById('editCustomerForm');
        form.editCustomerName.value = customer.name;
        form.editCustomerPhone.value = customer.phone;
        form.editCustomerNotes.value = customer.notes;
        form.editCustomerIsActive.checked = customer.is_active;
        openModal('editCustomerModal');
    } catch (error) {
        showNotification('فشل في جلب بيانات العميل', 'error');
    }
}

async function updateCustomer() {
    if (!currentEditingId) return;
    const form = document.getElementById('editCustomerForm');
    const data = {
        name: form.editCustomerName.value,
        phone: form.editCustomerPhone.value,
        notes: form.editCustomerNotes.value,
        is_active: form.editCustomerIsActive.checked
    };
    await handleRequest(sendRequest(`customers/${currentEditingId}`, 'PUT', data), 'تم تحديث البيانات بنجاح', () => {
        loadPageData();
        closeModal('editCustomerModal');
    });
}

async function deleteCustomer(id) {
    if (confirm('هل أنت متأكد من حذف هذا العميل؟')) {
        await handleRequest(sendRequest(`customers/${id}`, 'DELETE'), 'تم حذف العميل بنجاح', loadPageData);
    }
}

async function viewCustomerDetails(id) {
    try {
        const customer = await sendRequest(`customers/${id}`, 'GET');
        if (!customer) return;
        document.getElementById('detailCustomerCode').textContent = customer.customer_code;
        document.getElementById('detailCustomerName').textContent = customer.name;
        document.getElementById('detailCustomerPhone').textContent = customer.phone || '-';
        document.getElementById('detailCustomerBalance').textContent = `${parseFloat(customer.balance).toFixed(2)} ج`;
        document.getElementById('detailCustomerSince').textContent = new Date(customer.created_at).toLocaleDateString('ar-EG');
        document.getElementById('detailLastTransaction').textContent = customer.last_transaction ? new Date(customer.last_transaction).toLocaleDateString('ar-EG') : 'لا يوجد';
        document.getElementById('detailCustomerNotes').textContent = customer.notes || 'لا يوجد';
        openModal('customerDetailsModal');
    } catch (error) {
        showNotification('فشل في عرض التفاصيل', 'error');
    }
}

// --- دوال المساعدة ---
function openModal(modalId) { document.getElementById(modalId)?.classList.add('active'); }
function closeModal(modalId) { document.getElementById(modalId)?.classList.remove('active'); }
async function sendRequest(endpoint, method, body = null) { try { const options = { method, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, }; if (body) { options.body = JSON.stringify(body); } const response = await fetch(`${API_BASE_URL}/${endpoint}`, options); const data = await response.json(); if (!response.ok) { const errorMessages = Object.values(data.errors || {}).flat().join('\n'); throw new Error(errorMessages || data.message || 'حدث خطأ غير متوقع'); } return data; } catch (error) { console.error(`API Error:`, error); throw error; } }
async function handleRequest(requestPromise, successMessage, callback) { try { await requestPromise; if (successMessage) showNotification(successMessage, 'success'); if (callback) await callback(); } catch (error) { showNotification(`فشل: ${error.message}`, 'error'); } }
function showNotification(message, type = 'info') { const container = document.createElement('div'); container.className = `notification show ${type}`; const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle' }; container.innerHTML = `<i class="fas ${icons[type]}"></i><span style="margin-right: 10px;">${message}</span>`; document.body.appendChild(container); if (!document.getElementById('notification-styles')) { const style = document.createElement('style'); style.id = 'notification-styles'; style.textContent = `.notification { position: fixed; top: 20px; right: 20px; background: white; padding: 15px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 10px; z-index: 10000; transform: translateX(calc(100% + 20px)); transition: transform 0.5s ease-in-out; } .notification.show { transform: translateX(0); } .notification.success { border-left: 5px solid #28a745; } .notification.error { border-left: 5px solid #dc3545; } .notification.info { border-left: 5px solid #17a2b8; }`; document.head.appendChild(style); } setTimeout(() => { container.classList.remove('show'); setTimeout(() => container.remove(), 500); }, 4000); }