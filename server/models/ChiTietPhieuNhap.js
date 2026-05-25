const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ChiTietPhieuNhap = sequelize.define(
  "ChiTietPhieuNhap",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    phieu_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    vat_lieu_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    so_luong: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    don_gia: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },

    thanh_tien: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
  },
  {
    tableName: "chi_tiet_phieu_nhap",
    timestamps: false,
  },
);

module.exports = ChiTietPhieuNhap;
