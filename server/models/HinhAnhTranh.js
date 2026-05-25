const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const HinhAnhTranh = sequelize.define(
  "HinhAnhTranh",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tranh_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    la_chinh: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    thu_tu: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "hinh_anh_tranh",
    timestamps: false,
  },
);

module.exports = HinhAnhTranh;
