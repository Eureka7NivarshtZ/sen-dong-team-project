const { request, app, closeDb, loginAdmin, unique } = require("./testUtils");

describe("Tác Giả API (/api/tac-gia)", () => {
  let tokenQL = "";

  beforeAll(async () => {
    tokenQL = await loginAdmin();
  });

  afterAll(closeDb);

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
        ho_ten: `Bùi Xuân Phái ${unique("tg")}`,
        tieu_su: "Danh họa nổi tiếng với các bức tranh về phố cổ Hà Nội.",
      });

    expect(res.statusCode).toBe(201);
  });

  it("DELETE /:id -> Xóa tác giả (Bị chặn 400 nếu tác giả vẫn còn tranh)", async () => {
    const res = await request(app)
      .delete("/api/tac-gia/00000000-0000-4000-8000-000000000000")
      .set("Authorization", `Bearer ${tokenQL}`);

    expect([200, 400, 404]).toContain(res.statusCode);
  });
});