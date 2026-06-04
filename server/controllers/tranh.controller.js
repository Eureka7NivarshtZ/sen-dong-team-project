const { Op } = require("sequelize");
const {
  Tranh,
  HinhAnhTranh,
  TacGia,
  DanhMuc,
  sequelize,
  DanhGia,
  DonHangChiTiet,
  KhuyenMaiTranh,
  GioHangChiTiet,
} = require("../models");

const xemTatCaTranh = async (req, res) => {
  const {
    keyword,
    danh_muc_id,
    tac_gia_id,
    gia_min,
    gia_max,
    trang_thai = "ban",
    page = 1,
    limit = 10,
    sort = "moi_nhat",
  } = req.query;

  const dieuKienTranh = {};

  if (trang_thai) {
    dieuKienTranh.trang_thai = trang_thai;
  }

  if (keyword) {
    dieuKienTranh[Op.or] = [
      {
        ten_tranh: {
          [Op.like]: `%${keyword}%`,
        },
      },
      {
        mo_ta: {
          [Op.like]: `%${keyword}%`,
        },
      },
    ];
  }

  if (danh_muc_id) {
    dieuKienTranh.danh_muc_id = danh_muc_id;
  }

  if (tac_gia_id) {
    dieuKienTranh.tac_gia_id = tac_gia_id;
  }

  if (gia_min || gia_max) {
    dieuKienTranh.gia_ban = {};

    if (gia_min) {
      dieuKienTranh.gia_ban[Op.gte] = Number(gia_min);
    }

    if (gia_max) {
      dieuKienTranh.gia_ban[Op.lte] = Number(gia_max);
    }
  }

  let order = [["tao_luc", "DESC"]];

  if (sort === "gia_tang") {
    order = [["gia_ban", "ASC"]];
  }

  if (sort === "gia_giam") {
    order = [["gia_ban", "DESC"]];
  }

  if (sort === "ten_az") {
    order = [["ten_tranh", "ASC"]];
  }

  const trang = Number(page);
  const soLuongTrang = Number(limit);
  const offset = (trang - 1) * soLuongTrang;

  const { count, rows } = await Tranh.findAndCountAll({
    where: dieuKienTranh,
    include: [
      {
        model: HinhAnhTranh,
        as: "hinh_anh",
        separate: true,
        order: [
          ["la_chinh", "DESC"],
          ["thu_tu", "ASC"],
        ],
      },
      {
        model: TacGia,
        as: "tac_gia",
      },
      {
        model: DanhMuc,
        as: "danh_muc",
      },
    ],
    order,
    limit: soLuongTrang,
    offset,
  });

  res.json({
    success: true,
    message: "Lay danh sach tranh thanh cong",
    data: rows,
    pagination: {
      total: count,
      page: trang,
      limit: soLuongTrang,
      totalPages: Math.ceil(count / soLuongTrang),
    },
  });
};

const xemChiTietTranh = async (req, res) => {
  const { id } = req.params;

  const tranh = await Tranh.findByPk(id, {
    include: [
      { model: HinhAnhTranh, as: "hinh_anh" },
      { model: TacGia, as: "tac_gia" },
      { model: DanhMuc, as: "danh_muc" },
    ],
  });

  if (!tranh) {
    return res.status(404).json({
      success: false,
      error: "Khong tim thay tranh",
    });
  }

  res.json({
    success: true,
    message: "Lay chi tiet tranh thanh cong",
    data: tranh,
  });
};

const taoTranh = async (req, res) => {
  const {
    ten_tranh,
    danh_muc_id,
    tac_gia_id,
    gia_ban,
    gia_von,
    so_luong_ton,
    mo_ta,
    hinh_anh_url, // 🌟 ĐÃ NHẬN: Đọc URL hình ảnh từ Admin gửi lên
  } = req.body;

  if (!ten_tranh || !danh_muc_id || !tac_gia_id) {
    return res.status(400).json({
      success: false,
      error: "ten_tranh, danh_muc_id, tac_gia_id là bắt buộc",
    });
  }

  if (so_luong_ton !== undefined && Number(so_luong_ton) < 0) {
    return res.status(400).json({
      success: false,
      error: "Số lượng tồn không được nhỏ hơn 0",
    });
  }

  const tranh = await Tranh.create({
    ten_tranh,
    danh_muc_id,
    tac_gia_id,
    gia_ban,
    gia_von,
    so_luong_ton,
    mo_ta,
  });

  // 🌟 ĐÃ THÊM: Nếu Admin có điền link hình, tự động tạo luôn bản ghi chạy sang bảng HinhAnhTranh
  if (hinh_anh_url) {
    await HinhAnhTranh.create({
      tranh_id: tranh.id,
      url: hinh_anh_url,
      la_chinh: true,
      thu_tu: 0,
    });
  }

  res.status(201).json({
    success: true,
    message: "Tao tranh thanh cong",
    data: tranh,
  });
};

const capNhatTranh = async (req, res) => {
  const { id } = req.params;
  const { hinh_anh_url } = req.body;

  const tranh = await Tranh.findByPk(id);

  if (!tranh) {
    return res.status(404).json({
      success: false,
      error: "Khong tim thay tranh",
    });
  }

  if (
    req.body.so_luong_ton !== undefined &&
    Number(req.body.so_luong_ton) < 0
  ) {
    return res.status(400).json({
      success: false,
      error: "Số lượng tồn không được nhỏ hơn 0",
    });
  }

  const tranhData = {
    ...req.body,
    cap_nhat_luc: new Date(),
  };

  await tranh.update(tranhData);

  if (hinh_anh_url) {
    const anhChinh = await HinhAnhTranh.findOne({
      where: { tranh_id: id, la_chinh: true },
    });

    if (anhChinh) {
      await anhChinh.update({ url: hinh_anh_url });
    } else {
      await HinhAnhTranh.create({
        tranh_id: id,
        url: hinh_anh_url,
        la_chinh: true,
        thu_tu: 0,
      });
    }
  }

  res.json({
    success: true,
    message: "Cap nhat tranh thanh cong",
    data: tranh,
  });
};

const xoaTranh = async (req, res) => {
  const { id } = req.params;

  const tranh = await Tranh.findByPk(id);

  if (!tranh) {
    return res.status(404).json({
      success: false,
      error: "Không tìm thấy tranh",
    });
  }

  const daPhatSinhDon = await DonHangChiTiet.count({
    where: { tranh_id: id },
  });

  if (daPhatSinhDon > 0) {
    await tranh.update({
      trang_thai: "an",
      cap_nhat_luc: new Date(),
    });

    return res.json({
      success: true,
      message:
        "Tranh đã phát sinh đơn hàng nên hệ thống chỉ ẩn tranh, không xóa lịch sử",
      data: tranh,
    });
  }

  await sequelize.transaction(async (t) => {
    await HinhAnhTranh.destroy({ where: { tranh_id: id }, transaction: t });
    await KhuyenMaiTranh.destroy({ where: { tranh_id: id }, transaction: t });
    await GioHangChiTiet.destroy({ where: { tranh_id: id }, transaction: t });
    await tranh.destroy({ transaction: t });
  });

  res.json({
    success: true,
    message: "Xóa tranh thành công",
    data: null,
  });
};

module.exports = {
  xemTatCaTranh,
  xemChiTietTranh,
  taoTranh,
  capNhatTranh,
  xoaTranh,
};
