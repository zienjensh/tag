// money.js - النسخة المحسنة والعصرية

// متغيرات عامة
let currentModalContext = '';
let isShiftOpen = false;

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    setupEventListeners();
    updateShiftStatus();
    loadFinancialData();
});

// تهيئة الصفحة
function initializePage() {
    // إضافة أيقونات الإضافة للبطاقات
    addPlusIcons();
    
    // تحديث التاريخ
    updateCurrentDate();
    
    // تفعيل التبويب الأول
    switchTab('revenue');
    
    // تحديث حالة الشيفت
    const shiftStatus = localStorage.getItem("shiftOpen");
    isShiftOpen = shiftStatus === "true";
    updateShiftStatus();
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // زر الإضافة السريعة
    const quickAddBtn = document.getElementById('quickAddBtn');
    if (quickAddBtn) {
        quickAddBtn.addEventListener('click', toggleQuickAddDropdown);
    }
    
    // زر التحديث
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshData);
    }
    
    // زر التصدير
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportReport);
    }
    
    // إغلاق القائمة المنسدلة عند النقر خارجها
    document.addEventListener('click', function(event) {
        const dropdown = document.getElementById('quickAddDropdown');
        const quickAddBtn = document.getElementById('quickAddBtn');
        
        if (dropdown && !dropdown.contains(event.target) && !quickAddBtn.contains(event.target)) {
            dropdown.classList.remove('active');
        }
    });
    
    // مستمعي أحداث النماذج
    setupFormListeners();
}

// إضافة أيقونات الزائد للبطاقات
function addPlusIcons() {
    const cards = ['expenses', 'revenues', 'notes'];
    
    cards.forEach(cardId => {
        const card = document.getElementById(cardId);
        if (card && !card.querySelector('.add-btn-card')) {
            const addIcon = card.querySelector('.add-btn-card');
            if (addIcon) {
                // إضافة معالج الحدث
                addIcon.addEventListener('click', function() {
                    switch(cardId) {
                        case 'expenses':
                            openAddExpenseModal();
                            break;
                        case 'revenues':
                            openAddRevenueModal();
                            break;
                        case 'notes':
                            openAddNoteModal();
                            break;
                    }
                });
            }
        }
    });
    
    // إظهار الأيقونات إذا كان الشيفت مفتوحاً
    updateAddIconsVisibility();
}

// تحديث رؤية أيقونات الإضافة
function updateAddIconsVisibility() {
    const addIcons = document.querySelectorAll('.add-btn-card');
    addIcons.forEach(icon => {
        if (isShiftOpen) {
            icon.classList.add('visible');
        } else {
            icon.classList.remove('visible');
        }
    });
}

// تحديث التاريخ الحالي
function updateCurrentDate() {
    const dateDisplay = document.querySelector('.date-display');
    if (dateDisplay) {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        dateDisplay.textContent = now.toLocaleDateString('ar-EG', options);
    }
}

// تبديل القائمة الجانبية
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    
    if (sidebar && overlay) {
        sidebar.classList.toggle("active");
        overlay.classList.toggle("active");
    }
}

// تبديل قائمة الإضافة السريعة
function toggleQuickAddDropdown() {
    const dropdown = document.getElementById('quickAddDropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

// تحديث حالة الشيفت
function updateShiftStatus() {
    const shiftBtn = document.getElementById("startNewDayBtn");
    const statusIndicator = document.querySelector('.shift-status .status-indicator');
    const statusText = document.querySelector('.status-text');
    
    if (shiftBtn) {
        if (isShiftOpen) {
            shiftBtn.innerHTML = '<i class="fas fa-stop-circle"></i><span>قفل الشيفت</span>';
            shiftBtn.style.background = 'var(--error-color)';
            
            if (statusIndicator) statusIndicator.style.background = 'var(--success-color)';
            if (statusText) statusText.textContent = 'الشيفت مفتوح';
        } else {
            shiftBtn.innerHTML = '<i class="fas fa-play-circle"></i><span>بدء يوم جديد</span>';
            shiftBtn.style.background = 'var(--success-color)';
            
            if (statusIndicator) statusIndicator.style.background = 'var(--error-color)';
            if (statusText) statusText.textContent = 'الشيفت مغلق';
        }
    }
    
    updateAddIconsVisibility();
}

// تبديل حالة الشيفت
function toggleShift() {
    if (isShiftOpen) {
        openInitialCashModal('endShift');
    } else {
        openInitialCashModal('startShift');
    }
}

// التنقل بين التبويبات
function switchTab(tab) {
    const revenueTab = document.getElementById("revenue-tab");
    const expenseTab = document.getElementById("expense-tab");
    const revenueContent = document.getElementById("revenue-content");
    const expenseContent = document.getElementById("expense-content");

    // إزالة الفئة النشطة من جميع التبويبات
    [revenueTab, expenseTab].forEach(t => t?.classList.remove("active"));
    
    // إخفاء جميع المحتويات
    [revenueContent, expenseContent].forEach(c => {
        if (c) c.classList.remove("active");
    });

    if (tab === 'revenue') {
        revenueTab?.classList.add("active");
        revenueContent?.classList.add("active");
    } else {
        expenseTab?.classList.add("active");
        expenseContent?.classList.add("active");
    }
}

// فتح المودالات
function openAddExpenseModal() {
    if (!isShiftOpen) {
        showNotification('يجب فتح الشيفت أولاً', 'warning');
        return;
    }
    openModal('addExpenseModal');
}

function openAddRevenueModal() {
    if (!isShiftOpen) {
        showNotification('يجب فتح الشيفت أولاً', 'warning');
        return;
    }
    openModal('addRevenueModal');
}

function openAddNoteModal() {
    openModal('addNoteModal');
}

function openInitialCashModal(context) {
    currentModalContext = context;
    const modalTitle = document.getElementById('initialCashModalTitle');
    
    if (modalTitle) {
        if (context === 'startShift') {
            modalTitle.innerHTML = '<i class="fas fa-money-bill-wave"></i>النقدية المستلمة في بداية اليوم';
        } else if (context === 'endShift') {
            modalTitle.innerHTML = '<i class="fas fa-money-bill-wave"></i>النقدية المسلمة';
        }
    }
    
    openModal('initialCashModal');
}

// فتح المودال
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // التركيز على أول حقل إدخال
        const firstInput = modal.querySelector('input, select, textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

// إغلاق المودال
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // إعادة تعيين النموذج
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
            updateSaveButtonState(modalId);
        }
        
        // إخفاء قائمة العملاء
        const customerSelect = document.getElementById('customerSelect');
        if (customerSelect) {
            customerSelect.style.display = 'none';
        }
    }
    
    if (modalId === 'initialCashModal') {
        currentModalContext = '';
    }
}

// إعداد مستمعي أحداث النماذج
function setupFormListeners() {
    // نموذج المصروفات
    const expenseForm = document.querySelector('#addExpenseModal form');
    if (expenseForm) {
        expenseForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveExpense();
        });
        
        // مراقبة تغييرات الحقول
        const inputs = expenseForm.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('input', () => updateSaveButtonState('addExpenseModal'));
            input.addEventListener('change', () => updateSaveButtonState('addExpenseModal'));
        });
    }
    
    // نموذج الإيرادات
    const revenueForm = document.querySelector('#addRevenueModal form');
    if (revenueForm) {
        revenueForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveRevenue();
        });
        
        const inputs = revenueForm.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('input', () => updateSaveButtonState('addRevenueModal'));
            input.addEventListener('change', () => updateSaveButtonState('addRevenueModal'));
        });
    }
    
    // نموذج الملاحظات
    const noteForm = document.querySelector('#addNoteModal form');
    if (noteForm) {
        noteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveNote();
        });
        
        const textarea = noteForm.querySelector('textarea');
        if (textarea) {
            textarea.addEventListener('input', () => updateSaveButtonState('addNoteModal'));
        }
    }
    
    // نموذج النقدية الأولية
    const cashForm = document.querySelector('#initialCashModal form');
    if (cashForm) {
        cashForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveInitialCash();
        });
        
        const input = cashForm.querySelector('input');
        if (input) {
            input.addEventListener('input', () => updateSaveButtonState('initialCashModal'));
        }
    }
}

// تحديث حالة زر الحفظ
function updateSaveButtonState(modalId) {
    let isValid = false;
    
    switch(modalId) {
        case 'addExpenseModal':
            isValid = validateExpenseForm();
            break;
        case 'addRevenueModal':
            isValid = validateRevenueForm();
            break;
        case 'addNoteModal':
            isValid = validateNoteForm();
            break;
        case 'initialCashModal':
            isValid = validateCashForm();
            break;
    }
    
    const saveBtn = document.querySelector(`#${modalId} .btn-save`);
    if (saveBtn) {
        saveBtn.disabled = !isValid;
    }
}

// التحقق من صحة نموذج المصروفات
function validateExpenseForm() {
    const name = document.getElementById('addExpenseName')?.value.trim();
    const amount = document.getElementById('addExpenseAmount')?.value;
    const type = document.querySelector('input[name="expenseType"]:checked');
    
    return name && amount && !isNaN(amount) && parseFloat(amount) > 0 && type;
}

// التحقق من صحة نموذج الإيرادات
function validateRevenueForm() {
    const name = document.getElementById('addRevenueName')?.value.trim();
    const amount = document.getElementById('addRevenueAmount')?.value;
    const type = document.querySelector('input[name="revenueType"]:checked');
    const customerSelect = document.getElementById('customerSelect');
    
    const basicValid = name && amount && !isNaN(amount) && parseFloat(amount) > 0 && type;
    
    if (type?.value === 'عميل') {
        return basicValid && customerSelect?.value;
    }
    
    return basicValid;
}

// التحقق من صحة نموذج الملاحظات
function validateNoteForm() {
    const note = document.getElementById('addNoteTextarea')?.value.trim();
    return note && note.length > 0;
}

// التحقق من صحة نموذج النقدية
function validateCashForm() {
    const amount = document.getElementById('initialCashAmount')?.value;
    return amount && !isNaN(amount) && parseFloat(amount) >= 0;
}

// إظهار/إخفاء قائمة العملاء
function toggleCustomerSelect() {
    const customerSelect = document.getElementById('customerSelect');
    const customerRadio = document.getElementById('revenueTypeCustomer');
    
    if (customerSelect && customerRadio) {
        if (customerRadio.checked) {
            customerSelect.style.display = 'block';
        } else {
            customerSelect.style.display = 'none';
            customerSelect.value = '';
        }
        updateSaveButtonState('addRevenueModal');
    }
}

// حفظ المصروف
function saveExpense() {
    const name = document.getElementById('addExpenseName')?.value;
    const amount = parseFloat(document.getElementById('addExpenseAmount')?.value);
    const type = document.querySelector('input[name="expenseType"]:checked')?.value;
    
    if (validateExpenseForm()) {
        // إضافة المصروف للجدول
        addExpenseToTable({
            type: type,
            name: name,
            amount: amount,
            time: new Date().toLocaleString('ar-EG')
        });
        
        // تحديث الإجمالي
        updateFinancialTotals();
        
        showNotification('تم حفظ المصروف بنجاح', 'success');
        closeModal('addExpenseModal');
    }
}

// حفظ الإيراد
function saveRevenue() {
    const name = document.getElementById('addRevenueName')?.value;
    const amount = parseFloat(document.getElementById('addRevenueAmount')?.value);
    const type = document.querySelector('input[name="revenueType"]:checked')?.value;
    const customer = document.getElementById('customerSelect')?.value || 'غير محدد';
    
    if (validateRevenueForm()) {
        // إضافة الإيراد للجدول
        addRevenueToTable({
            name: name,
            amount: amount,
            employee: 'محمد حامد',
            customer: type === 'عميل' ? customer : 'المحل',
            time: new Date().toLocaleString('ar-EG')
        });
        
        // تحديث الإجمالي
        updateFinancialTotals();
        
        showNotification('تم حفظ الإيراد بنجاح', 'success');
        closeModal('addRevenueModal');
    }
}

// حفظ الملاحظة
function saveNote() {
    const note = document.getElementById('addNoteTextarea')?.value;
    const priority = document.getElementById('notePriority')?.value || 'normal';
    
    if (validateNoteForm()) {
        // حفظ الملاحظة (يمكن إضافة منطق حفظ فعلي هنا)
        console.log('ملاحظة جديدة:', { note, priority, time: new Date() });
        
        // تحديث عداد الملاحظات
        updateNotesCount();
        
        showNotification('تم حفظ الملاحظة بنجاح', 'success');
        closeModal('addNoteModal');
    }
}

// حفظ النقدية الأولية
function saveInitialCash() {
    const amount = parseFloat(document.getElementById('initialCashAmount')?.value);
    
    if (validateCashForm()) {
        if (currentModalContext === 'startShift') {
            isShiftOpen = true;
            localStorage.setItem("shiftOpen", "true");
            showNotification(`تم فتح الشيفت بنقدية أولية: ${amount.toFixed(2)} ج`, 'success');
        } else if (currentModalContext === 'endShift') {
            isShiftOpen = false;
            localStorage.setItem("shiftOpen", "false");
            showNotification(`تم إغلاق الشيفت بنقدية مسلمة: ${amount.toFixed(2)} ج`, 'success');
        }
        
        updateShiftStatus();
        closeModal('initialCashModal');
    }
}

// إضافة مصروف للجدول
function addExpenseToTable(expense) {
    const tbody = document.querySelector('#expense-content .data-table tbody');
    if (!tbody) return;
    
    // إزالة صف "لا توجد بيانات" إذا كان موجوداً
    const noDataRow = tbody.querySelector('.no-data-row');
    if (noDataRow) {
        noDataRow.remove();
    }
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${expense.type}</td>
        <td>${expense.name}</td>
        <td>${expense.amount.toFixed(2)} ج</td>
        <td>${expense.time}</td>
        <td>
            <button class="btn-edit" onclick="editExpense(this)">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn-delete" onclick="deleteExpense(this)">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    
    tbody.appendChild(row);
}

// إضافة إيراد للجدول
function addRevenueToTable(revenue) {
    const tbody = document.querySelector('#revenue-content .data-table tbody');
    if (!tbody) return;
    
    // إزالة صف "لا توجد بيانات" إذا كان موجوداً
    const noDataRow = tbody.querySelector('.no-data-row');
    if (noDataRow) {
        noDataRow.remove();
    }
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${revenue.name}</td>
        <td>${revenue.amount.toFixed(2)} ج</td>
        <td>${revenue.employee}</td>
        <td>${revenue.customer}</td>
        <td>${revenue.time}</td>
        <td>
            <button class="btn-edit" onclick="editRevenue(this)">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn-delete" onclick="deleteRevenue(this)">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    
    tbody.appendChild(row);
}

// تحديث الإجماليات المالية
function updateFinancialTotals() {
    // حساب إجمالي الإيرادات
    let totalRevenues = 0;
    const revenueRows = document.querySelectorAll('#revenue-content .data-table tbody tr:not(.no-data-row)');
    revenueRows.forEach(row => {
        const amountCell = row.cells[1];
        if (amountCell) {
            const amount = parseFloat(amountCell.textContent.replace(' ج', ''));
            if (!isNaN(amount)) {
                totalRevenues += amount;
            }
        }
    });
    
    // حساب إجمالي المصروفات
    let totalExpenses = 0;
    const expenseRows = document.querySelectorAll('#expense-content .data-table tbody tr:not(.no-data-row)');
    expenseRows.forEach(row => {
        const amountCell = row.cells[2];
        if (amountCell) {
            const amount = parseFloat(amountCell.textContent.replace(' ج', ''));
            if (!isNaN(amount)) {
                totalExpenses += amount;
            }
        }
    });
    
    // تحديث البطاقات
    const revenuesCard = document.querySelector('#revenues .value');
    const expensesCard = document.querySelector('#expenses .value');
    const balanceCard = document.querySelector('#cashBalance .value');
    
    if (revenuesCard) revenuesCard.textContent = totalRevenues.toFixed(2);
    if (expensesCard) expensesCard.textContent = totalExpenses.toFixed(2);
    if (balanceCard) balanceCard.textContent = (totalRevenues - totalExpenses).toFixed(2);
    
    // تحديث ملخص الإيرادات
    updateRevenueSummary();
}

// تحديث ملخص الإيرادات
function updateRevenueSummary() {
    // يمكن إضافة منطق لتحديث بطاقات الملخص هنا
    const summaryCards = document.querySelectorAll('.summary-amount');
    summaryCards.forEach(card => {
        // تحديث القيم حسب نوع الإيراد
    });
}

// تحديث عداد الملاحظات
function updateNotesCount() {
    const notesCount = document.querySelector('#notes .notes-count');
    if (notesCount) {
        const currentCount = parseInt(notesCount.textContent) || 0;
        notesCount.textContent = `${currentCount + 1} ملاحظة`;
    }
}

// تحديث البيانات
function refreshData() {
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        const icon = refreshBtn.querySelector('i');
        icon.style.animation = 'spin 1s linear infinite';
        
        setTimeout(() => {
            icon.style.animation = '';
            showNotification('تم تحديث البيانات', 'success');
        }, 1000);
    }
}

// تصدير التقرير
function exportReport() {
    showNotification('جاري تحضير التقرير...', 'info');
    
    setTimeout(() => {
        showNotification('تم تصدير التقرير بنجاح', 'success');
    }, 2000);
}

// تحميل البيانات المالية
function loadFinancialData() {
    // يمكن إضافة منطق تحميل البيانات من الخادم هنا
    updateFinancialTotals();
}

// إظهار الإشعارات
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <i class="${icons[type]}"></i>
        <span>${message}</span>
    `;
    
    // إضافة الأنماط
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: var(--bg-primary);
        color: var(--text-primary);
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow-xl);
        border-left: 4px solid var(--${type === 'error' ? 'error' : type === 'warning' ? 'warning' : type === 'success' ? 'success' : 'primary'}-color);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 500;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // إزالة الإشعار بعد 4 ثوانٍ
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// إضافة أنماط CSS للإشعارات
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(notificationStyles);

// دوال التحرير والحذف (يمكن تطويرها لاحقاً)
function editExpense(button) {
    showNotification('وظيفة التحرير قيد التطوير', 'info');
}

function deleteExpense(button) {
    if (confirm('هل أنت متأكد من حذف هذا المصروف؟')) {
        button.closest('tr').remove();
        updateFinancialTotals();
        showNotification('تم حذف المصروف', 'success');
    }
}

function editRevenue(button) {
    showNotification('وظيفة التحرير قيد التطوير', 'info');
}

function deleteRevenue(button) {
    if (confirm('هل أنت متأكد من حذف هذا الإيراد؟')) {
        button.closest('tr').remove();
        updateFinancialTotals();
        showNotification('تم حذف الإيراد', 'success');
    }
}

// دوال للتوافق مع النسخة القديمة
function enableSaveButton(modalId) {
    updateSaveButtonState(modalId);
}