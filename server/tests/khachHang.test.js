const { request, app, closeDb, loginAdmin } = require("./testUtils");

describe("Khách Hàng API (/api/khach-hang)", () => {
  let tokenNV = "";
  let tokenQL = "";
  const uuidKhachHangKhongTonTai = "00000000-0000-4000-8000-000000000000";

  beforeAll(async () => {
    tokenNV = await loginAdmin();
    tokenQL = tokenNV;
  });

  afterAll(closeDb);

  it("GET / -> Nhân viên tìm kiếm khách hàng bằng tên/sđt kèm phân trang", async () => {
    const res = await request(app)
      .get("/api/khach-hang?search=Nguyễn&page=1&limit=5")
      .set("Authorization", `Bearer ${tokenNV}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty("total");
    expect(res.body.page).toBe(1);
  });

  it("GET /:id -> Xem chi tiết khách hàng bất kỳ", async () => {
    const res = await request(app)
      .get(`/api/khach-hang/${uuidKhachHangKhongTonTai}`)
      .set("Authorization", `Bearer ${tokenNV}`);

    expect([200, 404]).toContain(res.statusCode);
  });

  it("PUT /:id/khoa -> Quản lý khóa tài khoản của khách hàng", async () => {
    const res = await request(app)
      .put(`/api/khach-hang/${uuidKhachHangKhongTonTai}/khoa`)
      .set("Authorization", `Bearer ${tokenQL}`);

    expect([200, 404]).toContain(res.statusCode);
  });
});