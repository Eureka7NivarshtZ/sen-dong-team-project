const { LichSuTrangThaiDonHang, DonHang, NhanVien } = require("../models");

const ghiLichSuTrangThaiDonHang = async ({
  don_hang_id,
  trang_thai_cu = null,
  trang_thai_moi,
  ghi_chu = null,
  nhan_vien_id = null,
}) => {
  return LichSuTrangThaiDonHang.create({
    don_hang_id,
    trang_thai_cu,
    trang_thai_moi,
    ghi_chu,
    nhan_vien_id,
  });
};

const xemLichSuTrangThaiDonHang = async (req, res) => {
  const { donHangId } = req.params;

  const donHang = await DonHang.findByPk(donHangId);
  if (!donHang) {
    return res
      .status(404)
      .json({ success: false, error: "Khong tim thay don hang" });
  }

  if (
    req.user.khach_hang_id &&
    donHang.khach_hang_id !== req.user.khach_hang_id
  ) {
    return res
      .status(403)
      .json({ success: false, error: "Ban khong co quyen xem don hang nay" });
  }

  const lichSu = await LichSuTrangThaiDonHang.findAll({
    where: { don_hang_id: donHangId },
    include: [
      { model: NhanVien, as: "nhan_vien", attributes: ["id", "ho_ten"] },
    ],
    order: [["tao_luc", "ASC"]],
  });

  res.json({
    success: true,
    message: "Lay lich su trang thai don hang thanh cong",
    data: lichSu,
  });
};

module.exports = {
  ghiLichSuTrangThaiDonHang,
  xemLichSuTrangThaiDonHang,
};
