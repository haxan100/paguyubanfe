# 📚 Dokumentasi Sistem Paguyuban FE

## 🏗️ Arsitektur Sistem

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: SweetAlert2
- **Real-time**: Socket.IO Client

### Backend
- **Runtime**: Node.js + Express
- **Database**: MySQL
- **Authentication**: JWT
- **File Upload**: Multer
- **Real-time**: Socket.IO Server

## 📁 Struktur Proyek

```
paguyubanfe/
├── src/                     # Frontend React
│   ├── components/          # Komponen React
│   │   ├── Dashboard.tsx    # Dashboard utama
│   │   ├── LoginForm.tsx    # Form login
│   │   ├── Layout.tsx       # Layout desktop
│   │   ├── MobileLayout.tsx # Layout mobile
│   │   ├── InfoWarga.tsx    # Postingan warga
│   │   ├── AduanWarga.tsx   # Kelola aduan
│   │   ├── PaymentWarga.tsx # Pembayaran warga
│   │   ├── Pengeluaran.tsx  # Kelola pengeluaran
│   │   ├── BukuKas.tsx      # Buku kas
│   │   └── Profile.tsx      # Profile user
│   ├── contexts/            # Context providers
│   │   ├── AuthContext.tsx  # Authentication
│   │   ├── DataContext.tsx  # Data management
│   │   └── ThemeContext.tsx # Dark/Light mode
│   ├── hooks/               # Custom hooks
│   │   └── useSocket.ts     # Socket.IO hook
│   └── utils/               # Utilities
│       └── api.ts           # API helper
├── controllers/             # Backend controllers
│   ├── AuthController.js    # Authentication
│   ├── PostController.js    # Postingan
│   ├── AduanController.js   # Aduan
│   ├── PaymentController.js # Pembayaran
│   ├── PengeluaranController.js # Pengeluaran
│   └── BukuKasController.js # Buku kas
├── models/                  # Database models
│   ├── User.js             # Model user
│   ├── Post.js             # Model postingan
│   ├── Aduan.js            # Model aduan
│   ├── Payment.js          # Model pembayaran
│   └── Pengeluaran.js      # Model pengeluaran
├── middleware/              # Middleware
│   └── auth.js             # JWT authentication
├── public/                  # Static files
│   └── assets/uploads/      # Upload files
└── database/               # Database files
    └── paguyuban.sql       # Database schema
```

## 🗄️ Database Schema

### Tabel Users
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  no_hp VARCHAR(20),
  blok VARCHAR(10),
  jenis ENUM('warga', 'admin', 'koordinator_perblok', 'ketua') DEFAULT 'warga',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabel Posts
```sql
CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  konten TEXT NOT NULL,
  foto VARCHAR(255),
  tanggal_post TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Tabel Aduan
```sql
CREATE TABLE aduan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT NOT NULL,
  kategori VARCHAR(100),
  foto VARCHAR(255),
  status ENUM('pending', 'proses', 'selesai') DEFAULT 'pending',
  jawaban TEXT,
  foto_jawaban VARCHAR(255),
  admin_id INT,
  tanggal_dibuat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Tabel Payments
```sql
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  tahun INT NOT NULL,
  bulan INT NOT NULL,
  jumlah DECIMAL(10,2) DEFAULT 100000,
  bukti_transfer VARCHAR(255) NOT NULL,
  status ENUM('menunggu_konfirmasi', 'dikonfirmasi', 'ditolak') DEFAULT 'menunggu_konfirmasi',
  catatan TEXT,
  admin_id INT,
  tanggal_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  tanggal_konfirmasi TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Tabel Pengeluaran
```sql
CREATE TABLE pengeluaran (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NOT NULL,
  tahun INT NOT NULL,
  bulan INT NOT NULL,
  jumlah DECIMAL(15,2) NOT NULL,
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT NOT NULL,
  foto VARCHAR(255) NOT NULL,
  tanggal_dibuat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES users(id)
);
```

## 🔐 Sistem Authentication

### JWT Token
- **Secret**: Konfigurasi di environment
- **Expiry**: 24 jam
- **Storage**: localStorage di frontend

### Role-based Access Control
- **Warga**: Akses terbatas (buat postingan, aduan, pembayaran)
- **Koordinator**: Kelola warga per blok
- **Admin**: Kelola sistem + pengeluaran
- **Ketua**: Akses penuh semua fitur

## 🔄 Real-time Features

### Socket.IO Events
- **new-post**: Postingan baru dari warga
- **new-payment**: Pembayaran baru dari warga
- **new-aduan**: Aduan baru dari warga
- **payment-confirmed**: Konfirmasi pembayaran dari ketua

### Notifications
- **Sound**: MP3 notification sound
- **Visual**: SweetAlert2 toast notifications
- **Target**: Role-based notifications

## 📱 Responsive Design

### Desktop Layout
- **Sidebar**: Menu navigasi kiri
- **Content**: Area konten utama
- **Theme Toggle**: Dark/Light mode

### Mobile Layout
- **Header**: Info user di atas
- **Content**: Area konten scrollable
- **Bottom Nav**: 7 menu di bawah dengan scroll

## 🎨 Theme System

### Dark Mode
- **Context**: ThemeContext untuk state management
- **Storage**: localStorage untuk persistence
- **Classes**: Tailwind dark: classes
- **Toggle**: Available di desktop sidebar dan mobile profile

## 📊 Export Features

### CSV Export
- **Pembayaran**: Export data pembayaran per tahun
- **Pengeluaran**: Export data pengeluaran per tahun
- **Buku Kas**: Export gabungan pemasukan-pengeluaran
- **Format**: CSV dengan URL foto

## 🔍 Filter System

### Buku Kas Filter
- **Date Range**: Dari tanggal - sampai tanggal
- **Real-time**: Auto apply saat ubah filter
- **Reset**: Button untuk reset ke semua data

## 🛡️ Security Features

### Input Validation
- **File Upload**: Validasi tipe dan ukuran file
- **Form Validation**: Required fields dan format
- **SQL Injection**: Prepared statements
- **XSS Protection**: Input sanitization

### File Upload Security
- **Allowed Types**: jpg, jpeg, png, gif
- **Size Limit**: 5MB maksimal
- **Unique Names**: Timestamp + random untuk nama file
- **Storage**: public/assets/uploads/

## 🚀 Performance Optimization

### Frontend
- **Code Splitting**: Lazy loading components
- **Image Optimization**: Compressed uploads
- **Caching**: localStorage untuk theme dan auth

### Backend
- **Connection Pooling**: MySQL connection management
- **File Serving**: Static file serving dengan Express
- **Error Handling**: Comprehensive error handling

## 🔧 Configuration

### Environment Variables
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=paguyuban
JWT_SECRET=your-secret-key
PORT=3001
```

### Build Configuration
- **Vite**: Modern build tool
- **TypeScript**: Type safety
- **Tailwind**: Utility-first CSS
- **ESLint**: Code linting

## 📈 Monitoring & Logging

### Console Logging
- **Socket Events**: Real-time event logging
- **API Requests**: Request/response logging
- **Errors**: Comprehensive error logging

### Debug Features
- **Socket Debug**: Connection status logging
- **API Debug**: Request/response debugging
- **State Debug**: React state debugging

## 🔄 Data Flow

### Authentication Flow
1. User login → JWT token generated
2. Token stored in localStorage
3. Token sent with every API request
4. Server validates token and role

### Real-time Flow
1. User action (post, payment, etc.)
2. API call to backend
3. Socket.IO emit to relevant users
4. Frontend receives notification
5. UI updates automatically

### File Upload Flow
1. User selects file
2. Frontend validates file
3. FormData sent to backend
4. Multer processes upload
5. File saved with unique name
6. Database stores filename

## 🧪 Testing

### Manual Testing
- **Cross-browser**: Chrome, Firefox, Safari
- **Responsive**: Desktop, tablet, mobile
- **Features**: All CRUD operations
- **Real-time**: Socket notifications

### Test Accounts
```json
{
  "ketua": { "email": "ketua@paguyuban.com", "password": "123456" },
  "admin": { "email": "admin@paguyuban.com", "password": "123456" },
  "koordinator": { "email": "koordinator@paguyuban.com", "password": "123456" },
  "warga": { "email": "warga@paguyuban.com", "password": "123456" }
}
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Server Requirements
- **Node.js**: v16 atau lebih baru
- **MySQL**: v8 atau lebih baru
- **Storage**: Minimal 1GB untuk uploads
- **Memory**: Minimal 512MB RAM

## 🔮 Future Enhancements

### Planned Features
- **Push Notifications**: Browser push notifications
- **Email Notifications**: Email alerts untuk events penting
- **Advanced Reporting**: Grafik dan chart untuk laporan
- **Mobile App**: React Native mobile application
- **Backup System**: Automated database backup
- **Multi-tenant**: Support multiple paguyuban

### Technical Improvements
- **Redis Caching**: Caching untuk performance
- **CDN Integration**: File serving optimization
- **Load Balancing**: Multiple server instances
- **Database Optimization**: Query optimization dan indexing