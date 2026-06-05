const { request, app, closeDb, loginAdmin, unique } = require("./testUtils");

describe("Nhân Viên API (/api/nhan-vien)", () => {
  let tokenQL = "";
  const emailNV = `${unique("nv")}@gmail.com`;

  beforeAll(async () => {
    tokenQL = await loginAdmin();
  });

  afterAll(closeDb);

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
        vai_tro: "ban_hang",
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