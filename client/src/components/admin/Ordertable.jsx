import React from "react";

function OrderTable() {
  return (
    <div className="table-box" style={{ backgroundColor: "#ffffff", padding: "25px", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid #f0f0f0", textAlign: "left" }}>
      <h2 style={{ margin: "0 0 20px 0", fontSize: "16px", color: "#333", fontWeight: "bold" }}>
        Đơn hàng gần đây
      </h2>
      
      <table className="order-table" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #f0f0f0", color: "#777", fontSize: "14px", textAlign: "left" }}>
            <th style={{ padding: "12px 8px" }}>Mã đơn</th>
            <th style={{ padding: "12px 8px" }}>Khách hàng</th>
            <th style={{ padding: "12px 8px" }}>Địa chỉ</th>
            <th style={{ padding: "12px 8px" }}>Trạng thái</th>
            <th style={{ padding: "12px 8px" }}>Ngày đặt</th>
          </tr>
        </thead>
        <tbody style={{ fontSize: "14px", color: "#333" }}>
          <tr style={{ borderBottom: "1px solid #f5f5f5" }}>
            <td style={{ padding: "12px 8px" }}>00001</td>
            <td style={{ padding: "12px 8px", fontWeight: "600" }}>Christine Brooks</td>
            <td style={{ padding: "12px 8px" }}>123 Lê Lợi, Hà Nội</td>
            <td style={{ padding: "12px 8px" }}>
              <span style={{ color: "#2e7d32", backgroundColor: "#e8f5e9", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" }}>
                Hoàn thành
              </span>
            </td>
            <td style={{ padding: "12px 8px" }}>2026-05-20</td>
          </tr>
          <tr style={{ borderBottom: "1px solid #f5f5f5" }}>
            <td style={{ padding: "12px 8px" }}>00002</td>
            <td style={{ padding: "12px 8px", fontWeight: "600" }}>Rosie Pearson</td>
            <td style={{ padding: "12px 8px" }}>45 Nguyễn Trãi, Hà Nội</td>
            <td style={{ padding: "12px 8px" }}>
              <span style={{ color: "#f57c00", backgroundColor: "#fff3e0", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" }}>
                Đang xử lý
              </span>
            </td>
            <td style={{ padding: "12px 8px" }}>2026-05-21</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default OrderTable;