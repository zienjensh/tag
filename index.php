<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تسجيل الدخول</title>
    <link rel="stylesheet" href="css/login.css">
    <link rel="stylesheet" href="css/modal.css"> <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body>
    <div id="errorModal" class="modal">
        <div class="modal-content">
            <span class="close-btn" id="closeErrorModal">&times;</span>
            <div class="warning-icon">
                <span class="material-icons" style="color: #FF0000; font-size: 40px;">warning</span>
            </div>
            <p id="errorMessageText"></p>
            <a href="#" class="contact-btn">تواصل مع الدعم</a>
        </div>
    </div>

    <div class="login-container">
        <h2>تسجيل الدخول</h2>
        <form id="loginForm">
            <label for="username">اسم المستخدم</label>
            <input type="text" id="username" name="username" required>
            <label for="password">كلمة المرور</label>
            <input type="password" id="password" name="password" required>
            <button type="submit" id="loginButton">دخول</button>
        </form>
    </div>

    <script src="js/login.js"></script>
</body>
</html>