const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const PhieuNhapVatLieu = sequelize.define(
  "PhieuNhapVatLieu",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    nha_cung_cap_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    nhan_vien_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    ngay_nhap: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    tong_tien: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },

    trang_thai: {
      type: DataTypes.ENUM("cho_duyet", "da_nhap", "huy"),
      allowNull: false,
      defaultValue: "cho_duyet",
    },
  },
  {
    tableName: "phieu_nhap_vat_lieu",
    timestamps: false,
  },
);

module.exports = PhieuNhapVatLieu;
