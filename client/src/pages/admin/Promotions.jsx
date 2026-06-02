import { useState, useEffect } from "react";
import Topbar from "../../components/admin/Topbar";
import khuyenMaiService from "../../services/khuyenMaiService";

const EMPTY_FORM = {
  ma: "",
  ten: "",
  mo_ta: "",
  loai_giam: "phan_tram",
  gia_tri_giam: "",
  giam_toi_da: "",
  don_toi_thieu: "0",
  so_luong: "",
  ngay_bat_dau: "",
  ngay_ket_thuc: "",
  ap_dung_cho: "toan_bo",
  trang_thai: "hoat_dong",
};

function Promotions() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  const [keyword, setKeyword] = useState("");

  // ─── Fetch ───────────────────────────────────────────────
  const fetchList = async (kw = "") => {
    setLoading(true);
    try {
      const res = await khuyenMaiService.layDanhSach(kw ? { keyword: kw } : {});
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

  const handleSearch = (e) => {
    const val = e.target.value;
    setKeyword(val);
    fetchList(val);
  };

  // ─── Form helpers ─────────────────────────────────────────
  const openAdd = () => {
    setIsEditing(false);
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (item) => {
    setIsEditing(true);
    setEditId(item.id);
    setForm({
      ma: item.ma || "",
      ten: item.ten || "",
      mo_ta: item.mo_ta || "",
      loai_giam: item.loai_giam || "phan_tram",
      gia_tri_giam: item.gia_tri_giam ?? "",
      giam_toi_da: item.giam_toi_da ?? "",
      don_toi_thieu: item.don_toi_thieu ?? "0",
      so_luong: item.so_luong ?? "",
      ngay_bat_dau: item.ngay_bat_dau?.slice(0, 10) || "",
      ngay_ket_thuc: item.ngay_ket_thuc?.slice(0, 10) || "",
      ap_dung_cho: item.ap_dung_cho || "toan_bo",
      trang_thai: item.trang_thai || "hoat_dong",
    });
    setFormError("");
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "ma" ? value.toUpperCase() : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.ma || !form.ten || !form.gia_tri_giam) {
      setFormError("Vui lòng nhập đầy đủ mã, tên và mức giảm.");
      return;
    }
    setSubmitting(true);
    setFormError("");

    const payload = {
      ...form,
      gia_tri_giam: Number(form.gia_tri_giam),
      giam_toi_da: form.giam_toi_da ? Number(form.giam_toi_da) : null,
      don_toi_thieu: Number(form.don_toi_thieu || 0),
      so_luong: form.so_luong ? Number(form.so_luong) : null,
    };

    try {
      const res = isEditing
        ? await khuyenMaiService.capNhat(editId, payload)
        : await khuyenMaiService.taoMoi(payload);

      if (res?.success) {
        setShowModal(false);
        fetchList(keyword);
      } else {
        setFormError(res?.error || "Lưu thất bại, vui lòng thử lại.");
      }
    } catch (err) {
      console.error(err);
      setFormError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa mã giảm giá này không?")) return;
    try {
      const res = await khuyenMaiService.xoa(id);
      if (res?.success) fetchList(keyword);
      else alert(res?.error || "Xóa thất bại.");
    } catch (e) {
      console.error(e);
      alert("Lỗi kết nối.");
    }
  };

  // ─── Helpers hiển thị ─────────────────────────────────────
  const formatGiaTri = (item) => {
    if (item.loai_giam === "phan_tram") return `${item.gia_tri_giam}%`;
    return Number(item.gia_tri_giam).toLocaleString("vi-VN") + " đ";
  };

  const formatPrice = (val) =>
    val ? Number(val).toLocaleString("vi-VN") + " đ" : "—";

  const formatDate = (val) => (val ? val.slice(0, 10) : "—");

  const trangThaiLabel = (tt) =>
    ({ hoat_dong: "Hoạt động", tam_dung: "Tạm dừng", het_han: "Hết hạn" })[
      tt
    ] || tt;

  const trangThaiColor = (tt) => (tt === "hoat_dong" ? "#2e7d32" : "#aaa");

  const apDungLabel = (val) =>
    ({ toan_bo: "Toàn bộ", tranh: "Tranh", danh_muc: "Danh mục" })[val] || val;

  const phanTramDaDung = (item) => {
    if (!item.so_luong) return null;
    return Math.min(
      Math.round((item.so_luong_da_dung / item.so_luong) * 100),
      100,
    );
  };

  // ─── Stats ────────────────────────────────────────────────
  const tongMa = list.length;
  const dangHoatDong = list.filter((p) => p.trang_thai === "hoat_dong").length;
  const tongLuotDung = list.reduce(
    (acc, p) => acc + (p.so_luong_da_dung || 0),
    0,
  );

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "#f4f6f9",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <Topbar />

      <div style={{ padding: "30px", textAlign: "left" }}>
        {/* Stat cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
            marginBottom: "25px",
          }}
        >
          <div style={s.statCard}>
            <span style={s.statLabel}>Tổng số mã</span>
            <h2 style={s.statNum}>{tongMa}</h2>
          </div>
          <div style={s.statCard}>
            <span style={s.statLabel}>Đang hoạt động</span>
            <h2 style={s.statNum}>{dangHoatDong}</h2>
          </div>
          <div style={s.statCard}>
            <span style={s.statLabel}>Lượt đã sử dụng</span>
            <h2 style={s.statNum}>{tongLuotDung}</h2>
          </div>
        </div>

        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "25px",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Tìm theo mã hoặc tên khuyến mãi..."
            value={keyword}
            onChange={handleSearch}
            style={s.searchInput}
          />
          <button onClick={openAdd} style={s.btnPrimary}>
            + Tạo mã mới
          </button>
        </div>

        {/* Danh sách */}
        {loading ? (
          <div style={s.emptyState}>Đang tải...</div>
        ) : list.length === 0 ? (
          <div style={s.emptyState}>
            Chưa có mã khuyến mãi nào.
            <br />
            <button
              style={{ ...s.btnPrimary, marginTop: "16px" }}
              onClick={openAdd}
            >
              Tạo mã đầu tiên
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
            }}
          >
            {list.map((p) => {
              const pct = phanTramDaDung(p);
              return (
                <div key={p.id} style={s.card}>
                  <div>
                    {/* Header */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "12px",
                      }}
                    >
                      <span style={s.codeBadge}>{p.ma}</span>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          color: trangThaiColor(p.trang_thai),
                        }}
                      >
                        ● {trangThaiLabel(p.trang_thai)}
                      </span>
                    </div>

                    <h4
                      style={{
                        margin: "0 0 4px 0",
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "#2c3e50",
                      }}
                    >
                      {p.ten}
                    </h4>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#666",
                        margin: "0 0 6px 0",
                        lineHeight: "1.4",
                      }}
                    >
                      {p.mo_ta || "—"}
                    </p>

                    {/* Giá trị giảm nổi bật */}
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: "#1c3f3a",
                        marginBottom: "12px",
                      }}
                    >
                      -{formatGiaTri(p)}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "13px",
                        borderTop: "1px dashed #eee",
                        paddingTop: "10px",
                        marginBottom: "12px",
                      }}
                    >
                      <div>
                        <span style={{ color: "#888" }}>Đơn tối thiểu</span>
                        <strong
                          style={{
                            display: "block",
                            color: "#333",
                            marginTop: "2px",
                          }}
                        >
                          {formatPrice(p.don_toi_thieu)}
                        </strong>
                      </div>
                      <div>
                        <span style={{ color: "#888" }}>Áp dụng cho</span>
                        <strong
                          style={{
                            display: "block",
                            color: "#333",
                            marginTop: "2px",
                          }}
                        >
                          {apDungLabel(p.ap_dung_cho)}
                        </strong>
                      </div>
                    </div>

                    {/* Thanh tiến độ — chỉ hiện nếu có giới hạn số lượng */}
                    {p.so_luong !== null && p.so_luong !== undefined && (
                      <div style={{ marginBottom: "12px" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "12px",
                            color: "#555",
                            marginBottom: "4px",
                          }}
                        >
                          <span>
                            Đã dùng {p.so_luong_da_dung}/{p.so_luong}
                          </span>
                          <span>{pct}%</span>
                        </div>
                        <div
                          style={{
                            width: "100%",
                            height: "6px",
                            backgroundColor: "#eee",
                            borderRadius: "4px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${pct}%`,
                              height: "100%",
                              backgroundColor: "#1c3f3a",
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderTop: "1px solid #f5f5f5",
                      paddingTop: "12px",
                      marginTop: "8px",
                    }}
                  >
                    <span style={{ fontSize: "11px", color: "#999" }}>
                      {formatDate(p.ngay_bat_dau)} →{" "}
                      {formatDate(p.ngay_ket_thuc)}
                    </span>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => openEdit(p)} style={s.btnEdit}>
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        style={s.btnDelete}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal thêm/sửa */}
      {showModal && (
        <div style={s.overlay} onClick={() => setShowModal(false)}>
          <form
            onSubmit={handleSave}
            style={s.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={s.modalTitle}>
              {isEditing
                ? "Cập nhật khuyến mãi"
                : "Tạo chương trình khuyến mãi"}
            </h3>

            <div style={s.row2}>
              <div>
                <label style={s.label}>Mã giảm (Code) *</label>
                <input
                  name="ma"
                  value={form.ma}
                  onChange={handleChange}
                  placeholder="SUMMER20"
                  style={s.input}
                  required
                />
              </div>
              <div>
                <label style={s.label}>Loại giảm *</label>
                <select
                  name="loai_giam"
                  value={form.loai_giam}
                  onChange={handleChange}
                  style={s.input}
                >
                  <option value="phan_tram">Phần trăm (%)</option>
                  <option value="so_tien">Số tiền cố định (đ)</option>
                </select>
              </div>
            </div>

            <div style={s.row2}>
              <div>
                <label style={s.label}>
                  Mức giảm * {form.loai_giam === "phan_tram" ? "(%)" : "(đ)"}
                </label>
                <input
                  name="gia_tri_giam"
                  type="number"
                  min="0"
                  value={form.gia_tri_giam}
                  onChange={handleChange}
                  placeholder={form.loai_giam === "phan_tram" ? "20" : "50000"}
                  style={s.input}
                  required
                />
              </div>
              <div>
                <label style={s.label}>Giảm tối đa (đ)</label>
                <input
                  name="giam_toi_da"
                  type="number"
                  min="0"
                  value={form.giam_toi_da}
                  onChange={handleChange}
                  placeholder="Không giới hạn"
                  style={s.input}
                />
              </div>
            </div>

            <label style={s.label}>Tên khuyến mãi *</label>
            <input
              name="ten"
              value={form.ten}
              onChange={handleChange}
              placeholder="Giảm giá mùa hè"
              style={s.input}
              required
            />

            <label style={s.label}>Mô tả</label>
            <textarea
              name="mo_ta"
              value={form.mo_ta}
              onChange={handleChange}
              placeholder="Điều kiện áp dụng..."
              style={{ ...s.input, height: "60px", resize: "none" }}
            />

            <div style={s.row2}>
              <div>
                <label style={s.label}>Đơn tối thiểu (đ)</label>
                <input
                  name="don_toi_thieu"
                  type="number"
                  min="0"
                  value={form.don_toi_thieu}
                  onChange={handleChange}
                  placeholder="0"
                  style={s.input}
                />
              </div>
              <div>
                <label style={s.label}>Tổng lượt phát hành</label>
                <input
                  name="so_luong"
                  type="number"
                  min="1"
                  value={form.so_luong}
                  onChange={handleChange}
                  placeholder="Không giới hạn"
                  style={s.input}
                />
              </div>
            </div>

            <div style={s.row2}>
              <div>
                <label style={s.label}>Ngày bắt đầu</label>
                <input
                  name="ngay_bat_dau"
                  type="date"
                  value={form.ngay_bat_dau}
                  onChange={handleChange}
                  style={s.input}
                />
              </div>
              <div>
                <label style={s.label}>Ngày kết thúc</label>
                <input
                  name="ngay_ket_thuc"
                  type="date"
                  value={form.ngay_ket_thuc}
                  onChange={handleChange}
                  style={s.input}
                />
              </div>
            </div>

            <div style={s.row2}>
              <div>
                <label style={s.label}>Áp dụng cho</label>
                <select
                  name="ap_dung_cho"
                  value={form.ap_dung_cho}
                  onChange={handleChange}
                  style={s.input}
                >
                  <option value="toan_bo">Toàn bộ</option>
                  <option value="tranh">Tranh cụ thể</option>
                  <option value="danh_muc">Danh mục</option>
                </select>
              </div>
              <div>
                <label style={s.label}>Trạng thái</label>
                <select
                  name="trang_thai"
                  value={form.trang_thai}
                  onChange={handleChange}
                  style={s.input}
                >
                  <option value="hoat_dong">Hoạt động</option>
                  <option value="tam_dung">Tạm dừng</option>
                </select>
              </div>
            </div>

            {formError && (
              <p
                style={{
                  color: "#e74c3c",
                  fontSize: "13px",
                  margin: "8px 0 0",
                }}
              >
                {formError}
              </p>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={s.btnSecondary}
                disabled={submitting}
              >
                Hủy
              </button>
              <button
                type="submit"
                style={{ ...s.btnPrimary, opacity: submitting ? 0.7 : 1 }}
                disabled={submitting}
              >
                {submitting
                  ? "Đang lưu..."
                  : isEditing
                    ? "Lưu thay đổi"
                    : "Tạo mã"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

const s = {
  statCard: {
    backgroundColor: "#fff",
    padding: "18px 22px",
    borderRadius: "12px",
    border: "1px solid #eee",
    textAlign: "left",
  },
  statLabel: { fontSize: "13px", color: "#888" },
  statNum: {
    margin: "6px 0 0",
    fontSize: "28px",
    fontWeight: "500",
    color: "#111",
  },
  searchInput: {
    padding: "11px 15px",
    width: "350px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none",
    fontSize: "14px",
    backgroundColor: "#fff",
  },
  btnPrimary: {
    padding: "11px 24px",
    backgroundColor: "#1c3f3a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "14px",
  },
  btnSecondary: {
    padding: "10px 18px",
    background: "none",
    border: "1px solid #ccc",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  btnEdit: {
    border: "1px solid #ddd",
    background: "#fff",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
  },
  btnDelete: {
    border: "1px solid #fcc",
    background: "#fff",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    color: "#e74c3c",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid #eee",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "240px",
  },
  codeBadge: {
    backgroundColor: "#eef2f5",
    padding: "4px 12px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "bold",
    color: "#1c3f3a",
    letterSpacing: "0.5px",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 0",
    color: "#aaa",
    fontSize: "15px",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  modal: {
    backgroundColor: "#fff",
    padding: "32px",
    borderRadius: "12px",
    width: "500px",
    boxSizing: "border-box",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  modalTitle: {
    margin: "0 0 20px 0",
    color: "#1c3f3a",
    fontWeight: "500",
    fontSize: "18px",
  },
  label: {
    display: "block",
    fontSize: "12px",
    color: "#555",
    marginBottom: "5px",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    marginBottom: "12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    boxSizing: "border-box",
    outline: "none",
    fontSize: "14px",
  },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
};

export default Promotions;
