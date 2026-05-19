const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const DanhMuc = sequelize.define(
  "DanhMuc",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ten: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "danh_muc",
    timestamps: false,
  },
);

module.exports = DanhMuc;
