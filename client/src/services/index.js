// Xuất tất cả services từ một file duy nhất để dễ import

export { default as api } from './apiClient';
export { default as authService } from './authService';
export { default as tranhService } from './tranhService';
export { default as gioHangService } from './gioHangService';
export { default as donHangService } from './donHangService';
export { default as danhMucService } from './danhMucService';
export { default as tacGiaService } from './tacGiaService';
export { default as donViVanChuyenService } from './donViVanChuyenService';
export { default as khachHangService } from './khachHangService';
export { default as nhanVienService } from './nhanVienService';
export { default as dashboardService } from './dashboardService';
export { default as vanDonService } from './vanDonService';
export { default as hoaDonService } from './hoaDonService';
export { default as thanhToanService } from './thanhToanService';

// Giữ nguyên file quản lý kho (Đảm bảo tên file thực tế của bạn là khoService.js hoặc kho.service.js)
export { nhaCungCapService, vatLieuService, phieuNhapService, thietBiService } from './khoService';