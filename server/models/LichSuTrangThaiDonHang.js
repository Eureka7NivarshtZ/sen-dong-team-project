const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const LichSuTrangThaiDonHang = sequelize.define(
  "LichSuTrangThaiDonHang",
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
    trang_thai_cu: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    trang_thai_moi: {
      type: DataTypes.ENUM(
        "cho_xac_nhan",
        "dang_chuan_bi",
        "dang_giao",
        "hoan_thanh",
        "huy"
      ),
      allowNull: false,
    },
    ghi_chu: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    nhan_vien_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    tao_luc: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "lich_su_trang_thai_don_hang",
    timestamps: false,
  }
);

module.exports = LichSuTrangThaiDonHang;