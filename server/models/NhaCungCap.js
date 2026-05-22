const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const NhaCungCap = sequelize.define(
  "NhaCungCap",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    ten: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    sdt: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    dia_chi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    loai: {
      type: DataTypes.ENUM("vat_lieu", "thiet_bi", "ca_hai"),
      allowNull: false,
      defaultValue: "ca_hai",
    },
  },
  {
    tableName: "nha_cung_cap",
    timestamps: false,
  },
);

module.exports = NhaCungCap;
