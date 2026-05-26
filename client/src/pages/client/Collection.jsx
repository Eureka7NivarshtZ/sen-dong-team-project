import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard_TrangChu from "../../components/client/ProductCard";

function Collection({ products }) {
  const navigate = useNavigate();

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  useEffect(() => {
    setFilteredProducts(products || []);
  }, [products]);

  const getCategories = () => {
    const cats = new Set(products.map((p) => p.danh_muc?.ten).filter(Boolean));

    return ["Tất cả", ...Array.from(cats)];
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = products.filter(
      (product) =>
        product.ten_tranh?.toLowerCase().includes(query) ||
        product.mo_ta?.toLowerCase().includes(query),
    );

    setFilteredProducts(filtered);
    setSelectedCategory("Tất cả");
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);

    if (category === "Tất cả") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((p) => p.danh_muc?.ten === category);

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
        <aside style={{ width: "280px" }}>
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

            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Tìm kiếm tranh..."
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "30px",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            />

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
                  >
                    {cat}
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        <main style={{ minWidth: 0 }}>
          {
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "30px",
              }}
            >
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const hinhAnhChinh =
                    product.hinh_anh?.find((h) => h.la_chinh) ||
                    product.hinh_anh?.[0];
                  return (
                    <ProductCard_TrangChu
                      key={product.id}
                      image={
                        hinhAnhChinh?.url ||
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
                        navigate(`/tranh/${product.id}`)
                      }
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
                  <p>Không tìm thấy sản phẩm nào</p>
                </div>
              )}
            </div>
          }
        </main>
      </div>
    </div>
  );
}

export default Collection;
