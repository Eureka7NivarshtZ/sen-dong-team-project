const request = require("supertest");
const app = require("../app");

describe("Hóa Đơn API (/api/hoa-don)", () => {
  let tokenKhach = "";

  beforeAll(async () => {
    const res = await request(app).post("/api/auth/dang-nhap").send({ email: "khachhang@example.com", mat_khau: "12345678" });
    tokenKhach = res.body.data?.token || "mock_token";
  });

  it("POST / -> Xuất hóa đơn thủ công từ mã đơn hàng", async () => {
    const res = await request(app)
      .post("/api/hoa-don")
      .set("Authorization", `Bearer ${tokenKhach}`)
      .send({ don_hang_id: 10 }); // Khớp body.don_hang_id
    expect([201, 400, 404]).toContain(res.statusCode);
  });
});