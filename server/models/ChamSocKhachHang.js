const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const ChamSocKhachHang = sequelize.define(
  "ChamSocKhachHang",
  {
    id: {
      type: DataTypes.STRING(50), // Dùng chuỗi string giới hạn ký tự
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    khach_hang_id: {
      type: DataTypes.STRING(50), // Đổi thành STRING cho đồng bộ chuỗi chữ với KhachHang.js
      allowNull: true,
    },
    ho_ten: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    chu_de: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    noi_dung: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tra_loi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    trang_thai: {
      type: DataTypes.ENUM("chua_tra_loi", "da_tra_loi"),
      defaultValue: "chua_tra_loi",
    },
  },
  {
    tableName: "ChamSocKhachHangs",
    timestamps: true,
  }
);

module.exports = ChamSocKhachHang;