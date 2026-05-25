const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const TaiKhoan = sequelize.define(
  "TaiKhoan",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(191),
      allowNull: false,
      unique: true,
    },
    mat_khau_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    loai: {
      type: DataTypes.ENUM("nhan_vien", "khach_hang"),
      allowNull: false,
    },
    kich_hoat: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1,
    },
    token_dat_lai_mat_khau: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    token_dat_lai_mat_khau_het_han: {
      type: DataTypes.DATE,
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
    tableName: "tai_khoan",
    timestamps: false,
  },
);

module.exports = TaiKhoan;
