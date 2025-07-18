document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const loginButton = document.getElementById('loginButton');
            loginButton.disabled = true; 
            loginButton.textContent = 'جاري التحقق...';
            
            try {
                const response = await fetch('http://127.0.0.1:8000/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ 
                        username: document.getElementById('username').value, 
                        password: document.getElementById('password').value 
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'فشل تسجيل الدخول');
                }
                
                // تخزين البيانات بعد النجاح
                sessionStorage.setItem('userData', JSON.stringify(data.user));
                sessionStorage.setItem('userPages', JSON.stringify(data.pages));
                sessionStorage.setItem('authToken', data.token);
                
                window.location.href = 'page/money.php';

            } catch (error) {
                const errorModal = document.getElementById('errorModal');
                const errorMessageText = document.getElementById('errorMessageText');
                errorMessageText.textContent = error.message;
                errorModal.style.display = 'block';
                
                loginButton.disabled = false; 
                loginButton.textContent = 'دخول';
            }
        });
    }
    
    document.getElementById('closeErrorModal')?.addEventListener('click', () => {
        document.getElementById('errorModal').style.display = 'none';
    });
});