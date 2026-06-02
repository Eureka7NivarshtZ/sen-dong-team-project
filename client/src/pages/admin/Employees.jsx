import { useState, useEffect, useCallback } from "react";
import nhanVienService from "../../services/nhanVienService";

// ─── helpers ───────────────────────────────────────────────────────────────
const VAI_TRO_LABEL = {
  ban_hang: "Bán hàng",
};

const VAI_TRO_COLOR = {
  ban_hang: { bg: "#EAF3DE", text: "#3B6D11", dot: "#639922" },
};

function getInitials(name = "") {
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

const AVATAR_COLORS = [
  { bg: "#E1F5EE", text: "#0F6E56" },
  { bg: "#EEEDFE", text: "#534AB7" },
  { bg: "#E6F1FB", text: "#185FA5" },
  { bg: "#FAEEDA", text: "#633806" },
  { bg: "#FAECE7", text: "#993C1D" },
];

function avatarColor(name = "") {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

const EMPTY_FORM = {
  ho_ten: "",
  email: "",
  vai_tro: "ban_hang",
  sdt: "",
  ngay_sinh: "",
  dia_chi: "",
  mat_khau: "",
  confirm_pw: "",
};

// ─── sub-components ────────────────────────────────────────────────────────
function Badge({ vai_tro }) {
  const c = VAI_TRO_COLOR[vai_tro] || VAI_TRO_COLOR.ban_hang;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 12,
        fontWeight: 500,
        padding: "3px 10px",
        borderRadius: 20,
        background: c.bg,
        color: c.text,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: c.dot,
          flexShrink: 0,
        }}
      />
      {VAI_TRO_LABEL[vai_tro] || "Bán hàng"}
    </span>
  );
}

function Avatar({ name }) {
  const c = avatarColor(name);

  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: c.bg,
        color: c.text,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        fontWeight: 600,
        flexShrink: 0,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {getInitials(name) || "?"}
    </div>
  );
}

function FieldError({ msg }) {
  if (!msg) return null;

  return <p style={{ fontSize: 12, color: "#A32D2D", marginTop: 4 }}>{msg}</p>;
}

// ─── Modal ─────────────────────────────────────────────────────────────────
function AddEmployeeModal({ onClose, onSuccess }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function validate() {
    const e = {};

    if (!form.ho_ten.trim()) {
      e.ho_ten = "Vui lòng nhập họ tên";
    }

    if (!form.email.trim()) {
      e.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Email không hợp lệ";
    }

    if (!form.mat_khau) {
      e.mat_khau = "Vui lòng nhập mật khẩu";
    } else if (form.mat_khau.length < 8) {
      e.mat_khau = "Mật khẩu phải có ít nhất 8 ký tự";
    }

    if (form.mat_khau !== form.confirm_pw) {
      e.confirm_pw = "Mật khẩu xác nhận không khớp";
    }

    return e;
  }

  async function handleSubmit() {
    const e = validate();

    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setErrors({});
    setLoading(true);

    const payload = {
      email: form.email.trim(),
      mat_khau: form.mat_khau,
      ho_ten: form.ho_ten.trim(),
      vai_tro: "ban_hang",
      sdt: form.sdt || undefined,
      ngay_sinh: form.ngay_sinh || undefined,
      dia_chi: form.dia_chi || undefined,
    };

    const res = await nhanVienService.taoNhanVien(payload);

    setLoading(false);

    if (res && res.success) {
      onSuccess();
    } else {
      setErrors({ _global: res?.error || "Tạo tài khoản thất bại" });
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "9px 12px",
    fontSize: 14,
    border: "1px solid var(--color-border-secondary, #d1d5db)",
    borderRadius: 8,
    background: "var(--color-background-primary, #fff)",
    color: "var(--color-text-primary, #111)",
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
    transition: "border-color .15s",
  };

  const labelStyle = {
    fontSize: 13,
    fontWeight: 500,
    color: "var(--color-text-secondary, #6b7280)",
    display: "block",
    marginBottom: 5,
  };

  return (
    <div
      style={overlayStyle}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={modalStyle}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <div>
            <p style={{ fontSize: 17, fontWeight: 600 }}>Thêm nhân viên mới</p>
            <p
              style={{
                fontSize: 13,
                color: "var(--color-text-secondary, #6b7280)",
                marginTop: 2,
              }}
            >
              Tạo tài khoản và hồ sơ nhân sự
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "1px solid var(--color-border-secondary, #e5e7eb)",
              borderRadius: 8,
              width: 32,
              height: 32,
              cursor: "pointer",
              fontSize: 18,
              color: "var(--color-text-secondary, #6b7280)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>

        {errors._global && (
          <div
            style={{
              background: "#FCEBEB",
              border: "1px solid #F09595",
              borderRadius: 8,
              padding: "10px 14px",
              fontSize: 13,
              color: "#791F1F",
              marginBottom: 16,
            }}
          >
            {errors._global}
          </div>
        )}

        {/* Thông tin cơ bản */}
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 1,
            color: "var(--color-text-secondary, #6b7280)",
            marginBottom: 12,
          }}
        >
          Thông tin cơ bản
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <div>
            <label style={labelStyle}>Họ và tên *</label>
            <input
              style={{
                ...inputStyle,
                ...(errors.ho_ten ? { borderColor: "#E24B4A" } : {}),
              }}
              value={form.ho_ten}
              onChange={set("ho_ten")}
              placeholder="Nguyễn Văn An"
              onFocus={(e) => (e.target.style.borderColor = "#1D9E75")}
              onBlur={(e) =>
                (e.target.style.borderColor = errors.ho_ten
                  ? "#E24B4A"
                  : "var(--color-border-secondary, #d1d5db)")
              }
            />
            <FieldError msg={errors.ho_ten} />
          </div>

          <div>
            <label style={labelStyle}>Vai trò *</label>
            <input style={inputStyle} value="Bán hàng" disabled />
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>Email đăng nhập *</label>
          <input
            style={{
              ...inputStyle,
              ...(errors.email ? { borderColor: "#E24B4A" } : {}),
            }}
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="nhanvien@congty.com"
            onFocus={(e) => (e.target.style.borderColor = "#1D9E75")}
            onBlur={(e) =>
              (e.target.style.borderColor = errors.email
                ? "#E24B4A"
                : "var(--color-border-secondary, #d1d5db)")
            }
          />
          <FieldError msg={errors.email} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <div>
            <label style={labelStyle}>Số điện thoại</label>
            <input
              style={inputStyle}
              value={form.sdt}
              onChange={set("sdt")}
              placeholder="0901 234 567"
            />
          </div>

          <div>
            <label style={labelStyle}>Ngày sinh</label>
            <input
              style={inputStyle}
              type="date"
              value={form.ngay_sinh}
              onChange={set("ngay_sinh")}
            />
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Địa chỉ</label>
          <input
            style={inputStyle}
            value={form.dia_chi}
            onChange={set("dia_chi")}
            placeholder="123 Đường ABC, Quận 1, TP.HCM"
          />
        </div>

        <div
          style={{
            height: 1,
            background: "var(--color-border-tertiary, #e5e7eb)",
            marginBottom: 20,
          }}
        />

        {/* Mật khẩu */}
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 1,
            color: "var(--color-text-secondary, #6b7280)",
            marginBottom: 12,
          }}
        >
          Mật khẩu
        </p>

        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>Mật khẩu *</label>
          <div style={{ position: "relative" }}>
            <input
              style={{
                ...inputStyle,
                paddingRight: 56,
                ...(errors.mat_khau ? { borderColor: "#E24B4A" } : {}),
              }}
              type={showPw ? "text" : "password"}
              value={form.mat_khau}
              onChange={set("mat_khau")}
              placeholder="Tối thiểu 8 ký tự"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                color: "var(--color-text-secondary, #6b7280)",
              }}
            >
              {showPw ? "Ẩn" : "Hiện"}
            </button>
          </div>
          <FieldError msg={errors.mat_khau} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Xác nhận mật khẩu *</label>
          <div style={{ position: "relative" }}>
            <input
              style={{
                ...inputStyle,
                paddingRight: 56,
                ...(errors.confirm_pw ? { borderColor: "#E24B4A" } : {}),
              }}
              type={showCPw ? "text" : "password"}
              value={form.confirm_pw}
              onChange={set("confirm_pw")}
              placeholder="Nhập lại mật khẩu"
            />
            <button
              type="button"
              onClick={() => setShowCPw((v) => !v)}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                color: "var(--color-text-secondary, #6b7280)",
              }}
            >
              {showCPw ? "Ẩn" : "Hiện"}
            </button>
          </div>
          <FieldError msg={errors.confirm_pw} />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button type="button" onClick={onClose} style={btnSecondaryStyle}>
            Hủy
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            style={{ ...btnPrimaryStyle, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Đang tạo..." : "Tạo tài khoản"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────
const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: 20,
};

const modalStyle = {
  background: "var(--color-background-primary, #fff)",
  borderRadius: 14,
  padding: "24px 28px",
  width: "100%",
  maxWidth: 560,
  maxHeight: "90vh",
  overflowY: "auto",
  fontFamily: "'DM Sans', sans-serif",
  color: "var(--color-text-primary, #111)",
};

const btnPrimaryStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "9px 20px",
  fontSize: 14,
  fontWeight: 500,
  borderRadius: 8,
  border: "none",
  background: "#1c3f3a",
  color: "#fff",
  cursor: "pointer",
  fontFamily: "'DM Sans', sans-serif",
};

const btnSecondaryStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "9px 20px",
  fontSize: 14,
  fontWeight: 500,
  borderRadius: 8,
  border: "1px solid var(--color-border-secondary, #e5e7eb)",
  background: "var(--color-background-primary, #fff)",
  color: "var(--color-text-primary, #111)",
  cursor: "pointer",
  fontFamily: "'DM Sans', sans-serif",
};

// ─── Main component ─────────────────────────────────────────────────────────
export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchEmployees = useCallback(async () => {
    setLoading(true);

    const res = await nhanVienService.layDanhSach();

    if (res && res.success) {
      setEmployees(res.data || []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  async function handleToggleStatus(emp) {
    const res = await nhanVienService.capNhatNhanVien(emp.id, {
      hoat_dong: !emp.hoat_dong,
    });

    if (res && res.success) {
      showToast(
        emp.hoat_dong
          ? "Đã khóa tài khoản nhân viên"
          : "Đã mở khóa tài khoản nhân viên",
      );
      fetchEmployees();
    } else {
      showToast(res?.error || "Thao tác thất bại", "error");
    }
  }

  const filtered = employees.filter((e) => {
    if (e.vai_tro === "quan_ly") return false;
    if (e.vai_tro === "kho") return false;

    const matchSearch =
      !search ||
      e.ho_ten?.toLowerCase().includes(search.toLowerCase()) ||
      e.tai_khoan?.email?.toLowerCase().includes(search.toLowerCase());

    const matchRole = filterRole === "all" || e.vai_tro === filterRole;

    return matchSearch && matchRole;
  });

  const inputBase = {
    padding: "8px 14px",
    fontSize: 14,
    border: "1px solid var(--color-border-secondary, #e5e7eb)",
    borderRadius: 8,
    background: "var(--color-background-primary, #fff)",
    color: "var(--color-text-primary, #111)",
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
  };

  return (
    <div
      style={{
        padding: "28px 32px",
        fontFamily: "'DM Sans', sans-serif",
        color: "var(--color-text-primary, #111)",
        maxWidth: 960,
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 2000,
            background: toast.type === "error" ? "#FCEBEB" : "#E1F5EE",
            border: `1px solid ${
              toast.type === "error" ? "#F09595" : "#9FE1CB"
            }`,
            color: toast.type === "error" ? "#791F1F" : "#085041",
            borderRadius: 10,
            padding: "12px 18px",
            fontSize: 14,
            fontWeight: 500,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 28,
        }}
      >
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>
            Quản lý nhân viên
          </h1>

          <p
            style={{
              fontSize: 14,
              color: "var(--color-text-secondary, #6b7280)",
              marginTop: 4,
            }}
          >
            {
              employees.filter(
                (e) => e.vai_tro !== "quan_ly" && e.vai_tro !== "kho",
              ).length
            }{" "}
            nhân viên trong hệ thống
          </p>
        </div>

        <button onClick={() => setShowModal(true)} style={btnPrimaryStyle}>
          + Thêm nhân viên
        </button>
      </div>

      {/* Filters */}
      <div
        style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}
      >
        <input
          style={{ ...inputBase, width: 240 }}
          placeholder="Tìm theo tên, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          style={inputBase}
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="all">Tất cả vai trò</option>
          <option value="ban_hang">Bán hàng</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div
          style={{
            padding: "60px 0",
            textAlign: "center",
            color: "var(--color-text-secondary, #6b7280)",
            fontSize: 14,
          }}
        >
          Đang tải danh sách nhân viên...
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            padding: "60px 0",
            textAlign: "center",
            color: "var(--color-text-secondary, #6b7280)",
            fontSize: 14,
          }}
        >
          {search || filterRole !== "all"
            ? "Không tìm thấy nhân viên phù hợp"
            : "Chưa có nhân viên nào"}
        </div>
      ) : (
        <div
          style={{
            border: "1px solid var(--color-border-tertiary, #e5e7eb)",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}
          >
            <thead>
              <tr
                style={{
                  background: "var(--color-background-secondary, #f9fafb)",
                }}
              >
                {["Nhân viên", "Vai trò", "Liên hệ", "Trạng thái", ""].map(
                  (h, i) => (
                    <th
                      key={i}
                      style={{
                        padding: "11px 16px",
                        textAlign: "left",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--color-text-secondary, #6b7280)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        borderBottom:
                          "1px solid var(--color-border-tertiary, #e5e7eb)",
                      }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            <tbody>
              {filtered.map((emp, idx) => (
                <tr
                  key={emp.id}
                  style={{
                    borderBottom:
                      idx < filtered.length - 1
                        ? "1px solid var(--color-border-tertiary, #e5e7eb)"
                        : "none",
                    opacity: emp.hoat_dong === false ? 0.55 : 1,
                  }}
                >
                  <td style={{ padding: "13px 16px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <Avatar name={emp.ho_ten} />

                      <div>
                        <p style={{ fontWeight: 500, marginBottom: 1 }}>
                          {emp.ho_ten}
                        </p>

                        <p
                          style={{
                            fontSize: 12,
                            color: "var(--color-text-secondary, #6b7280)",
                          }}
                        >
                          {emp.tai_khoan?.email || "—"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: "13px 16px" }}>
                    <Badge vai_tro={emp.vai_tro} />
                  </td>

                  <td
                    style={{
                      padding: "13px 16px",
                      color: "var(--color-text-secondary, #6b7280)",
                      fontSize: 13,
                    }}
                  >
                    {emp.sdt || "—"}
                  </td>

                  <td style={{ padding: "13px 16px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        fontSize: 12,
                        fontWeight: 500,
                        padding: "3px 10px",
                        borderRadius: 20,
                        background:
                          emp.hoat_dong !== false ? "#E1F5EE" : "#F1EFE8",
                        color: emp.hoat_dong !== false ? "#0F6E56" : "#5F5E5A",
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background:
                            emp.hoat_dong !== false ? "#1D9E75" : "#888780",
                        }}
                      />
                      {emp.hoat_dong !== false ? "Hoạt động" : "Đã khóa"}
                    </span>
                  </td>

                  <td style={{ padding: "13px 16px", textAlign: "right" }}>
                    <button
                      onClick={() => handleToggleStatus(emp)}
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        padding: "5px 12px",
                        borderRadius: 6,
                        border:
                          "1px solid var(--color-border-secondary, #e5e7eb)",
                        background: "none",
                        cursor: "pointer",
                        color: emp.hoat_dong !== false ? "#A32D2D" : "#185FA5",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {emp.hoat_dong !== false ? "Khóa" : "Mở khóa"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <AddEmployeeModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            showToast("Thêm nhân viên thành công!");
            fetchEmployees();
          }}
        />
      )}
    </div>
  );
}
