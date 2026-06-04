import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { authService } from "../../services";
import { AppBar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";

const navButtonStyle = { color: "#333333" };
const iconButtonStyle = { color: "#333333" };

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const isUserMenuOpen = Boolean(userMenuAnchor);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      setUser(authService.getUser());
    } else {
      setUser(null);
    }
    setUserMenuAnchor(null);
  }, [location.pathname]);

  return (
    <AppBar position="static" sx={{ backgroundColor: "#ffffff", color: "#333333", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box onClick={() => navigate("/")} sx={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#333333" }}>SEN DONG</Typography>
          </Box>

          {/* CỤM MENU ĐIỀU HƯỚNG CHÍNH */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button sx={navButtonStyle} component={Link} to="/">Trang chủ</Button>
            <Button sx={navButtonStyle} component={Link} to="/gioi-thieu">Giới thiệu</Button>
            <Button sx={navButtonStyle} component={Link} to="/tranh">Bộ sưu tập</Button>
            <Button sx={navButtonStyle} component={Link} to="/khuyen-mai">Khuyến mãi</Button>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton sx={iconButtonStyle} onClick={(e) => authService.isAuthenticated() ? setUserMenuAnchor(e.currentTarget) : navigate("/auth/dang-nhap")}>
              <PersonIcon />
            </IconButton>
            <IconButton sx={iconButtonStyle} component={Link} to="/gio-hang">
              <ShoppingCartIcon />
            </IconButton>
            <Menu anchorEl={userMenuAnchor} open={isUserMenuOpen} onClose={() => setUserMenuAnchor(null)}>
              {user && <MenuItem disabled>Xin chào, {user.hoTen || user.ten || user.email}</MenuItem>}
              
              {/* 🌟 ĐÃ THÊM: Lối tắt chuyển thẳng sang trang quản lý tiến độ đơn hàng */}
              <MenuItem onClick={() => { setUserMenuAnchor(null); navigate("/thong-tin-ca-nhan"); }}>
                👤 Thông tin cá nhân
              </MenuItem>

              <MenuItem 
                onClick={() => { 
                  authService.dangXuat(); 
                  // 🌟 ĐÃ THÊM: Xóa dứt điểm khóa token thật để trình duyệt giải phóng bộ nhớ đệm chống xung đột tài khoản
                  localStorage.removeItem("authToken"); 
                  localStorage.removeItem("user"); 
                  setUser(null); 
                  setUserMenuAnchor(null); 
                  navigate("/"); 
                }} 
                sx={{ color: "#e74c3c", gap: 1 }}
              >
                <LogoutIcon fontSize="small" /> Đăng xuất
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;