const { DataTypes } = require("sequelize");
const sequelize = require("../utils//db");

const ThanhToan = sequelize.define(
  "ThanhToan",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    hoa_don_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    so_tien: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: 1,
      },
    },

    phuong_thuc: {
      type: DataTypes.ENUM("tien_mat", "chuyen_khoan", "the"),
      allowNull: false,
    },

    thoi_gian: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    trang_thai: {
      type: DataTypes.ENUM(
        "cho_thanh_toan",
        "thanh_cong",
        "that_bai",
        "hoan_tien",
      ),
      allowNull: false,
      defaultValue: "cho_thanh_toan",
    },

    ma_giao_dich: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: "thanh_toan",
    timestamps: false,
  },
);

module.exports = ThanhToan;
