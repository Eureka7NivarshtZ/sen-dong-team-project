import { useEffect, useState } from "react";
import { hoTroService } from "../../services";

function SupportTickets() {
  const [tickets, setTickets] = useState([]);
  const [formData, setFormData] = useState({
    tieu_de: "",
    noi_dung: "",
    loai: "",
    muc_do: "",
  });
  const [activeTicket, setActiveTicket] = useState(null);

  const fetchTickets = async () => {
    try {
      const result = await hoTroService.xemYeuCauHoTroCuaToi();
      if (result.success) {
        setTickets(result.data);
      }
    } catch (error) {
      alert("Lỗi khi lấy ticket: " + error.message);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      const result = await hoTroService.taoYeuCauHoTro(formData);
      if (result.success) {
        alert("Tạo yêu cầu hỗ trợ thành công!");
        setFormData({
          tieu_de: "",
          noi_dung: "",
          loai: "khac",
          muc_do: "binh_thuong",
        });
        fetchTickets();
      } else {
        alert("Có lỗi: " + result.error);
      }
    } catch (error) {
      alert("Lỗi khi gửi yêu cầu: " + error.message);
    }
  };

  const handleSendReply = (e) => {};

  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f8f9fa",
        padding: "30px 50px",
        minHeight: "calc(100vh - 70px)",
      }}
    >
      {/* THANH ĐIỀU HƯỚNG QUAY VỀ */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <h2 style={{ color: "#1c3f3a", margin: 0, fontWeight: "bold" }}>
          🎯 Hỗ trợ & Chăm sóc khách hàng
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "400px 1fr",
          gap: "30px",
          alignItems: "start",
        }}
      >
        {/* BLOCK BÊN TRÁI: TẠO MỚI HOẶC LIST TICKET */}
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          {/* FORM TẠO YÊU CẦU MỚI (Ẩn đi nếu là tài khoản Admin) */}
          {
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "24px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                textAlign: "left",
              }}
            >
              <h3
                style={{
                  margin: "0 0 15px 0",
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                + Tạo yêu cầu mới
              </h3>
              <form onSubmit={handleCreateTicket}>
                <input
                  type="text"
                  placeholder="Mã đơn hàng (có thể bỏ trống)"
                  name="don_hang_id"
                  style={inputStyle}
                  value={formData.don_hang_id}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  placeholder="Tiêu đề cần hỗ trợ"
                  name="tieu_de"
                  style={inputStyle}
                  value={formData.tieu_de}
                  onChange={handleChange}
                  required
                />
                <textarea
                  placeholder="Nội dung chi tiết cần xưởng hỗ trợ..."
                  style={{ ...inputStyle, height: "100px", resize: "none" }}
                  name="noi_dung"
                  value={formData.noi_dung}
                  onChange={handleChange}
                  required
                ></textarea>

                <div
                  style={{ display: "flex", gap: "10px", marginBottom: "15px" }}
                >
                  <select
                    style={selectStyle}
                    name="loai"
                    value={formData.loai}
                    onChange={handleChange}
                  >
                    <option value="don_hang">Đơn hàng</option>
                    <option value="thanh_toan">Thanh toán</option>
                    <option value="van_chuyen">Khâu Giao hàng</option>
                    <option value="san_pham">Tư vấn tranh</option>
                    <option value="tai_khoan">Tài khoản</option>
                    <option value="khac">Vấn đề Khác</option>
                  </select>
                  <select
                    name="muc_do"
                    style={selectStyle}
                    value={formData.muc_do}
                    onChange={handleChange}
                  >
                    <option value="thap">Thấp</option>
                    <option value="binh_thuong">Bình thường</option>
                    <option value="cao">Ưu tiên Cao</option>
                    <option value="khan_cap">Khuẩn cấp</option>
                  </select>
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#1c3f3a",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Tạo yêu cầu cứu trợ
                </button>
              </form>
            </div>
          }

          {/* DANH SÁCH TICKET */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              textAlign: "left",
            }}
          >
            <h3
              style={{
                margin: "0 0 15px 0",
                fontSize: "16px",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              "📬 Yêu cầu của tôi"
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {tickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setActiveTicket(t)}
                  style={{
                    padding: "15px",
                    borderRadius: "8px",
                    border:
                      activeTicket?.id === t.id
                        ? "2px solid #1c3f3a"
                        : "1px solid #f0f0f0",
                    backgroundColor:
                      activeTicket?.id === t.id ? "#f5f9f7" : "#fff",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "6px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "#1c3f3a",
                      }}
                    >
                      {t.tieu_de}
                    </span>
                    <span style={{ fontSize: "12px", color: "#888" }}>
                      #{t.id}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#666",
                      margin: "0 0 10px 0",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {t.noi_dung}
                  </p>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <span
                      style={{
                        padding: "2px 6px",
                        fontSize: "11px",
                        borderRadius: "4px",
                        backgroundColor:
                          t.trang_thai === "da_phan_hoi"
                            ? "#e8f5e9"
                            : "#fff3e0",
                        color:
                          t.trang_thai === "da_phan_hoi"
                            ? "#2e7d32"
                            : "#f57c00",
                        fontWeight: "bold",
                      }}
                    >
                      {t.trang_thai || "Đã phản hồi"}
                    </span>
                    <span
                      style={{
                        padding: "2px 6px",
                        fontSize: "11px",
                        borderRadius: "4px",
                        backgroundColor: "#f0f0f0",
                        color: "#555",
                      }}
                    >
                      {t.loai}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            height: "650px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#aaa",
          }}
        >
          Chọn một yêu cầu hỗ trợ bên danh sách để xem cuộc hội thoại
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  marginBottom: "12px",
  borderRadius: "6px",
  border: "1px solid #ddd",
  boxSizing: "border-box",
  fontSize: "14px",
  outline: "none",
};
const selectStyle = {
  flex: 1,
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ddd",
  fontSize: "14px",
  outline: "none",
};

export default SupportTickets;
