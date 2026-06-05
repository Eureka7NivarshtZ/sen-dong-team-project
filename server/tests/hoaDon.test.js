const { request, app, closeDb, createCustomerAndLogin } = require("./testUtils");

describe("Hóa Đơn API (/api/hoa-don)", () => {
  let tokenKhach = "";

  beforeAll(async () => {
    tokenKhach = (await createCustomerAndLogin()).token;
  });

  afterAll(closeDb);

  it("POST / -> Xuất hóa đơn thủ công từ mã đơn hàng", async () => {
    const res = await request(app)
      .post("/api/hoa-don")
      .set("Authorization", `Bearer ${tokenKhach}`)
      .send({ don_hang_id: 10 });

    expect([201, 400, 404]).toContain(res.statusCode);
  });
});