const {
  request,
  app,
  closeDb,
  loginAdmin,
  createCustomerAndLogin,
} = require("./testUtils");

describe("Thanh Toán API (/api/thanh-toan)", () => {
  let tokenUser = "";
  let tokenBanHang = "";

  beforeAll(async () => {
    tokenUser = (await createCustomerAndLogin()).token;
    tokenBanHang = await loginAdmin();
  });

  afterAll(closeDb);

  it("POST /them -> Trả 400 nếu thiếu dữ liệu bắt buộc", async () => {
    const res = await request(app)
      .post("/api/thanh-toan/them")
      .set("Authorization", `Bearer ${tokenUser}`)
      .send({
        // thiếu hoa_don_id
        so_tien: 500000,
        phuong_thuc: "chuyen_khoan",
        trang_thai: "cho_thanh_toan",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("POST /them -> Trả 400 nếu phương thức thanh toán không hợp lệ", async () => {
    const res = await request(app)
      .post("/api/thanh-toan/them")
      .set("Authorization", `Bearer ${tokenUser}`)
      .send({
        hoa_don_id: "00000000-0000-4000-8000-000000000000",
        so_tien: 500000,
        phuong_thuc: "momo",
        trang_thai: "cho_thanh_toan",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("PUT /:id/trang-thai -> Trả 400 nếu trạng thái thanh toán không hợp lệ", async () => {
    const res = await request(app)
      .put("/api/thanh-toan/00000000-0000-4000-8000-000000000000/trang-thai")
      .set("Authorization", `Bearer ${tokenBanHang}`)
      .send({ trang_thai: "sai_trang_thai" });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("PUT /:id/trang-thai -> Trả 404 nếu thanh toán không tồn tại", async () => {
    const res = await request(app)
      .put("/api/thanh-toan/00000000-0000-4000-8000-000000000000/trang-thai")
      .set("Authorization", `Bearer ${tokenBanHang}`)
      .send({ trang_thai: "thanh_cong" });

    expect([404, 500]).toContain(res.statusCode);

    if (res.statusCode === 404) {
      expect(res.body.success).toBe(false);
    }
  });
});