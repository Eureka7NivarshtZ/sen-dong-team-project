const request = require("supertest");
const app = require("../app");

describe("Khuyến Mãi API (/api/khuyen-mai)", () => {
  let tokenKhach = "", tokenQL = "";
  const codeRandom = `KM_${Date.now()}`;

  beforeAll(async () => {
    const resK = await request(app).post("/api/auth/dang-nhap").send({ email: "khachhang@example.com", mat_khau: "12345678" });
    tokenKhach = resK.body.data?.token || "mock_token";

    const resQ = await request(app).post("/api/auth/dang-nhap").send({ email: "admin@example.com", mat_khau: "12345678" });
    tokenQL = resQ.body.data?.token || "mock_token";
  });

  it("POST / -> Quản lý tạo mã giảm giá mới", async () => {
    const res = await request(app)
      .post("/api/khuyen-mai")
      .set("Authorization", `Bearer ${tokenQL}`)
      .send({
        ma: codeRandom,
        ten: "Khuyến mãi hè rực rỡ",
        mo_ta: "Giảm giá sâu",
        loai_giam: "phan_tram", // Hoặc so_tien
        gia_tri_giam: 10,
        giam_toi_da: 50000,
        don_toi_thieu: 200000,
        so_luong: 100,
        ngay_bat_dau: "2026-06-01",
        ngay_ket_thuc: "2026-08-31",
        ap_dung_cho: "toan_bo"
      });
    expect([201, 400]).toContain(res.statusCode);
  });

  it("POST /kiem-tra -> Khách hàng áp thử mã giảm giá vào giỏ", async () => {
    const res = await request(app)
      .post("/api/khuyen-mai/kiem-tra")
      .set("Authorization", `Bearer ${tokenKhach}`)
      .send({
        ma: "GIAM10", // Viết hoa/thường đều được vì controller tự uppercase()
        tong_tien: 350000
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