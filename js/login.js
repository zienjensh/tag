document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const loginButton = document.getElementById('loginButton');
            loginButton.disabled = true; loginButton.textContent = 'جاري التحقق...';
            try {
                // [الإصلاح] لا نستخدم التوكن، نعتمد على الكوكيز
                const data = await sendRequest('/api/login', 'POST', { 
                    username: document.getElementById('username').value, 
                    password: document.getElementById('password').value 
                });
                
                // تخزين البيانات بعد النجاح
                sessionStorage.setItem('userData', JSON.stringify(data.user));
                sessionStorage.setItem('userPages', JSON.stringify(data.pages));
                
                window.location.href = 'page/money.php';

            } catch (error) {
                const errorModal = document.getElementById('errorModal');
                const errorMessageText = document.getElementById('errorMessageText');
                errorMessageText.textContent = error.message;
                errorModal.style.display = 'block';
                
                loginButton.disabled = false; loginButton.textContent = 'دخول';
            }
        });
    }
    document.getElementById('closeErrorModal')?.addEventListener('click', () => {
        document.getElementById('errorModal').style.display = 'none';
    });
});
