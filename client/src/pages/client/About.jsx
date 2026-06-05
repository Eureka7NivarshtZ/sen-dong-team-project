import React, { useEffect, useState } from "react";

const images = import.meta.glob("../../assets/*.{png,jpg,jpeg,webp}", {
  eager: true,
});

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
    isMobile: width <= 768,
    isSmallMobile: width <= 480,
    isTablet: width > 768 && width <= 1024,
  };
}

function About() {
  const { isMobile, isSmallMobile, isTablet } = useResponsive();

  const partners = [
    {
      id: 1,
      name: "My lover",
      image:
        images["../../assets/partner1.png"]?.default ||
        "https://via.placeholder.com/180x70?text=Logo+1",
      alt: "Đối tác 1",
    },
    {
      id: 2,
      name: "Đại học Công nghệ Sài Gòn",
      image:
        images["../../assets/partner2.png"]?.default ||
        "https://via.placeholder.com/180x70?text=Logo+2",
      alt: "Đối tác 2",
    },
    {
      id: 3,
      name: "Mùa đông NoEm",
      image:
        images["../../assets/partner3.png"]?.default ||
        "https://via.placeholder.com/180x70?text=Logo+3",
      alt: "Đối tác 3",
    },
    {
      id: 4,
      name: "StarFrog",
      image:
        images["../../assets/partner4.png"]?.default ||
        "https://via.placeholder.com/180x70?text=Logo+4",
      alt: "Đối tác 4",
    },
  ];

  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#ffffff",
        padding: isMobile ? "38px 0 0 0" : "60px 0 0 0",
        overflowX: "hidden",
      }}
    >
      {/* KHUNG CHỨA NỘI DUNG TRÊN */}
      <div
        style={{
          padding: isSmallMobile
            ? "0 16px 50px"
            : isMobile
              ? "0 22px 60px"
              : isTablet
                ? "0 50px 70px"
                : "0 100px 80px",
          boxSizing: "border-box",
        }}
      >
        {/* TIÊU ĐỀ */}
        <div
          style={{
            textAlign: "center",
            marginBottom: isMobile ? "38px" : "60px",
          }}
        >
          <h1
            style={{
              fontSize: isSmallMobile ? "24px" : isMobile ? "26px" : "32px",
              fontWeight: "bold",
              color: "#40b652",
              margin: 0,
              lineHeight: 1.4,
              wordBreak: "break-word",
            }}
          >
            {isMobile
              ? "Giới thiệu"
              : "------------------- Giới thiệu -------------------"}
          </h1>
        </div>

        {/* KHỐI GIỚI THIỆU */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1.2fr 0.8fr",
            gap: isMobile ? "36px" : isTablet ? "50px" : "80px",
            alignItems: "center",
            textAlign: "left",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              fontSize: isMobile ? "15px" : "16px",
              lineHeight: "1.8",
              color: "#333333",
              textAlign: isMobile ? "justify" : "left",
            }}
          >
            <p style={{ margin: 0 }}>
              <strong>Sen Đông</strong> chuyên cung cấp các dòng tranh decor
              nghệ thuật cao cấp như tranh canvas, tranh sơn dầu,… góp phần
              mang đến vẻ đẹp tinh tế và sang trọng cho mọi không gian sống.{" "}
              <br />
              <br />
              Nếu bạn đang xây dựng tổ ấm mới, cải tạo nhà cửa, văn phòng, cửa
              hàng hay không gian kinh doanh, <strong>Sen Đông</strong> sẽ là
              lựa chọn phù hợp để tạo điểm nhấn thẩm mỹ và nâng tầm không gian.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              order: isMobile ? -1 : 0,
            }}
          >
            <img
              src={images["../../assets/logo.png"]?.default || "/src/assets/logo.png"}
              alt="Logo Sen Đông"
              style={{
                maxWidth: isSmallMobile
                  ? "260px"
                  : isMobile
                    ? "340px"
                    : isTablet
                      ? "420px"
                      : "750px",
                width: "100%",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </div>
        </div>
      </div>

      {/* KHỐI ĐỐI TÁC */}
      <div
        style={{
          backgroundColor: "#6fb592",
          padding: isSmallMobile
            ? "42px 16px 56px"
            : isMobile
              ? "48px 22px 64px"
              : isTablet
                ? "56px 50px 72px"
                : "60px 100px 80px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: isSmallMobile ? "22px" : isMobile ? "24px" : "26px",
              fontWeight: "bold",
              color: "#ffffff",
              margin: "0 0 42px",
              letterSpacing: "0.5px",
              lineHeight: 1.35,
            }}
          >
            Được tin tưởng bởi các đối tác
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isSmallMobile
                ? "1fr"
                : isMobile
                  ? "repeat(2, 1fr)"
                  : isTablet
                    ? "repeat(2, 1fr)"
                    : "repeat(4, 1fr)",
              gap: isSmallMobile ? "28px" : isMobile ? "30px" : "50px",
              alignItems: "stretch",
            }}
          >
            {partners.map((partner) => (
              <div
                key={partner.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "15px",
                  backgroundColor: "rgba(255,255,255,0.08)",
                  borderRadius: "14px",
                  padding: isMobile ? "22px 14px" : "18px 12px",
                  minHeight: isMobile ? "145px" : "135px",
                }}
              >
                <img
                  src={partner.image}
                  alt={partner.alt}
                  style={{
                    height: isSmallMobile ? "56px" : isMobile ? "60px" : "65px",
                    width: "auto",
                    maxWidth: "100%",
                    objectFit: "contain",
                    borderRadius: "12%",
                  }}
                />

                <span
                  style={{
                    fontSize: isMobile ? "14px" : "15px",
                    color: "#eeeeee",
                    fontWeight: "500",
                    lineHeight: 1.4,
                  }}
                >
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;