import { useEffect, useState } from "react";
import Topbar from "../../components/admin/Topbar";
import { danhMucService, tacGiaService, tranhService } from "../../services"; // Gọi file dịch vụ của team

function Paintings() {
  const [paintings, setPaintings] = useState([]); // 🛠️ FIX LỖI: Khai báo State lưu trữ danh sách tranh
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Thêm state cho danh mục và tác giả
  const [danhMucList, setDanhMucList] = useState([]);
  const [tacGiaList, setTacGiaList] = useState([]);

  const [newPainting, setNewPainting] = useState({
    name: "",
    danh_muc_id: "",
    tac_gia_id: "",
    price: "",
    stock: "",
    image: "",
  });

  // Load danh mục + tác giả song song khi mở modal
  const loadSelectData = async () => {
    try {
      const [dmRes, tgRes] = await Promise.all([
        danhMucService.layTatCaDanhMuc(),
        tacGiaService.layTatCaTacGia(),
      ]);
      if (dmRes.success) setDanhMucList(dmRes.data || []);
      if (tgRes.success) setTacGiaList(tgRes.data || []);
    } catch (err) {
      console.error("Lỗi load danh mục / tác giả:", err);
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setNewPainting({
      name: "",
      danh_muc_id: "",
      tac_gia_id: "",
      price: "",
      stock: "",
      image: "",
    });
    loadSelectData(); // 👈 gọi khi mở modal
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setIsEditing(true);
    setEditId(item.id);
    setNewPainting({
      name: item.name,
      danh_muc_id: item.danh_muc_id || "",
      tac_gia_id: item.tac_gia_id || "",
      price: String(item.rawPrice || "").replace(/[^0-9]/g, ""),
      stock: item.stock,
      image: item.image,
    });
    loadSelectData(); // 👈 gọi khi mở modal sửa
    setShowModal(true);
  };

  // 1. MỞ COMMENT & LIÊN KẾT API LẤY DANH SÁCH TRANH TỪ BACKEND
  const loadPaintingsData = async () => {
    setLoading(true);
    try {
      const result = await tranhService.layTatCaTranh();
      if (result.success && result.data) {
        setPaintings(result.data);
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách tranh:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPaintingsData();
  }, []);

  // Xử lý bộ lọc ô Tìm kiếm nhanh
  const filteredPaintings = paintings.filter((item) =>
    (item.name || "").toLowerCase().includes(search.toLowerCase()),
  );

  const handleSavePainting = async () => {
    if (
      !newPainting.name ||
      !newPainting.danh_muc_id ||
      !newPainting.tac_gia_id ||
      !newPainting.price
    ) {
      alert("Vui lòng nhập đầy đủ thông tin cần thiết!");
      return;
    }

    const payload = {
      ten_tranh: newPainting.name,
      danh_muc_id: newPainting.danh_muc_id, // ← đúng
      tac_gia_id: newPainting.tac_gia_id,
      gia_ban: Number(newPainting.price),
      gia_von: Number(newPainting.price) / 2,
      so_luong_ton: Number(newPainting.stock),
      mo_ta: "",
    };

    try {
      if (isEditing) {
        // ✅ Lỗi 2 đã sửa: alert đúng nội dung
        const result = await tranhService.capNhatTranh(editId, payload);
        if (result.success) {
          alert("Cập nhật tác phẩm thành công!");
          setShowModal(false);
          loadPaintingsData();
        } else {
          alert("Cập nhật thất bại: " + (result.error || "Lỗi không xác định"));
        }
      } else {
        // ✅ Lỗi 1 đã sửa: thêm mới có logic
        const result = await tranhService.taoTranh(payload);
        if (result.success) {
          alert("Thêm tác phẩm mới thành công!");
          setShowModal(false);
          loadPaintingsData();
        } else {
          alert("Thêm thất bại: " + (result.error || "Lỗi không xác định"));
        }
      }
    } catch (error) {
      alert("Có lỗi xảy ra: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bức tranh này?")) return;

    try {
      // ✅ Lỗi 3 đã sửa: gọi API thật
      const result = await tranhService.xoaTranh(id);
      if (result.success) {
        setPaintings(paintings.filter((item) => item.id !== id));
      } else {
        alert("Xóa thất bại: " + (result.error || "Lỗi không xác định"));
      }
    } catch (error) {
      alert("Có lỗi xảy ra: " + error.message);
    }
  };

  return (
    <div
      className="dashboard-content"
      style={{ flex: 1, backgroundColor: "#f9f9f9", minHeight: "100vh" }}
    >
      <Topbar />

      <div style={{ padding: "30px", textAlign: "left" }}>
        <div
          className="painting-header"
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
            Danh mục tranh xưởng vẽ
          </h1>
          <div
            className="painting-actions"
            style={{ display: "flex", gap: "15px" }}
          >
            <input
              type="text"
              placeholder="Tìm kiếm tác phẩm..."
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: "8px 15px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                outline: "none",
              }}
            />
            <button
              className="add-btn"
              onClick={openAddModal}
              style={{
                padding: "10px 20px",
                backgroundColor: "#1c3f3a",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              + Thêm tranh
            </button>
          </div>
        </div>

        <div
          className="table-box"
          style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          {loading ? (
            <div
              style={{ padding: "20px", textAlign: "center", color: "#666" }}
            >
              Đang đồng bộ cổng API xưởng tranh...
            </div>
          ) : (
            <table
              className="painting-table"
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: "2px solid #f0f0f0",
                    color: "#555",
                    textAlign: "left",
                  }}
                >
                  <th style={{ padding: "12px" }}>Hình ảnh</th>
                  <th style={{ padding: "12px" }}>Tên tranh</th>
                  <th style={{ padding: "12px" }}>Tác giả</th>
                  <th style={{ padding: "12px" }}>Loại tranh</th>
                  <th style={{ padding: "12px" }}>Giá bán</th>
                  <th style={{ padding: "12px" }}>Tồn kho</th>
                  <th style={{ padding: "12px" }}>Trạng thái</th>
                  <th style={{ padding: "12px" }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredPaintings.map((item) => (
                  <tr
                    key={item.id}
                    style={{ borderBottom: "1px solid #f0f0f0" }}
                  >
                    <td>
                      <img
                        src={
                          item.hinhAnhChinh?.duongDan ||
                          "https://picsum.photos/80"
                        }
                      />
                    </td>
                    <td>{item.ten_tranh}</td>
                    <td>{item.tac_gia.ho_ten}</td>
                    <td>{item.danh_muc.ten}</td>
                    <td>
                      {typeof item.gia_ban === "number"
                        ? item.gia_ban.toLocaleString("vi-VN") + " đ"
                        : "0 đ"}
                    </td>
                    <td>{item.so_luong_ton ?? 0} tấm</td>
                    <td
                      style={{
                        color: item.so_luong_ton > 0 ? "#27ae60" : "#e74c3c",
                        fontWeight: "bold",
                      }}
                    >
                      {item.so_luong_ton > 0 ? "Còn" : "Hết"}
                    </td>
                    <td
                      style={{ padding: "12px", display: "flex", gap: "10px" }}
                    >
                      <button
                        onClick={() => openEditModal(item)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#f39c12",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#ff4d4f",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div
          className="modal-overlay"
          style={{
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
          }}
        >
          <div
            className="modal"
            style={{
              backgroundColor: "#fff",
              padding: "30px",
              borderRadius: "10px",
              width: "400px",
            }}
          >
            <h2 style={{ marginBottom: "20px", color: "#1c3f3a" }}>
              {isEditing ? "Cập nhật thông tin tranh" : "Thêm tranh mới"}
            </h2>

            {/* Tên tranh */}
            <label style={labelStyle}>Tên tranh *</label>
            <input
              type="text"
              placeholder="Nhập tên tác phẩm"
              value={newPainting.name}
              onChange={(e) =>
                setNewPainting({ ...newPainting, name: e.target.value })
              }
              style={inputStyle}
            />

            {/* Danh mục — SELECT từ API */}
            <label style={labelStyle}>Danh mục *</label>
            <select
              value={newPainting.danh_muc_id}
              onChange={(e) =>
                setNewPainting({ ...newPainting, danh_muc_id: e.target.value })
              }
              style={inputStyle}
            >
              <option value="">-- Chọn danh mục --</option>
              {danhMucList.map((dm) => (
                <option key={dm.id} value={dm.id}>
                  {dm.ten}
                </option>
              ))}
            </select>

            {/* Tác giả — SELECT từ API */}
            <label style={labelStyle}>Tác giả *</label>
            <select
              value={newPainting.tac_gia_id}
              onChange={(e) =>
                setNewPainting({ ...newPainting, tac_gia_id: e.target.value })
              }
              style={inputStyle}
            >
              <option value="">-- Chọn tác giả --</option>
              {tacGiaList.map((tg) => (
                <option
                  key={tg.tac_gia_id || tg.id}
                  value={tg.tac_gia_id || tg.id}
                >
                  {tg.ho_ten}
                </option>
              ))}
            </select>

            {/* Giá bán */}
            <label style={labelStyle}>Giá bán (VNĐ) *</label>
            <input
              type="number"
              placeholder="VD: 3600000"
              value={newPainting.price}
              onChange={(e) =>
                setNewPainting({ ...newPainting, price: e.target.value })
              }
              style={inputStyle}
            />

            {/* Tồn kho */}
            <label style={labelStyle}>Số lượng tồn kho</label>
            <input
              type="number"
              placeholder="VD: 10"
              value={newPainting.stock}
              onChange={(e) =>
                setNewPainting({ ...newPainting, stock: e.target.value })
              }
              style={inputStyle}
            />

            {/* Hình ảnh */}
            <label style={labelStyle}>URL hình ảnh</label>
            <input
              type="text"
              placeholder="https://..."
              value={newPainting.image}
              onChange={(e) =>
                setNewPainting({ ...newPainting, image: e.target.value })
              }
              style={inputStyle}
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
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#aaa",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Hủy
              </button>
              <button
                onClick={handleSavePainting}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#1c3f3a",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Lưu tác phẩm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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

export default Paintings;
