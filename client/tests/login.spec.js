import { test, expect } from '@playwright/test';

test('Luồng đăng nhập admin thành công', async ({ page }) => {
  // 1. Mở trang và đợi tuyệt đối (hết thời gian tải)
  await page.goto('http://localhost:5173/auth/dang-nhap');
  
  // 2. Chờ 2 giây để chắc chắn giao diện đã hiển thị xong trên màn hình
  await page.waitForTimeout(2000); 

  // 3. Sử dụng cách chọn input bằng placeholder (an toàn nhất)
  // Bạn kiểm tra xem trên web của bạn ô email ghi là gì, ví dụ: 'Email' hoặc 'Nhập email'
  await page.getByPlaceholder(/email/i).fill('admin@example.com');
  await page.getByPlaceholder(/mật khẩu/i).fill('12345678');

  // 4. Nhấn nút đăng nhập có chữ "Đăng nhập"
  await page.getByRole('button', { name: /đăng nhập/i }).click();
  
  // 5. Kiểm tra kết quả
  await expect(page).toHaveURL(/.*admin/);
});