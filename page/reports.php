<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>التقارير والإحصائيات - نظام إدارة المقهى</title>
    <link rel="stylesheet" href="../css/money.css">
    <link rel="stylesheet" href="../css/reports.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <div id="overlay" class="overlay" onclick="toggleSidebar()"></div>

    <!-- Sidebar Toggle Button -->
    <div class="sidebar-toggle" onclick="toggleSidebar()">
        <i class="fas fa-bars"></i>
    </div>

    <!-- Enhanced Sidebar -->
    <div id="sidebar" class="sidebar">
        <div class="sidebar-header">
            <div class="logo-container">
                <img src="../uploads/logo.png" alt="Logo" class="logo-img">
                <div class="logo-text">
                    <h3>مقهى النجمة</h3>
                    <span>نظام الإدارة</span>
                </div>
            </div>
        </div>
        
        <nav class="sidebar-nav">
            <ul class="nav-list">
                <li><a href="money.php" class="nav-link">
                    <i class="fas fa-wallet"></i>
                    <span>النقدية</span>
                </a></li>
                <li><a href="devices.php" class="nav-link">
                    <i class="fas fa-desktop"></i>
                    <span>الأجهزة</span>
                </a></li>
                <li><a href="tables.php" class="nav-link">
                    <i class="fas fa-table"></i>
                    <span>التربيزات</span>
                </a></li>
                <li><a href="orders.php" class="nav-link">
                    <i class="fas fa-shopping-cart"></i>
                    <span>الأوردرات</span>
                </a></li>
                <li><a href="inventory.php" class="nav-link">
                    <i class="fas fa-boxes"></i>
                    <span>المخزن والأسعار</span>
                </a></li>
                <li><a href="customer.php" class="nav-link">
                    <i class="fas fa-users"></i>
                    <span>العملاء</span>
                </a></li>
                <li><a href="employees.php" class="nav-link">
                    <i class="fas fa-user-tie"></i>
                    <span>الموظفين</span>
                </a></li>
                <li><a href="setting.php" class="nav-link">
                    <i class="fas fa-cog"></i>
                    <span>الإعدادات</span>
                </a></li>
                <li><a href="reports.php" class="nav-link active">
                    <i class="fas fa-chart-bar"></i>
                    <span>التقارير</span>
                </a></li>
            </ul>
        </nav>
        
        <div class="sidebar-footer">
            <div class="user-profile">
                <div class="user-avatar">
                    <img src="../uploads/employee.jpg" alt="Employee">
                    <div class="status-dot"></div>
                </div>
                <div class="user-info">
                    <span class="user-name">محمد حامد</span>
                    <span class="user-role">مدير النظام</span>
                </div>
            </div>
            <button class="logout-btn">
                <i class="fas fa-sign-out-alt"></i>
                <span>تسجيل الخروج</span>
            </button>
        </div>
    </div>

    <div class="main-content">
        <!-- Page Header -->
        <header class="page-header">
            <div class="header-content">
                <div class="page-title">
                    <h1>التقارير والإحصائيات</h1>
                    <p>تحليل شامل للأداء المالي والعمليات التجارية</p>
                </div>
                <div class="header-actions">
                    <button class="action-btn primary" onclick="exportReport()">
                        <i class="fas fa-download"></i>
                        <span>تصدير التقرير</span>
                    </button>
                    <button class="action-btn secondary" onclick="printReport()">
                        <i class="fas fa-print"></i>
                        <span>طباعة</span>
                    </button>
                    <button class="action-btn icon-only" onclick="refreshReports()">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                </div>
            </div>
        </header>

        <!-- Date Range Selector -->
        <div class="date-range-section">
            <div class="date-range-card">
                <div class="card-header">
                    <div class="header-icon">
                        <i class="fas fa-calendar-alt"></i>
                    </div>
                    <div class="header-text">
                        <h3>فترة التقرير</h3>
                        <p>حدد الفترة الزمنية لعرض التقرير</p>
                    </div>
                </div>
                
                <div class="date-range-content">
                    <div class="date-inputs">
                        <div class="date-group">
                            <label for="fromDate">
                                <i class="fas fa-calendar-day"></i>
                                من تاريخ
                            </label>
                            <input type="date" id="fromDate" class="date-input">
                        </div>
                        
                        <div class="date-separator">
                            <i class="fas fa-arrow-left"></i>
                        </div>
                        
                        <div class="date-group">
                            <label for="toDate">
                                <i class="fas fa-calendar-check"></i>
                                إلى تاريخ
                            </label>
                            <input type="date" id="toDate" class="date-input">
                        </div>
                    </div>
                    
                    <div class="quick-dates">
                        <button class="quick-date-btn" onclick="setQuickDate('today')">اليوم</button>
                        <button class="quick-date-btn" onclick="setQuickDate('yesterday')">أمس</button>
                        <button class="quick-date-btn" onclick="setQuickDate('week')">هذا الأسبوع</button>
                        <button class="quick-date-btn" onclick="setQuickDate('month')">هذا الشهر</button>
                    </div>
                    
                    <button class="generate-report-btn" onclick="generateReport()">
                        <i class="fas fa-chart-line"></i>
                        <span>عرض البيانات</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Report Results -->
        <div id="reportResults" class="report-results" style="display: none;">
            <!-- Financial Summary Cards -->
            <div class="financial-summary">
                <div class="summary-card revenue-summary">
                    <div class="card-icon">
                        <i class="fas fa-arrow-up"></i>
                    </div>
                    <div class="card-content">
                        <h3>إجمالي الإيرادات</h3>
                        <div class="amount">
                            <span class="currency">ج</span>
                            <span class="value" id="totalRevenues">0.00</span>
                        </div>
                        <div class="trend positive">
                            <i class="fas fa-arrow-up"></i>
                            <span id="revenuesTrend">+0%</span>
                        </div>
                    </div>
                    <div class="card-chart">
                        <canvas id="revenuesChart"></canvas>
                    </div>
                </div>

                <div class="summary-card expense-summary">
                    <div class="card-icon">
                        <i class="fas fa-arrow-down"></i>
                    </div>
                    <div class="card-content">
                        <h3>إجمالي المصروفات</h3>
                        <div class="amount">
                            <span class="currency">ج</span>
                            <span class="value" id="totalExpenses">0.00</span>
                        </div>
                        <div class="trend negative">
                            <i class="fas fa-arrow-down"></i>
                            <span id="expensesTrend">+0%</span>
                        </div>
                    </div>
                    <div class="card-chart">
                        <canvas id="expensesChart"></canvas>
                    </div>
                </div>

                <div class="summary-card profit-summary">
                    <div class="card-icon">
                        <i class="fas fa-coins"></i>
                    </div>
                    <div class="card-content">
                        <h3>صافي الربح</h3>
                        <div class="amount">
                            <span class="currency">ج</span>
                            <span class="value" id="netProfit">0.00</span>
                        </div>
                        <div class="trend" id="profitTrend">
                            <i class="fas fa-equals"></i>
                            <span>0%</span>
                        </div>
                    </div>
                    <div class="card-chart">
                        <canvas id="profitChart"></canvas>
                    </div>
                </div>
            </div>

            <!-- Charts Section -->
            <div class="charts-section">
                <!-- Main Chart -->
                <div class="chart-card main-chart">
                    <div class="chart-header">
                        <h3>
                            <i class="fas fa-chart-area"></i>
                            تحليل الأداء المالي
                        </h3>
                        <div class="chart-controls">
                            <button class="chart-type-btn active" data-type="line" onclick="changeChartType('line')">
                                <i class="fas fa-chart-line"></i>
                            </button>
                            <button class="chart-type-btn" data-type="bar" onclick="changeChartType('bar')">
                                <i class="fas fa-chart-bar"></i>
                            </button>
                            <button class="chart-type-btn" data-type="area" onclick="changeChartType('area')">
                                <i class="fas fa-chart-area"></i>
                            </button>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="mainChart"></canvas>
                    </div>
                </div>

                <!-- Secondary Charts -->
                <div class="secondary-charts">
                    <div class="chart-card">
                        <div class="chart-header">
                            <h4>
                                <i class="fas fa-pie-chart"></i>
                                توزيع الإيرادات
                            </h4>
                        </div>
                        <div class="chart-container">
                            <canvas id="revenueDistributionChart"></canvas>
                        </div>
                    </div>

                    <div class="chart-card">
                        <div class="chart-header">
                            <h4>
                                <i class="fas fa-chart-pie"></i>
                                توزيع المصروفات
                            </h4>
                        </div>
                        <div class="chart-container">
                            <canvas id="expenseDistributionChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Detailed Analysis -->
            <div class="detailed-analysis">
                <div class="analysis-card">
                    <div class="card-header">
                        <h3>
                            <i class="fas fa-analytics"></i>
                            التحليل التفصيلي
                        </h3>
                    </div>
                    <div class="analysis-content">
                        <div class="analysis-grid">
                            <div class="analysis-item">
                                <div class="analysis-icon">
                                    <i class="fas fa-calendar-day"></i>
                                </div>
                                <div class="analysis-info">
                                    <h4>متوسط الإيرادات اليومية</h4>
                                    <span class="analysis-value" id="avgDailyRevenue">0.00 ج</span>
                                </div>
                            </div>

                            <div class="analysis-item">
                                <div class="analysis-icon">
                                    <i class="fas fa-receipt"></i>
                                </div>
                                <div class="analysis-info">
                                    <h4>عدد المعاملات</h4>
                                    <span class="analysis-value" id="totalTransactions">0</span>
                                </div>
                            </div>

                            <div class="analysis-item">
                                <div class="analysis-icon">
                                    <i class="fas fa-percentage"></i>
                                </div>
                                <div class="analysis-info">
                                    <h4>هامش الربح</h4>
                                    <span class="analysis-value" id="profitMargin">0%</span>
                                </div>
                            </div>

                            <div class="analysis-item">
                                <div class="analysis-icon">
                                    <i class="fas fa-trending-up"></i>
                                </div>
                                <div class="analysis-info">
                                    <h4>معدل النمو</h4>
                                    <span class="analysis-value" id="growthRate">0%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Performance Indicators -->
                <div class="performance-indicators">
                    <div class="indicator-card">
                        <div class="indicator-header">
                            <h4>مؤشرات الأداء</h4>
                        </div>
                        <div class="indicators-list">
                            <div class="indicator-item">
                                <div class="indicator-label">أفضل يوم في المبيعات</div>
                                <div class="indicator-value" id="bestSalesDay">-</div>
                            </div>
                            <div class="indicator-item">
                                <div class="indicator-label">أعلى إيراد يومي</div>
                                <div class="indicator-value" id="highestDailyRevenue">0.00 ج</div>
                            </div>
                            <div class="indicator-item">
                                <div class="indicator-label">أقل إيراد يومي</div>
                                <div class="indicator-value" id="lowestDailyRevenue">0.00 ج</div>
                            </div>
                            <div class="indicator-item">
                                <div class="indicator-label">أكثر المصروفات</div>
                                <div class="indicator-value" id="topExpenseCategory">-</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Data Tables -->
            <div class="data-tables-section">
                <div class="table-tabs">
                    <button class="table-tab active" onclick="switchTableTab('revenues')">
                        <i class="fas fa-arrow-up"></i>
                        تفاصيل الإيرادات
                    </button>
                    <button class="table-tab" onclick="switchTableTab('expenses')">
                        <i class="fas fa-arrow-down"></i>
                        تفاصيل المصروفات
                    </button>
                </div>

                <div id="revenuesTable" class="table-content active">
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>التاريخ</th>
                                    <th>اسم الإيراد</th>
                                    <th>المبلغ</th>
                                    <th>النوع</th>
                                    <th>الموظف</th>
                                </tr>
                            </thead>
                            <tbody id="revenuesTableBody">
                                <!-- سيتم ملؤها بواسطة JavaScript -->
                            </tbody>
                        </table>
                    </div>
                </div>

                <div id="expensesTable" class="table-content">
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>التاريخ</th>
                                    <th>اسم المصروف</th>
                                    <th>المبلغ</th>
                                    <th>النوع</th>
                                    <th>الموظف</th>
                                </tr>
                            </thead>
                            <tbody id="expensesTableBody">
                                <!-- سيتم ملؤها بواسطة JavaScript -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div id="loadingState" class="loading-state" style="display: none;">
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <h3>جاري تحليل البيانات...</h3>
                <p>يرجى الانتظار بينما نقوم بإعداد التقرير</p>
            </div>
        </div>

        <!-- No Data State -->
        <div id="noDataState" class="no-data-state" style="display: none;">
            <div class="no-data-content">
                <i class="fas fa-chart-line"></i>
                <h3>لا توجد بيانات للفترة المحددة</h3>
                <p>يرجى اختيار فترة زمنية أخرى أو التأكد من وجود بيانات</p>
                <button class="retry-btn" onclick="generateReport()">
                    <i class="fas fa-redo"></i>
                    إعادة المحاولة
                </button>
            </div>
        </div>
    </div>

    <script src="../js/reports.js"></script>
</body>
</html>