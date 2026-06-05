const { request, app, closeDb, loginAdmin } = require("./testUtils");

describe("Thông Báo API (/api/thong-bao)", () => {
  let tokenUser = "";

  beforeAll(async () => {
    tokenUser = await loginAdmin();
  });

  afterAll(closeDb);

  it("GET /dem-chua-doc -> Đếm số lượng thông báo mới chưa xem", async () => {
    const res = await request(app)
      .get("/api/thong-bao/dem-chua-doc")
      .set("Authorization", `Bearer ${tokenUser}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("total");
  });

  it("PATCH /:id/doc -> Đánh dấu đã đọc một thông báo", async () => {
    const res = await request(app)
      .patch("/api/thong-bao/1/doc")
      .set("Authorization", `Bearer ${tokenUser}`);

    expect([200, 404]).toContain(res.statusCode);
  });
});