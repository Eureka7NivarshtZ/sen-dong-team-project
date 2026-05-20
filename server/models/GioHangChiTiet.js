const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const GioHangChiTiet = sequelize.define(
  "GioHangChiTiet",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    gio_hang_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    tranh_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    so_luong: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
    don_gia: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
  },
  {
    tableName: "gio_hang_chi_tiet",
    timestamps: false,
  },
);

module.exports = GioHangChiTiet;
