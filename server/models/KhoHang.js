const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const KhoHang = sequelize.define(
  "KhoHang",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ten_kho: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    dia_chi: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    tien_thue: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    hoat_dong: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "kho_hang",
    timestamps: false,
  },
);

module.exports = KhoHang;
