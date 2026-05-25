import React from "react";

function ProductCard_TrangChu({ image, title, category, price, onOpenDetail }) {
  return (
    <div
      onClick={onOpenDetail}
      style={{
        height: "390px",
        border: "1px solid #eaeaea",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
        backgroundColor: "#fff",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.03)";
      }}
    >
      {/* ẢNH SẢN PHẨM */}
      <div
        style={{
          width: "100%",
          height: "200px",
          backgroundColor: "#f9f9f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <img
          src={
            image ||
            "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500"
          }
          alt={title}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      {/* NỘI DUNG */}
      <div
        style={{
          padding: "15px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            color: "#95a5a6",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            minHeight: "30px",
            display: "block",
          }}
        >
          {category}
        </span>

        <h4
          style={{
            margin: "5px 0 10px 0",
            fontSize: "15px",
            color: "#2c3e50",
            fontWeight: "600",
            lineHeight: "1.4",
            minHeight: "42px",
            maxHeight: "42px",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {title}
        </h4>

        {/* ĐẨY GIÁ + BUTTON XUỐNG DƯỚI */}
        <div style={{ marginTop: "auto" }}>
          <div
            style={{
              fontWeight: "bold",
              color: "#faa22f",
              fontSize: "16px",
              padding: "8px 0 12px",
            }}
          >
            {price}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail?.();
            }}
            style={{
              width: "100%",
              height: "36px",
              backgroundColor: "#111",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "500",
            }}
          >
            + Thêm sản phẩm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard_TrangChu;