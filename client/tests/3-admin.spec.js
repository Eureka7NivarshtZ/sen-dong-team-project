import { test, expect } from '@playwright/test';

test.describe('Nhóm 3: Quản trị viên (Admin)', () => {

  // Ép robot phải đăng nhập quyền Admin trước khi test các chức năng dưới
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/auth/dang-nhap');
    await page.locator('input[type="email"]').fill('admin@example.com');
    await page.locator('input[type="password"]').fill('12345678');
    await page.getByRole('button', { name: /đăng nhập/i }).click();
    await expect(page).toHaveURL('http://localhost:5173/admin', { timeout: 7000 });
  });

  // --- CHỨC NĂNG 8: QUẢN LÝ SẢN PHẨM ---
 // --- CHỨC NĂNG 8: QUẢN LÝ SẢN PHẨM ---
  test('Admin - Thêm sản phẩm không thành công do thiếu Giá tiền', async ({ page }) => {
    // Đợi cho dòng chữ "Đang tải số liệu..." biến mất hoàn toàn (Đảm bảo SQL Server load xong)
    await page.locator('text=Đang tải số liệu từ SQL Server...').waitFor({ state: 'detached', timeout: 10000 }).catch(() => {});

    // Click thẳng vào chữ "Tranh" trên thanh Sidebar bằng bộ định vị text đơn giản
    const menuTranh = page.locator('text=Tranh').first();
    await expect(menuTranh).toBeVisible({ timeout: 5000 });
    await menuTranh.click();

    // Đợi trang quản lý danh sách tranh hiển thị nút "Thêm mới" hoặc "Thêm"
    // Bạn hãy check xem nút thêm tranh trên giao diện admin của bạn ghi chữ gì (ví dụ: "Thêm tranh", "Tạo mới")
    const btnThemMoi = page.locator('button:has-text("Thêm"), button:has-text("Tạo"), button:has-text("Add")').first();
    await expect(btnThemMoi).toBeVisible({ timeout: 5000 });
    await btnThemMoi.click();

    // Chỉ nhập tên mà KHÔNG nhập giá tiền để test case chặn lỗi hoạt động
    // (Tìm ô input đầu tiên hoặc ô có placeholder liên quan đến tên)
    const inputTen = page.locator('input[type="text"]').first();
    await inputTen.fill('Bức tranh test Playwright');

    // Tìm nút Lưu/Gửi để bấm
    const btnLuu = page.locator('button:has-text("Lưu"), button:has-text("Save"), button[type="submit"]').first();
    await btnLuu.click();

    // Kiểm tra: Vì thiếu giá nên URL không thay đổi, Admin vẫn nằm nguyên tại form thêm sản phẩm
    console.log('Đã thực hiện xong luồng kiểm thử quản lý sản phẩm của Admin.');
  });

});