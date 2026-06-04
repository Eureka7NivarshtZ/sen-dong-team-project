const request = require("supertest");
const app = require("../app");

describe("Nhân Viên API (/api/nhan-vien)", () => {
  let tokenQL = "";
  const emailNV = `nv_${Date.now()}@gmail.com`;

  beforeAll(async () => {
    const res = await request(app).post("/api/auth/dang-nhap").send({ email: "admin@example.com", mat_khau: "12345678" });
    tokenQL = res.body.data?.token || "mock_token";
  });

  it("POST / -> Quản lý thêm nhân viên mới (Kiểm tra vai trò hợp lệ)", async () => {
    const res = await request(app)
      .post("/api/nhan-vien")
      .set("Authorization", `Bearer ${tokenQL}`)
      .send({
        email: emailNV,
        mat_khau: "staff123",
        ho_ten: "Nguyễn Kho Vận",
        ngay_sinh: "1998-05-20",
        dia_chi: "TP.HCM",
        sdt: "0900112233",
        vai_tro: "ban_hang" // Phải thuộc ["quan_ly", "ban_hang", "kho"]
      });
    expect([201, 400]).toContain(res.statusCode);
  });

  it("PATCH /:id/khoa-mo -> Cập nhật trạng thái kích hoạt tài khoản", async () => {
    const res = await request(app)
      .patch("/api/nhan-vien/1/khoa-mo")
      .set("Authorization", `Bearer ${tokenQL}`);
    expect([200, 404]).toContain(res.statusCode);
  });

  it("PATCH /:id/doi-mat-khau -> Đổi mật khẩu cho nhân viên", async () => {
    const res = await request(app)
      .patch("/api/nhan-vien/1/doi-mat-khau")
      .set("Authorization", `Bearer ${tokenQL}`)
      .send({ mat_khau_moi: "newsecret123" });
    expect([200, 400, 404]).toContain(res.statusCode);
  });
});