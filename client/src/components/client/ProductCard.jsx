import React from "react";

function ProductCard({ image, title, category, price, onOpenDetail }) {
  // Chuỗi mã SVG offline làm ảnh dự phòng cực an toàn
  const svgFallback = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'><rect width='100%' height='100%' fill='%23f5f5f5'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%23b3b3b3'>Sen Dong Art Gallery</text></svg>";

  return (
    <div 
      onClick={onOpenDetail}
      style={{ 
        border: "1px solid #eee", 
        borderRadius: "8px", 
        padding: "15px", 
        backgroundColor: "#fff", 
        cursor: "pointer",
        textAlign: "left",
        transition: "transform 0.2s"
      }}
    >
      <div style={{ width: "100%", height: "250px", backgroundColor: "#f9f9f9", overflow: "hidden", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img 
          src={image || svgFallback} 
          alt={title} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = svgFallback;
          }}
          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
        />
      </div>
      <div style={{ marginTop: "12px" }}>
        <span style={{ fontSize: "12px", color: "#888", uppercase: "true" }}>{category}</span>
        <h4 style={{ margin: "4px 0 8px 0", fontSize: "16px", fontWeight: "bold", color: "#111" }}>{title}</h4>
        <div style={{ color: "#1c9b61", fontWeight: "bold" }}>{price}</div>
      </div>
    </div>
  );
}

export default ProductCard;