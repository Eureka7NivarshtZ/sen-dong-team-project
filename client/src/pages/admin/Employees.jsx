import React, { useState, useEffect } from "react";
import { nhanVienService } from "../../services";

function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ ho_ten: "", email: "", chuc_vu: "nhan_vien" });

  const fetchEmployees = async () => {
    try {
      const res = await nhanVienService.layDanhSach();
      if (res && res.success) {
        setEmployees(res.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!form.ho_ten || !form.email) return alert("Vui lòng nhập đủ thông tin!");
    
    const res = await nhanVienService.taoNhanVien(form);
    if (res && res.success) {
      alert("Thêm nhân viên mới vào SQL Server thành công!");
      setForm({ ho_ten: "", email: "", chuc_vu: "nhan_vien" });
      fetchEmployees();
    } else {
      alert("Lỗi: " + res.error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa nhân viên này?")) return;
    const res = await nhanVienService.xoaNhanVien(id);
    if (res && res.success) {
      alert("Đã xóa nhân viên!");
      fetchEmployees();
    }
  };

  if (loading) return <div style={{ padding: "30px" }}>Đang tải nhân sự...</div>;

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h2>Quản Lý Nhân Viên</h2>
      
      {/* Form thêm mới */}
      <form onSubmit={handleAddEmployee} style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
        <input type="text" placeholder="Họ tên nhân viên" value={form.ho_ten} onChange={e => setForm({...form, ho_ten: e.target.value})} style={inputStyle}/>
        <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={inputStyle}/>
        <select value={form.chuc_vu} onChange={e => setForm({...form, chuc_vu: e.target.value})} style={inputStyle}>
          <option value="nhan_vien">Nhân viên xưởng</option>
          <option value="quan_ly">Quản lý kho</option>
        </select>
        <button type="submit" style={{ backgroundColor: "#1c3f3a", color: "white", padding: "10px 20px", border: "none", borderRadius: "4px", cursor: "pointer" }}>Thêm</button>
      </form>

      {/* Bảng hiển thị */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
            <th style={thStyle}>Họ và Tên</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Chức Vụ</th>
            <th style={thStyle}>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={tdStyle}>{emp.ho_ten}</td>
              <td style={tdStyle}>{emp.email}</td>
              <td style={tdStyle}>{emp.chuc_vu}</td>
              <td style={tdStyle}>
                <button onClick={() => handleDelete(emp.id)} style={{ color: "red", border: "none", background: "none", cursor: "pointer" }}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = { padding: "12px", borderBottom: "2px solid #ddd" };
const tdStyle = { padding: "12px" };
const inputStyle = { padding: "8px", border: "1px solid #ddd", borderRadius: "4px" };
export default EmployeeManagement;