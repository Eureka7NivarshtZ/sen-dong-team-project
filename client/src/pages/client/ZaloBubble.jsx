function ZaloBubble() {
  // 🔥 Khang thay đường dẫn liên kết Zalo hoặc số điện thoại của xưởng vào đây nhé!
  const zaloUrl = "https://zalo.me/0836666644";

  return (
    <div
      onClick={() => window.open(zaloUrl, "_blank")}
      style={{
        position: "fixed",
        bottom: "30px",
        right: "30px",
        width: "60px",
        height: "60px",
        backgroundColor: "#0068ff", // Màu xanh thương hiệu Zalo
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 16px rgba(0, 104, 255, 0.4)",
        cursor: "pointer",
        zIndex: 9999, // Luôn nổi trên mọi lớp giao diện
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.15) rotate(5deg)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1) rotate(0deg)";
      }}
      title="Chat qua Zalo với Xưởng tranh Sen Đông"
    >
      {/* Biểu tượng Chat Vector màu trắng tinh tế */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
      </svg>
    </div>
  );
}

export default ZaloBubble;
