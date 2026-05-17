const db = require("../utils/db");

// Lấy danh sách tài khoản
const findAll = async () => {
  const [rows] = await db.query("SELECT * FROM tai_khoan");
  return rows;
};

// Tạo tài khoản mới
const create = async ({ id, email, mat_khau_hash, loai }) => {
  await db.query(
    "INSERT INTO tai_khoan (id, email, mat_khau_hash, loai) VALUES (?, ?, ?, ?)",
    [id, email, mat_khau_hash, loai],
  );

  return { id, email, loai };
};

module.exports = { findAll, create };
