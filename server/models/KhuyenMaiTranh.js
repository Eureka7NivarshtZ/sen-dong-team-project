const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const KhuyenMaiTranh = sequelize.define(
  "KhuyenMaiTranh",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    khuyen_mai_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    tranh_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: "khuyen_mai_tranh",
    timestamps: false,
  }
);

module.exports = KhuyenMaiTranh;