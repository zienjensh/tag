// js/login.js - النسخة المحسنة مع تحميل بيانات الموقع

document.addEventListener('DOMContentLoaded', async () => {
    // تحميل بيانات الموقع من قاعدة البيانات
    await loadSiteSettings();
    
    // إخفاء شاشة التحميل
    setTimeout(() => {
        document.body.classList.add('loaded');
        document.getElementById('loadingScreen').style.display = 'none';
    }, 2000);

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleLogin();
        });
    }
    
    // إغلاق مودال الخطأ
    document.getElementById('closeErrorModal')?.addEventListener('click', closeErrorModal);
    
    // إضافة مستمع لمفتاح Enter
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !document.querySelector('.modal.active')) {
            const loginBtn = document.getElementById('loginButton');
            if (loginBtn && !loginBtn.disabled) {
                loginBtn.click();
            }
        }
    });
});

// تحميل إعدادات الموقع من قاعدة البيانات
async function loadSiteSettings() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/settings', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const settings = await response.json();
            
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
        }
    } catch (error) {
        console.log('فشل تحميل إعدادات الموقع:', error);
        // استخدام القيم الافتراضية
    }
}

async function handleLogin() {
    const loginButton = document.getElementById('loginButton');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    // تفعيل حالة التحميل
    loginButton.classList.add('loading');
    loginButton.disabled = true;
    
    // إضافة تأثيرات بصرية
    usernameInput.style.borderColor = 'var(--gray-300)';
    passwordInput.style.borderColor = 'var(--gray-300)';
    
    try {
        const response = await fetch('http://127.0.0.1:8000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ 
                username: usernameInput.value, 
                password: passwordInput.value 
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'فشل تسجيل الدخول');
        }
        
        // حفظ البيانات في sessionStorage
        sessionStorage.setItem('userData', JSON.stringify(data.user));
        sessionStorage.setItem('userPages', JSON.stringify(data.pages));
        sessionStorage.setItem('authToken', data.token);
        
        // تأثير نجاح
        showSuccessAnimation();
        
        // انتظار قصير لإظهار التأثير ثم التوجيه
        setTimeout(() => {
            window.location.href = 'page/money.php';
        }, 1500);

    } catch (error) {
        // تأثير خطأ
        showErrorAnimation();
        
        // إظهار مودال الخطأ
        showErrorModal(error.message);
        
        // إعادة تعيين الزر
        loginButton.classList.remove('loading');
        loginButton.disabled = false;
        
        // تمييز الحقول بالأحمر
        usernameInput.style.borderColor = 'var(--error-color)';
        passwordInput.style.borderColor = 'var(--error-color)';
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

function showErrorModal(message) {
    const errorModal = document.getElementById('errorModal');
    const errorMessageText = document.getElementById('errorMessageText');
    
    errorMessageText.textContent = message;
    errorModal.classList.add('active');
    
    // تشغيل صوت خطأ (اختياري)
    playErrorSound();
}

function closeErrorModal() {
    const errorModal = document.getElementById('errorModal');
    errorModal.classList.remove('active');
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

function playErrorSound() {
    try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
        audio.volume = 0.3;
        audio.play().catch(e => console.log('Sound play failed:', e));
    } catch (e) {
        console.log('Sound error:', e);
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
    
    .input-wrapper input:invalid {
        border-color: var(--error-color);
        box-shadow: 0 0 0 3px rgba(245, 101, 101, 0.1);
    }
    
    .input-wrapper input:valid {
        border-color: var(--success-color);
    }
`;
document.head.appendChild(style);