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
    description:
      "Tác phẩm khắc họa khung cảnh ban đêm huyền ảo với những vòng xoáy năng lượng cuồn cuộn, thể hiện cá tính nghệ thuật độc bản và sâu lắng.",
  },
  {
    id: 2,
    title: "Tranh Hoa diên vĩ",
    category: "Tranh sơn dầu",
    price: "3.600.000 đ",
    image: images["../../assets/hoa-diên-vĩ.jpeg"]?.default,
    description:
      "Bức tranh hoa diên vĩ mang sắc xanh dịu mát tràn đầy sức sống tươi mới, đem lại nét sang trọng, tao nhã cho không gian nội thất của bạn.",
  },
  {
    id: 3,
    title: "Tranh Hoa hướng dương",
    category: "Tranh sơn dầu canvas",
    price: "3.600.000 đ",
    image: images["../../assets/hoa-hướng-dương.jpeg"]?.default,
    description:
      "Sử dụng chất liệu canvas cao cấp phối cùng sắc vàng rực rỡ của nắng, tác phẩm tượng trưng cho năng lượng tích cực, may mắn và thịnh vượng.",
  },
  {
    id: 4,
    title: "Vườn xuân Trung Nam Bắc",
    category: "Tranh sơn mài",
    price: "3.600.000 đ",
    image: images["../../assets/vuon-xuan-trung-nam-bac.jpg"]?.default,
    description:
      "Kiệt tác sơn mài tinh xảo tái hiện không khí lễ hội mùa xuân rộn ràng khắp ba miền đất nước, đậm đà bản sắc văn hóa và nghệ thuật dân tộc.",
  },
  {
    id: 5,
    title: "Chùa tháp Phổ Minh",
    category: "Tranh sơn mài",
    price: "3.600.000 đ",
    image: images["../../assets/chua-thap-pho-minh.jpg"]?.default,
    description:
      "Tác phẩm mang phong vị cổ kính trầm mặc, thực hiện tỉ mỉ qua nhiều lớp sơn mài truyền thống nhằm tôn vinh vẻ đẹp kiến trúc tâm linh Việt Nam.",
  },
  {
    id: 6,
    title: "Bác Hồ ở chiến khu Việt Bắc",
    category: "Tranh sơn mài",
    price: "3.600.000 đ",
    image: images["../../assets/uncle-ho-at-viet-bac.jpg"]?.default,
    description:
      "Bức tranh sơn mài lịch sử giàu cảm xúc, khắc họa hình ảnh vị lãnh tụ vĩ đại giản dị giữa núi rừng chiến khu Việt Bắc hùng vĩ.",
  },
  {
    id: 7,
    title: "Đám cưới chuột Hàng Trống",
    category: "Tranh khắc gỗ dân gian Đông Hồ",
    price: "3.600.000 đ",
    image: images["../../assets/dam-cuoi-chuot-hang-trong.jpg"]?.default,
    description:
      "Bức tranh mang đậm tính châm biếm sâu cay và hóm hỉnh của dân gian xưa, được chế tác thủ công bằng phương pháp khắc gỗ mộc mạc.",
  },
  {
    id: 8,
    title: "Lợn đàn",
    category: "Tranh khắc gỗ dân gian Đông Hồ",
    price: "3.600.000 đ",
    image: images["../../assets/lon-dan.jpg"]?.default,
    description:
      "Hình ảnh đàn lợn béo tròn ngộ nghĩnh thể hiện ước vọng về một cuộc sống sung túc, no đủ, ấm no cho mọi gia đình Việt.",
  },
  {
    id: 9,
    title: "Mona Lisa 2",
    category: "Tranh sơn dầu",
    price: "3.600.000 đ",
    image: images["../../assets/mona-lihạnh.jpg"]?.default,
    description:
      "Kích thước: 60x80cm. \nChất liệu: Sơn dầu trên vải canvas. \nĐẹp",
  },
];

const categories = [
  "Tất cả",
  "Tranh sơn dầu",
  "Tranh sơn mài",
  "Tranh sơn dầu canvas",
  "Tranh khắc gỗ dân gian Đông Hồ",
];

function Collection() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  const filteredProducts =
    selectedCategory === "Tất cả"
      ? initialProducts
      : initialProducts.filter((p) => p.category === selectedCategory);

  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#ffffff",
        padding: "40px 100px 100px 100px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: "50px",
          alignItems: "start",
        }}
      >
        {/* CỘT TRÁI */}
        <aside
          style={{
            width: "280px",
          }}
        >
          <div
            style={{
              position: "sticky",
              top: "120px",
              textAlign: "left",
              backgroundColor: "#ffffff",
              zIndex: 20,
            }}
          >
            <h1
              style={{
                fontSize: "32px",
                fontWeight: "normal",
                color: "#111111",
                margin: "0 0 40px 0",
              }}
            >
              Bộ sưu tập
            </h1>

            <h3
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#000000",
                margin: "0 0 20px 0",
              }}
            >
              Danh mục
            </h3>

            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
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
                      transition: "color 0.2s ease",
                      lineHeight: "1.5",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.color = "#1c3f3a";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.color = "#333333";
                    }}
                  >
                    {cat}
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* CỘT PHẢI */}
        <main
          style={{
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "30px",
            }}
          >
            {filteredProducts.map((product) => (
              <ProductCard_TrangChu
                key={product.id}
                image={product.image}
                title={product.title}
                category={product.category}
                price={product.price}
                onOpenDetail={() => navigate(`/product/${product.id}`)}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Collection;
