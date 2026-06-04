const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models"); // 1. IMPORT SEQUELIZE ĐỂ ĐÓNG KẾT NỐI KHÔNG BỊ TREO JEST

describe("Khách Hàng API (/api/khach-hang)", () => {
  let tokenNV = "", tokenQL = "";

  beforeAll(async () => {
    // ⚠️ QUAN TRỌNG: Đổi email này thành EMAIL CỦA TÀI KHOẢN NHÂN VIÊN THẬT trong DB của bạn
    // Không dùng email khachhang@example.com ở đây nữa vì sẽ bị lỗi phân quyền 500
    const resN = await request(app)
      .post("/api/auth/dang-nhap")
      .send({ email: "admin@example.com", mat_khau: "12345678" });
    tokenNV = resN.body.data?.token;

    // Đăng nhập tài khoản Quản lý có sẵn dưới DB
    const resQ = await request(app)
      .post("/api/auth/dang-nhap")
      .send({ email: "admin@example.com", mat_khau: "12345678" });
    tokenQL = resQ.body.data?.token;
  });

  // 2. TỰ ĐỘNG ĐÓNG CỔNG KẾT NỐI DB ĐỂ TERMINAL TỰ THOÁT GỌN GÀNG
  afterAll(async () => {
    if (sequelize) {
      await sequelize.close();
    }
  });

  it("GET / -> Nhân viên tìm kiếm khách hàng bằng tên/sđt kèm phân trang", async () => {
    const res = await request(app)
      .get("/api/khach-hang?search=Nguyễn&page=1&limit=5")
      .set("Authorization", `Bearer ${tokenNV}`);
    
    // 💡 Nếu server vẫn cứng đầu trả về 500, dòng này sẽ in thông báo lỗi chi tiết của MySQL ra màn hình
    if (res.statusCode === 500) {
      console.log("❌ CHI TIẾT LỖI SẬP SERVER CỔNG DANH SÁCH:", res.body);
    }
    
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty("total");
    expect(res.body.page).toBe(1);
  });

  it("GET /:id -> Xem chi tiết khách hàng bất kỳ", async () => {
    // ⚠️ Sửa số 1 thành một chuỗi định dạng UUID mẫu để tránh lỗi ép kiểu dữ liệu của MySQL
    const uuidKhachHangMau = "101794b7-9477-43ad-bfaa-d0547fb50f01"; 

    const res = await request(app)
      .get(`/api/khach-hang/${uuidKhachHangMau}`)
      .set("Authorization", `Bearer ${tokenNV}`);
    
    if (res.statusCode === 500) {
      console.log("❌ CHI TIẾT LỖI SẬP SERVER CỔNG XEM CHI TIẾT:", res.body);
    }
    expect([200, 404]).toContain(res.statusCode);
  });

  it("PUT /:id/khoa -> Quản lý khóa tài khoản của khách hàng", async () => {
    const uuidKhachHangMau = "101794b7-9477-43ad-bfaa-d0547fb50f01";

    const res = await request(app)
      .put(`/api/khach-hang/${uuidKhachHangMau}/khoa`)
      .set("Authorization", `Bearer ${tokenQL}`);
    
    expect([200, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body.message).toBe("Khoa tai khoan khach hang thanh cong");
    }
  });
});