<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_POST['nama'] && $_POST['email'] && $_POST['no_hp'] && $_POST['blok'] && $_POST['jenis'] && $_POST['password']) {
    $nama = $_POST['nama'];
    $email = $_POST['email'];
    $no_hp = $_POST['no_hp'];
    $blok = $_POST['blok'];
    $jenis = $_POST['jenis'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    
    try {
        $stmt = $pdo->prepare("INSERT INTO users (nama, email, no_hp, blok, jenis, password) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$nama, $email, $no_hp, $blok, $jenis, $password]);
        
        echo json_encode(['status' => 'success']);
    } catch(PDOException $e) {
        if ($e->getCode() == 23000) {
            echo json_encode(['status' => 'error', 'message' => 'Email sudah terdaftar']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Gagal mendaftar']);
        }
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Semua field harus diisi']);
}
?>