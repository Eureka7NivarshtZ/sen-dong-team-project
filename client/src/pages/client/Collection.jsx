import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { tranhService } from "../../services";
import ProductCard_TrangChu from "../../components/client/ProductCard";

const images = import.meta.glob("../../assets/*.{png,jpg,jpeg,webp}", {
  eager: true,
});

function Collection() {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Lấy danh sách tranh từ API
  useEffect(() => {
    const layDanhSachTranh = async () => {
      try {
        const result = await tranhService.layTatCaTranh();
        if (result.success) {
          setAllProducts(result.data || []);
          setFilteredProducts(result.data || []);
        }
      } catch (err) {
        console.error("Lỗi lấy danh sách tranh:", err);
      } finally {
        setLoading(false);
      }
    };

    layDanhSachTranh();
  }, []);

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = allProducts.filter((product) =>
      product.ten?.toLowerCase().includes(query) ||
      product.moTa?.toLowerCase().includes(query)
    );

    setFilteredProducts(filtered);
  };
      "Hình ảnh đàn lợn béo tròn ngộ nghĩnh thể hiện ước vọng về một cuộc sống sung túc, no đủ, ấm no cho mọi gia đình Việt.",
  },
];

function Collection() {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  const getCategories = () => {
    const cats = new Set(allProducts.map((p) => p.danhMuc?.ten).filter(Boolean));
    return ["Tất cả", ...Array.from(cats)];
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    if (category === "Tất cả") {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts.filter(
        (p) => p.danhMuc?.ten === category
      );
      setFilteredProducts(filtered);
    }
  };

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
              {getCategories().map((cat) => {
                const isActive = selectedCategory === cat;

                return (
                  <li
                    key={cat}
                    onClick={() => handleCategoryFilter(cat)}
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
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <p>Đang tải sản phẩm...</p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "30px",
              }}
            >
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard_TrangChu
                    key={product.id}
                    image={product.hinhAnhChinh?.duongDan || "https://via.placeholder.com/300x300"}
                    title={product.ten}
                    category={product.danhMuc?.ten || "Danh mục"}
                    price={product.giaBan ? `${product.giaBan.toLocaleString()}đ` : "0đ"}
                    onOpenDetail={() => navigate(`/chi-tiet-san-pham/${product.id}`)}
                  />
                ))
              ) : (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px" }}>
                  <p>Không tìm thấy sản phẩm nào</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Collection;
