const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DonHang = sequelize.define(
  "DonHang",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    khach_hang_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    nhan_vien_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    don_vi_van_chuyen_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    ma_don_hang: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    dia_chi_giao: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tong_tien_hang: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    phi_van_chuyen: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    giam_gia: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    thanh_tien: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    ngay_dat: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    ngay_giao_du_kien: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ngay_giao_thuc: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    trang_thai: {
      type: DataTypes.ENUM(
        "cho_xac_nhan",
        "dang_chuan_bi",
        "dang_giao",
        "hoan_thanh",
        "huy",
      ),
      allowNull: false,
      defaultValue: "cho_xac_nhan",
    },
    ghi_chu: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "don_hang",
    timestamps: false,
  },
);

module.exports = DonHang;
