import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Navbar from './Navbar';

// GIẢ LẬP useRef NGAY Ở ĐÂY - Đây là cách "cứu cánh" tốt nhất
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useRef: vi.fn().mockReturnValue({ current: document.createElement('div') }),
  };
});

describe('Kiểm tra Navbar', () => {
  it('Hiển thị đúng tên SEN DONG', async () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    const logoElement = await screen.findByText(/SEN DONG/i);
    expect(logoElement).toBeInTheDocument();
  });
});