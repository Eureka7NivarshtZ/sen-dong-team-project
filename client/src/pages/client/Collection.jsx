import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import ProductCard_TrangChu from "../../components/client/ProductCard";

const images = import.meta.glob("../../assets/*.{png,jpg,jpeg,webp}", {
  eager: true,
});

const initialProducts = [
  {
    id: 1,
    title: "Tranh Đêm đầy sao",
    category: "Tranh sơn dầu",
    price: "3.600.000 đ",
    image: images["../../assets/dem-day-sao.jpg"]?.default,
    description: "Tác phẩm khắc họa khung cảnh ban đêm huyền ảo với những vòng xoáy năng lượng cuồn cuộn, thể hiện cá tính nghệ thuật độc bản và sâu lắng."
  },
  {
    id: 2,
    title: "Tranh Hoa diên vĩ",
    category: "Tranh sơn dầu",
    price: "3.600.000 đ",
    image: images["../../assets/hoa-diên-vĩ.jpeg"]?.default,
    description: "Bức tranh hoa diên vĩ mang sắc xanh dịu mát tràn đầy sức sống tươi mới, đem lại nét sang trọng, tao nhã cho không gian nội thất của bạn."
  },
  {
    id: 3,
    title: "Tranh Hoa hướng dương",
    category: "Tranh sơn dầu canvas",
    price: "3.600.000 đ",
    image: images["../../assets/hoa-hướng-dương.jpeg"]?.default,
    description: "Sử dụng chất liệu canvas cao cấp phối cùng sắc vàng rực rỡ của nắng, tác phẩm tượng trưng cho năng lượng tích cực, may mắn và thịnh vượng."
  },
  {
    id: 4,
    title: "Vườn xuân Trung Nam Bắc",
    category: "Tranh sơn mài",
    price: "3.600.000 đ",
    image: images["../../assets/vuon-xuan-trung-nam-bac.jpg"]?.default,
    description: "Kiệt tác sơn mài tinh xảo tái hiện không khí lễ hội mùa xuân rộn ràng khắp ba miền đất nước, đậm đà bản sắc văn hóa và nghệ thuật dân tộc."
  },
  {
    id: 5,
    title: "Chùa tháp Phổ Minh",
    category: "Tranh sơn mài",
    price: "3.600.000 đ",
    image: images["../../assets/chua-thap-pho-minh.jpg"]?.default,
    description: "Tác phẩm mang phong vị cổ kính trầm mặc, thực hiện tỉ mỉ qua nhiều lớp sơn mài truyền thống nhằm tôn vinh vẻ đẹp kiến trúc tâm linh Việt Nam."
  },
  {
    id: 6,
    title: "Bác Hồ ở chiến khu Việt Bắc",
    category: "Tranh sơn mài",
    price: "3.600.000 đ",
    image: images["../../assets/uncle-ho-at-viet-bac.jpg"]?.default,
    description: "Bức tranh sơn mài lịch sử giàu cảm xúc, khắc họa hình ảnh vị lãnh tụ vĩ đại giản dị giữa núi rừng chiến khu Việt Bắc hùng vĩ."
  },
  {
    id: 7,
    title: "Đám cưới chuột Hàng Trống",
    category: "Tranh khắc gỗ dân gian Đông Hồ",
    price: "3.600.000 đ",
    image: images["../../assets/dam-cuoi-chuot-hang-trong.jpg"]?.default,
    description: "Bức tranh mang đậm tính châm biếm sâu cay và hóm hỉnh của dân gian xưa, được chế tác thủ công bằng phương pháp khắc gỗ mộc mạc."
  },
  {
    id: 8,
    title: "Lợn đàn",
    category: "Tranh khắc gỗ dân gian Đông Hồ",
    price: "3.600.000 đ",
    image: images["../../assets/lon-dan.jpg"]?.default,
    description: "Hình ảnh đàn lợn béo tròn ngộ nghĩnh thể hiện ước vọng về một cuộc sống sung túc, no đủ, ấm no cho mọi gia đình Việt."
  },
  {
    id: 9,
    title: "Mona Lisa 2",
    category: "Tranh sơn dầu",
    price: "3.600.000 đ",
    image: images["../../assets/mona-lihạnh.jpg"]?.default,
    description:"Kích thước: 60x80cm. \n Chất liệu: Sơn dầu trên vải canvas. \n Đẹp"
  }
];

const categories = [
  "Tất cả",
  "Tranh sơn dầu",
  "Tranh sơn mài",
  "Tranh sơn dầu canvas",
  "Tranh khắc gỗ dân gian Đông Hồ"
];

// Thêm prop onNavigate để khi bấm nút mua sẽ chuyển trang
function Collection() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedProduct, setSelectedProduct] = useState(null); // Quản lý tranh xem chi tiết

  const filteredProducts = selectedCategory === "Tất cả"
    ? initialProducts
    : initialProducts.filter(p => p.category === selectedCategory);

  const handleBuyNow = (product) => {
    // 1. Tắt modal chi tiết trước
    setSelectedProduct(null);
    
    // 2. KÍCH HOẠT HÀM THÊM VÀO GIỎ HÀNG (Quan trọng nhất)
    addToCart(product);

    // 3. Chuyển thẳng sang trang giỏ hàng
    navigate("/cart");
  };

  return (
    <div 
      style={{ 
        width: "100%", 
        boxSizing: "border-box", 
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#ffffff",
        padding: "40px 100px 80px 100px"
      }}
    >
      {/* 1. TIÊU ĐỀ TRANG */}
      <div style={{ textAlign: "left", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "normal", color: "#111111", margin: 0 }}>
          Bộ sưu tập
        </h1>
      </div>

      {/* 2. BỐ CỤC CHIA 2 CỘT */}
      <div 
        style={{ 
          display: "grid", 
          gridTemplateColumns: "280px 1fr", 
          gap: "50px",
          alignItems: "start"
        }}
      >
        {/* SIDEBAR DANH MỤC */}
        <div style={{ textAlign: "left" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#000000", margin: "0 0 20px 0" }}>
            Danh mục
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <li 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    fontSize: "15px",
                    color: isActive ? "#1c3f3a" : "#333333",
                    fontWeight: isActive ? "bold" : "normal",
                    padding: "8px 0",
                    cursor: "pointer",
                    transition: "color 0.2s ease"
                  }}
                  onMouseEnter={(e) => { if(!isActive) e.currentTarget.style.color = "#1c3f3a"; }}
                  onMouseLeave={(e) => { if(!isActive) e.currentTarget.style.color = "#333333"; }}
                >
                  {cat}
                </li>
              );
            })}
          </ul>
        </div>

        {/* LƯỚI SẢN PHẨM TRANH */}
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "30px" }}>
            {filteredProducts.map((product) => (
              <ProductCard_TrangChu
                key={product.id}
                image={product.image}
                title={product.title}
                category={product.category}
                price={product.price}
                onOpenDetail={() => setSelectedProduct(product)} // Mở modal khi bấm vào thẻ tranh
              />
            ))}
          </div>
        </div>
      </div>

      {/* 3. POPUP MODAL XEM CHI TIẾT TRANH VÀ ĐẶT MUA */}
      {selectedProduct && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setSelectedProduct(null)} // Bấm ra vùng đen ngoài để đóng popup
        >
          <div 
            style={{
              backgroundColor: "#ffffff",
              width: "750px",
              borderRadius: "12px",
              padding: "30px",
              display: "grid",
              gridTemplateColumns: "1.1fr 0.9fr",
              gap: "30px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              position: "relative",
              animation: "fadeIn 0.2s ease-out"
            }}
            onClick={(e) => e.stopPropagation()} // Không cho tắt popup khi click vào bên trong thông tin
          >
            {/* Nút đóng X góc phải */}
            <button 
              onClick={() => setSelectedProduct(null)}
              style={{
                position: "absolute",
                top: "15px",
                right: "20px",
                border: "none",
                backgroundColor: "transparent",
                fontSize: "22px",
                cursor: "pointer",
                color: "#999"
              }}
            >
              &times;
            </button>

            {/* Bên trái: Ảnh phóng to hiển thị trọn vẹn */}
            <div style={{ backgroundColor: "#fcfcfc", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", height: "350px", border: "1px solid #f0f0f0" }}>
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.title}
                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} 
              />
            </div>

            {/* Bên phải: Nội dung chi tiết tác phẩm & Nút mua hàng */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", textAlign: "left" }}>
              <div>
                <span style={{ fontSize: "12px", color: "#95a5a6", textTransform: "uppercase", fontWeight: "600" }}>
                  {selectedProduct.category}
                </span>
                <h2 style={{ fontSize: "24px", color: "#111111", margin: "5px 0 15px 0", fontWeight: "bold" }}>
                  {selectedProduct.title}
                </h2>
                <div style={{ fontSize: "20px", color: "#1c3f3a", fontWeight: "bold", marginBottom: "20px" }}>
                  {selectedProduct.price}
                </div>
                
                <h4 style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#333", fontWeight: "bold" }}>Mô tả tác phẩm:</h4>
                <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.5", margin: 0 }}>
                  {selectedProduct.description || "Tác phẩm vẽ tay nghệ thuật chất lượng cao từ các họa sĩ kinh nghiệm của xưởng tranh Sen Đông."}
                </p>
              </div>

              {/* Nút bấm mua nhảy qua giỏ hàng */}
              <button
                onClick={() => handleBuyNow(selectedProduct)}
                style={{
                  width: "100%",
                  backgroundColor: "#1c3f3a", // Màu xanh lục thương hiệu
                  color: "#ffffff",
                  border: "none",
                  padding: "14px 0",
                  fontSize: "15px",
                  fontWeight: "bold",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "background-color 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#142e2a"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#1c3f3a"}
              >
                MUA NGAY (ĐẾN GIỎ HÀNG)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Collection;