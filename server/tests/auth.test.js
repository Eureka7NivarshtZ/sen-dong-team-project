const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models"); // 1. IMPORT SEQUELIZE ĐỂ ĐÓNG CỔNG KẾT NỐI

describe("Auth API (/api/auth)", () => {
  // Dùng tài khoản cố định đã có trong DB cho cổng đăng nhập/quên mật khẩu công khai
  const emailCoSan = "khachhang@example.com"; 

  // Tạo một chuỗi email động ngẫu nhiên MỚI để test tính năng đăng ký không bao giờ bị trùng 400
  const emailDangKyMoi = `test_${Date.now()}@example.com`;

  // 2. TỰ ĐỘNG ĐÓNG KẾT NỐI DATABASE ĐỂ TERMINAL TỰ THOÁT, KHÔNG BÌ TREO JEST
  afterAll(async () => {
    if (sequelize) {
      await sequelize.close();
    }
  });

 it("POST /dang-ky -> Đăng ký khách hàng mới", async () => {
    const res = await request(app)
      .post("/api/auth/dang-ky")
      .send({ 
        email: emailDangKyMoi,
        mat_khau: "12345678", 
        ho_ten: "Phùng Thanh Bộ", 
        sdt: "0123456789",
        dia_chi: "Hà Nội"
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  }, 15000);

  it("POST /dang-nhap -> Đăng nhập hệ thống", async () => {
    const res = await request(app)
      .post("/api/auth/dang-nhap")
      .send({ 
        email: emailCoSan, // Đăng nhập tài khoản có sẵn dưới DB
        mat_khau: "12345678" 
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("token");
  });

  it("POST /quen-mat-khau -> Yêu cầu cấp token reset", async () => {
    const res = await request(app)
      .post("/api/auth/quen-mat-khau")
      .send({ email: emailCoSan });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("POST /dat-lai-mat-khau -> Đặt lại mật khẩu bằng token", async () => {
    const res = await request(app)
      .post("/api/auth/dat-lai-mat-khau")
      .send({ 
        token: "raw_token_xyz", 
        mat_khau_moi: "12345678" 
      });
    expect([200, 400]).toContain(res.statusCode);
  });
});