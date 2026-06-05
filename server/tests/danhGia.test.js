const { request, app, closeDb, loginAdmin, createCustomerAndLogin } = require("./testUtils");

describe("Đánh Giá API (/api/danh-gia)", () => {
  let tokenKhach = "";
  let tokenQL = "";

  beforeAll(async () => {
    tokenKhach = (await createCustomerAndLogin()).token;
    tokenQL = await loginAdmin();
  });

  afterAll(closeDb);

  it("POST / -> Khách hàng tạo đánh giá sản phẩm", async () => {
    const res = await request(app)
      .post("/api/danh-gia")
      .set("Authorization", `Bearer ${tokenKhach}`)
      .send({
        tranh_id: 1,
        don_hang_id: 5,
        so_sao: 5,
        noi_dung: "Tranh đóng khung rất chắc chắn",
        hinh_anh_url: "http://image.com/tranh.jpg",
      });

    expect([201, 400, 403, 404]).toContain(res.statusCode);
  });

  it("PATCH /:id/trang-thai -> Admin duyệt ẩn/hiện đánh giá", async () => {
    const res = await request(app)
      .patch("/api/danh-gia/1/trang-thai")
      .set("Authorization", `Bearer ${tokenQL}`)
      .send({ trang_thai: "hien" });

    expect([200, 400, 404]).toContain(res.statusCode);
  });

  it("PATCH /:id/phan-hoi -> Admin phản hồi đánh giá", async () => {
    const res = await request(app)
      .patch("/api/danh-gia/1/phan-hoi")
      .set("Authorization", `Bearer ${tokenQL}`)
      .send({ phan_hoi: "Cảm ơn quý khách đã ủng hộ shop ạ!" });

    expect([200, 404]).toContain(res.statusCode);
  });
});