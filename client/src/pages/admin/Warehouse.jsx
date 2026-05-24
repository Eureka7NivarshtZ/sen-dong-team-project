import { useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";

function Warehouse({ onNavigate }) {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [materials, setMaterials] = useState([
    { id: 1, name: "Sơn dầu Winton", stock: 3, min: 10, unit: "tuýp", supplier: "Mỹ thuật Phương Nam" },
    { id: 2, name: "Toan canvas 60x80", stock: 20, min: 20, unit: "tấm", supplier: "Khung tranh Tiến Đạt" },
    { id: 3, name: "Bút lông số 8", stock: 2, min: 15, unit: "cái", supplier: "Mỹ thuật Phương Nam" }
  ]);

  const [newItem, setNewItem] = useState({ name: "", stock: "", min: "", unit: "", supplier: "" });

  const filteredMaterials = materials.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddMaterial = () => {
    const item = {
      id: materials.length + 1,
      name: newItem.name,
      stock: Number(newItem.stock),
      min: Number(newItem.min),
      unit: newItem.unit,
      supplier: newItem.supplier,
    };
    setMaterials([...materials, item]);
    setNewItem({ name: "", stock: "", min: "", unit: "", supplier: "" });
    setShowModal(false);
  };

  return (
    <div className="dashboard-container" style={{ display: "flex", width: "100%" }}>
      <Sidebar onNavigate={onNavigate} currentTab="admin-warehouse" />
      <div className="dashboard-content" style={{ flex: 1, backgroundColor: "#f4f6f9", minHeight: "100vh" }}>
        <Topbar />
        
        <div style={{ padding: "30px", textAlign: "left" }}>
          <div className="painting-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
            <h1 style={{ color: "#1c3f3a", margin: 0, fontSize: "24px", fontWeight: "bold" }}>Cảnh báo vật liệu & tồn kho</h1>
            <div className="painting-actions" style={{ display: "flex", gap: "15px" }}>
              <input type="text" placeholder="Search" className="search-input" value={search} onChange={(e) => setSearch(e.target.value)} style={{ padding: "8px 15px", borderRadius: "6px", border: "1px solid #ccc" }} />
              <button className="add-btn" onClick={() => setShowModal(true)} style={{ padding: "10px 20px", backgroundColor: "#1c3f3a", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
                + Nhập phiếu
              </button>
            </div>
          </div>

          <div className="table-box" style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            <table className="painting-table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #f0f0f0", color: "#555", textAlign: "left" }}>
                  <th style={{ padding: "12px" }}>Vật liệu</th>
                  <th style={{ padding: "12px" }}>Tồn kho</th>
                  <th style={{ padding: "12px" }}>Mức tối thiểu</th>
                  <th style={{ padding: "12px" }}>Đơn vị</th>
                  <th style={{ padding: "12px" }}>Nhà cung cấp</th>
                  <th style={{ padding: "12px" }}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaterials.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "12px", fontWeight: "600" }}>{item.name}</td>
                    <td style={{ padding: "12px" }}>{item.stock}</td>
                    <td style={{ padding: "12px" }}>{item.min}</td>
                    <td style={{ padding: "12px" }}>{item.unit}</td>
                    <td style={{ padding: "12px" }}>{item.supplier}</td>
                    <td style={{ padding: "12px" }}>
                      {item.stock === 0 ? (
                        <span style={{ color: "#ff4d4f", fontWeight: "bold" }}>Hết hàng</span>
                      ) : item.stock <= item.min ? (
                        <span style={{ color: "#faad14", fontWeight: "bold" }}>Sắp hết</span>
                      ) : (
                        <span style={{ color: "#52c41a", fontWeight: "bold" }}>Đủ hàng</span>
                      )}
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
            <h2 style={{ margin: "0 0 20px 0", color: "#1c3f3a" }}>Nhập kho vật liệu</h2>
            <input type="text" placeholder="Tên vật liệu" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} style={{ width: "100%", padding: "10px", marginBottom: "12px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
            <input type="number" placeholder="Tồn kho" value={newItem.stock} onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })} style={{ width: "100%", padding: "10px", marginBottom: "12px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
            <input type="number" placeholder="Mức tối thiểu" value={newItem.min} onChange={(e) => setNewItem({ ...newItem, min: e.target.value })} style={{ width: "100%", padding: "10px", marginBottom: "12px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
            <input type="text" placeholder="Đơn vị" value={newItem.unit} onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })} style={{ width: "100%", padding: "10px", marginBottom: "12px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
            <input type="text" placeholder="Nhà cung cấp" value={newItem.supplier} onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })} style={{ width: "100%", padding: "10px", marginBottom: "20px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
            <div className="modal-buttons" style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button className="cancel-btn" onClick={() => setShowModal(false)} style={{ padding: "8px 16px", backgroundColor: "#aaa", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>Hủy</button>
              <button className="save-btn" onClick={handleAddMaterial} style={{ padding: "8px 16px", backgroundColor: "#1c3f3a", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Warehouse;