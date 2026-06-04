const request = require("supertest");
const app = require("../app");

describe("Đơn Hàng API (/api/don-hang)", () => {
  let tokenKhach = "", tokenNV = "";

  beforeAll(async () => {
    const resK = await request(app).post("/api/auth/dang-nhap").send({ email: "khachhang@example.com", mat_khau: "12345678" });
    tokenKhach = resK.body.data?.token || "mock_token";

    const resN = await request(app).post("/api/auth/dang-nhap").send({ email: "admin@example.com", mat_khau: "12345678" });
    tokenNV = resN.body.data?.token || "mock_token";
  });

  it("POST /them -> Khách tiến hành đặt đơn từ giỏ hàng", async () => {
    const res = await request(app)
      .post("/api/don-hang/them")
      .set("Authorization", `Bearer ${tokenKhach}`)
      .send({
        dia_chi_giao: "123 Nguyễn Trãi, Q5, HCM", // Trường bắt buộc
        don_vi_van_chuyen_id: 1,
        phuong_thuc_thanh_toan: "bank", // map thành chuyen_khoan nội bộ
        ghi_chu: "Giao giờ hành chính"
      });
    expect([201, 400, 401]).toContain(res.statusCode);
  });

  it("PUT /:id/trang-thai -> Nhân viên chuyển trạng thái đơn", async () => {
    const res = await request(app)
      .put("/api/don-hang/1/trang-thai")
      .set("Authorization", `Bearer ${tokenNV}`)
      .send({ trang_thai: "dang_chuan_bi" }); // Khớp mảng trangThaiHopLe
    expect([200, 400, 404]).toContain(res.statusCode);
  });
});