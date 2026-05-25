const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DonHangChiTiet = sequelize.define(
  "DonHangChiTiet",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    don_hang_id: {
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

    thanh_tien: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },

    co_lap_khung: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "don_hang_chi_tiet",
    timestamps: false,
  },
);

module.exports = DonHangChiTiet;
