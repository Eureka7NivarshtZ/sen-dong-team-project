import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductCard from './ProductCard';

describe('ProductCard Interaction', () => {
  it('Gọi hàm onOpenDetail khi click vào thẻ sản phẩm', () => {
    // Tạo một hàm giả để theo dõi sự kiện click
    const mockOpenDetail = vi.fn();
    
    // Render component với hàm giả
    render(<ProductCard 
      title="Tranh Sen" 
      price="100,000đ" 
      onOpenDetail={mockOpenDetail} 
    />);
    
    // Tìm thẻ sản phẩm (dựa vào tiêu đề)
    const cardTitle = screen.getByText(/Tranh Sen/i);
    
    // Giả lập hành động click
    fireEvent.click(cardTitle);
    
    // Kiểm tra xem hàm đã được gọi chưa
    expect(mockOpenDetail).toHaveBeenCalledTimes(1);
  });
});