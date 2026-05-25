import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../contexts/CartContext";

const images = import.meta.glob("../../assets/*.{png,jpg,jpeg,webp}", {
  eager: true,
});

const products = [
  {
    id: 1,
    title: "Tranh Đêm đầy sao",
    category: "Tranh sơn dầu",
    price: "3.600.000 đ",
    image: images["../../assets/dem-day-sao.jpg"]?.default,
    description:
      "Tác phẩm khắc họa khung cảnh ban đêm huyền ảo với những vòng xoáy năng lượng cuồn cuộn, thể hiện cá tính nghệ thuật độc bản và sâu lắng.",
    size: "73.7cm x 92.1cm x 3.5cm",
    author: "Vincent van Gogh",
    material: "Sơn dầu trên canvas",
  },
  {
    id: 2,
    title: "Tranh Hoa diên vĩ",
    category: "Tranh sơn dầu",
    price: "3.600.000 đ",
    image: images["../../assets/hoa-diên-vĩ.jpeg"]?.default,
    description:
      "Bức tranh hoa diên vĩ mang sắc xanh dịu mát tràn đầy sức sống tươi mới, đem lại nét sang trọng, tao nhã cho không gian nội thất của bạn.",
    size: "60cm x 80cm",
    author: "Vincent van Gogh",
    material: "Sơn dầu trên canvas",
  },
  {
    id: 3,
    title: "Tranh Hoa hướng dương",
    category: "Tranh sơn dầu canvas",
    price: "3.600.000 đ",
    image: images["../../assets/hoa-hướng-dương.jpeg"]?.default,
    description:
      "Sử dụng chất liệu canvas cao cấp phối cùng sắc vàng rực rỡ của nắng, tác phẩm tượng trưng cho năng lượng tích cực, may mắn và thịnh vượng.",
    size: "60cm x 80cm",
    author: "Vincent van Gogh",
    material: "Sơn dầu canvas",
  },
  {
    id: 4,
    title: "Vườn xuân Trung Nam Bắc",
    category: "Tranh sơn mài",
    price: "3.600.000 đ",
    image: images["../../assets/vuon-xuan-trung-nam-bac.jpg"]?.default,
    description:
      "Kiệt tác sơn mài tinh xảo tái hiện không khí lễ hội mùa xuân rộn ràng khắp ba miền đất nước.",
    size: "80cm x 120cm",
    author: "Danh họa Việt Nam",
    material: "Sơn mài",
  },
  {
    id: 5,
    title: "Chùa tháp Phổ Minh",
    category: "Tranh sơn mài",
    price: "3.600.000 đ",
    image: images["../../assets/chua-thap-pho-minh.jpg"]?.default,
    description:
      "Tác phẩm mang phong vị cổ kính trầm mặc, tôn vinh vẻ đẹp kiến trúc tâm linh Việt Nam.",
    size: "70cm x 100cm",
    author: "Danh họa Việt Nam",
    material: "Sơn mài",
  },
  {
    id: 6,
    title: "Bác Hồ ở chiến khu Việt Bắc",
    category: "Tranh sơn mài",
    price: "3.600.000 đ",
    image: images["../../assets/uncle-ho-at-viet-bac.jpg"]?.default,
    description:
      "Bức tranh sơn mài lịch sử giàu cảm xúc, khắc họa hình ảnh vị lãnh tụ giản dị giữa núi rừng Việt Bắc.",
    size: "70cm x 100cm",
    author: "Danh họa Việt Nam",
    material: "Sơn mài",
  },
  {
    id: 7,
    title: "Đám cưới chuột Hàng Trống",
    category: "Tranh khắc gỗ dân gian Đông Hồ",
    price: "3.600.000 đ",
    image: images["../../assets/dam-cuoi-chuot-hang-trong.jpg"]?.default,
    description:
      "Bức tranh mang đậm tính châm biếm sâu cay và hóm hỉnh của dân gian xưa.",
    size: "50cm x 70cm",
    author: "Nghệ nhân dân gian",
    material: "Tranh khắc gỗ",
  },
  {
    id: 8,
    title: "Lợn đàn",
    category: "Tranh khắc gỗ dân gian Đông Hồ",
    price: "3.600.000 đ",
    image: images["../../assets/lon-dan.jpg"]?.default,
    description:
      "Hình ảnh đàn lợn béo tròn ngộ nghĩnh thể hiện ước vọng về cuộc sống sung túc, no đủ.",
    size: "50cm x 70cm",
    author: "Nghệ nhân dân gian",
    material: "Tranh Đông Hồ",
  },
  {
    id: 9,
    title: "Mona Lisa 2",
    category: "Tranh sơn dầu",
    price: "3.600.000 đ",
    image: images["../../assets/mona-lihạnh.jpg"]?.default,
    description: "Kích thước: 60x80cm. Chất liệu: Sơn dầu trên vải canvas.",
    size: "60cm x 80cm",
    author: "Leonardo da Vinci",
    material: "Sơn dầu trên canvas",
  },
];

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);

  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    return (
      <div style={{ padding: "80px 100px", textAlign: "center" }}>
        <h2>Không tìm thấy sản phẩm</h2>
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

  const handleAddToCart = (product, quantity) => {
    addToCart({
      ...product,
      quantity,
    });
    alert(`Đã thêm x${quantity} tranh ${product.title} vào giỏ hàng`);
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
            {product.title}
          </h1>

          <div
            style={{
              color: "#1c9b61",
              fontSize: "22px",
              fontWeight: "700",
              marginBottom: "28px",
            }}
          >
            {product.price}
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
            {product.description}
          </p>

          <button
            onClick={() => handleAddToCart(product, quantity)}
            style={{
              width: "100%",
              maxWidth: "430px",
              height: "48px",
              backgroundColor: "#27ae60",
              color: "#fff",
              border: "none",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
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
              <strong>Tác giả:</strong> {product.author}
            </div>
            <div>
              <strong>Loại:</strong> {product.category}
            </div>
            <div>
              <strong>Kích thước:</strong> {product.size}
            </div>
            <div>
              <strong>Chất liệu:</strong> {product.material}
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
