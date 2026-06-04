const request = require("supertest");
const app = require("../app");

describe("Dashboard API (/api/dashboard)", () => {
  let tokenQL = "";

  beforeAll(async () => {
    const res = await request(app).post("/api/auth/dang-nhap").send({ email: "admin@example.com", mat_khau: "12345678" });
    tokenQL = res.body.data?.token || "mock_token";
  });

  it("GET / -> Đọc số liệu tổng quan các Card thẻ", async () => {
    const res = await request(app)
      .get("/api/dashboard")
      .set("Authorization", `Bearer ${tokenQL}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("tong_tranh");
    expect(res.body.data).toHaveProperty("tong_doanh_thu");
  });

  it("GET /doanh-thu-theo-thang -> Biểu đồ cột doanh thu", async () => {
    const res = await request(app)
      .get("/api/dashboard/doanh-thu-theo-thang?nam=2026")
      .set("Authorization", `Bearer ${tokenQL}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});