// Central export point for all API services
import apiClient from "./apiClient";
import authService from "./authService";
import tranhService from "./tranhService";
import gioHangService from "./gioHangService";
import donHangService from "./donHangService";
import danhMucService from "./danhMucService";
import tacGiaService from "./tacGiaService";
import dashboardService from "./dashboardService";
import hoaDonService from "./hoaDonService";
import thanhToanService from "./thanhToanService";
import nhanVienService from "./nhanVienService";
import khuyenMaiService from "./khuyenMaiService";
import donViVanChuyenService from "./donViVanChuyenService";

export {
  apiClient,
  authService,
  tranhService,
  gioHangService,
  donHangService,
  danhMucService,
  tacGiaService,
  dashboardService,
  hoaDonService,
  thanhToanService,
  nhanVienService,
  khuyenMaiService,
  donViVanChuyenService,
};

// Default export - tất cả services
export default {
  apiClient,
  authService,
  tranhService,
  gioHangService,
  donHangService,
  danhMucService,
  tacGiaService,
  dashboardService,
  hoaDonService,
  thanhToanService,
  nhanVienService,
  khuyenMaiService,
  donViVanChuyenService,
};
