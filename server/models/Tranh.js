const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Tranh = sequelize.define(
  "Tranh",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tac_gia_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    danh_muc_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    kho_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    ten_tranh: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    mo_ta: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    kich_thuoc: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    gia_ban: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    gia_von: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    so_luong_ton: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    trang_thai: {
      type: DataTypes.ENUM("ban", "het_hang", "an"),
      allowNull: false,
      defaultValue: "ban",
    },
    nhan_vien_tao_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    nhan_vien_cap_nhat_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    tao_luc: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    cap_nhat_luc: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "tranh",
    timestamps: false,
  },
);

module.exports = Tranh;
