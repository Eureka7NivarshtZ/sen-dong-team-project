const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const YeuCauHoTro = sequelize.define(
  "YeuCauHoTro",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    khach_hang_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    don_hang_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    tieu_de: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    noi_dung: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    loai: {
      type: DataTypes.ENUM(
        "don_hang",
        "thanh_toan",
        "van_chuyen",
        "san_pham",
        "tai_khoan",
        "khac"
      ),
      allowNull: false,
      defaultValue: "khac",
    },
    muc_do: {
      type: DataTypes.ENUM("thap", "binh_thuong", "cao", "khan_cap"),
      allowNull: false,
      defaultValue: "binh_thuong",
    },
    trang_thai: {
      type: DataTypes.ENUM("moi", "dang_xu_ly", "da_phan_hoi", "da_dong"),
      allowNull: false,
      defaultValue: "moi",
    },
    nhan_vien_phu_trach_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    tableName: "yeu_cau_ho_tro",
    timestamps: true,
    createdAt: "tao_luc",
    updatedAt: "cap_nhat_luc",
  }
);

module.exports = YeuCauHoTro;