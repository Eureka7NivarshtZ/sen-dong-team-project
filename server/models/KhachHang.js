const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const KhachHang = sequelize.define(
  "KhachHang",
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
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    sdt: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    dia_chi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tao_luc: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "khach_hang",
    timestamps: false,
  },
);

module.exports = KhachHang;
