const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models"); // Import để đóng connection

describe("Chăm Sóc Khách Hàng API (/api/cham-soc-khach-hang)", () => {
  let tokenKhach = "";

  beforeAll(async () => {
    // Đăng nhập tài khoản Khách hàng mẫu
    const res = await request(app)
      .post("/api/auth/dang-nhap")
      .send({ email: "khachhang@example.com", mat_khau: "12345678" });
    
    // BỘ CHẨN ĐOÁN LUỒNG KHÁCH HÀNG
    if (!res.body.success) {
      console.log("🚨 LỖI ĐĂNG NHẬP KHÁCH HÀNG PHÍA DB:", res.body.error);
    }
    tokenKhach = res.body.data?.token;
  });

  // Đóng connection kết nối DB
  afterAll(async () => {
    if (sequelize) {
      await sequelize.close();
    }
  });

  it("POST /gui -> Gửi tin nhắn mới (Khởi tạo phòng chat)", async () => {
    const res = await request(app)
      .post("/api/cham-soc-khach-hang/gui")
      .send({
        chu_de: "Hỏi về giá tranh",
        noi_dung: "Bức Đêm Đầy Sao còn hàng không shop?",
        ho_ten: "Nguyễn Văn Đạt",
        email: "dat@gmail.com"
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("POST /:id/user-tra-loi -> Khách hàng nhắn tiếp vào phòng cũ", async () => {
    const res = await request(app)
      .post("/api/cham-soc-khach-hang/1/user-tra-loi")
      .set("Authorization", `Bearer ${tokenKhach}`)
      .send({ message: "Rep e với shop ơi" });
    expect([200, 404]).toContain(res.statusCode);
  });
});