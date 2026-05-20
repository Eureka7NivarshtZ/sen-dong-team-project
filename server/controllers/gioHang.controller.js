const { GioHang, GioHangChiTiet, Tranh, HinhAnhTranh } = require("../models");

const xemGioHangCuaToi = async (req, res) => {
  // TODO
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
  // TODO
};

const xoaKhoiGioHang = async (req, res) => {
  // TODO
};

const xoaTatCaGioHang = async (req, res) => {
  // TODO
};

module.exports = {
  xemGioHangCuaToi,
  themVaoGioHang,
  capNhatSoLuong,
  xoaKhoiGioHang,
  xoaTatCaGioHang,
};
