const db = require("../utils/db");

// Lấy danh sách hóa đơn
const findAll = async () => {
  const [rows] = await db.query("SELECT * FROM hoa_don");
  return rows;
};

// Tạo hóa đơn mới
const create = async ({
  id,
  don_hang_id,
  so_hoa_don,
  tong_tien_truoc_thue,
  thue_suat,
  tien_thue,
  tong_tien_sau_thue,
  loai,
  hoa_don_goc_id,
  trang_thai,
}) => {
  await db.query(
    "INSERT INTO hoa_don(id, don_hang_id, so_hoa_don, ngay_xuat, tong_tien_truoc_thue, thue_suat, tien_thue, tong_tien_sau_thue, loai, hoa_don_goc_id, trang_thai) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
  );

  return {
    id,
    don_hang_id,
    so_hoa_don,
    tong_tien_truoc_thue,
    thue_suat,
    tien_thue,
    tong_tien_sau_thue,
    loai,
    hoa_don_goc_id,
    trang_thai,
  };
};

module.exports = { findAll, create };
