import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard_TrangChu from "../../components/client/ProductCard";
import danhGiaService from "../../services/danhGiaService";

const images = import.meta.glob("../../assets/*.{png,jpg,jpeg,webp}", {
  eager: true,
});

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
    width,
    isMobile: width <= 768,
    isSmallMobile: width <= 480,
    isTablet: width > 768 && width <= 1024,
  };
}

function tinhThongTinDanhGiaTuList(danhSachDanhGia = []) {
  if (!Array.isArray(danhSachDanhGia) || danhSachDanhGia.length === 0) {
    return {
      saoTrungBinh: 0,
      tongLuotDanhGia: 0,
    };
  }

  const tongSao = danhSachDanhGia.reduce((total, item) => {
    return total + Number(item?.so_sao || 0);
  }, 0);

  return {
    saoTrungBinh: tongSao / danhSachDanhGia.length,
    tongLuotDanhGia: danhSachDanhGia.length,
  };
}

function Home({ products }) {
  const navigate = useNavigate();
  const { isMobile, isSmallMobile, isTablet } = useResponsive();

  const [danhGiaTheoTranh, setDanhGiaTheoTranh] = useState({});
  const [dangTaiDanhGia, setDangTaiDanhGia] = useState(false);

  const svgFallback =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'><rect width='100%' height='100%' fill='%23f5f5f5'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%23b3b3b3'>Sen Dong Art Gallery</text></svg>";

  const productList = Array.isArray(products) ? products : [];

  const productIdsKey = useMemo(() => {
    return productList
      .map((product) => product?.id)
      .filter(Boolean)
      .join("|");
  }, [productList]);

  useEffect(() => {
    const productIds = productIdsKey.split("|").filter(Boolean);

    if (productIds.length === 0) {
      setDanhGiaTheoTranh({});
      return;
    }

    let isMounted = true;

    const layDanhGiaChoTrangChu = async () => {
      setDangTaiDanhGia(true);

      try {
        const results = await Promise.all(
          productIds.map(async (tranhId) => {
            try {
              const result = await danhGiaService.xemDanhGiaTheoTranh(tranhId);

              if (result?.success) {
                const thongTinDanhGia = tinhThongTinDanhGiaTuList(result.data);

                return [
                  tranhId,
                  {
                    ...thongTinDanhGia,
                    danh_sach: Array.isArray(result.data) ? result.data : [],
                  },
                ];
              }

              return [
                tranhId,
                {
                  saoTrungBinh: 0,
                  tongLuotDanhGia: 0,
                  danh_sach: [],
                },
              ];
            } catch (error) {
              console.error(`Lỗi lấy đánh giá tranh ${tranhId}:`, error);

              return [
                tranhId,
                {
                  saoTrungBinh: 0,
                  tongLuotDanhGia: 0,
                  danh_sach: [],
                },
              ];
            }
          }),
        );

        if (isMounted) {
          setDanhGiaTheoTranh(Object.fromEntries(results));
        }
      } finally {
        if (isMounted) {
          setDangTaiDanhGia(false);
        }
      }
    };

    layDanhGiaChoTrangChu();

    return () => {
      isMounted = false;
    };
  }, [productIdsKey]);

  const getProductRating = (product) => {
    const danhGiaTuApi = danhGiaTheoTranh[String(product.id)];

    if (danhGiaTuApi && danhGiaTuApi.tongLuotDanhGia > 0) {
      return {
        saoTrungBinh: Number(danhGiaTuApi.saoTrungBinh || 0),
        tongLuotDanhGia: Number(danhGiaTuApi.tongLuotDanhGia || 0),
      };
    }

    const saoTuProduct = Number(
      product?.trung_binh_sao || product?.rating_trung_binh || 0,
    );

    const luotTuProduct = Number(
      product?.so_luot_danh_gia || product?.tong_danh_gia || 0,
    );

    return {
      saoTrungBinh: saoTuProduct,
      tongLuotDanhGia: luotTuProduct,
    };
  };

  const getProductGridColumns = () => {
    if (isMobile) return "1fr";
    if (isTablet) return "repeat(2, 1fr)";
    return "repeat(4, 1fr)";
  };

  const getFeatureGridColumns = () => {
    if (isMobile) return "1fr";
    if (isTablet) return "repeat(2, 1fr)";
    return "repeat(3, 1fr)";
  };

  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* ================= KHỐI 1: BANNER HERO ================= */}
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#fff",
          padding: isSmallMobile
            ? "36px 16px"
            : isMobile
              ? "42px 20px"
              : isTablet
                ? "50px 32px"
                : "60px 80px",
          gap: isMobile ? "28px" : "40px",
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: isMobile ? "center" : "left",
        }}
      >
        <div style={{ flex: 1, textAlign: isMobile ? "center" : "left" }}>
          <h1
            style={{
              fontSize: isSmallMobile ? "32px" : isMobile ? "36px" : "46px",
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
              fontSize: isMobile ? "14px" : "15px",
              color: "#666",
              lineHeight: "1.6",
              margin: isMobile ? "0 auto 26px" : "0 0 30px 0",
              maxWidth: "450px",
            }}
          >
            Mỗi bức tranh tại Sen Đông là một tác phẩm độc bản, khám phá bộ sưu
            tập phong phú từ sơn dầu đến màu nước.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: isSmallMobile ? "column" : "row",
              gap: "15px",
              justifyContent: isMobile ? "center" : "flex-start",
              width: isSmallMobile ? "100%" : "auto",
            }}
          >
            <button
              onClick={() => navigate("/tranh")}
              style={{
                padding: "12px 24px",
                backgroundColor: "#39b441",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontSize: "15px",
                fontWeight: "bold",
                cursor: "pointer",
                width: isSmallMobile ? "100%" : "auto",
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
                borderRadius: "6px",
                fontSize: "15px",
                fontWeight: "bold",
                cursor: "pointer",
                width: isSmallMobile ? "100%" : "auto",
              }}
            >
              Xem về chúng tôi
            </button>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <img
            src={
              images["../../assets/banner.png"]?.default ||
              "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='520' height='400' viewBox='0 0 520 400'><rect width='100%' height='100%' fill='%23fafafa'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='%23ccc'>Sen Dong Banner</text></svg>"
            }
            alt="Banner Sen Đông"
            style={{
              width: "100%",
              maxWidth: isMobile ? "420px" : "520px",
              height: "auto",
              objectFit: "cover",
            }}
          />
        </div>
      </div>

      {/* ================= KHỐI 2: VÌ SAO NÊN CHỌN SEN ĐÔNG ================= */}
      <div
        style={{
          backgroundColor: "#edf5f1",
          padding: isMobile ? "46px 16px" : "60px 20px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            color: "#1c3f3a",
            fontSize: isMobile ? "24px" : "28px",
            fontWeight: "bold",
            margin: "0 0 8px 0",
          }}
        >
          Vì sao nên chọn Sen Đông
        </h2>

        <p
          style={{
            color: "#666",
            fontSize: "14px",
            margin: "0 0 40px 0",
          }}
        >
          Chất lượng nghệ thuật được đặt lên hàng đầu
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: getFeatureGridColumns(),
            gap: isMobile ? "18px" : "30px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <FeatureCard
            icon="🎨"
            title="Tranh thủ công"
            description="100% vẽ tay bởi họa sĩ có bằng cấp, không in ấn công nghiệp"
          />

          <FeatureCard
            icon="🚚"
            title="Giao hàng an toàn"
            description="Đóng gói chuyên dụng, bảo hiểm 100% giá trị"
          />

          <FeatureCard
            icon="🔄"
            title="Hoàn trả dễ dàng"
            description="Đổi trả trong 7 ngày nếu không hài lòng"
          />
        </div>
      </div>

      {/* ================= KHỐI 3: PHỔ BIẾN + ĐÁNH GIÁ THẬT ================= */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: isMobile ? "46px 16px" : "60px 20px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2
            style={{
              fontSize: isMobile ? "24px" : "28px",
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

          {dangTaiDanhGia && (
            <p
              style={{
                color: "#888",
                fontSize: "13px",
                margin: "10px 0 0",
              }}
            >
              Đang tải đánh giá sản phẩm...
            </p>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: getProductGridColumns(),
            gap: isMobile ? "22px" : "25px",
          }}
        >
          {productList.length > 0 ? (
            productList.map((product) => {
              const hinhAnhChinh =
                product.hinh_anh?.find((h) => h.la_chinh) ||
                product.hinh_anh?.[0];

              const { saoTrungBinh, tongLuotDanhGia } =
                getProductRating(product);

              const coDanhGia = tongLuotDanhGia > 0;

              return (
                <div
                  key={product.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  <ProductCard_TrangChu
                    image={hinhAnhChinh?.url || svgFallback}
                    title={product.ten_tranh}
                    category={product.danh_muc?.ten || "Danh mục"}
                    price={
                      product.gia_ban
                        ? `${Number(product.gia_ban).toLocaleString()}đ`
                        : "0đ"
                    }
                    onOpenDetail={() => navigate(`/tranh/${product.id}`)}
                  />

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "5px",
                      fontSize: "13px",
                      marginTop: "8px",
                      color: "#ff9800",
                      padding: "0 4px",
                      minHeight: "22px",
                    }}
                  >
                    {coDanhGia ? (
                      <>
                        <span style={{ fontSize: "15px" }}>★</span>
                        <span style={{ fontWeight: "bold", color: "#333" }}>
                          {Number(saoTrungBinh).toFixed(1)}
                        </span>
                        <span style={{ color: "#888" }}>
                          ({tongLuotDanhGia} đánh giá)
                        </span>
                      </>
                    ) : (
                      <span style={{ color: "#888" }}>Chưa có đánh giá</span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/tranh/${product.id}`)}
                    style={{
                      marginTop: "10px",
                      padding: "9px 12px",
                      borderRadius: "6px",
                      border: "1px solid #1c3f3a",
                      backgroundColor: "#fff",
                      color: "#1c3f3a",
                      fontWeight: "bold",
                      fontSize: "13px",
                      cursor: "pointer",
                      width: isMobile ? "100%" : "fit-content",
                    }}
                  >
                    Xem chi tiết đánh giá
                  </button>
                </div>
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

      {/* ================= KHỐI 4: ĐÁNH GIÁ TỪ KHÁCH HÀNG ================= */}
      <div
        style={{
          backgroundColor: "#edf5f1",
          padding: isMobile ? "46px 16px" : "60px 20px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            color: "#1c3f3a",
            fontSize: isMobile ? "24px" : "28px",
            fontWeight: "bold",
            margin: "0 0 8px 0",
          }}
        >
          Đánh giá
        </h2>

        <p
          style={{
            color: "#666",
            fontSize: "14px",
            margin: "0 0 40px 0",
          }}
        >
          Một số đánh giá tích cực từ những khách hàng hài lòng của chúng tôi
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: getFeatureGridColumns(),
            gap: isMobile ? "18px" : "30px",
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
                padding: isMobile ? "28px 20px" : "35px 25px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
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

              <p
                style={{
                  fontSize: "12px",
                  color: "#999",
                  margin: "6px 0 0",
                }}
              >
                {review.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "40px 20px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
      }}
    >
      <div style={{ fontSize: "32px", marginBottom: "15px" }}>{icon}</div>

      <h3
        style={{
          fontSize: "16px",
          fontWeight: "bold",
          color: "#111",
          margin: "0 0 10px 0",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: "13px",
          color: "#888",
          margin: 0,
          lineHeight: "1.6",
        }}
      >
        {description}
      </p>
    </div>
  );
}

export default Home;
