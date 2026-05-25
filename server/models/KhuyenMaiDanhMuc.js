const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const KhuyenMaiDanhMuc = sequelize.define(
  "KhuyenMaiDanhMuc",
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
    danh_muc_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: "khuyen_mai_danh_muc",
    timestamps: false,
  }
);

module.exports = KhuyenMaiDanhMuc;