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
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const navButtonStyle = {
  color: "#333333",
  fontWeight: 600,
  textTransform: "none",
};

const iconButtonStyle = {
  color: "#333333",
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [user, setUser] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isUserMenuOpen = Boolean(userMenuAnchor);

  const navItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Giới thiệu", path: "/gioi-thieu" },
    { label: "Bộ sưu tập", path: "/tranh" },
    { label: "Khuyến mãi", path: "/khuyen-mai" },
  ];

  useEffect(() => {
    if (authService.isAuthenticated()) {
      setUser(authService.getUser());
    } else {
      setUser(null);
    }

    setUserMenuAnchor(null);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleNavigate = (path) => {
    setUserMenuAnchor(null);
    setMobileMenuOpen(false);
    navigate(path);
  };

  const handleOpenUserMenu = (event) => {
    if (authService.isAuthenticated()) {
      setUserMenuAnchor(event.currentTarget);
    } else {
      handleNavigate("/auth/dang-nhap");
    }
  };

  const handleLogout = () => {
    authService.dangXuat();
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    setUser(null);
    setUserMenuAnchor(null);
    setMobileMenuOpen(false);

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
            minHeight: {
              xs: "60px",
              md: "70px",
            },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            onClick={() => handleNavigate("/")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#333333",
                fontSize: {
                  xs: "18px",
                  sm: "20px",
                  md: "22px",
                },
                letterSpacing: "0.5px",
              }}
            >
              SEN DONG
            </Typography>
          </Box>

          {!isMobile && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  sx={{
                    ...navButtonStyle,
                    color:
                      location.pathname === item.path ? "#1c3f3a" : "#333333",
                    backgroundColor:
                      location.pathname === item.path
                        ? "rgba(28, 63, 58, 0.08)"
                        : "transparent",
                    "&:hover": {
                      backgroundColor: "rgba(28, 63, 58, 0.08)",
                    },
                  }}
                  component={Link}
                  to={item.path}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton sx={iconButtonStyle} onClick={handleOpenUserMenu}>
                <PersonIcon />
              </IconButton>

              <IconButton sx={iconButtonStyle} component={Link} to="/gio-hang">
                <ShoppingCartIcon />
              </IconButton>
            </Box>
          )}

          {isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <IconButton
                sx={iconButtonStyle}
                component={Link}
                to="/gio-hang"
                aria-label="Giỏ hàng"
              >
                <ShoppingCartIcon />
              </IconButton>

              <IconButton
                sx={iconButtonStyle}
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Mở menu"
              >
                <MenuIcon />
              </IconButton>
            </Box>
          )}

          <Menu
            anchorEl={userMenuAnchor}
            open={isUserMenuOpen}
            onClose={() => setUserMenuAnchor(null)}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: "220px",
                borderRadius: "10px",
              },
            }}
          >
            {user && (
              <MenuItem disabled>
                Xin chào, {user.hoTen || user.ho_ten || user.ten || user.email}
              </MenuItem>
            )}

            <MenuItem onClick={() => handleNavigate("/auth/thong-tin")}>
              Thông tin cá nhân
            </MenuItem>

            <MenuItem onClick={() => handleNavigate("/don-hang/cua-toi")}>
              Đơn hàng của tôi
            </MenuItem>

            <MenuItem onClick={handleLogout} sx={{ color: "#e74c3c", gap: 1 }}>
              <LogoutIcon fontSize="small" /> Đăng xuất
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>

      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            width: {
              xs: "82%",
              sm: "360px",
            },
            maxWidth: "380px",
            padding: "18px 0",
          },
        }}
      >
        <Box
          sx={{
            px: 2.5,
            pb: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              color: "#1c3f3a",
              fontSize: "20px",
            }}
          >
            SEN DONG
          </Typography>

          <IconButton onClick={() => setMobileMenuOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        <List sx={{ py: 1 }}>
          {navItems.map((item) => (
            <ListItemButton
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                py: 1.4,
                px: 2.5,
                "&.Mui-selected": {
                  backgroundColor: "rgba(28, 63, 58, 0.08)",
                  color: "#1c3f3a",
                },
              }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 700 : 500,
                }}
              />
            </ListItemButton>
          ))}

          <ListItemButton
            onClick={() => handleNavigate("/gio-hang")}
            selected={location.pathname === "/gio-hang"}
            sx={{
              py: 1.4,
              px: 2.5,
              "&.Mui-selected": {
                backgroundColor: "rgba(28, 63, 58, 0.08)",
                color: "#1c3f3a",
              },
            }}
          >
            <ShoppingCartIcon sx={{ mr: 1.5, fontSize: 20 }} />
            <ListItemText
              primary="Giỏ hàng"
              primaryTypographyProps={{ fontWeight: 500 }}
            />
          </ListItemButton>
        </List>

        <Divider />

        <List sx={{ py: 1 }}>
          {user ? (
            <>
              <Box sx={{ px: 2.5, py: 1, color: "#667085", fontSize: "14px" }}>
                Xin chào,{" "}
                <strong>
                  {user.hoTen || user.ho_ten || user.ten || user.email}
                </strong>
              </Box>

              <ListItemButton
                onClick={() => handleNavigate("/auth/thong-tin")}
                sx={{ py: 1.4, px: 2.5 }}
              >
                <PersonIcon sx={{ mr: 1.5, fontSize: 20 }} />
                <ListItemText
                  primary="Thông tin cá nhân"
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItemButton>

              <ListItemButton
                onClick={() => handleNavigate("/don-hang/cua-toi")}
                sx={{ py: 1.4, px: 2.5 }}
              >
                <ListItemText
                  primary="Đơn hàng của tôi"
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItemButton>

              <ListItemButton
                onClick={handleLogout}
                sx={{
                  py: 1.4,
                  px: 2.5,
                  color: "#e74c3c",
                }}
              >
                <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
                <ListItemText
                  primary="Đăng xuất"
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
              </ListItemButton>
            </>
          ) : (
            <Box sx={{ px: 2.5, py: 1.5 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => handleNavigate("/auth/dang-nhap")}
                sx={{
                  backgroundColor: "#1c3f3a",
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: "8px",
                  py: 1.1,
                  "&:hover": {
                    backgroundColor: "#14302c",
                  },
                }}
              >
                Đăng nhập
              </Button>
            </Box>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
