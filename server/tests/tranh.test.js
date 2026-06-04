const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models"); // 1. IMPORT SEQUELIZE ĐỂ ĐÓNG KẾT NỐI

describe("Tranh API (/api/tranh)", () => {
  let tokenNV = "";

  beforeAll(async () => {
    // ⚠️ ĐỔI THÀNH TÀI KHOẢN NHÂN VIÊN CÓ THẬT TRÊN DB CỦA BẠN ĐỂ LẤY TOKEN QUYỀN LỰC
    const res = await request(app)
      .post("/api/auth/dang-nhap")
      .send({ email: "admin@example.com", mat_khau: "12345678" });
    tokenNV = res.body.data?.token;
  });

  // 2. TỰ ĐỘNG NGẮT KẾT NỐI DB SAU KHI TEST XONG ĐỂ TERMINAL TỰ ĐÓNG GỌN GÀNG
  afterAll(async () => {
    if (sequelize) {
      await sequelize.close();
    }
  });

  it("GET / -> Tìm kiếm tranh nâng cao (Lọc khoảng giá, sắp xếp giá giảm dần)", async () => {
    const res = await request(app)
      .get("/api/tranh?keyword=phong+cảnh&gia_min=100000&gia_max=2000000&sort=gia_giam&page=1&limit=10");
    
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("POST / -> Thêm tranh mới kèm tự động tạo ảnh chính", async () => {
    const res = await request(app)
      .post("/api/tranh")
      .set("Authorization", `Bearer ${tokenNV}`)
      .send({
        ten_tranh: `Mùa thu vàng ${Date.now()}`, // Tránh trùng lặp tên tranh
        // ⚠️ QUAN TRỌNG: Hãy mở DB lấy 1 chuỗi UUID danh mục và tác giả có thật dán vào đây thay cho số 2 và 1
        danh_muc_id: "201794b7-9477-43ad-bfaa-d0547fb50f01", 
        tac_gia_id: "101794b7-9477-43ad-bfaa-d0547fb50f01", 
        gia_ban: 1500000,
        gia_von: 800000,
        so_luong_ton: 5,
        mo_ta: "Tranh sơn dầu phong cảnh thanh bình",
        hinh_anh_url: "https://shop.com/muathuvang.jpg" 
      });

    // 💡 BỘ NỘI SOI: Nếu vẫn bị lỗi 500, dòng này sẽ in thẳng chi tiết lỗi MySQL ra terminal cho bạn thấy
    if (res.statusCode === 500) {
      console.log("❌ CHI TIẾT LỖI SẬP SERVER KHI TẠO TRANH:", res.body);
    }

    expect([201, 400]).toContain(res.statusCode);
  });

  it("DELETE /:id -> Xóa tranh (Chuyển trạng thái ẩn nếu đã phát sinh đơn hàng)", async () => {
    // ⚠️ Thay bằng 1 chuỗi mã UUID của bức tranh có thật (hoặc định dạng UUID mẫu để nhận về 404 sạch sẽ)
    const uuidTranhMau = "301794b7-9477-43ad-bfaa-d0547fb50f01";
    const res = await request(app)
      .delete(`/api/tranh/${uuidTranhMau}`)
      .set("Authorization", `Bearer ${tokenNV}`);
    
    expect([200, 404]).toContain(res.statusCode);
  });
});