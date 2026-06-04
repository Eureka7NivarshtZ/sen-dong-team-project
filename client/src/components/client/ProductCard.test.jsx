import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProductCard from './ProductCard';

describe('Kiểm tra ProductCard', () => {
  // Tạo dữ liệu giả khớp với các prop của component
  const mockProduct = {
    title: 'Tranh Sơn Dầu Hạnh',
    price: '360,000,000đ',
    category: 'Tranh sơn dầu',
    image: ''
  };

  it('Hiển thị đúng tên và giá sản phẩm', () => {
    render(
      <ProductCard 
        title={mockProduct.title}
        price={mockProduct.price}
        category={mockProduct.category}
        image={mockProduct.image}
      />
    );
    
    // Kiểm tra tên
    expect(screen.getByText(/Tranh Sơn Dầu Hạnh/i)).toBeDefined();
    // Kiểm tra giá
    expect(screen.getByText(/360,000,000đ/i)).toBeDefined();
  });
});