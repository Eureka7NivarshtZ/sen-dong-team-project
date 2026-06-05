const { request, app, closeDb, unique, randomPhone } = require("./testUtils");

describe("Auth API (/api/auth)", () => {
  const emailDangKyMoi = `${unique("auth")}@example.com`;
  const matKhau = "12345678";

  afterAll(closeDb);

  it("POST /dang-ky -> Đăng ký khách hàng mới", async () => {
    const res = await request(app)
      .post("/api/auth/dang-ky")
      .send({
        email: emailDangKyMoi,
        mat_khau: matKhau,
        ho_ten: "Phùng Thanh Bộ",
        sdt: randomPhone(),
        dia_chi: "Hà Nội",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  }, 15000);

  it("POST /dang-nhap -> Đăng nhập hệ thống bằng tài khoản vừa đăng ký", async () => {
    const res = await request(app)
      .post("/api/auth/dang-nhap")
      .send({
        email: emailDangKyMoi,
        mat_khau: matKhau,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("token");
  });

  it("POST /quen-mat-khau -> Yêu cầu cấp token reset", async () => {
    const res = await request(app)
      .post("/api/auth/quen-mat-khau")
      .send({ email: emailDangKyMoi });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("POST /dat-lai-mat-khau -> Đặt lại mật khẩu bằng token không hợp lệ", async () => {
    const res = await request(app)
      .post("/api/auth/dat-lai-mat-khau")
      .send({
        token: "raw_token_xyz",
        mat_khau_moi: "12345678",
      });

    expect([200, 400]).toContain(res.statusCode);
  });
});