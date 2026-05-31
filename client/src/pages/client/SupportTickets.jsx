import { useEffect, useState } from "react";
import { hoTroService } from "../../services";

function SupportTickets() {
  const [tickets, setTickets] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    don_hang_id: "",
    tieu_de: "",
    noi_dung: "",
    loai: "khac",
    muc_do: "binh_thuong",
  });

  const fetchTickets = async () => {
    try {
      const result = await hoTroService.xemYeuCauHoTroCuaToi();
      if (result.success) setTickets(result.data);
    } catch (error) {
      alert("Lỗi khi lấy ticket: " + error.message);
    }
  };

  const fetchTicketDetail = async (ticket) => {
    setActiveTicket(ticket);
    setMessages([]);
    setLoadingMessages(true);
    try {
      const result = await hoTroService.xemChiTietYeuCauHoTro(ticket.id);
      if (result.success) {
        setActiveTicket(result.data);
        setMessages(result.data.phan_hoi || []);
      }
    } catch (error) {
      alert("Lỗi khi tải hội thoại: " + error.message);
    } finally {
      setLoadingMessages(false);
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
    const payload = {
      ...formData,
      don_hang_id:
        formData.don_hang_id === "" ? null : Number(formData.don_hang_id),
    };

    const result = await hoTroService.taoYeuCauHoTro(payload);
    if (result.success) {
      setFormData({
        don_hang_id: "",
        tieu_de: "",
        noi_dung: "",
        loai: "khac",
        muc_do: "binh_thuong",
      });
      fetchTickets();
    } else {
      alert("Có lỗi: " + result.message);
      throw new Error(result.message);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !activeTicket) return;
    setSendingReply(true);
    try {
      const result = await hoTroService.guiPhanHoi(activeTicket.id, {
        noi_dung: replyText.trim(),
      });
      if (result.success) {
        setReplyText("");
        const detail = await hoTroService.xemChiTietYeuCauHoTro(
          activeTicket.id,
        );
        if (detail.success) {
          setMessages(detail.data.phan_hoi || []);
          setActiveTicket(detail.data);
          setTickets((prev) =>
            prev.map((t) => (t.id === detail.data.id ? detail.data : t)),
          );
        }
      } else {
        alert("Lỗi khi gửi phản hồi: " + result.message);
      }
    } catch (error) {
      alert("Lỗi: " + error.message);
    } finally {
      setSendingReply(false);
    }
  };

  return (
    <div style={pageStyle}>
      {/* HEADER */}
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
        <button onClick={() => setShowModal(true)} style={btnPrimaryStyle}>
          + Tạo yêu cầu mới
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "360px 1fr",
          gap: "30px",
          alignItems: "start",
        }}
      >
        {/* CỘT TRÁI: DANH SÁCH TICKET */}
        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>📬 Yêu cầu của tôi</h3>
          {tickets.length === 0 ? (
            <p
              style={{
                color: "#aaa",
                fontSize: "13px",
                textAlign: "center",
                padding: "20px 0",
              }}
            >
              Bạn chưa có yêu cầu nào
            </p>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {tickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => fetchTicketDetail(t)}
                  style={{
                    padding: "14px",
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
                      marginBottom: "5px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "bold",
                        color: "#1c3f3a",
                        flex: 1,
                        marginRight: "8px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {t.tieu_de}
                    </span>
                    <span
                      style={{ fontSize: "11px", color: "#aaa", flexShrink: 0 }}
                    >
                      #{t.id}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#888",
                      margin: "0 0 8px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {t.noi_dung}
                  </p>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <span
                      style={{
                        padding: "2px 6px",
                        fontSize: "11px",
                        borderRadius: "4px",
                        fontWeight: "bold",
                        backgroundColor:
                          t.trang_thai === "da_phan_hoi"
                            ? "#e8f5e9"
                            : t.trang_thai === "dong"
                              ? "#f0f0f0"
                              : "#fff3e0",
                        color:
                          t.trang_thai === "da_phan_hoi"
                            ? "#2e7d32"
                            : t.trang_thai === "dong"
                              ? "#888"
                              : "#f57c00",
                      }}
                    >
                      {t.trang_thai === "da_phan_hoi"
                        ? "Đã phản hồi"
                        : t.trang_thai === "dong"
                          ? "Đã đóng"
                          : "Chờ xử lý"}
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
          )}
        </div>

        {/* CỘT PHẢI: HỘI THOẠI */}
        {activeTicket ? (
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              height: "650px",
              display: "flex",
              flexDirection: "column",
              border: "1px solid #f0f0f0",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #f0f0f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <h3
                  style={{
                    margin: "0 0 6px",
                    fontSize: "15px",
                    color: "#1c3f3a",
                  }}
                >
                  {activeTicket.tieu_de}
                </h3>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  <span
                    style={{
                      padding: "2px 8px",
                      fontSize: "11px",
                      borderRadius: "4px",
                      fontWeight: "bold",
                      backgroundColor:
                        activeTicket.trang_thai === "da_phan_hoi"
                          ? "#e8f5e9"
                          : activeTicket.trang_thai === "dong"
                            ? "#f0f0f0"
                            : "#fff3e0",
                      color:
                        activeTicket.trang_thai === "da_phan_hoi"
                          ? "#2e7d32"
                          : activeTicket.trang_thai === "dong"
                            ? "#888"
                            : "#f57c00",
                    }}
                  >
                    {activeTicket.trang_thai === "da_phan_hoi"
                      ? "Đã phản hồi"
                      : activeTicket.trang_thai === "dong"
                        ? "Đã đóng"
                        : "Chờ xử lý"}
                  </span>
                  <span
                    style={{
                      padding: "2px 8px",
                      fontSize: "11px",
                      borderRadius: "4px",
                      backgroundColor: "#f0f0f0",
                      color: "#555",
                    }}
                  >
                    {activeTicket.loai}
                  </span>
                  {(activeTicket.muc_do === "cao" ||
                    activeTicket.muc_do === "khan_cap") && (
                    <span
                      style={{
                        padding: "2px 8px",
                        fontSize: "11px",
                        borderRadius: "4px",
                        backgroundColor: "#fce4ec",
                        color: "#880e4f",
                        fontWeight: "bold",
                      }}
                    >
                      {activeTicket.muc_do === "khan_cap"
                        ? "Khẩn cấp"
                        : "Ưu tiên cao"}
                    </span>
                  )}
                </div>
              </div>
              <div
                style={{
                  textAlign: "right",
                  fontSize: "12px",
                  color: "#888",
                  flexShrink: 0,
                }}
              >
                <div style={{ fontWeight: "bold", marginBottom: "2px" }}>
                  #{activeTicket.id}
                </div>
                {activeTicket.don_hang_id && (
                  <div>Đơn #{activeTicket.don_hang_id}</div>
                )}
              </div>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
              ref={(el) => {
                if (el) el.scrollTop = el.scrollHeight;
              }}
            >
              {loadingMessages ? (
                <div
                  style={{
                    textAlign: "center",
                    color: "#aaa",
                    paddingTop: "60px",
                  }}
                >
                  Đang tải hội thoại...
                </div>
              ) : messages.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    color: "#aaa",
                    paddingTop: "60px",
                  }}
                >
                  Chưa có tin nhắn nào
                </div>
              ) : (
                messages.map((msg) => {
                  const isUser = msg.nguoi_gui === "khach_hang";
                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "flex-end",
                        flexDirection: isUser ? "row-reverse" : "row",
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "11px",
                          fontWeight: "bold",
                          backgroundColor: isUser ? "#e8eaf6" : "#e8f5e9",
                          color: isUser ? "#3949ab" : "#2e7d32",
                        }}
                      >
                        {isUser ? "Tôi" : "SP"}
                      </div>
                      <div>
                        <div
                          style={{
                            maxWidth: "380px",
                            padding: "10px 14px",
                            fontSize: "13px",
                            lineHeight: "1.6",
                            borderRadius: "12px",
                            ...(isUser
                              ? {
                                  backgroundColor: "#1c3f3a",
                                  color: "#fff",
                                  borderBottomRightRadius: 4,
                                }
                              : {
                                  backgroundColor: "#f5f5f5",
                                  color: "#333",
                                  border: "1px solid #ececec",
                                  borderBottomLeftRadius: 4,
                                }),
                          }}
                        >
                          {msg.noi_dung}
                        </div>
                        <span
                          style={{
                            fontSize: "11px",
                            color: "#aaa",
                            marginTop: "4px",
                            display: "block",
                            textAlign: isUser ? "right" : "left",
                          }}
                        >
                          {msg.thoi_gian}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Reply */}
            {/* Reply */}
            {activeTicket.trang_thai === "dong" ? (
              <div style={closedReplyStyle}>🔒 Yêu cầu này đã được đóng.</div>
            ) : (
              <div style={replyBarStyle}>
                <textarea
                  placeholder="Nhập tin nhắn..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendReply();
                    }
                  }}
                  style={chatInputStyle}
                />

                <button
                  onClick={handleSendReply}
                  disabled={!replyText.trim() || sendingReply}
                  style={{
                    ...sendButtonStyle,
                    opacity: !replyText.trim() || sendingReply ? 0.5 : 1,
                    cursor:
                      !replyText.trim() || sendingReply ? "default" : "pointer",
                  }}
                >
                  {sendingReply ? "..." : "Gửi"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              height: "650px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              color: "#bbb",
              border: "1px solid #f0f0f0",
            }}
          >
            <span style={{ fontSize: "40px" }}>💬</span>
            <p style={{ fontSize: "14px" }}>
              Chọn một yêu cầu bên trái để xem hội thoại
            </p>
          </div>
        )}
      </div>

      {/* MODAL TẠO YÊU CẦU */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#fff",
              borderRadius: "14px",
              padding: "28px",
              width: "480px",
              maxWidth: "90vw",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "17px",
                  fontWeight: "bold",
                  color: "#1c3f3a",
                }}
              >
                Tạo yêu cầu hỗ trợ mới
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "22px",
                  cursor: "pointer",
                  color: "#888",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                await handleCreateTicket(e);
                setShowModal(false);
              }}
            >
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
                placeholder="Nội dung chi tiết cần hỗ trợ..."
                style={{ ...inputStyle, height: "100px", resize: "none" }}
                name="noi_dung"
                value={formData.noi_dung}
                onChange={handleChange}
                required
              />
              <div
                style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
              >
                <select
                  style={selectStyle}
                  name="loai"
                  value={formData.loai}
                  onChange={handleChange}
                >
                  <option value="don_hang">Đơn hàng</option>
                  <option value="thanh_toan">Thanh toán</option>
                  <option value="van_chuyen">Giao hàng</option>
                  <option value="san_pham">Tư vấn tranh</option>
                  <option value="tai_khoan">Tài khoản</option>
                  <option value="khac">Vấn đề khác</option>
                </select>
                <select
                  name="muc_do"
                  style={selectStyle}
                  value={formData.muc_do}
                  onChange={handleChange}
                >
                  <option value="thap">Thấp</option>
                  <option value="binh_thuong">Bình thường</option>
                  <option value="cao">Ưu tiên cao</option>
                  <option value="khan_cap">Khẩn cấp</option>
                </select>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                    background: "#fff",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: "#555",
                  }}
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  style={{
                    ...btnPrimaryStyle,
                    width: "auto",
                    padding: "10px 24px",
                  }}
                >
                  Tạo yêu cầu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const replyBarStyle = {
  padding: "12px 16px",
  borderTop: "1px solid #edf0ee",
  backgroundColor: "#ffffff",
  display: "flex",
  alignItems: "flex-end",
  gap: "10px",
};

const chatInputStyle = {
  flex: 1,
  minHeight: "42px",
  maxHeight: "90px",
  padding: "10px 14px",
  border: "1px solid #dfe5e2",
  borderRadius: "999px",
  fontSize: "13px",
  fontFamily: "inherit",
  outline: "none",
  resize: "none",
  boxSizing: "border-box",
  lineHeight: "1.4",
  backgroundColor: "#f8faf9",
};

const sendButtonStyle = {
  height: "42px",
  minWidth: "64px",
  padding: "0 16px",
  border: "none",
  borderRadius: "999px",
  backgroundColor: "#1c3f3a",
  color: "#fff",
  fontSize: "13px",
  fontWeight: "bold",
};

const closedReplyStyle = {
  padding: "14px 20px",
  borderTop: "1px solid #f0f0f0",
  backgroundColor: "#fafafa",
  textAlign: "center",
  fontSize: "13px",
  color: "#888",
};
const pageStyle = {
  width: "100%",
  boxSizing: "border-box",
  fontFamily: "Arial, sans-serif",
  backgroundColor: "#f8f9fa",
  padding: "30px 50px",
  minHeight: "calc(100vh - 70px)",
};
const cardStyle = {
  backgroundColor: "#fff",
  padding: "24px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  textAlign: "left",
};
const cardTitleStyle = {
  margin: "0 0 15px",
  fontSize: "16px",
  fontWeight: "bold",
  color: "#333",
};
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
const btnPrimaryStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#1c3f3a",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "14px",
};

export default SupportTickets;
