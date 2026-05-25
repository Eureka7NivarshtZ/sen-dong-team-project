const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DonViVanChuyen = sequelize.define(
  "DonViVanChuyen",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    ten: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    sdt: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    phi_co_ban: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    hoat_dong: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "don_vi_van_chuyen",
    timestamps: false,
  },
);

module.exports = DonViVanChuyen;
