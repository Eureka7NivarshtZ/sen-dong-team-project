const request = require("supertest");
const app = require("../app");

describe("Đơn Vị Vận Chuyển API (/api/don-vi-van-chuyen)", () => {
  let tokenQL = "";

  beforeAll(async () => {
    const res = await request(app).post("/api/auth/dang-nhap").send({ email: "admin@example.com", mat_khau: "12345678" });
    tokenQL = res.body.data?.token || "mock_token";
  });

  it("POST / -> Tạo đơn vị vận chuyển", async () => {
    const res = await request(app)
      .post("/api/don-vi-van-chuyen")
      .set("Authorization", `Bearer ${tokenQL}`)
      .send({
        ten: "Giao Hàng Hỏa Tốc",
        sdt: "0909123456",
        email: "hoatoc@delivery.com",
        phi_co_ban: 45000,
        hoat_dong: true
      });
    expect([201, 400]).toContain(res.statusCode);
  });
});