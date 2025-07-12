# 🎓 Tutorial Sistem Paguyuban FE

## 📋 Daftar Isi
1. [Instalasi dan Setup](#instalasi-dan-setup)
2. [Menjalankan Aplikasi](#menjalankan-aplikasi)
3. [Panduan User](#panduan-user)
4. [Panduan Admin](#panduan-admin)
5. [Troubleshooting](#troubleshooting)

## 🛠️ Instalasi dan Setup

### 1. Prerequisites
Pastikan sudah terinstall:
- **Node.js** v16+ ([Download](https://nodejs.org/))
- **MySQL** v8+ ([Download](https://dev.mysql.com/downloads/))
- **Git** ([Download](https://git-scm.com/))

### 2. Clone Repository
```bash
git clone <repository-url>
cd paguyubanfe
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Setup Database
```bash
# Otomatis (Recommended)
node setup-database.js

# Manual
mysql -u root -p
CREATE DATABASE paguyuban;
USE paguyuban;
SOURCE database.sql;
```

### 5. Konfigurasi Environment
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=paguyuban
JWT_SECRET=your-secret-key
PORT=3001
```

## 🚀 Menjalankan Aplikasi

### Development Mode
```bash
# Terminal 1 - Backend Server
npm run server

# Terminal 2 - Frontend Dev Server
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Akses Aplikasi
- **URL**: http://localhost:3001
- **Development**: http://localhost:5173 (frontend) + http://localhost:3001 (backend)

## 👤 Panduan User

### 🔐 Login
1. Buka aplikasi di browser
2. Gunakan akun demo:
   - **Warga**: `warga@paguyuban.com` / `123456`
   - **Koordinator**: `koordinator@paguyuban.com` / `123456`
   - **Admin**: `admin@paguyuban.com` / `123456`
   - **Ketua**: `ketua@paguyuban.com` / `123456`

### 📱 Navigasi Mobile
- **Bottom Navigation**: 7 menu di bawah layar
- **Swipe**: Geser horizontal untuk menu lebih banyak
- **Profile**: Tap profile untuk dark mode dan logout

### 🖥️ Navigasi Desktop
- **Sidebar**: Menu di kiri layar
- **Theme Toggle**: Button di sidebar bawah
- **User Info**: Info user di atas sidebar

### 📰 Info Warga (Semua User)
**Membuat Postingan:**
1. Klik menu "Info Warga"
2. Tulis konten di textarea
3. (Opsional) Upload foto
4. Klik "Posting"

**Interaksi:**
- **Like**: Klik ❤️ untuk like postingan
- **Comment**: Klik 💬 untuk buka komentar
- **View Photo**: Klik foto untuk buka full size

### 💰 Pembayaran (Warga)
**Upload Pembayaran:**
1. Klik menu "Pembayaran"
2. Klik "Tambah Pembayaran"
3. Pilih tahun dan bulan
4. Upload bukti transfer (wajib)
5. Klik "Upload"

**Status Pembayaran:**
- 🟡 **Menunggu Konfirmasi**: Sedang diproses
- 🟢 **Lunas**: Sudah dikonfirmasi
- 🔴 **Ditolak**: Ditolak dengan catatan

### 🚨 Aduan (Warga)
**Buat Aduan:**
1. Klik menu "Aduan Saya"
2. Klik "Tambah Aduan"
3. Isi judul, kategori, deskripsi
4. (Opsional) Upload foto
5. Klik "Kirim"

**Status Aduan:**
- 🟡 **Pending**: Menunggu respon
- 🔵 **Proses**: Sedang ditangani
- 🟢 **Selesai**: Sudah diselesaikan

### 📊 Pengeluaran & Buku Kas (Semua User)
**Lihat Pengeluaran:**
- Klik menu "Pengeluaran"
- Lihat tabel pengeluaran paguyuban
- Klik foto untuk lihat bukti

**Lihat Buku Kas:**
- Klik menu "Buku Kas"
- Lihat saldo dan transaksi
- Gunakan filter tanggal
- Export data ke CSV

## 👨‍💼 Panduan Admin

### 🏠 Dashboard Admin
- **Statistik**: Lihat ringkasan data
- **Grafik**: Visual data pembayaran dan aduan
- **Quick Actions**: Akses cepat ke fitur utama

### 👥 Kelola User (Admin/Ketua)
**Tambah User:**
1. Klik menu "Kelola Warga"
2. Klik "Tambah User"
3. Isi form lengkap
4. Pilih role (admin/koordinator)
5. Klik "Simpan"

**Edit User:**
1. Klik tombol edit (✏️)
2. Ubah data yang diperlukan
3. Klik "Update"

### 💳 Kelola Pembayaran (Ketua)
**Konfirmasi Pembayaran:**
1. Klik menu "Pembayaran Warga"
2. Lihat pembayaran pending
3. Klik "Konfirmasi" atau "Tolak"
4. (Opsional) Tambahkan catatan
5. Klik "Simpan"

**Export Laporan:**
1. Pilih tahun dan bulan
2. Klik "Export"
3. File CSV akan terdownload

### 💸 Kelola Pengeluaran (Admin/Ketua)
**Tambah Pengeluaran:**
1. Klik menu "Pengeluaran"
2. Klik "Tambah Pengeluaran"
3. Isi form:
   - Tahun dan bulan
   - Judul pengeluaran
   - Jumlah (angka)
   - Deskripsi detail
   - Upload foto bukti (wajib)
4. Klik "Simpan"

**Hapus Pengeluaran:**
1. Klik tombol hapus (🗑️)
2. Konfirmasi penghapusan
3. Data akan terhapus permanen

### 📊 Buku Kas (Semua User)
**Filter Data:**
1. Klik "Filter"
2. Pilih "Dari Tanggal" dan "Sampai Tanggal"
3. Data otomatis terfilter
4. Klik "Reset Filter" untuk reset

**Export Buku Kas:**
1. (Opsional) Set filter tanggal
2. Klik "Export"
3. File CSV berisi semua transaksi

### 🚨 Kelola Aduan (Admin/Koordinator/Ketua)
**Respon Aduan:**
1. Klik menu "Aduan Warga"
2. Pilih aduan yang akan direspon
3. Ubah status (Proses/Selesai)
4. Tulis jawaban
5. (Opsional) Upload foto jawaban
6. Klik "Update"

## 🔔 Notifikasi Real-time

### Untuk Ketua
Akan menerima notifikasi suara + popup saat:
- 📰 **Postingan baru** dari warga
- 💰 **Pembayaran baru** dari warga
- 🚨 **Aduan baru** dari warga

### Untuk Warga
Akan menerima notifikasi saat:
- ✅ **Pembayaran dikonfirmasi** oleh ketua
- ❌ **Pembayaran ditolak** oleh ketua (dengan catatan)

### Setting Notifikasi
- **Sound**: Otomatis aktif
- **Browser**: Izinkan notifikasi di browser
- **Volume**: Suara notifikasi volume 50%

## 🎨 Dark Mode

### Desktop
1. Klik tombol 🌙/☀️ di sidebar bawah
2. Theme otomatis berubah
3. Setting tersimpan otomatis

### Mobile
1. Tap menu "Profile"
2. Toggle switch "Mode Gelap/Terang"
3. Theme otomatis berubah

## 📱 Tips Mobile

### Navigasi
- **Swipe**: Geser bottom navigation untuk menu lebih
- **Tap**: Tap sekali untuk pindah menu
- **Scroll**: Scroll vertikal untuk konten

### Upload File
- **Camera**: Pilih "Camera" untuk foto langsung
- **Gallery**: Pilih "Gallery" untuk foto tersimpan
- **Preview**: Lihat preview sebelum upload

### Performance
- **Refresh**: Pull down untuk refresh data
- **Cache**: Data tersimpan sementara untuk speed
- **Offline**: Beberapa fitur tersedia offline

## 🔧 Troubleshooting

### ❌ Error Login
**Masalah**: "Email atau password salah"
**Solusi**:
1. Pastikan email dan password benar
2. Cek caps lock
3. Gunakan akun demo untuk testing
4. Reset password jika perlu

### 🔌 Error Koneksi
**Masalah**: "Network Error" atau "ECONNREFUSED"
**Solusi**:
1. Pastikan backend server berjalan (`npm run server`)
2. Cek port 3001 tidak digunakan aplikasi lain
3. Restart server jika perlu
4. Cek firewall/antivirus

### 📁 Error Upload File
**Masalah**: "File upload failed"
**Solusi**:
1. Pastikan file adalah gambar (jpg, png, gif)
2. Ukuran file maksimal 5MB
3. Cek folder `public/assets/uploads/` ada dan writable
4. Restart server setelah buat folder

### 🗄️ Error Database
**Masalah**: "Database connection failed"
**Solusi**:
1. Pastikan MySQL server berjalan
2. Cek kredensial database di `.env.local`
3. Pastikan database `paguyuban` sudah dibuat
4. Import ulang database jika perlu

### 🔔 Notifikasi Tidak Muncul
**Masalah**: Tidak ada notifikasi real-time
**Solusi**:
1. Refresh halaman
2. Cek console browser untuk error
3. Pastikan Socket.IO connection berhasil
4. Izinkan notifikasi di browser

### 📱 Mobile Layout Rusak
**Masalah**: Layout mobile tidak responsive
**Solusi**:
1. Refresh halaman
2. Clear browser cache
3. Cek viewport meta tag
4. Test di browser mobile lain

### 🎨 Dark Mode Tidak Tersimpan
**Masalah**: Theme reset setelah refresh
**Solusi**:
1. Cek localStorage browser
2. Clear browser data
3. Disable private/incognito mode
4. Update browser ke versi terbaru

## 📞 Support

### Debug Mode
Untuk debugging, buka Console browser (F12) dan lihat:
- **Socket Events**: Log koneksi Socket.IO
- **API Calls**: Log request/response API
- **Errors**: Log error yang terjadi

### Log Files
- **Server**: Lihat terminal server untuk log backend
- **Browser**: Lihat Console untuk log frontend
- **Network**: Lihat Network tab untuk API calls

### Contact
Jika masih ada masalah:
1. Screenshot error message
2. Catat langkah yang menyebabkan error
3. Cek versi browser dan OS
4. Hubungi developer dengan info lengkap

## 🎯 Best Practices

### Keamanan
- **Password**: Gunakan password kuat
- **Logout**: Selalu logout setelah selesai
- **File**: Hanya upload file yang diperlukan
- **Data**: Jangan share kredensial login

### Performance
- **Image**: Compress gambar sebelum upload
- **Browser**: Gunakan browser modern
- **Connection**: Pastikan koneksi internet stabil
- **Cache**: Clear cache jika ada masalah

### Usage
- **Backup**: Export data secara berkala
- **Update**: Update data secara real-time
- **Mobile**: Gunakan mobile untuk akses cepat
- **Desktop**: Gunakan desktop untuk admin tasks

---

**Selamat menggunakan Sistem Paguyuban FE! 🎉**