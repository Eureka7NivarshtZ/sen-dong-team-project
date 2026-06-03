import React, { useState, useEffect } from "react";
import { authService, chamSocKhachHangService } from "../../services";

function CustomerSupport() {
  const isLoggedIn = authService.isAuthenticated();
  const [form, setForm] = useState({ chu_de: "", noi_dung: "", ho_ten: "", email: "" });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      taiLichSuHoTro();
    }
  }, [isLoggedIn]);

  const taiLichSuHoTro = async () => {
    const res = await chamSocKhachHangService.layLichSuCuaToi();
    if (res && res.success) setHistory(res.data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.noi_dung.trim()) return alert("Vui lòng nhập nội dung!");
    
    setLoading(true);
    const res = await chamSocKhachHangService.guiTinNhanMoi(form);
    setLoading(false);

    if (res && res.success) {
      alert("Đã gửi lời nhắn hỗ trợ thành công!");
      setForm({ chu_de: "", noi_dung: "", ho_ten: "", email: "" });
      if (isLoggedIn) taiLichSuHoTro();
    } else {
      alert("Lỗi: " + res.error);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px", fontFamily: "Arial" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h2 style={{ color: "#333", fontSize: "28px", fontWeight: "600" }}>Hỗ Trợ & Chăm Sóc Khách Hàng</h2>
        <p style={{ color: "#666" }}>Gửi mọi thắc mắc hoặc yêu cầu bảo hành về tranh đến bộ phận CSKH Sen Đông</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isLoggedIn ? "1fr 1fr" : "1fr", gap: "40px" }}>
        <div style={{ background: "#fff", padding: "30px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #eee" }}>
          <h3 style={{ margin: "0 0 20px 0", color: "#333" }}>Tạo yêu cầu mới</h3>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {!isLoggedIn && (
              <>
                <input type="text" placeholder="Họ và tên của bạn *" value={form.ho_ten} onChange={e => setForm({...form, ho_ten: e.target.value})} required style={inputStyle} />
                <input type="email" placeholder="Địa chỉ Email *" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required style={inputStyle} />
              </>
            )}
            <input type="text" placeholder="Chủ đề cần hỗ trợ" value={form.chu_de} onChange={e => setForm({...form, chu_de: e.target.value})} style={inputStyle} />
            <textarea placeholder="Nhập nội dung chi tiết lời nhắn tại đây... *" rows="5" value={form.noi_dung} onChange={e => setForm({...form, noi_dung: e.target.value})} required style={{ ...inputStyle, resize: "none" }} />
            <button type="submit" disabled={loading} style={{ backgroundColor: "#333", color: "white", padding: "12px", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
              {loading ? "Đang xử lý gửi..." : "Gửi Yêu Cầu Hỗ Trợ"}
            </button>
          </form>
        </div>

        {isLoggedIn && (
          <div>
            <h3 style={{ margin: "0 0 20px 0", color: "#333" }}>Lịch sử phản hồi từ hệ thống ({history.length})</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px", maxHeight: "450px", overflowY: "auto" }}>
              {history.length === 0 ? (
                <p style={{ color: "#999", style: "italic" }}>Bạn chưa gửi tin nhắn hỗ trợ nào.</p>
              ) : (
                history.map((item) => (
                  <div key={item.id} style={{ border: "1px solid #ddd", borderRadius: "6px", padding: "15px", backgroundColor: "#fafafa" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <strong style={{ fontSize: "14px" }}>{item.chu_de || "Hỗ trợ dịch vụ"}</strong>
                      <span style={{ fontSize: "12px", fontWeight: "bold", color: item.trang_thai === "da_tra_loi" ? "green" : "orange" }}>
                        {item.trang_thai === "da_tra_loi" ? "✓ Đã trả lời" : "● Chờ duyệt"}
                      </span>
                    </div>
                    <p style={{ margin: "5px 0", fontSize: "14px", color: "#555" }}>✉ {item.noi_dung}</p>
                    {item.tra_loi && (
                      <div style={{ marginTop: "10px", padding: "10px", backgroundColor: "#fff", borderRadius: "4px", borderLeft: "3px solid #333", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.02)" }}>
                        <p style={{ margin: 0, fontSize: "13px", color: "#333" }}><strong>Phản hồi từ Admin:</strong> {item.tra_loi}</p>
                      </div>
                    )}
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