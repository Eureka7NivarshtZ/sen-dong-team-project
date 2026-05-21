const { GioHang, GioHangChiTiet, Tranh } = require("../models");

const xemGioHangCuaToi = async (req, res) => {
  const khachHangId = req.user.khach_hang_id;

  let gioHang = await GioHang.findOne({
    where: {
      khach_hang_id: khachHangId,
    },
  });

  if (!gioHang) {
    return res.json({
      danh_sach: [],
      tong_so_luong: 0,
      tong_tien: 0,
    });
  }

  const chiTiet = await GioHangChiTiet.findAll({
    where: {
      gio_hang_id: gioHang.id,
    },
    include: [{ model: Tranh, as: "tranh" }],
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
    danh_sach: chiTiet,
    tong_so_luong: 0,
    tong_tien: 0,
  });
};

const themVaoGioHang = async (req, res) => {
  const { tranh_id, so_luong = 1 } = req.body;

  if (!tranh_id) {
    return res.status(400).json({
      error: "tranh_id la bat buoc",
    });
  }

  const soLuongThem = Number(so_luong);

  if (!Number.isInteger(soLuongThem) || soLuongThem <= 0) {
    return res.status(400).json({
      error: "So luong phai lon hon 0",
    });
  }

  const tranh = await Tranh.findByPk(tranh_id);

  if (!tranh) {
    return res.status(404).json({
      error: "Khong tim thay tranh",
    });
  }

  if (tranh.trang_thai !== "ban") {
    return res.status(400).json({
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
      error: "So luong ton khong du",
    });
  }

  if (chiTietDaCo) {
    await chiTietDaCo.update({
      so_luong: soLuongMoi,
      don_gia: tranh.gia_ban,
    });

    return res.json(chiTietDaCo);
  }

  const chiTiet = await GioHangChiTiet.create({
    gio_hang_id: gioHang.id,
    tranh_id,
    so_luong: soLuongThem,
    don_gia: tranh.gia_ban,
  });

  return res.json(chiTiet);
};

const capNhatSoLuong = async (req, res) => {
  const { id } = req.params;
  const { so_luong } = req.body;

  const soLuongMoi = Number(so_luong);

  if (!Number.isInteger(soLuongMoi) || soLuongMoi <= 0) {
    return res.status(400).json({
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
      error: "Khong tim thay san pham trong gio hang",
    });
  }

  if (Number(chiTiet.tranh.so_luong_ton) < soLuongMoi) {
    return res.status(400).json({
      error: "So luong ton khong du",
    });
  }

  await chiTiet.update({
    so_luong: soLuongMoi,
    don_gia: chiTiet.tranh.gia_ban,
  });

  res.json(chiTiet);
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
      error: "Khong tim thay san oham trong gio hang",
    });
  }

  await chiTiet.destroy();

  res.status(204).end();
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
      error: "Gio hang dang trong",
    });
  }

  await gioHang.destroy({
    where: {
      gio_hang_id: gioHang.id,
    },
  });

  res.status(204).end();
};

module.exports = {
  xemGioHangCuaToi,
  themVaoGioHang,
  capNhatSoLuong,
  xoaKhoiGioHang,
  xoaTatCaGioHang,
};
