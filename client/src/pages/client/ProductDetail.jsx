import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { tranhService, gioHangService, authService } from "../../services";

const images = import.meta.glob("../../assets/*.{png,jpg,jpeg,webp}", {
  eager: true,
});

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  // Lấy chi tiết tranh từ API
  useEffect(() => {
    const fetchProduct = async () => {
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
      <div style={{ padding: "80px 100px", textAlign: "center" }}>
        <p>Đang tải sản phẩm...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ padding: "80px 100px", textAlign: "center" }}>
        <h2>{error || "Không tìm thấy sản phẩm"}</h2>
        <button
          onClick={() => navigate("/collection")}
          style={{
            marginTop: "20px",
            padding: "12px 28px",
            backgroundColor: "#1c3f3a",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Quay lại bộ sưu tập
        </button>
      </div>
    );
  }

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = async () => {
    // Kiểm tra xem người dùng đã đăng nhập không
    if (!authService.isAuthenticated()) {
      alert("Vui lòng đăng nhập trước khi thêm vào giỏ hàng");
      navigate("/dang-nhap");
      return;
    }

    setAddingToCart(true);
    try {
      const result = await gioHangService.themVaoGioHang(product.id, quantity);
      if (result.success) {
        alert(`Đã thêm x${quantity} tranh vào giỏ hàng`);
        setQuantity(1);
      } else {
        alert("Có lỗi xảy ra: " + result.error);
      }
    } catch (err) {
      alert("Có lỗi xảy ra khi thêm vào giỏ hàng");
      console.error("Error adding to cart:", err);
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#fff",
        fontFamily: "Arial, sans-serif",
        padding: "70px 120px 90px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "70px",
          alignItems: "start",
        }}
      >
        {/* ẢNH SẢN PHẨM */}
        <div>
          <div
            style={{
              width: "100%",
              height: "430px",
              backgroundColor: "#f8f8f8",
              border: "1px solid #eeeeee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <img
              src={product.image}
              alt={product.title}
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

        {/* THÔNG TIN SẢN PHẨM */}
        <div>
          <h1
            style={{
              fontSize: "30px",
              fontWeight: "500",
              color: "#111",
              margin: "0 0 12px",
            }}
          >
            {product.ten}
          </h1>

          <div
            style={{
              color: "#1c9b61",
              fontSize: "22px",
              fontWeight: "700",
              marginBottom: "28px",
            }}
          >
            {product.giaBan ? `${product.giaBan.toLocaleString()}đ` : "Liên hệ"}
          </div>

          <div style={{ marginBottom: "26px" }}>
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
                height: "36px",
              }}
            >
              <button onClick={handleDecrease} style={quantityButtonStyle}>
                -
              </button>
              <div
                style={{
                  width: "46px",
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

          <div style={{ marginBottom: "30px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                color: "#444",
                marginBottom: "10px",
              }}
            >
              Màu mực in
            </label>

            <div style={{ display: "flex", gap: "12px" }}>
              <label style={radioLabelStyle}>
                <input type="radio" name="ink" defaultChecked />
                <span>Trắng và xanh ngọc</span>
              </label>

              <select
                style={{
                  border: "1px solid #ddd",
                  padding: "8px 12px",
                  fontSize: "14px",
                  outline: "none",
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
            }}
          >
            {product.moTa || "Không có mô tả"}
          </p>

          <button
            onClick={handleAddToCart}
            disabled={addingToCart}
            style={{
              width: "100%",
              maxWidth: "430px",
              height: "48px",
              backgroundColor: addingToCart ? "#999" : "#27ae60",
              color: "#fff",
              border: "none",
              fontSize: "15px",
              fontWeight: "600",
              cursor: addingToCart ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "38px",
            }}
          >
            <FaShoppingCart />
            Thêm vào giỏ hàng
          </button>

          <div
            style={{
              borderTop: "1px solid #eee",
              paddingTop: "24px",
              fontSize: "14px",
              color: "#333",
              lineHeight: "1.9",
            }}
          >
            <div>
              <strong>Tác giả:</strong> {product.tacGia?.ten || "N/A"}
            </div>
            <div>
              <strong>Danh mục:</strong> {product.danhMuc?.ten || "N/A"}
            </div>
            <div>
              <strong>Số lượng tồn:</strong> {product.soLuongTon || 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const quantityButtonStyle = {
  width: "36px",
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
