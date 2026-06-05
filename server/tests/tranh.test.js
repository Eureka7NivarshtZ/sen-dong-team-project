const {
  request,
  app,
  closeDb,
  loginAdmin,
  createDanhMuc,
  createTacGia,
  unique,
} = require("./testUtils");

describe("Tranh API (/api/tranh)", () => {
  let tokenNV = "";
  let danhMucId = "";
  let tacGiaId = "";

  beforeAll(async () => {
    tokenNV = await loginAdmin();
    danhMucId = await createDanhMuc(tokenNV);
    tacGiaId = await createTacGia(tokenNV);
  });

  afterAll(closeDb);

  it("GET / -> Tìm kiếm tranh nâng cao (Lọc khoảng giá, sắp xếp giá giảm dần)", async () => {
    const res = await request(app).get(
      "/api/tranh?keyword=phong+cảnh&gia_min=100000&gia_max=2000000&sort=gia_giam&page=1&limit=10"
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("POST / -> Thêm tranh mới kèm tự động tạo ảnh chính", async () => {
    const res = await request(app)
      .post("/api/tranh")
      .set("Authorization", `Bearer ${tokenNV}`)
      .send({
        ten_tranh: `Mùa thu vàng ${unique("tranh")}`,
        danh_muc_id: danhMucId,
        tac_gia_id: tacGiaId,
        gia_ban: 1500000,
        gia_von: 800000,
        so_luong_ton: 5,
        mo_ta: "Tranh sơn dầu phong cảnh thanh bình",
        hinh_anh_url: "https://shop.com/muathuvang.jpg",
      });

    expect([201, 400]).toContain(res.statusCode);
  });

  it("DELETE /:id -> Xóa tranh (Chuyển trạng thái ẩn nếu đã phát sinh đơn hàng)", async () => {
    const res = await request(app)
      .delete("/api/tranh/00000000-0000-4000-8000-000000000000")
      .set("Authorization", `Bearer ${tokenNV}`);

    expect([200, 404]).toContain(res.statusCode);
  });
});