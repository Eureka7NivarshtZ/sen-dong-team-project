const request = require("supertest");
const app = require("../app");

describe("Admin Chăm Sóc API (/api/admin/cham-soc)", () => {
  let tokenAdmin = "";

  beforeAll(async () => {
    const res = await request(app).post("/api/auth/dang-nhap").send({ email: "admin@example.com", mat_khau: "12345678" });
    tokenAdmin = res.body.data?.token || "mock_token";
  });

  it("GET / -> Lấy danh sách tin nhắn phía Admin", async () => {
    const res = await request(app)
      .get("/api/admin/cham-soc")
      .set("Authorization", `Bearer ${tokenAdmin}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("POST /:id/tra-loi -> Admin chat phản hồi", async () => {
    const res = await request(app)
      .post("/api/admin/cham-soc/1/tra-loi")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({ noiDungPhanHoi: "Chào bạn, tranh hiện đang còn sẵn tại showroom nhé!" }); // Khớp body
    expect([200, 404]).toContain(res.statusCode);
  });
});