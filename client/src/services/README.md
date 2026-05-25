# API Services Structure

Thư mục `services/` chứa toàn bộ logic gọi API từ frontend tới backend. Các services này sử dụng Axios để gọi REST API từ backend.

## Cấu trúc thư mục

```
services/
├── index.js                 # Export tất cả services
├── apiClient.js             # Config Axios instance (token, baseURL, interceptors)
├── authService.js           # API liên quan đến Authentication
├── tranhService.js          # API liên quan đến Paintings/Tranh
├── gioHangService.js        # API liên quan đến Shopping Cart/Giỏ hàng
├── donHangService.js        # API liên quan đến Orders/Đơn hàng
├── danhMucService.js        # API liên quan đến Categories/Danh mục
├── tacGiaService.js         # API liên quan đến Authors/Tác giả
├── adminService.js          # API liên quan đến Admin Dashboard & Management
├── vanDonService.js         # API liên quan đến Shipments/Vận đơn
├── hoaDonService.js         # API liên quan đến Invoices/Hóa đơn
├── thanhToanService.js      # API liên quan đến Payments/Thanh toán
├── USAGE_GUIDE.md           # Hướng dẫn sử dụng chi tiết
├── ExampleComponent.jsx     # Component ví dụ
└── README.md                # File này
```

## Tệp chính

### 1. `apiClient.js` - Cấu hình Axios

Cấu hình chính của Axios instance bao gồm:
- **baseURL**: `http://localhost:3000/api` (thay đổi nếu backend ở port khác)
- **timeout**: 10 giây
- **Request Interceptor**: Tự động thêm token vào header `Authorization`
- **Response Interceptor**: 
  - Xử lý lỗi 401 (Unauthorized) - redirect tới login
  - Xử lý lỗi 403 (Forbidden)

### 2. Các service files

Mỗi service file chứa các hàm gọi API cho một nhóm chức năng cụ thể:

| File | Chức năng |
|------|----------|
| `authService.js` | Đăng nhập, đăng ký, quên mật khẩu, lấy thông tin người dùng |
| `tranhService.js` | Lấy tranh, tạo/sửa/xóa tranh, quản lý hình ảnh |
| `gioHangService.js` | Giỏ hàng - thêm, xóa, cập nhật số lượng |
| `donHangService.js` | Đơn hàng - tạo, xem, hủy (khách hàng & admin) |
| `danhMucService.js` | Danh mục - lấy, thêm, sửa, xóa |
| `tacGiaService.js` | Tác giả - lấy, thêm, sửa, xóa |
| `adminService.js` | Dashboard, quản lý khách hàng, nhân viên, đơn vị vận chuyển |
| `vanDonService.js` | Vận đơn - tạo, xem, cập nhật trạng thái |
| `hoaDonService.js` | Hóa đơn - tạo, xem, hủy |
| `thanhToanService.js` | Thanh toán - tạo, xem, cập nhật trạng thái |

## Cách sử dụng

### Cơ bản

```javascript
import { authService, tranhService } from "@/services";

// Gọi hàm API
const result = await authService.dangNhap(email, password);

if (result.success) {
  console.log("Thành công:", result.data);
} else {
  console.error("Lỗi:", result.error);
}
```

### Trong React Component

```javascript
import { useState, useEffect } from "react";
import { tranhService } from "@/services";

function MyComponent() {
  const [tranh, setTranh] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTranh = async () => {
      setLoading(true);
      const result = await tranhService.layTatCaTranh();
      if (result.success) {
        setTranh(result.data);
      }
      setLoading(false);
    };

    fetchTranh();
  }, []);

  if (loading) return <div>Đang tải...</div>;
  
  return (
    <div>
      {tranh.map((t) => (
        <div key={t.id}>{t.ten}</div>
      ))}
    </div>
  );
}
```

## Response Format

Tất cả API trả về format:

```javascript
{
  success: true,           // hoặc false
  message: "...",         // Thông báo
  data: {...},            // Dữ liệu (nếu success = true)
  error: "..."            // Lỗi (nếu success = false)
}
```

## Cấu hình cho các môi trường khác nhau

Mở `apiClient.js` và thay đổi `baseURL`:

```javascript
// Development
baseURL: "http://localhost:3000/api"

// Production
baseURL: "https://api.example.com/api"

// Staging
baseURL: "https://staging-api.example.com/api"
```

Hoặc sử dụng environment variables:

```javascript
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  // ...
});
```

Rồi thêm vào `.env.local`:

```
VITE_API_URL=http://localhost:3000/api
```

## Token & Authentication

- Token được tự động lưu vào `localStorage` sau khi đăng nhập
- Mỗi request tới API sẽ tự động gửi token trong header `Authorization: Bearer <token>`
- Nếu token hết hạn (lỗi 401), người dùng tự động được logout

## Error Handling

Luôn kiểm tra `result.success` trước khi truy cập `result.data`:

```javascript
const result = await someService.someMethod();

if (result.success) {
  // Xử lý thành công
  console.log(result.data);
} else {
  // Xử lý lỗi
  console.error("Lỗi:", result.error);
  // Hiển thị thông báo lỗi cho người dùng
}
```

## File Upload

Để upload file (ví dụ: hình ảnh), sử dụng `FormData`:

```javascript
const fileInput = document.querySelector("input[type='file']");
const file = fileInput.files[0];

const result = await tranhService.themHinhAnhTranh(tranhId, {
  file: file,
});
```

## Troubleshooting

### Lỗi CORS

Đảm bảo backend có bật CORS:

```javascript
// server/app.js
app.use(cors());
```

### Lỗi 401 (Unauthorized)

- Kiểm tra token có được lưu vào localStorage không
- Kiểm tra token có hết hạn không
- Kiểm tra token được gửi đúng trong header không

### Lỗi 403 (Forbidden)

- Kiểm tra vai trò (role) của người dùng có đủ quyền không

### Timeout

Tăng giá trị `timeout` trong `apiClient.js` nếu cần:

```javascript
const apiClient = axios.create({
  timeout: 30000, // 30 giây
});
```

## Thêm endpoint mới

Khi backend thêm endpoint mới:

1. Tạo hàm mới trong service file tương ứng
2. Sử dụng `apiClient.get/post/put/delete/patch`
3. Xử lý response như các hàm khác

Ví dụ:

```javascript
// Trong someService.js
layChiTietBatKy: async (id) => {
  try {
    const response = await apiClient.get(`/some-endpoint/${id}`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Lấy dữ liệu thất bại",
    };
  }
},
```

## Tài liệu thêm

- [USAGE_GUIDE.md](./USAGE_GUIDE.md) - Hướng dẫn sử dụng chi tiết với ví dụ
- [ExampleComponent.jsx](./ExampleComponent.jsx) - Component ví dụ
- [Axios Documentation](https://axios-http.com/) - Tài liệu Axios
