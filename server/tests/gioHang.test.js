const { request, app, closeDb, createCustomerAndLogin } = require("./testUtils");

describe("Giỏ Hàng API (/api/gio-hang)", () => {
  let tokenKhach = "";

  beforeAll(async () => {
    tokenKhach = (await createCustomerAndLogin()).token;
  });

  afterAll(closeDb);

  it("POST /them -> Thêm tranh kèm số lượng vào giỏ", async () => {
    const res = await request(app)
      .post("/api/gio-hang/them")
      .set("Authorization", `Bearer ${tokenKhach}`)
      .send({
        tranh_id: "00000000-0000-4000-8000-000000000000",
        so_luong: 2,
      });

    expect([200, 400, 404]).toContain(res.statusCode);
  });

  it("PUT /:id -> Thay đổi số lượng tăng/giảm trong giỏ", async () => {
    const res = await request(app)
      .put("/api/gio-hang/1")
      .set("Authorization", `Bearer ${tokenKhach}`)
      .send({ so_luong: 5 });

    expect([200, 400, 404]).toContain(res.statusCode);
  });
});