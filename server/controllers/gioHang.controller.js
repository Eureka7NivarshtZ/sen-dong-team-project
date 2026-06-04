const { GioHang, GioHangChiTiet, Tranh, HinhAnhTranh } = require("../models"); // 🌟 ĐÃ THÊM: Import HinhAnhTranh vào đây

const xemGioHangCuaToi = async (req, res) => {
  const khachHangId = req.user.khach_hang_id;

  let gioHang = await GioHang.findOne({
    where: {
      khach_hang_id: khachHangId,
    },
  });

  if (!gioHang) {
    return res.json({
      success: true,
      message: "Lay gio hang thanh cong",
      data: {
        danh_sach: [],
        tong_so_luong: 0,
        tong_tien: 0,
      },
    });
  }

  // 🌟 ĐÃ SỬA: Thêm include lồng HinhAnhTranh để SQL bốc kèm toàn bộ mảng ảnh thật về cho giỏ hàng
  const chiTiet = await GioHangChiTiet.findAll({
    where: {
      gio_hang_id: gioHang.id,
    },
    include: [
      { 
        model: Tranh, 
        as: "tranh",
        include: [
          {
            model: HinhAnhTranh,
            as: "hinh_anh" // Khớp đúng alias định nghĩa quan hệ trong hệ thống của ông
          }
        ]
      }
    ],
  });

  const danhSach = chiTiet.map((item) => {
    const itemJson = item.toJSON();

    return {
      ...itemJson,
      thanh_tien: Number(itemJson.so_luong) * Number(itemJson.don_gia),
    };
  });

  const tongSoLuong = danhSach.reduce((tong, item) => {
    return tong + Number(item.so_luong);
  }, 0);

  const tongTien = danhSach.reduce((tong, item) => {
    return tong + Number(item.thanh_tien);
  }, 0);

  res.json({
    success: true,
    message: "Lay gio hang thanh cong",
    data: {
      danh_sach: danhSach,
      tong_so_luong: tongSoLuong,
      tong_tien: tongTien,
    },
  });
};

const themVaoGioHang = async (req, res) => {
  const { tranh_id, so_luong = 1 } = req.body;

  if (!tranh_id) {
    return res.status(400).json({
      success: false,
      error: "tranh_id la bat buoc",
    });
  }

  const soLuongThem = Number(so_luong);

  if (!Number.isInteger(soLuongThem) || soLuongThem <= 0) {
    return res.status(400).json({
      success: false,
      error: "So luong phai lon hon 0",
    });
  }

  const tranh = await Tranh.findByPk(tranh_id);

  if (!tranh) {
    return res.status(404).json({
      success: false,
      error: "Khong tim thay tranh",
    });
  }

  if (tranh.trang_thai !== "ban") {
    return res.status(400).json({
      success: false,
      error: "Tranh hien khong duoc ban",
    });
  }

  let gioHang = await GioHang.findOne({
    where: {
      khach_hang_id: req.user.khach_hang_id,
    },
  });

  if (!gioHang) {
    gioHang = await GioHang.create({
      khach_hang_id: req.user.khach_hang_id,
    });
  }

  const chiTietDaCo = await GioHangChiTiet.findOne({
    where: {
      gio_hang_id: gioHang.id,
      tranh_id,
    },
  });

  const soLuongHienTai = chiTietDaCo ? Number(chiTietDaCo.so_luong) : 0;
  const soLuongMoi = soLuongHienTai + soLuongThem;

  if (Number(tranh.so_luong_ton) < soLuongMoi) {
    return res.status(400).json({
      success: false,
      error: "So luong ton khong du",
    });
  }

  if (chiTietDaCo) {
    await chiTietDaCo.update({
      so_luong: soLuongMoi,
      don_gia: tranh.gia_ban,
    });

    return res.json({
      success: true,
      message: "Cap nhat gio hang thanh cong",
      data: chiTietDaCo,
    });
  }

  const chiTiet = await GioHangChiTiet.create({
    gio_hang_id: gioHang.id,
    tranh_id,
    so_luong: soLuongThem,
    don_gia: tranh.gia_ban,
  });

  return res.json({
    success: true,
    message: "Them vao gio hang thanh cong",
    data: chiTiet,
  });
};

const capNhatSoLuong = async (req, res) => {
  try {
    const { id } = req.params;
    const { so_luong } = req.body;

    const soLuongMoi = Number(so_luong);

    if (!Number.isInteger(soLuongMoi) || soLuongMoi <= 0) {
      return res.status(400).json({
        success: false,
        error: "So luong phai lon hon 0",
      });
    }

    const gioHang = await GioHang.findOne({
      where: {
        khach_hang_id: req.user.khach_hang_id,
      },
    });

    if (!gioHang) {
      return res.status(404).json({
        success: false,
        error: "Khong tim thay gio hang",
      });
    }

    const chiTiet = await GioHangChiTiet.findOne({
      where: {
        gio_hang_id: gioHang.id,
        id,
      },
      include: [{ model: Tranh, as: "tranh" }],
    });

    if (!chiTiet) {
      return res.status(404).json({
        success: false,
        error: "Khong tim thay san pham trong gio hang",
      });
    }

    const tranhMapping = chiTiet.tranh || chiTiet.Tranh;
    const soLuongTonKho = tranhMapping ? Number(tranhMapping.so_luong_ton) : 999;

    if (soLuongTonKho < soLuongMoi) {
      return res.status(400).json({
        success: false,
        error: "So luong ton khong du",
      });
    }

    const giaBanCapNhat = tranhMapping ? tranhMapping.gia_ban : chiTiet.don_gia;

    await chiTiet.update({
      so_luong: soLuongMoi,
      don_gia: giaBanCapNhat,
    });

    return res.json({
      success: true,
      message: "Cap nhat so luong thanh cong",
      data: chiTiet,
    });
  } catch (error) {
    console.error("Lỗi hệ thống tại capNhatSoLuong Backend:", error);
    return res.status(500).json({
      success: false,
      error: "Loi he thong internal server error",
    });
  }
};

const xoaKhoiGioHang = async (req, res) => {
  const { id } = req.params;
  const khachHangId = req.user.khach_hang_id;

  const gioHang = await GioHang.findOne({
    where: {
      khach_hang_id: khachHangId,
    },
  });

  if (!gioHang) {
    return res.status(404).json({
      success: false,
      error: "Khong tim thay gio hang",
    });
  }

  const chiTiet = await GioHangChiTiet.findOne({
    where: {
      id,
      gio_hang_id: gioHang.id,
    },
  });

  if (!chiTiet) {
    return res.status(404).json({
      success: false,
      error: "Khong tim thay san pham trong gio hang",
    });
  }

  await chiTiet.destroy();

  res.json({
    success: true,
    message: "Xoa san pham khoi gio hang thanh cong",
    data: null,
  });
};

const xoaTatCaGioHang = async (req, res) => {
  const khachHangId = req.user.khach_hang_id;

  const gioHang = await GioHang.findOne({
    where: {
      khach_hang_id: khachHangId,
    },
  });

  if (!gioHang) {
    return res.status(404).json({
      success: false,
      error: "Gio hang dang trong",
    });
  }

  await GioHangChiTiet.destroy({
    where: {
      gio_hang_id: gioHang.id,
    },
  });

  res.json({
    success: true,
    message: "Xoa tat ca san pham khoi gio hang thanh cong",
    data: null,
  });
};

module.exports = {
  xemGioHangCuaToi,
  themVaoGioHang,
  capNhatSoLuong,
  xoaKhoiGioHang,
  xoaTatCaGioHang,
};