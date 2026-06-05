import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom'; // Bắt buộc bao bọc nếu component có Link
import Footer from './Footer';

describe('Footer Component', () => {
  it('phải hiển thị thông tin liên hệ và copyright', () => {
    // Bao bọc Footer trong BrowserRouter để Link không bị lỗi
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    // Kiểm tra xem có hiển thị đúng slogan không
    const slogan = screen.getByText(/Mỗi bức tranh, một cảm xúc/i);
    expect(slogan).toBeDefined();

    // Kiểm tra copyright
    const copyright = screen.getByText(/©SenDong All Rights Reserved./i);
    expect(copyright).toBeDefined();

    // Kiểm tra một liên kết có trong footer
    const link = screen.getByText(/Hỗ Trợ Khách Hàng/i);
    expect(link).toBeDefined();
  });
});