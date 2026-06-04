import React, { useState, useEffect } from "react";
import { authService, chamSocKhachHangService } from "../../services";

function CustomerSupport() {
  const isLoggedIn = authService.isAuthenticated();
  const currentUser = authService.getUser();

  // 🌟 ĐÃ SỬA: Tạo khóa bộ nhớ riêng biệt cho từng tài khoản Email để không bị lẫn lộn
  const cacheKey = currentUser?.email ? `cskh_history_${currentUser.email}` : "cskh_history_guest";
  
  const [form, setForm] = useState({ chu_de: "", noi_dung: "", ho_ten: "", email: "" });
  const [userReply, setUserReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTicket, setActiveTicket] = useState(null);

  // 🌟 ĐÃ SỬA: Khởi tạo danh sách bằng cách nạp thẳng từ ổ cứng trình duyệt lên trước, chống F5 bị về 0
  const [history, setHistory] = useState(() => {
    const cached = localStorage.getItem(cacheKey);
    return cached ? JSON.parse(cached) : [];
  });

  useEffect(() => {
    if (isLoggedIn) {
      taiLichSuHoTro();
    }
  }, [isLoggedIn]);

  // Tự động lưu bộ nhớ cứng mỗi khi danh sách history thay đổi
  useEffect(() => {
    localStorage.setItem(cacheKey, JSON.stringify(history));
  }, [history, cacheKey]);

  const taiLichSuHoTro = async (targetId = null, latestLocalTicket = null) => {
    const res = await chamSocKhachHangService.layLichSuCuaToi();
    const idToOpen = targetId || latestLocalTicket?.id || activeTicket?.id;

    // Lấy danh sách đang lưu trong ổ cứng làm nền móng
    let currentLocalData = [...history];

    if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
      // Nếu Backend trả về dữ liệu thật thành công, gộp chung và ưu tiên dữ liệu mới từ Server
      currentLocalData = res.data;
    }

    // Đảm bảo ticket vừa tạo hoặc đang chat luôn luôn sống sót trong danh sách
    if (idToOpen && !currentLocalData.some(t => t.id === idToOpen)) {
      const fallback = latestLocalTicket || activeTicket || history.find(t => t.id === idToOpen);
      if (fallback) {
        currentLocalData = [fallback, ...currentLocalData];
      }
    }

    // Khóa bảo vệ chống máy chủ bị chậm đè dữ liệu cũ lên tin nhắn mới gõ
    let updated = currentLocalData.find(t => t.id === idToOpen);
    if (updated && latestLocalTicket && updated.id === latestLocalTicket.id) {
      const localLog = parseChatLog(latestLocalTicket.noi_dung);
      const serverLog = parseChatLog(updated.noi_dung);
      if (serverLog.length < localLog.length) {
        updated = { ...updated, noi_dung: latestLocalTicket.noi_dung };
        currentLocalData = currentLocalData.map(t => t.id === idToOpen ? updated : t);
      }
    }

    setHistory(currentLocalData);
    if (idToOpen && updated) {
      setActiveTicket(updated);
    }
  };

  // XỬ LÝ GỬI LỜI NHẮN ĐẦU TIÊN
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.noi_dung.trim()) return alert("Vui lòng nhập nội dung!");
    
    const payload = {
      ...form,
      email: isLoggedIn ? currentUser?.email : form.email,
      ho_ten: isLoggedIn ? (currentUser?.hoTen || currentUser?.ten || currentUser?.email?.split('@')[0]) : form.ho_ten
    };

    setLoading(true);
    const res = await chamSocKhachHangService.guiTinNhanMoi(payload);
    setLoading(false);

    if (res && res.success) {
      alert("Đã gửi tin nhắn hỗ trợ mới thành công!");
      
      const ticketMoiTao = {
        id: res.data?.id || `ticket_${Date.now()}`,
        chu_de: res.data?.chu_de || form.chu_de,
        noi_dung: res.data?.noi_dung || JSON.stringify([{ sender: "user", text: form.noi_dung }]),
        email: res.data?.email || payload.email,
        ho_ten: res.data?.ho_ten || payload.ho_ten,
        trang_thai: res.data?.trang_thai || "cho_duyet",
        ...res.data
      };

      setForm({ chu_de: "", noi_dung: "", ho_ten: "", email: "" });
      
      // Khóa chặt vào State và Ổ cứng ngay tức khắc
      setActiveTicket(ticketMoiTao);
      setHistory((prev) => [ticketMoiTao, ...prev]);
      
      if (isLoggedIn) {
        await taiLichSuHoTro(ticketMoiTao.id, ticketMoiTao);
      }
    }
  };

  // XỬ LÝ CHAT QUA LẠI
  const handleUserReply = async () => {
    if (!activeTicket || !userReply.trim()) return;
    
    const currentChatLog = parseChatLog(activeTicket.noi_dung);
    const textToSend = userReply.trim();

    const temporaryUpdatedTicket = {
      ...activeTicket,
      noi_dung: JSON.stringify([...currentChatLog, { sender: "user", text: textToSend }])
    };
    
    // Đẩy thẳng vào màn hình và đồng bộ ngay xuống ổ cứng trình duyệt
    setActiveTicket(temporaryUpdatedTicket);
    setHistory((prev) => prev.map(t => t.id === activeTicket.id ? temporaryUpdatedTicket : t));
    setUserReply(""); 

    const res = await chamSocKhachHangService.userPhanHoiTiep(activeTicket.id, textToSend);
    if (res && res.success) {
      if (isLoggedIn) {
        await taiLichSuHoTro(activeTicket.id, temporaryUpdatedTicket);
      } else {
        const fullData = res.data || temporaryUpdatedTicket;
        setActiveTicket(fullData);
        setHistory((prev) => prev.map(t => t.id === activeTicket.id ? fullData : t));
      }
    }
  };

  const parseChatLog = (noiDungRaw) => {
    if (!noiDungRaw) return [];
    try {
      const parsed = JSON.parse(noiDungRaw);
      return Array.isArray(parsed) ? parsed : [{ sender: "user", text: String(noiDungRaw) }];
    } catch (e) {
      return [{ sender: "user", text: noiDungRaw }];
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px", fontFamily: "Arial" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h2 style={{ color: "#1c3f3a", fontSize: "28px", fontWeight: "bold" }}>Hỗ Trợ & Chăm Sóc Khách Hàng</h2>
        <p style={{ color: "#666" }}>Nhấn vào danh sách phòng chat bên phải để xem phản hồi và nhắn tin qua lại với bộ phận CSKH</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isLoggedIn ? "1fr 1fr" : "1fr", gap: "40px" }}>
        {/* CỘT TRÁI: FORM HOẶC KHUNG CHAT BONG BÓNG */}
        <div>
          {activeTicket ? (
            <div style={{ background: "#fff", padding: "25px", borderRadius: "8px", border: "1px solid #ddd", display: "flex", flexDirection: "column", height: "480px", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #eee", paddingBottom: "10px", marginBottom: "15px" }}>
                <strong style={{ color: "#1c3f3a" }}>📌 Chủ đề: {activeTicket.chu_de}</strong>
                <button onClick={() => setActiveTicket(null)} style={{ border: "none", background: "none", color: "#1c3f3a", cursor: "pointer", fontWeight: "bold", fontSize: "14px" }}>Tạo yêu cầu mới ⊕</button>
              </div>

              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", paddingRight: "5px", marginBottom: "15px" }}>
                {parseChatLog(activeTicket.noi_dung).map((msg, index) => (
                  <div key={index} style={{ alignSelf: msg.sender === "user" ? "flex-end" : "flex-start", maxWidth: "80%", padding: "10px 14px", borderRadius: msg.sender === "user" ? "12px 12px 0 12px" : "12px 12px 12px 0", backgroundColor: msg.sender === "user" ? "#1c3f3a" : "#f0f2f1", color: msg.sender === "user" ? "#fff" : "#111" }}>
                    <div style={{ fontSize: "14px", textAlign: "left" }}>{msg.text}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <input type="text" placeholder="Nhập tin nhắn trao đổi tiếp with admin..." value={userReply} onChange={e => setUserReply(e.target.value)} onKeyDown={e => e.key === "Enter" && handleUserReply()} style={{ flex: 1, padding: "12px", borderRadius: "4px", border: "1px solid #ccc", outline: "none" }} />
                <button onClick={handleUserReply} style={{ backgroundColor: "#1c3f3a", color: "white", border: "none", padding: "0 25px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>Gửi</button>
              </div>
            </div>
          ) : (
            <div style={{ background: "#fff", padding: "30px", borderRadius: "8px", border: "1px solid #eee", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
              <h3 style={{ margin: "0 0 20px 0", color: "#1c3f3a", fontWeight: "bold" }}>Tạo cuộc hội thoại mới</h3>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {!isLoggedIn && (
                  <>
                    <input type="text" placeholder="Họ và tên của bạn *" value={form.ho_ten} onChange={e => setForm({...form, ho_ten: e.target.value})} required style={inputStyle} />
                    <input type="email" placeholder="Địa chỉ Email nhận tin *" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required style={inputStyle} />
                  </>
                )}
                <input type="text" placeholder="Chủ đề cần hỗ trợ *" value={form.chu_de} onChange={e => setForm({...form, chu_de: e.target.value})} required style={inputStyle} />
                <textarea placeholder="Nhập nội dung tin nhắn đầu tiên... *" rows="5" value={form.noi_dung} onChange={e => setForm({...form, noi_dung: e.target.value})} required style={{ ...inputStyle, resize: "none" }} />
                <button type="submit" disabled={loading} style={{ backgroundColor: "#1c3f3a", color: "white", padding: "12px", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "15px" }}>
                  {loading ? "Đang gửi..." : "Gửi Lời Nhắn Hỗ Trợ"}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* CỘT PHẢI: DANH SÁCH PHÒNG CHAT THEO EMAIL */}
        {isLoggedIn && (
          <div>
            <h3 style={{ margin: "0 0 20px 0", color: "#1c3f3a", fontWeight: "bold" }}>Danh sách hỗ trợ của tôi ({history.length})</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "480px", overflowY: "auto" }}>
              {history.length === 0 ? (
                <p style={{ color: "#999", fontStyle: "italic" }}>Bạn chưa có phòng hội thoại nào.</p>
              ) : (
                history.map((item) => (
                  <div key={item.id} onClick={() => setActiveTicket(item)} style={{ border: "1px solid #ddd", borderRadius: "6px", padding: "15px", backgroundColor: activeTicket?.id === item.id ? "#eef5f4" : "#fafafa", cursor: "pointer", transition: "all 0.2s" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                      <strong style={{ fontSize: "14px", color: "#1c3f3a" }}>✉ {item.chu_de}</strong>
                      <span style={{ fontSize: "11px", fontWeight: "bold", color: item.trang_thai === "da_tra_loi" ? "green" : "orange" }}>
                        {item.trang_thai === "da_tra_loi" ? "● Có phản hồi" : "● Chờ duyệt"}
                      </span>
                    </div>
                    <div style={{ fontSize: "12px", color: "#666", textAlign: "left" }}>Tài khoản: {item.email}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = { width: "100%", padding: "12px", borderRadius: "4px", border: "1px solid #ddd", boxSizing: "border-box", outline: "none" };
export default CustomerSupport;