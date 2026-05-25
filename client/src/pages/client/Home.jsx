import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { tranhService } from "../../services";
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

function Home() {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách tranh từ API khi component mount
  useEffect(() => {
    const layDanhSachTranh = async () => {
      try {
        const result = await tranhService.layTatCaTranh();
        if (result.success) {
          // Lấy 4 tranh đầu tiên làm sản phẩm nổi bật
          setFeaturedProducts(result.data.slice(0, 4) || []);
        }
      } catch (err) {
        console.error("Lỗi lấy danh sách tranh:", err);
      } finally {
        setLoading(false);
      }
    };

    layDanhSachTranh();
  }, []);

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
              onClick={() => navigate("/collection")}
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
              onClick={() => navigate("/about")}
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
              "https://via.placeholder.com/550x450"
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
          {loading ? (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "40px",
              }}
            >
              <p>Đang tải sản phẩm...</p>
            </div>
          ) : featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard_TrangChu
                key={product.id}
                image={
                  product.hinhAnhChinh?.url ||
                  "https://via.placeholder.com/300x300"
                }
                title={product.ten_tranh}
                category={product.danh_muc?.ten || "Danh mục"}
                price={
                  product.gia_ban
                    ? `${Number(product.gia_ban).toLocaleString()}đ`
                    : "0đ"
                }
                onOpenDetail={() =>
                  navigate(`/chi-tiet-san-pham/${product.id}`)
                }
              />
            ))
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
