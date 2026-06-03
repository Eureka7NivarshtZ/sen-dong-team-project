import React, { useState, useEffect } from "react";
import { authService, chamSocKhachHangService } from "../../services";

function CustomerSupport() {
  const isLoggedIn = authService.isAuthenticated();
  const currentUser = authService.getUser();
  
  const [form, setForm] = useState({ chu_de: "", noi_dung: "", ho_ten: "", email: "" });
  const [history, setHistory] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);
  const [userReply, setUserReply] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      taiLichSuHoTro();
    }
  }, [isLoggedIn]);

  const taiLichSuHoTro = async () => {
    const res = await chamSocKhachHangService.layLichSuCuaToi();
    if (res && res.success) {
      const data = res.data || [];
      setHistory(data);
      if (activeTicket) {
        const updated = data.find(t => t.id === activeTicket.id);
        if (updated) setActiveTicket(updated);
      }
    }
  };

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
      setForm({ chu_de: "", noi_dung: "", ho_ten: "", email: "" });
      if (isLoggedIn) taiLichSuHoTro();
    }
  };

  const handleUserReply = async () => {
    if (!userReply.trim()) return;
    const res = await chamSocKhachHangService.userPhanHoiTiep(activeTicket.id, userReply);
    if (res && res.success) {
      setUserReply("");
      await taiLichSuHoTro();
    }
  };

  // Hàm parse dữ liệu hội thoại an toàn
  const parseChatLog = (noiDungRaw) => {
    try {
      return JSON.parse(noiDungRaw);
    } catch (e) {
      return [{ sender: "user", text: noiDungRaw }];
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px", fontFamily: "Arial" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h2 style={{ color: "#333", fontSize: "28px" }}>Hỗ Trợ & Chăm Sóc Khách Hàng</h2>
        <p style={{ color: "#666" }}>Nhấn vào danh sách phòng chat bên phải để xem phản hồi và nhắn tin qua lại với bộ phận CSKH</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isLoggedIn ? "1fr 1fr" : "1fr", gap: "40px" }}>
        {/* CỘT TRÁI: KHUNG ĐỔI MÀU DẠNG FORM HOẶC KHUNG CHAT TRỰC TUYẾN */}
        <div>
          {activeTicket ? (
            <div style={{ background: "#fff", padding: "25px", borderRadius: "8px", border: "1px solid #ddd", display: "flex", flexDirection: "column", height: "480px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #eee", paddingBottom: "10px", marginBottom: "15px" }}>
                <strong style={{ color: "#1c3f3a" }}>📌 Chủ đề: {activeTicket.chu_de}</strong>
                <button onClick={() => setActiveTicket(null)} style={{ border: "none", background: "none", color: "red", cursor: "pointer", fontWeight: "bold" }}>Tạo yêu cầu mới ⊕</button>
              </div>

              {/* VÙNG HIỂN THỊ NỘI DUNG CHAT BONG BÓNG QUA LẠI */}
              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", paddingRight: "5px", marginBottom: "15px" }}>
                {parseChatLog(activeTicket.noi_dung).map((msg, index) => (
                  <div key={index} style={{ alignSelf: msg.sender === "user" ? "flex-end" : "flex-start", maxWidth: "80%", padding: "10px 14px", borderRadius: msg.sender === "user" ? "12px 12px 0 12px" : "12px 12px 12px 0", backgroundColor: msg.sender === "user" ? "#1c3f3a" : "#f0f2f1", color: msg.sender === "user" ? "#fff" : "#111" }}>
                    <div style={{ fontSize: "14px" }}>{msg.text}</div>
                  </div>
                ))}
              </div>

              {/* Ô NHẬP TIN NHẮN CHAT TIẾP */}
              <div style={{ display: "flex", gap: "10px" }}>
                <input type="text" placeholder="Nhập tin nhắn trao đổi tiếp với admin..." value={userReply} onChange={e => setUserReply(e.target.value)} onKeyDown={e => e.key === "Enter" && handleUserReply()} style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }} />
                <button onClick={handleUserReply} style={{ backgroundColor: "#1c3f3a", color: "white", border: "none", padding: "0 20px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>Gửi</button>
              </div>
            </div>
          ) : (
            <div style={{ background: "#fff", padding: "30px", borderRadius: "8px", border: "1px solid #eee" }}>
              <h3 style={{ margin: "0 0 20px 0" }}>Tạo cuộc hội thoại mới</h3>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {!isLoggedIn && (
                  <>
                    <input type="text" placeholder="Họ và tên của bạn *" value={form.ho_ten} onChange={e => setForm({...form, ho_ten: e.target.value})} required style={inputStyle} />
                    <input type="email" placeholder="Địa chỉ Email nhận tin *" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required style={inputStyle} />
                  </>
                )}
                <input type="text" placeholder="Chủ đề cần hỗ trợ *" value={form.chu_de} onChange={e => setForm({...form, chu_de: e.target.value})} required style={inputStyle} />
                <textarea placeholder="Nhập nội dung tin nhắn đầu tiên... *" rows="5" value={form.noi_dung} onChange={e => setForm({...form, noi_dung: e.target.value})} required style={{ ...inputStyle, resize: "none" }} />
                <button type="submit" disabled={loading} style={{ backgroundColor: "#333", color: "white", padding: "12px", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
                  {loading ? "Đang gửi..." : "Gửi Lời Nhắn Hỗ Trợ"}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* CỘT PHẢI: LỊCH SỬ DANH SÁCH PHÒNG CHAT THEO EMAIL */}
        {isLoggedIn && (
          <div>
            <h3 style={{ margin: "0 0 20px 0" }}>Danh sách hỗ trợ của tôi ({history.length})</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "480px", overflowY: "auto" }}>
              {history.length === 0 ? (
                <p style={{ color: "#999", style: "italic" }}>Bạn chưa có phòng hội thoại nào.</p>
              ) : (
                history.map((item) => (
                  <div key={item.id} onClick={() => setActiveTicket(item)} style={{ border: "1px solid #ddd", borderRadius: "6px", padding: "15px", backgroundColor: activeTicket?.id === item.id ? "#eef5f4" : "#fafafa", cursor: "pointer", transition: "all 0.2s" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                      <strong style={{ fontSize: "14px", color: "#1c3f3a" }}>✉ {item.chu_de}</strong>
                      <span style={{ fontSize: "11px", fontWeight: "bold", color: item.trang_thai === "da_tra_loi" ? "green" : "orange" }}>
                        {item.trang_thai === "da_tra_loi" ? "● Có phản hồi" : "● Chờ duyệt"}
                      </span>
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>Tài khoản: {item.email}</div>
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

const inputStyle = { width: "100%", padding: "12px", borderRadius: "4px", border: "1px solid #ddd", boxSizing: "border-box" };
export default CustomerSupport;