# Paguyuban FE - Sistem Manajemen Warga

Sistem manajemen warga berbasis web untuk mengelola aduan, pembayaran, dan administrasi paguyuban.

## 🚀 Teknologi

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express
- **Database**: MySQL
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## 📋 Fitur

- 🔐 Autentikasi pengguna (login/register)
- 📝 Sistem pengaduan warga
- 💰 Manajemen pembayaran
- 👥 Manajemen pengguna
- 📊 Dashboard dan laporan
- 📄 Manajemen dokumen
- ⚙️ Pengaturan sistem

## 🛠️ Instalasi

1. Clone repository
```bash
git clone <repository-url>
cd paguyubanfe
```

2. Install dependencies
```bash
npm install
```

3. Setup database
```bash
# Setup database otomatis (recommended)
node setup-database.js

# Atau manual import
mysql -u username -p database_name < database.sql
```

4. Konfigurasi environment
```bash
cp .env.local.example .env.local
# Edit .env.local dengan konfigurasi database Anda
```

## 🚀 Menjalankan Aplikasi

### Development

**Opsi 1 - Satu Terminal (Recommended):**
```bash
npm run dev:all
```
*Backend (port 5170) + Frontend (port 5174) jalan bersamaan*

**Opsi 2 - Dua Terminal Terpisah:**

*Terminal 1 - Backend Server:*
```bash
npm run server
```

*Terminal 2 - Frontend Vite:*
```bash
npm run dev
```

### Production

**Opsi 1 - Satu Terminal (Recommended):**
```bash
npm run build
npm run prod
```
*Build + jalankan backend & frontend preview bersamaan*

**Opsi 2 - Manual:**
```bash
npm run build
npm start
```
*Build + jalankan backend saja (serve static files)*

### Kill Process (jika port stuck)
```bash
# Windows
netstat -ano | findstr :5170
taskkill /PID <PID_NUMBER> /F

# Linux/Mac
lsof -ti:5170 | xargs kill -9
```

## 📁 Struktur Proyek

```
paguyubanfe/
├── src/                 # Frontend React
│   ├── components/      # Komponen React
│   ├── contexts/        # Context providers
│   └── App.tsx         # Main app component
├── api/                # API endpoints
├── controllers/        # Backend controllers
├── models/            # Database models
├── database/          # Database files
└── views/             # HTML templates
```

## 🔧 Scripts

### Development
- `npm run dev` - Frontend Vite development server
- `npm run server` - Backend Express server
- `npm run dev:all` - **Backend + Frontend bersamaan (1 terminal)**

### Production
- `npm run build` - Build frontend untuk production
- `npm run preview` - Preview build production
- `npm run prod` - **Backend + Frontend preview bersamaan (1 terminal)**
- `npm start` - Build + jalankan backend (serve static)

### Utilities
- `npm run lint` - Linting kode

## 📝 API Endpoints

- `POST /api/auth/login` - Login pengguna
- `POST /api/auth/register` - Registrasi pengguna
- `GET /api/complaints` - Daftar aduan
- `POST /api/complaints` - Buat aduan baru
- `GET /api/payments` - Daftar pembayaran
- `POST /api/payments` - Upload pembayaran
- `GET /api/users` - Manajemen pengguna

## 🔑 Kredensial Default

Untuk testing, gunakan kredensial berikut:
```json
{
  "email": "warga@paguyuban.com",
  "password": "123456789"
}
```

**Catatan**: Pastikan user sudah terdaftar di database atau gunakan endpoint register terlebih dahulu.

## 🔧 Troubleshooting

### Proxy Error (ECONNREFUSED)
Jika mendapat error proxy saat development:

**Solusi Mudah:**
```bash
npm run dev:all
```

**Atau Manual:**
1. **Pastikan backend server jalan terlebih dahulu:**
```bash
npm run server
```
*Tunggu sampai muncul pesan "Server running on port 5170"*

2. **Baru jalankan frontend di terminal terpisah:**
```bash
npm run dev
```

**Akses aplikasi:**
- Frontend: http://localhost:5174
- Backend API: http://localhost:5170

### Konfigurasi Port
Ubah port di file `.env`:
```env
BE_PORT=5170  # Backend port
FE_PORT=5174  # Frontend port
```

### Update Browserslist
Jika ada warning browserslist outdated:
```bash
npx update-browserslist-db@latest
```

### Login Error (Email atau password salah)
Jika mendapat error saat login:

1. **Pastikan database sudah disetup dan user sudah terdaftar**
2. **Cek koneksi database di file konfigurasi**
3. **Gunakan kredensial default untuk testing:**
   - Email: `warga@paguyuban.com`
   - Password: `123456789`
4. **Atau register user baru melalui endpoint `/api/auth/register`**

## 🤝 Kontribusi

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 Lisensi

Proyek ini dilisensikan di bawah MIT License.
lsof -ti:3001 | xargs kill -9