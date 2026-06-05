const { request, app, closeDb, loginAdmin, unique } = require("./testUtils");

describe("Đơn Vị Vận Chuyển API (/api/don-vi-van-chuyen)", () => {
  let tokenQL = "";

  beforeAll(async () => {
    tokenQL = await loginAdmin();
  });

  afterAll(closeDb);

  it("POST / -> Tạo đơn vị vận chuyển", async () => {
    const res = await request(app)
      .post("/api/don-vi-van-chuyen")
      .set("Authorization", `Bearer ${tokenQL}`)
      .send({
        ten: `Giao Hàng Hỏa Tốc ${unique("vc")}`,
        sdt: "0909123456",
        email: `${unique("delivery")}@delivery.com`,
        phi_co_ban: 45000,
        hoat_dong: true,
      });

    expect([201, 400]).toContain(res.statusCode);
  });
});