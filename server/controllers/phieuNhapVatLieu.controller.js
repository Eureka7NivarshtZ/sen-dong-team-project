const {
  sequelize,
  PhieuNhapVatLieu,
  ChiTietPhieuNhap,
  VatLieu,
  NhaCungCap,
  NhanVien,
} = require("../models");

const layTatCaPhieuNhap = async (req, res) => {
  const danhSach = await PhieuNhapVatLieu.findAll({
    include: [
      { model: NhaCungCap, as: "nha_cung_cap" },
      { model: NhanVien, as: "nhan_vien" },
      {
        model: ChiTietPhieuNhap,
        as: "chi_tiet",
        include: [{ model: VatLieu, as: "vat_lieu" }],
      },
    ],
    order: [["ngay_nhap", "DESC"]],
  });

  res.json({
    success: true,
    message: "Lấy danh sách phiếu nhập thành công",
    data: danhSach,
  });
};

const layChiTietPhieuNhap = async (req, res) => {
  const { id } = req.params;

  const phieu = await PhieuNhapVatLieu.findByPk(id, {
    include: [
      { model: NhaCungCap, as: "nha_cung_cap" },
      { model: NhanVien, as: "nhan_vien" },
      {
        model: ChiTietPhieuNhap,
        as: "chi_tiet",
        include: [{ model: VatLieu, as: "vat_lieu" }],
      },
    ],
  });

  if (!phieu) {
    return res.status(404).json({
      success: false,
      error: "Không tìm thấy phiếu nhập",
    });
  }

  res.json({
    success: true,
    message: "Lấy chi tiết phiếu nhập thành công",
    data: phieu,
  });
};

const taoPhieuNhap = async (req, res) => {
  const { nha_cung_cap_id, chi_tiet = [] } = req.body;

  if (!nha_cung_cap_id) {
    return res.status(400).json({
      success: false,
      error: "Vui lòng chọn nhà cung cấp",
    });
  }

  if (!Array.isArray(chi_tiet) || chi_tiet.length === 0) {
    return res.status(400).json({
      success: false,
      error: "Phiếu nhập phải có ít nhất một vật liệu",
    });
  }

  const ketQua = await sequelize.transaction(async (t) => {
    const nhaCungCap = await NhaCungCap.findByPk(nha_cung_cap_id, {
      transaction: t,
    });

    if (!nhaCungCap) {
      throw new Error("Nhà cung cấp không tồn tại");
    }

    let tongTien = 0;

    for (const item of chi_tiet) {
      if (!item.vat_lieu_id || !item.so_luong || !item.don_gia) {
        throw new Error("Chi tiết phiếu nhập không hợp lệ");
      }

      const vatLieu = await VatLieu.findByPk(item.vat_lieu_id, {
        transaction: t,
      });

      if (!vatLieu) {
        throw new Error("Có vật liệu không tồn tại");
      }

      tongTien += Number(item.so_luong) * Number(item.don_gia);
    }

    const phieu = await PhieuNhapVatLieu.create(
      {
        nha_cung_cap_id,
        nhan_vien_id: req.user.nhan_vien_id,
        tong_tien: tongTien,
        trang_thai: "cho_duyet",
      },
      { transaction: t },
    );

    const duLieuChiTiet = chi_tiet.map((item) => ({
      phieu_id: phieu.id,
      vat_lieu_id: item.vat_lieu_id,
      so_luong: item.so_luong,
      don_gia: item.don_gia,
    }));

    await ChiTietPhieuNhap.bulkCreate(duLieuChiTiet, {
      transaction: t,
    });

    return phieu;
  });

  res.status(201).json({
    success: true,
    message: "Tạo phiếu nhập thành công",
    data: ketQua,
  });
};

const nhapKhoPhieuNhap = async (req, res) => {
  const { id } = req.params;

  const ketQua = await sequelize.transaction(async (t) => {
    const phieu = await PhieuNhapVatLieu.findByPk(id, {
      include: [{ model: ChiTietPhieuNhap, as: "chi_tiet" }],
      transaction: t,
    });

    if (!phieu) {
      throw new Error("Không tìm thấy phiếu nhập");
    }

    if (phieu.trang_thai === "da_nhap") {
      throw new Error("Phiếu này đã nhập kho rồi");
    }

    if (phieu.trang_thai === "huy") {
      throw new Error("Không thể nhập kho phiếu đã hủy");
    }

    for (const item of phieu.chi_tiet) {
      const vatLieu = await VatLieu.findByPk(item.vat_lieu_id, {
        transaction: t,
      });

      await vatLieu.update(
        {
          so_luong_ton: Number(vatLieu.so_luong_ton) + Number(item.so_luong),
        },
        { transaction: t },
      );
    }

    await phieu.update(
      {
        trang_thai: "da_nhap",
      },
      { transaction: t },
    );

    return phieu;
  });

  res.json({
    success: true,
    message: "Nhập kho phiếu nhập thành công",
    data: ketQua,
  });
};

const huyPhieuNhap = async (req, res) => {
  const { id } = req.params;

  const phieu = await PhieuNhapVatLieu.findByPk(id);

  if (!phieu) {
    return res.status(404).json({
      success: false,
      error: "Không tìm thấy phiếu nhập",
    });
  }

  if (phieu.trang_thai === "da_nhap") {
    return res.status(400).json({
      success: false,
      error: "Không thể hủy phiếu đã nhập kho",
    });
  }

  await phieu.update({
    trang_thai: "huy",
  });

  res.json({
    success: true,
    message: "Hủy phiếu nhập thành công",
    data: phieu,
  });
};

module.exports = {
  layTatCaPhieuNhap,
  layChiTietPhieuNhap,
  taoPhieuNhap,
  nhapKhoPhieuNhap,
  huyPhieuNhap,
};
