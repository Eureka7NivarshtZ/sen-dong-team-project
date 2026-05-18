import React from "react";
import ProductCard_TrangChu from "../../components/client/ProductCard";

// Dữ liệu mẫu hiển thị trên Trang Chủ của bạn
const images = import.meta.glob("../../assets/*.{png,jpg,jpeg,webp}", {
  eager: true,
});
const mockFeaturedProducts = [
  {
    id: 1,
    title: "Tranh Đêm đầy sao",
    category: "Tranh sơn dầu",
    price: "3.600.000đ",
    image: images["../../assets/dem-day-sao.jpg"]?.default,
  },
  {
    id: 2,
    title: "Tranh Hoa Diên Vĩ",
    category: "Tranh sơn dầu",
    price: "3.600.000đ",
    image: images["../../assets/hoa-diên-vĩ.jpeg"]?.default,
  },
  {
    id: 3,
    title: "Tranh Hoa Hướng Dương",
    category: "Tranh sơn dầu canvas",
    price: "3.600.000đ",
    image: images["../../assets/hoa-hướng-dương.jpeg"]?.default,
  },
  {
    id: 4,
    title: "Tranh Mona Lisa 2",
    category: "Tranh sơn dầu",
    price: "3.600.000đ",
    image: images["../../assets/mona-lihanh.jpg"]?.default,
  },
];

// Dữ liệu mẫu Đánh giá khách hàng theo hình Figma của bạn
const mockReviews = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    role: "Khách mua tranh phòng khách",
    stars: "⭐⭐⭐⭐⭐",
    comment:
      "Tranh in rất sắc nét, màu sắc tươi tắn đúng như hình thiết kế. Đóng gói cực kỳ cẩn thận, khung viền composite chắc chắn, rất đáng tiền!",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150",
  },
  {
    id: 2,
    name: "Trần Thị B",
    role: "Chủ quán cà phê",
    stars: "⭐⭐⭐⭐⭐",
    comment:
      "Mình đặt trọn bộ tranh Canvas tối giản cho quán decor lại. Khách đến ai cũng khen góc check-in mới. Thợ đóng khung rất tỉ mỉ, giao hàng nhanh.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150",
  },
  {
    id: 3,
    name: "Lê Minh C",
    role: "Văn phòng công ty",
    stars: "⭐⭐⭐⭐⭐",
    comment:
      "Dịch vụ in tranh động lực theo yêu cầu của xưởng siêu chất lượng. Tư vấn nhiệt tình, hỗ trợ chọn kích thước chuẩn. Sẽ tiếp tục ủng hộ xưởng.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150",
  },
];

function Home() {
  return (
    <div style={{ width: "100%", boxSizing: "border-box" }}>
      {/* 1. KHỐI BANNER CHỮ TRÁI - HÌNH PHẢI CỦA BẠN */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#f4f5f7",
          height: "600px",
          marginBottom: "40px",
          overflow: "hidden",
          width: "100%",
        }}
      >
        <div style={{ flex: 1, padding: "0 50px", textAlign: "left" }}>
          <h1
            style={{
              fontSize: "38px",
              fontWeight: "bold",
              color: "#111",
              margin: "0 0 15px 0",
            }}
          >
            Nghệ thuật đẹp từng nét vẽ
          </h1>
          <p
            style={{
              fontSize: "16px",
              margin: "0 0 25px 0",
              color: "#555",
              lineHeight: "1.5",
            }}
          >
            Mỗi bức tranh tại Sen Đông là một tác phẩm độc bản, khám phá bộ sưu
            tập phong phú từ sơn dầu đến màu nước.
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "20px",
                justifyContent: "flex-start", // 👈 vị trí
              }}
            >
              <button
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#39b441",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "15px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Khám phá bộ sưu tập ➔
              </button>

              <button
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#111",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "15px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Về chúng tôi
              </button>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, height: "100%" }}>
          <img
            src="/src/assets/banner.png"
            alt="Banner"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>

      {/* 2. KHỐI CAM KẾT DỊCH VỤ DÀN NGANG */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "20px",
          marginBottom: "50px",
          width: "100%",
        }}
      >
        <br />
        <div style={{ textAlign: "center" }}>
          <h2>Vì sao nên chọn Sen Đông</h2>
          <p>Chất lượng nghệ thuật được đặt lên hàng đầu</p>
        </div>
        <br />
        <div
          style={{
            padding: "20px",
            background: "#fcfcfc",
            borderRadius: "8px",
            border: "1px solid #eee",
            textAlign: "left",
          }}
        >
          <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", color: "#111" }}>
            🎨 Tranh thủ công
          </h3>
          <p
            style={{
              margin: 0,
              color: "#666",
              fontSize: "13px",
              lineHeight: "1.5",
            }}
          >
            100% vẽ tay bởi họa sĩ có bằng cấp, không in ấn công nghiệp
          </p>
        </div>
        <div
          style={{
            padding: "20px",
            background: "#fcfcfc",
            borderRadius: "8px",
            border: "1px solid #eee",
            textAlign: "left",
          }}
        >
          <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", color: "#111" }}>
            🚚 Giao Hàng An Toàn
          </h3>
          <p
            style={{
              margin: 0,
              color: "#666",
              fontSize: "13px",
              lineHeight: "1.5",
            }}
          >
            Đóng gói chống sốc nhiều lớp, bảo hiểm gãy vỡ toàn quốc.
          </p>
        </div>
        <div
          style={{
            padding: "20px",
            background: "#fcfcfc",
            borderRadius: "8px",
            border: "1px solid #eee",
            textAlign: "left",
          }}
        >
          <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", color: "#111" }}>
            🛠️ Hoàn trả dễ dàng
          </h3>
          <p
            style={{
              margin: 0,
              color: "#666",
              fontSize: "13px",
              lineHeight: "1.5",
            }}
          >
            Khung viền composite siêu bền, chống mối mọt, gia công tỉ mỉ.
          </p>
        </div>
      </div>

      {/* 3. LƯỚI SẢN PHẨM NỔI BẬT */}
      <div style={{ width: "100%", textAlign: "left", marginBottom: "60px" }}>
        <h2
          style={{
            color: "#111",
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "20px",
            borderBottom: "1px solid #eee",
            paddingBottom: "10px",
          }}
        >
          Sản Phẩm Nổi Bật
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "20px",
            width: "100%",
          }}
        >
          {mockFeaturedProducts.map((product) => (
            <ProductCard_TrangChu
              key={product.id}
              image={product.image}
              title={product.title}
              category={product.category}
              price={product.price}
            />
          ))}
        </div>
      </div>

      {/* 4. KHỐI ĐÁNH GIÁ KHÁCH HÀNG (SỬA LẠI THEO ĐÚNG HÌNH FIGMA) */}
      <div style={{ width: "100%", textAlign: "left", marginTop: "20px" }}>
        <h2
          style={{
            color: "#111",
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "20px",
            borderBottom: "1px solid #eee",
            paddingBottom: "10px",
          }}
        >
          Khách Hàng Nói Gì Về Chúng Tôi
        </h2>

        {/* Ép layout chia 3 cột nằm ngang đều nhau bằng Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "25px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {mockReviews.map((review) => (
            <div
              key={review.id}
              style={{
                background: "#fff",
                borderRadius: "10px",
                padding: "25px",
                border: "1px solid #eaeaea",
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {/* Sao đánh giá */}
              <div style={{ fontSize: "16px" }}>{review.stars}</div>

              {/* Nội dung đánh giá */}
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  color: "#444",
                  lineHeight: "1.6",
                  fontStyle: "italic",
                  flex: 1 /* Đẩy phần thông tin khách xuống đáy card nếu text ngắn */,
                }}
              >
                "{review.comment}"
              </p>

              {/* Thông tin Khách hàng (Avatar tròn, tên) */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginTop: "10px",
                }}
              >
                <img
                  src={review.avatar}
                  alt={review.name}
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <div>
                  <h4
                    style={{
                      margin: 0,
                      fontSize: "15px",
                      color: "#111",
                      fontWeight: "600",
                    }}
                  >
                    {review.name}
                  </h4>
                  <span style={{ fontSize: "12px", color: "#888" }}>
                    {review.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
