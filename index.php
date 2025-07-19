<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title id="pageTitle">تسجيل الدخول - مقهى النجمة</title>
    <link rel="stylesheet" href="css/login.css">
    <link rel="stylesheet" href="css/modal.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <!-- Loading Screen -->
    <div id="loadingScreen" class="loading-screen">
        <div class="loading-content">
            <div class="loading-logo">
                <img id="loadingLogo" src="uploads/logo.png" alt="Logo">
            </div>
            <div class="loading-spinner">
                <div class="spinner"></div>
            </div>
            <h2 id="loadingTitle">مقهى النجمة</h2>
            <p>جاري تحميل النظام...</p>
        </div>
    </div>

    <!-- Error Modal -->
    <div id="errorModal" class="modal">
        <div class="modal-content error-modal">
            <span class="close-btn" id="closeErrorModal">&times;</span>
            <div class="error-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h3>خطأ في تسجيل الدخول</h3>
            <p id="errorMessageText"></p>
            <div class="modal-actions">
                <button class="contact-btn" onclick="closeErrorModal()">
                    <i class="fas fa-phone"></i>
                    تواصل مع الدعم
                </button>
                <button class="retry-btn" onclick="closeErrorModal()">
                    <i class="fas fa-redo"></i>
                    إعادة المحاولة
                </button>
            </div>
        </div>
    </div>

    <!-- Main Login Container -->
    <div class="login-wrapper">
        <!-- Background Animation -->
        <div class="background-animation">
            <div class="floating-shapes">
                <div class="shape shape-1"></div>
                <div class="shape shape-2"></div>
                <div class="shape shape-3"></div>
                <div class="shape shape-4"></div>
                <div class="shape shape-5"></div>
            </div>
        </div>

        <!-- Login Container -->
        <div class="login-container">
            <!-- Logo Section -->
            <div class="logo-section">
                <div class="logo-container">
                    <img id="siteLogo" src="uploads/logo.png" alt="Logo" class="site-logo">
                </div>
                <h1 id="siteName" class="site-name">مقهى النجمة</h1>
                <p class="site-subtitle">نظام إدارة المقاهي الذكي</p>
            </div>

            <!-- Login Form -->
            <div class="form-section">
                <div class="form-header">
                    <h2>تسجيل الدخول</h2>
                    <p>أدخل بيانات الدخول للوصول إلى النظام</p>
                </div>

                <form id="loginForm" class="login-form">
                    <div class="input-group">
                        <div class="input-wrapper">
                            <i class="fas fa-user input-icon"></i>
                            <input type="text" id="username" name="username" placeholder="اسم المستخدم" required>
                            <label for="username">اسم المستخدم</label>
                        </div>
                    </div>

                    <div class="input-group">
                        <div class="input-wrapper">
                            <i class="fas fa-lock input-icon"></i>
                            <input type="password" id="password" name="password" placeholder="كلمة المرور" required>
                            <label for="password">كلمة المرور</label>
                            <button type="button" class="toggle-password" onclick="togglePassword()">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>

                    <div class="form-options">
                        <label class="remember-me">
                            <input type="checkbox" id="rememberMe">
                            <span class="checkmark"></span>
                            <span>تذكرني</span>
                        </label>
                        <a href="#" class="forgot-password">نسيت كلمة المرور؟</a>
                    </div>

                    <button type="submit" id="loginButton" class="login-btn">
                        <span class="btn-text">دخول</span>
                        <span class="btn-loading">
                            <i class="fas fa-spinner fa-spin"></i>
                            جاري التحقق...
                        </span>
                    </button>
                </form>

                <!-- System Info -->
                <div class="system-info">
                    <div class="info-item">
                        <i class="fas fa-shield-alt"></i>
                        <span>نظام آمن ومحمي</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-clock"></i>
                        <span>متاح 24/7</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-headset"></i>
                        <span>دعم فني متواصل</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="login-footer">
            <p>&copy; 2025 مقهى النجمة - جميع الحقوق محفوظة</p>
            <div class="footer-links">
                <a href="#">الشروط والأحكام</a>
                <a href="#">سياسة الخصوصية</a>
                <a href="#">اتصل بنا</a>
            </div>
        </div>
    </div>

    <script src="js/login.js"></script>
</body>
</html>