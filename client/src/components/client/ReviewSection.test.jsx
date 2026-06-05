import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ReviewSection from './ReviewSection';
import apiClient from '../../services/apiClient';

// Mock module apiClient
vi.mock('../../services/apiClient', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('ReviewSection Component', () => {
  it('hiển thị danh sách đánh giá khi API trả về dữ liệu', async () => {
    const mockReviews = {
      success: true,
      data: [
        { id: 1, noi_dung: 'Tranh rất đẹp!', so_sao: 5, createdAt: '2026-06-01', khach_hang: { ho_ten: 'Nguyễn Văn A' } }
      ]
    };

    apiClient.get.mockResolvedValueOnce({ data: mockReviews });

    render(<ReviewSection tranhId="123" />);

    // Dùng waitFor để chờ dữ liệu tải xong từ useEffect
    await waitFor(() => {
      expect(screen.getByText('Nguyễn Văn A')).toBeDefined();
      expect(screen.getByText('Tranh rất đẹp!')).toBeDefined();
    });
  });

  it('hiển thị thông báo khi chưa có đánh giá', async () => {
    apiClient.get.mockResolvedValueOnce({ data: { success: true, data: [] } });

    render(<ReviewSection tranhId="123" />);

    await waitFor(() => {
      expect(screen.getByText(/Chưa có đánh giá nào cho tác phẩm này/i)).toBeDefined();
    });
  });
});