import React, { useState } from 'react';
import Navbar from './components/client/Navbar';
import Footer from './components/client/Footer';
import Home from './pages/client/Home';
import About from './pages/client/About';
import Collection from './pages/client/Collection';
import CartCheckout from './pages/client/CartCheckout';
import Login from './pages/client/Login';        
import Register from './pages/client/Register';  

// IMPORT TẤT CẢ TRANG ADMIN VÀO ĐỂ HẾT LỖI NOT DEFINED
import Dashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import Paintings from './pages/admin/Paintings';
import Warehouse from './pages/admin/Warehouse';
import Employees from './pages/admin/Employees';

function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const exist = prevItems.find((item) => item.id === product.id);
      if (exist) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    setCurrentTab('cart');
  };

  // Kiểm tra xem tab hiện tại có thuộc vùng Admin quản trị không
  const isAdminTab = ['admin-dashboard', 'admin-orders', 'admin-paintings', 'admin-warehouse', 'admin-employees'].includes(currentTab);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#ffffff' }}>
      
      {/* Chỉ hiện Navbar và Footer khi ở trang Client, vào Admin sẽ ẩn đi */}
      {!isAdminTab && <Navbar onNavigate={setCurrentTab} currentTab={currentTab} />}
    
      <main style={{ flex: 1, width: '100%', boxSizing: 'border-box' }}>
        {/* PHÂN HỆ CLIENT VIEWS */}
        {currentTab === 'home' && <Home onNavigate={setCurrentTab} onAddToCart={addToCart} />}
        {currentTab === 'about' && <About />}
        {currentTab === 'collection' && <Collection onNavigate={setCurrentTab} onAddToCart={addToCart} />}
        {currentTab === 'cart' && <CartCheckout cartItems={cartItems} setCartItems={setCartItems} onNavigate={setCurrentTab} />}
        {currentTab === 'login' && <Login onNavigate={setCurrentTab} />}
        {currentTab === 'register' && <Register onNavigate={setCurrentTab} />}
        
        {/* PHÂN HỆ ADMIN VIEWS - TRUYỀN THÊM SETCURRENTTAB ĐỂ ĐIỀU HƯỚNG */}
        {currentTab === 'admin-dashboard' && <Dashboard onNavigate={setCurrentTab} />}
        {currentTab === 'admin-orders' && <Orders onNavigate={setCurrentTab} />}
        {currentTab === 'admin-paintings' && <Paintings onNavigate={setCurrentTab} />}
        {currentTab === 'admin-warehouse' && <Warehouse onNavigate={setCurrentTab} />}
        {currentTab === 'admin-employees' && <Employees onNavigate={setCurrentTab} />}
      </main>

      {!isAdminTab && <Footer />}
    </div>
  );
}

export default App;