const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const TacGia = sequelize.define(
  "TacGia",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ho_ten: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    ngay_sinh: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dia_chi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    sdt: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    tieu_su: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "tac_gia",
    timestamps: false,
  },
);

module.exports = TacGia;
