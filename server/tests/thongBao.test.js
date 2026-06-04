const request = require("supertest");
const app = require("../app");

describe("Thông Báo API (/api/thong-bao)", () => {
  let tokenUser = "";

  beforeAll(async () => {
    const res = await request(app).post("/api/auth/dang-nhap").send({ email: "admin@example.com", mat_khau: "12345678" });
    tokenUser = res.body.data?.token || "mock_token";
  });

  it("GET /dem-chua-doc -> Đếm số lượng thông báo mới chưa xem", async () => {
    const res = await request(app)
      .get("/api/thong-bao/dem-chua-doc")
      .set("Authorization", `Bearer ${tokenUser}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("total"); // Cấu trúc { total } của hàm demThongBaoChuaDoc
  });

  it("PATCH /:id/doc -> Đánh dấu đã đọc một thông báo", async () => {
    const res = await request(app)
      .patch("/api/thong-bao/1/doc")
      .set("Authorization", `Bearer ${tokenUser}`);
    expect([200, 404]).toContain(res.statusCode);
  });
});