// js/main.js - النسخة المُصححة مع نظام المصادقة المحسن

const API_BASE_URL = 'http://127.0.0.1:8000';
const PROJECT_ROOT = '/tag';

document.addEventListener('DOMContentLoaded', () => {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const overlay = document.getElementById('overlay');
    if (sidebarToggle) sidebarToggle.addEventListener('click', toggleSidebar);
    if (overlay) overlay.addEventListener('click', toggleSidebar);
    
    if (!window.location.pathname.includes('index.php')) {
        buildSidebar();
    }
});

function toggleSidebar() {
    document.getElementById('sidebar')?.classList.toggle('active');
    document.getElementById('overlay')?.classList.toggle('active');
}

async function buildSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const userData = JSON.parse(sessionStorage.getItem('userData'));
    let userPages = JSON.parse(sessionStorage.getItem('userPages'));
    let settings = JSON.parse(sessionStorage.getItem('settings'));

    if (!userData) {
        window.location.href = `${PROJECT_ROOT}/index.php`; 
        return;
    }

    if (!settings) {
        try {
            settings = await sendRequest('/api/settings', 'GET');
            sessionStorage.setItem('settings', JSON.stringify(settings));
        } catch (e) { settings = {}; }
    }
    
    if (userData.role === 'admin' && (!userPages || userPages.length === 0)) {
        try {
            userPages = await sendRequest('/api/pages', 'GET');
            sessionStorage.setItem('userPages', JSON.stringify(userPages));
        } catch(e) { userPages = []; }
    }
    
    if (!userPages) return;

    let navLinks = '';
    const currentPage = window.location.pathname.split('/').pop();
    
    userPages.forEach(page => {
        const isActive = currentPage === page.route ? 'active' : '';
        navLinks += `<li><a href="${PROJECT_ROOT}/page/${page.route}" class="nav-link ${isActive}"><i class="${page.icon_class}"></i><span>${page.name}</span></a></li>`;
    });

    sidebar.innerHTML = `
        <div class="sidebar-header"><div class="logo-container"><img src="${settings?.store_logo ? '/storage/' + settings.store_logo : '../uploads/logo.png'}" alt="Logo" class="logo-img"><div class="logo-text"><h3>${settings?.store_name || 'اسم المحل'}</h3><span>نظام الإدارة</span></div></div></div>
        <nav class="sidebar-nav"><ul class="nav-list">${navLinks}</ul></nav>
        <div class="sidebar-footer"><div class="user-profile"><div class="user-avatar"><img src="../uploads/employee.jpg" alt="Employee"><div class="status-dot"></div></div><div class="user-info"><span class="user-name">${userData.name}</span><span class="user-role">${userData.role === 'admin' ? 'مدير النظام' : 'موظف'}</span></div></div><button class="logout-btn" id="logoutBtn"><i class="fas fa-sign-out-alt"></i><span>تسجيل الخروج</span></button></div>
    `;

    document.getElementById('logoutBtn')?.addEventListener('click', async () => {
        try {
            await sendRequest('/api/logout', 'POST');
        } catch (e) {
            console.log('Logout error:', e);
        } finally {
            sessionStorage.clear();
            window.location.href = `${PROJECT_ROOT}/index.php`;
        }
    });
}

/**
 * دالة إرسال الطلبات المحسنة مع معالجة أفضل للأخطاء
 */
async function sendRequest(endpoint, method, body = null, isFormData = false) {
    try {
        const headers = { 'Accept': 'application/json' };
        const options = { method, headers, credentials: 'include' };

        // إضافة التوكن إذا كان متوفراً
        const token = sessionStorage.getItem('authToken');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        if (body) {
            if (isFormData) {
                options.body = body;
            } else {
                headers['Content-Type'] = 'application/json';
                options.body = JSON.stringify(body);
            }
        }
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        if (response.status === 401 || response.status === 419) {
            sessionStorage.clear();
            window.location.href = `${PROJECT_ROOT}/index.php`;
            return Promise.reject(new Error("انتهت صلاحية الجلسة"));
        }

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessages = errorData.errors ? 
                Object.values(errorData.errors).flat().join('\n') : 
                errorData.message || 'حدث خطأ غير متوقع';
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
    const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle' };
    container.innerHTML = `<i class="fas ${icons[type]}"></i><span style="margin-right: 10px;">${message}</span>`;
    document.body.appendChild(container);

    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `.notification { position: fixed; top: 20px; right: 20px; background: white; padding: 15px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 10px; z-index: 10000; transform: translateX(calc(100% + 20px)); transition: transform 0.5s ease-in-out; } .notification.show { transform: translateX(0); } .notification.success { border-left: 5px solid #28a745; } .notification.error { border-left: 5px solid #dc3545; } .notification.info { border-left: 5px solid #17a2b8; }`;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        container.classList.remove('show');
        setTimeout(() => container.remove(), 500);
    }, 4000);
}