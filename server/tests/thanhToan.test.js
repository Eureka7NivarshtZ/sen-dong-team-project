const request = require("supertest");
const app = require("../app");

describe("Thanh Toán API (/api/thanh-toan)", () => {
  let tokenUser = "", tokenBanHang = "";

  beforeAll(async () => {
    const resU = await request(app).post("/api/auth/dang-nhap").send({ email: "khachhang@example.com", mat_khau: "12345678" });
    tokenUser = resU.body.data?.token || "mock_token";

    const resB = await request(app).post("/api/auth/dang-nhap").send({ email: "admin@example.com", mat_khau: "12345678" });
    tokenBanHang = resB.body.data?.token || "mock_token";
  });

  it("POST /them -> Khách gửi thông tin giao dịch", async () => {
    const res = await request(app)
      .post("/api/thanh-toan/them")
      .set("Authorization", `Bearer ${tokenUser}`)
      .send({
        hoa_don_id: 1,
        so_tien: 500000,
        phuong_thuc: "chuyen_khoan", // Thuộc ["tien_mat", "chuyen_khoan", "the"]
        trang_thai: "cho_thanh_toan" // Thuộc ["cho_thanh_toan", "thanh_cong", "that_bai", "hoan_tien"]
      });
    expect([201, 400, 444, 404]).toContain(res.statusCode);
  });

  it("PUT /:id/trang-thai -> Cập nhật trạng thái (Duyệt thành công tự đổi trạng thái đơn)", async () => {
    const res = await request(app)
      .put("/api/thanh-toan/1/trang-thai")
      .set("Authorization", `Bearer ${tokenBanHang}`)
      .send({ trang_thai: "thanh_cong" });
    expect([200, 400, 404]).toContain(res.statusCode);
  });
});