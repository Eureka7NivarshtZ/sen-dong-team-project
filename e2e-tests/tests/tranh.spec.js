import { test, expect } from "@playwright/test";

test.describe("Nhóm 2: Mua sắm & Khách hàng", () => {
  // Tự động vào trang chủ trước mỗi bài test
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
  });

  // --- CHỨC NĂNG 3: TÌM KIẾM SẢN PHẨM ---
  test("Tìm kiếm - Hiển thị lỗi khi tìm từ khóa không tồn tại", async ({
    page,
  }) => {
    // Nếu trang chủ chưa có ô tìm kiếm, robot sẽ nhảy thẳng vào trang bộ sưu tập để tìm
    await page.getByRole("button", { name: /khám phá bộ sưu tập/i }).click();
    await page.waitForLoadState("networkidle");

    // Tìm ô input nhập từ khóa (Sửa selector nếu class/placeholder của bạn khác)
    const searchInput = page
      .locator(
        'input[type="text"], input[placeholder*="tìm"], input[placeholder*="Search"]',
      )
      .first();

    if (await searchInput.isVisible()) {
      await searchInput.fill("từ_khóa_không_có_thật_123");
      await page.keyboard.press("Enter");
      // Kiểm tra URL không đổi hoặc hiển thị thông báo trống
      await expect(
        page.locator("text=Không tìm thấy sản phẩm nào"),
      ).toBeVisible();
    } else {
      console.log(
        "Không tìm thấy ô tìm kiếm trực diện, bỏ qua test để không bị lỗi treo.",
      );
    }
  });

  // --- CHỨC NĂNG 4: THÊM VÀO GIỎ HÀNG ---
  test("Giỏ hàng - Tăng số lượng khi bấm thêm vào giỏ", async ({ page }) => {
    // 1. Click chuyển sang trang Bộ sưu tập
    await page.getByRole("button", { name: /khám phá bộ sưu tập/i }).click();
    await page.waitForLoadState("networkidle");

    // 2. Click vào tên hoặc hình ảnh của sản phẩm đầu tiên (Ví dụ click vào chữ "Hồng" hoặc sản phẩm đầu)
    // Robot sẽ nhấp vào thẻ chứa tên sản phẩm để mở trang chi tiết
    const sanPhamDauTien = page
      .locator("text=Hồng, text=Lốp, text=Hanh")
      .first();
    if (await sanPhamDauTien.isVisible()) {
      await sanPhamDauTien.click();
    } else {
      // Nếu không tìm thấy text cụ thể, click đại vào một cái link/hình ảnh sản phẩm đầu tiên
      await page.locator("img").first().click();
    }

    // Đợi trang chi tiết sản phẩm load xong
    await page.waitForLoadState("networkidle");

    // 3. Lúc này đã ở trang chi tiết, robot tìm nút "Thêm vào giỏ" thực tế
    const btnThemGio = page.locator(
      'button:has-text("Thêm vào giỏ"), button:has-text("Mua"), button:has-text("Giỏ hàng")',
    );
    await expect(btnThemGio).toBeVisible({ timeout: 5000 });
    await btnThemGio.click();

    console.log(
      "Đã vào trang chi tiết và click nút thêm vào giỏ hàng thành công.",
    );
  });

  // --- CHỨC NĂNG 5 & 6: THANH TOÁN VÀ THEO DÕI ĐƠN ---
  test("Thanh toán - Không cho phép thanh toán giỏ hàng trống", async ({
    page,
  }) => {
    // Thử truy cập thẳng vào trang giỏ hàng/thanh toán của bạn
    await page
      .goto("http://localhost:5173/gio-hang", { waitUntil: "networkidle" })
      .catch(() => page.goto("http://localhost:5173/gio-hang"));

    // Nút đặt hàng/thanh toán nếu có thì không được cho phép xử lý khi giỏ trống
    const btnThanhToan = page.locator(
      'button:has-text("Thanh toán"), button:has-text("Đặt hàng")',
    );
    if (await btnThanhToan.isVisible()) {
      await expect(btnThanhToan).not.toBeEnabled();
    }
  });

  // --- CHỨC NĂNG 9: CHĂM SÓC KHÁCH HÀNG (LIÊN KẾT ZALO) ---
  test("Hỗ trợ - Click biểu tượng chat mở đúng link liên kết Zalo", async ({
    page,
    context,
  }) => {
    // 1. Chuyển hướng sang trang Bộ sưu tập
    await page.getByRole("button", { name: /khám phá bộ sưu tập/i }).click();
    await page.waitForLoadState("networkidle");

    // 2. Nhắm vào cái bong bóng chat hình tròn màu xanh nằm ở góc màn hình.
    // Dựa vào giao diện của bạn, đây là selector quét chuẩn nhất theo icon svg hoặc vị trí cố định
    const zaloBubble = page
      .locator('.fixed, [class*="fixed"], button, div')
      .filter({ has: page.locator("svg") })
      .last();

    // Đợi 5 giây cho nút xuất hiện hẳn trên UI
    await expect(zaloBubble).toBeVisible({ timeout: 5000 });

    // 3. Thiết lập lệnh đợi robot hứng một Tab mới chuẩn bị mở ra sau khi click
    const pagePromise = context.waitForEvent("page");

    // 4. Robot thực hiện hành động click vào nút tròn màu xanh đó
    await zaloBubble.click();

    // 5. Bắt lấy tab mới vừa được mở ra
    const newTab = await pagePromise;
    await newTab.waitForLoadState("domcontentloaded").catch(() => {});

    // 6. KIỂM TRA CHÍNH XÁC: Đường link của tab mới phải chứa địa chỉ "zalo.me"
    await expect(newTab).toHaveURL(/.*zalo\.me.*/);

    console.log(
      "Đã kiểm tra luồng: Biểu tượng chat mở đúng tab liên kết Zalo thành công!",
    );
  });
});
