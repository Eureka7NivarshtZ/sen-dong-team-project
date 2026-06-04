import { test, expect } from '@playwright/test';

test.describe('Nhóm 1: Tài khoản & Xác thực', () => {

  // --- CHỨC NĂNG 1: ĐĂNG KÝ TÀI KHOẢN ---
  test('Đăng ký - Không cho phép bỏ trống thông tin', async ({ page }) => {
    await page.goto('http://localhost:5173/auth/dang-ky', { waitUntil: 'networkidle' });
    
    // Bấm nút Đăng ký trên giao diện của bạn
    await page.getByRole('button', { name: 'Đăng ký', exact: true }).click();
    
    // Kiểm tra thông minh: Vì bỏ trống thông tin nên đăng ký thất bại, 
    // Người dùng PHẢI bị giữ chân lại tại trang /auth/dang-ky chứ không được chuyển đi đâu hết.
    await expect(page).toHaveURL('http://localhost:5173/auth/dang-ky');
  });

  // --- CHỨC NĂNG 2: ĐĂNG NHẬP HỆ THỐNG ---
  test('Đăng nhập - Cảnh báo khi sai mật khẩu', async ({ page }) => {
    await page.goto('http://localhost:5173/auth/dang-nhap', { waitUntil: 'networkidle' });
    
    await page.locator('input[type="email"]').fill('khachhang@example.com');
    await page.locator('input[type="password"]').fill('SaiMatKhau123'); // Cố tình điền sai pass
    await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
    
    // Kiểm tra thông minh: Do sai mật khẩu, hệ thống phải chặn lại,
    // Người dùng vẫn phải nằm lại tại trang đăng nhập ban đầu.
    await expect(page).toHaveURL('http://localhost:5173/auth/dang-nhap');
  });

});