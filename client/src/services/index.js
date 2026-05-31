// Central export point for all API services
import apiClient from "./apiClient";
import authService from "./authService";
import tranhService from "./tranhService";
import gioHangService from "./gioHangService";
import donHangService from "./donHangService";
import danhMucService from "./danhMucService";
import tacGiaService from "./tacGiaService";
import adminService from "./adminService";
import vanDonService from "./vanDonService";
import hoaDonService from "./hoaDonService";
import thanhToanService from "./thanhToanService";
import hoTroService from "./hoTroService";

export {
  apiClient,
  authService,
  tranhService,
  gioHangService,
  donHangService,
  danhMucService,
  tacGiaService,
  adminService,
  vanDonService,
  hoaDonService,
  thanhToanService,
  hoTroService,
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
  adminService,
  vanDonService,
  hoaDonService,
  thanhToanService,
  hoTroService,
};
