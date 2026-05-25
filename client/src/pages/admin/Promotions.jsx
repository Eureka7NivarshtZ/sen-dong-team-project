import React, { useState } from "react";
import Topbar from "../../components/admin/Topbar"; // Giữ lại Topbar nếu Layout chưa bọc sẵn, hoặc xóa nếu cần

function Promotions() {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // 1. DỮ LIỆU BAN ĐẦU CHUẨN ĐẾT THEO ẢNH DEMO CỦA BẠN (Năm 2026)
  const [promotions, setPromotions] = useState([
    { id: 1, code: "SUMMER20", title: "Giảm 20% mùa hè", desc: "Áp dụng cho toàn bộ tranh trong cửa hàng", value: "20%", minSpend: "1.000.000 đ", applyTo: "Toan Bo", used: 36, limit: 100, startDate: "2026-05-01", endDate: "2026-06-30", status: "Hoạt động" },
    { id: 2, code: "ART100K", title: "Giảm trực tiếp 100K", desc: "Dành cho đơn tranh sơn dầu từ 700K", value: "100.000 đ", minSpend: "700.000 đ", applyTo: "Danh Muc", used: 50, limit: 50, startDate: "2026-04-01", endDate: "2026-05-31", status: "Hoạt động" },
    { id: 3, code: "VIP15", title: "Ưu đãi khách VIP", desc: "Giảm 15% cho các tác phẩm chọn lọc", value: "15%", minSpend: "2.000.000 đ", applyTo: "Tranh", used: 9, limit: 30, startDate: "2026-06-01", endDate: "2026-07-15", status: "Tạm dừng" }
  ]);

  // Ô state quản lý Form nhập liệu
  const [form, setForm] = useState({ code: "", title: "", desc: "", value: "", minSpend: "", applyTo: "Toan Bo", limit: "", startDate: "", endDate: "", status: "Hoạt động" });

  // State hỗ trợ kiểm tra giả lập mã khuyến mãi nhanh bên cột phải
  const [checkTotal, setCheckTotal] = useState("1850000");
  const [checkCode, setCheckCode] = useState("SUMMER20");
  const [checkResult, setCheckResult] = useState({ valid: true, discount: 370000, final: 1480000 });

  const openAddModal = () => {
    setIsEditing(false);
    setForm({ code: "", title: "", desc: "", value: "", minSpend: "", applyTo: "Toan Bo", limit: "", startDate: "2026-05-25", endDate: "2026-06-25", status: "Hoạt động" });
    setShowModal(true);
  };

  const openEditModal = (p) => {
    setIsEditing(true);
    setEditId(p.id);
    setForm({ ...p });
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.code || !form.value) return alert("Vui lòng nhập đầy đủ mã và giá trị giảm!");

    if (isEditing) {
      setPromotions(promotions.map(item => item.id === editId ? { ...item, ...form } : item));
      alert("Cập nhật mã khuyến mãi thành công!");
    } else {
      const newPromo = { id: Date.now(), ...form, used: 0 };
      setPromotions([...promotions, newPromo]);
      alert("Tạo mã khuyến mãi mới thành công!");
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa mã giảm giá này không?")) {
      setPromotions(promotions.filter(item => item.id !== id));
    }
  };

  const handleTestCode = () => {
    const found = promotions.find(p => p.code.toUpperCase() === checkCode.toUpperCase() && p.status === "Hoạt động");
    if (!found) {
      setCheckResult(null);
      return;
    }
    const amt = Number(checkTotal);
    let disc = 0;
    if (found.value.includes("%")) {
      const pct = Number(found.value.replace("%", ""));
      disc = (amt * pct) / 100;
    } else {
      disc = Number(found.value.replace(/[^0-9]/g, ""));
    }
    setCheckResult({ valid: true, discount: disc, final: amt - disc });
  };

  return (
    // ĐÃ SỬA: Bỏ div bao bọc có Sidebar cũ, chuyển sang div nội dung kế thừa trực tiếp từ AdminLayout
    <div className="dashboard-content" style={{ flex: 1, backgroundColor: "#f4f6f9", minHeight: "100vh", width: "100%" }}>
      <Topbar />
      
      <div style={{ padding: "30px", textAlign: "left", display: "grid", gridTemplateColumns: "1fr 380px", gap: "25px" }}>
        
        {/* CỘT TRÁI: DANH SÁCH MÃ KHUYẾN MÃI */}
        <div>
          {/* THẺ THỐNG KÊ TRÊN ĐẦU */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "15px", marginBottom: "25px" }}>
            <div style={statCardStyle}><span>Tổng mã</span><h2>{promotions.length}</h2></div>
            <div style={statCardStyle}><span>Đang hoạt động</span><h2>{promotions.filter(p=>p.status==="Hoạt động").length}</h2></div>
            <div style={statCardStyle}><span>Lượt đã dùng</span><h2>{promotions.reduce((acc,p)=>acc+p.used, 0)}</h2></div>
            <div style={statCardStyle}><span>Giá trị tối thiểu TB</span><h2>1.23M</h2></div>
          </div>

          {/* Ô TÌM KIẾM & NÚT TẠO MỚI */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <input type="text" placeholder="Tìm theo mã hoặc tên khuyến mãi..." style={{ padding: "10px 15px", width: "320px", borderRadius: "8px", border: "1px solid #ddd" }} />
            <button onClick={openAddModal} style={{ padding: "10px 20px", backgroundColor: "#1c3f3a", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
              + Tạo mã mới
            </button>
          </div>

          {/* LƯỚI KHỐI MÃ KHUYẾN MÃI */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {promotions.map((p) => (
              <div key={p.id} style={{ backgroundColor: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", border: "1px solid #eee", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <span style={{ backgroundColor: "#eef2f5", padding: "4px 10px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold", color: "#1c3f3a" }}>{p.code}</span>
                    <span style={{ fontSize: "12px", fontWeight: "bold", color: p.status === "Hoạt động" ? "#2e7d32" : "#aaa" }}>● {p.status}</span>
                  </div>
                  <h4 style={{ margin: "0 0 5px 0", fontSize: "16px", fontWeight: "bold" }}>{p.title}</h4>
                  <p style={{ fontSize: "13px", color: "#666", margin: "0 0 15px 0" }}>{p.desc}</p>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", borderTop: "1px dashed #eee", paddingTop: "10px", marginBottom: "15px" }}>
                    <div><span style={{ color: "#888" }}>Đơn tối thiểu:</span> <strong style={{ display: "block" }}>{p.minSpend}</strong></div>
                    <div><span style={{ color: "#888" }}>Áp dụng:</span> <strong style={{ display: "block" }}>{p.applyTo}</strong></div>
                  </div>

                  {/* Tiến độ đã dùng */}
                  <div style={{ marginBottom: "15px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#555", marginBottom: "4px" }}>
                      <span>Đã dùng {p.used}/{p.limit}</span>
                      <span>{Math.round((p.used/p.limit)*100)}%</span>
                    </div>
                    <div style={{ width: "100%", height: "6px", backgroundColor: "#eee", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ width: `${(p.used/p.limit)*100}%`, height: "100%", backgroundColor: "#1c3f3a" }}></div>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f5f5f5", paddingTop: "10px" }}>
                  <span style={{ fontSize: "11px", color: "#999" }}>{p.startDate} → {p.endDate}</span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => openEditModal(p)} style={{ border: "1px solid #ddd", background: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}>✏️</button>
                    <button onClick={() => handleDelete(p.id)} style={{ border: "1px solid #fcc", background: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}>🗑️</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* POPUP MODAL (THÊM / SỬA) */}
      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <form onSubmit={handleSave} style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "12px", width: "450px", textAlign: "left" }}>
            <h3 style={{ margin: "0 0 20px 0", color: "#1c3f3a" }}>{isEditing ? "Cập nhật mã chương trình" : "Tạo chương trình khuyến mãi"}</h3>
            
            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ flex: 1 }}><label style={labelStyle}>Mã giảm (Code):</label><input type="text" placeholder="SUMMER20" value={form.code} onChange={(e)=>setForm({...form, code: e.target.value.toUpperCase()})} style={modalInputStyle} required /></div>
              <div style={{ flex: 1 }}><label style={labelStyle}>Mức giảm (đ hoặc %):</label><input type="text" placeholder="20% hoặc 50000" value={form.value} onChange={(e)=>setForm({...form, value: e.target.value})} style={modalInputStyle} required /></div>
            </div>

            <label style={labelStyle}>Tiêu đề khuyến mãi:</label>
            <input type="text" placeholder="Giảm giá mùa hè rực rỡ" value={form.title} onChange={(e)=>setForm({...form, title: e.target.value})} style={modalInputStyle} required />

            <label style={labelStyle}>Mô tả chi tiết hiển thị:</label>
            <textarea placeholder="Nhập ghi chú điều kiện áp dụng mã..." value={form.desc} onChange={(e)=>setForm({...form, desc: e.target.value})} style={{ ...modalInputStyle, height: "60px", resize: "none" }}></textarea>

            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ flex: 1 }}><label style={labelStyle}>Đơn tối thiểu:</label><input type="text" placeholder="1.000.000 đ" value={form.minSpend} onChange={(e)=>setForm({...form, minSpend: e.target.value})} style={modalInputStyle} /></div>
              <div style={{ flex: 1 }}><label style={labelStyle}>Tổng lượt phát hành:</label><input type="number" placeholder="100" value={form.limit} onChange={(e)=>setForm({...form, limit: Number(e.target.value)})} style={modalInputStyle} required /></div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ flex: 1 }}><label style={labelStyle}>Ngày bắt đầu:</label><input type="date" value={form.startDate} onChange={(e)=>setForm({...form, startDate: e.target.value})} style={modalInputStyle} /></div>
              <div style={{ flex: 1 }}><label style={labelStyle}>Ngày kết thúc:</label><input type="date" value={form.endDate} onChange={(e)=>setForm({...form, endDate: e.target.value})} style={modalInputStyle} /></div>
            </div>

            <label style={labelStyle}>Trạng thái kích hoạt:</label>
            <select value={form.status} onChange={(e)=>setForm({...form, status: e.target.value})} style={modalInputStyle}>
              <option value="Hoạt động">Hoạt động (Active)</option>
              <option value="Tạm dừng">Tạm dừng (Pause)</option>
            </select>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "20px" }}>
              <button type="button" onClick={()=>setShowModal(false)} style={{ padding: "8px 16px", backgroundColor: "#aaa", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>Hủy</button>
              <button type="submit" style={{ padding: "8px 24px", backgroundColor: "#1c3f3a", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>Lưu dữ liệu</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

const statCardStyle = { backgroundColor: "#fff", padding: "15px 20px", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", border: "1px solid #eee", textAlign: "left" };
const darkInputStyle = { width: "100%", padding: "12px", backgroundColor: "#1e293b", border: "1px solid #334155", color: "#fff", borderRadius: "8px", boxSizing: "border-box", outline: "none", fontSize: "14px" };
const receiptRowStyle = { display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#cbd5e1", marginBottom: "8px" };
const labelStyle = { display: "block", fontSize: "12px", color: "#666", marginBottom: "4px", fontWeight: "bold" };
const modalInputStyle = { width: "100%", padding: "10px", marginBottom: "12px", border: "1px solid #ccc", borderRadius: "6px", boxSizing: "border-box", outline: "none" };

export default Promotions;