
<?php
session_start();

// If user not logged in → redirect to login
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

// Connect DB
$host = "sql206.infinityfree.com";
$user = "if0_40372786";
$pass = "Paranoik3691";
$db   = "if0_40372786_mathdb";
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) die("DB Error");

// Fetch user info
$stmt = $conn->prepare("SELECT username, email FROM user WHERE id = ?");
$stmt->bind_param("i", $_SESSION['user_id']);
$stmt->execute();
$stmt->bind_result($username, $email);
$stmt->fetch();
$stmt->close();
?>
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Панель пользователя</title>
<style>
    body { font-family: Arial, sans-serif; background:#eef2f5; margin:0; }

    .header {
        background:#0275d8;
        padding:15px;
        color:white;
        font-size:20px;
        display:flex;
        justify-content:space-between;
        align-items:center;
    }
    .header a {
        color:white;
        text-decoration:none;
        font-weight:bold;
    }

    .container {
        margin:40px auto;
        max-width:600px;
        background:white;
        padding:25px;
        border-radius:12px;
        box-shadow:0 0 12px rgba(0,0,0,0.1);
    }

    h2 { margin-top:0; }

    .info {
        background:#f7f9fb;
        padding:15px;
        border-radius:8px;
        border:1px solid #dce3ec;
    }
</style>
</head>
<body>
<div class="header">
    <div>Добро пожаловать, <?= htmlspecialchars($username) ?>!</div>
    <div><a href="logout.php">Выйти</a></div>
</div>

<div class="container">
    <h2>Ваш профиль</h2>
    <div class="info">
        <p><strong>Логин:</strong> <?= htmlspecialchars($username) ?></p>
        <p><strong>Email:</strong> <?= htmlspecialchars($email) ?></p>
    </div>

    <h2 style="margin-top:30px;">Навигация</h2>
    <ul>
        <li><a href="#">Мои задачи</a></li>
        <li><a href="#">Настройки</a></li>
        <li><a href="#">Поддержка</a></li>
    </ul>
</div>
</body>
</html>
