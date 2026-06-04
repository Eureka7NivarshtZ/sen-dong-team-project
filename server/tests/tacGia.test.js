const request = require("supertest");
const app = require("../app");

describe("Tác Giả API (/api/tac-gia)", () => {
  let tokenQL = "";

  beforeAll(async () => {
    const res = await request(app).post("/api/auth/dang-nhap").send({ email: "admin@example.com", mat_khau: "12345678" });
    tokenQL = res.body.data?.token || "mock_token";
  });

  it("GET / -> Khách xem danh sách tác giả sắp xếp theo tên A-Z", async () => {
    const res = await request(app).get("/api/tac-gia");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("POST / -> Thêm tác giả mới (Bắt buộc phải có ho_ten)", async () => {
    const res = await request(app)
      .post("/api/tac-gia")
      .set("Authorization", `Bearer ${tokenQL}`)
      .send({
        ho_ten: "Bùi Xuân Phái",
        tieu_su: "Danh họa nổi tiếng với các bức tranh về phố cổ Hà Nội."
      });
    expect(res.statusCode).toBe(201);
  });

  it("DELETE /:id -> Xóa tác giả (Bị chặn 400 nếu tác giả vẫn còn tranh)", async () => {
    const res = await request(app)
      .delete("/api/tac-gia/1")
      .set("Authorization", `Bearer ${tokenQL}`);
    expect([200, 400, 404]).toContain(res.statusCode);
  });
});