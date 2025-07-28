export const menuConfig = {
  sidebar: {
    enabled: true, // true = sidebar muncul, false = sidebar disembunyikan
    width: '64' // width dalam class Tailwind (w-64)
  },
  about: {
    enabled: true, // true = menu muncul, false = menu disembunyikan
    title: 'Tentang',
    description: 'Informasi tentang sistem paguyuban'
  },
  profile: {
    enabled: true, // true = menu muncul, false = menu disembunyikan
    title: 'Profile Saya',
    description: 'Update data diri dan password warga'
  },
  pengeluaran: {
    enabled: true, // true = menu muncul, false = menu disembunyikan
    title: 'Pengeluaran',
    description: 'Data pengeluaran komunitas'
  },
  bukuKas: {
    enabled: false, // true = menu muncul, false = menu disembunyikan
    title: 'Buku Kas',
    description: 'Laporan keuangan komunitas'
  }
};