# Database Paguyuban

## Setup Database

1. Buka MySQL/phpMyAdmin
2. Import file `paguyuban.sql`
3. Database `paguyuban` akan terbuat otomatis

## Struktur Database

### Tabel `users`
- `id` - Primary key
- `nama` - Nama lengkap user
- `email` - Email (unique)
- `no_hp` - Nomor HP
- `blok` - Blok tempat tinggal
- `jenis` - Role: warga, ketua, admin, koordinator_perblok
- `password` - Password (hashed)
- `created_at` - Timestamp

### Tabel `aduan`
- `id` - Primary key
- `user_id` - Foreign key ke users
- `judul` - Judul aduan
- `jenis_aduan` - infrastruktur, keamanan, kebersihan, lainnya
- `deskripsi` - Deskripsi aduan
- `foto` - JSON array foto (base64)
- `status` - pending, proses, selesai
- `jawaban` - Jawaban dari admin/ketua
- `created_at` - Timestamp
- `updated_at` - Timestamp

## Default Users

| Email | Password | Role |
|-------|----------|------|
| admin@paguyuban.com | 123456 | Admin |
| ketua@paguyuban.com | 123456 | Ketua |
| koordinator@paguyuban.com | 123456 | Koordinator |
| warga@paguyuban.com | 123456 | Warga |

**Note**: Password default akan memaksa user untuk update password setelah login pertama.