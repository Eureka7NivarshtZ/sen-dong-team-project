const request = require('supertest');

const BASE_URL = 'http://localhost:5000/api';

describe('🚀 CHUỖI KIỂM THỬ TOÀN DIỆN BACKEND API XƯỞNG TRANH', () => {
  // Biến toàn cục lưu Token và ID phát sinh trong quá trình test
  let adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImY1NDllNDgyLTlmYTItNDgyNi04ZDAzLTI1YWU4OWI5ODU0OSIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJsb2FpIjoibmhhbl92aWVuIiwibmhhbl92aWVuX2lkIjoiNTRjOTMyZDktYWE0OC00OGExLWIyMDUtMWEwMGFjZWJhZTQzIiwidmFpX3RybyI6InF1YW5fbHkiLCJraGFjaF9oYW5nX2lkIjpudWxsLCJpYXQiOjE3Nzk3MTc2MTgsImV4cCI6MTc4MDMyMjQxOH0.bqIkCFqC3UHXXPyQ0jC60hIGtp8lfkkk_4k8Vt1vZfI';
  let customerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMyZDNhMGI0LTg0OTAtNGEyNS1hNmU0LWI5NDU1YjM0YmE2YiIsImVtYWlsIjoia2hhY2hoYW5nMUBleGFtcGxlLmNvbSIsImxvYWkiOiJraGFjaF9oYW5nIiwibmhhbl92aWVuX2lkIjpudWxsLCJ2YWlfdHJvIjpudWxsLCJraGFjaF9oYW5nX2lkIjoiNjk4NTMwY2EtZTM1YS00OGY0LWFmZmItY2QyNmYwYzA2ZjViIiwiaWF0IjoxNzc5NzE3NjQ2LCJleHAiOjE3ODAzMjI0NDZ9.XhN9H2v8EeYkcFfY7Lis55Zo87yio8BdpIpWooNvts77w';
  let danhMucId = 'fb1b22d2-badb-4efb-bb53-a1ae7e8f30a5';
  let tacGiaId = '2a12253b-45d8-4215-b163-c8cdfa57d120';
  let tranhId = 'd6cccb3d-fecb-4a1d-9fab-5069bfd615cd';
  let hinhAnhTranhId = '';
  let donHangId = '';
  let nhaCungCapId = '';
  let vatLieuId = '';

  /* ============================================
     1. AUTHENTICATION TESTS
     ============================================ */
  describe('🔒 1. Xác thực & Phân quyền', () => {
    it('1.1 Đăng nhập tài khoản Admin thành công', async () => {
      const res = await request(BASE_URL)
        .post('/auth/dang-nhap')
        .send({
          email: 'admin@example.com',
          mat_khau: '123456'
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      
      // FIX CHUẨN: Kiểm tra thuộc tính token nằm TRONG res.body.data
      expect(res.body.data).toHaveProperty('token'); 
      adminToken = res.body.data.token; // Lấy chính xác từ data.token
    });

    it('1.2 Đăng ký tài khoản Khách hàng mới', async () => {
      const res = await request(BASE_URL)
        .post('/auth/dang-ky')
        .send({
          email: `khachhang_${Date.now()}@example.com`, 
          mat_khau: '123456',
          ho_ten: 'Nguyễn Văn A',
          sdt: '0901234567',
          dia_chi: '123 Đường ABC, Quận 1, TP HCM'
        });
      
      expect([200, 201]).toContain(res.statusCode);
    });

   it('1.3 Đăng nhập tài khoản Khách hàng thành công', async () => {
      const res = await request(BASE_URL)
        .post('/auth/dang-nhap')
        .send({
          email: 'khachhang1@example.com',
          mat_khau: '123456'
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      // FIX CHUẨN: Lấy token của khách hàng nằm trong data
      expect(res.body.data).toHaveProperty('token');
      customerToken = res.body.data.token; // Lấy chính xác từ data.token
    });

    it('1.4 Xem thông tin cá nhân của Khách hàng với Token hợp lệ', async () => {
      const res = await request(BASE_URL)
        .get('/auth/thong-tin')
        .set('Authorization', `Bearer ${customerToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('email'); // Controller trả về data: taiKhoan
    });
  });

  /* ============================================
     2. DANH MỤC & TÁC GIẢ TESTS
     ============================================ */
  describe('📂 2. Quản lý Danh mục & Tác giả', () => {
    it('2.1 Admin tạo danh mục tranh mới', async () => {
      const res = await request(BASE_URL)
        .post('/danh-muc')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ ten: 'Tranh sơn dầu', cha_id: null });

      expect(res.statusCode).toBe(201);
      expect(res.body.data).toHaveProperty('id'); // ĐÃ SỬA: Lấy từ .data
      danhMucId = res.body.data.id;                // ĐÃ SỬA: Lấy từ .data
    });

    it('2.2 Admin tạo thông tin Tác giả mới', async () => {
      const res = await request(BASE_URL)
        .post('/tac-gia')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ho_ten: 'Pablo Picasso',
          ngay_sinh: '1881-10-25',
          sdt: '0987654321',
          dia_chi: 'Paris, France',
          tieu_su: 'Nhà họa sĩ lừng danh thế giới'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.data).toHaveProperty('id'); // ĐÃ SỬA: Lấy từ .data
      tacGiaId = res.body.data.id;                // ĐÃ SỬA: Lấy từ .data
    });
  });

  /* ============================================
     3. TRANH & HÌNH ẢNH TESTS
     ============================================ */
  describe('🖼️ 3. Quản lý Tranh sản phẩm', () => {
    it('3.1 Admin thêm sản phẩm tranh mới vào hệ thống', async () => {
      const res = await request(BASE_URL)
        .post('/tranh')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ten_tranh: 'Mona Lisa',
          mo_ta: 'Bức tranh nổi tiếng thế giới',
          kich_thuoc: '60x80cm',
          danh_muc_id: danhMucId,
          tac_gia_id: tacGiaId,
          kho_id: null,
          gia_ban: 5000000,
          gia_von: 3000000,
          so_luong_ton: 10,
          trang_thai: 'ban'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id'); // ĐÃ SỬA CHUẨN: Lấy từ .data theo đúng Controller taoTranh
      tranhId = res.body.data.id;                 // ĐÃ SỬA CHUẨN: Lấy từ .data
    });

    it('3.2 Admin thêm hình ảnh đính kèm cho tranh', async () => {
      const res = await request(BASE_URL)
        .post(`/tranh/${tranhId}/hinh-anh`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          url: 'https://example.com/starry-night.jpg',
          la_chinh: true,
          thu_tu: 1
        });

      expect([200, 201]).toContain(res.statusCode);
    });

    it('3.3 Khách hàng tìm kiếm và lọc danh sách tranh công khai', async () => {
      const res = await request(BASE_URL)
        .get(`/tranh?keyword=Mona&danh_muc_id=${danhMucId}&gia_min=1000000`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true); // ĐÃ SỬA: Controller trả về { data: rows }
    });
  });

  /* ============================================
     4. GIỎ HÀNG & ĐƠN HÀNG TESTS
     ============================================ */
  describe('🛒 4. Quy trình Giỏ hàng & Đặt hàng', () => {
    it('4.1 Khách hàng thêm sản phẩm tranh vào giỏ hàng', async () => {
      const res = await request(BASE_URL)
        .post('/gio-hang/them')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          tranh_id: tranhId, // Đảm bảo tranhId lấy từ câu 3.1 hợp lệ
          so_luong: 2
        });

      expect([200, 201]).toContain(res.statusCode);
    });

    it('4.2 Khách hàng kiểm tra và xem giỏ hàng hiện tại', async () => {
      const res = await request(BASE_URL)
        .get('/a')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.statusCode).toBe(200);
    });

    it('4.3 Khách hàng tiến hành tạo đơn hàng (Checkout)', async () => {
      const res = await request(BASE_URL)
        .post('/don-hang/tao')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          dia_chi_giao: '456 Đường XYZ, Quận 2, TP HCM',
          don_vi_van_chuyen_id: '1', 
          ghi_chu: 'Giao giờ hành chính'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.data).toHaveProperty('id'); // ĐÃ SỬA: Lấy từ .data
      donHangId = res.body.data.id;                // ĐÃ SỬA: Lấy từ .data
    });

    it('4.4 Admin cập nhật trạng thái đơn hàng sang "đang chuẩn bị"', async () => {
      if(!donHangId) return; // Tránh lỗi crash nếu bước trên tạch
      const res = await request(BASE_URL)
        .put(`/don-hang/${donHangId}/trang-thai`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          trang_thai: 'dang_chuan_bi'
        });

      expect(res.statusCode).toBe(200);
    });
  });

  /* ============================================
     5. NHÀ CUNG CẤP & VẬT LIỆU (BACKOFFICE)
     ============================================ */
  describe('📦 5. Quản lý Kho, Nhà cung cấp & Vật liệu', () => {
    it('5.1 Admin tạo Nhà cung cấp họa cụ mới', async () => {
      const res = await request(BASE_URL)
        .post('/nha-cung-cap')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ten: 'Công ty Mỹ Thuật ABC',
          sdt: '0909123456',
          email: 'abc@example.com',
          dia_chi: 'Quận 1, TP.HCM',
          loai: 'ca_hai'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.data).toHaveProperty('id'); // ĐÃ SỬA: Lấy từ .data
      nhaCungCapId = res.body.data.id;            // ĐÃ SỬA: Lấy từ .data
    });

    it('5.2 Admin thêm loại Vật liệu mới cần quản lý tồn kho', async () => {
      const res = await request(BASE_URL)
        .post('/vat-lieu')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nha_cung_cap_id: nhaCungCapId,
          ten: 'Sơn dầu màu đỏ hỏa long',
          loai: 'Sơn dầu',
          don_vi: 'tuýp',
          gia_nhap: 50000,
          so_luong_ton: 0,
          muc_canh_bao: 10
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.data).toHaveProperty('id'); // ĐÃ SỬA: Lấy từ .data
      vatLieuId = res.body.data.id;               // ĐÃ SỬA: Lấy từ .data
    });

    it('5.3 Admin truy xuất danh sách vật liệu sắp hết (Cảnh báo tồn kho)', async () => {
      const res = await request(BASE_URL)
        .get('/vat-lieu/canh-bao')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      // Nếu API trả về dạng thông thường bọc trong data, kiểm tra res.body.data
      const dataList = res.body.data || res.body;
      expect(Array.isArray(dataList)).toBe(true);
    });
  });
});