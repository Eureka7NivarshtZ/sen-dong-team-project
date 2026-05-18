const sequelize = require("../utils/db");

const Tranh = require("./Tranh");
const HinhAnhTranh = require("./HinhAnhTranh");
const TacGia = require("./TacGia.js");
const DanhMuc = require("./DanhMuc");
const KhoHang = require("./KhoHang");

Tranh.hasMany(HinhAnhTranh, {
  foreignKey: "tranh_id",
  as: "hinh_anh",
});

HinhAnhTranh.belongsTo(Tranh, {
  foreignKey: "tranh_id",
  as: "tranh",
});

Tranh.belongsTo(TacGia, {
  foreignKey: "tac_gia_id",
  as: "tac_gia",
});

Tranh.belongsTo(DanhMuc, {
  foreignKey: "danh_muc_id",
  as: "danh_muc",
});

Tranh.belongsTo(KhoHang, {
  foreignKey: "kho_id",
  as: "kho_hang",
});

module.exports = {
  sequelize,
  Tranh,
  HinhAnhTranh,
  TacGia,
  DanhMuc,
  KhoHang,
};
