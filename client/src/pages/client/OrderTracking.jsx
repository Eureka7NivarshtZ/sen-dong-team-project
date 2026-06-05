import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import donHangService from "../../services/donHangService";
import apiClient from "../../services/apiClient"; 

const STATUS_LABEL = {
  cho_xac_nhan: "Chờ xác nhận",
  dang_chuan_bi: "Đang chuẩn bị",
  dang_giao: "Đang giao",
  hoan_thanh: "Hoàn thành",
  huy: "Đã hủy",
};

const STATUS_STYLE = {
  cho_xac_nhan: { backgroundColor: "#fff7e6", color: "#d48806", borderColor: "#ffd591" },
  dang_chuan_bi: { backgroundColor: "#e6f4ff", color: "#1677ff", borderColor: "#91caff" },
  dang_giao: { backgroundColor: "#f0f5ff", color: "#2f54eb", borderColor: "#adc6ff" },
  hoan_thanh: { backgroundColor: "#f6ffed", color: "#389e0d", borderColor: "#b7eb8f" },
  huy: { backgroundColor: "#fff1f0", color: "#cf1322", borderColor: "#ffa39e" },
};

const STATUS_STEPS = [
  { value: "cho_xac_nhan", label: "Chờ xác nhận", description: "Đơn hàng đã được tạo." },
  { value: "dang_chuan_bi", label: "Đang chuẩn bị", description: "Xưởng đang chuẩn bị tranh." },
  { value: "dang_giao", label: "Đang giao", description: "Đơn hàng đang được giao." },
  { value: "hoan_thanh", label: "Hoàn thành", description: "Đơn hàng đã hoàn tất." },
];

function parseMoney(value) {
  if (value === null || value === undefined || value === "") return 0;
  if (typeof value === "number") return value;
  const text = String(value).trim();
  if (/^\d+(\.\d+)?$/.test(text)) return Number(text);
  return Number(text.replace(/[^\d]/g, "")) || 0;
}

function formatCurrency(value) {
  return parseMoney(value).toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" });
}

function getOrderTimestamp(order) {
  const value = order?.ngay_dat || order?.createdAt || order?.created_at || order?.updatedAt || order?.updated_at;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function sortOrdersNewestFirst(list) {
  return [...(list || [])].sort((a, b) => getOrderTimestamp(b) - getOrderTimestamp(a));
}

function getOrderCode(order) {
  return order?.ma_don_hang || `DH-${order?.id}`;
}

function getOrderTotal(order) {
  if (order?.tong_thanh_toan !== undefined && order?.tong_thanh_toan !== null) return parseMoney(order.tong_thanh_toan);
  if (order?.tong_tien !== undefined && order?.tong_tien !== null) return parseMoney(order.tong_tien);
  const tongTienHang = parseMoney(order?.tong_tien_hang);
  const phiVanChuyen = parseMoney(order?.phi_van_chuyen);
  const giamGia = parseMoney(order?.giam_gia) || parseMoney(order?.so_tien_giam) || 0;
  return Math.max(tongTienHang + phiVanChuyen - giamGia, 0);
}

function getOrderItems(order) {
  return order?.don_hang_chi_tiet || order?.chi_tiet || order?.chi_tiet_don_hang || order?.items || order?.donHangChiTiet || [];
}

function getItemName(item) {
  return item?.tranh?.ten_tranh || item?.ten_tranh || "Tác phẩm nghệ thuật";
}

function getItemPrice(item) {
  return parseMoney(item?.don_gia || item?.tranh?.gia_ban || 0);
}

function getItemQuantity(item) {
  return Number(item?.so_luong || 1);
}

function normalizeOrderListResponse(result) {
  const data = result?.data;
  const possibleLists = [data, data?.danh_sach, data?.orders, data?.don_hang, data?.donHangs, result?.data];
  const rawList = possibleLists.find((item) => Array.isArray(item)) || [];
  return sortOrdersNewestFirst(rawList);
}

function normalizeOrderDetailResponse(result) {
  return result?.data?.don_hang || result?.data?.order || result?.data || null;
}

function OrderTracking() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [reviewItem, setReviewItem] = useState(null); 
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [error, setError] = useState("");

  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchStatus = selectedStatus ? order.trang_thai === selectedStatus : true;
      const matchKeyword = keyword
        ? String(getOrderCode(order)).toLowerCase().includes(keyword) ||
          String(order.ten_nguoi_nhan || "").toLowerCase().includes(keyword) ||
          String(order.dia_chi_giao || "").toLowerCase().includes(keyword)
        : true;
      return matchStatus && matchKeyword;
    });
  }, [orders, selectedStatus, search]);

  const stats = useMemo(() => {
    return {
      total: orders.length,
      waiting: orders.filter((item) => item.trang_thai === "cho_xac_nhan").length,
      shipping: orders.filter((item) => item.trang_thai === "dang_giao").length,
      completed: orders.filter((item) => item.trang_thai === "hoan_thanh").length,
    };
  }, [orders]);

  const fetchMyOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await donHangService.xemDonCuaToi();
      if (result?.success) {
        setOrders(normalizeOrderListResponse(result));
      } else {
        setOrders([]);
        setError(result?.error || "Không thể tải danh sách đơn hàng");
      }
    } catch (err) {
      console.error("Lỗi tải đơn hàng của tôi:", err);
      setOrders([]);
      setError("Có lỗi khi tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const handleViewDetail = async (order) => {
    if (!order?.id) return;
    setDetailLoading(true);
    setSelectedOrder(null);
    try {
      const result = await donHangService.xemChiTietDonCuaToi(order.id);
      if (result?.success) {
        const detail = normalizeOrderDetailResponse(result);
        setSelectedOrder(detail || order);
      } else {
        alert(result?.error || "Không thể xem chi tiết đơn hàng");
      }
    } catch (err) {
      console.error("Lỗi xem chi tiết đơn hàng:", err);
      alert("Có lỗi khi xem chi tiết đơn hàng");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCancelOrder = async (order) => {
    if (!order?.id) return;
    if (!["cho_xac_nhan", "dang_chuan_bi"].includes(order.trang_thai)) {
      alert("Chỉ có thể hủy đơn khi đơn đang Chờ xác nhận hoặc Đang chuẩn bị.");
      return;
    }
    const ok = window.confirm(`Bạn có chắc muốn hủy đơn ${getOrderCode(order)} không?`);
    if (!ok) return;

    setCancelLoading(true);
    try {
      const result = await donHangService.huyDonCuaToi(order.id);
      if (result?.success) {
        alert("Hủy đơn hàng thành công");
        setSelectedOrder(null);
        await fetchMyOrders();
      } else {
        alert(result?.error || "Hủy đơn hàng thất bại");
      }
    } catch (err) {
      console.error("Lỗi hủy đơn:", err);
      alert("Có lỗi khi hủy đơn hàng");
    } finally {
      setCancelLoading(false);
    }
  };

  // 🌟 HÀM GỬI ĐÁNH GIÁ ĐÃ SỬA: Giữ nguyên ID dạng chuỗi UUID để khớp chuẩn đét SQL Server
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return alert("Vui lòng nhập nội dung nhận xét!");

    // 🏆 GIỮ NGUYÊN KIỂU CHUỖI (STRING) CỦA UUID, KHÔNG ÉP SANG NUMBER NỮA!
    const cleanDonHangId = reviewItem?.don_hang_id;
    const cleanTranhId = reviewItem?.tranh_id;
    const cleanSoSao = Number(rating); // Số sao vẫn là số nguyên TINYINT

    if (!cleanDonHangId || !cleanTranhId) {
      alert("❌ Lỗi cấu trúc mã định danh UUID của Đơn hàng hoặc Tranh!");
      return;
    }

    setReviewLoading(true);
    try {
      const bodyData = {
        tranh_id: cleanTranhId,      // Bắn chuỗi UUID chuẩn chỉnh sang Backend
        don_hang_id: cleanDonHangId,  // Bắn chuỗi UUID chuẩn chỉnh sang Backend
        so_sao: cleanSoSao,          //
        noi_dung: comment.trim(),    //
        hinh_anh_url: ""             //
      };

      console.log("Dữ liệu UUID gửi lên Backend thật:", bodyData);

      const response = await apiClient.post("/danh-gia", bodyData);

      if (response.data && response.data.success) {
        alert("🎉 " + (response.data.message || "Gửi đánh giá thành công, vui lòng chờ duyệt!"));
        setReviewItem(null);
        setComment("");
        setRating(5);
        if (selectedOrder) handleViewDetail(selectedOrder);
      } else {
        alert("Thất bại: " + (response.data.error || "Không thể lưu dữ liệu"));
      }
    } catch (err) {
      console.error("Lỗi gửi API đánh giá:", err);
      alert("⚠ Lỗi: " + (err.response?.data?.error || "Hệ thống từ chối xử lý lưu trữ đánh giá."));
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f6f7f8", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "40px 20px 70px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", alignItems: "flex-start", marginBottom: "24px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "30px", color: "#1c3f3a" }}>Theo dõi đơn hàng</h1>
            <p style={{ margin: "8px 0 0", color: "#667085", lineHeight: 1.5 }}>Kiểm tra trạng thái xử lý, vận chuyển và chi tiết các đơn hàng của bạn.</p>
          </div>
          <button onClick={fetchMyOrders} disabled={loading} style={{ padding: "11px 18px", borderRadius: "8px", border: "none", backgroundColor: loading ? "#98a2b3" : "#1c3f3a", color: "#fff", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}>
            {loading ? "Đang tải..." : "Làm mới"}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "16px", marginBottom: "22px" }}>
          <StatCard label="Tổng đơn" value={stats.total} />
          <StatCard label="Chờ xác nhận" value={stats.waiting} />
          <StatCard label="Đang giao" value={stats.shipping} />
          <StatCard label="Hoàn thành" value={stats.completed} />
        </div>

        <div style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "18px", boxShadow: "0 6px 18px rgba(0,0,0,0.05)", marginBottom: "20px", display: "flex", gap: "12px", alignItems: "center" }}>
          <input type="text" placeholder="Tìm theo mã đơn, tên người nhận, địa chỉ..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1, padding: "12px 14px", border: "1px solid #d0d5dd", borderRadius: "8px", outline: "none", fontSize: "14px" }} />
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} style={{ minWidth: "190px", padding: "12px 14px", border: "1px solid #d0d5dd", borderRadius: "8px", outline: "none", fontSize: "14px" }}>
            <option value="">Tất cả trạng thái</option>
            <option value="cho_xac_nhan">Chờ xác nhận</option>
            <option value="dang_chuan_bi">Đang chuẩn bị</option>
            <option value="dang_giao">Đang giao</option>
            <option value="hoan_thanh">Hoàn thành</option>
            <option value="huy">Đã hủy</option>
          </select>
        </div>

        {error && <div style={{ padding: "13px 15px", borderRadius: "10px", backgroundColor: "#fff1f0", color: "#cf1322", marginBottom: "18px" }}>{error}</div>}

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {loading ? (
            <EmptyBox text="Đang tải đơn hàng..." />
          ) : filteredOrders.length === 0 ? (
            <div style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "50px 20px", textAlign: "center", boxShadow: "0 6px 18px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>📦</div>
              <h3 style={{ margin: "0 0 8px", color: "#1c3f3a" }}>Chưa có đơn hàng</h3>
              <p style={{ margin: "0 0 20px", color: "#667085" }}>Khi bạn đặt hàng thành công, đơn hàng sẽ xuất hiện tại đây.</p>
              <button onClick={() => navigate("/tranh")} style={{ padding: "11px 18px", borderRadius: "8px", border: "none", backgroundColor: "#1c3f3a", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Khám phá bộ sưu tập</button>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} onViewDetail={() => handleViewDetail(order)} onCancel={() => handleCancelOrder(order)} cancelLoading={cancelLoading} />
            ))
          )}
        </div>
      </div>

      {/* MODAL CHI TIẾT ĐƠN HÀNG */}
      {(selectedOrder || detailLoading) && (
        <OrderDetailModal
          order={selectedOrder}
          loading={detailLoading}
          onClose={() => setSelectedOrder(null)}
          onOpenReviewForm={(donHangId, tranhId, tenTranh) => {
            setReviewItem({ don_hang_id: donHangId, tranh_id: tranhId, ten_tranh: tenTranh });
          }}
        />
      )}

      {/* WINDOW MODAL VIẾT ĐÁNH GIÁ TRỰC DIỆN */}
      {reviewItem && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 4000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ width: "520px", backgroundColor: "#fff", borderRadius: "12px", padding: "25px", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", textAlign: "left" }}>
            <h3 style={{ margin: "0 0 6px 0", color: "#1c3f3a", fontWeight: "bold", fontSize: "19px" }}>⭐ Viết Đánh Giá Tác Phẩm</h3>
            <p style={{ margin: "0 0 20px 0", color: "#e67e22", fontSize: "14px", fontWeight: "600" }}>Tác phẩm: {reviewItem.ten_tranh}</p>
            
            <form onSubmit={handleSubmitReview}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontWeight: "600", marginBottom: "8px", fontSize: "14px" }}>Số sao hài lòng *</label>
                <div style={{ display: "flex", gap: "6px" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} onClick={() => setRating(star)} style={{ fontSize: "32px", cursor: "pointer", color: star <= rating ? "#ffb400" : "#ddd" }}>★</span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontWeight: "600", marginBottom: "8px", fontSize: "14px" }}>Nội dung nhận xét kiện hàng *</label>
                <textarea rows="4" required placeholder="Ghi nhận xét của ông về độ sắc nét màu vẽ, khâu gói bọc khung tranh của xưởng tranh..." value={comment} onChange={(e) => setComment(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box", fontSize: "14px", outline: "none", resize: "none" }} />
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button type="button" onClick={() => { setReviewItem(null); setComment(""); }} style={{ padding: "10px 16px", backgroundColor: "#f2f4f7", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>Hủy</button>
                <button type="submit" disabled={reviewLoading} style={{ padding: "10px 22px", backgroundColor: "#1c3f3a", color: "#fff", border: "none", borderRadius: "6px", cursor: reviewLoading ? "not-allowed" : "pointer", fontWeight: "bold" }}>
                  {reviewLoading ? "Đang gửi..." : "Gửi Đánh Giá"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "18px", boxShadow: "0 6px 18px rgba(0,0,0,0.05)" }}>
      <p style={{ margin: 0, color: "#667085", fontSize: "14px" }}>{label}</p>
      <h2 style={{ margin: "8px 0 0", color: "#1c3f3a" }}>{value}</h2>
    </div>
  );
}

function EmptyBox({ text }) {
  return (
    <div style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "36px", textAlign: "center", color: "#667085", boxShadow: "0 6px 18px rgba(0,0,0,0.05)" }}>{text}</div>
  );
}

function StatusBadge({ status }) {
  const style = STATUS_STYLE[status] || { backgroundColor: "#f2f4f7", color: "#344054", borderColor: "#d0d5dd" };
  return <span style={{ display: "inline-flex", alignItems: "center", padding: "6px 11px", borderRadius: "999px", border: "1px solid", fontSize: "12px", fontWeight: 700, ...style }}>{STATUS_LABEL[status] || status || "Không rõ"}</span>;
}

function OrderCard({ order, onViewDetail, onCancel, cancelLoading }) {
  const canCancel = ["cho_xac_nhan", "dang_chuan_bi"].includes(order.trang_thai);

  return (
    <div style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "20px", boxShadow: "0 6px 18px rgba(0,0,0,0.05)", border: "1px solid #eef2f6" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", marginBottom: "16px", alignItems: "flex-start" }}>
        <div>
          <h3 style={{ margin: "0 0 6px", color: "#1c3f3a" }}>{getOrderCode(order)}</h3>
          <p style={{ margin: 0, color: "#667085", fontSize: "14px" }}>Ngày đặt: {formatDateTime(order.ngay_dat || order.createdAt)}</p>
        </div>
        <StatusBadge status={order.trang_thai} />
      </div>

      <OrderTimeline status={order.trang_thai} />

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: "14px", marginTop: "18px", paddingTop: "16px", borderTop: "1px solid #eef2f6" }}>
        <InfoItem label="Người nhận" value={order.ten_nguoi_nhan || "-"} />
        <InfoItem label="Số điện thoại" value={order.sdt_nguoi_nhan || "-"} />
        <InfoItem label="Tổng thanh toán" value={formatCurrency(getOrderTotal(order))} />
      </div>

      <div style={{ marginTop: "12px" }}>
        <InfoItem label="Địa chỉ giao" value={order.dia_chi_giao || "-"} />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "18px" }}>
        {canCancel && (
          <button onClick={onCancel} disabled={cancelLoading} style={{ padding: "10px 14px", borderRadius: "8px", border: "none", backgroundColor: cancelLoading ? "#98a2b3" : "#ff4d4f", color: "#fff", fontWeight: 700, cursor: cancelLoading ? "not-allowed" : "pointer" }}>{cancelLoading ? "Đang hủy..." : "Hủy đơn"}</button>
        )}
        <button onClick={onViewDetail} style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #1c3f3a", backgroundColor: "#fff", color: "#1c3f3a", fontWeight: 700, cursor: "pointer" }}>Xem chi tiết</button>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p style={{ margin: "0 0 5px", color: "#667085", fontSize: "13px" }}>{label}</p>
      <strong style={{ color: "#1c3f3a", fontSize: "14px", wordBreak: "break-word" }}>{value}</strong>
    </div>
  );
}

function OrderTimeline({ status }) {
  if (status === "huy") {
    return <div style={{ padding: "12px 14px", borderRadius: "10px", backgroundColor: "#fff1f0", color: "#cf1322", fontWeight: 700 }}>Đơn hàng đã bị hủy.</div>;
  }
  const currentIndex = STATUS_STEPS.findIndex((item) => item.value === status);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "10px" }}>
      {STATUS_STEPS.map((step, index) => {
        const active = currentIndex >= index;
        return (
          <div key={step.value} style={{ padding: "12px", borderRadius: "10px", backgroundColor: active ? "#edf7f2" : "#f8fafc", border: active ? "1px solid #1c3f3a" : "1px solid #eaecf0" }}>
            <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: active ? "#1c3f3a" : "#d0d5dd", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, marginBottom: "8px" }}>{active ? "✓" : index + 1}</div>
            <strong style={{ display: "block", color: active ? "#1c3f3a" : "#667085", fontSize: "13px" }}>{step.label}</strong>
            <p style={{ margin: "5px 0 0", color: "#667085", fontSize: "12px", lineHeight: 1.4 }}>{step.description}</p>
          </div>
        );
      })}
    </div>
  );
}

function OrderDetailModal({ order, loading, onClose, onOpenReviewForm }) {
  const items = getOrderItems(order);
  const finalOrder = order?.data || order;
  const isCompleted = finalOrder?.trang_thai === "hoan_thanh";

  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.45)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ width: "850px", maxWidth: "100%", maxHeight: "90vh", overflowY: "auto", backgroundColor: "#fff", borderRadius: "16px", padding: "24px" }}>
        {loading ? (
          <p style={{ margin: 0 }}>Đang tải chi tiết đơn hàng...</p>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "flex-start", marginBottom: "18px" }}>
              <div>
                <h2 style={{ margin: "0 0 6px", color: "#1c3f3a" }}>Chi tiết đơn hàng</h2>
                <p style={{ margin: 0, color: "#667085" }}>{getOrderCode(order)} — {formatDateTime(finalOrder?.ngay_dat || finalOrder?.createdAt)}</p>
              </div>
              <button onClick={onClose} style={{ border: "none", backgroundColor: "#f2f4f7", borderRadius: "8px", padding: "9px 12px", cursor: "pointer", fontWeight: 700 }}>Đóng</button>
            </div>

            <div style={{ marginBottom: "18px" }}>
              <StatusBadge status={finalOrder?.trang_thai} />
            </div>

            <OrderTimeline status={finalOrder?.trang_thai} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "18px", marginBottom: "18px" }}>
              <DetailBox label="Người nhận" value={finalOrder?.ten_nguoi_nhan || "-"} />
              <DetailBox label="Số điện thoại" value={finalOrder?.sdt_nguoi_nhan || "-"} />
              <DetailBox label="Địa chỉ giao" value={finalOrder?.dia_chi_giao || "-"} />
              <DetailBox label="Thanh toán" value={finalOrder?.phuong_thuc_thanh_toan === "cod" ? "Thanh toán khi nhận hàng" : finalOrder?.phuong_thuc_thanh_toan || "-"} />
              <DetailBox label="Đơn vị vận chuyển" value={finalOrder?.don_vi_van_chuyen?.ten || finalOrder?.don_vi_van_chuyen?.ten_don_vi || "-"} />
              <DetailBox label="Ghi chú" value={finalOrder?.ghi_chu || "-"} />
            </div>

            <h3 style={{ color: "#1c3f3a", marginBottom: "12px" }}>Sản phẩm trong đơn</h3>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #eaecf0" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc", textAlign: "left" }}>
                    <th style={thStyle}>Sản phẩm</th>
                    <th style={thStyle}>Số lượng</th>
                    <th style={thStyle}>Đơn giá</th>
                    <th style={thStyle}>Thành tiền</th>
                    {isCompleted && <th style={{ ...thStyle, textAlign: "center" }}>Tác vụ</th>}
                  </tr>
                </thead>

                <tbody>
                  {items.length === 0 ? (
                    <tr><td colSpan={isCompleted ? "5" : "4"} style={emptyStyle}>Chưa có dữ liệu sản phẩm.</td></tr>
                  ) : (
                    items.map((item, index) => {
                      const qty = getItemQuantity(item);
                      const price = getItemPrice(item);
                      
                      // 🌟 TRUY XUẤT CHUỖI UUID: Giữ nguyên dạng gốc chữ và số từ DB lên
                      const exactDonHangId = finalOrder?.id || item?.don_hang_id;
                      const exactTranhId = item?.tranh_id || item?.tranhId || item?.tranh?.id;

                      return (
                        <tr key={item.id || index} style={{ borderTop: "1px solid #eaecf0" }}>
                          <td style={tdStyle}>{getItemName(item)}</td>
                          <td style={tdStyle}>{qty}</td>
                          <td style={tdStyle}>{formatCurrency(price)}</td>
                          <td style={tdStyle}>{formatCurrency(qty * price)}</td>
                          
                          {isCompleted && (
                            <td style={{ ...tdStyle, textAlign: "center" }}>
                              <button
                                onClick={() => onOpenReviewForm(exactDonHangId, exactTranhId, getItemName(item))}
                                style={{ padding: "6px 12px", backgroundColor: "#1c3f3a", color: "#fff", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
                              >
                                ⭐ Đánh giá
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: "18px", backgroundColor: "#f8fafc", border: "1px solid #eaecf0", borderRadius: "12px", padding: "16px" }}>
              <SummaryLine label="Tiền hàng" value={formatCurrency(finalOrder?.tong_tien_hang || 0)} />
              <SummaryLine label="Phí vận chuyển" value={formatCurrency(finalOrder?.phi_van_chuyen || 0)} />
              {parseMoney(finalOrder?.giam_gia || finalOrder?.so_tien_giam) > 0 && (
                <SummaryLine label="Giảm giá" value={`-${formatCurrency(finalOrder?.giam_gia || finalOrder?.so_tien_giam)}`} danger />
              )}
              <div style={{ borderTop: "1px solid #d0d5dd", marginTop: "10px", paddingTop: "10px" }}>
                <SummaryLine label="Tổng thanh toán" value={formatCurrency(getOrderTotal(order))} strong />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
              <button onClick={onClose} style={{ padding: "11px 16px", borderRadius: "8px", border: "1px solid #1c3f3a", backgroundColor: "#fff", color: "#1c3f3a", fontWeight: 700, cursor: "pointer" }}>Đóng</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function DetailBox({ label, value }) {
  return (
    <div style={{ backgroundColor: "#f8fafc", border: "1px solid #eaecf0", borderRadius: "10px", padding: "12px" }}>
      <p style={{ margin: "0 0 6px", color: "#667085", fontSize: "13px" }}>{label}</p>
      <strong style={{ color: "#1c3f3a", wordBreak: "break-word" }}>{value}</strong>
    </div>
  );
}

function SummaryLine({ label, value, danger, strong }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "8px", color: danger ? "#cf1322" : strong ? "#2e7d32" : "#344054", fontSize: strong ? "17px" : "14px" }}>
      <span style={{ fontWeight: strong ? 700 : 400 }}>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

const thStyle = { padding: "12px", fontSize: "13px", fontWeight: 700, color: "#475467" };
const tdStyle = { padding: "12px", verticalAlign: "middle", color: "#344054" };
const emptyStyle = { padding: "28px", textAlign: "center", color: "#667085" };

export default OrderTracking;