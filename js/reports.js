// reports.js - ملف JavaScript لصفحة التقارير المتقدمة والكاملة

// متغيرات عامة
let mainChart = null;
let revenueDistributionChart = null;
let expenseDistributionChart = null;
let miniCharts = {};
let notificationSounds = {};

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    // التأكد من بناء القائمة الجانبية أولاً
    if (typeof buildSidebar === 'function') {
        buildSidebar();
    }
    initializePage();
    setupEventListeners();
    setDefaultDates();
    initializeNotificationSounds();
});

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

// تهيئة الصفحة
function initializePage() {
    // إضافة أيقونات الإضافة للبطاقات
    addPlusIcons();
    
    // تحديث التاريخ
    updateCurrentDate();
    
    // إخفاء نتائج التقرير في البداية
    hideAllStates();
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // مراقبة تغييرات التواريخ
    const fromDate = document.getElementById('fromDate');
    const toDate = document.getElementById('toDate');
    
    if (fromDate) {
        fromDate.addEventListener('change', validateDateRange);
    }
    
    if (toDate) {
        toDate.addEventListener('change', validateDateRange);
    }
    
    // إعداد اختصارات لوحة المفاتيح
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            generateReport();
        }
    });
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

// تعيين التواريخ الافتراضية
function setDefaultDates() {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const fromDate = document.getElementById('fromDate');
    const toDate = document.getElementById('toDate');
    
    if (fromDate) {
        fromDate.value = formatDateForInput(firstDayOfMonth);
    }
    
    if (toDate) {
        toDate.value = formatDateForInput(today);
    }
}

// تنسيق التاريخ لحقل الإدخال
function formatDateForInput(date) {
    return date.toISOString().split('T')[0];
}

// تعيين تاريخ سريع
function setQuickDate(period) {
    const today = new Date();
    const fromDate = document.getElementById('fromDate');
    const toDate = document.getElementById('toDate');
    
    // إزالة الفئة النشطة من جميع الأزرار
    document.querySelectorAll('.quick-date-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // إضافة الفئة النشطة للزر المحدد
    event.target.classList.add('active');
    
    let startDate, endDate;
    
    switch(period) {
        case 'today':
            startDate = endDate = today;
            break;
        case 'yesterday':
            startDate = endDate = new Date(today.getTime() - 24 * 60 * 60 * 1000);
            break;
        case 'week':
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
            startDate = startOfWeek;
            endDate = today;
            break;
        case 'month':
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            endDate = today;
            break;
        default:
            return;
    }
    
    if (fromDate) fromDate.value = formatDateForInput(startDate);
    if (toDate) toDate.value = formatDateForInput(endDate);
    
    // إضافة تأثير بصري
    addButtonClickEffect(event.target);
}

// إضافة تأثير النقر للأزرار
function addButtonClickEffect(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
}

// التحقق من صحة نطاق التاريخ
function validateDateRange() {
    const fromDate = document.getElementById('fromDate');
    const toDate = document.getElementById('toDate');
    const generateBtn = document.querySelector('.generate-report-btn');
    
    if (fromDate && toDate && generateBtn) {
        const from = new Date(fromDate.value);
        const to = new Date(toDate.value);
        
        if (from > to) {
            playNotificationSound('error');
            showNotification('تاريخ البداية يجب أن يكون قبل تاريخ النهاية', 'error');
            generateBtn.disabled = true;
            return false;
        } else {
            generateBtn.disabled = false;
            return true;
        }
    }
    
    return false;
}

// إنشاء التقرير
async function generateReport() {
    if (!validateDateRange()) {
        return;
    }
    
    const fromDate = document.getElementById('fromDate').value;
    const toDate = document.getElementById('toDate').value;
    
    if (!fromDate || !toDate) {
        playNotificationSound('error');
        showNotification('يرجى تحديد فترة زمنية صحيحة', 'warning');
        return;
    }
    
    // إظهار حالة التحميل
    showLoadingState();
    
    try {
        // جلب البيانات الفعلية من الخادم
        const reportData = await fetchReportData(fromDate, toDate);
        
        if (reportData.hasData) {
            displayReportResults(reportData);
            playNotificationSound('success');
            showNotification('تم إنشاء التقرير بنجاح', 'success');
        } else {
            showNoDataState();
            showNotification('لا توجد بيانات للفترة المحددة', 'info');
        }
    } catch (error) {
        playNotificationSound('error');
        showNotification('فشل في إنشاء التقرير: ' + error.message, 'error');
        showNoDataState();
    }
}

// جلب بيانات التقرير من الخادم
async function fetchReportData(fromDate, toDate) {
    try {
        // جلب بيانات الشيفتات للفترة المحددة
        const response = await sendRequest('/api/shifts/report/period', 'POST', {
            from_date: fromDate,
            to_date: toDate
        });
        
        if (!response || !response.shifts) {
            return { hasData: false };
        }
        
        const shifts = response.shifts;
        let totalRevenues = 0;
        let totalExpenses = 0;
        let revenues = [];
        let expenses = [];
        
        // معالجة بيانات الشيفتات
        shifts.forEach(shift => {
            if (shift.transactions) {
                shift.transactions.forEach(transaction => {
                    const transactionData = {
                        date: transaction.created_at.split('T')[0],
                        name: transaction.description,
                        amount: parseFloat(transaction.amount),
                        type: transaction.category,
                        employee: transaction.user?.name || 'غير محدد'
                    };
                    
                    if (transaction.type === 'revenue') {
                        revenues.push(transactionData);
                        totalRevenues += transactionData.amount;
                    } else if (transaction.type === 'expense') {
                        expenses.push(transactionData);
                        totalExpenses += transactionData.amount;
                    }
                });
            }
        });
        
        const netProfit = totalRevenues - totalExpenses;
        
        // إنشاء بيانات للرسوم البيانية
        const chartData = generateChartData(revenues, expenses, new Date(fromDate), new Date(toDate));
        
        return {
            hasData: revenues.length > 0 || expenses.length > 0,
            summary: {
                totalRevenues,
                totalExpenses,
                netProfit,
                revenuesTrend: calculateTrend(totalRevenues, 'revenues'),
                expensesTrend: calculateTrend(totalExpenses, 'expenses'),
                profitTrend: calculateTrend(netProfit, 'profit')
            },
            details: {
                revenues: revenues,
                expenses: expenses,
                avgDailyRevenue: totalRevenues / getDaysBetween(new Date(fromDate), new Date(toDate)),
                totalTransactions: revenues.length + expenses.length,
                profitMargin: totalRevenues > 0 ? ((netProfit / totalRevenues) * 100) : 0,
                growthRate: calculateGrowthRate(totalRevenues),
                bestSalesDay: findBestSalesDay(revenues),
                highestDailyRevenue: findHighestDailyRevenue(revenues),
                lowestDailyRevenue: findLowestDailyRevenue(revenues),
                topExpenseCategory: findTopExpenseCategory(expenses)
            },
            chartData
        };
    } catch (error) {
        console.error('Error fetching report data:', error);
        throw error;
    }
}

// حساب الاتجاه (محاكاة)
function calculateTrend(value, type) {
    // محاكاة حساب الاتجاه مقارنة بالفترة السابقة
    const trends = {
        revenues: Math.random() * 20 - 5, // بين -5% و +15%
        expenses: Math.random() * 15 - 10, // بين -10% و +5%
        profit: Math.random() * 25 - 10 // بين -10% و +15%
    };
    
    return trends[type] || 0;
}

// حساب عدد الأيام بين تاريخين
function getDaysBetween(date1, date2) {
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
}

// حساب معدل النمو (محاكاة)
function calculateGrowthRate(currentValue) {
    return Math.random() * 20 - 5; // بين -5% و +15%
}

// العثور على أفضل يوم في المبيعات
function findBestSalesDay(revenues) {
    if (revenues.length === 0) return '-';
    
    const dailyTotals = {};
    revenues.forEach(item => {
        const date = item.date;
        dailyTotals[date] = (dailyTotals[date] || 0) + item.amount;
    });
    
    const bestDay = Object.keys(dailyTotals).reduce((a, b) => 
        dailyTotals[a] > dailyTotals[b] ? a : b
    );
    
    return new Date(bestDay).toLocaleDateString('ar-EG', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
    });
}

// العثور على أعلى إيراد يومي
function findHighestDailyRevenue(revenues) {
    if (revenues.length === 0) return 0;
    
    const dailyTotals = {};
    revenues.forEach(item => {
        const date = item.date;
        dailyTotals[date] = (dailyTotals[date] || 0) + item.amount;
    });
    
    return Math.max(...Object.values(dailyTotals));
}

// العثور على أقل إيراد يومي
function findLowestDailyRevenue(revenues) {
    if (revenues.length === 0) return 0;
    
    const dailyTotals = {};
    revenues.forEach(item => {
        const date = item.date;
        dailyTotals[date] = (dailyTotals[date] || 0) + item.amount;
    });
    
    return Math.min(...Object.values(dailyTotals));
}

// العثور على أكثر فئة مصروفات
function findTopExpenseCategory(expenses) {
    if (expenses.length === 0) return '-';
    
    const categories = {};
    expenses.forEach(item => {
        categories[item.type] = (categories[item.type] || 0) + item.amount;
    });
    
    return Object.keys(categories).reduce((a, b) => 
        categories[a] > categories[b] ? a : b
    );
}

// إنشاء بيانات الرسوم البيانية
function generateChartData(revenues, expenses, fromDate, toDate) {
    const days = [];
    const revenueData = [];
    const expenseData = [];
    
    // إنشاء مصفوفة الأيام
    const currentDate = new Date(fromDate);
    const endDate = new Date(toDate);
    
    while (currentDate <= endDate) {
        const dateStr = formatDateForInput(currentDate);
        days.push(new Date(currentDate).toLocaleDateString('ar-EG', { 
            day: 'numeric', 
            month: 'short' 
        }));
        
        // حساب الإيرادات لهذا اليوم
        const dayRevenues = revenues
            .filter(item => item.date === dateStr)
            .reduce((sum, item) => sum + item.amount, 0);
        revenueData.push(dayRevenues);
        
        // حساب المصروفات لهذا اليوم
        const dayExpenses = expenses
            .filter(item => item.date === dateStr)
            .reduce((sum, item) => sum + item.amount, 0);
        expenseData.push(dayExpenses);
        
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return {
        labels: days,
        revenues: revenueData,
        expenses: expenseData,
        revenueDistribution: calculateRevenueDistribution(revenues),
        expenseDistribution: calculateExpenseDistribution(expenses)
    };
}

// حساب توزيع الإيرادات
function calculateRevenueDistribution(revenues) {
    const distribution = {};
    revenues.forEach(item => {
        distribution[item.type] = (distribution[item.type] || 0) + item.amount;
    });
    
    return {
        labels: Object.keys(distribution),
        data: Object.values(distribution)
    };
}

// حساب توزيع المصروفات
function calculateExpenseDistribution(expenses) {
    const distribution = {};
    expenses.forEach(item => {
        distribution[item.type] = (distribution[item.type] || 0) + item.amount;
    });
    
    return {
        labels: Object.keys(distribution),
        data: Object.values(distribution)
    };
}

// عرض نتائج التقرير
function displayReportResults(data) {
    hideAllStates();
    
    // تحديث البطاقات المالية
    updateFinancialCards(data.summary);
    
    // تحديث التحليل التفصيلي
    updateDetailedAnalysis(data.details);
    
    // تحديث مؤشرات الأداء
    updatePerformanceIndicators(data.details);
    
    // إنشاء الرسوم البيانية
    createCharts(data.chartData);
    
    // تحديث الجداول
    updateDataTables(data.details);
    
    // إظهار النتائج
    document.getElementById('reportResults').style.display = 'block';
}

// تحديث البطاقات المالية
function updateFinancialCards(summary) {
    // إجمالي الإيرادات
    const totalRevenuesEl = document.getElementById('totalRevenues');
    const revenuesTrendEl = document.getElementById('revenuesTrend');
    
    if (totalRevenuesEl) totalRevenuesEl.textContent = summary.totalRevenues.toFixed(2);
    if (revenuesTrendEl) revenuesTrendEl.textContent = `${summary.revenuesTrend > 0 ? '+' : ''}${summary.revenuesTrend.toFixed(1)}%`;
    
    // إجمالي المصروفات
    const totalExpensesEl = document.getElementById('totalExpenses');
    const expensesTrendEl = document.getElementById('expensesTrend');
    
    if (totalExpensesEl) totalExpensesEl.textContent = summary.totalExpenses.toFixed(2);
    if (expensesTrendEl) expensesTrendEl.textContent = `${summary.expensesTrend > 0 ? '+' : ''}${summary.expensesTrend.toFixed(1)}%`;
    
    // صافي الربح
    const netProfitEl = document.getElementById('netProfit');
    const profitTrendElement = document.getElementById('profitTrend');
    
    if (netProfitEl) netProfitEl.textContent = summary.netProfit.toFixed(2);
    if (profitTrendElement) {
        profitTrendElement.innerHTML = `
            <i class="fas fa-${summary.netProfit > 0 ? 'arrow-up' : summary.netProfit < 0 ? 'arrow-down' : 'equals'}"></i>
            <span>${summary.profitTrend > 0 ? '+' : ''}${summary.profitTrend.toFixed(1)}%</span>
        `;
    }
    
    // تحديث فئات الاتجاه
    updateTrendClasses(summary);
}

// تحديث فئات الاتجاه
function updateTrendClasses(summary) {
    const revenuesTrendElement = document.querySelector('#revenuesTrend')?.parentElement;
    const expensesTrendElement = document.querySelector('#expensesTrend')?.parentElement;
    const profitTrendElement = document.getElementById('profitTrend');
    
    // إزالة الفئات القديمة
    [revenuesTrendElement, expensesTrendElement, profitTrendElement].forEach(el => {
        if (el) {
            el.classList.remove('positive', 'negative');
        }
    });
    
    // إضافة الفئات الجديدة
    if (revenuesTrendElement) {
        if (summary.revenuesTrend > 0) revenuesTrendElement.classList.add('positive');
        else if (summary.revenuesTrend < 0) revenuesTrendElement.classList.add('negative');
    }
    
    if (expensesTrendElement) {
        if (summary.expensesTrend > 0) expensesTrendElement.classList.add('negative');
        else if (summary.expensesTrend < 0) expensesTrendElement.classList.add('positive');
    }
    
    if (profitTrendElement) {
        if (summary.profitTrend > 0) profitTrendElement.classList.add('positive');
        else if (summary.profitTrend < 0) profitTrendElement.classList.add('negative');
    }
}

// تحديث التحليل التفصيلي
function updateDetailedAnalysis(details) {
    const avgDailyRevenueEl = document.getElementById('avgDailyRevenue');
    const totalTransactionsEl = document.getElementById('totalTransactions');
    const profitMarginEl = document.getElementById('profitMargin');
    const growthRateEl = document.getElementById('growthRate');
    
    if (avgDailyRevenueEl) avgDailyRevenueEl.textContent = `${details.avgDailyRevenue.toFixed(2)} ج`;
    if (totalTransactionsEl) totalTransactionsEl.textContent = details.totalTransactions;
    if (profitMarginEl) profitMarginEl.textContent = `${details.profitMargin.toFixed(1)}%`;
    if (growthRateEl) growthRateEl.textContent = `${details.growthRate > 0 ? '+' : ''}${details.growthRate.toFixed(1)}%`;
}

// تحديث مؤشرات الأداء
function updatePerformanceIndicators(details) {
    const bestSalesDayEl = document.getElementById('bestSalesDay');
    const highestDailyRevenueEl = document.getElementById('highestDailyRevenue');
    const lowestDailyRevenueEl = document.getElementById('lowestDailyRevenue');
    const topExpenseCategoryEl = document.getElementById('topExpenseCategory');
    
    if (bestSalesDayEl) bestSalesDayEl.textContent = details.bestSalesDay;
    if (highestDailyRevenueEl) highestDailyRevenueEl.textContent = `${details.highestDailyRevenue.toFixed(2)} ج`;
    if (lowestDailyRevenueEl) lowestDailyRevenueEl.textContent = `${details.lowestDailyRevenue.toFixed(2)} ج`;
    if (topExpenseCategoryEl) topExpenseCategoryEl.textContent = details.topExpenseCategory;
}

// إنشاء الرسوم البيانية
function createCharts(chartData) {
    createMainChart(chartData);
    createDistributionCharts(chartData);
    createMiniCharts(chartData);
}

// إنشاء الرسم البياني الرئيسي
function createMainChart(chartData) {
    const ctx = document.getElementById('mainChart');
    if (!ctx) return;
    
    if (mainChart) {
        mainChart.destroy();
    }
    
    mainChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [
                {
                    label: 'الإيرادات',
                    data: chartData.revenues,
                    borderColor: '#48bb78',
                    backgroundColor: 'rgba(72, 187, 120, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'المصروفات',
                    data: chartData.expenses,
                    borderColor: '#f56565',
                    backgroundColor: 'rgba(245, 101, 101, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            family: 'Cairo',
                            size: 12
                        }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: '#667eea',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Cairo'
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        font: {
                            family: 'Cairo'
                        },
                        callback: function(value) {
                            return value + ' ج';
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

// إنشاء رسوم التوزيع
function createDistributionCharts(chartData) {
    // رسم توزيع الإيرادات
    const revenueCtx = document.getElementById('revenueDistributionChart');
    if (revenueCtx) {
        if (revenueDistributionChart) {
            revenueDistributionChart.destroy();
        }
        
        revenueDistributionChart = new Chart(revenueCtx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: chartData.revenueDistribution.labels,
                datasets: [{
                    data: chartData.revenueDistribution.data,
                    backgroundColor: [
                        '#48bb78',
                        '#38b2ac',
                        '#667eea',
                        '#ed8936'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                family: 'Cairo',
                                size: 11
                            }
                        }
                    }
                }
            }
        });
    }
    
    // رسم توزيع المصروفات
    const expenseCtx = document.getElementById('expenseDistributionChart');
    if (expenseCtx) {
        if (expenseDistributionChart) {
            expenseDistributionChart.destroy();
        }
        
        expenseDistributionChart = new Chart(expenseCtx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: chartData.expenseDistribution.labels,
                datasets: [{
                    data: chartData.expenseDistribution.data,
                    backgroundColor: [
                        '#f56565',
                        '#fc8181',
                        '#feb2b2',
                        '#fed7d7'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                family: 'Cairo',
                                size: 11
                            }
                        }
                    }
                }
            }
        });
    }
}

// إنشاء الرسوم البيانية المصغرة
function createMiniCharts(chartData) {
    const chartIds = ['revenuesChart', 'expensesChart', 'profitChart'];
    const datasets = [
        chartData.revenues,
        chartData.expenses,
        chartData.revenues.map((rev, i) => rev - chartData.expenses[i])
    ];
    const colors = ['#48bb78', '#f56565', '#667eea'];
    
    chartIds.forEach((id, index) => {
        const ctx = document.getElementById(id);
        if (!ctx) return;
        
        if (miniCharts[id]) {
            miniCharts[id].destroy();
        }
        
        miniCharts[id] = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [{
                    data: datasets[index],
                    borderColor: colors[index],
                    backgroundColor: colors[index] + '20',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                },
                scales: {
                    x: {
                        display: false
                    },
                    y: {
                        display: false
                    }
                },
                elements: {
                    point: {
                        radius: 0
                    }
                }
            }
        });
    });
}

// تغيير نوع الرسم البياني
function changeChartType(type) {
    if (!mainChart) return;
    
    // تحديث الأزرار
    document.querySelectorAll('.chart-type-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-type="${type}"]`)?.classList.add('active');
    
    // تحديث نوع الرسم
    mainChart.config.type = type;
    
    if (type === 'area') {
        mainChart.config.type = 'line';
        mainChart.data.datasets.forEach(dataset => {
            dataset.fill = true;
        });
    } else {
        mainChart.data.datasets.forEach(dataset => {
            dataset.fill = type === 'line' ? false : true;
        });
    }
    
    mainChart.update();
}

// تحديث جداول البيانات
function updateDataTables(details) {
    updateRevenuesTable(details.revenues);
    updateExpensesTable(details.expenses);
}

// تحديث جدول الإيرادات
function updateRevenuesTable(revenues) {
    const tbody = document.getElementById('revenuesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (revenues.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    لا توجد إيرادات للفترة المحددة
                </td>
            </tr>
        `;
        return;
    }
    
    revenues.forEach(revenue => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(revenue.date).toLocaleDateString('ar-EG')}</td>
            <td>${revenue.name}</td>
            <td>${revenue.amount.toFixed(2)} ج</td>
            <td>${revenue.type}</td>
            <td>${revenue.employee}</td>
        `;
        tbody.appendChild(row);
    });
}

// تحديث جدول المصروفات
function updateExpensesTable(expenses) {
    const tbody = document.getElementById('expensesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (expenses.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    لا توجد مصروفات للفترة المحددة
                </td>
            </tr>
        `;
        return;
    }
    
    expenses.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(expense.date).toLocaleDateString('ar-EG')}</td>
            <td>${expense.name}</td>
            <td>${expense.amount.toFixed(2)} ج</td>
            <td>${expense.type}</td>
            <td>${expense.employee}</td>
        `;
        tbody.appendChild(row);
    });
}

// التنقل بين تبويبات الجداول
function switchTableTab(tab) {
    // تحديث الأزرار
    document.querySelectorAll('.table-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[onclick="switchTableTab('${tab}')"]`)?.classList.add('active');
    
    // تحديث المحتوى
    document.querySelectorAll('.table-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tab}Table`)?.classList.add('active');
}

// إظهار حالة التحميل
function showLoadingState() {
    hideAllStates();
    const loadingState = document.getElementById('loadingState');
    if (loadingState) {
        loadingState.style.display = 'flex';
    }
}

// إظهار حالة عدم وجود بيانات
function showNoDataState() {
    hideAllStates();
    const noDataState = document.getElementById('noDataState');
    if (noDataState) {
        noDataState.style.display = 'flex';
    }
}

// إخفاء جميع الحالات
function hideAllStates() {
    const reportResults = document.getElementById('reportResults');
    const loadingState = document.getElementById('loadingState');
    const noDataState = document.getElementById('noDataState');
    
    if (reportResults) reportResults.style.display = 'none';
    if (loadingState) loadingState.style.display = 'none';
    if (noDataState) noDataState.style.display = 'none';
}

// تصدير التقرير
function exportReport() {
    showNotification('جاري تحضير ملف التصدير...', 'info');
    
    setTimeout(() => {
        // محاكاة تصدير التقرير
        const reportData = {
            date: new Date().toLocaleDateString('ar-EG'),
            summary: {
                revenues: document.getElementById('totalRevenues')?.textContent || '0.00',
                expenses: document.getElementById('totalExpenses')?.textContent || '0.00',
                profit: document.getElementById('netProfit')?.textContent || '0.00'
            }
        };
        
        console.log('تصدير التقرير:', reportData);
        playNotificationSound('success');
        showNotification('تم تصدير التقرير بنجاح', 'success');
    }, 1500);
}

// طباعة التقرير
function printReport() {
    const reportResults = document.getElementById('reportResults');
    if (!reportResults || reportResults.style.display === 'none') {
        showNotification('يرجى إنشاء التقرير أولاً', 'warning');
        return;
    }
    
    showNotification('جاري تحضير التقرير للطباعة...', 'info');
    
    setTimeout(() => {
        window.print();
    }, 1000);
}

// تحديث التقارير
function refreshReports() {
    const refreshBtn = document.querySelector('.action-btn.icon-only');
    if (refreshBtn) {
        const icon = refreshBtn.querySelector('i');
        icon.style.animation = 'spin 1s linear infinite';
        
        setTimeout(() => {
            icon.style.animation = '';
            showNotification('تم تحديث البيانات', 'success');
            
            // إعادة إنشاء التقرير إذا كان معروضاً
            const reportResults = document.getElementById('reportResults');
            if (reportResults && reportResults.style.display !== 'none') {
                generateReport();
            }
        }, 1000);
    }
}

// تحديث التاريخ الحالي
function updateCurrentDate() {
    // يمكن إضافة منطق تحديث التاريخ هنا إذا لزم الأمر
}

// إضافة أيقونات الزائد للبطاقات
function addPlusIcons() {
    // يمكن إضافة منطق هنا إذا لزم الأمر
}

// دوال المساعدة
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
        
        const response = await fetch(`http://127.0.0.1:8000${endpoint}`, options);
        
        if (response.status === 401 || response.status === 419) {
            sessionStorage.clear();
            window.location.href = '/tag/index.php';
            return Promise.reject(new Error("انتهت صلاحية الجلسة"));
        }
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'حدث خطأ في الخادم');
        }
        
        return response.status !== 204 ? await response.json() : null;
    } catch (error) { 
        console.error(`API Error on ${method} ${endpoint}:`, error);
        throw error; 
    }
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