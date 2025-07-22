// js/login.js - النسخة المحسنة والمستقرة

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 بدء تحميل صفحة تسجيل الدخول...');
    
    // تحميل بيانات الموقع من قاعدة البيانات
    await loadSiteSettings();
    
    // إخفاء شاشة التحميل
    setTimeout(() => {
        document.body.classList.add('loaded');
        document.getElementById('loadingScreen').style.display = 'none';
    }, 2000);

    // ربط أحداث النموذج
    setupFormEvents();
    
    console.log('✅ تم تحميل صفحة تسجيل الدخول بنجاح');
});

// تحميل إعدادات الموقع من قاعدة البيانات
async function loadSiteSettings() {
    try {
        console.log('📡 جاري تحميل إعدادات الموقع...');
        
        const response = await fetch('http://127.0.0.1:8000/api/settings', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const settings = await response.json();
            console.log('✅ تم تحميل إعدادات الموقع:', settings);
            
            // تحديث اسم الموقع
            const siteName = settings.store_name || 'مقهى النجمة';
            document.getElementById('siteName').textContent = siteName;
            document.getElementById('loadingTitle').textContent = siteName;
            document.getElementById('pageTitle').textContent = `تسجيل الدخول - ${siteName}`;
            
            // تحديث اللوجو
            if (settings.store_logo) {
                const logoUrl = `http://127.0.0.1:8000/storage/${settings.store_logo}`;
                document.getElementById('siteLogo').src = logoUrl;
                document.getElementById('loadingLogo').src = logoUrl;
            }
        } else {
            console.warn('⚠️ فشل تحميل إعدادات الموقع، استخدام القيم الافتراضية');
        }
    } catch (error) {
        console.error('❌ خطأ في تحميل إعدادات الموقع:', error);
        // استخدام القيم الافتراضية
    }
}

// إعداد أحداث النموذج
function setupFormEvents() {
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('✅ تم ربط حدث النموذج');
    }
    
    // إضافة مستمع لمفتاح Enter
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !loginButton.disabled) {
            e.preventDefault();
            handleLogin(e);
        }
    });
    
    console.log('✅ تم إعداد جميع الأحداث');
}

async function handleLogin(event) {
    event.preventDefault();
    console.log('🔐 بدء عملية تسجيل الدخول...');
    
    const loginButton = document.getElementById('loginButton');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    // التحقق من وجود البيانات
    if (!usernameInput.value.trim() || !passwordInput.value.trim()) {
        showError('يرجى إدخال اسم المستخدم وكلمة المرور');
        return;
    }
    
    // تفعيل حالة التحميل
    setLoadingState(true);
    
    try {
        console.log('📡 إرسال طلب تسجيل الدخول...');
        
        const response = await fetch('http://127.0.0.1:8000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ 
                username: usernameInput.value.trim(), 
                password: passwordInput.value.trim() 
            })
        });

        const data = await response.json();
        console.log('📨 استجابة الخادم:', data);

        if (!response.ok) {
            throw new Error(data.message || 'فشل تسجيل الدخول');
        }
        
        // حفظ البيانات في sessionStorage
        sessionStorage.setItem('userData', JSON.stringify(data.user));
        sessionStorage.setItem('userPages', JSON.stringify(data.pages));
        sessionStorage.setItem('authToken', data.token);
        
        console.log('✅ تم حفظ بيانات المستخدم');
        
        // تأثير نجاح
        showSuccessAnimation();
        showSuccess('تم تسجيل الدخول بنجاح! جاري التوجيه...');
        
        // انتظار قصير لإظهار التأثير ثم التوجيه
        setTimeout(() => {
            window.location.href = 'page/money.php';
        }, 1500);

    } catch (error) {
        console.error('❌ خطأ في تسجيل الدخول:', error);
        
        // تأثير خطأ
        showErrorAnimation();
        showError(error.message);
        
        // إعادة تعيين الزر
        setLoadingState(false);
        
        // تمييز الحقول بالأحمر
        usernameInput.style.borderColor = 'var(--error-color)';
        passwordInput.style.borderColor = 'var(--error-color)';
    }
}

function setLoadingState(loading) {
    const loginButton = document.getElementById('loginButton');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    if (loading) {
        loginButton.classList.add('loading');
        loginButton.disabled = true;
        usernameInput.disabled = true;
        passwordInput.disabled = true;
    } else {
        loginButton.classList.remove('loading');
        loginButton.disabled = false;
        usernameInput.disabled = false;
        passwordInput.disabled = false;
    }
}

function showSuccessAnimation() {
    const loginContainer = document.querySelector('.login-container');
    loginContainer.style.transform = 'scale(1.02)';
    loginContainer.style.boxShadow = '0 20px 40px rgba(72, 187, 120, 0.3)';
    loginContainer.style.borderColor = 'var(--success-color)';
    
    // إضافة تأثير الضوء الأخضر
    const successOverlay = document.createElement('div');
    successOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(72, 187, 120, 0.1);
        z-index: 1;
        animation: successFlash 1s ease-out;
    `;
    document.body.appendChild(successOverlay);
    
    setTimeout(() => successOverlay.remove(), 1000);
}

function showErrorAnimation() {
    const loginContainer = document.querySelector('.login-container');
    
    // تأثير الاهتزاز
    loginContainer.style.animation = 'shake 0.5s ease-in-out';
    
    setTimeout(() => {
        loginContainer.style.animation = '';
    }, 500);
}

function showSuccess(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'error');
}

function showNotification(message, type = 'info') {
    // إزالة الإشعارات السابقة
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
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

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        toggleBtn.className = 'fas fa-eye';
    }
}

// إضافة أنماط CSS للأنيميشن
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    @keyframes successFlash {
        0% { opacity: 0; }
        50% { opacity: 1; }
        100% { opacity: 0; }
    }
    
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
    
    .input-wrapper input:invalid {
        border-color: var(--error-color);
        box-shadow: 0 0 0 3px rgba(245, 101, 101, 0.1);
    }
    
    .input-wrapper input:valid {
        border-color: var(--success-color);
    }
    
    .notification {
        font-family: 'Cairo', sans-serif;
    }
`;
document.head.appendChild(style);