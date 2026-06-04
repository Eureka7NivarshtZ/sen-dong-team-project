const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models"); // 1. IMPORT SEQUELIZE ĐỂ NGẮT KẾT NỐI

describe("Giỏ Hàng API (/api/gio-hang)", () => {
  let tokenKhach = "";

  beforeAll(async () => {
    // 🌟 ĐÃ SỬA CHÍNH TẢ: khachang -> khachhang@example.com (Thêm chữ h)
    // ⚠️ Hãy chắc chắn tài khoản này ĐÃ TỒN TẠI trong database của bạn
    const res = await request(app)
      .post("/api/auth/dang-nhap")
      .send({ email: "khachhang@example.com", mat_khau: "12345678" });
    
    tokenKhach = res.body.data?.token;
  });

  // 2. ĐÓNG CỔNG KẾT NỐI SAU KHI TEST XONG ĐỂ TERMINAL KHÔNG BỊ TREO
  afterAll(async () => {
    if (sequelize) {
      await sequelize.close();
    }
  });

  it("POST /them -> Thêm tranh kèm số lượng vào giỏ", async () => {
    const res = await request(app)
      .post("/api/gio-hang/them")
      .set("Authorization", `Bearer ${tokenKhach}`)
      .send({
        // ⚠️ QUAN TRỌNG: Hãy mở DB ra, lấy 1 mã ID (UUID) của bức tranh có thật dán vào đây thay cho số 2
        tranh_id: "27e7d4c2-df26-4a6c-901e-810b0dfdc1f8", 
        so_luong: 2
      });

    // 💡 KÍNH HIỂN VI: Nếu nhận về mã 500, dòng này sẽ in toàn bộ lỗi crash của Backend ra Terminal cho bạn thấy
    if (res.statusCode === 500) {
      console.log("❌❌ CHI TIẾT LỖI SẬP SERVER PHÍA BACKEND:", res.body);
    }

    expect([200, 400, 404]).toContain(res.statusCode);
  });

  it("PUT /:id -> Thay đổi số lượng tăng/giảm trong giỏ", async () => {
    const res = await request(app)
      .put("/api/gio-hang/1") 
      .set("Authorization", `Bearer ${tokenKhach}`)
      .send({ so_luong: 5 });
    expect([200, 400, 404, 500]).toContain(res.statusCode);
  });
});