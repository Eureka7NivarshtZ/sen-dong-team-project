import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  const footerStyle = {
    backgroundColor: "#000000",
    color: "#fff",
    padding: "50px 8% 25px 8%",
    marginTop: "60px",
    width: "100%",
    boxSizing: "border-box",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr",
    gap: "40px",
    alignItems: "start",
  };

  const logoStyle = {
    width: "240px",
    maxWidth: "100%",
    height: "auto",
    marginBottom: "15px",
    objectFit: "contain",
  };

  const titleStyle = {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "18px",
    color: "#fff",
  };

  const textStyle = {
    color: "#aaa",
    fontSize: "14px",
    margin: "0 0 10px 0",
    lineHeight: "1.6",
  };

  const linkStyle = {
    ...textStyle,
    cursor: "pointer",
    display: "block",
    textDecoration: "none",
  };

  return (
    <>
      <footer className="footer-sen-dong" style={footerStyle}>
        <div className="footer-grid" style={gridStyle}>
          {/* CỘT 1: LOGO VÀ SLOGAN */}
          <div className="footer-brand" style={{ textAlign: "left" }}>
            <img
              src="/src/assets/logo_darkstyle.jpg"
              alt="Sen Đông Logo"
              style={logoStyle}
            />

            <p style={{ color: "#aaa", fontSize: "14px", margin: 0 }}>
              Sen Đông - Mỗi bức tranh, một cảm xúc
            </p>
          </div>

          {/* CỘT 2: HỖ TRỢ KHÁCH HÀNG */}
          <div style={{ textAlign: "left" }}>
            <h4 style={titleStyle}>Hỗ Trợ Khách Hàng</h4>

            <Link to="/chinh-sach-bao-hanh" style={linkStyle}>
              Chính sách bảo hành khung tranh
            </Link>

            <Link to="/huong-dan-chon-kich-thuoc" style={linkStyle}>
              Hướng dẫn chọn kích thước tranh
            </Link>
          </div>

          {/* CỘT 3: THÔNG TIN LIÊN HỆ */}
          <div style={{ textAlign: "left" }}>
            <h4 style={titleStyle}>Liên Hệ Xưởng</h4>

            <p style={textStyle}>📍 Địa chỉ: STU, Ho Chi Minh City</p>
            <p style={{ ...textStyle, margin: 0 }}>📞 Hotline: 093 xxxx xxx</p>
          </div>
        </div>

        {/* DÒNG COPYRIGHT PHÍA DƯỚI */}
        <div
          className="footer-copyright"
          style={{
            textAlign: "left",
            borderTop: "1px solid #222",
            marginTop: "40px",
            paddingTop: "20px",
            fontSize: "13px",
            color: "#666",
          }}
        >
          ©SenDong All Rights Reserved.
        </div>
      </footer>

      <style>
        {`
          @media (max-width: 1024px) {
            .footer-sen-dong {
              padding: 44px 6% 24px 6% !important;
            }

            .footer-grid {
              grid-template-columns: 1.5fr 1fr 1fr !important;
              gap: 28px !important;
            }

            .footer-brand img {
              width: 210px !important;
            }
          }

          @media (max-width: 768px) {
            .footer-sen-dong {
              padding: 40px 22px 24px 22px !important;
              margin-top: 40px !important;
            }

            .footer-grid {
              grid-template-columns: 1fr !important;
              gap: 30px !important;
            }

            .footer-brand {
              text-align: center !important;
            }

            .footer-brand img {
              width: 190px !important;
              margin-left: auto !important;
              margin-right: auto !important;
              display: block !important;
            }

            .footer-copyright {
              text-align: center !important;
              margin-top: 30px !important;
            }
          }

          @media (max-width: 480px) {
            .footer-sen-dong {
              padding: 34px 16px 22px 16px !important;
            }

            .footer-brand img {
              width: 170px !important;
            }

            .footer-sen-dong h4 {
              font-size: 15px !important;
              margin-bottom: 12px !important;
            }

            .footer-sen-dong p,
            .footer-sen-dong a {
              font-size: 13px !important;
            }
          }
        `}
      </style>
    </>
  );
}

export default Footer;
