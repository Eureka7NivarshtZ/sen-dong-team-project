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
import CustomerSupport from "./pages/client/CustomerSupport";

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
import CustomerCare from "./pages/admin/CustomerCare";
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
    <Routes>
      {/* CLIENT ROUTES */}
      <Route element={<ClientLayout />}>
        <Route path="/" element={<Home products={products} />} />
        <Route path="/gioi-thieu" element={<About />} />
        <Route path="/tranh" element={<Collection products={products} />} />
        <Route path="/tranh/:id" element={<ProductDetail />} />
        <Route path="/ho-tro" element={<CustomerSupport />} />
        <Route path="/gio-hang" element={<CartCheckout />} />
        <Route path="/auth/dang-nhap" element={<Login />} />
        <Route path="/auth/dang-ky" element={<Register />} />
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
        <Route path="cham-soc-khach-hang" element={<CustomerCare />} />
      </Route>
    </Routes>
  );
}

export default App;
