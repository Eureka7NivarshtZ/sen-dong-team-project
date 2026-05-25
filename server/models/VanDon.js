const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const VanDon = sequelize.define(
  "VanDon",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    don_hang_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    don_vi_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    ma_van_don: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },
    ngay_lay_hang: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ngay_giao: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    trang_thai: {
      type: DataTypes.ENUM("cho_lay", "dang_giao", "da_giao", "that_bai"),
      allowNull: false,
      defaultValue: "cho_lay",
    },
  },
  {
    tableName: "van_don",
    timestamps: false,
  },
);

module.exports = VanDon;
