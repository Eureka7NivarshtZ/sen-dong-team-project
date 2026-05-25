const { VatLieu, NhaCungCap } = require("../models");

const { literal } = require("sequelize");

const layVatLieuCanhBao = async (req, res) => {
  const danhSach = await VatLieu.findAll({
    where: literal("so_luong_ton <= muc_canh_bao"),
    include: [{ model: NhaCungCap, as: "nha_cung_cap" }],
    order: [["so_luong_ton", "ASC"]],
  });

  res.json({
    success: true,
    message: "Lấy vật liệu cảnh báo thành công",
    data: danhSach,
  });
};

const layChiTietVatLieu = async (req, res) => {
  const { id } = req.params;

  const vatLieu = await VatLieu.findByPk(id, {
    include: [{ model: NhaCungCap, as: "nha_cung_cap" }],
  });

  if (!vatLieu) {
    return res.status(404).json({
      success: false,
      error: "Không tìm thấy vật liệu",
    });
  }

  res.json({
    success: true,
    message: "Lấy chi tiết vật liệu thành công",
    data: vatLieu,
  });
};

const themVatLieu = async (req, res) => {
  const {
    nha_cung_cap_id,
    ten,
    loai,
    don_vi,
    gia_nhap,
    so_luong_ton,
    muc_canh_bao,
  } = req.body;

  if (!nha_cung_cap_id || !ten) {
    return res.status(400).json({
      success: false,
      error: "Vui lòng nhập nhà cung cấp và tên vật liệu",
    });
  }

  const nhaCungCap = await NhaCungCap.findByPk(nha_cung_cap_id);

  if (!nhaCungCap) {
    return res.status(404).json({
      success: false,
      error: "Nhà cung cấp không tồn tại",
    });
  }

  const vatLieu = await VatLieu.create({
    nha_cung_cap_id,
    ten,
    loai,
    don_vi: don_vi || "cái",
    gia_nhap: gia_nhap || 0,
    so_luong_ton: so_luong_ton || 0,
    muc_canh_bao: muc_canh_bao || 10,
  });

  res.status(201).json({
    success: true,
    message: "Thêm vật liệu thành công",
    data: vatLieu,
  });
};

const capNhatVatLieu = async (req, res) => {
  const { id } = req.params;

  const vatLieu = await VatLieu.findByPk(id);

  if (!vatLieu) {
    return res.status(404).json({
      success: false,
      error: "Không tìm thấy vật liệu",
    });
  }

  await vatLieu.update(req.body);

  res.json({
    success: true,
    message: "Cập nhật vật liệu thành công",
    data: vatLieu,
  });
};

const xoaVatLieu = async (req, res) => {
  const { id } = req.params;

  const vatLieu = await VatLieu.findByPk(id);

  if (!vatLieu) {
    return res.status(404).json({
      success: false,
      error: "Không tìm thấy vật liệu",
    });
  }

  await vatLieu.destroy();

  res.json({
    success: true,
    message: "Xóa vật liệu thành công",
    data: null,
  });
};

module.exports = {
  layVatLieuCanhBao,
  layChiTietVatLieu,
  themVatLieu,
  capNhatVatLieu,
  xoaVatLieu,
};
