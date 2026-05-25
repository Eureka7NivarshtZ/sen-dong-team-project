const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const NhanVien = sequelize.define(
  "NhanVien",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tai_khoan_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },
    ho_ten: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    ngay_sinh: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dia_chi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    sdt: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    vai_tro: {
      type: DataTypes.ENUM("quan_ly", "ban_hang", "kho"),
      allowNull: false,
    },
    hoat_dong: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "nhan_vien",
    timestamps: false,
  },
);

module.exports = NhanVien;
