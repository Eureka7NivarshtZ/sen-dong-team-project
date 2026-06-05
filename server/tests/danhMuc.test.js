const { request, app, closeDb, loginAdmin, unique } = require("./testUtils");

describe("Danh Mục API (/api/danh-muc)", () => {
  let tokenQL = "";

  beforeAll(async () => {
    tokenQL = await loginAdmin();
  });

  afterAll(closeDb);

  it("POST / -> Thêm danh mục mới", async () => {
    const res = await request(app)
      .post("/api/danh-muc")
      .set("Authorization", `Bearer ${tokenQL}`)
      .send({ ten: `Tranh Canvas Hiện Đại ${unique("dm")}` });

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