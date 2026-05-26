import React, { useState, useEffect } from "react";
import Topbar from "../../components/admin/Topbar";

function AnswerSupport() {
  // Dữ liệu mảng Ticket lấy từ database xưởng tranh (Năm 2026)
  const [tickets, setTickets] = useState([
    { id: "101", title: "Đơn hàng giao trễ", content: "Mình đặt hàng từ 3 ngày trước nhưng chưa thấy cập nhật vận chuyển.", status: "Chờ xử lý", type: "Giao hàng", level: "Cao", sender: "Christine Brooks" },
    { id: "102", title: "Cần đổi số điện thoại nhận hàng", content: "Shop hỗ trợ đổi số điện thoại giúp mình nhé.", status: "Đã phản hồi", type: "Đơn hàng", level: "Bình thường", sender: "Rosie Pearson", replies: ["Bên mình đã tiếp nhận, bạn gửi số điện thoại mới để hệ thống cập nhật nhé."] },
    { id: "103", title: "Tư vấn chất liệu khung tranh", content: "Mình muốn đặt bức Đêm đầy sao khổ lớn thì nên chọn khung gỗ hay viền composite?", status: "Chờ xử lý", type: "Tư vấn", level: "Bình thường", sender: "Phùng Thanh Đô" }
  ]);

  const [activeTicket, setActiveTicket] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");

  // Tự động mở Ticket đầu tiên khi load trang
  useEffect(() => {
    if (tickets.length > 0 && !activeTicket) {
      setActiveTicket(tickets[0]);
    }
  }, [tickets]);

  // Xử lý gửi tin nhắn phản hồi giải quyết khiếu nại
  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const updatedTickets = tickets.map((t) => {
      if (t.id === activeTicket.id) {
        return {
          ...t,
          status: "Đã phản hồi",
          replies: [...(t.replies || []), replyText]
        };
      }
      return t;
    });

    setTickets(updatedTickets);
    // Cập nhật lại khung chat hiện tại
    const target = updatedTickets.find(t => t.id === activeTicket.id);
    setActiveTicket(target);
    setReplyText("");
  };

  // Bộ lọc tìm kiếm nhanh theo trạng thái Ticket
  const filteredTickets = tickets.filter((t) => {
    if (filterStatus === "Tất cả") return true;
    return t.status === filterStatus;
  });

  return (
    <div className="dashboard-content" style={{ flex: 1, backgroundColor: "#f4f6f9", minHeight: "100vh", width: "100%" }}>
      <Topbar />
      
      <div style={{ padding: "30px", textAlign: "left" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
          <h1 style={{ color: "#1c3f3a", margin: 0, fontSize: "24px", fontWeight: "bold" }}>Quản lý yêu cầu & Trả lời khách hàng</h1>
          
          {/* Bộ lọc trạng thái */}
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)} 
            style={{ padding: "8px 15px", borderRadius: "6px", border: "1px solid #ccc", outline: "none", fontSize: "14px" }}
          >
            <option value="Tất cả">Tất cả Ticket</option>
            <option value="Chờ xử lý">Chờ xử lý</option>
            <option value="Đã phản hồi">Đã phản hồi</option>
          </select>
        </div>

        {/* BỐ CỤC CHIA 2 CỘT CHUẨN MẪU CHAT BOX */}
        <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "25px", alignItems: "start" }}>
          
          {/* CỘT TRÁI: DANH SÁCH TICKET CHỜ DUYỆT */}
          <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", height: "600px", overflowY: "auto" }}>
            <h3 style={{ margin: "0 0 15px 0", fontSize: "15px", color: "#555", fontWeight: "bold" }}>📋 DANH SÁCH YÊU CẦU</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {filteredTickets.map((t) => (
                <div 
                  key={t.id} 
                  onClick={() => setActiveTicket(t)} 
                  style={{ 
                    padding: "14px", 
                    borderRadius: "8px", 
                    border: activeTicket?.id === t.id ? "2px solid #1c3f3a" : "1px solid #f0f0f0", 
                    backgroundColor: activeTicket?.id === t.id ? "#f5f9f7" : "#fff", 
                    cursor: "pointer", 
                    transition: "all 0.2s" 
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "14px", fontWeight: "bold", color: "#1c3f3a" }}>{t.title}</span>
                    <span style={{ fontSize: "12px", color: "#999" }}>#{t.id}</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "#666", margin: "0 0 10px 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.content}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ padding: "2px 6px", fontSize: "11px", borderRadius: "4px", backgroundColor: t.status === "Đã phản hồi" ? "#e8f5e9" : "#fff3e0", color: t.status === "Đã phản hồi" ? "#2e7d32" : "#f57c00", fontWeight: "bold" }}>{t.status}</span>
                    <span style={{ fontSize: "12px", color: "#888", fontWeight: "500" }}>👤 {t.sender}</span>
                  </div>
                </div>
              ))}
              {filteredTickets.length === 0 && (
                <div style={{ textAlign: "center", color: "#aaa", marginTop: "30px" }}>Không có ticket nào thuộc danh mục này.</div>
              )}
            </div>
          </div>

          {/* CỘT PHẢI: KHUNG CHAT PHẢN HỒI REAL-TIME */}
          {activeTicket ? (
            <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", height: "600px" }}>
              
              {/* Header Khung Chat */}
              <div style={{ padding: "15px 25px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ textAlign: "left" }}>
                  <h3 style={{ margin: "0 0 4px 0", fontSize: "18px", color: "#1c3f3a", fontWeight: "bold" }}>{activeTicket.title}</h3>
                  <span style={{ fontSize: "13px", color: "#666" }}>Khách hàng khiếu nại: <strong>{activeTicket.sender}</strong></span>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <span style={{ padding: "4px 10px", fontSize: "11px", borderRadius: "20px", backgroundColor: "#1c3f3a", color: "#fff", fontWeight: "bold" }}>{activeTicket.type}</span>
                  <span style={{ padding: "4px 10px", fontSize: "11px", borderRadius: "20px", backgroundColor: activeTicket.level === "Cao" ? "#fff0f0" : "#f5f5f5", color: activeTicket.level === "Cao" ? "#ff4d4f" : "#333", fontWeight: "bold" }}>Mức độ: {activeTicket.level}</span>
                </div>
              </div>

              {/* Nội dung tin nhắn Chat */}
              <div style={{ flex: 1, padding: "25px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "18px", backgroundColor: "#fafafa" }}>
                
                {/* Câu hỏi gốc từ phía Khách hàng gửi lên */}
                <div style={{ alignSelf: "flex-start", maxWidth: "75%", textAlign: "left" }}>
                  <span style={{ fontSize: "11px", color: "#888", display: "block", marginBottom: "4px" }}>📬 Khách hàng - {activeTicket.sender}</span>
                  <div style={{ backgroundColor: "#ffffff", color: "#333", padding: "12px 16px", borderRadius: "0 12px 12px 12px", fontSize: "14px", border: "1px solid #eef0f2", lineHeight: "1.5" }}>
                    {activeTicket.content}
                  </div>
                </div>

                {/* Danh sách các câu trả lời phản hồi từ phía Admin xưởng vẽ */}
                {activeTicket.replies && activeTicket.replies.map((reply, index) => (
                  <div key={index} style={{ alignSelf: "flex-end", maxWidth: "75%", textAlign: "right" }}>
                    <span style={{ fontSize: "11px", color: "#888", display: "block", marginBottom: "4px" }}>Nhân viên CSKH Sen Đông</span>
                    <div style={{ backgroundColor: "#1c3f3a", color: "#fff", padding: "12px 16px", borderRadius: "12px 12px 0 12px", fontSize: "14px", textAlign: "left", lineHeight: "1.5" }}>
                      {reply}
                    </div>
                  </div>
                ))}
              </div>

              {/* Form gõ soạn câu trả lời chân trang */}
              <form onSubmit={handleSendReply} style={{ padding: "15px 25px", borderTop: "1px solid #f0f0f0", display: "flex", gap: "15px", backgroundColor: "#fff", borderRadius: "0 0 12px 12px" }}>
                <input 
                  type="text" 
                  placeholder="Nhập nội dung phản hồi, hướng dẫn khắc phục để gửi cho khách hàng..." 
                  value={replyText} 
                  onChange={(e) => setReplyText(e.target.value)} 
                  style={{ flex: 1, padding: "12px 18px", borderRadius: "8px", border: "1px solid #ddd", outline: "none", fontSize: "14px" }} 
                />
                <button type="submit" style={{ padding: "12px 25px", backgroundColor: "#1c3f3a", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
                  🚀 Gửi phản hồi
                </button>
              </form>

            </div>
          ) : (
            <div style={{ backgroundColor: "#fff", borderRadius: "12px", height: "600px", display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa" }}>
              Vui lòng chọn một ô ticket khiếu nại bên trái để tiến hành hỗ trợ trả lời khách hàng
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default AnswerSupport;