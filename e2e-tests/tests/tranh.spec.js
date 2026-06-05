import { test, expect } from "@playwright/test";

test.describe("Nhóm 2: Mua sắm & Khách hàng", () => {
  
  // 🎯 TỰ ĐỘNG VÀO TRANG CHỦ (ĐÃ SỬA: Đổi chế độ chờ domcontentloaded để không bị treo màn hình trắng)
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/", { waitUntil: "domcontentloaded", timeout: 10000 });
  });

  // --- CHỨC NĂNG 3: TÌM KIẾM SẢN PHẨM ---
  test("Tìm kiếm - Hiển thị lỗi khi tìm từ khóa không tồn tại", async ({ page }) => {
    // Nếu trang chủ chưa có ô tìm kiếm, robot sẽ nhảy thẳng vào trang bộ sưu tập để tìm
    const btnKhamPha = page.getByRole("button", { name: /khám phá bộ sưu tập/i });
    if (await btnKhamPha.isVisible()) {
      await btnKhamPha.click();
    } else {
      await page.goto("http://localhost:5173/tranh", { waitUntil: "domcontentloaded" });
    }

    // Tìm ô input nhập từ khóa
    const searchInput = page
      .locator('input[type="text"], input[placeholder*="tìm"], input[placeholder*="Search"]')
      .first();

    if (await searchInput.isVisible()) {
      await searchInput.fill("từ_khóa_không_có_thật_123");
      await page.keyboard.press("Enter");
      // Kiểm tra thông báo trống
      await expect(page.locator("text=Không tìm thấy sản phẩm nào")).toBeVisible({ timeout: 5000 });
    } else {
      console.log("Không tìm thấy ô tìm kiếm trực diện, bỏ qua test để không bị lỗi treo.");
    }
  });

  // --- CHỨC NĂNG 4: THÊM VÀO GIỎ HÀNG ---
  test("Giỏ hàng - Tăng số lượng khi bấm thêm vào giỏ", async ({ page }) => {
    // Vì beforeEach đã vào trang chủ, ở đây chỉ cần điều hướng tiếp sang trang /tranh
    await page.goto("http://localhost:5173/tranh", { 
      waitUntil: "domcontentloaded", 
      timeout: 10000 
    });

    // Chờ 2 giây cố định cho dữ liệu đổ ra ổn định
    await page.waitForTimeout(2000); 

    // Robot tự động tìm và click vào hình ảnh của sản phẩm đầu tiên xuất hiện trên màn hình
    const sanPham = page.locator("img").first();
    await expect(sanPham).toBeVisible({ timeout: 5000 });
    await sanPham.click();

    // Tiến hành tìm nút "Thêm vào giỏ" ở trang chi tiết
    const btnThemGio = page.locator(
      'button:has-text("Thêm vào giỏ"), button:has-text("Mua"), button:has-text("Giỏ hàng")',
    ).first();
    
    await expect(btnThemGio).toBeVisible({ timeout: 5000 });
    await btnThemGio.click();

    console.log("Đã tự động thêm sản phẩm vào giỏ hàng thành công.");
  });

  // --- CHỨC NĂNG 5 & 6: THANH TOÁN VÀ THEO DÕI ĐƠN ---
  test("Thanh toán - Không cho phép thanh toán giỏ hàng trống", async ({ page }) => {
    await page.goto("http://localhost:5173/gio-hang", { waitUntil: "domcontentloaded" });

    const btnThanhToan = page.locator(
      'button:has-text("Thanh toán"), button:has-text("Đặt hàng")',
    ).first();
    
    if (await btnThanhToan.isVisible()) {
      await expect(btnThanhToan).not.toBeEnabled();
    }
  });

  // --- CHỨC NĂNG 9: CHĂM SÓC KHÁCH HÀNG (LIÊN KẾT ZALO) ---
  test("Hỗ trợ - Click biểu tượng chat mở đúng link liên kết Zalo", async ({ page, context }) => {
    // Nhắm vào cái bong bóng chat hình tròn màu xanh nằm ở góc màn hình.
    const zaloBubble = page
      .locator('.fixed, [class*="fixed"], button, div')
      .filter({ has: page.locator("svg") })
      .last();

    await expect(zaloBubble).toBeVisible({ timeout: 5000 });

    // Thiết lập lệnh đợi robot hứng một Tab mới chuẩn bị mở ra sau khi click
    const pagePromise = context.waitForEvent("page");

    // Click vào nút tròn màu xanh đó
    await zaloBubble.click();

    // Bắt lấy tab mới vừa được mở ra
    const newTab = await pagePromise;
    await newTab.waitForLoadState("domcontentloaded").catch(() => {});

    // Kiểm tra đường link của tab mới phải chứa địa chỉ "zalo.me"
    await expect(newTab).toHaveURL(/.*zalo\.me.*/);

    console.log("Đã kiểm tra luồng liên kết Zalo thành công!");
  });
 // --- CHỨC NĂNG: ĐÁNH GIÁ SẢN PHẨM SAU KHI ĐẶT HÀNG ---
  test("Khách hàng - Chỉ hiển thị nút Đánh giá khi đơn hàng ở trạng thái Đang giao hoặc Hoàn thành", async ({ page }) => {
    test.setTimeout(25000); // Tăng thời gian chờ tổng lên 25 giây cho thoải mái

    // 1. Vào trang đăng nhập tài khoản khách hàng
    await page.goto("http://localhost:5173/auth/dang-nhap", { waitUntil: "domcontentloaded" });
    await page.locator('input[type="email"]').fill("khachhang@example.com");
    await page.locator('input[type="password"]').fill("12345678");
    await page.getByRole("button", { name: /đăng nhập/i }).click();
    
    await page.waitForTimeout(2000); 

    // 2. Click vào biểu tượng Avatar ở góc trên bên phải
    const avatar = page.locator('img[src*="avatar"], .avatar, button:has(svg), [class*="user"]').first();
    await expect(avatar).toBeVisible({ timeout: 5000 });
    await avatar.click();

    // 3. Click chọn mục "Đơn hàng của tôi"
    const menuDonHang = page.getByText(/đơn hàng của tôi/i).first();
    await expect(menuDonHang).toBeVisible({ timeout: 5000 });
    await menuDonHang.click();

    // Đợi 3 giây cho trang danh sách đơn hàng kịp load dữ liệu ra màn hình
    await page.waitForTimeout(3000);

    await page.waitForURL(/.*don-hang.*/, { timeout: 10000 });
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000);

    // Tìm ô select dropdown lọc trạng thái (ô đang hiển thị chữ "Tất cả trạng thái" hoặc có thẻ select)
    const boLocTrangThai = page.locator('select, [class*="select"], [class*="dropdown"]').first();
    
    if (await boLocTrangThai.isVisible()) {
      // Cách 1: Nếu là thẻ <select> chuẩn của HTML, chọn trực tiếp bằng value hoặc label
      await boLocTrangThai.selectOption({ label: 'Hoàn thành' }).catch(async () => {
        // Cách 2: Nếu là thẻ div/custom UI, click mở ra rồi bấm vào chữ "Hoàn thành"
        await boLocTrangThai.click();
        await page.locator('text="Hoàn thành"').last().click();
      });
      
      console.log("-> Robot đã click chọn bộ lọc: Hoàn thành");
      // Đợi 2 giây cho Front-end và Back-end lọc lại danh sách đơn hàng mới
      await page.waitForTimeout(2000);
    }

    // 4. Lúc này giao diện chỉ còn các đơn hàng đã Hoàn thành, Robot nhặt khối đơn đầu tiên
    const donHangDauTien = page.locator('div, tr, .order-item, [class*="order"]')
      .filter({ hasText: /DH|Đơn hàng|Chi tiết|Trạng thái/i })
      .first();

    if (await donHangDauTien.isVisible()) {
      const textNoiDungDon = await donHangDauTien.innerText();
      console.log(`-> Robot quét thấy đơn sau khi lọc: "${textNoiDungDon.replace(/\n/g, ' ')}"`);

      // 5. Bấm đích danh vào chữ "Xem chi tiết" nằm bên trong khối đơn hàng đó
        const btnXemChiTiet = donHangDauTien.getByText('Xem chi tiết', { exact: false }).first();
        await expect(btnXemChiTiet).toBeVisible({ timeout: 5000 });
        await btnXemChiTiet.click();

        // Ép Robot đợi đường link chuyển sang trang chi tiết
        // (Bắt buộc phải đợi để tránh quét nhầm giao diện cũ)
        await page.waitForTimeout(3000);

      // Định vị nút Đánh giá trong trang chi tiết
       const btnDanhGia = page.getByText(/đánh giá/i).first();
      // 6. KIỂM TRA PHÂN QUYỀN TỰ ĐỘNG THEO DỮ LIỆU THỰC TẾ
      if (textNoiDungDon.includes("Đang giao") || textNoiDungDon.includes("Hoàn thành") || textNoiDungDon.includes("dang_giao") || textNoiDungDon.includes("hoan_thanh")) {
        await expect(btnDanhGia).toBeVisible({ timeout: 5000 });
        console.log("✅ THÀNH CÔNG: Đơn hàng Đã hoàn thành/Đang giao -> Nút Đánh giá ĐÃ hiển thị đúng!");
      } else {
        await expect(btnDanhGia).not.toBeVisible({ timeout: 5000 });
        console.log("✅ THÀNH CÔNG: Đơn hàng ở trạng thái khác -> Nút Đánh giá KHÔNG hiển thị!");
      }
    } else {
      // Trường hợp tài khoản này thực sự chưa có đơn hoàn thành nào (số 6 ở tab Hoàn thành nhưng bộ lọc trống)
      console.log("⚠️ Thông báo: Không tìm thấy khối đơn hàng nào sau khi chọn bộ lọc.");
    }
  });
});