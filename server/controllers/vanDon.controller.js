const { VanDon, DonHang, DonViVanChuyen } = require("../models");

const taoMaVanDon = () => {
  return `VD-${Date.now()}`;
};

const taoVanDon = async (req, res) => {
  const { don_hang_id } = req.params;
  const { don_vi_id, ma_van_don, ngay_lay_hang } = req.body;

  if (!don_vi_id) {
    return res.status(400).json({
      error: "Vui lòng chọn đơn vị vận chuyển",
    });
  }

  const donHang = await DonHang.findByPk(don_hang_id);

  if (!donHang) {
    return res.status(404).json({
      error: "Không tìm thấy đơn hàng",
    });
  }

  const donVi = await DonViVanChuyen.findByPk(don_vi_id);

  if (!donVi) {
    return res.status(404).json({
      error: "Không tìm thấy đơn vị vận chuyển",
    });
  }

  if (!donVi.hoat_dong) {
    return res.status(400).json({
      error: "Đơn vị vận chuyển này đang bị tắt",
    });
  }

  const vanDonTonTai = await VanDon.findOne({
    where: {
      don_hang_id,
    },
  });

  if (vanDonTonTai) {
    return res.status(400).json({
      error: "Đơn hàng này đã có vận đơn",
    });
  }

  const vanDon = await VanDon.create({
    don_hang_id,
    don_vi_id,
    ma_van_don: ma_van_don || taoMaVanDon(),
    ngay_lay_hang: ngay_lay_hang || null,
    trang_thai: "cho_lay",
  });

  await donHang.update({
    don_vi_van_chuyen_id: don_vi_id,
  });

  res.status(201).json({
    message: "Tạo vận đơn thành công",
    data: vanDon,
  });
};

const layTatCaVanDon = async (req, res) => {
  const danhSach = await VanDon.findAll({
    include: [
      {
        model: DonHang,
        as: "don_hang",
      },
      {
        model: DonViVanChuyen,
        as: "don_vi",
      },
    ],
    order: [["id", "DESC"]],
  });

  res.json(danhSach);
};

const layChiTietVanDon = async (req, res) => {
  const { id } = req.params;

  const vanDon = await VanDon.findByPk(id, {
    include: [
      {
        model: DonHang,
        as: "don_hang",
      },
      {
        model: DonViVanChuyen,
        as: "don_vi",
      },
    ],
  });

  if (!vanDon) {
    return res.status(404).json({
      error: "Không tìm thấy vận đơn",
    });
  }

  res.json(vanDon);
};

const capNhatTrangThaiVanDon = async (req, res) => {
  const { id } = req.params;
  const { trang_thai } = req.body;

  const trangThaiHopLe = ["cho_lay", "dang_giao", "da_giao", "that_bai"];

  if (!trangThaiHopLe.includes(trang_thai)) {
    return res.status(400).json({
      error: "Trạng thái vận đơn không hợp lệ",
    });
  }

  const vanDon = await VanDon.findByPk(id, {
    include: [
      {
        model: DonHang,
        as: "don_hang",
      },
    ],
  });

  if (!vanDon) {
    return res.status(404).json({
      error: "Không tìm thấy vận đơn",
    });
  }

  const duLieuCapNhat = {
    trang_thai,
  };

  if (trang_thai === "dang_giao" && !vanDon.ngay_lay_hang) {
    duLieuCapNhat.ngay_lay_hang = new Date();
  }

  if (trang_thai === "da_giao") {
    duLieuCapNhat.ngay_giao = new Date();
  }

  await vanDon.update(duLieuCapNhat);

  if (vanDon.don_hang) {
    if (trang_thai === "dang_giao") {
      await vanDon.don_hang.update({
        trang_thai: "dang_giao",
      });
    }

    if (trang_thai === "da_giao") {
      await vanDon.don_hang.update({
        trang_thai: "hoan_thanh",
        ngay_giao_thuc: new Date(),
      });
    }
  }

  res.json(vanDon);
};

const capNhatVanDon = async (req, res) => {
  const { id } = req.params;
  const { don_vi_id, ma_van_don, ngay_lay_hang, ngay_giao } = req.body;

  const vanDon = await VanDon.findByPk(id);

  if (!vanDon) {
    return res.status(404).json({
      error: "Không tìm thấy vận đơn",
    });
  }

  if (don_vi_id) {
    const donVi = await DonViVanChuyen.findByPk(don_vi_id);

    if (!donVi) {
      return res.status(404).json({
        error: "Không tìm thấy đơn vị vận chuyển",
      });
    }
  }

  await vanDon.update({
    don_vi_id,
    ma_van_don,
    ngay_lay_hang,
    ngay_giao,
  });

  res.json(vanDon);
};

const xoaVanDon = async (req, res) => {
  const { id } = req.params;

  const vanDon = await VanDon.findByPk(id);

  if (!vanDon) {
    return res.status(404).json({
      error: "Không tìm thấy vận đơn",
    });
  }

  await vanDon.destroy();

  res.status(204).end();
};

module.exports = {
  taoVanDon,
  layTatCaVanDon,
  layChiTietVanDon,
  capNhatTrangThaiVanDon,
  capNhatVanDon,
  xoaVanDon,
};
