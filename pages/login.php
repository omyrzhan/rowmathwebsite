
<?php
// DB connection
$host = "sql206.infinityfree.com";
$user = "if0_40372786";
$pass = "Paranoik3691";
$db   = "if0_40372786_mathdb";
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) die("DB Error");

// Handle login
session_start();
$message = "";
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password1 = $_POST['password'] ?? '';

    $stmt = $conn->prepare("SELECT id, password FROM user WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($id, $password);
        $stmt->fetch();

        if ($password1 == $password)  {
            $_SESSION['user_id'] = $id;
            header('Location: dashboard.php');
            exit;
        } else {
            $message = "Неверный пароль";
        }
    } else {
        $message = "Пользователь не найден";
    }
    $stmt->close();
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Login</title>
<link rel="stylesheet" href="../assets/css/style.css">
<link rel="stylesheet" href="../assets/css/responsive.css">
<style>
    body { font-family: Arial, sans-serif; background:#f4f4f4; }
    .login-box {
        width: 320px; margin: 120px auto; padding: 20px;
        background: white; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    input { width:100%; padding:10px; margin:8px 0; }
    button { width:100%; padding:10px; background:#0275d8; color:white; border:0; border-radius:5px; }
    .msg { color:red; text-align:center; }
</style>
</head>
<body>
    <nav class="navbar" role="navigation" aria-label="Main navigation">
        <div class="nav-container">
            <div class="nav-logo">
                <a href="../index.html" class="logo-link">RowMath</a>
            </div>
            <ul class="nav-menu" role="menubar">
                <li class="nav-item" role="none">
                    <a href="../index.html" class="nav-link" role="menuitem">Главная</a>
                </li>
                <li class="nav-item" role="none">
                    <a href="about.html" class="nav-link" role="menuitem">О сайте</a>
                </li>
                <li class="nav-item" role="none">
                    <a href="courses.html" class="nav-link" role="menuitem">Разделы</a>
                </li>
                <li class="nav-item" role="none">
                    <a href="resources.html" class="nav-link" role="menuitem">Ресурсы</a>
                </li>
                <li class="nav-item" role="none">
                    <a href="register.php" class="nav-link" role="menuitem">Регистрация</a>
                </li>
                <li class="nav-item" role="none">
                    <a href="contact.html" class="nav-link" role="menuitem">Контакты</a>
                </li>
            </ul>
            <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">
                <span class="hamburger"></span>
            </button>
        </div>
    </nav>
<div class="login-box">
    <h2>Вход</h2>
    <?php if ($message): ?>
        <div class="msg"><?= $message ?></div>
    <?php endif; ?>

    <form method="POST">
        <input type="text" name="username" placeholder="Логин" required>
        <input type="password" name="password" placeholder="Пароль" required>
        <button type="submit">Войти</button>
    </form>
</div>
</body>
</html>