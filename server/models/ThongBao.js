const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const ThongBao = sequelize.define(
  "ThongBao",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    khach_hang_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    nhan_vien_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    tieu_de: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    noi_dung: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    loai: {
      type: DataTypes.ENUM(
        "don_hang",
        "thanh_toan",
        "danh_gia",
        "ho_tro",
        "khuyen_mai",
        "he_thong"
      ),
      allowNull: false,
      defaultValue: "he_thong",
    },
    da_doc: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    lien_ket_loai: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    lien_ket_id: {
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
    tableName: "thong_bao",
    timestamps: false,
  }
);

module.exports = ThongBao;