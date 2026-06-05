import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { tranhService, gioHangService, authService } from "../../services";
import ReviewSection from "../../components/client/ReviewSection";

function useResponsive() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    isMobile: width <= 768,
    isSmallMobile: width <= 480,
    isTablet: width > 768 && width <= 1024,
  };
}

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isMobile, isSmallMobile, isTablet } = useResponsive();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await tranhService.layChiTietTranh(id);

        if (result.success) {
          setProduct(result.data);
        } else {
          setError(result.error || "Không tìm thấy sản phẩm");
        }
      } catch (err) {
        setError("Có lỗi xảy ra");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div
        style={{
          padding: isMobile ? "60px 20px" : "80px 100px",
          textAlign: "center",
        }}
      >
        <p>Đang tải sản phẩm...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div
        style={{
          padding: isMobile ? "60px 20px" : "80px 100px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: isMobile ? "22px" : "28px",
            color: "#1c3f3a",
          }}
        >
          {error || "Không tìm thấy sản phẩm"}
        </h2>

        <button
          onClick={() => navigate("/tranh")}
          style={{
            marginTop: "20px",
            padding: "12px 28px",
            backgroundColor: "#1c3f3a",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Quay lại bộ sưu tập
        </button>
      </div>
    );
  }

  const handleIncrease = () => {
    const tonKho = Number(product.so_luong_ton || 0);

    if (tonKho > 0 && quantity >= tonKho) {
      alert("Số lượng đã đạt tối đa trong kho!");
      return;
    }

    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = async () => {
    if (!authService.isAuthenticated()) {
      alert("Vui lòng đăng nhập trước khi thêm sản phẩm vào giỏ hàng!");
      navigate("/auth/dang-nhap");
      return;
    }

    const validTranhId = product.tranh_id || product.id;

    if (!validTranhId) {
      alert("Không tìm thấy mã định danh hợp lệ của tác phẩm này!");
      return;
    }

    if (Number(product.so_luong_ton || 0) <= 0) {
      alert("Sản phẩm này hiện đã hết hàng!");
      return;
    }

    setAddingToCart(true);

    try {
      const result = await gioHangService.themVaoGioHang(
        validTranhId,
        quantity,
      );

      if (result && (result.success || result.chi_tiet_id)) {
        alert(
          `Đã thêm x${quantity} tác phẩm "${
            product.ten_tranh || product.ten
          }" vào giỏ hàng thành công!`,
        );
        setQuantity(1);
      } else {
        alert(
          "Thêm vào giỏ hàng thất bại: " +
            (result.error || "Số lượng tồn kho không đủ!"),
        );
      }
    } catch (err) {
      console.error("Lỗi thêm vào giỏ hàng:", err);
      alert("Có lỗi xảy ra khi kết nối đến hệ thống giỏ hàng!");
    } finally {
      setAddingToCart(false);
    }
  };

  const hinhTranhBieuDien =
    product.hinh_anh && product.hinh_anh.length > 0
      ? product.hinh_anh.find((item) => item.la_chinh)?.url ||
        product.hinh_anh[0].url
      : "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'><rect width='100%' height='100%' fill='%23f8f8f8'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='%23999'>Sen Dong Art Gallery</text></svg>";

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#fff",
        fontFamily: "Arial, sans-serif",
        padding: isSmallMobile
          ? "32px 16px 60px"
          : isMobile
            ? "40px 20px 70px"
            : isTablet
              ? "56px 40px 80px"
              : "70px 120px 90px",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isSmallMobile ? "28px" : isMobile ? "36px" : "70px",
          alignItems: "start",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        {/* HÌNH ẢNH SẢN PHẨM */}
        <div style={{ width: "100%" }}>
          <div
            style={{
              width: "100%",
              height: isSmallMobile ? "300px" : isMobile ? "360px" : "430px",
              backgroundColor: "#f8f8f8",
              border: "1px solid #eeeeee",
              borderRadius: isMobile ? "12px" : "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <img
              src={hinhTranhBieuDien}
              alt={product.ten_tranh}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>

          <div
            style={{
              marginTop: "18px",
              textAlign: "center",
              color: "#1c3f3a",
              fontSize: "15px",
              fontWeight: "500",
            }}
          >
            🚚 Miễn phí vận chuyển
          </div>
        </div>

        {/* THÔNG TIN CHI TIẾT */}
        <div style={{ width: "100%" }}>
          <h1
            style={{
              fontSize: isSmallMobile ? "24px" : isMobile ? "26px" : "30px",
              fontWeight: "500",
              color: "#111",
              margin: "0 0 12px",
              textAlign: "left",
              lineHeight: 1.3,
            }}
          >
            {product.ten_tranh}
          </h1>

          <div
            style={{
              color: "#1c9b61",
              fontSize: isMobile ? "20px" : "22px",
              fontWeight: "700",
              marginBottom: "26px",
              textAlign: "left",
            }}
          >
            {product.gia_ban
              ? `${Number(product.gia_ban).toLocaleString()}đ`
              : "Liên hệ"}
          </div>

          <div style={{ marginBottom: "24px", textAlign: "left" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                color: "#444",
                marginBottom: "8px",
              }}
            >
              Số lượng
            </label>

            <div
              style={{
                display: "inline-flex",
                border: "1px solid #ddd",
                height: "40px",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <button onClick={handleDecrease} style={quantityButtonStyle}>
                -
              </button>

              <div
                style={{
                  width: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                }}
              >
                {quantity}
              </div>

              <button onClick={handleIncrease} style={quantityButtonStyle}>
                +
              </button>
            </div>
          </div>

          <div style={{ marginBottom: "28px", textAlign: "left" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                color: "#444",
                marginBottom: "10px",
              }}
            >
              Tùy chọn
            </label>

            <div
              style={{
                display: "flex",
                flexDirection: isSmallMobile ? "column" : "row",
                gap: "12px",
                alignItems: isSmallMobile ? "stretch" : "center",
              }}
            >
              <label style={radioLabelStyle}>
                <input type="radio" name="ink" defaultChecked />
                <span>Trắng và xanh ngọc</span>
              </label>

              <select
                style={{
                  border: "1px solid #ddd",
                  padding: "9px 12px",
                  fontSize: "14px",
                  outline: "none",
                  borderRadius: "6px",
                  width: isSmallMobile ? "100%" : "auto",
                }}
                defaultValue="40x60"
              >
                <option value="40x60">40x60</option>
                <option value="60x80">60x80</option>
                <option value="80x120">80x120</option>
              </select>
            </div>
          </div>

          <p
            style={{
              fontSize: "14px",
              color: "#666",
              lineHeight: "1.7",
              maxWidth: "520px",
              marginBottom: "30px",
              textAlign: "left",
            }}
          >
            {product.mo_ta || "Không có mô tả chi tiết cho tác phẩm này."}
          </p>

          <button
            onClick={handleAddToCart}
            disabled={addingToCart || Number(product.so_luong_ton || 0) <= 0}
            style={{
              width: "100%",
              maxWidth: isMobile ? "100%" : "430px",
              height: "50px",
              backgroundColor:
                addingToCart || Number(product.so_luong_ton || 0) <= 0
                  ? "#999"
                  : "#27ae60",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontSize: "15px",
              fontWeight: "600",
              cursor:
                addingToCart || Number(product.so_luong_ton || 0) <= 0
                  ? "not-allowed"
                  : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "34px",
            }}
          >
            <FaShoppingCart />
            {Number(product.so_luong_ton || 0) <= 0
              ? "Hết hàng"
              : addingToCart
                ? "Đang thêm..."
                : "Thêm vào giỏ hàng"}
          </button>

          <div
            style={{
              borderTop: "1px solid #eee",
              paddingTop: "24px",
              fontSize: "14px",
              color: "#333",
              lineHeight: "1.9",
              textAlign: "left",
            }}
          >
            <div>
              <strong>Tác giả:</strong>{" "}
              {product.tacGia?.ho_ten || product.tac_gia?.ho_ten || "N/A"}
            </div>

            <div>
              <strong>Danh mục:</strong>{" "}
              {product.danhMuc?.ten || product.danh_muc?.ten || "N/A"}
            </div>

            <div>
              <strong>Số lượng tồn:</strong> {product.so_luong_ton || 0} tấm
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1280px",
          margin: isMobile ? "44px auto 0" : "60px auto 0",
        }}
      >
        <ReviewSection tranhId={id} />
      </div>
    </div>
  );
}

const quantityButtonStyle = {
  width: "40px",
  border: "none",
  backgroundColor: "#f7f7f7",
  cursor: "pointer",
  fontSize: "16px",
};

const radioLabelStyle = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  fontSize: "14px",
  color: "#333",
};

export default ProductDetail;
