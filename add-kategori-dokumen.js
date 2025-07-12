import mysql from 'mysql2/promise';

async function addKategoriDokumen() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'paguyuban'
    });
    
    await connection.execute(`
      ALTER TABLE dokumen 
      ADD COLUMN kategori VARCHAR(100) DEFAULT 'Umum' AFTER deskripsi
    `);
    
    console.log('✅ Kolom kategori berhasil ditambahkan');
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

addKategoriDokumen();