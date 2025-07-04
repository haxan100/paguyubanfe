import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'paguyuban'
};

async function updatePasswords() {
  const connection = await mysql.createConnection(dbConfig);
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  await connection.execute(
    'UPDATE users SET password = ? WHERE email IN (?, ?, ?, ?)',
    [hashedPassword, 'admin@paguyuban.com', 'ketua@paguyuban.com', 'koordinator@paguyuban.com', 'warga@paguyuban.com']
  );
  
  console.log('Passwords updated successfully');
  await connection.end();
}

updatePasswords().catch(console.error);