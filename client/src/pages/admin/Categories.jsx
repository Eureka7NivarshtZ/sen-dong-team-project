import { useEffect, useState } from "react";
import Topbar from "../../components/admin/Topbar";
import { danhMucService } from "../../services";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tenDanhMuc, setTenDanhMuc] = useState("");

  // ── Load danh sách ──────────────────────────────────────────
  const loadData = async () => {
    setLoading(true);
    try {
      const result = await danhMucService.layTatCaDanhMuc();
      if (result.success && result.data) {
        setCategories(
          result.data.map((dm) => ({
            id: dm.danh_muc_id || dm.id,
            ten: dm.ten,
          })),
        );
      }
    } catch (err) {
      console.error("Lỗi load danh mục:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ── Lọc tìm kiếm ────────────────────────────────────────────
  const filtered = categories.filter((c) =>
    (c.ten || "").toLowerCase().includes(search.toLowerCase()),
  );

  // ── Mở modal ────────────────────────────────────────────────
  const openAdd = () => {
    setIsEditing(false);
    setTenDanhMuc("");
    setShowModal(true);
  };

  const openEdit = (item) => {
    setIsEditing(true);
    setEditId(item.id);
    setTenDanhMuc(item.ten);
    setShowModal(true);
  };

  // ── Lưu ─────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!tenDanhMuc.trim()) {
      alert("Vui lòng nhập tên danh mục!");
      return;
    }
    try {
      const result = isEditing
        ? await danhMucService.capNhatDanhMuc(editId, { ten: tenDanhMuc })
        : await danhMucService.themDanhMuc({ ten: tenDanhMuc });

      if (result.success) {
        alert(isEditing ? "Cập nhật thành công!" : "Thêm danh mục thành công!");
        setShowModal(false);
        loadData();
      } else {
        alert("Thất bại: " + (result.error || "Lỗi không xác định"));
      }
    } catch (err) {
      alert("Có lỗi xảy ra: " + err.message);
    }
  };

  // ── Xóa ─────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    try {
      const result = await danhMucService.xoaDanhMuc(id);
      if (result.success) {
        setCategories(categories.filter((c) => c.id !== id));
      } else {
        alert("Xóa thất bại: " + (result.error || "Lỗi không xác định"));
      }
    } catch (err) {
      alert("Có lỗi xảy ra: " + err.message);
    }
  };

  // ── Render ───────────────────────────────────────────────────
  return (
    <div style={{ flex: 1, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <Topbar />

      <div style={{ padding: "30px", textAlign: "left" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
          }}
        >
          <h1
            style={{
              color: "#1c3f3a",
              margin: 0,
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            Quản lý danh mục
          </h1>
          <div style={{ display: "flex", gap: "15px" }}>
            <input
              type="text"
              placeholder="Tìm kiếm danh mục..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ ...inputStyle, marginBottom: 0, width: "220px" }}
            />
            <button onClick={openAdd} style={btnPrimaryStyle}>
              + Thêm danh mục
            </button>
          </div>
        </div>

        {/* Thống kê nhanh */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#e8f5e9",
            color: "#2e7d32",
            padding: "8px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          <span>📂</span>
          <span>Tổng cộng: {categories.length} danh mục</span>
        </div>

        {/* Bảng */}
        <div style={tableBoxStyle}>
          {loading ? (
            <div
              style={{ padding: "20px", textAlign: "center", color: "#666" }}
            >
              Đang tải danh sách danh mục...
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    borderBottom: "2px solid #f0f0f0",
                    color: "#555",
                    textAlign: "left",
                  }}
                >
                  <th style={thStyle}>#</th>
                  <th style={thStyle}>Tên danh mục</th>
                  <th style={thStyle}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      style={{
                        padding: "20px",
                        textAlign: "center",
                        color: "#aaa",
                      }}
                    >
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  filtered.map((item, index) => (
                    <tr
                      key={item.id}
                      style={{ borderBottom: "1px solid #f0f0f0" }}
                    >
                      <td style={{ ...tdStyle, color: "#aaa", width: "60px" }}>
                        {index + 1}
                      </td>
                      <td style={{ ...tdStyle, fontWeight: "600" }}>
                        {item.ten}
                      </td>
                      <td style={{ ...tdStyle, display: "flex", gap: "10px" }}>
                        <button
                          onClick={() => openEdit(item)}
                          style={btnEditStyle}
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          style={btnDeleteStyle}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={overlayStyle}>
          <div style={{ ...modalStyle, width: "380px" }}>
            <h2 style={{ marginBottom: "20px", color: "#1c3f3a" }}>
              {isEditing ? "Cập nhật danh mục" : "Thêm danh mục mới"}
            </h2>

            <label style={labelStyle}>Tên danh mục *</label>
            <input
              type="text"
              placeholder="VD: Sơn dầu trên vải, Tranh lụa..."
              value={tenDanhMuc}
              onChange={(e) => setTenDanhMuc(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              style={inputStyle}
              autoFocus
            />

            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
                marginTop: "8px",
              }}
            >
              <button
                onClick={() => setShowModal(false)}
                style={btnCancelStyle}
              >
                Hủy
              </button>
              <button onClick={handleSave} style={btnPrimaryStyle}>
                Lưu danh mục
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────
const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
  outline: "none",
};

const labelStyle = {
  display: "block",
  marginBottom: "4px",
  fontSize: "13px",
  fontWeight: "600",
  color: "#444",
};

const tableBoxStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};

const thStyle = { padding: "12px" };
const tdStyle = { padding: "12px" };

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2000,
};

const modalStyle = {
  backgroundColor: "#fff",
  padding: "30px",
  borderRadius: "10px",
  maxHeight: "90vh",
  overflowY: "auto",
};

const btnPrimaryStyle = {
  padding: "10px 20px",
  backgroundColor: "#1c3f3a",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  fontWeight: "bold",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const btnCancelStyle = {
  padding: "8px 16px",
  backgroundColor: "#aaa",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const btnEditStyle = {
  padding: "6px 12px",
  backgroundColor: "#f39c12",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const btnDeleteStyle = {
  padding: "6px 12px",
  backgroundColor: "#ff4d4f",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default Categories;
