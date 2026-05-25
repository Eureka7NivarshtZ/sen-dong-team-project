# API Services - Hướng dẫn sử dụng

Đây là hướng dẫn chi tiết cách sử dụng các API services trong project.

## Cài đặt

```bash
npm install axios
```

## Cấu hình Backend URL

Mở file `services/apiClient.js` và thay đổi `baseURL` nếu backend không chạy trên `http://localhost:3000`:

```javascript
const apiClient = axios.create({
  baseURL: "http://localhost:3000/api", // Thay đổi port/host tại đây
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
```

## Cách Import Services

### Cách 1: Import từ index.js (Recommended)
```javascript
import { authService, tranhService, gioHangService } from "@/services";
```

### Cách 2: Import trực tiếp từ file
```javascript
import authService from "@/services/authService";
import tranhService from "@/services/tranhService";
```

## Ví dụ sử dụng từng service

### 1. Authentication Service (`authService`)

```javascript
import { authService } from "@/services";

// Đăng nhập
const handleLogin = async () => {
  const result = await authService.dangNhap("user@example.com", "password123");
  if (result.success) {
    console.log("Đăng nhập thành công:", result.data.user);
  } else {
    console.error("Lỗi:", result.error);
  }
};

// Đăng ký khách hàng
const handleRegister = async () => {
  const result = await authService.dangKyKhachHang(
    "Nguyễn Văn A",
    "user@example.com",
    "password123",
    "0912345678",
    "123 Đường ABC, TP HCM"
  );
  if (result.success) {
    console.log("Đăng ký thành công");
  }
};

// Lấy thông tin người dùng hiện tại
const getUserInfo = async () => {
  const result = await authService.xemThongTinCuaToi();
  if (result.success) {
    console.log("Thông tin người dùng:", result.data);
  }
};

// Kiểm tra đã đăng nhập
if (authService.isAuthenticated()) {
  console.log("Người dùng:", authService.getUser());
}

// Đăng xuất
authService.dangXuat();
```

### 2. Tranh (Paintings) Service (`tranhService`)

```javascript
import { tranhService } from "@/services";

// Lấy tất cả tranh (public)
const layTatCaTranh = async () => {
  const result = await tranhService.layTatCaTranh();
  if (result.success) {
    console.log("Danh sách tranh:", result.data);
  }
};

// Lấy chi tiết một tranh
const layChiTietTranh = async (tranhId) => {
  const result = await tranhService.layChiTietTranh(tranhId);
  if (result.success) {
    console.log("Chi tiết tranh:", result.data);
  }
};

// Admin: Tạo tranh mới
const taoTranh = async () => {
  const tranhData = {
    ten: "Tranh Đông Hà",
    giaBan: 500000,
    soLuongTon: 10,
    moTa: "Tranh đẹp",
    danhMucId: 1,
    tacGiaId: 1,
  };
  const result = await tranhService.taoTranh(tranhData);
  if (result.success) {
    console.log("Tranh tạo thành công:", result.data);
  }
};

// Admin: Cập nhật tranh
const capNhatTranh = async (tranhId) => {
  const tranhData = { giaBan: 600000 };
  const result = await tranhService.capNhatTranh(tranhId, tranhData);
  if (result.success) {
    console.log("Tranh cập nhật thành công");
  }
};

// Admin: Thêm hình ảnh cho tranh
const themHinhAnh = async (tranhId, file) => {
  const result = await tranhService.themHinhAnhTranh(tranhId, {
    file: file, // File object từ input[type="file"]
  });
  if (result.success) {
    console.log("Hình ảnh thêm thành công");
  }
};
```

### 3. Giỏ hàng Service (`gioHangService`)

```javascript
import { gioHangService } from "@/services";

// Lấy giỏ hàng của tôi
const layGioHang = async () => {
  const result = await gioHangService.layGioHangCuaToi();
  if (result.success) {
    console.log("Giỏ hàng:", result.data);
  }
};

// Thêm vào giỏ hàng
const themVaoGioHang = async (tranhId, soLuong = 1) => {
  const result = await gioHangService.themVaoGioHang(tranhId, soLuong);
  if (result.success) {
    console.log("Đã thêm vào giỏ hàng");
  }
};

// Cập nhật số lượng
const capNhatSoLuong = async (gioHangChiTietId, soLuongMoi) => {
  const result = await gioHangService.capNhatSoLuong(
    gioHangChiTietId,
    soLuongMoi
  );
  if (result.success) {
    console.log("Cập nhật số lượng thành công");
  }
};

// Xóa một item
const xoaKhoiGioHang = async (gioHangChiTietId) => {
  const result = await gioHangService.xoaKhoiGioHang(gioHangChiTietId);
  if (result.success) {
    console.log("Đã xóa khỏi giỏ hàng");
  }
};

// Xóa tất cả
const xoaTatCa = async () => {
  const result = await gioHangService.xoaTatCaGioHang();
  if (result.success) {
    console.log("Giỏ hàng đã được xóa");
  }
};
```

### 4. Đơn hàng Service (`donHangService`)

```javascript
import { donHangService } from "@/services";

// Khách hàng: Tạo đơn hàng mới
const taoDonHang = async () => {
  const donHangData = {
    diaChi: "123 Đường ABC, TP HCM",
    soDienThoai: "0912345678",
    ghiChu: "Giao vào chiều",
    donViVanChuyenId: 1,
  };
  const result = await donHangService.taoDonHang(donHangData);
  if (result.success) {
    console.log("Đơn hàng tạo thành công:", result.data);
  }
};

// Khách hàng: Xem đơn hàng của tôi
const xemDonCuaToi = async () => {
  const result = await donHangService.xemDonCuaToi();
  if (result.success) {
    console.log("Đơn hàng của tôi:", result.data);
  }
};

// Admin: Xem tất cả đơn hàng
const xemTatCaDon = async () => {
  const result = await donHangService.xemTatCaDonHang();
  if (result.success) {
    console.log("Tất cả đơn hàng:", result.data);
  }
};

// Admin: Cập nhật trạng thái đơn hàng
const capNhatTrangThai = async (donHangId, trangThaiMoi) => {
  // trangThaiMoi có thể là: "cho_xac_nhan", "dang_giao", "da_giao", "da_huy", etc.
  const result = await donHangService.capNhatTrangThaiDon(
    donHangId,
    trangThaiMoi
  );
  if (result.success) {
    console.log("Trạng thái cập nhật thành công");
  }
};
```

### 5. Danh mục Service (`danhMucService`)

```javascript
import { danhMucService } from "@/services";

// Lấy tất cả danh mục
const layTatCaDanhMuc = async () => {
  const result = await danhMucService.layTatCaDanhMuc();
  if (result.success) {
    console.log("Danh mục:", result.data);
  }
};

// Admin: Thêm danh mục
const themDanhMuc = async () => {
  const result = await danhMucService.themDanhMuc({
    ten: "Tranh phong cảnh",
    moTa: "Tranh về phong cảnh thiên nhiên",
  });
  if (result.success) {
    console.log("Danh mục tạo thành công");
  }
};
```

### 6. Tác giả Service (`tacGiaService`)

```javascript
import { tacGiaService } from "@/services";

// Lấy tất cả tác giả
const layTatCaTacGia = async () => {
  const result = await tacGiaService.layTatCaTacGia();
  if (result.success) {
    console.log("Tác giả:", result.data);
  }
};

// Admin: Thêm tác giả
const themTacGia = async () => {
  const result = await tacGiaService.themTacGia({
    ten: "Nguyễn Văn A",
    moTa: "Họa sĩ nổi tiếng",
  });
  if (result.success) {
    console.log("Tác giả tạo thành công");
  }
};
```

### 7. Admin Service (`adminService`)

```javascript
import { adminService } from "@/services";

// Dashboard: Lấy thông tin tổng quan
const layDashboard = async () => {
  const result = await adminService.layDashboardTongQuan();
  if (result.success) {
    console.log("Dashboard:", result.data);
  }
};

// Dashboard: Lấy doanh thu theo tháng
const layDoanhThu = async () => {
  const result = await adminService.layDoanhThuTheoThang(2024);
  if (result.success) {
    console.log("Doanh thu:", result.data);
  }
};

// Quản lý nhân viên
const layTatCaNhanVien = async () => {
  const result = await adminService.layTatCaNhanVien();
  if (result.success) {
    console.log("Nhân viên:", result.data);
  }
};

// Thêm nhân viên
const themNhanVien = async () => {
  const result = await adminService.themNhanVien({
    ten: "Trần Văn B",
    email: "tvan.b@example.com",
    matKhau: "password123",
    vai_tro: "ban_hang",
    soDienThoai: "0987654321",
  });
  if (result.success) {
    console.log("Nhân viên tạo thành công");
  }
};

// Quản lý khách hàng
const layTatCaKhachHang = async () => {
  const result = await adminService.layTatCaKhachHang();
  if (result.success) {
    console.log("Khách hàng:", result.data);
  }
};

// Khóa khách hàng
const khoaKhachHang = async (khachHangId) => {
  const result = await adminService.khoaKhachHang(khachHangId);
  if (result.success) {
    console.log("Khách hàng đã được khóa");
  }
};
```

### 8. Vận đơn Service (`vanDonService`)

```javascript
import { vanDonService } from "@/services";

// Tạo vận đơn
const taoVanDon = async (donHangId) => {
  const result = await vanDonService.taoVanDon(donHangId, {
    soVanDon: "VD001",
    donViVanChuyenId: 1,
    ghiChu: "Giao nhanh",
  });
  if (result.success) {
    console.log("Vận đơn tạo thành công");
  }
};

// Lấy tất cả vận đơn
const layTatCaVanDon = async () => {
  const result = await vanDonService.layTatCaVanDon();
  if (result.success) {
    console.log("Vận đơn:", result.data);
  }
};

// Cập nhật trạng thái vận đơn
const capNhatTrangThaiVanDon = async (vanDonId, trangThaiMoi) => {
  const result = await vanDonService.capNhatTrangThaiVanDon(
    vanDonId,
    trangThaiMoi
  );
  if (result.success) {
    console.log("Trạng thái vận đơn cập nhật");
  }
};
```

### 9. Hóa đơn Service (`hoaDonService`)

```javascript
import { hoaDonService } from "@/services";

// Lấy tất cả hóa đơn
const layTatCaHoaDon = async () => {
  const result = await hoaDonService.layTatCaHoaDon();
  if (result.success) {
    console.log("Hóa đơn:", result.data);
  }
};

// Tạo hóa đơn
const taoHoaDon = async () => {
  const result = await hoaDonService.taoHoaDon({
    donHangId: 1,
    tien: 500000,
    ghiChu: "Thanh toán",
  });
  if (result.success) {
    console.log("Hóa đơn tạo thành công");
  }
};
```

### 10. Thanh toán Service (`thanhToanService`)

```javascript
import { thanhToanService } from "@/services";

// Lấy tất cả thanh toán
const layTatCaThanhToan = async () => {
  const result = await thanhToanService.layTatCaThanhToan();
  if (result.success) {
    console.log("Thanh toán:", result.data);
  }
};

// Tạo thanh toán
const taoThanhToan = async () => {
  const result = await thanhToanService.taoThanhToan({
    hoaDonId: 1,
    phuongThucThanhToan: "the_tin_dung",
    soTien: 500000,
  });
  if (result.success) {
    console.log("Thanh toán tạo thành công");
  }
};
```

## Xử lý lỗi

Tất cả services trả về object với cấu trúc:

```javascript
{
  success: true/false,
  message: "...",
  data: {...},
  error: "..."
}
```

Cách xử lý lỗi:

```javascript
const result = await authService.dangNhap(email, password);

if (result.success) {
  // Xử lý thành công
  console.log(result.data);
} else {
  // Xử lý lỗi
  console.error("Lỗi:", result.error);
  // Có thể hiển thị toast/alert cho người dùng
}
```

## Token & Authentication

Token được tự động lưu vào `localStorage` khi đăng nhập thành công. Interceptor tự động thêm token vào header của mỗi request.

Nếu token hết hạn (lỗi 401), người dùng sẽ được tự động redirect tới trang login.

## Chú ý

- Thay đổi `baseURL` trong `apiClient.js` nếu backend không chạy trên port 3000
- Kiểm tra token trong localStorage sau khi đăng nhập
- Luôn kiểm tra `result.success` trước khi truy cập `result.data`
- Sử dụng FormData cho requests có file upload
