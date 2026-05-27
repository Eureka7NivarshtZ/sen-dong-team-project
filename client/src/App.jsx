import { Route, Routes } from "react-router-dom";
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
import SupportTickets from "./pages/client/SupportTickets";
// ADMIN PAGES
import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Orders";
import Paintings from "./pages/admin/Paintings";
import Warehouse from "./pages/admin/Warehouse";
import Employees from "./pages/admin/Employees";

import Promotions from "./pages/admin/Promotions";
import AnswerSupport from "./pages/admin/AnswerSupport";
import { useEffect, useState } from "react";
import { tranhService } from "./services";

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
        <Route path="/gio-hang" element={<CartCheckout />} />
        <Route path="/auth/dang-nhap" element={<Login />} />
        <Route path="/auth/dang-ky" element={<Register />} />
        <Route path="/ho-tro" element={<SupportTickets />} />
      </Route>

      {/* ADMIN ROUTES */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="don-hang" element={<Orders />} />
        <Route path="tranh" element={<Paintings />} />
        <Route path="kho-hang" element={<Warehouse />} />{" "}
        <Route path="nhan-vien" element={<Employees />} />
        <Route path="khuyen-mai" element={<Promotions />} />
        <Route path="ho-tro" element={<AnswerSupport />} />
      </Route>
    </Routes>
  );
}

export default App;
