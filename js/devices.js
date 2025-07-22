// devices.js - النسخة المحسنة والكاملة مع إصلاح جميع المشاكل

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 بدء تحميل صفحة الأجهزة...');
    
    if (typeof buildSidebar === 'function') {
        buildSidebar();
    }
    
    initializePage();
    setupEventListeners();
    loadPageData();
    setInterval(updateTimers, 1000); // تحديث العدادات كل ثانية
    initializeNotificationSounds();
    
    console.log('✅ تم تحميل صفحة الأجهزة بنجاح');
});

let devices = [];
let deviceTypes = [];
let categories = [];
let products = [];
let activeShift = null;
let currentSessionId = null;
let currentOrder = {};
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

function initializePage() {
    console.log('🔧 تهيئة الصفحة...');
    // تفعيل التبويب الأول
    switchTab('devices');
}

function setupEventListeners() {
    console.log('🔗 إعداد مستمعي الأحداث...');
    
    // أزرار إضافة الأجهزة
    const addDeviceBtn = document.getElementById('addDeviceModalBtn');
    if (addDeviceBtn) {
        addDeviceBtn.addEventListener('click', () => {
            console.log('🔘 تم الضغط على زر إضافة جهاز');
            openModal('addDeviceModal');
        });
    }
    
    // نماذج الحفظ
    const addDeviceForm = document.getElementById('addDeviceForm');
    if (addDeviceForm) {
        addDeviceForm.addEventListener('submit', e => { 
            e.preventDefault(); 
            saveDevice(); 
        });
    }
    
    const startSessionForm = document.getElementById('startSessionForm');
    if (startSessionForm) {
        startSessionForm.addEventListener('submit', e => { 
            e.preventDefault(); 
            startSession(); 
        });
    }
    
    const saveBuffetOrderBtn = document.getElementById('saveBuffetOrderBtn');
    if (saveBuffetOrderBtn) {
        saveBuffetOrderBtn.addEventListener('click', saveBuffetOrder);
    }

    // التنقل بين التبويبات
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            console.log('🔄 تبديل التبويب إلى:', tabId);
            switchTab(tabId);
        });
    });

    // Event Delegation للأزرار الديناميكية
    document.body.addEventListener('click', e => {
        const button = e.target.closest('button');
        if (!button) return;

        // أزرار الإغلاق
        if (button.classList.contains('close-btn') || button.classList.contains('btn-cancel')) {
            const modal = button.closest('.modal');
            if (modal) {
                console.log('❌ إغلاق المودال:', modal.id);
                closeModal(modal.id);
            }
            return;
        }

        // أزرار الإجراءات على الأجهزة
        const { action, id } = button.dataset;
        if (action && id) {
            console.log('⚡ تنفيذ إجراء:', action, 'على الجهاز:', id);
            handleDeviceAction(action, parseInt(id));
        }

        // أزرار البوفيه
        if (button.classList.contains('category-btn')) {
            selectCategory(button);
        }

        if (button.classList.contains('add-to-order-btn')) {
            const productId = button.dataset.productId;
            const productName = button.dataset.productName;
            const productPrice = parseFloat(button.dataset.productPrice);
            addToOrder(productId, productName, productPrice);
        }
    });
    
    console.log('✅ تم إعداد جميع مستمعي الأحداث');
}

async function loadPageData() {
    console.log('📡 جاري تحميل بيانات الصفحة...');
    showNotification('جاري تحميل البيانات...', 'info');
    
    try {
        const data = await sendRequest('/api/devices-page-data', 'GET');
        console.log('📨 تم استلام البيانات:', data);
        
        devices = data.devices || [];
        deviceTypes = data.deviceTypes || [];
        categories = data.categories || [];
        products = data.products || [];
        activeShift = data.shift;
        
        renderDeviceCards();
        updateSummaryCards(data.stats);
        populateDeviceTypeSelect();
        renderBuffetCategories();
        renderInvoicesTable(data.invoices || []);
        
        playNotificationSound('success');
        showNotification('تم تحميل البيانات بنجاح', 'success');
        console.log('✅ تم تحميل جميع البيانات بنجاح');
    } catch (error) {
        console.error('❌ خطأ في تحميل البيانات:', error);
        playNotificationSound('error');
        showNotification('فشل تحميل البيانات: ' + error.message, 'error');
    }
}

function renderDeviceCards() {
    console.log('🎨 رسم بطاقات الأجهزة...');
    const container = document.getElementById('devicesGridContainer');
    if (!container) {
        console.error('❌ لم يتم العثور على حاوية الأجهزة');
        return;
    }
    
    container.innerHTML = '';
    
    if (devices.length === 0) {
        container.innerHTML = `
            <div class="no-data">
                <i class="fas fa-desktop"></i>
                <h3>لا توجد أجهزة</h3>
                <p>قم بإضافة جهاز جديد للبدء</p>
            </div>
        `;
        return;
    }

    devices.forEach(device => {
        const card = createDeviceCard(device);
        container.appendChild(card);
    });
    
    console.log(`✅ تم رسم ${devices.length} بطاقة جهاز`);
}

function createDeviceCard(device) {
    const card = document.createElement('div');
    card.className = `device-card ${device.status}`;
    card.id = `device-card-${device.id}`;
    
    const session = device.active_session;
    const isActive = device.status === 'busy' && session;
    
    card.innerHTML = `
        <div class="device-status-badge ${device.status}">
            ${device.status === 'available' ? 'متاح' : device.status === 'busy' ? 'مشغول' : 'صيانة'}
        </div>
        
        <button class="device-delete-btn" data-action="delete" data-id="${device.id}" title="حذف الجهاز">
            <i class="fas fa-trash"></i>
        </button>
        
        <div class="device-header">
            <div class="device-icon">
                <i class="fas fa-gamepad"></i>
            </div>
            <div class="device-info">
                <h3>${device.name}</h3>
                <span class="device-id">${device.device_type?.name || 'غير محدد'}</span>
            </div>
        </div>
        
        ${isActive ? `
            <div class="device-timer" id="timer-${device.id}">
                <div class="timer-display">
                    <div class="timer-circle">
                        <span class="timer-value" id="timer-value-${device.id}">00:00:00</span>
                    </div>
                    <div class="timer-info">
                        <span>نوع اللعب: ${session.play_type === 'single' ? 'فردي' : 'متعدد'}</span>
                    </div>
                </div>
            </div>
            
            <div class="device-specs">
                <div class="spec-item">
                    <span class="spec-label">تكلفة اللعب:</span>
                    <span class="spec-value" id="play-cost-${device.id}">0.00 ج</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">تكلفة البوفيه:</span>
                    <span class="spec-value">${parseFloat(session.buffet_cost || 0).toFixed(2)} ج</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">الإجمالي:</span>
                    <span class="spec-value total-cost" id="total-cost-${device.id}">0.00 ج</span>
                </div>
            </div>
        ` : `
            <div class="device-specs">
                <div class="spec-item">
                    <span class="spec-label">سعر الفردي:</span>
                    <span class="spec-value">${parseFloat(device.device_type?.single_price || 0).toFixed(2)} ج/ساعة</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">سعر المتعدد:</span>
                    <span class="spec-value">${parseFloat(device.device_type?.multi_price || 0).toFixed(2)} ج/ساعة</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">يحتاج غرفة:</span>
                    <span class="spec-value">${device.device_type?.is_room ? 'نعم' : 'لا'}</span>
                </div>
            </div>
        `}
        
        <div class="device-actions">
            ${device.status === 'available' ? `
                <button class="action-btn primary" data-action="start" data-id="${device.id}">
                    <i class="fas fa-play"></i>
                    <span>بدء وقت</span>
                </button>
            ` : ''}
            
            <button class="action-btn secondary" data-action="invoice" data-id="${device.id}">
                <i class="fas fa-receipt"></i>
                <span>الفاتورة والبوفيه</span>
            </button>
            
            <button class="action-btn info" data-action="details" data-id="${device.id}">
                <i class="fas fa-info-circle"></i>
                <span>التفاصيل</span>
            </button>
        </div>
    `;
    
    return card;
}

function updateSummaryCards(stats) {
    if (!stats) return;
    
    console.log('📊 تحديث بطاقات الإحصائيات:', stats);
    
    const totalDevicesEl = document.getElementById('totalDevices');
    const busyDevicesEl = document.getElementById('busyDevices');
    const availableDevicesEl = document.getElementById('availableDevices');
    const todayRevenueEl = document.getElementById('todayDevicesRevenue');
    
    if (totalDevicesEl) totalDevicesEl.textContent = stats.totalDevices || 0;
    if (busyDevicesEl) busyDevicesEl.textContent = stats.busyDevices || 0;
    if (availableDevicesEl) availableDevicesEl.textContent = stats.availableDevices || 0;
    if (todayRevenueEl) todayRevenueEl.textContent = parseFloat(stats.todayRevenue || 0).toFixed(2);
}

function populateDeviceTypeSelect() {
    const select = document.getElementById('deviceTypeSelect');
    if (!select) return;
    
    select.innerHTML = '<option value="">اختر النوع...</option>';
    deviceTypes.forEach(type => {
        select.innerHTML += `<option value="${type.id}">${type.name} - فردي: ${type.single_price}ج - متعدد: ${type.multi_price}ج</option>`;
    });
}

function renderBuffetCategories() {
    const container = document.getElementById('buffetCategoryList');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (categories.length === 0) {
        container.innerHTML = '<p class="no-categories">لا توجد أقسام متاحة</p>';
        return;
    }

    categories.forEach((category, index) => {
        const btn = document.createElement('button');
        btn.className = `category-btn ${index === 0 ? 'active' : ''}`;
        btn.textContent = category.name;
        btn.dataset.categoryId = category.id;
        container.appendChild(btn);
    });
    
    // عرض المنتجات الأولى
    if (categories.length > 0) {
        renderBuffetProducts(categories[0].id);
    }
}

function selectCategory(button) {
    // إزالة النشاط من جميع الأزرار
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    const categoryId = parseInt(button.dataset.categoryId);
    renderBuffetProducts(categoryId);
}

function renderBuffetProducts(categoryId) {
    const container = document.getElementById('buffetProductGrid');
    if (!container) return;
    
    const categoryProducts = products.filter(p => p.category_id === categoryId);
    container.innerHTML = '';
    
    if (categoryProducts.length === 0) {
        container.innerHTML = '<p class="no-products">لا توجد منتجات في هذا القسم</p>';
        return;
    }

    categoryProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-icon">
                <i class="${product.category?.icon_class || 'fas fa-box'}"></i>
            </div>
            <h4>${product.name}</h4>
            <p class="price">${parseFloat(product.customer_price).toFixed(2)} ج</p>
            <p class="stock">متوفر: ${product.stock_quantity} ${product.unit}</p>
            <button class="add-to-order-btn" 
                    data-product-id="${product.id}"
                    data-product-name="${product.name}"
                    data-product-price="${product.customer_price}"
                    ${product.stock_quantity <= 0 ? 'disabled' : ''}>
                <i class="fas fa-plus"></i>
                إضافة
            </button>
        `;
        container.appendChild(productCard);
    });
}

function renderInvoicesTable(invoices) {
    const tbody = document.getElementById('invoicesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (invoices.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="no-data-cell">
                    <div class="no-data-content">
                        <i class="fas fa-receipt"></i>
                        <h4>لا توجد فواتير</h4>
                        <p>لم يتم إنشاء أي فواتير اليوم</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    invoices.forEach((invoice, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${String(index + 1).padStart(4, '0')}</td>
            <td>${invoice.description}</td>
            <td>${parseFloat(invoice.amount).toFixed(2)} ج</td>
            <td>${new Date(invoice.created_at).toLocaleString('ar-EG')}</td>
            <td>${invoice.user?.name || 'غير محدد'}</td>
        `;
        tbody.appendChild(row);
    });
}

function handleDeviceAction(action, id) {
    currentEditingId = id;
    const device = devices.find(d => d.id === id);
    if (!device) {
        console.error('❌ لم يتم العثور على الجهاز:', id);
        return;
    }

    console.log('⚡ تنفيذ إجراء:', action, 'على الجهاز:', device.name);

    switch(action) {
        case 'start':
            if (!activeShift) {
                playNotificationSound('error');
                showNotification('يجب فتح شيفت أولاً لبدء الجلسة', 'warning');
                return;
            }
            document.getElementById('startSessionDeviceName').textContent = device.name;
            document.getElementById('deviceTypePrices').innerHTML = `
                <div class="price-info">
                    <span>سعر الفردي: ${parseFloat(device.device_type?.single_price || 0).toFixed(2)} ج/ساعة</span>
                    <span>سعر المتعدد: ${parseFloat(device.device_type?.multi_price || 0).toFixed(2)} ج/ساعة</span>
                </div>
            `;
            openModal('startSessionModal');
            break;
            
        case 'invoice':
            currentSessionId = device.active_session?.id;
            openInvoiceBofeihModal(device.id);
            break;
            
        case 'details':
            showDeviceDetails(device);
            break;
            
        case 'delete':
            if (confirm('هل أنت متأكد من حذف هذا الجهاز؟')) {
                deleteDevice(id);
            }
            break;
    }
}

// مودال الفاتورة والبوفيه الموحد
function openInvoiceBofeihModal(deviceId) {
    console.log('🧾 فتح مودال الفاتورة والبوفيه للجهاز:', deviceId);
    
    const device = devices.find(d => d.id === deviceId);
    if (!device) return;
    
    // إنشاء المودال إذا لم يكن موجوداً
    let modal = document.getElementById('invoiceBofeihModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'invoiceBofeihModal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }
    
    const session = device.active_session;
    const isActive = device.status === 'busy' && session;
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-receipt"></i> الفاتورة والبوفيه</h3>
                <span class="device-id-in-modal">${deviceId}</span>
                <span class="close-btn" onclick="closeModal('invoiceBofeihModal')">&times;</span>
            </div>
            
            ${isActive ? `
                <div class="modal-section">
                    <div class="modal-section-title">
                        <i class="fas fa-clock"></i>
                        معلومات الجلسة
                    </div>
                    <div class="times-section">
                        <div class="time-start-display">
                            <p>بدأت في:</p>
                            <div class="time-value">${new Date(session.start_time).toLocaleTimeString('ar-EG')}</div>
                        </div>
                        <div class="timer-display">
                            <div class="m-icon-wrapper">
                                <span class="m-icon">M</span>
                            </div>
                            <div class="timer-items-row">
                                <div class="timer-item-small">
                                    <div class="time-circle-small minutes-circle-small" id="modal-minutes-${deviceId}">00</div>
                                    <div class="time-label-small">دقيقة</div>
                                </div>
                                <div class="timer-item-small">
                                    <div class="time-circle-small hours-circle-small" id="modal-hours-${deviceId}">00</div>
                                    <div class="time-label-small">ساعة</div>
                                </div>
                            </div>
                        </div>
                        <div class="time-type-options">
                            <p>نوع اللعب:</p>
                            <div class="radio-group">
                                <label>
                                    <input type="radio" name="playType" value="single" ${session.play_type === 'single' ? 'checked' : ''} disabled>
                                    <span class="radio-custom"></span>
                                    <span class="radio-text">فردي</span>
                                </label>
                                <label>
                                    <input type="radio" name="playType" value="multi" ${session.play_type === 'multi' ? 'checked' : ''} disabled>
                                    <span class="radio-custom"></span>
                                    <span class="radio-text">متعدد</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            ` : ''}
            
            <div class="modal-section bofeih-section">
                <div class="modal-section-title">
                    <i class="fas fa-coffee"></i>
                    البوفيه
                </div>
                <button class="edit-btn open-bofeih-modal" id="editBofeihBtn">
                    <i class="material-icons">edit</i>
                    تعديل
                </button>
            </div>
            
            <div class="modal-footer-buttons">
                <button class="btn-cancel-bottom" onclick="closeModal('invoiceBofeihModal')">
                    <i class="fas fa-times"></i>
                    إلغاء
                </button>
                ${isActive ? `
                    <button class="btn-view-invoice" onclick="endSessionAndShowInvoice(${deviceId})">
                        <i class="fas fa-file-invoice"></i>
                        إنهاء وعرض الفاتورة
                    </button>
                ` : `
                    <button class="btn-view-invoice" onclick="showDeviceInvoice(${deviceId})">
                        <i class="fas fa-eye"></i>
                        عرض الفاتورة
                    </button>
                `}
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // تحديث التايمر في المودال
    if (isActive) {
        updateModalTimer(deviceId, session);
    }
}

function updateModalTimer(deviceId, session) {
    const updateTimer = () => {
        const startTime = new Date(session.start_time);
        const now = new Date();
        const diff = now - startTime;
        
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        
        const hoursEl = document.getElementById(`modal-hours-${deviceId}`);
        const minutesEl = document.getElementById(`modal-minutes-${deviceId}`);
        
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    
    // تنظيف المؤقت عند إغلاق المودال
    const modal = document.getElementById('invoiceBofeihModal');
    if (modal) {
        modal.addEventListener('hidden', () => clearInterval(interval), { once: true });
    }
}

function addToOrder(productId, productName, price) {
    if (currentOrder[productId]) {
        currentOrder[productId]++;
    } else {
        currentOrder[productId] = 1;
    }
    updateOrderDisplay();
    playNotificationSound('notification');
    showNotification(`تم إضافة ${productName} إلى الطلب`, 'success');
}

function updateOrderDisplay() {
    const orderItems = document.getElementById('buffetOrderList');
    const orderTotal = document.getElementById('buffetTotal');
    
    if (!orderItems || !orderTotal) return;
    
    orderItems.innerHTML = '';
    let total = 0;
    
    if (Object.keys(currentOrder).length === 0) {
        orderItems.innerHTML = '<li class="no-items">لا توجد طلبات</li>';
        orderTotal.textContent = '0.00';
        return;
    }
    
    Object.entries(currentOrder).forEach(([productId, quantity]) => {
        const product = products.find(p => p.id == productId);
        if (product) {
            const itemTotal = product.customer_price * quantity;
            total += itemTotal;
            
            const li = document.createElement('li');
            li.className = 'order-item';
            li.innerHTML = `
                <span class="item-name">${product.name}</span>
                <div class="item-controls">
                    <button onclick="decreaseQuantity(${productId})" class="qty-btn">-</button>
                    <span class="quantity">${quantity}</span>
                    <button onclick="increaseQuantity(${productId})" class="qty-btn">+</button>
                    <span class="item-price">${itemTotal.toFixed(2)} ج</span>
                    <button onclick="removeFromOrder(${productId})" class="remove-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            orderItems.appendChild(li);
        }
    });
    
    orderTotal.textContent = total.toFixed(2);
}

window.increaseQuantity = function(productId) {
    currentOrder[productId]++;
    updateOrderDisplay();
};

window.decreaseQuantity = function(productId) {
    if (currentOrder[productId] > 1) {
        currentOrder[productId]--;
    } else {
        delete currentOrder[productId];
    }
    updateOrderDisplay();
};

window.removeFromOrder = function(productId) {
    delete currentOrder[productId];
    updateOrderDisplay();
};

async function endSessionAndShowInvoice(deviceId) {
    const device = devices.find(d => d.id === deviceId);
    if (!device || !device.active_session) {
        showNotification('لا توجد جلسة نشطة', 'error');
        return;
    }
    
    if (confirm('هل أنت متأكد من إنهاء هذه الجلسة وإصدار الفاتورة؟')) {
        try {
            await sendRequest(`/api/sessions/${device.active_session.id}/end`, 'POST');
            playNotificationSound('success');
            showNotification('تم إنهاء الجلسة وحفظ الفاتورة', 'success');
            closeModal('invoiceBofeihModal');
            loadPageData();
        } catch (error) {
            playNotificationSound('error');
            showNotification('فشل في إنهاء الجلسة: ' + error.message, 'error');
        }
    }
}

async function saveDevice() {
    const form = document.getElementById('addDeviceForm');
    const data = {
        name: form.deviceName.value,
        device_type_id: form.deviceTypeSelect.value
    };
    
    try {
        await sendRequest('/api/devices', 'POST', data);
        playNotificationSound('success');
        showNotification('تم إضافة الجهاز بنجاح', 'success');
        closeModal('addDeviceModal');
        form.reset();
        loadPageData();
    } catch (error) {
        playNotificationSound('error');
        showNotification('فشل في إضافة الجهاز: ' + error.message, 'error');
    }
}

async function startSession() {
    const form = document.getElementById('startSessionForm');
    const playType = form.play_type.value;
    
    try {
        const response = await sendRequest(`/api/devices/${currentEditingId}/start-session`, 'POST', { 
            play_type: playType 
        });
        playNotificationSound('success');
        showNotification('تم بدء الجلسة بنجاح', 'success');
        closeModal('startSessionModal');
        loadPageData();
    } catch (error) {
        playNotificationSound('error');
        showNotification('فشل في بدء الجلسة: ' + error.message, 'error');
    }
}

function updateTimers() {
    devices.forEach(device => {
        if (device.status === 'busy' && device.active_session) {
            const timerEl = document.getElementById(`timer-value-${device.id}`);
            const playCostEl = document.getElementById(`play-cost-${device.id}`);
            const totalCostEl = document.getElementById(`total-cost-${device.id}`);
            
            if (timerEl && playCostEl) {
                const startTime = new Date(device.active_session.start_time);
                const now = new Date();
                const diff = now - startTime;
                
                const hours = Math.floor(diff / 3600000);
                const minutes = Math.floor((diff % 3600000) / 60000);
                const seconds = Math.floor((diff % 60000) / 1000);
                
                timerEl.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                
                // حساب التكلفة
                const deviceType = device.device_type;
                if (deviceType) {
                    const pricePerHour = device.active_session.play_type === 'single' 
                        ? deviceType.single_price 
                        : deviceType.multi_price;
                    const playCost = (diff / 3600000) * pricePerHour;
                    const buffetCost = parseFloat(device.active_session.buffet_cost || 0);
                    const totalCost = playCost + buffetCost;
                    
                    playCostEl.textContent = `${playCost.toFixed(2)} ج`;
                    if (totalCostEl) {
                        totalCostEl.textContent = `${totalCost.toFixed(2)} ج`;
                    }
                }
            }
        }
    });
}

function showDeviceDetails(device) {
    console.log('📋 عرض تفاصيل الجهاز:', device.name);
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-info-circle"></i> تفاصيل الجهاز</h3>
                <span class="close-btn" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="device-details">
                <div class="detail-item">
                    <span class="label">اسم الجهاز:</span>
                    <span class="value">${device.name}</span>
                </div>
                <div class="detail-item">
                    <span class="label">نوع الجهاز:</span>
                    <span class="value">${device.device_type?.name || 'غير محدد'}</span>
                </div>
                <div class="detail-item">
                    <span class="label">الحالة:</span>
                    <span class="value status-${device.status}">${device.status === 'available' ? 'متاح' : device.status === 'busy' ? 'مشغول' : 'صيانة'}</span>
                </div>
                <div class="detail-item">
                    <span class="label">سعر الفردي:</span>
                    <span class="value">${parseFloat(device.device_type?.single_price || 0).toFixed(2)} ج/ساعة</span>
                </div>
                <div class="detail-item">
                    <span class="label">سعر المتعدد:</span>
                    <span class="value">${parseFloat(device.device_type?.multi_price || 0).toFixed(2)} ج/ساعة</span>
                </div>
                ${device.active_session ? `
                    <div class="detail-item">
                        <span class="label">بدأت في:</span>
                        <span class="value">${new Date(device.active_session.start_time).toLocaleString('ar-EG')}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">نوع اللعب:</span>
                        <span class="value">${device.active_session.play_type === 'single' ? 'فردي' : 'متعدد'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">تكلفة البوفيه:</span>
                        <span class="value">${parseFloat(device.active_session.buffet_cost || 0).toFixed(2)} ج</span>
                    </div>
                ` : ''}
            </div>
            <div class="modal-footer">
                <button class="btn-cancel" onclick="this.closest('.modal').remove()">إغلاق</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

async function deleteDevice(deviceId) {
    try {
        await sendRequest(`/api/devices/${deviceId}`, 'DELETE');
        playNotificationSound('success');
        showNotification('تم حذف الجهاز بنجاح', 'success');
        loadPageData();
    } catch (error) {
        playNotificationSound('error');
        showNotification('فشل في حذف الجهاز: ' + error.message, 'error');
    }
}

function switchTab(tabId) {
    console.log('🔄 تبديل التبويب إلى:', tabId);
    
    if (!tabId) return;
    
    // إخفاء جميع المحتويات
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // إزالة الفئة النشطة من جميع الأزرار
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // إظهار المحتوى المحدد
    const contentToShow = document.getElementById(`${tabId}-content`);
    const buttonToActivate = document.querySelector(`[data-tab="${tabId}"]`);
    
    if (contentToShow) {
        contentToShow.classList.add('active');
        console.log('✅ تم إظهار المحتوى:', `${tabId}-content`);
    } else {
        console.error('❌ لم يتم العثور على المحتوى:', `${tabId}-content`);
    }
    
    if (buttonToActivate) {
        buttonToActivate.classList.add('active');
        console.log('✅ تم تفعيل الزر:', tabId);
    } else {
        console.error('❌ لم يتم العثور على الزر:', tabId);
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
        
        // إعادة تعيين النماذج
        const form = modal.querySelector('form');
        if (form) form.reset();
    }
}

async function sendRequest(endpoint, method, body = null) {
    try {
        const headers = { 'Accept': 'application/json' };
        const options = { method, headers, credentials: 'include' };

        // إضافة التوكن
        const token = sessionStorage.getItem('authToken');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        if (body) {
            headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(body);
        }
        
        const response = await fetch(`http://127.0.0.1:8000${endpoint}`, options);
        
        if (response.status === 401 || response.status === 419) {
            sessionStorage.clear();
            window.location.href = '/tag/index.php';
            return Promise.reject(new Error("انتهت صلاحية الجلسة"));
        }

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessages = errorData.errors ? 
                Object.values(errorData.errors).flat().join('\n') : 
                errorData.message || errorData.error || 'حدث خطأ غير متوقع';
            throw new Error(errorMessages);
        }
        
        return response.status !== 204 ? response.json() : null;
    } catch (error) { 
        console.error(`API Error on ${method} ${endpoint}:`, error);
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

// ربط الأحداث العامة للمودالات
document.addEventListener('click', function(e) {
    // فتح مودال البوفيه
    if (e.target.closest('.open-bofeih-modal, #editBofeihBtn')) {
        e.preventDefault();
        const deviceId = document.querySelector('.device-id-in-modal')?.textContent;
        if (deviceId) {
            openBuffetModal(deviceId);
        }
    }
    
    // إغلاق مودال البوفيه
    if (e.target.closest('#buffetModal .close-btn, #buffetModal .btn-cancel')) {
        closeModal('buffetModal');
    }
});

function openBuffetModal(deviceId) {
    console.log('☕ فتح مودال البوفيه للجهاز:', deviceId);
    
    const modal = document.getElementById('buffetModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // إعادة تعيين الطلب
        currentOrder = {};
        updateOrderDisplay();
        
        // تحديث رقم الجهاز
        const buffetTableIdEl = document.getElementById('buffetTableId');
        if (buffetTableIdEl) {
            buffetTableIdEl.textContent = deviceId;
        }
    }
}

async function saveBuffetOrder() {
    if (Object.keys(currentOrder).length === 0) {
        showNotification('لم يتم إضافة أي طلبات', 'warning');
        return;
    }
    
    const deviceId = document.getElementById('buffetTableId')?.textContent;
    const device = devices.find(d => d.id == deviceId);
    
    if (!device || !device.active_session) {
        showNotification('لا توجد جلسة نشطة لهذا الجهاز', 'error');
        return;
    }
    
    const items = Object.entries(currentOrder).map(([product_id, quantity]) => ({
        product_id: parseInt(product_id),
        quantity: quantity
    }));
    
    try {
        await sendRequest(`/api/sessions/${device.active_session.id}/add-order`, 'POST', { items });
        playNotificationSound('success');
        showNotification('تمت إضافة الطلبات للفاتورة', 'success');
        closeModal('buffetModal');
        loadPageData();
        currentOrder = {};
    } catch (error) {
        playNotificationSound('error');
        showNotification('فشل في إضافة الطلبات: ' + error.message, 'error');
    }
}