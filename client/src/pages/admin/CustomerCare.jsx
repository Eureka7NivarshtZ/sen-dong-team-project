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
    try {
      const res = await chamSocKhachHangService.layDanhSachTinNhanAdmin();
      
      // 🌟 BẪY LỖI: Nếu API thất bại, bung ngay alert thông báo nguyên nhân
      if (res && res.success) {
        const data = res.data || [];
        setTickets(data);
        if (data.length > 0 && !selectedTicket) {
          setSelectedTicket(data[0]);
        } else if (selectedTicket) {
          const updated = data.find(t => t.id === selectedTicket.id);
          if (updated) setSelectedTicket(updated);
        }
      } else {
        alert("🚨 LỖI API ADMIN: " + (res?.error || "Không thể tải danh sách tin nhắn"));
      }
    } catch (err) {
      alert("🚨 LỖI KẾT NỐI MẠNG FRONTEND: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!reply.trim()) return alert("Vui lòng nhập nội dung phản hồi!");
    const res = await chamSocKhachHangService.traLoiKhachHangAdmin(selectedTicket.id, reply);
    if (res && res.success) {
      alert("Đã gửi câu trả lời thành công!");
      setReply("");
      await taiDanhSachHoTro();
    } else {
      alert("Lỗi phản hồi: " + res.error);
    }
  };

  if (loading && tickets.length === 0) return <div style={{ padding: "30px" }}>Đang tải hộp thư hỗ trợ từ SQL Server...</div>;

  return (
    <div style={{ display: "flex", height: "calc(100vh - 40px)", backgroundColor: "#f5f7f6", fontFamily: "Arial" }}>
      {/* DANH SÁCH TICKET BÊN TRÁI */}
      <div style={{ width: "350px", borderRight: "1px solid #ddd", backgroundColor: "#fff", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px", borderBottom: "1px solid #eee" }}>
          <h3 style={{ margin: 0, color: "#1c3f3a" }}>Hộp Thư Hỗ Trợ ({tickets.length})</h3>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {tickets.length === 0 ? (
            <div style={{ padding: "20px", color: "#999", textAlign: "center", fontStyle: "italic" }}>Không có tin nhắn nào</div>
          ) : (
            tickets.map(ticket => (
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
                  <strong style={{ fontSize: "14px" }}>{ticket.ho_ten || "Ẩn danh"}</strong>
                  <span style={{ fontSize: "11px", padding: "2px 6px", borderRadius: "10px", fontWeight: "bold", backgroundColor: ticket.trang_thai === "da_tra_loi" ? "#e8f5e9" : "#fff3e0", color: ticket.trang_thai === "da_tra_loi" ? "green" : "orange" }}>
                    {ticket.trang_thai === "da_tra_loi" ? "Đã đáp" : "Chờ xử lý"}
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#666", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {ticket.chu_de || ticket.noi_dung}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CHI TIẾT CHAT BÊN PHẢI */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#fff" }}>
        {selectedTicket ? (
          <>
            <div style={{ padding: "20px", borderBottom: "1px solid #eee", backgroundColor: "#fafafa" }}>
              <h3 style={{ margin: "0 0 5px 0", color: "#1c3f3a" }}>{selectedTicket.chu_de || "Yêu cầu hỗ trợ"}</h3>
              <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>
                Người gửi: <strong>{selectedTicket.ho_ten}</strong> | Email: {selectedTicket.email || "Không có"}
              </p>
            </div>

            <div style={{ flex: 1, padding: "25px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ maxWidth: "75%", alignSelf: "flex-start", backgroundColor: "#f0f2f1", padding: "15px", borderRadius: "0 12px 12px 12px" }}>
                <div style={{ fontWeight: "bold", fontSize: "12px", color: "#666", marginBottom: "4px" }}>Khách hàng gửi:</div>
                <div style={{ fontSize: "15px" }}>{selectedTicket.noi_dung}</div>
              </div>

              {selectedTicket.tra_loi && (
                <div style={{ maxWidth: "75%", alignSelf: "flex-end", backgroundColor: "#1c3f3a", color: "#fff", padding: "15px", borderRadius: "12px 0 12px 12px" }}>
                  <div style={{ fontWeight: "bold", fontSize: "12px", color: "#a3b8b5", marginBottom: "4px" }}>Đã phản hồi:</div>
                  <div style={{ fontSize: "15px" }}>{selectedTicket.tra_loi}</div>
                </div>
              )}
            </div>

            <div style={{ padding: "20px", borderTop: "1px solid #eee", display: "flex", gap: "15px" }}>
              <input
                type="text"
                placeholder="Nhập nội dung phản hồi xử lý cho khách hàng..."
                value={reply}
                onChange={e => setReply(e.target.value)}
                style={{ flex: 1, padding: "12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}
                onKeyDown={e => { if (e.key === "Enter") handleSendReply(); }}
              />
              <button onClick={handleSendReply} style={{ backgroundColor: "#1c3f3a", color: "white", padding: "12px 24px", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
                Phản Hồi
              </button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
            Vui lòng chọn một ticket bên danh sách để xử lý phản hồi.
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerCare;