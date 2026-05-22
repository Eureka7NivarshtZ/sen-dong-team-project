const { ThietBi, NhaCungCap } = require("../models");

const layTatCaThietBi = async (req, res) => {
  const danhSach = await ThietBi.findAll({
    include: [{ model: NhaCungCap, as: "nha_cung_cap" }],
    order: [["ten", "ASC"]],
  });

  res.json({
    success: true,
    message: "Lấy danh sách thiết bị thành công",
    data: danhSach,
  });
};

const layChiTietThietBi = async (req, res) => {
  const { id } = req.params;

  const thietBi = await ThietBi.findByPk(id, {
    include: [{ model: NhaCungCap, as: "nha_cung_cap" }],
  });

  if (!thietBi) {
    return res.status(404).json({
      success: false,
      error: "Không tìm thấy thiết bị",
    });
  }

  res.json({
    success: true,
    message: "Lấy chi tiết thiết bị thành công",
    data: thietBi,
  });
};

const themThietBi = async (req, res) => {
  const {
    nha_cung_cap_id,
    ten,
    loai,
    thong_so,
    han_bao_hanh,
    gia,
    trang_thai,
  } = req.body;

  if (!nha_cung_cap_id || !ten) {
    return res.status(400).json({
      success: false,
      error: "Vui lòng nhập nhà cung cấp và tên thiết bị",
    });
  }

  const nhaCungCap = await NhaCungCap.findByPk(nha_cung_cap_id);

  if (!nhaCungCap) {
    return res.status(404).json({
      success: false,
      error: "Nhà cung cấp không tồn tại",
    });
  }

  const thietBi = await ThietBi.create({
    nha_cung_cap_id,
    ten,
    loai,
    thong_so,
    han_bao_hanh,
    gia: gia || 0,
    trang_thai: trang_thai || "hoat_dong",
  });

  res.status(201).json({
    success: true,
    message: "Thêm thiết bị thành công",
    data: thietBi,
  });
};

const capNhatThietBi = async (req, res) => {
  const { id } = req.params;

  const thietBi = await ThietBi.findByPk(id);

  if (!thietBi) {
    return res.status(404).json({
      success: false,
      error: "Không tìm thấy thiết bị",
    });
  }

  await thietBi.update(req.body);

  res.json({
    success: true,
    message: "Cập nhật thiết bị thành công",
    data: thietBi,
  });
};

const xoaThietBi = async (req, res) => {
  const { id } = req.params;

  const thietBi = await ThietBi.findByPk(id);

  if (!thietBi) {
    return res.status(404).json({
      success: false,
      error: "Không tìm thấy thiết bị",
    });
  }

  await thietBi.destroy();

  res.json({
    success: true,
    message: "Xóa thiết bị thành công",
    data: null,
  });
};

module.exports = {
  layTatCaThietBi,
  layChiTietThietBi,
  themThietBi,
  capNhatThietBi,
  xoaThietBi,
};
