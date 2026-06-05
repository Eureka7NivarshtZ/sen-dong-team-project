import React, { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";

function ReviewSection({ tranhId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [debug, setDebug] = useState(null); // 🌟 DEBUG: Để xem nó đang query ID nào

  useEffect(() => {
    const fetchReviews = async () => {
      if (!tranhId) {
        setDebug("Lỗi: tranhId bị trống!");
        setLoading(false);
        return;
      }
      
      setDebug(`Đang query API với tranhId: ${tranhId}`);
      try {
        const res = await apiClient.get(`/danh-gia/tranh/${tranhId}`);
        // Log dữ liệu thật từ Server trả về vào Console (F12)
        console.log("Dữ liệu nhận xét nhận được từ Server:", res.data);
        
        if (res.data && res.data.success) {
          setReviews(res.data.data || []);
        }
      } catch (err) {
        console.error("Lỗi lấy danh sách đánh giá:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [tranhId]);

  const renderStars = (num) => "⭐".repeat(num);

  if (loading) return <p style={{ padding: "0 120px" }}>Đang tải bình luận...</p>;

  return (
    <div style={{ marginTop: "50px", borderTop: "2px solid #1c3f3a", paddingTop: "30px", paddingLeft: "120px", paddingRight: "120px", textAlign: "left" }}>
      {/* 🌟 DÒNG DEBUG: Giúp ông check xem tranhId truyền vào có đúng không */}
      {debug && <p style={{ fontSize: "12px", color: "red" }}>{debug}</p>}
      
      <h3 style={{ color: "#1c3f3a", margin: "0 0 20px 0", fontSize: "22px", fontWeight: "bold" }}>
        💬 Đánh giá ({reviews.length})
      </h3>

      {reviews.length === 0 ? (
        <p style={{ color: "#999" }}>Chưa có đánh giá nào cho tác phẩm này.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {reviews.map((item) => (
            <div key={item.id} style={{ borderBottom: "1px dashed #e2e8f0", paddingBottom: "15px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong style={{ color: "#333" }}>{item.khach_hang?.ho_ten || "Khách hàng"}</strong>
                <span style={{ fontSize: "12px", color: "#888" }}>{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
              <div style={{ fontSize: "14px" }}>{renderStars(item.so_sao)}</div>
              <p style={{ margin: "5px 0", color: "#444" }}>{item.noi_dung}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewSection;