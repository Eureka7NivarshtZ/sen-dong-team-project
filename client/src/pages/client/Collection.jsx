import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard_TrangChu from "../../components/client/ProductCard";
import danhGiaService from "../../services/danhGiaService";

const svgFallback =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'><rect width='100%' height='100%' fill='%23f5f5f5'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%23b3b3b3'>Sen Dong Art Gallery</text></svg>";

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

function Collection({ products }) {
  const navigate = useNavigate();
  const { isMobile, isSmallMobile, isTablet } = useResponsive();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [danhGiaTheoTranh, setDanhGiaTheoTranh] = useState({});
  const [dangTaiDanhGia, setDangTaiDanhGia] = useState(false);

  const productList = useMemo(() => {
    return Array.isArray(products) ? products : [];
  }, [products]);

  const categories = useMemo(() => {
    const cats = new Set(
      productList.map((product) => product?.danh_muc?.ten).filter(Boolean),
    );

    return ["Tất cả", ...Array.from(cats)];
  }, [productList]);

  const filteredProducts = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    return productList.filter((product) => {
      const matchSearch = keyword
        ? product?.ten_tranh?.toLowerCase().includes(keyword) ||
          product?.mo_ta?.toLowerCase().includes(keyword)
        : true;

      const matchCategory =
        selectedCategory === "Tất cả"
          ? true
          : product?.danh_muc?.ten === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [productList, searchQuery, selectedCategory]);

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

    const layDanhGiaTheoSanPham = async () => {
      setDangTaiDanhGia(true);

      try {
        const results = await Promise.all(
          productIds.map(async (tranhId) => {
            try {
              const result = await danhGiaService.xemDanhGiaTheoTranh(tranhId);

              if (result?.success) {
                const thongTinDanhGia = tinhThongTinDanhGiaTuList(result.data);

                return [
                  String(tranhId),
                  {
                    ...thongTinDanhGia,
                    danh_sach: Array.isArray(result.data) ? result.data : [],
                  },
                ];
              }

              return [
                String(tranhId),
                {
                  saoTrungBinh: 0,
                  tongLuotDanhGia: 0,
                  danh_sach: [],
                },
              ];
            } catch (error) {
              console.error(`Lỗi lấy đánh giá tranh ${tranhId}:`, error);

              return [
                String(tranhId),
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

    layDanhGiaTheoSanPham();

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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };

  const getProductGridColumns = () => {
    if (isMobile) return "1fr";
    if (isTablet) return "repeat(2, minmax(0, 1fr))";
    return "repeat(3, minmax(0, 1fr))";
  };

  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#ffffff",
        padding: isSmallMobile
          ? "28px 16px 70px"
          : isMobile
            ? "34px 20px 80px"
            : isTablet
              ? "40px 40px 90px"
              : "40px 100px 100px",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : isTablet
              ? "230px 1fr"
              : "280px 1fr",
          gap: isMobile ? "28px" : isTablet ? "34px" : "50px",
          alignItems: "start",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <aside
          style={{
            width: isMobile ? "100%" : isTablet ? "230px" : "280px",
          }}
        >
          <div
            style={{
              position: isMobile ? "static" : "sticky",
              top: "120px",
              textAlign: "left",
              backgroundColor: "#ffffff",
              zIndex: 20,
              borderRadius: isMobile ? "14px" : "0",
              padding: isMobile ? "18px" : "0",
              boxShadow: isMobile ? "0 6px 18px rgba(0,0,0,0.06)" : "none",
              border: isMobile ? "1px solid #eef2f6" : "none",
            }}
          >
            <h1
              style={{
                fontSize: isSmallMobile ? "26px" : isMobile ? "28px" : "32px",
                fontWeight: "normal",
                color: "#111111",
                margin: isMobile ? "0 0 20px 0" : "0 0 40px 0",
              }}
            >
              Bộ sưu tập
            </h1>

            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Tìm kiếm tranh..."
              style={{
                width: "100%",
                padding: isMobile ? "12px" : "10px",
                marginBottom: isMobile ? "20px" : "30px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxSizing: "border-box",
                outline: "none",
                fontSize: "14px",
              }}
            />

            <h3
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#000000",
                margin: "0 0 16px 0",
              }}
            >
              Danh mục
            </h3>

            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: isMobile ? "flex" : "block",
                flexWrap: isMobile ? "wrap" : "nowrap",
                gap: isMobile ? "10px" : "0",
              }}
            >
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;

                return (
                  <li
                    key={cat}
                    onClick={() => handleCategoryFilter(cat)}
                    style={{
                      fontSize: "15px",
                      color: isActive ? "#fff" : "#333333",
                      backgroundColor: isActive
                        ? "#1c3f3a"
                        : isMobile
                          ? "#f2f4f7"
                          : "transparent",
                      border: isMobile
                        ? `1px solid ${isActive ? "#1c3f3a" : "#e4e7ec"}`
                        : "none",
                      borderRadius: isMobile ? "999px" : "0",
                      fontWeight: isActive ? "bold" : "normal",
                      padding: isMobile ? "8px 13px" : "8px 0",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      lineHeight: "1.5",
                      userSelect: "none",
                    }}
                  >
                    {cat}
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        <main style={{ minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: isMobile ? "flex-start" : "center",
              flexDirection: isMobile ? "column" : "row",
              gap: "8px",
              marginBottom: "22px",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#667085",
                fontSize: "14px",
              }}
            >
              Tìm thấy{" "}
              <strong style={{ color: "#1c3f3a" }}>
                {filteredProducts.length}
              </strong>{" "}
              sản phẩm
            </p>

            {dangTaiDanhGia && (
              <p
                style={{
                  margin: 0,
                  color: "#888",
                  fontSize: "13px",
                }}
              >
                Đang tải đánh giá...
              </p>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: getProductGridColumns(),
              gap: isMobile ? "24px" : "30px",
            }}
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
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
                      Xem chi tiết
                    </button>
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: isMobile ? "34px 16px" : "50px",
                  backgroundColor: "#f8fafc",
                  borderRadius: "14px",
                  border: "1px solid #eef2f6",
                }}
              >
                <div style={{ fontSize: "42px", marginBottom: "12px" }}>🖼️</div>
                <h3
                  style={{
                    margin: "0 0 8px",
                    color: "#1c3f3a",
                    fontSize: "18px",
                  }}
                >
                  Không tìm thấy sản phẩm nào
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: "#667085",
                    fontSize: "14px",
                  }}
                >
                  Hãy thử đổi từ khóa tìm kiếm hoặc chọn danh mục khác.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Collection;
