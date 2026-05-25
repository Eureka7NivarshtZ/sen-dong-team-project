const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const KhuyenMai = sequelize.define(
  "KhuyenMai",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ma: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    ten: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    mo_ta: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    loai_giam: {
      type: DataTypes.ENUM("phan_tram", "so_tien"),
      allowNull: false,
    },
    gia_tri_giam: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    giam_toi_da: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    don_toi_thieu: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    so_luong: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    so_luong_da_dung: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    ngay_bat_dau: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    ngay_ket_thuc: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    ap_dung_cho: {
      type: DataTypes.ENUM("toan_bo", "tranh", "danh_muc"),
      allowNull: false,
      defaultValue: "toan_bo",
    },
    trang_thai: {
      type: DataTypes.ENUM("hoat_dong", "tam_dung", "het_han"),
      allowNull: false,
      defaultValue: "hoat_dong",
    },
    nhan_vien_tao_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    tableName: "khuyen_mai",
    timestamps: true,
    createdAt: "tao_luc",
    updatedAt: "cap_nhat_luc",
  }
);

module.exports = KhuyenMai;