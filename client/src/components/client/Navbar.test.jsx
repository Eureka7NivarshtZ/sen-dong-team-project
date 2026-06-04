import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';

describe('Kiểm tra Navbar', () => {
  it('Hiển thị đúng tên SEN DONG', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    expect(screen.getByText(/SEN DONG/i)).toBeDefined();
  });
});