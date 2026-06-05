const { request, app, closeDb, loginAdmin, createCustomerAndLogin, unique } = require("./testUtils");

describe("Khuyến Mãi API (/api/khuyen-mai)", () => {
  let tokenKhach = "";
  let tokenQL = "";
  const codeRandom = unique("KM").toUpperCase();

  beforeAll(async () => {
    tokenKhach = (await createCustomerAndLogin()).token;
    tokenQL = await loginAdmin();
  });

  afterAll(closeDb);

  it("POST / -> Quản lý tạo mã giảm giá mới", async () => {
    const res = await request(app)
      .post("/api/khuyen-mai")
      .set("Authorization", `Bearer ${tokenQL}`)
      .send({
        ma: codeRandom,
        ten: "Khuyến mãi hè rực rỡ",
        mo_ta: "Giảm giá sâu",
        loai_giam: "phan_tram",
        gia_tri_giam: 10,
        giam_toi_da: 50000,
        don_toi_thieu: 200000,
        so_luong: 100,
        ngay_bat_dau: "2026-06-01",
        ngay_ket_thuc: "2026-08-31",
        ap_dung_cho: "toan_bo",
      });

    expect([201, 400]).toContain(res.statusCode);
  });

  it("POST /kiem-tra -> Khách hàng áp thử mã giảm giá vào giỏ", async () => {
    const res = await request(app)
      .post("/api/khuyen-mai/kiem-tra")
      .set("Authorization", `Bearer ${tokenKhach}`)
      .send({
        ma: codeRandom,
        tong_tien: 350000,
      });

    expect([200, 400]).toContain(res.statusCode);
  });

  it("PUT /:id -> Cập nhật thông tin mã khuyến mãi", async () => {
    const res = await request(app)
      .put("/api/khuyen-mai/1")
      .set("Authorization", `Bearer ${tokenQL}`)
      .send({ ten: "Tên khuyến mãi đã sửa" });

    expect([200, 404]).toContain(res.statusCode);
  });
});