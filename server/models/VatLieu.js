const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const VatLieu = sequelize.define(
  "VatLieu",
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

    ten: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    loai: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    don_vi: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "cái",
    },

    gia_nhap: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },

    so_luong_ton: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    muc_canh_bao: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
  },
  {
    tableName: "vat_lieu",
    timestamps: false,
  },
);

module.exports = VatLieu;
