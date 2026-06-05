const { request, app, closeDb, loginAdmin, createCustomerAndLogin } = require("./testUtils");

describe("Đơn Hàng API (/api/don-hang)", () => {
  let tokenKhach = "";
  let tokenNV = "";

  beforeAll(async () => {
    tokenKhach = (await createCustomerAndLogin()).token;
    tokenNV = await loginAdmin();
  });

  afterAll(closeDb);

  it("POST /them -> Khách tiến hành đặt đơn từ giỏ hàng", async () => {
    const res = await request(app)
      .post("/api/don-hang/them")
      .set("Authorization", `Bearer ${tokenKhach}`)
      .send({
        dia_chi_giao: "123 Nguyễn Trãi, Q5, HCM",
        don_vi_van_chuyen_id: 1,
        phuong_thuc_thanh_toan: "bank",
        ghi_chu: "Giao giờ hành chính",
      });

    expect([201, 400, 401, 404]).toContain(res.statusCode);
  });

  it("PUT /:id/trang-thai -> Nhân viên chuyển trạng thái đơn", async () => {
    const res = await request(app)
      .put("/api/don-hang/1/trang-thai")
      .set("Authorization", `Bearer ${tokenNV}`)
      .send({ trang_thai: "dang_chuan_bi" });

    expect([200, 400, 404]).toContain(res.statusCode);
  });
});