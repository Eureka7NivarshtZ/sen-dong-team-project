const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const GioHang = sequelize.define(
  "GioHang",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    khach_hang_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },
    cap_nhat_luc: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "gio_hang",
    timestamps: false,
  },
);

module.exports = GioHang;
