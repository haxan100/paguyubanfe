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
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```
lsof -ti:3001 | xargs kill -9

### Server Only
```bash
npm run server
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

- `npm run dev` - Menjalankan development server
- `npm run build` - Build untuk production
- `npm run preview` - Preview build production
- `npm run lint` - Linting kode
- `npm run server` - Menjalankan backend server
- `npm start` - Build dan jalankan production

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

1. **Jalankan backend server terlebih dahulu:**
```bash
npm run server
```

2. **Build aplikasi jika belum ada folder dist:**
```bash
npm run build
```

3. **Jalankan frontend di terminal terpisah:**
```bash
npm run dev
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
