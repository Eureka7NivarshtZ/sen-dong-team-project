import { Navigate } from "react-router-dom";

function ProtectedAdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/auth/dang-nhap" replace />;
  }

  if (user?.loai !== "nhan_vien") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedAdminRoute;
