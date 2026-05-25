import { useEffect, useState } from "react";
import Topbar from "../../components/admin/Topbar";
import { tranhService } from "../../services";

function Paintings() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const layTatCaTranh = async () => {
      // try {
      //   const results = await tranhService.layTatCaTranh();
      //   if (results.success) {
      //   }
      // } catch {
      // } finally {
      // }
    };

    layTatCaTranh();
  }, []);

  const [newPainting, setNewPainting] = useState({
    name: "",
    material: "",
    price: "",
    stock: "",
    image: "",
  });

  const filteredPaintings = paintings.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const openAddModal = () => {
    setIsEditing(false);
    setNewPainting({ name: "", material: "", price: "", stock: "", image: "" });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setIsEditing(true);
    setEditId(item.id);
    setNewPainting({
      name: item.name,
      material: item.category,
      price: item.price.replace(/ đ/g, ""),
      stock: item.stock,
      image: item.image,
    });
    setShowModal(true);
  };

  const handleSavePainting = () => {
    if (!newPainting.name || !newPainting.material || !newPainting.price) {
      alert("Vui lòng nhập đầy đủ thông tin cần thiết!");
      return;
    }

    if (isEditing) {
      // Cập nhật tranh
      const updated = paintings.map((p) =>
        p.id === editId
          ? {
              ...p,
              name: newPainting.name,
              category: newPainting.material,
              price: newPainting.price + " đ",
              stock: Number(newPainting.stock),
              status: Number(newPainting.stock) > 0 ? "Còn" : "Hết",
              image: newPainting.image || p.image,
            }
          : p,
      );
      setPaintings(updated);
      alert("Cập nhật tác phẩm thành công!");
    } else {
      // Thêm tranh mới
      const item = {
        id: paintings.length + 1,
        image: newPainting.image || "https://picsum.photos/80",
        name: newPainting.name,
        category: newPainting.material,
        price: newPainting.price + " đ",
        stock: Number(newPainting.stock) || 0,
        status: Number(newPainting.stock) > 0 ? "Còn" : "Hết",
      };
      setPaintings([...paintings, item]);
      alert("Thêm tác phẩm mới thành công!");
    }

    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Xóa bức tranh này khỏi danh mục?")) {
      setPaintings(paintings.filter((item) => item.id !== id));
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
            Danh mục tranh
          </h1>
          <div
            className="painting-actions"
            style={{ display: "flex", gap: "15px" }}
          >
            <input
              type="text"
              placeholder="Search"
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: "8px 15px",
                borderRadius: "6px",
                border: "1px solid #ccc",
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
                <th style={{ padding: "12px" }}>Loại tranh</th>
                <th style={{ padding: "12px" }}>Giá bán</th>
                <th style={{ padding: "12px" }}>Tồn kho</th>
                <th style={{ padding: "12px" }}>Trạng thái</th>
                <th style={{ padding: "12px" }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredPaintings.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "12px" }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "6px",
                        objectFit: "cover",
                      }}
                    />
                  </td>
                  <td style={{ padding: "12px", fontWeight: "600" }}>
                    {item.name}
                  </td>
                  <td style={{ padding: "12px" }}>{item.category}</td>
                  <td
                    style={{
                      padding: "12px",
                      color: "#2e7d32",
                      fontWeight: "bold",
                    }}
                  >
                    {item.price}
                  </td>
                  <td style={{ padding: "12px" }}>{item.stock} tấm</td>
                  <td style={{ padding: "12px" }}>
                    <span
                      style={{
                        color: item.status === "Còn" ? "#27ae60" : "#e74c3c",
                        fontWeight: "bold",
                      }}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px", display: "flex", gap: "10px" }}>
                    <button
                      className="edit-btn"
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
                      className="delete-btn"
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
            <h2>{isEditing ? "Cập nhật thông tin tranh" : "Thêm tranh mới"}</h2>
            <input
              type="text"
              placeholder="Tên tranh"
              value={newPainting.name}
              onChange={(e) =>
                setNewPainting({ ...newPainting, name: e.target.value })
              }
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "12px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                boxSizing: "border-box",
              }}
            />
            <input
              type="text"
              placeholder="Chất liệu / Loại tranh"
              value={newPainting.material}
              onChange={(e) =>
                setNewPainting({ ...newPainting, material: e.target.value })
              }
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "12px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                boxSizing: "border-box",
              }}
            />
            <input
              type="text"
              placeholder="Giá tiền"
              value={newPainting.price}
              onChange={(e) =>
                setNewPainting({ ...newPainting, price: e.target.value })
              }
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "12px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                boxSizing: "border-box",
              }}
            />
            <input
              type="number"
              placeholder="Số lượng tồn kho"
              value={newPainting.stock}
              onChange={(e) =>
                setNewPainting({ ...newPainting, stock: e.target.value })
              }
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "12px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                boxSizing: "border-box",
              }}
            />
            <input
              type="text"
              placeholder="Đường dẫn hình ảnh URL"
              value={newPainting.image}
              onChange={(e) =>
                setNewPainting({ ...newPainting, image: e.target.value })
              }
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "20px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                boxSizing: "border-box",
              }}
            />
            <div
              className="modal-buttons"
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                className="cancel-btn"
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
                className="save-btn"
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
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Paintings;
