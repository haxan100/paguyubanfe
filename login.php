<?php
session_start();
require_once 'config.php';

header('Content-Type: application/json');

if ($_POST['email'] && $_POST['password']) {
    $email = $_POST['email'];
    $password = $_POST['password'];
    
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['nama'] = $user['nama'];
        $_SESSION['jenis'] = $user['jenis'];
        
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Email atau password salah']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Email dan password harus diisi']);
}
?>