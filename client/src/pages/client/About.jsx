import React from "react";

// Tự động quét hình ảnh trong thư mục assets để lấy logo đối tác và logo chính
const images = import.meta.glob("../../assets/*.{png,jpg,jpeg,webp}", {
  eager: true,
});

function About() {
  return (
    <div 
      style={{ 
        width: "100%", 
        boxSizing: "border-box", 
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#ffffff",
        padding: "60px 0 0 0" // Để khoảng trống padding-bottom cho khối nền xanh bên dưới bao phủ
      }}
    >
      {/* KHUNG CHỨA NỘI DUNG TRÊN (GIỚI THIỆU + VỀ CHÚNG TÔI) */}
      <div style={{ padding: "0 100px 80px 100px", boxSizing: "border-box" }}>
        {/* 1. TIÊU ĐỀ "Giới thiệu" MÀU ĐEN CĂN RA GIỮA */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#40b652", margin: 0 }}>
            ------------------- Giới thiệu -------------------
          </h1>
        </div>

        {/* 2. KHỐI NỘI DUNG CHIA 2 BÊN (1 BÊN ĐOẠN TEXT - 1 BÊN LOGO SENDONG) */}
        <div 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "1.2fr 0.8fr", 
            gap: "80px",
            alignItems: "center",
            textAlign: "left",
            maxWidth: "1200px",
            margin: "0 auto"
          }}
        >
          {/* Bên trái: Đoạn text chuẩn */}
          <div style={{ fontSize: "16px", lineHeight: "1.8", color: "#333333" }}>
            <p style={{ margin: 0 }}>
              <strong>Sen Đông</strong> chuyên cung cấp các dòng tranh decor nghệ thuật cao cấp như tranh canvas, tranh sơn dầu,… góp phần mang đến vẻ đẹp tinh tế và sang trọng cho mọi không gian sống. <br /> Nếu bạn đang xây dựng tổ ấm mới, cải tạo nhà cửa, văn phòng, cửa hàng hay không gian kinh doanh, <strong>Sen Đông</strong> sẽ là lựa chọn phù hợp để tạo điểm nhấn thẩm mỹ và nâng tầm không gian.
            </p>
          </div>

          {/* Bên phải: Logo Sen Đông */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <img 
              src={images["../../assets/logo.png"]?.default || "/src/assets/logo.png"} 
              alt="Logo Sen Đông" 
              style={{ maxWidth: "750px", width: "100%", height: "auto", objectFit: "contain" }} 
            />
          </div>
        </div>
      </div>

      {/* 3. KHỐI ĐỐI TÁC - ĐÃ ĐỔI MÀU NỀN XANH LỤC ĐẬM FULL ĐÁY VÀ PHÓNG TO LOGO */}
      <div 
        style={{ 
          backgroundColor: "#6fb592", // Màu xanh lục đậm chuẩn theo hình ảnh thiết kế
          padding: "60px 100px 80px 100px",
          width: "100%",
          boxSizing: "border-box"
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
          <h2 
            style={{ 
              fontSize: "26px", 
              fontWeight: "bold", 
              color: "#ffffff", // Chuyển chữ sang màu trắng để nổi bật trên nền xanh
              marginBottom: "50px",
              letterSpacing: "0.5px"
            }}
          >
            Được tin tưởng bởi các đối tác
          </h2>
          
          {/* Hàng ngang chứa 4 đối tác với LOGO LỚN HƠN */}
          <div 
            style={{ 
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "50px",
              alignItems: "center"
            }}
          >
            {/* Đối tác 1 */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "15px" }}>
              <img 
                src={images["../../assets/partner1.png"]?.default || "https://via.placeholder.com/180x70?text=Logo+1"} 
                alt="Đối tác 1" 
                style={{ height: "65px", width: "auto", maxWidth: "100%", objectFit: "contain", borderRadius: "12%" }} // Tăng height từ 45px lên 65px cho logo lớn rõ ràng
              />
              <span style={{ fontSize: "15px", color: "#eeeeee", fontWeight: "500" }}>My lover</span>
            </div>

            {/* Đối tác 2 */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "15px" }}>
              <img 
                src={images["../../assets/partner2.png"]?.default || "https://via.placeholder.com/180x70?text=Logo+2"} 
                alt="Đối tác 2" 
                style={{ height: "65px", width: "auto", maxWidth: "100%", objectFit: "contain", borderRadius: "12%" }} 
              />
              <span style={{ fontSize: "15px", color: "#eeeeee", fontWeight: "500" }}>Đại học Công nghệ Sài Gòn</span>
            </div>

            {/* Đối tác 3 */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "15px" }}>
              <img 
                src={images["../../assets/partner3.png"]?.default || "https://via.placeholder.com/180x70?text=Logo+3"} 
                alt="Đối tác 3" 
                style={{ height: "65px", width: "auto", maxWidth: "100%", objectFit: "contain", borderRadius: "12%" }} 
              />
              <span style={{ fontSize: "15px", color: "#eeeeee", fontWeight: "500" }}>Mùa đông NoEm</span>
            </div>

            {/* Đối tác 4 */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "15px" }}>
              <img 
                src={images["../../assets/partner4.png"]?.default || "https://via.placeholder.com/180x70?text=Logo+4"} 
                alt="Đối tác 4" 
                style={{ height: "65px", width: "auto", maxWidth: "100%", objectFit: "contain", borderRadius: "12%" }} 
              />
              <span style={{ fontSize: "15px", color: "#eeeeee", fontWeight: "500" }}>StarFrog</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default About;