const { NhaCungCap } = require("../models");

const layTatCaNhaCungCap = async (req, res) => {
  const danhSach = await NhaCungCap.findAll({
    order: [["ten", "ASC"]],
  });

  res.json({
    success: true,
    message: "Lấy danh sách nhà cung cấp thành công",
    data: danhSach,
  });
};

const layChiTietNhaCungCap = async (req, res) => {
  const { id } = req.params;

  const nhaCungCap = await NhaCungCap.findByPk(id);

  if (!nhaCungCap) {
    return res.status(404).json({
      success: false,
      error: "Không tìm thấy nhà cung cấp",
    });
  }

  res.json({
    success: true,
    message: "Lấy chi tiết nhà cung cấp thành công",
    data: nhaCungCap,
  });
};

const themNhaCungCap = async (req, res) => {
  const { ten, sdt, dia_chi, email, loai } = req.body;

  if (!ten) {
    return res.status(400).json({
      success: false,
      error: "Tên nhà cung cấp là bắt buộc",
    });
  }

  const loaiHopLe = ["vat_lieu", "thiet_bi", "ca_hai"];

  if (loai && !loaiHopLe.includes(loai)) {
    return res.status(400).json({
      success: false,
      error: "Loại nhà cung cấp không hợp lệ",
    });
  }

  const nhaCungCap = await NhaCungCap.create({
    ten,
    sdt,
    dia_chi,
    email,
    loai: loai || "ca_hai",
  });

  res.status(201).json({
    success: true,
    message: "Thêm nhà cung cấp thành công",
    data: nhaCungCap,
  });
};

const capNhatNhaCungCap = async (req, res) => {
  const { id } = req.params;

  const nhaCungCap = await NhaCungCap.findByPk(id);

  if (!nhaCungCap) {
    return res.status(404).json({
      success: false,
      error: "Không tìm thấy nhà cung cấp",
    });
  }

  await nhaCungCap.update(req.body);

  res.json({
    success: true,
    message: "Cập nhật nhà cung cấp thành công",
    data: nhaCungCap,
  });
};

const xoaNhaCungCap = async (req, res) => {
  const { id } = req.params;

  const nhaCungCap = await NhaCungCap.findByPk(id);

  if (!nhaCungCap) {
    return res.status(404).json({
      success: false,
      error: "Không tìm thấy nhà cung cấp",
    });
  }

  await nhaCungCap.destroy();

  res.json({
    success: true,
    message: "Xóa nhà cung cấp thành công",
    data: null,
  });
};

module.exports = {
  layTatCaNhaCungCap,
  layChiTietNhaCungCap,
  themNhaCungCap,
  capNhatNhaCungCap,
  xoaNhaCungCap,
};
