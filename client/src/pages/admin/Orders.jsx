import { useState } from "react";
import Topbar from "../../components/admin/Topbar";

function Orders() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Xác định đang Thêm hay Sửa
  const [editId, setEditId] = useState(null);

  const [newCustomer, setNewCustomer] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newTotal, setNewTotal] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");

  const [orders, setOrders] = useState([
    { id: "00001", customer: "Christine Brooks", address: "089 Kutch Green Apt. 448", date: "14 Feb 2026", total: "4,200,000 đ", status: "Hoàn thành" },
    { id: "00002", customer: "Rosie Pearson", address: "979 Immanuel Ferry Suite 526", date: "14 Feb 2026", total: "12,500,000 đ", status: "Đang xử lý" },
    { id: "00003", customer: "Darrell Caldwell", address: "8587 Frida Ports", date: "14 Feb 2026", total: "3,800,000 đ", status: "Đã hủy" }
  ]);

  // Bấm nút Tạo đơn mới
  const openAddModal = () => {
    setIsEditing(false);
    setNewCustomer("");
    setNewAddress("");
    setNewTotal("");
    setShowModal(true);
  };

  // Bấm nút Sửa - Điền sẵn dữ liệu cũ vào các ô Input
  const openEditModal = (item) => {
    setIsEditing(true);
    setEditId(item.id);
    setNewCustomer(item.customer);
    setNewAddress(item.address);
    setNewTotal(item.total.replace(/ đ/g, "")); // Bỏ chữ đ để nhập số
    setShowModal(true);
  };

  // Xử lý khi bấm nút Lưu trong Modal
  const handleSaveOrder = () => {
    if (!newCustomer || !newAddress || !newTotal) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (isEditing) {
      // Logic Cập nhật thông tin đơn hàng cũ
      const updatedOrders = orders.map((o) =>
        o.id === editId ? { ...o, customer: newCustomer, address: newAddress, total: newTotal + " đ" } : o
      );
      setOrders(updatedOrders);
      alert("Cập nhật đơn hàng thành công!");
    } else {
      // Logic Thêm đơn hàng mới
      const newOrder = {
        id: String(orders.length + 1).padStart(5, "0"),
        customer: newCustomer,
        address: newAddress,
        date: "14 Feb 2026",
        total: newTotal + " đ",
        status: "Đang xử lý",
      };
      setOrders([...orders, newOrder]);
      alert("Tạo đơn hàng mới thành công!");
    }

    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đơn này?")) {
      setOrders(orders.filter((item) => item.id !== id));
    }
  };

  const filteredOrders = orders.filter((item) => {
    const matchSearch = item.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "Tất cả" || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="dashboard-content" style={{ flex: 1, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
        <Topbar />
        
        <div style={{ padding: "30px", textAlign: "left" }}>
          <div className="order-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
            <h1 style={{ color: "#1c3f3a", margin: 0, fontSize: "24px", fontWeight: "bold" }}>Đơn hàng</h1>
            <div className="header-right" style={{ display: "flex", gap: "15px" }}>
              <input type="text" placeholder="Tìm khách hàng..." value={search} onChange={(e) => setSearch(e.target.value)} className="search-input" style={{ padding: "8px 15px", borderRadius: "6px", border: "1px solid #ccc" }} />
              <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: "8px 15px", borderRadius: "6px", border: "1px solid #ccc" }}>
                <option>Tất cả</option>
                <option>Hoàn thành</option>
                <option>Đang xử lý</option>
                <option>Đã hủy</option>
              </select>
              <button className="save-btn" onClick={openAddModal} style={{ padding: "10px 20px", backgroundColor: "#1c3f3a", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
                + Tạo đơn
              </button>
            </div>
          </div>

          <div className="table-box" style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            <table className="order-table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #f0f0f0", color: "#555", textAlign: "left" }}>
                  <th style={{ padding: "12px" }}>Mã đơn</th>
                  <th style={{ padding: "12px" }}>Khách hàng</th>
                  <th style={{ padding: "12px" }}>Địa chỉ</th>
                  <th style={{ padding: "12px" }}>Ngày đặt</th>
                  <th style={{ padding: "12px" }}>Thành tiền</th>
                  <th style={{ padding: "12px" }}>Trạng thái</th>
                  <th style={{ padding: "12px" }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "12px" }}>{item.id}</td>
                    <td style={{ padding: "12px", fontWeight: "600" }}>{item.customer}</td>
                    <td style={{ padding: "12px" }}>{item.address}</td>
                    <td style={{ padding: "12px" }}>{item.date}</td>
                    <td style={{ padding: "12px", color: "#2e7d32", fontWeight: "bold" }}>{item.total}</td>
                    <td style={{ padding: "12px" }}>
                      <span style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold", backgroundColor: item.status === "Hoàn thành" ? "#e8f5e9" : item.status === "Đang xử lý" ? "#fff3e0" : "#fff0f0", color: item.status === "Hoàn thành" ? "#2e7d32" : item.status === "Đang xử lý" ? "#f57c00" : "#ff4d4f" }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px", display: "flex", gap: "8px" }}>
                      <button className="edit-btn" onClick={() => openEditModal(item)} style={{ padding: "6px 12px", backgroundColor: "#f39c12", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>Sửa</button>
                      <button className="delete-btn" onClick={() => handleDelete(item.id)} style={{ padding: "6px 12px", backgroundColor: "#ff4d4f", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
    </div>

      {showModal && (
        <div className="modal-overlay" style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
          <div className="modal" style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "10px", width: "400px" }}>
            <h2 style={{ margin: "0 0 20px 0", color: "#1c3f3a" }}>{isEditing ? "Cập nhật đơn hàng" : "Tạo đơn hàng"}</h2>
            <input type="text" placeholder="Tên khách hàng" value={newCustomer} onChange={(e) => setNewCustomer(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
            <input type="text" placeholder="Địa chỉ" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
            <input type="text" placeholder="Thành tiền (đ)" value={newTotal} onChange={(e) => setNewTotal(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "20px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
            <div className="modal-buttons" style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button className="cancel-btn" onClick={() => setShowModal(false)} style={{ padding: "8px 16px", backgroundColor: "#aaa", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>Hủy</button>
              <button className="save-btn" onClick={handleSaveOrder} style={{ padding: "8px 16px", backgroundColor: "#1c3f3a", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;