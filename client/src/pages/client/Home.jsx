import { useNavigate } from "react-router-dom";
import ProductCard_TrangChu from "../../components/client/ProductCard";

// Dữ liệu mẫu hiển thị trên Trang Chủ của bạn
const images = import.meta.glob("../../assets/*.{png,jpg,jpeg,webp}", {
  eager: true,
});

// Dữ liệu mẫu Đánh giá khách hàng theo hình Figma của bạn
const mockReviews = [
  {
    id: 1,
    name: "Messi",
    role: "Cầu thủ bóng đá",
    avatar: images["../../assets/messi.png"]?.default,
    stars: "⭐⭐⭐⭐⭐",
    comment: "World Cup, Sen Đông, GOAT",
  },
  {
    id: 2,
    name: "Anh Độ Mixi",
    role: "Streamer nổi tiếng",
    avatar: images["../../assets/do-mixi.jpg"]?.default,
    stars: "⭐⭐⭐⭐⭐",
    comment: "Anh em bộ tộc hãy ủng hộ Sen Đông nhá",
  },
  {
    id: 3,
    name: "Khang Truong",
    role: "Sinh viên CNTT",
    avatar: images["../../assets/khang.png"]?.default,
    stars: "⭐⭐⭐⭐⭐",
    comment: "Nhìn những bức tranh, tôi đã nghĩ ngay đến Hạnh phúc",
  },
];

function Home({ products }) {
  const navigate = useNavigate();

  // Chuỗi mã hiệu ứng SVG dự phòng offline chạy mượt mà không cần internet
  const svgFallback = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'><rect width='100%' height='100%' fill='%23f5f5f5'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%23b3b3b3'>Sen Dong Art Gallery</text></svg>";

  // Đảm bảo products luôn luôn là một mảng để phòng ngừa lỗi đơ giao diện
  const productList = Array.isArray(products) ? products : [];

  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* ================= KHỐI 1: BANNER HERO (CHỮ TRÁI - HÌNH PHẢI) ================= */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#fff",
          padding: "60px 80px",
          gap: "40px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div style={{ flex: 1, textAlign: "left" }}>
          <h1
            style={{
              fontSize: "46px",
              fontWeight: "bold",
              color: "#1c3f3a",
              lineHeight: "1.2",
              margin: "0 0 20px 0",
            }}
          >
            Nghệ thuật đẹp <br /> từng nét vẽ
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: "#666",
              lineHeight: "1.6",
              margin: "0 0 30px 0",
              maxWidth: "450px",
            }}
          >
            Mỗi bức tranh tại Sen Đông là một tác phẩm độc bản, khám phá bộ sưu
            tập phong phú từ sơn dầu đến màu nước.
          </p>
          <div style={{ display: "flex", gap: "15px" }}>
            <button
              onClick={() => navigate("/tranh")}
              style={{
                padding: "12px 24px",
                backgroundColor: "#39b441",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                fontSize: "15px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Khám phá bộ sưu tập &rarr;
            </button>
            <button
              onClick={() => navigate("/gioi-thieu")}
              style={{
                padding: "12px 24px",
                backgroundColor: "#a1a1a1",
                color: "#111",
                border: "none",
                borderRadius: "4px",
                fontSize: "15px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Xem về chúng tôi
            </button>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <img
            src={
              images["../../assets/banner.png"]?.default ||
              "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='520' height='400' viewBox='0 0 520 400'><rect width='100%' height='100%' fill='%23fafafa'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='%23ccc'>Sen Dong Banner</text></svg>"
            }
            alt="Banner Sen Đông"
            style={{
              width: "100%",
              maxWidth: "520px",
              height: "auto",
              objectFit: "cover",
            }}
          />
        </div>
      </div>

      {/* ================= KHỐI 2: VÌ SAO NÊN CHỌN SEN ĐÔNG (NỀN XANH NHẠT) ================= */}
      <div
        style={{
          backgroundColor: "#edf5f1",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            color: "#1c3f3a",
            fontSize: "28px",
            fontWeight: "bold",
            margin: "0 0 8px 0",
          }}
        >
          Vì sao nên chọn Sen Đông
        </h2>
        <p style={{ color: "#666", fontSize: "14px", margin: "0 0 40px 0" }}>
          Chất lượng nghệ thuật được đặt lên hàng đầu
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "30px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {/* Thẻ 1 */}
          <div
            style={{
              background: "#fff",
              padding: "40px 20px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.01)",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "15px" }}>🎨</div>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#111",
                margin: "0 0 10px 0",
              }}
            >
              Tranh thủ công
            </h3>
            <p
              style={{
                fontSize: "13px",
                color: "#888",
                margin: 0,
                lineHeight: "1.6",
              }}
            >
              100% vẽ tay bởi họa sĩ có bằng cấp, không in ấn công nghiệp
            </p>
          </div>
          {/* Thẻ 2 */}
          <div
            style={{
              background: "#fff",
              padding: "40px 20px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.01)",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "15px" }}>🚚</div>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#111",
                margin: "0 0 10px 0",
              }}
            >
              Giao hàng an toàn
            </h3>
            <p
              style={{
                fontSize: "13px",
                color: "#888",
                margin: 0,
                lineHeight: "1.6",
              }}
            >
              Đóng gói chuyên dụng, bảo hiểm 100% giá trị
            </p>
          </div>
          {/* Thẻ 3 */}
          <div
            style={{
              background: "#fff",
              padding: "40px 20px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.01)",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "15px" }}>🔄</div>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#111",
                margin: "0 0 10px 0",
              }}
            >
              Hoàn trả dễ dàng
            </h3>
            <p
              style={{
                fontSize: "13px",
                color: "#888",
                margin: 0,
                lineHeight: "1.6",
              }}
            >
              Đổi trả trong 7 ngày nếu không hài lòng
            </p>
          </div>
        </div>
      </div>

      {/* ================= KHỐI 3: PHỔ BIẾN (DANH SÁCH SẢN PHẨM) ================= */}
      <div
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 20px" }}
      >
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#1c3f3a",
              margin: "0 0 8px 0",
            }}
          >
            Phổ biến
          </h2>
          <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>
            Sản phẩm bán chạy nhất của chúng tôi có thể bạn sẽ thích
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "25px",
          }}
        >
          {productList.length > 0 ? (
            productList.map((product) => {
              // 🌟 ĐÃ SỬA: Tìm ảnh chính la_chinh hoặc bốc phần tử đầu tiên trong mảng hinh_anh của Database
              const hinhAnhChinh =
                product.hinh_anh?.find((h) => h.la_chinh) ||
                product.hinh_anh?.[0];

              return (
                <ProductCard_TrangChu
                  key={product.id}
                  image={hinhAnhChinh?.url || svgFallback} // Sử dụng SVG nếu tranh trống ảnh
                  title={product.ten_tranh}
                  category={product.danh_muc?.ten || "Danh mục"}
                  price={
                    product.gia_ban
                      ? `${Number(product.gia_ban).toLocaleString()}đ`
                      : "0đ"
                  }
                  onOpenDetail={() => navigate(`/tranh/${product.id}`)}
                />
              );
            })
          ) : (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "40px",
              }}
            >
              <p>Không có sản phẩm nào</p>
            </div>
          )}
        </div>
      </div>

      {/* ================= KHỐI 4: ĐÁNH GIÁ (NỀN XANH NHẠT) ================= */}
      <div
        style={{
          backgroundColor: "#edf5f1",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            color: "#1c3f3a",
            fontSize: "28px",
            fontWeight: "bold",
            margin: "0 0 8px 0",
          }}
        >
          Đánh giá
        </h2>
        <p style={{ color: "#666", fontSize: "14px", margin: "0 0 40px 0" }}>
          Một số đánh giá tích cực từ những khách hàng hài lòng của chúng tôi
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "30px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {mockReviews.map((review) => (
            <div
              key={review.id}
              style={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                padding: "35px 25px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                boxShadow: "0 4px 15px rgba(0,0,0,0.01)",
              }}
            >
              <img
                src={review.avatar}
                alt={review.name}
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginBottom: "12px",
                }}
              />

              <div
                style={{
                  fontSize: "14px",
                  color: "#ffb400",
                  marginBottom: "15px",
                }}
              >
                {review.stars}
              </div>

              <p
                style={{
                  fontSize: "14px",
                  color: "#444",
                  lineHeight: "1.6",
                  margin: "0 0 15px 0",
                  textAlign: "center",
                  flex: 1,
                }}
              >
                {review.comment}
              </p>

              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#555",
                  margin: 0,
                }}
              >
                {review.name}
              </h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;