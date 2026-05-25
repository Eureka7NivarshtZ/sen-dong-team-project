const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const PhanHoiHoTro = sequelize.define(
  "PhanHoiHoTro",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    yeu_cau_ho_tro_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    nguoi_gui_loai: {
      type: DataTypes.ENUM("khach_hang", "nhan_vien"),
      allowNull: false,
    },
    khach_hang_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    nhan_vien_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    noi_dung: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tep_dinh_kem_url: {
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
    tableName: "phan_hoi_ho_tro",
    timestamps: false,
  }
);

module.exports = PhanHoiHoTro;