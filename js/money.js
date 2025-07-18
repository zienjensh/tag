// public/js/money.js - النسخة المُصححة مع معالجة أفضل للأخطاء

document.addEventListener('DOMContentLoaded', () => {
    loadPageData();
    setupEventListeners();
    updateClock();
    setInterval(updateClock, 1000);
});

let activeShift = null;
const currentUser = JSON.parse(sessionStorage.getItem('userData'));

function setupEventListeners() {
    document.getElementById('shiftControlBtn')?.addEventListener('click', handleShiftControl);
    document.querySelector('.fab-container .fab')?.addEventListener('click', toggleFabOptions);
    document.getElementById('daysHistorySelect')?.addEventListener('change', handleHistorySelection);
    
    document.body.addEventListener('click', function(e) {
        const button = e.target.closest('button');
        if (!button) return;
        
        if (button.classList.contains('close-btn') || button.classList.contains('btn-cancel')) {
            button.closest('.modal')?.classList.remove('active');
        } else if (button.classList.contains('tab-btn')) {
            switchTab(button.dataset.tab);
        } else if (button.dataset.modal) {
            const modalAction = button.dataset.modal;
            if (modalAction === 'addRevenue') openTransactionModal('revenue');
            else if (modalAction === 'addExpense') openTransactionModal('expense');
            else if (modalAction === 'addNote') openModal('addNoteModal');
        }
    });
    
    document.getElementById('startShiftForm')?.addEventListener('submit', e => { e.preventDefault(); startShift(); });
    document.getElementById('endShiftForm')?.addEventListener('submit', e => { e.preventDefault(); endShift(); });
    document.getElementById('addTransactionForm')?.addEventListener('submit', e => { e.preventDefault(); saveTransaction(); });
    document.getElementById('addNoteForm')?.addEventListener('submit', e => { e.preventDefault(); saveNote(); });
}

async function loadPageData() {
    showNotification('جاري تحميل البيانات...', 'info');
    try {
        const [shiftData, historyDays] = await Promise.all([
            sendRequest('/api/shifts/active', 'GET').catch(() => null),
            currentUser?.role === 'admin' ? sendRequest('/api/shifts/history/days', 'GET').catch(() => []) : Promise.resolve([])
        ]);
        
        activeShift = shiftData;
        
        if (currentUser?.role === 'admin') {
            populateHistoryDropdown(historyDays);
        }
        
        updateUI();
    } catch (error) {
        console.error('Error loading page data:', error);
        activeShift = null;
        updateUI();
    }
}

function updateUI(reportData = null) {
    const shiftControlButton = document.getElementById('shiftControlBtn');
    const shiftStatusDot = document.querySelector('.shift-status .status-dot');
    const shiftStatusText = document.querySelector('.shift-status .status-text');
    const fabContainer = document.querySelector('.fab-container');
    const isReportView = !!reportData;

    const dataProvider = isReportView ? reportData : activeShift;

    if (dataProvider) {
        shiftControlButton.innerHTML = isReportView ? '<i class="fas fa-calendar-day"></i><span>عرض اليوم الحالي</span>' : '<i class="fas fa-stop-circle"></i><span>قفل الشيفت</span>';
        fabContainer.style.display = isReportView ? 'none' : 'block';
        
        if (!isReportView && activeShift) {
            shiftStatusDot.classList.add('active');
            shiftStatusText.textContent = 'الشيفت مفتوح';
        } else {
            shiftStatusDot.classList.remove('active');
            shiftStatusText.textContent = isReportView ? `تقرير يوم ${reportData.date}` : 'الشيفت مغلق';
        }
        
        const revenues = isReportView ? dataProvider.revenues : dataProvider.transactions.filter(t => t.type === 'revenue');
        const expenses = isReportView ? dataProvider.expenses : dataProvider.transactions.filter(t => t.type === 'expense');
        const totalRevenues = revenues.reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const totalExpenses = expenses.reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const startingCash = isReportView ? dataProvider.starting_cash : parseFloat(dataProvider.starting_cash);
        
        document.getElementById('netCashValue').textContent = (startingCash + totalRevenues - totalExpenses).toFixed(2);
        document.getElementById('totalExpensesValue').textContent = totalExpenses.toFixed(2);
        document.getElementById('totalRevenuesValue').textContent = totalRevenues.toFixed(2);
        document.getElementById('shiftNotesText').textContent = dataProvider.notes || 'لا توجد ملاحظات.';
        
        document.getElementById('ordersRevenue').textContent = `${(revenues.filter(t => t.category === 'بوفيه').reduce((s, t) => s + parseFloat(t.amount), 0)).toFixed(2)} ج`;
        document.getElementById('tablesRevenue').textContent = `${(revenues.filter(t => t.category === 'ترابيزة').reduce((s, t) => s + parseFloat(t.amount), 0)).toFixed(2)} ج`;
        document.getElementById('devicesRevenue').textContent = `${(revenues.filter(t => t.category === 'جهاز').reduce((s, t) => s + parseFloat(t.amount), 0)).toFixed(2)} ج`;

        renderTable('revenueTableBody', revenues);
        renderTable('expenseTableBody', expenses);
    } else { 
        shiftControlButton.innerHTML = '<i class="fas fa-play-circle"></i><span>بدء يوم جديد</span>';
        shiftStatusDot.classList.remove('active');
        shiftStatusText.textContent = 'الشيفت مغلق';
        fabContainer.style.display = 'none';
        ['netCashValue', 'totalExpensesValue', 'totalRevenuesValue', 'ordersRevenue', 'tablesRevenue', 'devicesRevenue'].forEach(id => document.getElementById(id).textContent = '0.00');
        document.getElementById('shiftNotesText').textContent = 'الشيفت مغلق.';
        renderTable('revenueTableBody', []);
        renderTable('expenseTableBody', []);
    }
}

function renderTable(tableBodyId, transactions) {
    const tableBody = document.getElementById(tableBodyId);
    tableBody.innerHTML = '';
    if (!transactions || transactions.length === 0) {
        const type = tableBodyId.includes('revenue') ? 'إيرادات' : 'مصروفات';
        tableBody.innerHTML = `<tr><td colspan="5" class="no-data">لا توجد ${type} في هذا العرض.</td></tr>`;
        return;
    }
    transactions.forEach(item => {
        tableBody.innerHTML += `<tr><td>${item.description}</td><td>${item.category}</td><td class="${item.type === 'revenue' ? 'text-success' : 'text-danger'}">${parseFloat(item.amount).toFixed(2)}</td><td>${new Date(item.created_at).toLocaleTimeString('ar-EG')}</td><td>${item.user?.name || 'غير معروف'}</td></tr>`;
    });
}

function handleShiftControl() { 
    if (activeShift) {
        openModal('endShiftModal'); 
    } else { 
        const form = document.getElementById('startShiftForm'); 
        form.reset(); 
        openModal('startShiftModal'); 
    } 
}

async function startShift() { 
    const form = document.getElementById('startShiftForm'); 
    const startingCash = parseFloat(form.startingCash.value);
    
    if (isNaN(startingCash) || startingCash < 0) {
        showNotification('يرجى إدخال مبلغ صحيح للنقدية الافتتاحية', 'error');
        return;
    }
    
    await handleRequest(
        sendRequest('/api/shifts/start', 'POST', { starting_cash: startingCash }), 
        'تم بدء الشيفت بنجاح!', 
        () => {
            closeModal('startShiftModal'); 
            loadPageData(); 
        }
    ); 
}

async function endShift() { 
    const form = document.getElementById('endShiftForm'); 
    const endingCash = parseFloat(form.endingCash.value);
    
    if (isNaN(endingCash) || endingCash < 0) {
        showNotification('يرجى إدخال مبلغ صحيح للنقدية النهائية', 'error');
        return;
    }
    
    await handleRequest(
        sendRequest('/api/shifts/end', 'POST', { 
            ending_cash: endingCash, 
            notes: form.shiftNotes.value 
        }), 
        'تم إنهاء الشيفت بنجاح!', 
        () => { 
            closeModal('endShiftModal'); 
            loadPageData(); 
        }
    ); 
}

function openTransactionModal(type) { 
    const form = document.getElementById('addTransactionForm'); 
    form.reset(); 
    document.getElementById('transactionType').value = type; 
    const title = document.getElementById('transactionModalTitle'); 
    title.innerHTML = (type === 'revenue') ? '<i class="fas fa-arrow-up"></i> إضافة إيراد' : '<i class="fas fa-arrow-down"></i> إضافة مصروف'; 
    openModal('addTransactionModal'); 
}

async function saveTransaction() { 
    const form = document.getElementById('addTransactionForm'); 
    const amount = parseFloat(form.transactionAmount.value);
    
    if (isNaN(amount) || amount <= 0) {
        showNotification('يرجى إدخال مبلغ صحيح', 'error');
        return;
    }
    
    const data = { 
        type: form.transactionType.value, 
        description: form.transactionDescription.value.trim(), 
        amount: amount, 
        category: form.transactionCategory.value.trim() 
    };
    
    if (!data.description || !data.category) {
        showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    await handleRequest(
        sendRequest('/api/transactions', 'POST', data), 
        'تم تسجيل المعاملة بنجاح', 
        () => {
            closeModal('addTransactionModal');
            loadPageData();
        }
    ); 
}

async function saveNote() { 
    showNotification('قيد التطوير', 'info'); 
    closeModal('addNoteModal'); 
}

function updateClock() { 
    document.getElementById('current-date-time').textContent = new Date().toLocaleDateString('ar-EG', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    }); 
}

function toggleFabOptions() { 
    document.querySelector('.fab-container')?.classList.toggle('active'); 
}

function populateHistoryDropdown(days) { 
    const select = document.getElementById('daysHistorySelect'); 
    const container = select?.closest('.dropdown-container'); 
    if (!select || !container) return; 
    
    if (currentUser?.role === 'admin' && days?.length > 0) { 
        container.style.display = 'flex'; 
        select.innerHTML = '<option value="today">عرض اليوم الحالي</option>'; 
        days.forEach(day => select.innerHTML += `<option value="${day}">${day}</option>`); 
    } else { 
        container.style.display = 'none'; 
    } 
}

function handleHistorySelection(event) { 
    const selectedDay = event.target.value; 
    switchTab('revenue'); 
    if (selectedDay === 'today') { 
        loadPageData(); 
    } else { 
        loadReportForDay(selectedDay); 
    } 
}

async function loadReportForDay(date) { 
    showNotification(`جاري تحميل تقرير يوم ${date}...`, 'info'); 
    try { 
        const shiftsOfDay = await sendRequest('/api/shifts/report/day', 'POST', { date }); 
        let aggregatedData = { 
            date, 
            total_revenues: 0, 
            total_expenses: 0, 
            starting_cash: 0, 
            notes: [], 
            revenues: [], 
            expenses: [] 
        }; 
        
        shiftsOfDay.forEach(shift => { 
            const shiftRevenues = shift.transactions.filter(t => t.type === 'revenue'); 
            const shiftExpenses = shift.transactions.filter(t => t.type === 'expense'); 
            aggregatedData.total_revenues += shiftRevenues.reduce((sum, t) => sum + parseFloat(t.amount), 0); 
            aggregatedData.total_expenses += shiftExpenses.reduce((sum, t) => sum + parseFloat(t.amount), 0); 
            aggregatedData.starting_cash += parseFloat(shift.starting_cash); 
            if (shift.notes) aggregatedData.notes.push(shift.notes); 
            aggregatedData.revenues.push(...shiftRevenues); 
            aggregatedData.expenses.push(...shiftExpenses); 
        }); 
        
        aggregatedData.net_cash = aggregatedData.starting_cash + aggregatedData.total_revenues - aggregatedData.total_expenses; 
        aggregatedData.notes = aggregatedData.notes.join(' | ') || 'لا توجد ملاحظات لهذا اليوم.'; 
        updateUI(aggregatedData); 
    } catch (error) { 
        showNotification('فشل تحميل التقرير', 'error'); 
    } 
}

function openModal(modalId) { document.getElementById(modalId)?.classList.add('active'); }
function closeModal(modalId) { document.getElementById(modalId)?.classList.remove('active'); }

async function handleRequest(requestPromise, successMessage, callback) { 
    try { 
        await requestPromise; 
        if (successMessage) showNotification(successMessage, 'success'); 
        if (callback) await callback(); 
    } catch (error) { 
        showNotification(`فشل: ${error.message}`, 'error'); 
    } 
}

function switchTab(tabId) { 
    if (!tabId) return; 
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active')); 
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active')); 
    document.getElementById(`${tabId}-content`)?.classList.add('active'); 
    document.querySelector(`.tab-btn[data-tab='${tabId}']`)?.classList.add('active'); 
}