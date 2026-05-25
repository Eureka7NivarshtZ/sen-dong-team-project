const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const DanhGia = sequelize.define(
  "DanhGia",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    khach_hang_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    tranh_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    don_hang_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    so_sao: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    noi_dung: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    hinh_anh_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    trang_thai: {
      type: DataTypes.ENUM("cho_duyet", "hien", "an"),
      defaultValue: "cho_duyet",
    },
    phan_hoi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    nhan_vien_phan_hoi_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    tableName: "danh_gia",
    timestamps: true,
    createdAt: "tao_luc",
    updatedAt: "cap_nhat_luc",
  },
);

module.exports = DanhGia;
