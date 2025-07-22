// js/customer.js - النسخة المحسنة والمستقرة

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 بدء تحميل صفحة العملاء...');
    
    // التأكد من بناء القائمة الجانبية أولاً
    if (typeof buildSidebar === 'function') {
        buildSidebar();
    }
    
    setupEventListeners();
    loadPageData();
    initializeNotificationSounds();
    
    console.log('✅ تم تحميل صفحة العملاء بنجاح');
});

const API_BASE_URL = 'http://127.0.0.1:8000/api';
let currentEditingId = null;
let searchTimeout = null;
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

function setupEventListeners() {
    console.log('🔗 إعداد مستمعي الأحداث...');
    
    // الأزرار الثابتة
    const addCustomerBtn = document.getElementById('addCustomerModalBtn');
    if (addCustomerBtn) {
        addCustomerBtn.addEventListener('click', () => {
            console.log('🔘 تم الضغط على زر إضافة عميل');
            openModal('addCustomerModal');
        });
    } else {
        console.error('❌ لم يتم العثور على زر إضافة العميل');
    }
    
    // نماذج الإضافة والتعديل
    const addForm = document.getElementById('addCustomerForm');
    if (addForm) {
        addForm.addEventListener('submit', e => { 
            e.preventDefault(); 
            saveCustomer(); 
        });
    }
    
    const editForm = document.getElementById('editCustomerForm');
    if (editForm) {
        editForm.addEventListener('submit', e => { 
            e.preventDefault(); 
            updateCustomer(); 
        });
    }
    
    // البحث
    const searchInput = document.getElementById('customerSearchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                loadPageData(e.target.value);
            }, 500);
        });
    }

    // استخدام Event Delegation للأزرار الديناميكية
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
        if (!action || !id) return;
        
        const numericId = parseInt(id, 10);
        if (action === 'edit') editCustomer(numericId);
        if (action === 'delete') deleteCustomer(numericId);
        if (action === 'view-details') viewCustomerDetails(numericId);
    });
    
    console.log('✅ تم إعداد جميع مستمعي الأحداث');
}

async function loadPageData(searchTerm = '') {
    console.log('📡 جاري تحميل بيانات العملاء...');
    showNotification('جاري تحميل بيانات العملاء...', 'info');
    
    try {
        const url = searchTerm ? `customers?search=${encodeURIComponent(searchTerm)}` : 'customers';
        const customers = await sendRequest(url, 'GET');
        
        console.log('📨 تم استلام بيانات العملاء:', customers);
        
        renderCustomerTable(customers);
        updateSummaryCards(customers);
        
        playNotificationSound('success');
        showNotification('تم تحميل البيانات بنجاح', 'success');
    } catch (error) {
        console.error('❌ خطأ في تحميل البيانات:', error);
        playNotificationSound('error');
        showNotification('فشل تحميل البيانات: ' + error.message, 'error');
    }
}

function renderCustomerTable(customers) {
    console.log('🎨 رسم جدول العملاء...');
    const tableBody = document.getElementById('customerTableBody');
    if (!tableBody) {
        console.error('❌ لم يتم العثور على جسم الجدول');
        return;
    }
    
    tableBody.innerHTML = '';
    
    if (!customers || customers.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="no-data-cell">
                    <div class="no-data-content">
                        <i class="fas fa-users"></i>
                        <h4>لا يوجد عملاء مسجلين</h4>
                        <p>قم بإضافة أول عميل للبدء</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    customers.forEach(customer => {
        const row = document.createElement('tr');
        const balanceClass = parseFloat(customer.balance) > 0 ? 'text-danger' : 'text-success';
        const lastTransaction = customer.last_transaction ? 
            new Date(customer.last_transaction).toLocaleDateString('ar-EG') : 'لا يوجد';
        
        row.innerHTML = `
            <td>${customer.customer_code}</td>
            <td>${customer.name}</td>
            <td>${customer.phone || '-'}</td>
            <td class="${balanceClass}">${parseFloat(customer.balance).toFixed(2)} ج</td>
            <td>${lastTransaction}</td>
            <td>
                <span class="status-badge ${customer.is_active ? 'available' : 'busy'}">
                    ${customer.is_active ? 'نشط' : 'غير نشط'}
                </span>
            </td>
            <td class="actions">
                <div class="action-buttons">
                    <button class="btn-action btn-view" data-action="view-details" data-id="${customer.id}" title="تفاصيل">
                        <i class="fas fa-info-circle"></i>
                    </button>
                    <button class="btn-action btn-edit" data-action="edit" data-id="${customer.id}" title="تعديل">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action btn-delete" data-action="delete" data-id="${customer.id}" title="حذف">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    console.log(`✅ تم رسم ${customers.length} عميل في الجدول`);
}

function updateSummaryCards(customers) {
    const totalDue = customers.reduce((sum, cust) => sum + parseFloat(cust.balance), 0);
    const totalDueEl = document.getElementById('totalDueAmount');
    const totalCustomersEl = document.getElementById('totalCustomersCount');
    
    if (totalDueEl) totalDueEl.textContent = totalDue.toFixed(2);
    if (totalCustomersEl) totalCustomersEl.textContent = `${customers.length} عملاء`;
}

async function saveCustomer() {
    console.log('💾 حفظ عميل جديد...');
    
    const form = document.getElementById('addCustomerForm');
    const data = {
        name: form.customerName.value,
        phone: form.customerPhone.value,
        notes: form.customerNotes.value
    };
    
    try {
        await sendRequest('customers', 'POST', data);
        playNotificationSound('success');
        showNotification('تمت إضافة العميل بنجاح', 'success');
        loadPageData();
        closeModal('addCustomerModal');
        form.reset();
    } catch (error) {
        playNotificationSound('error');
        showNotification('فشل في إضافة العميل: ' + error.message, 'error');
    }
}

async function editCustomer(id) {
    console.log('✏️ تعديل العميل:', id);
    
    try {
        const customer = await sendRequest(`customers/${id}`, 'GET');
        if (!customer) return;
        
        currentEditingId = id;
        const form = document.getElementById('editCustomerForm');
        form.editCustomerName.value = customer.name;
        form.editCustomerPhone.value = customer.phone || '';
        form.editCustomerNotes.value = customer.notes || '';
        form.editCustomerIsActive.checked = customer.is_active;
        
        openModal('editCustomerModal');
    } catch (error) {
        playNotificationSound('error');
        showNotification('فشل في جلب بيانات العميل: ' + error.message, 'error');
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
    
    try {
        await sendRequest(`customers/${currentEditingId}`, 'PUT', data);
        playNotificationSound('success');
        showNotification('تم تحديث البيانات بنجاح', 'success');
        loadPageData();
        closeModal('editCustomerModal');
    } catch (error) {
        playNotificationSound('error');
        showNotification('فشل في تحديث البيانات: ' + error.message, 'error');
    }
}

async function deleteCustomer(id) {
    if (confirm('هل أنت متأكد من حذف هذا العميل؟')) {
        try {
            await sendRequest(`customers/${id}`, 'DELETE');
            playNotificationSound('success');
            showNotification('تم حذف العميل بنجاح', 'success');
            loadPageData();
        } catch (error) {
            playNotificationSound('error');
            showNotification('فشل في حذف العميل: ' + error.message, 'error');
        }
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
        document.getElementById('detailLastTransaction').textContent = customer.last_transaction ? 
            new Date(customer.last_transaction).toLocaleDateString('ar-EG') : 'لا يوجد';
        document.getElementById('detailCustomerNotes').textContent = customer.notes || 'لا يوجد';
        
        openModal('customerDetailsModal');
    } catch (error) {
        playNotificationSound('error');
        showNotification('فشل في عرض التفاصيل: ' + error.message, 'error');
    }
}

// دوال المساعدة
function openModal(modalId) { 
    console.log('🔓 فتح المودال:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        console.error('❌ لم يتم العثور على المودال:', modalId);
    }
}

function closeModal(modalId) { 
    console.log('🔒 إغلاق المودال:', modalId);
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