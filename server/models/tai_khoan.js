const db = require('../utils/db');

// Lấy danh sách tài khoản
const findAll = async () => {
  const [rows] = await db.query('SELECT * FROM tai_khoan');
  return rows;
};

// Tạo tài khoản mới
const create = async ({ id, email, mat_khau_hash, loai }) => {
  // Bảng tai_khoan bắt buộc phải có email, mat_khau_hash và loai
  await db.query(
    'INSERT INTO tai_khoan (id, email, mat_khau_hash, loai) VALUES (?, ?, ?, ?)',
    [id, email, mat_khau_hash, loai]
  );
  
  // Trả về thẳng object đã nhận vì insertId không dùng được cho UUID
  return { id, email, loai }; 
};

module.exports = { findAll, create };