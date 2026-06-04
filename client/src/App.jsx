import { Route, Routes, Navigate } from "react-router-dom";
import ClientLayout from "./layouts/ClientLayout";
import AdminLayout from "./layouts/AdminLayout";

// CLIENT PAGES
import Home from "./pages/client/Home";
import About from "./pages/client/About";
import Collection from "./pages/client/Collection";
import CartCheckout from "./pages/client/CartCheckout";
import Login from "./pages/client/Login";
import Register from "./pages/client/Register";
import ProductDetail from "./pages/client/ProductDetail";
import Coupons from "./pages/client/Coupons";
// ADMIN PAGES
import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Orders";
import Paintings from "./pages/admin/Paintings";
import Employees from "./pages/admin/Employees";
import Authors from "./pages/admin/Authors";
import Categories from "./pages/admin/Categories";
import Promotions from "./pages/admin/Promotions";
import { useEffect, useState } from "react";
import { authService, tranhService } from "./services";
import Shipping from "./pages/admin/Shipping";

// 🌟 BONG BÓNG CHAT ZALO NỔI TOÀN CỤC
function ZaloBubble() {
  // 🔥 KHANG ƠI, SỬA ĐÚNG DÒNG NÀY: Thay số điện thoại Zalo mới của ông vào đây nhé!
  const zaloUrl = "https://zalo.me/0836666644"; 

  return (
    <div
      onClick={() => window.open(zaloUrl, "_blank")}
      style={{
        position: "fixed",
        bottom: "30px",
        right: "30px",
        width: "60px",
        height: "60px",
        backgroundColor: "#0068ff",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 16px rgba(0, 104, 255, 0.4)",
        cursor: "pointer",
        zIndex: 9999,
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.12) rotate(5deg)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1) rotate(0deg)";
      }}
      title="Chat qua Zalo với Xưởng tranh Sen Đông"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
      </svg>
    </div>
  );
}

function ProtectedAdminRoute({ children }) {
  const user = authService.getUser();
  const isAdmin =
    user?.loai === "nhan_vien" ||
    user?.vai_tro === "quan_ly" ||
    user?.vai_tro === "nhan_vien";

  return isAdmin ? children : <Navigate to="/" replace />;
}

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const layTatCaTranh = async () => {
      const result = await tranhService.layTatCaTranh();
      if (result.success) {
        setProducts(result.data || []);
      }
    };

    layTatCaTranh();
  }, []);

  return (
    <>
      <Routes>
        {/* CLIENT ROUTES */}
        <Route element={<ClientLayout />}>
          <Route path="/" element={<Home products={products} />} />
          <Route path="/gioi-thieu" element={<About />} />
          <Route path="/tranh" element={<Collection products={products} />} />
          <Route path="/tranh/:id" element={<ProductDetail />} />
          <Route path="/gio-hang" element={<CartCheckout />} />
          <Route path="/auth/dang-nhap" element={<Login />} />
          <Route path="/auth/dang-ky" element={<Register />} />
          <Route path="/khuyen-mai" element={<Coupons />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="don-hang" element={<Orders />} />
          <Route path="tranh" element={<Paintings />} />
          <Route path="tac-gia" element={<Authors />} />
          <Route path="don-vi-van-chuyen" element={<Shipping />} />
          <Route path="danh-muc" element={<Categories />} />
          <Route path="nhan-vien" element={<Employees />} />
          <Route path="khuyen-mai" element={<Promotions />} />
        </Route>
      </Routes>

      <ZaloBubble />
    </>
  );
}

export default App;