
<?php
$host = "sql206.infinityfree.com";
$user = "if0_40372786";
$pass = "Paranoik3691";
$db   = "if0_40372786_mathdb";
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) die("DB Error");

session_start();
$message = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $email    = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if ($username && $email && $password) {
      
        $stmt = $conn->prepare("INSERT INTO user (username, password, email) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $username, $password, $email);

        if ($stmt->execute()) {
            header('Location: login.php');
            exit;
        } else {
            $message = "Ошибка: пользователь уже существует";
        }
        $stmt->close();
    } else {
        $message = "Заполните все поля";
    }
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Регистрация</title>
<style>
    body { font-family: Arial; background:#eef3f7; }
    .box {
        width:350px; margin:100px auto; padding:25px;
        background:white; border-radius:12px;
        box-shadow:0 0 12px rgba(0,0,0,0.15);
    }
    input { width:100%; padding:10px; margin:10px 0; border-radius:6px; border:1px solid #ccc; }
    button { width:100%; padding:12px; border:0; border-radius:6px; background:#28a745; color:white; font-size:16px; }
    a { text-decoration:none; color:#0275d8; }
    .msg { text-align:center; color:red; }
</style>
</head>
<body>
<div class="box">
<h2>Регистрация</h2>
<?php if ($message): ?><div class="msg"><?= $message ?></div><?php endif; ?>
<form method="POST">
    <input type="text" name="username" placeholder="Логин" required>
    <input type="email" name="email" placeholder="Email" required>
    <input type="password" name="password" placeholder="Пароль" required>
    <button type="submit">Создать аккаунт</button>
</form>
<p>Уже есть аккаунт? <a href="login.php">Войти</a></p>
</div>
</body>
</html>
