const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const ThietBi = sequelize.define(
  "ThietBi",
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

    thong_so: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    han_bao_hanh: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    gia: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },

    trang_thai: {
      type: DataTypes.ENUM("hoat_dong", "hong", "bao_tri"),
      allowNull: false,
      defaultValue: "hoat_dong",
    },
  },
  {
    tableName: "thiet_bi",
    timestamps: false,
  }
);

module.exports = ThietBi;