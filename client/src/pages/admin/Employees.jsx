import { useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";

function Employees({ onNavigate }) {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [employees, setEmployees] = useState([
    { id: 1, name: "Trương Minh Khang", role: "Chủ tịch", phone: "090873940" },
    { id: 2, name: "Đặng Hồ Đăng Khôi", role: "Nhân viên", phone: "090789364" },
    { id: 3, name: "Phùng Thanh Đô", role: "Quản lý", phone: "090627384" }
  ]);

  const [newEmployee, setNewEmployee] = useState({ name: "", role: "", phone: "" });

  const filteredEmployees = employees.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setIsEditing(false);
    setNewEmployee({ name: "", role: "", phone: "" });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setIsEditing(true);
    setEditId(item.id);
    setNewEmployee({ name: item.name, role: item.role, phone: item.phone });
    setShowModal(true);
  };

  const handleSaveEmployee = () => {
    if (!newEmployee.name || !newEmployee.role || !newEmployee.phone) {
      alert("Vui lòng điền đầy đủ thông tin nhân sự!");
      return;
    }

    if (isEditing) {
      // Logic sửa dữ liệu cũ
      const updated = employees.map((emp) =>
        emp.id === editId ? { ...emp, name: newEmployee.name, role: newEmployee.role, phone: newEmployee.phone } : emp
      );
      setEmployees(updated);
      alert("Cập nhật thông tin nhân viên thành công!");
    } else {
      // Logic thêm mới dữ liệu
      const item = {
        id: employees.length + 1,
        name: newEmployee.name,
        role: newEmployee.role,
        phone: newEmployee.phone,
      };
      setEmployees([...employees, item]);
      alert("Thêm nhân viên mới thành công!");
    }

    setShowModal(false);
  };

  return (
    <div className="dashboard-container" style={{ display: "flex", width: "100%" }}>
      <Sidebar onNavigate={onNavigate} currentTab="admin-employees" />
      <div className="dashboard-content" style={{ flex: 1, backgroundColor: "#f4f6f9", minHeight: "100vh" }}>
        <Topbar />
        
        <div style={{ padding: "30px", textAlign: "left" }}>
          <div className="painting-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
            <h1 style={{ color: "#1c3f3a", margin: 0, fontSize: "24px", fontWeight: "bold" }}>Quản lý nhân viên</h1>
            <div className="painting-actions" style={{ display: "flex", gap: "15px" }}>
              <input type="text" placeholder="Tìm tên nhân viên..." className="search-input" value={search} onChange={(e) => setSearch(e.target.value)} style={{ padding: "8px 15px", borderRadius: "6px", border: "1px solid #ccc" }} />
              <button className="add-btn" onClick={openAddModal} style={{ padding: "10px 20px", backgroundColor: "#1c3f3a", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
                + Thêm Nhân Viên
              </button>
            </div>
          </div>

          <div className="table-box" style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            <table className="painting-table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #f0f0f0", color: "#555", textAlign: "left" }}>
                  <th style={{ padding: "12px" }}>Nhân viên</th>
                  <th style={{ padding: "12px" }}>Vai trò</th>
                  <th style={{ padding: "12px" }}>SĐT</th>
                  <th style={{ padding: "12px" }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "12px", fontWeight: "600" }}>{item.name}</td>
                    <td style={{ padding: "12px" }}>{item.role}</td>
                    <td style={{ padding: "12px" }}>{item.phone}</td>
                    <td style={{ padding: "12px" }}>
                      <button className="edit-btn" onClick={() => openEditModal(item)} style={{ padding: "6px 12px", backgroundColor: "#f39c12", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>Sửa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
          <div className="modal" style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "10px", width: "400px" }}>
            <h2>{isEditing ? "Sửa thông tin nhân viên" : "Thêm nhân viên mới"}</h2>
            <input type="text" placeholder="Tên nhân viên" value={newEmployee.name} onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })} style={{ width: "100%", padding: "10px", marginBottom: "12px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
            <input type="text" placeholder="Vai trò" value={newEmployee.role} onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })} style={{ width: "100%", padding: "10px", marginBottom: "12px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
            <input type="text" placeholder="Số điện thoại" value={newEmployee.phone} onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })} style={{ width: "100%", padding: "10px", marginBottom: "20px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
            <div className="modal-buttons" style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button className="cancel-btn" onClick={() => setShowModal(false)} style={{ padding: "8px 16px", backgroundColor: "#aaa", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>Hủy</button>
              <button className="save-btn" onClick={handleSaveEmployee} style={{ padding: "8px 16px", backgroundColor: "#1c3f3a", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employees;