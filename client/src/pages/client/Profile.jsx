import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(authService.getUser());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    ho_ten: "",
    email: "",
    sdt: "",
    dia_chi: "",
  });

  useEffect(() => {
    const layThongTinTaiKhoan = async () => {
      try {
        if (!authService.isAuthenticated()) {
          navigate("/auth/dang-nhap");
          return;
        }

        const res = await authService.xemThongTinCuaToi();

        const currentUser = res?.success ? res.data : authService.getUser();

        setUser(currentUser);
        setFormData({
          ho_ten:
            currentUser?.ho_ten || currentUser?.hoTen || currentUser?.ten || "",
          email: currentUser?.email || "",
          sdt:
            currentUser?.sdt ||
            currentUser?.so_dien_thoai ||
            currentUser?.soDienThoai ||
            "",
          dia_chi:
            currentUser?.dia_chi ||
            currentUser?.diaChi ||
            currentUser?.address ||
            "",
        });
      } catch (error) {
        console.error("Lỗi lấy thông tin tài khoản:", error);
      } finally {
        setLoading(false);
      }
    };

    layThongTinTaiKhoan();
  }, [navigate]);

  const handleLogout = () => {
    authService.dangXuat();
    navigate("/auth/dang-nhap");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancelEdit = () => {
    setFormData({
      ho_ten: getFullName(),
      email: user?.email || "",
      sdt: getPhoneRaw(),
      dia_chi: getAddressRaw(),
    });

    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!formData.ho_ten.trim()) {
      alert("Vui lòng nhập họ và tên");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ho_ten: formData.ho_ten.trim(),
        sdt: formData.sdt.trim(),
        dia_chi: formData.dia_chi.trim(),
      };

      const res = await authService.capNhatThongTinCuaToi(payload);

      if (res?.success) {
        alert("Cập nhật thông tin thành công");

        setUser(res.data);
        setIsEditing(false);
      } else {
        alert(res?.error || "Cập nhật thông tin thất bại");
      }
    } catch (error) {
      console.error("Lỗi cập nhật thông tin:", error);
      alert("Có lỗi xảy ra khi cập nhật thông tin");
    } finally {
      setSaving(false);
    }
  };

  const getFullName = () => {
    return (
      user?.ho_ten || user?.hoTen || user?.ten || user?.name || "Chưa cập nhật"
    );
  };

  const getPhoneRaw = () => {
    return (
      user?.sdt || user?.so_dien_thoai || user?.soDienThoai || user?.phone || ""
    );
  };

  const getPhone = () => {
    return getPhoneRaw() || "Chưa cập nhật";
  };

  const getAddressRaw = () => {
    return user?.dia_chi || user?.diaChi || user?.address || "";
  };

  const getAddress = () => {
    return getAddressRaw() || "Chưa cập nhật";
  };

  const getRole = () => {
    const role = user?.vai_tro || user?.vaiTro || user?.role;

    const roleLabel = {
      khach_hang: "Khách hàng",
      nhan_vien: "Nhân viên",
      quan_ly: "Quản lý",
      admin: "Quản trị viên",
    };

    return roleLabel[role] || role || "Khách hàng";
  };

  const formatDate = (value) => {
    if (!value) return "Chưa cập nhật";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Chưa cập nhật";

    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div
        style={{
          maxWidth: "900px",
          margin: "60px auto",
          padding: "0 20px",
          fontFamily: "Arial, sans-serif",
          textAlign: "center",
          color: "#667085",
        }}
      >
        Đang tải thông tin tài khoản...
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "0 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          borderBottom: "2px solid #1c3f3a",
          paddingBottom: "14px",
          marginBottom: "30px",
        }}
      >
        <h2
          style={{
            color: "#1c3f3a",
            margin: 0,
            fontWeight: "bold",
          }}
        >
          👤 Hồ Sơ Cá Nhân
        </h2>

        <button
          onClick={handleLogout}
          style={{
            padding: "10px 16px",
            backgroundColor: "#fff1f0",
            color: "#cf1322",
            border: "1px solid #ffa39e",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Đăng xuất
        </button>
      </div>

      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            backgroundColor: "#f8fafc",
            padding: "24px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            gap: "18px",
          }}
        >
          <div
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              backgroundColor: "#1c3f3a",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: "bold",
              flexShrink: 0,
            }}
          >
            {getFullName().charAt(0).toUpperCase()}
          </div>

          <div>
            <h3
              style={{
                margin: "0 0 6px",
                color: "#1c3f3a",
                fontSize: "22px",
              }}
            >
              {getFullName()}
            </h3>
            <p
              style={{
                margin: 0,
                color: "#667085",
                fontSize: "14px",
              }}
            >
              {user?.email || "Chưa cập nhật email"}
            </p>
          </div>
        </div>

        <div
          style={{
            padding: "26px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "18px",
          }}
        >
          {isEditing ? (
            <>
              <InputItem
                label="Họ và tên"
                name="ho_ten"
                value={formData.ho_ten}
                onChange={handleChange}
              />

              <InputItem
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
              />

              <InputItem
                label="Số điện thoại"
                name="sdt"
                value={formData.sdt}
                onChange={handleChange}
              />

              <InputItem
                label="Địa chỉ"
                name="dia_chi"
                value={formData.dia_chi}
                onChange={handleChange}
              />

              <InfoItem label="Vai trò tài khoản" value={getRole()} />

              <InfoItem
                label="Ngày tạo tài khoản"
                value={formatDate(user?.createdAt || user?.created_at)}
              />
            </>
          ) : (
            <>
              <InfoItem label="Họ và tên" value={getFullName()} />
              <InfoItem label="Email" value={user?.email || "Chưa cập nhật"} />
              <InfoItem label="Số điện thoại" value={getPhone()} />
              <InfoItem label="Địa chỉ" value={getAddress()} />
              <InfoItem label="Vai trò tài khoản" value={getRole()} />
              <InfoItem
                label="Ngày tạo tài khoản"
                value={formatDate(user?.createdAt || user?.created_at)}
              />
            </>
          )}
        </div>

        <div
          style={{
            padding: "0 26px 26px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          {isEditing ? (
            <>
              <button
                onClick={handleCancelEdit}
                disabled={saving}
                style={{
                  padding: "11px 18px",
                  backgroundColor: "#ffffff",
                  color: "#344054",
                  border: "1px solid #d0d5dd",
                  borderRadius: "6px",
                  cursor: saving ? "not-allowed" : "pointer",
                  fontWeight: "bold",
                }}
              >
                Hủy
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: "11px 18px",
                  backgroundColor: saving ? "#98a2b3" : "#1c3f3a",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: saving ? "not-allowed" : "pointer",
                  fontWeight: "bold",
                }}
              >
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              style={{
                padding: "11px 18px",
                backgroundColor: "#1c3f3a",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Chỉnh sửa thông tin
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div
      style={{
        backgroundColor: "#f8fafc",
        border: "1px solid #eef2f6",
        borderRadius: "10px",
        padding: "16px",
      }}
    >
      <div
        style={{
          color: "#667085",
          fontSize: "13px",
          marginBottom: "7px",
        }}
      >
        {label}
      </div>

      <strong
        style={{
          color: "#1c3f3a",
          fontSize: "15px",
          wordBreak: "break-word",
        }}
      >
        {value}
      </strong>
    </div>
  );
}

function InputItem({ label, name, value, onChange, disabled = false }) {
  return (
    <div
      style={{
        backgroundColor: "#f8fafc",
        border: "1px solid #eef2f6",
        borderRadius: "10px",
        padding: "16px",
      }}
    >
      <label
        style={{
          display: "block",
          color: "#667085",
          fontSize: "13px",
          marginBottom: "7px",
        }}
      >
        {label}
      </label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={{
          width: "100%",
          padding: "11px 12px",
          borderRadius: "6px",
          border: "1px solid #d0d5dd",
          outline: "none",
          boxSizing: "border-box",
          backgroundColor: disabled ? "#f2f4f7" : "#ffffff",
          color: disabled ? "#667085" : "#111827",
        }}
      />
    </div>
  );
}

export default Profile;
