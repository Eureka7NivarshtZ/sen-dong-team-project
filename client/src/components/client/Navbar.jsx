import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { authService } from "../../services";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";

const navButtonStyle = {
  color: "#333333",
};

const iconButtonStyle = {
  color: "#333333",
};

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

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleUserClick = (event) => {
    if (!authService.isAuthenticated()) {
      navigate("/auth/dang-nhap");
      return;
    }

    setUserMenuAnchor(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    authService.dangXuat();
    setUser(null);
    setUserMenuAnchor(null);
    alert("Đã đăng xuất tài khoản!");
    navigate("/");
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#ffffff",
        color: "#333333",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <Box
            onClick={handleLogoClick}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#333333",
              }}
            >
              SEN DONG
            </Typography>
          </Box>

          {/* Menu chính */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Button sx={navButtonStyle} component={Link} to="/">
              Trang chủ
            </Button>

            <Button sx={navButtonStyle} component={Link} to="/gioi-thieu">
              Giới thiệu
            </Button>

            <Button sx={navButtonStyle} component={Link} to="/tranh">
              Bộ sưu tập
            </Button>

            <Button sx={navButtonStyle} component={Link} to="/ho-tro">
              Hỗ trợ
            </Button>
          </Box>

          {/* Icon bên phải */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <IconButton sx={iconButtonStyle} onClick={handleUserClick}>
              <PersonIcon />
            </IconButton>

            <IconButton sx={iconButtonStyle} component={Link} to="/gio-hang">
              <ShoppingCartIcon />
            </IconButton>

            <Menu
              anchorEl={userMenuAnchor}
              open={isUserMenuOpen}
              onClose={handleCloseUserMenu}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              {user && (
                <MenuItem disabled>
                  Xin chào, {user.hoTen || user.ten || user.email || "User"}
                </MenuItem>
              )}

              <MenuItem
                onClick={handleLogout}
                sx={{
                  color: "#e74c3c",
                  gap: 1,
                }}
              >
                <LogoutIcon fontSize="small" />
                Đăng xuất
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
