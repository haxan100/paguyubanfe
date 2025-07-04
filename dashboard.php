<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: login.html');
    exit;
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Dashboard Paguyuban</title>
</head>
<body>
    <h2>Selamat datang, <?php echo $_SESSION['nama']; ?>!</h2>
    <p>Jenis: <?php echo $_SESSION['jenis']; ?></p>
    <a href="logout.php">Logout</a>
</body>
</html>