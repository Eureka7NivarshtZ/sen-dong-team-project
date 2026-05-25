const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const HoaDon = sequelize.define(
  "HoaDon",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    don_hang_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    so_hoa_don: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },

    ngay_xuat: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    tong_tien_truoc_thue: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },

    thue_suat: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 10,
    },

    // Generated column trong SQL, không cần truyền khi create
    tien_thue: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },

    // Generated column trong SQL, không cần truyền khi create
    tong_tien_sau_thue: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },

    loai: {
      type: DataTypes.ENUM("ban_hang", "hoan_tien"),
      allowNull: false,
      defaultValue: "ban_hang",
    },

    hoa_don_goc_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    trang_thai: {
      type: DataTypes.ENUM("nhap", "da_xuat", "da_huy"),
      allowNull: false,
      defaultValue: "da_xuat",
    },
  },
  {
    tableName: "hoa_don",
    timestamps: false,
  },
);

module.exports = HoaDon;
