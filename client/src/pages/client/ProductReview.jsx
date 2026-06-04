import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";

function ProductReview() {
  // Bóc tách biến an toàn qua React Router
  const { don_hang_id, tranh_id } = useParams(); 
  const navigate = useNavigate();
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const cleanDonHangId = parseInt(don_hang_id, 10);
  const cleanTranhId = parseInt(tranh_id, 10);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!cleanDonHangId || !cleanTranhId || isNaN(cleanDonHangId) || isNaN(cleanTranhId)) {
      alert("❌ Không tìm thấy mã đơn hàng hoặc mã tranh hợp lệ từ đường dẫn!");
      return;
    }

    if (!comment.trim()) return alert("Vui lòng nhập nội dung nhận xét!");

    setSubmitting(true);
    try {
      const payloadData = {
        tranh_id: cleanTranhId,
        don_hang_id: cleanDonHangId,
        so_sao: Number(rating),
        noi_dung: comment.trim()
      };

      const response = await apiClient.post("/danh-gia", payloadData);

      if (response.data && response.data.success) {
        alert("🎉 Gửi đánh giá trải nghiệm tác phẩm thành công!");
        navigate("/thong-tin-ca-nhan");
      } else {
        alert("Thất bại: " + (response.data.error || "Lỗi không xác định"));
      }
    } catch (err) {
      console.error("Lỗi chi tiết từ Server phản hồi:", err);
      const thongDiepLoiReal = err.response?.data?.error || err.response?.data?.message || "Lỗi kết nối đường truyền API.";
      alert("⚠ Không thể lưu đánh giá: " + thongDiepLoiReal);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "30px", border: "1px solid #eee", borderRadius: "8px", backgroundColor: "#fff", textAlign: "left" }}>
      <h2 style={{ color: "#1c3f3a", fontWeight: "bold", margin: "0 0 8px 0" }}>⭐ Đánh Giá Sản Phẩm</h2>
      <p style={{ color: "#666", fontSize: "14px", marginBottom: "25px" }}>Chia sẻ cảm nhận chân thực của ông sau khi nhận kiện tranh từ Sen Đông Art.</p>

      <form onSubmit={handleSubmitReview} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label style={{ display: "block", fontWeight: "600", marginBottom: "8px" }}>Mức độ hài lòng *</label>
          <div style={{ display: "flex", gap: "8px" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} onClick={() => setRating(star)} style={{ fontSize: "30px", cursor: "pointer", color: star <= rating ? "#ffb400" : "#ddd" }}>
                ★
              </span>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontWeight: "600", marginBottom: "8px" }}>Nội dung nhận xét nhận hàng *</label>
          <textarea 
            placeholder="Hãy ghi cảm nhận về độ sắc nét của màu vẽ, khung tranh hoặc khâu gói bọc hàng vận chuyển nhé..." 
            rows="5" 
            value={comment} 
            onChange={(e) => setComment(e.target.value)} 
            required
            style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box", fontSize: "14px", outline: "none", resize: "none" }}
          />
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <button type="button" onClick={() => navigate("/thong-tin-ca-nhan")} style={{ padding: "10px 18px", backgroundColor: "#aaa", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>Hủy</button>
          <button type="submit" disabled={submitting} style={{ padding: "10px 24px", backgroundColor: "#1c3f3a", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
            {submitting ? "Đang gửi..." : "Gửi Đánh Giá Hoàn Tất"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductReview;