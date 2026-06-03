import React, { useState, useEffect } from "react";
import { chamSocKhachHangService } from "../../services";

function CustomerCare() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    taiDanhSachHoTro();
  }, []);

  const taiDanhSachHoTro = async () => {
    setLoading(true);
    const res = await chamSocKhachHangService.layDanhSachTinNhanAdmin();
    if (res && res.success) {
      const data = res.data || [];
      setTickets(data);
      if (data.length > 0 && !selectedTicket) {
        setSelectedTicket(data[0]);
      } else if (selectedTicket) {
        const updated = data.find(t => t.id === selectedTicket.id);
        if (updated) setSelectedTicket(updated);
      }
    }
    setLoading(false);
  };

  const handleSendReply = async () => {
    if (!reply.trim()) return alert("Vui lòng nhập nội dung phản hồi!");
    const res = await chamSocKhachHangService.traLoiKhachHangAdmin(selectedTicket.id, reply);
    if (res && res.success) {
      setReply("");
      await taiDanhSachHoTro();
    } else {
      alert("Lỗi phản hồi: " + res.error);
    }
  };

  const parseChatLog = (noiDungRaw) => {
    try {
      return JSON.parse(noiDungRaw);
    } catch (e) {
      return [{ sender: "user", text: noiDungRaw }];
    }
  };

  if (loading && tickets.length === 0) return <div style={{ padding: "30px" }}>Đang tải hộp thư hỗ trợ từ cơ sở dữ liệu...</div>;

  return (
    <div style={{ display: "flex", height: "calc(100vh - 40px)", backgroundColor: "#f5f7f6", fontFamily: "Arial" }}>
      {/* DANH SÁCH PHÒNG CHAT THEO EMAIL BÊN TRÁI */}
      <div style={{ width: "350px", borderRight: "1px solid #ddd", backgroundColor: "#fff", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px", borderBottom: "1px solid #eee" }}>
          <h3 style={{ margin: 0, color: "#1c3f3a" }}>Hộp Thư Hỗ Trợ ({tickets.length})</h3>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {tickets.map(ticket => (
            <div
              key={ticket.id}
              onClick={() => { setSelectedTicket(ticket); setReply(""); }}
              style={{
                padding: "15px 20px",
                borderBottom: "1px solid #f9f9f9",
                cursor: "pointer",
                backgroundColor: selectedTicket?.id === ticket.id ? "#eef5f4" : "transparent"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                {/* 🌟 ĐÃ ĐỔI: Hiện Email thay thế cho chữ "Ẩn danh" cũ */}
                <strong style={{ fontSize: "13px", color: "#1c3f3a", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {ticket.email}
                </strong>
                <span style={{ fontSize: "11px", padding: "2px 6px", borderRadius: "10px", fontWeight: "bold", backgroundColor: ticket.trang_thai === "da_tra_loi" ? "#e8f5e9" : "#fff3e0", color: ticket.trang_thai === "da_tra_loi" ? "green" : "orange" }}>
                  {ticket.trang_thai === "da_tra_loi" ? "Đã đáp" : "Chờ xử lý"}
                </span>
              </div>
              <div style={{ fontSize: "12px", color: "#666", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {ticket.chu_de}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CHI TIẾT LỊCH SỬ CHAT QUA LẠI BÊN PHẢI */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#fff" }}>
        {selectedTicket ? (
          <>
            <div style={{ padding: "20px", borderBottom: "1px solid #eee", backgroundColor: "#fafafa" }}>
              <h3 style={{ margin: "0 0 5px 0", color: "#1c3f3a" }}>{selectedTicket.chu_de}</h3>
              <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>
                Tài khoản khách: <strong>{selectedTicket.email}</strong> (Tên đại diện: {selectedTicket.ho_ten})
              </p>
            </div>

            {/* VÙNG ĐỌC MẢNG JSON TIN NHẮN HAI BÊN */}
            <div style={{ flex: 1, padding: "25px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "15px" }}>
              {parseChatLog(selectedTicket.noi_dung).map((msg, index) => (
                <div
                  key={index}
                  style={{
                    maxWidth: "70%",
                    alignSelf: msg.sender === "user" ? "flex-start" : "flex-end",
                    backgroundColor: msg.sender === "user" ? "#f0f2f1" : "#1c3f3a",
                    color: msg.sender === "user" ? "#111" : "#fff",
                    padding: "12px 16px",
                    borderRadius: msg.sender === "user" ? "0 12px 12px 12px" : "12px 0 12px 12px"
                  }}
                >
                  <div style={{ fontSize: "12px", opacity: 0.7, marginBottom: "4px", fontWeight: "bold" }}>
                    {msg.sender === "user" ? "Khách Hàng" : "Xưởng Sen Đông"}
                  </div>
                  <div style={{ fontSize: "14px", lineHeight: "1.4" }}>{msg.text}</div>
                </div>
              ))}
            </div>

            {/* THANH PHẢN HỒI TIN NHẮN */}
            <div style={{ padding: "20px", borderTop: "1px solid #eee", display: "flex", gap: "15px" }}>
              <input
                type="text"
                placeholder="Nhập nội dung phản hồi tiếp theo vào phòng chat này..."
                value={reply}
                onChange={e => setReply(e.target.value)}
                style={{ flex: 1, padding: "12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}
                onKeyDown={e => e.key === "Enter" && handleSendReply()}
              />
              <button onClick={handleSendReply} style={{ backgroundColor: "#1c3f3a", color: "white", padding: "12px 24px", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
                Phản Hồi
              </button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
            Vui lòng chọn một phòng chat bên danh sách để xem nội dung hội thoại.
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerCare;