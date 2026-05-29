import { useEffect, useState } from "react";
import Topbar from "../../components/admin/Topbar";
import { tacGiaService } from "../../services";

function Authors() {
  const [authors, setAuthors] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  const emptyForm = {
    ho_ten: "",
    ngay_sinh: "",
    sdt: "",
    dia_chi: "",
    tieu_su: "",
  };
  const [form, setForm] = useState(emptyForm);

  // ── Load danh sách ──────────────────────────────────────────
  const loadData = async () => {
    setLoading(true);
    try {
      const result = await tacGiaService.layTatCaTacGia();
      if (result.success && result.data) {
        setAuthors(
          result.data.map((tg) => ({
            id: tg.tac_gia_id || tg.id,
            ho_ten: tg.ho_ten,
            ngay_sinh: tg.ngay_sinh
              ? new Date(tg.ngay_sinh).toLocaleDateString("vi-VN")
              : "—",
            ngay_sinh_raw: tg.ngay_sinh ? tg.ngay_sinh.slice(0, 10) : "",
            sdt: tg.sdt || "—",
            dia_chi: tg.dia_chi || "—",
            tieu_su: tg.tieu_su || "",
          })),
        );
      }
    } catch (err) {
      console.error("Lỗi load tác giả:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ── Lọc tìm kiếm ────────────────────────────────────────────
  const filtered = authors.filter((a) =>
    (a.ho_ten || "").toLowerCase().includes(search.toLowerCase()),
  );

  // ── Mở modal ────────────────────────────────────────────────
  const openAdd = () => {
    setIsEditing(false);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setIsEditing(true);
    setEditId(item.id);
    setForm({
      ho_ten: item.ho_ten,
      ngay_sinh: item.ngay_sinh_raw || "",
      sdt: item.sdt === "—" ? "" : item.sdt,
      dia_chi: item.dia_chi === "—" ? "" : item.dia_chi,
      tieu_su: item.tieu_su || "",
    });
    setShowModal(true);
  };

  // ── Lưu ─────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.ho_ten.trim()) {
      alert("Vui lòng nhập họ tên tác giả!");
      return;
    }
    try {
      const payload = {
        ho_ten: form.ho_ten,
        ngay_sinh: form.ngay_sinh || null,
        sdt: form.sdt,
        dia_chi: form.dia_chi,
        tieu_su: form.tieu_su,
      };

      const result = isEditing
        ? await tacGiaService.capNhatTacGia(editId, payload)
        : await tacGiaService.themTacGia(payload);

      if (result.success) {
        alert(isEditing ? "Cập nhật thành công!" : "Thêm tác giả thành công!");
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
    if (!window.confirm("Bạn có chắc muốn xóa tác giả này?")) return;
    try {
      const result = await tacGiaService.xoaTacGia(id);
      if (result.success) {
        setAuthors(authors.filter((a) => a.id !== id));
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
            Quản lý tác giả
          </h1>
          <div style={{ display: "flex", gap: "15px" }}>
            <input
              type="text"
              placeholder="Tìm kiếm tác giả..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={inputStyle}
            />
            <button onClick={openAdd} style={btnPrimaryStyle}>
              + Thêm tác giả
            </button>
          </div>
        </div>

        {/* Bảng */}
        <div style={tableBoxStyle}>
          {loading ? (
            <div
              style={{ padding: "20px", textAlign: "center", color: "#666" }}
            >
              Đang tải danh sách tác giả...
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
                  <th style={thStyle}>Họ tên</th>
                  <th style={thStyle}>Ngày sinh</th>
                  <th style={thStyle}>SĐT</th>
                  <th style={thStyle}>Địa chỉ</th>
                  <th style={thStyle}>Tiểu sử</th>
                  <th style={thStyle}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
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
                  filtered.map((item) => (
                    <tr
                      key={item.id}
                      style={{ borderBottom: "1px solid #f0f0f0" }}
                    >
                      <td style={{ ...tdStyle, fontWeight: "600" }}>
                        {item.ho_ten}
                      </td>
                      <td style={tdStyle}>{item.ngay_sinh}</td>
                      <td style={tdStyle}>{item.sdt}</td>
                      <td style={tdStyle}>{item.dia_chi}</td>
                      <td
                        style={{
                          ...tdStyle,
                          maxWidth: "200px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.tieu_su || "—"}
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
          <div style={modalStyle}>
            <h2 style={{ marginBottom: "20px", color: "#1c3f3a" }}>
              {isEditing ? "Cập nhật tác giả" : "Thêm tác giả mới"}
            </h2>

            <label style={labelStyle}>Họ tên *</label>
            <input
              type="text"
              placeholder="Nhập họ tên"
              value={form.ho_ten}
              onChange={(e) => setForm({ ...form, ho_ten: e.target.value })}
              style={inputStyle}
            />

            <label style={labelStyle}>Ngày sinh</label>
            <input
              type="date"
              value={form.ngay_sinh}
              onChange={(e) => setForm({ ...form, ngay_sinh: e.target.value })}
              style={inputStyle}
            />

            <label style={labelStyle}>Số điện thoại</label>
            <input
              type="text"
              placeholder="VD: 0912345678"
              value={form.sdt}
              onChange={(e) => setForm({ ...form, sdt: e.target.value })}
              style={inputStyle}
            />

            <label style={labelStyle}>Địa chỉ</label>
            <input
              type="text"
              placeholder="Nhập địa chỉ"
              value={form.dia_chi}
              onChange={(e) => setForm({ ...form, dia_chi: e.target.value })}
              style={inputStyle}
            />

            <label style={labelStyle}>Tiểu sử</label>
            <textarea
              placeholder="Mô tả ngắn về tác giả..."
              value={form.tieu_su}
              onChange={(e) => setForm({ ...form, tieu_su: e.target.value })}
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
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
                Lưu tác giả
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
  width: "420px",
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

export default Authors;
