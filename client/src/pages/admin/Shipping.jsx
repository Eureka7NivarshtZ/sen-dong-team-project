import { useState, useEffect } from "react";
import donViVanChuyenService from "../../services/donViVanChuyenService";

const EMPTY_FORM = {
  ten: "",
  sdt: "",
  email: "",
  phi_co_ban: "",
  hoat_dong: true,
};

function Shipping() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formMode, setFormMode] = useState(null); // null | "create" | {item object}
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  const [deleteConfirm, setDeleteConfirm] = useState(null); // id cần xóa

  // ─── Fetch ───────────────────────────────────────────────
  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await donViVanChuyenService.layDanhSachAdmin();
      if (res?.success) setList(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // ─── Form helpers ─────────────────────────────────────────
  const openCreate = () => {
    setFormData(EMPTY_FORM);
    setFormError("");
    setFormMode("create");
  };

  const openEdit = (item) => {
    setFormData({
      ten: item.ten || "",
      sdt: item.sdt || "",
      email: item.email || "",
      phi_co_ban: item.phi_co_ban ?? "",
      hoat_dong: item.hoat_dong ?? true,
    });
    setFormError("");
    setFormMode(item);
  };

  const closeForm = () => {
    setFormMode(null);
    setFormError("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    if (!formData.ten.trim()) return "Tên đơn vị không được để trống.";
    if (formData.phi_co_ban === "" || isNaN(Number(formData.phi_co_ban)))
      return "Phí cơ bản phải là số hợp lệ.";
    if (Number(formData.phi_co_ban) < 0) return "Phí cơ bản không được âm.";
    return "";
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      setFormError(err);
      return;
    }

    setSubmitting(true);
    setFormError("");

    const payload = {
      ...formData,
      phi_co_ban: Number(formData.phi_co_ban),
    };

    try {
      let res;
      if (formMode === "create") {
        res = await donViVanChuyenService.taoMoi(payload);
      } else {
        res = await donViVanChuyenService.capNhat(formMode.id, payload);
      }

      if (res?.success) {
        closeForm();
        fetchList();
      } else {
        setFormError(res?.error || "Lưu thất bại, vui lòng thử lại.");
      }
    } catch (e) {
      console.error(e);
      setFormError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Toggle hoạt động nhanh ───────────────────────────────
  const toggleActive = async (item) => {
    try {
      // Thử endpoint toggle trước; nếu backend chưa có thì fallback capNhat
      let res = await donViVanChuyenService.toggleHoatDong(item.id);
      if (!res?.success) {
        res = await donViVanChuyenService.capNhat(item.id, {
          hoat_dong: !item.hoat_dong,
        });
      }
      if (res?.success) fetchList();
    } catch (e) {
      console.error(e);
    }
  };

  // ─── Xóa ─────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      const res = await donViVanChuyenService.xoa(id);
      if (res?.success) {
        setDeleteConfirm(null);
        fetchList();
      } else {
        alert(res?.error || "Xóa thất bại.");
      }
    } catch (e) {
      console.error(e);
      alert("Lỗi kết nối.");
    }
  };

  const formatPrice = (val) => Number(val || 0).toLocaleString("vi-VN") + " đ";

  // ─── Styles ───────────────────────────────────────────────
  const s = {
    page: {
      padding: "32px 40px",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#fff",
      minHeight: "100vh",
      boxSizing: "border-box",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "28px",
    },
    title: { fontSize: "24px", fontWeight: "normal", margin: 0, color: "#111" },
    btnPrimary: {
      padding: "10px 20px",
      backgroundColor: "#1c3f3a",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "bold",
    },
    btnSecondary: {
      padding: "8px 16px",
      background: "none",
      border: "1px solid #ccc",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "13px",
    },
    btnDanger: {
      padding: "8px 16px",
      backgroundColor: "#e74c3c",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "13px",
    },
    table: { width: "100%", borderCollapse: "collapse" },
    th: {
      textAlign: "left",
      padding: "12px 16px",
      fontSize: "12px",
      color: "#888",
      borderBottom: "2px solid #f0f0f0",
      fontWeight: "normal",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    },
    td: {
      padding: "14px 16px",
      fontSize: "14px",
      borderBottom: "1px solid #f7f7f7",
      color: "#222",
      verticalAlign: "middle",
    },
    badge: (active) => ({
      display: "inline-block",
      padding: "3px 10px",
      borderRadius: "99px",
      fontSize: "12px",
      fontWeight: "500",
      backgroundColor: active ? "#e8f5e9" : "#fafafa",
      color: active ? "#2e7d32" : "#aaa",
      border: `1px solid ${active ? "#c8e6c9" : "#e0e0e0"}`,
      cursor: "pointer",
      userSelect: "none",
    }),
    overlay: {
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.35)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    modal: {
      backgroundColor: "#fff",
      borderRadius: "10px",
      padding: "32px",
      width: "460px",
      boxSizing: "border-box",
    },
    modalTitle: { fontSize: "18px", margin: "0 0 24px 0", fontWeight: "500" },
    label: {
      display: "block",
      fontSize: "13px",
      color: "#555",
      marginBottom: "6px",
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      border: "1px solid #ddd",
      borderRadius: "6px",
      fontSize: "14px",
      boxSizing: "border-box",
      outline: "none",
    },
    fieldGroup: { marginBottom: "16px" },
    errorText: { color: "#e74c3c", fontSize: "13px", marginTop: "12px" },
    modalFooter: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "12px",
      marginTop: "24px",
    },
    emptyState: {
      textAlign: "center",
      padding: "60px 0",
      color: "#aaa",
      fontSize: "15px",
    },
    actionGroup: { display: "flex", gap: "8px", alignItems: "center" },
  };

  // ─── Render ───────────────────────────────────────────────
  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <h1 style={s.title}>Đơn vị vận chuyển</h1>
        <button style={s.btnPrimary} onClick={openCreate}>
          + Thêm đơn vị
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div style={s.emptyState}>Đang tải...</div>
      ) : list.length === 0 ? (
        <div style={s.emptyState}>
          Chưa có đơn vị vận chuyển nào.
          <br />
        </div>
      ) : (
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Tên đơn vị</th>
              <th style={s.th}>Số điện thoại</th>
              <th style={s.th}>Email</th>
              <th style={s.th}>Phí cơ bản</th>
              <th style={s.th}>Trạng thái</th>
              <th style={s.th}></th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr key={item.id}>
                <td style={{ ...s.td, fontWeight: "500" }}>{item.ten}</td>
                <td style={s.td}>{item.sdt || "—"}</td>
                <td style={s.td}>{item.email || "—"}</td>
                <td style={s.td}>{formatPrice(item.phi_co_ban)}</td>
                <td style={s.td}>
                  <span
                    style={s.badge(item.hoat_dong)}
                    title="Nhấn để bật/tắt"
                    onClick={() => toggleActive(item)}
                  >
                    {item.hoat_dong ? "Hoạt động" : "Tạm dừng"}
                  </span>
                </td>
                <td style={s.td}>
                  <div style={s.actionGroup}>
                    <button
                      style={s.btnSecondary}
                      onClick={() => openEdit(item)}
                    >
                      Sửa
                    </button>
                    <button
                      style={s.btnDanger}
                      onClick={() => setDeleteConfirm(item.id)}
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal thêm/sửa */}
      {formMode !== null && (
        <div style={s.overlay} onClick={closeForm}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={s.modalTitle}>
              {formMode === "create"
                ? "Thêm đơn vị vận chuyển"
                : "Chỉnh sửa đơn vị"}
            </h2>

            <div style={s.fieldGroup}>
              <label style={s.label}>Tên đơn vị *</label>
              <input
                style={s.input}
                name="ten"
                value={formData.ten}
                onChange={handleChange}
                placeholder="VD: Giao hàng nhanh, GHTK..."
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <div style={s.fieldGroup}>
                <label style={s.label}>Số điện thoại</label>
                <input
                  style={s.input}
                  name="sdt"
                  value={formData.sdt}
                  onChange={handleChange}
                  placeholder="0901 234 567"
                />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Email</label>
                <input
                  style={s.input}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@dvvc.vn"
                />
              </div>
            </div>

            <div style={s.fieldGroup}>
              <label style={s.label}>Phí cơ bản (đ) *</label>
              <input
                style={s.input}
                name="phi_co_ban"
                type="number"
                min="0"
                value={formData.phi_co_ban}
                onChange={handleChange}
                placeholder="30000"
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="checkbox"
                id="hoat_dong"
                name="hoat_dong"
                checked={formData.hoat_dong}
                onChange={handleChange}
                style={{ width: "16px", height: "16px", cursor: "pointer" }}
              />
              <label
                htmlFor="hoat_dong"
                style={{ fontSize: "14px", cursor: "pointer" }}
              >
                Đang hoạt động
              </label>
            </div>

            {formError && <p style={s.errorText}>{formError}</p>}

            <div style={s.modalFooter}>
              <button
                style={s.btnSecondary}
                onClick={closeForm}
                disabled={submitting}
              >
                Hủy
              </button>
              <button
                style={{ ...s.btnPrimary, opacity: submitting ? 0.7 : 1 }}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting
                  ? "Đang lưu..."
                  : formMode === "create"
                    ? "Thêm mới"
                    : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {deleteConfirm && (
        <div style={s.overlay} onClick={() => setDeleteConfirm(null)}>
          <div
            style={{ ...s.modal, width: "380px", textAlign: "center" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>⚠️</div>
            <h2 style={{ ...s.modalTitle, textAlign: "center" }}>
              Xác nhận xóa
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "#555",
                lineHeight: "1.6",
                margin: "0 0 24px 0",
              }}
            >
              Đơn vị vận chuyển này sẽ bị xóa vĩnh viễn.
              <br />
              Các đơn hàng đang dùng sẽ giữ nguyên dữ liệu cũ.
            </p>
            <div style={{ ...s.modalFooter, justifyContent: "center" }}>
              <button
                style={s.btnSecondary}
                onClick={() => setDeleteConfirm(null)}
              >
                Hủy
              </button>
              <button
                style={s.btnDanger}
                onClick={() => handleDelete(deleteConfirm)}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Shipping;
