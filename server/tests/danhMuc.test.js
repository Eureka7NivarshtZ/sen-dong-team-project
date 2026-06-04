const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models"); // 1. THÊM DÒNG NÀY ĐỂ LẤY KẾT NỐI DB

describe("Danh Mục API (/api/danh-muc)", () => {
  let tokenQL = "";

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/auth/dang-nhap")
      .send({ email: "admin@example.com", mat_khau: "12345678" });
    tokenQL = res.body.data?.token || "mock_token";
  });

  // 2. THÊM ĐOẠN NÀY ĐỂ ĐÓNG CỔNG KẾT NỐI KHI TEST XONG
  afterAll(async () => {
    if (sequelize) {
      await sequelize.close();
    }
  });

  it("POST / -> Thêm danh mục mới", async () => {
    const res = await request(app)
      .post("/api/danh-muc")
      .set("Authorization", `Bearer ${tokenQL}`)
      // Sử dụng dấu huyền `` và Date.now() để tên danh mục KHÔNG BAO GIỜ bị trùng khi chạy lại test
      .send({ ten: `Tranh Canvas Hiện Đại ${Date.now()}` }); 

    // 💡 Thêm dòng này để nếu có lỗi 500, terminal sẽ in ra thông báo lỗi chi tiết của MySQL/Sequelize
    if (res.statusCode === 500) {
      console.log("❌ LỖI CHI TIẾT TỪ SERVER:", res.body);
    }

    expect([201, 400]).toContain(res.statusCode);
  });

  it("PUT /:id -> Cập nhật tên danh mục", async () => {
    const res = await request(app)
      .put("/api/danh-muc/1")
      .set("Authorization", `Bearer ${tokenQL}`)
      .send({ ten: "Tranh Thủy Mặc Đồ Họa" });
    expect([200, 404]).toContain(res.statusCode);
  });
});