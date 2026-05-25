const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const LichSuSuDungKhuyenMai = sequelize.define(
  "LichSuSuDungKhuyenMai",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    khuyen_mai_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    khach_hang_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    don_hang_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    so_tien_giam: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    thoi_gian_su_dung: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "lich_su_su_dung_khuyen_mai",
    timestamps: false,
  }
);

module.exports = LichSuSuDungKhuyenMai;