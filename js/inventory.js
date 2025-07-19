// js/inventory.js - النسخة المحسنة والكاملة مع إصلاح جميع المشاكل

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 بدء تحميل صفحة المخزون والأسعار...');
    // التأكد من بناء القائمة الجانبية أولاً
    if (typeof buildSidebar === 'function') {
        buildSidebar();
    }
    setupEventListeners();
    loadInitialData();
    initializeNotificationSounds();
});

// --- متغيرات عامة ---
let currentEditingId = null;
let categoriesCache = [];
let productsCache = [];
let notificationSounds = {};
const API_BASE_URL = 'http://127.0.0.1:8000/api';

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
    console.log('2. بدء إعداد مستمعي الأحداث');
    
    // ربط الأزرار الثابتة
    document.getElementById('sidebarToggle')?.addEventListener('click', toggleSidebar);
    document.getElementById('overlay')?.addEventListener('click', toggleSidebar);
    document.getElementById('refreshInventoryBtn')?.addEventListener('click', loadInitialData);
    document.getElementById('addDeviceTypeModalBtn')?.addEventListener('click', () => openModal('addDeviceTypeModal'));
    document.getElementById('addCategoryModalBtn')?.addEventListener('click', () => openModal('addCategoryModal'));
    document.getElementById('addCouponModalBtn')?.addEventListener('click', () => openModal('addCouponModal'));
    
    // ربط نماذج الحفظ والتعديل
    document.getElementById('addDeviceTypeForm')?.addEventListener('submit', e => { e.preventDefault(); saveDeviceType(); });
    document.getElementById('editDeviceTypeForm')?.addEventListener('submit', e => { e.preventDefault(); updateDeviceType(); });
    document.getElementById('addCategoryForm')?.addEventListener('submit', e => { e.preventDefault(); saveCategory(); });
    document.getElementById('editCategoryForm')?.addEventListener('submit', e => { e.preventDefault(); updateCategory(); });
    document.getElementById('addProductForm')?.addEventListener('submit', e => { e.preventDefault(); saveProduct(); });
    document.getElementById('editProductForm')?.addEventListener('submit', e => { e.preventDefault(); updateProduct(); });
    document.getElementById('addCouponForm')?.addEventListener('submit', e => { e.preventDefault(); saveCoupon(); });
    document.getElementById('editCouponForm')?.addEventListener('submit', e => { e.preventDefault(); updateCoupon(); });

    // استخدام Event Delegation للتحكم في كل النقرات
    document.body.addEventListener('click', function(e) {
        const button = e.target.closest('button');
        if (!button) return;

        // أزرار التنقل بين التبويبات
        if (button.classList.contains('tab-btn') && button.dataset.tab) {
            switchTab(button.dataset.tab);
            return;
        }

        // أزرار الإغلاق في المودالات
        if (button.classList.contains('close-btn') || button.classList.contains('btn-cancel')) {
            const modal = button.closest('.modal');
            if (modal) closeModal(modal.id);
            return;
        }
        
        // أزرار فتح مودال إضافة منتج (لأنها ديناميكية)
        if (button.dataset.modal === 'addProductModal') {
             openModal('addProductModal');
             return;
        }

        // أزرار الإجراءات على الكروت (تعديل, حذف, تفاصيل, ..)
        const { action, type, id } = button.dataset;
        if (action && type && id) {
            const numericId = parseInt(id, 10);
            const functions = {
                deviceType: { edit: editDeviceType, delete: deleteDeviceType, view: viewDeviceTypeDetails },
                category:   { edit: editCategory, delete: deleteCategory, view: viewCategoryProducts },
                product:    { edit: editProduct, delete: deleteProduct, view: viewProductDetails, restock: restockProduct },
                coupon:     { edit: editCoupon, delete: deleteCoupon, renew: renewCoupon }
            };
            functions[type]?.[action]?.(numericId);
        }
    });
    console.log('3. تم الانتهاء من إعداد مستمعي الأحداث.');
}

function switchTab(tabId) {
    if (!tabId) return;
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    const contentToShow = document.getElementById(`${tabId}-content`);
    const buttonToActivate = document.getElementById(`${tabId}-tab`);
    if (contentToShow) contentToShow.classList.add('active');
    if (buttonToActivate) buttonToActivate.classList.add('active');
}

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

function toggleSidebar() { 
    document.getElementById('sidebar')?.classList.toggle('active'); 
    document.getElementById('overlay')?.classList.toggle('active'); 
}

// --- تحميل وعرض البيانات ---
async function loadInitialData() {
    console.log('4. بدء جلب البيانات الأولية...');
    showNotification('جاري تحميل البيانات...', 'info');
    try {
        const [categories, products, deviceTypes, coupons] = await Promise.all([
            sendRequest('categories', 'GET'), 
            sendRequest('products', 'GET'), 
            sendRequest('device-types', 'GET'), 
            sendRequest('coupons', 'GET')
        ]);
        
        if (categories === undefined || products === undefined || deviceTypes === undefined || coupons === undefined) {
            throw new Error('فشل جلب البيانات');
        }
        
        console.log('5. تم استلام كل البيانات.');
        categoriesCache = categories; 
        productsCache = products;
        
        renderDeviceTypes(deviceTypes);
        renderCategories(categories, products);
        renderDynamicProductSections(categories, products);
        renderCoupons(coupons);
        updateStats(products, categories, deviceTypes);
        populateCategoryDropdowns();
        
        playNotificationSound('success');
        showNotification('تم تحميل البيانات بنجاح', 'success');
        console.log('6. تم عرض كل البيانات بنجاح.');
    } catch (error) {
        playNotificationSound('error');
        showNotification("فشل تحميل البيانات، يرجى التحقق من الخادم: " + error.message, "error");
    }
}

function updateStats(products, categories, deviceTypes) {
    const totalProductsEl = document.getElementById('totalProductsCount');
    const totalCategoriesEl = document.getElementById('totalCategoriesCount');
    const lowStockEl = document.getElementById('lowStockProductsCount');
    const inventoryValueEl = document.getElementById('inventoryValue');
    
    if (totalProductsEl) totalProductsEl.textContent = products.length;
    if (totalCategoriesEl) totalCategoriesEl.textContent = categories.length;
    if (lowStockEl) lowStockEl.textContent = products.filter(p => p.stock_quantity < 10).length;
    
    const totalValue = products.reduce((sum, p) => sum + (parseFloat(p.customer_price) * p.stock_quantity), 0);
    if (inventoryValueEl) inventoryValueEl.textContent = totalValue.toFixed(2);
}

// --- دوال العرض الديناميكي ---
function renderDynamicProductSections(categories, products) {
    const container = document.getElementById('dynamic-products-container');
    if (!container) return; 
    container.innerHTML = '';
    
    if (categories.length === 0) {
        container.innerHTML = `<div class="devices-section"><p class="no-data">يرجى إضافة قسم أولاً.</p></div>`; 
        return;
    }
    
    categories.forEach(category => {
        const productsInCategory = products.filter(p => p.category_id === category.id);
        const section = document.createElement('div');
        section.className = 'devices-section';
        section.innerHTML = `
            <div class="section-header">
                <h3>${category.name}</h3>
                <div class="section-actions">
                    <span class="section-count">${productsInCategory.length} منتجات</span>
                    <button class="add-device-btn" data-modal="addProductModal">
                        <i class="fas fa-plus"></i>
                        <span>إضافة منتج</span>
                    </button>
                </div>
            </div>
            <div class="devices-grid" id="product-grid-${category.id}">
                ${productsInCategory.length === 0 ? '<p class="no-data">لا توجد منتجات هنا.</p>' : ''}
            </div>
        `;
        container.appendChild(section);
        
        const productGrid = section.querySelector(`#product-grid-${category.id}`);
        productsInCategory.forEach(product => addProductCardToDOM(product, productGrid));
    });
}

function renderDeviceTypes(deviceTypes) {
    const grid = document.getElementById('deviceTypesGrid');
    if (!grid) return; 
    grid.innerHTML = '';
    
    if (deviceTypes.length === 0) { 
        grid.innerHTML = '<p class="no-data">لا توجد أنواع أجهزة.</p>'; 
    } else { 
        deviceTypes.forEach(addDeviceTypeCardToDOM); 
    }
}

function renderCategories(categories, products) {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return; 
    grid.innerHTML = '';
    
    if (categories.length === 0) { 
        grid.innerHTML = '<p class="no-data">لا توجد أقسام.</p>'; 
    } else { 
        categories.forEach(cat => addCategoryCardToDOM(cat, products)); 
    }
}

function renderCoupons(coupons) {
    const activeGrid = document.getElementById('activeCouponsGrid');
    const expiredGrid = document.getElementById('expiredCouponsGrid');
    if (!activeGrid || !expiredGrid) return;

    activeGrid.innerHTML = ''; 
    expiredGrid.innerHTML = '';
    let activeCount = 0, expiredCount = 0;

    const now = new Date();
    coupons.forEach(coupon => {
        const endDate = new Date(coupon.end_date);
        const isExpired = now > endDate || !coupon.is_active;
        if (isExpired) {
            addCouponCardToDOM(coupon, expiredGrid);
            expiredCount++;
        } else {
            addCouponCardToDOM(coupon, activeGrid);
            activeCount++;
        }
    });

    if (activeCount === 0) activeGrid.innerHTML = '<p class="no-data">لا توجد كوبونات نشطة.</p>';
    if (expiredCount === 0) expiredGrid.innerHTML = '<p class="no-data">لا توجد كوبونات منتهية.</p>';
}

// --- دوال بناء الكروت ---
function addDeviceTypeCardToDOM(deviceType) {
    const grid = document.getElementById('deviceTypesGrid');
    grid.querySelector('.no-data')?.remove();
    const card = document.createElement('div');
    card.id = `device-type-card-${deviceType.id}`;
    card.className = 'device-card';
    card.innerHTML = `
        <button class="device-delete-btn" data-action="delete" data-type="deviceType" data-id="${deviceType.id}">
            <i class="fas fa-trash"></i>
        </button>
        <div class="device-header">
            <div class="device-icon">
                <i class="fas fa-gamepad"></i>
            </div>
            <div class="device-info">
                <h3>${deviceType.name}</h3>
                <span class="device-id">ID: ${deviceType.id}</span>
            </div>
        </div>
        <div class="device-specs">
            <div class="spec-item">
                <span>سعر الفردي:</span>
                <span class="spec-value">${parseFloat(deviceType.single_price).toFixed(2)} ج</span>
            </div>
            <div class="spec-item">
                <span>سعر المتعدد:</span>
                <span class="spec-value">${parseFloat(deviceType.multi_price).toFixed(2)} ج</span>
            </div>
            <div class="spec-item">
                <span>يحتاج غرفة:</span>
                <span class="spec-value">${deviceType.is_room ? 'نعم' : 'لا'}</span>
            </div>
        </div>
        <div class="device-actions">
            <button class="action-btn primary" data-action="edit" data-type="deviceType" data-id="${deviceType.id}">
                <i class="fas fa-edit"></i> 
                <span>تعديل</span>
            </button>
            <button class="action-btn secondary" data-action="view" data-type="deviceType" data-id="${deviceType.id}">
                <i class="fas fa-info-circle"></i> 
                <span>التفاصيل</span>
            </button>
        </div>
    `;
    grid.appendChild(card);
}

function addCategoryCardToDOM(category, products) {
    const grid = document.getElementById('categoriesGrid');
    grid.querySelector('.no-data')?.remove();
    const productCount = products.filter(p => p.category_id === category.id).length;
    const card = document.createElement('div');
    card.id = `category-card-${category.id}`;
    card.className = 'device-card';
    card.innerHTML = `
        <button class="device-delete-btn" data-action="delete" data-type="category" data-id="${category.id}">
            <i class="fas fa-trash"></i>
        </button>
        <div class="device-header">
            <div class="device-icon">
                <i class="${category.icon_class || 'fas fa-tag'}"></i>
            </div>
            <div class="device-info">
                <h3>${category.name}</h3>
            </div>
        </div>
        <div class="device-specs">
            <div class="spec-item">
                <span>عدد المنتجات:</span>
                <span class="spec-value">${productCount}</span>
            </div>
            <div class="spec-item">
                <span>الحالة:</span>
                <span class="spec-value">نشط</span>
            </div>
        </div>
        <div class="device-actions">
            <button class="action-btn primary" data-action="edit" data-type="category" data-id="${category.id}">
                <i class="fas fa-edit"></i> 
                <span>تعديل</span>
            </button>
            <button class="action-btn secondary" data-action="view" data-type="category" data-id="${category.id}">
                <i class="fas fa-eye"></i> 
                <span>عرض المنتجات</span>
            </button>
        </div>
    `;
    grid.appendChild(card);
}

function addProductCardToDOM(product, grid) {
    grid.querySelector('.no-data')?.remove();
    const card = document.createElement('div');
    card.id = `product-card-${product.id}`;
    card.className = product.stock_quantity < 10 ? 'device-card low-stock' : 'device-card';
    card.innerHTML = `
        <div class="device-status-badge ${product.stock_quantity < 10 ? 'busy' : 'available'}">
            ${product.stock_quantity < 10 ? 'قليل' : 'متوفر'}
        </div>
        <button class="device-delete-btn" data-action="delete" data-type="product" data-id="${product.id}">
            <i class="fas fa-trash"></i>
        </button>
        <div class="device-header">
            <div class="device-icon">
                <i class="${product.category?.icon_class || 'fas fa-box-open'}"></i>
            </div>
            <div class="device-info">
                <h3>${product.name}</h3>
                <span class="device-id">${product.category?.name || ''}</span>
            </div>
        </div>
        <div class="device-specs">
            <div class="spec-item">
                <span>سعر العميل:</span>
                <span class="spec-value">${parseFloat(product.customer_price).toFixed(2)} ج</span>
            </div>
            <div class="spec-item">
                <span>المخزون:</span>
                <span class="spec-value">${product.stock_quantity} ${product.unit}</span>
            </div>
        </div>
        <div class="device-actions">
            <button class="action-btn primary" data-action="edit" data-type="product" data-id="${product.id}">
                <i class="fas fa-edit"></i> 
                <span>تعديل</span>
            </button>
            <button class="action-btn secondary" data-action="view" data-type="product" data-id="${product.id}">
                <i class="fas fa-info-circle"></i> 
                <span>التفاصيل</span>
            </button>
            <button class="action-btn secondary" data-action="restock" data-type="product" data-id="${product.id}">
                <i class="fas fa-plus-circle"></i> 
                <span>تجديد</span>
            </button>
        </div>
    `;
    grid.appendChild(card);
}

function addCouponCardToDOM(coupon, grid) {
    grid.querySelector('.no-data')?.remove();
    const isExpired = !coupon.is_active || new Date() > new Date(coupon.end_date);
    const card = document.createElement('div');
    card.id = `coupon-card-${coupon.id}`;
    card.className = isExpired ? 'device-card expired busy' : 'device-card available';
    card.innerHTML = `
        <div class="device-status-badge ${isExpired ? 'busy' : 'available'}">
            ${isExpired ? 'منتهي' : 'نشط'}
        </div>
        <button class="device-delete-btn" data-action="delete" data-type="coupon" data-id="${coupon.id}">
            <i class="fas fa-trash"></i>
        </button>
        <div class="device-header">
            <div class="device-icon">
                <i class="fas fa-ticket-alt"></i>
            </div>
            <div class="device-info">
                <h3>${coupon.name}</h3>
                <span class="device-id">${coupon.code}</span>
            </div>
        </div>
        <div class="device-specs">
            <div class="spec-item">
                <span>الخصم:</span>
                <span class="spec-value">${coupon.value} ${coupon.type === 'percentage' ? '%' : 'ج'}</span>
            </div>
            <div class="spec-item">
                <span>ينتهي في:</span>
                <span class="spec-value">${coupon.end_date}</span>
            </div>
        </div>
        <div class="device-actions">
            ${isExpired ? `
                <button class="action-btn primary" data-action="renew" data-type="coupon" data-id="${coupon.id}">
                    <i class="fas fa-redo"></i> 
                    <span>تجديد</span>
                </button>
            ` : `
                <button class="action-btn primary" data-action="edit" data-type="coupon" data-id="${coupon.id}">
                    <i class="fas fa-edit"></i> 
                    <span>تعديل</span>
                </button>
            `}
        </div>
    `;
    grid.appendChild(card);
}

// --- دوال CRUD (حفظ، تعديل، حذف) ---
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
        
        if (body) options.body = JSON.stringify(body); 
        
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, options); 
        
        if (response.status === 401 || response.status === 419) {
            sessionStorage.clear();
            window.location.href = '/tag/index.php';
            return Promise.reject(new Error("انتهت صلاحية الجلسة"));
        }
        
        if (!response.ok) { 
            const errorData = await response.json(); 
            throw new Error(Object.values(errorData.errors || { server: ['فشل العملية'] }).flat().join('\n')); 
        } 
        
        return response.status !== 204 ? await response.json() : null; 
    } catch (error) { 
        throw error; 
    } 
}

async function handleRequest(requestPromise, successMessage, callback) { 
    try { 
        await requestPromise; 
        if (successMessage) {
            playNotificationSound('success');
            showNotification(successMessage, 'success');
        }
        if (callback) await callback(); 
    } catch (error) { 
        playNotificationSound('error');
        showNotification(`فشل: ${error.message}`, 'error'); 
    } 
}

async function saveDeviceType() { 
    const f = document.getElementById('addDeviceTypeForm');
    const d = { 
        name: f.deviceTypeName.value, 
        is_room: f.hasRoom.checked, 
        single_price: f.singlePrice.value, 
        multi_price: f.multiPrice.value 
    }; 
    await handleRequest(sendRequest('device-types', 'POST', d), 'تم الحفظ', () => { 
        loadInitialData(); 
        closeModal('addDeviceTypeModal'); 
        f.reset(); 
    }); 
}

async function editDeviceType(id) { 
    const d = await sendRequest(`device-types/${id}`, 'GET'); 
    if (d) { 
        currentEditingId = id; 
        const f = document.getElementById('editDeviceTypeForm'); 
        f.editDeviceTypeName.value = d.name; 
        f.editHasRoom.checked = d.is_room; 
        f.editSinglePrice.value = parseFloat(d.single_price); 
        f.editMultiPrice.value = parseFloat(d.multi_price); 
        openModal('editDeviceTypeModal'); 
    } 
}

async function updateDeviceType() { 
    const f = document.getElementById('editDeviceTypeForm');
    const d = { 
        name: f.editDeviceTypeName.value, 
        is_room: f.editHasRoom.checked, 
        single_price: f.editSinglePrice.value, 
        multi_price: f.editMultiPrice.value 
    }; 
    await handleRequest(sendRequest(`device-types/${currentEditingId}`, 'PUT', d), 'تم التحديث', () => { 
        loadInitialData(); 
        closeModal('editDeviceTypeModal'); 
    }); 
}

async function deleteDeviceType(id) { 
    if (confirm('هل أنت متأكد؟')) {
        await handleRequest(sendRequest(`device-types/${id}`, 'DELETE'), 'تم الحذف', loadInitialData); 
    }
}

async function saveCategory() { 
    const f = document.getElementById('addCategoryForm');
    const d = { 
        name: f.categoryName.value, 
        icon_class: f.categoryIcon.value 
    }; 
    await handleRequest(sendRequest('categories', 'POST', d), 'تم حفظ القسم', () => { 
        loadInitialData(); 
        closeModal('addCategoryModal'); 
        f.reset(); 
    }); 
}

async function editCategory(id) { 
    const d = await sendRequest(`categories/${id}`, 'GET'); 
    if (d) { 
        currentEditingId = id; 
        const f = document.getElementById('editCategoryForm'); 
        f.editCategoryName.value = d.name; 
        f.editCategoryIcon.value = d.icon_class; 
        openModal('editCategoryModal'); 
    } 
}

async function updateCategory() { 
    const f = document.getElementById('editCategoryForm');
    const d = { 
        name: f.editCategoryName.value, 
        icon_class: f.editCategoryIcon.value 
    }; 
    await handleRequest(sendRequest(`categories/${currentEditingId}`, 'PUT', d), 'تم التحديث', () => { 
        loadInitialData(); 
        closeModal('editCategoryModal'); 
    }); 
}

async function deleteCategory(id) { 
    if (confirm('هل أنت متأكد؟ سيتم حذف كل المنتجات داخل هذا القسم.')) {
        await handleRequest(sendRequest(`categories/${id}`, 'DELETE'), 'تم الحذف', loadInitialData); 
    }
}

async function saveProduct() { 
    const f = document.getElementById('addProductForm');
    const d = { 
        name: f.productName.value, 
        category_id: f.productCategory.value, 
        employee_price: f.employeePrice.value, 
        customer_price: f.customerPrice.value, 
        stock_quantity: f.productQuantity.value, 
        unit: f.quantityUnit.value, 
        description: f.productDescription.value 
    }; 
    await handleRequest(sendRequest('products', 'POST', d), 'تم حفظ المنتج', () => { 
        loadInitialData(); 
        closeModal('addProductModal'); 
        f.reset(); 
    }); 
}

async function editProduct(id) { 
    const d = await sendRequest(`products/${id}`, 'GET'); 
    if(d){ 
        currentEditingId = id; 
        const f = document.getElementById('editProductForm'); 
        f.editProductName.value = d.name; 
        f.editProductCategory.value = d.category_id; 
        f.editEmployeePrice.value = parseFloat(d.employee_price); 
        f.editCustomerPrice.value = parseFloat(d.customer_price); 
        f.editProductQuantity.value = d.stock_quantity; 
        f.editQuantityUnit.value = d.unit; 
        f.editProductDescription.value = d.description || ''; 
        openModal('editProductModal'); 
    } 
}

async function updateProduct() { 
    const f = document.getElementById('editProductForm');
    const d = { 
        name: f.editProductName.value, 
        category_id: f.editProductCategory.value, 
        employee_price: f.editEmployeePrice.value, 
        customer_price: f.editCustomerPrice.value, 
        stock_quantity: f.editProductQuantity.value, 
        unit: f.editQuantityUnit.value, 
        description: f.editProductDescription.value 
    }; 
    await handleRequest(sendRequest(`products/${currentEditingId}`, 'PUT', d), 'تم التحديث', () => { 
        loadInitialData(); 
        closeModal('editProductModal'); 
    }); 
}

async function deleteProduct(id) { 
    if (confirm('هل أنت متأكد؟')) {
        await handleRequest(sendRequest(`products/${id}`, 'DELETE'), 'تم الحذف', loadInitialData); 
    }
}

async function saveCoupon() { 
    const f = document.getElementById('addCouponForm');
    const d = { 
        name: f.couponName.value, 
        code: f.couponCode.value, 
        type: f.discountType.value, 
        value: f.discountValue.value, 
        start_date: f.couponStartDate.value, 
        end_date: f.couponEndDate.value 
    }; 
    await handleRequest(sendRequest('coupons', 'POST', d), 'تم حفظ الكوبون', () => { 
        loadInitialData(); 
        closeModal('addCouponModal'); 
        f.reset(); 
    }); 
}

async function editCoupon(id) { 
    const d = await sendRequest(`coupons/${id}`, 'GET'); 
    if (d) { 
        currentEditingId = id; 
        const f = document.getElementById('editCouponForm'); 
        f.editCouponName.value = d.name; 
        f.editCouponCode.value = d.code; 
        f.editDiscountType.value = d.type; 
        f.editDiscountValue.value = parseFloat(d.value); 
        f.editCouponStartDate.value = d.start_date; 
        f.editCouponEndDate.value = d.end_date; 
        f.editIsActive.checked = d.is_active; 
        openModal('editCouponModal'); 
    } 
}

async function updateCoupon() { 
    const f = document.getElementById('editCouponForm');
    const d = { 
        name: f.editCouponName.value, 
        code: f.editCouponCode.value, 
        type: f.editDiscountType.value, 
        value: f.editDiscountValue.value, 
        start_date: f.editCouponStartDate.value, 
        end_date: f.editCouponEndDate.value, 
        is_active: f.editIsActive.checked 
    }; 
    await handleRequest(sendRequest(`coupons/${currentEditingId}`, 'PUT', d), 'تم التحديث', () => { 
        loadInitialData(); 
        closeModal('editCouponModal'); 
    }); 
}

async function deleteCoupon(id) { 
    if (confirm('هل أنت متأكد؟')) {
        await handleRequest(sendRequest(`coupons/${id}`, 'DELETE'), 'تم الحذف', loadInitialData); 
    }
}

async function renewCoupon(id) { 
    editCoupon(id); 
}

// --- دوال تفعيل الأزرار ---
async function viewDeviceTypeDetails(id) { 
    showNotification(`تفاصيل نوع الجهاز ${id} قيد التطوير.`, 'info'); 
}

async function viewProductDetails(id) { 
    const p = await sendRequest(`products/${id}`, 'GET'); 
    if(p){ 
        document.getElementById('detailProductName').textContent = p.name; 
        document.getElementById('detailProductCategory').textContent = p.category?.name || '-'; 
        document.getElementById('detailEmployeePrice').textContent = `${parseFloat(p.employee_price).toFixed(2)} ج`; 
        document.getElementById('detailCustomerPrice').textContent = `${parseFloat(p.customer_price).toFixed(2)} ج`; 
        document.getElementById('detailProductStock').textContent = `${p.stock_quantity} ${p.unit}`; 
        document.getElementById('detailProductDescription').textContent = p.description || '-'; 
        openModal('productDetailsModal'); 
    } 
}

async function restockProduct(id) { 
    const q = prompt('الكمية المراد إضافتها:', '0'); 
    if (q && !isNaN(q) && parseInt(q) > 0) {
        await handleRequest(sendRequest(`products/${id}/restock`, 'POST', { quantity: parseInt(q) }), 'تم تحديث المخزون', loadInitialData); 
    } else if (q !== null) {
        showNotification('يرجى إدخال رقم صحيح', 'error'); 
    }
}

function viewCategoryProducts(categoryId) { 
    const c = categoriesCache.find(cat => cat.id === categoryId);
    const p = productsCache.filter(prod => prod.category_id === categoryId); 
    if (!c) return; 
    
    document.getElementById('categoryProductsTitle').textContent = c.name; 
    document.getElementById('categoryTotalProducts').textContent = `${p.length} منتجات`; 
    document.getElementById('categoryTotalStock').textContent = `${p.reduce((s, i) => s + i.stock_quantity, 0)} وحدة`; 
    
    const t = document.getElementById('categoryProductsTableBody'); 
    t.innerHTML = ''; 
    
    if (p.length > 0) {
        p.forEach(item => { 
            t.innerHTML += `
                <tr>
                    <td>${item.name}</td>
                    <td>${parseFloat(item.customer_price).toFixed(2)} ج</td>
                    <td>${item.stock_quantity} ${item.unit}</td>
                    <td>
                        <span class="status-badge ${item.stock_quantity < 10 ? 'busy' : 'available'}">
                            ${item.stock_quantity < 10 ? 'قليل' : 'متوفر'}
                        </span>
                    </td>
                </tr>
            `; 
        }); 
    } else {
        t.innerHTML = `<tr><td colspan="4" class="no-data">لا توجد منتجات.</td></tr>`; 
    }
    
    openModal('categoryProductsModal'); 
}

// --- دوال مساعدة ---
function populateCategoryDropdowns() { 
    const ss = ['#productCategory', '#editProductCategory']; 
    ss.forEach(sId => { 
        const s = document.querySelector(sId); 
        if (!s) return; 
        const v = s.value; 
        s.innerHTML = '<option value="">اختر القسم</option>'; 
        categoriesCache.forEach(c => s.innerHTML += `<option value="${c.id}">${c.name}</option>`); 
        s.value = v; 
    }); 
}

function showNotification(message, type = 'info') { 
    const c = document.createElement('div'); 
    c.className = `notification show ${type}`; 
    const i = { 
        success: 'fa-check-circle', 
        error: 'fa-times-circle', 
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    }; 
    c.innerHTML = `<i class="fas ${i[type]}"></i><span style="margin-right: 10px;">${message}</span>`; 
    document.body.appendChild(c); 

    if (!document.getElementById('notification-styles')) { 
        const s = document.createElement('style'); 
        s.id = 'notification-styles'; 
        s.textContent = `
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
        document.head.appendChild(s); 
    } 
    
    setTimeout(() => { 
        c.classList.remove('show'); 
        setTimeout(() => c.remove(), 500); 
    }, 4000); 
}