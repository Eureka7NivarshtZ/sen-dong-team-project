import React, { useState, useEffect } from "react";
import { authService } from "../../services";

function SupportTickets() {
  // 🛠️ NÂNG CẤP: Cấu trúc mảng replies chứa Object có senderRole rõ ràng để không bị nhận nhầm thành Admin
  const [tickets, setTickets] = useState([
    { 
      id: "101", 
      title: "Đơn hàng giao trễ", 
      content: "Mình đặt hàng từ 3 ngày trước nhưng chưa thấy cập nhật vận chuyển.", 
      status: "Đang xử lý", 
      type: "Giao hàng", 
      level: "Cao", 
      sender: "Khách hàng demo",
      replies: [] 
    },
    { 
      id: "102", 
      title: "Cần đổi số điện thoại nhận hàng", 
      content: "Shop hỗ trợ đổi số điện thoại giúp mình nhé.", 
      status: "Đã phản hồi", 
      type: "Đơn hàng", 
      level: "Bình thường", 
      sender: "Khách hàng demo", 
      replies: [
        { senderRole: "admin", text: "Bạn gửi số điện thoại mới để bên mình cập nhật nhé." }
      ] 
    }
  ]);

  const [activeTicket, setActiveTicket] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newType, setNewType] = useState("Đơn hàng");
  const [newLevel, setNewLevel] = useState("Bình thường");
  const [replyText, setReplyText] = useState("");

  // Kiểm tra quyền đăng nhập hệ thống của bạn
  const isAdmin = localStorage.getItem("userRole") === "admin" || localStorage.getItem("userRole") === "quan_ly";
  const currentUser = localStorage.getItem("username") || "Người dùng Sen Đông";

  useEffect(() => {
    if (tickets.length > 0 && !activeTicket) {
      setActiveTicket(tickets[1]); // Mặc định mở ticket #102
    }
  }, [tickets]);

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!newTitle || !newContent) return alert("Vui lòng nhập đầy đủ tiêu đề và nội dung cần hỗ trợ!");

    const newTicket = {
      id: String(100 + tickets.length + 1),
      title: newTitle,
      content: newContent,
      type: newType,
      level: newLevel,
      status: "Mới",
      sender: currentUser,
      replies: []
    };

    setTickets([...tickets, newTicket]);
    setNewTitle("");
    setNewContent("");
    alert("Gửi yêu cầu hỗ trợ thành công! Đội ngũ tư vấn sẽ phản hồi bạn sớm nhất.");
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    // Định nghĩa Object tin nhắn mới: Tự động nhận diện vai trò người đang gõ để gán nhãn
    const newReplyObject = {
      senderRole: isAdmin ? "admin" : "user",
      text: replyText
    };

    const updatedTickets = tickets.map((t) => {
      if (t.id === activeTicket.id) {
        return {
          ...t,
          status: isAdmin ? "Đã phản hồi" : "Khách đã hồi đáp",
          replies: [...(t.replies || []), newReplyObject] // Đẩy object mới vào mảng
        };
      }
      return t;
    });

    setTickets(updatedTickets);
    const target = updatedTickets.find(t => t.id === activeTicket.id);
    setActiveTicket(target);
    setReplyText("");
  };

  return (
    <div style={{ width: "100%", boxSizing: "border-box", fontFamily: "Arial, sans-serif", backgroundColor: "#f8f9fa", padding: "30px 50px", minHeight: "calc(100vh - 70px)" }}>
      
      {/* THANH ĐIỀU HƯỚNG QUAY VỀ */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
        <h2 style={{ color: "#1c3f3a", margin: 0, fontWeight: "bold" }}>🎯 Hỗ trợ & Chăm sóc khách hàng</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "400px 1fr", gap: "30px", alignItems: "start" }}>
        
        {/* BLOCK BÊN TRÁI: TẠO MỚI HOẶC LIST TICKET */}
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          
          {/* FORM TẠO YÊU CẦU MỚI (Ẩn đi nếu là tài khoản Admin) */}
          {!isAdmin && (
            <div style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", textAlign: "left" }}>
              <h3 style={{ margin: "0 0 15px 0", fontSize: "16px", fontWeight: "bold", color: "#333" }}>+ Tạo yêu cầu mới</h3>
              <form onSubmit={handleCreateTicket}>
                <input type="text" placeholder="Mã đơn hàng (có thể bỏ trống)" style={inputStyle} />
                <input type="text" placeholder="Tiêu đề cần hỗ trợ" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} style={inputStyle} required />
                <textarea placeholder="Nội dung chi tiết cần xưởng hỗ trợ..." value={newContent} onChange={(e) => setNewContent(e.target.value)} style={{ ...inputStyle, height: "100px", resize: "none" }} required></textarea>
                
                <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                  <select value={newType} onChange={(e) => setNewType(e.target.value)} style={selectStyle}>
                    <option value="Đơn hàng">Module Đơn hàng</option>
                    <option value="Giao hàng">Khâu Giao hàng</option>
                    <option value="Tư vấn">Tư vấn tranh</option>
                    <option value="Khác">Vấn đề Khác</option>
                  </select>
                  <select value={newLevel} onChange={(e) => setNewLevel(e.target.value)} style={selectStyle}>
                    <option value="Bình thường">Bình thường</option>
                    <option value="Cao">Ưu tiên Cao</option>
                  </select>
                </div>

                <button type="submit" style={{ width: "100%", padding: "12px", backgroundColor: "#1c3f3a", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
                  Tạo yêu cầu cứu trợ
                </button>
              </form>
            </div>
          )}

          {/* DANH SÁCH TICKET */}
          <div style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", textAlign: "left" }}>
            <h3 style={{ margin: "0 0 15px 0", fontSize: "16px", fontWeight: "bold", color: "#333" }}>
              {isAdmin ? "📋 Danh sách Ticket chờ duyệt" : "📬 Yêu cầu của tôi"}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {tickets.map((t) => (
                <div key={t.id} onClick={() => setActiveTicket(t)} style={{ padding: "15px", borderRadius: "8px", border: activeTicket?.id === t.id ? "2px solid #1c3f3a" : "1px solid #f0f0f0", backgroundColor: activeTicket?.id === t.id ? "#f5f9f7" : "#fff", cursor: "pointer", transition: "all 0.2s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "14px", fontWeight: "bold", color: "#1c3f3a" }}>{t.title}</span>
                    <span style={{ fontSize: "12px", color: "#888" }}>#{t.id}</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "#666", margin: "0 0 10px 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.content}</p>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <span style={{ padding: "2px 6px", fontSize: "11px", borderRadius: "4px", backgroundColor: t.status === "Đã phản hồi" ? "#e8f5e9" : "#fff3e0", color: t.status === "Đã phản hồi" ? "#2e7d32" : "#f57c00", fontWeight: "bold" }}>{t.status}</span>
                    <span style={{ padding: "2px 6px", fontSize: "11px", borderRadius: "4px", backgroundColor: "#f0f0f0", color: "#555" }}>{t.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BLOCK BÊN PHẢI: KHUNG CHAT BOX CHI TIẾT */}
        {activeTicket ? (
          <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", height: "650px" }}>
            
            {/* Header Ticket */}
            <div style={{ padding: "20px 30px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ textAlign: "left" }}>
                <h3 style={{ margin: "0 0 4px 0", fontSize: "20px", color: "#1c3f3a", fontWeight: "bold" }}>{activeTicket.title}</h3>
                <span style={{ fontSize: "13px", color: "#777" }}>Ticket #{activeTicket.id}</span>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <span style={{ padding: "5px 12px", fontSize: "12px", borderRadius: "20px", backgroundColor: "#111", color: "#fff", fontWeight: "bold" }}>{activeTicket.status}</span>
                <span style={{ padding: "5px 12px", fontSize: "12px", borderRadius: "20px", backgroundColor: "#f0f0f0", color: "#333" }}>{activeTicket.level}</span>
              </div>
            </div>

            {/* VÙNG NỘI DUNG CUỘC TRÒ CHUYỆN REAL-TIME */}
            <div style={{ flex: 1, padding: "30px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px", backgroundColor: "#fafafa" }}>
              
              {/* Tin nhắn mở đầu gốc của Khách hàng (Luôn nằm bên phải diện tích chat) */}
              <div style={{ alignSelf: "flex-end", maxWidth: "70%", textAlign: "right" }}>
                <span style={{ fontSize: "11px", color: "#888", display: "block", marginBottom: "4px" }}>{activeTicket.sender}</span>
                <div style={{ backgroundColor: "#1c3f3a", color: "#fff", padding: "12px 16px", borderRadius: "12px 12px 0 12px", fontSize: "14px", textAlign: "left", lineHeight: "1.5" }}>
                  {activeTicket.content}
                </div>
              </div>

              {/* 🛠️ SỬA LỖI TẠI ĐÂY: Quét mảng Object và gán Class hiển thị theo vai trò người gửi */}
              {activeTicket.replies && activeTicket.replies.map((reply, index) => {
                const isReplyFromAdmin = reply.senderRole === "admin";
                
                return (
                  <div 
                    key={index} 
                    style={{ 
                      alignSelf: isReplyFromAdmin ? "flex-start" : "flex-end", // Admin bên trái, Khách hàng bồi thêm bên phải
                      maxWidth: "70%", 
                      textAlign: isReplyFromAdmin ? "left" : "right" 
                    }}
                  >
                    <span style={{ fontSize: "11px", color: "#888", display: "block", marginBottom: "4px" }}>
                      {isReplyFromAdmin ? "Nhân viên CSKH Sen Đông" : activeTicket.sender}
                    </span>
                    <div 
                      style={{ 
                        backgroundColor: isReplyFromAdmin ? "#eef2f5" : "#1c3f3a", 
                        color: isReplyFromAdmin ? "#333" : "#fff", 
                        padding: "12px 16px", 
                        borderRadius: isReplyFromAdmin ? "12px 12px 12px 0" : "12px 12px 0 12px", 
                        fontSize: "14px", 
                        textAlign: "left",
                        lineHeight: "1.5" 
                      }}
                    >
                      {reply.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ô soạn thảo câu trả lời chân trang */}
            <form onSubmit={handleSendReply} style={{ padding: "20px 30px", borderTop: "1px solid #f0f0f0", display: "flex", gap: "15px", backgroundColor: "#fff", borderRadius: "0 0 12px 12px" }}>
              <input 
                type="text" 
                placeholder={isAdmin ? "Nhập phản hồi giải quyết khiếu nại của bạn..." : "Nhập câu trả lời bổ sung của bạn..."} 
                value={replyText} 
                onChange={(e) => setReplyText(e.target.value)} 
                style={{ flex: 1, padding: "12px 20px", borderRadius: "8px", border: "1px solid #ddd", outline: "none", fontSize: "14px" }} 
              />
              <button type="submit" style={{ padding: "12px 25px", backgroundColor: "#1c3f3a", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
                🚀 Gửi đi
              </button>
            </form>

          </div>
        ) : (
          <div style={{ backgroundColor: "#fff", borderRadius: "12px", height: "650px", display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa" }}>
            Chọn một yêu cầu hỗ trợ bên danh sách để xem cuộc hội thoại
          </div>
        )}

      </div>
    </div>
  );
}

const inputStyle = { width: "100%", padding: "10px 12px", marginBottom: "12px", borderRadius: "6px", border: "1px solid #ddd", boxSizing: "border-box", fontSize: "14px", outline: "none" };
const selectStyle = { flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px", outline: "none" };

export default SupportTickets;