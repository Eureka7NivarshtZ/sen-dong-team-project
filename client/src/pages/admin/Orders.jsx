import { useEffect, useMemo, useState } from "react";
import Topbar from "../../components/admin/Topbar";
import donHangService from "../../services/donHangService";

const TRANG_THAI_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "cho_xac_nhan", label: "Chờ xác nhận" },
  { value: "dang_chuan_bi", label: "Đang chuẩn bị" },
  { value: "dang_giao", label: "Đang giao" },
  { value: "hoan_thanh", label: "Hoàn thành" },
  { value: "huy", label: "Đã hủy" },
];

const STATUS_LABEL = {
  cho_xac_nhan: "Chờ xác nhận",
  dang_chuan_bi: "Đang chuẩn bị",
  dang_giao: "Đang giao",
  hoan_thanh: "Hoàn thành",
  huy: "Đã hủy",
};

const STATUS_STYLE = {
  cho_xac_nhan: {
    backgroundColor: "#fff7e6",
    color: "#d48806",
  },
  dang_chuan_bi: {
    backgroundColor: "#e6f4ff",
    color: "#1677ff",
  },
  dang_giao: {
    backgroundColor: "#f0f5ff",
    color: "#2f54eb",
  },
  hoan_thanh: {
    backgroundColor: "#f6ffed",
    color: "#389e0d",
  },
  huy: {
    backgroundColor: "#fff1f0",
    color: "#cf1322",
  },
};

function parseMoney(value) {
  if (value === null || value === undefined || value === "") return 0;
  if (typeof value === "number") return value;

  const text = String(value).trim();

  if (/^\d+(\.\d+)?$/.test(text)) {
    return Number(text);
  }

  return Number(text.replace(/[^\d]/g, "")) || 0;
}

function formatCurrency(value) {
  const number = parseMoney(value);

  return number.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getOrderTimestamp(order) {
  const value =
    order?.ngay_dat ||
    order?.createdAt ||
    order?.created_at ||
    order?.updatedAt ||
    order?.updated_at;

  const time = new Date(value).getTime();

  return Number.isNaN(time) ? 0 : time;
}

function sortOrdersNewestFirst(list) {
  return [...(list || [])].sort((a, b) => {
    return getOrderTimestamp(b) - getOrderTimestamp(a);
  });
}

function getCustomerName(order) {
  return (
    order?.ten_nguoi_nhan ||
    order?.khach_hang?.ho_ten ||
    order?.khach_hang?.ten_khach_hang ||
    order?.khach_hang?.tai_khoan?.ho_ten ||
    order?.khach_hang?.email ||
    order?.nguoi_dung?.ho_ten ||
    order?.user?.ho_ten ||
    "Khách hàng"
  );
}

function getOrderDiscount(order) {
  return (
    parseMoney(order?.giam_gia) ||
    parseMoney(order?.so_tien_giam) ||
    parseMoney(order?.tien_giam) ||
    parseMoney(order?.giam_gia_khuyen_mai) ||
    parseMoney(order?.khuyen_mai?.so_tien_giam) ||
    parseMoney(order?.khuyenMai?.so_tien_giam) ||
    parseMoney(order?.khuyen_mai?.gia_tri_giam) ||
    parseMoney(order?.KhuyenMai?.so_tien_giam) ||
    0
  );
}

function getOrderTotal(order) {
  if (order?.tong_thanh_toan !== undefined && order?.tong_thanh_toan !== null) {
    return parseMoney(order.tong_thanh_toan);
  }

  if (order?.tong_tien !== undefined && order?.tong_tien !== null) {
    return parseMoney(order.tong_tien);
  }

  const tongTienHang = parseMoney(order?.tong_tien_hang);
  const phiVanChuyen = parseMoney(order?.phi_van_chuyen);
  const giamGia = getOrderDiscount(order);

  return Math.max(tongTienHang + phiVanChuyen - giamGia, 0);
}

function getOrderItems(order) {
  return (
    order?.don_hang_chi_tiet ||
    order?.chi_tiet ||
    order?.chi_tiet_don_hang ||
    order?.items ||
    order?.donHangChiTiet ||
    []
  );
}

function normalizeOrderListResponse(result) {
  const data = result?.data;

  const possibleLists = [
    data,
    data?.danh_sach,
    data?.orders,
    data?.don_hang,
    data?.donHangs,
    data?.rows,
    data?.items,
    data?.data,
    result?.orders,
    result?.don_hang,
    result?.rows,
    result?.items,
  ];

  const rawList = possibleLists.find((item) => Array.isArray(item)) || [];
  const list = sortOrdersNewestFirst(rawList);

  const possibleTotals = [
    result?.total,
    result?.count,
    result?.totalItems,
    result?.tong_so,
    data?.total,
    data?.count,
    data?.totalItems,
    data?.tong_so,
    data?.pagination?.total,
    data?.pagination?.totalItems,
    data?.meta?.total,
    data?.meta?.totalItems,
  ];

  const totalValue = possibleTotals.find(
    (item) => item !== undefined && item !== null && item !== "",
  );

  return {
    list,
    total: Number(totalValue ?? list.length) || list.length,
  };
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const stats = useMemo(() => {
    return {
      tongDon: total,
      choXacNhan: orders.filter((item) => item.trang_thai === "cho_xac_nhan")
        .length,
      dangGiao: orders.filter((item) => item.trang_thai === "dang_giao").length,
      hoanThanh: orders.filter((item) => item.trang_thai === "hoan_thanh")
        .length,
    };
  }, [orders, total]);

  const fetchOrders = async (pageOverride = page) => {
    setLoading(true);
    setError("");

    try {
      const params = {
        page: pageOverride,
        limit,
        sort_by: "ngay_dat",
        sort_order: "desc",
      };

      if (filterStatus) {
        params.trang_thai = filterStatus;
      }

      if (search.trim()) {
        params.search = search.trim();
      }

      const result = await donHangService.xemTatCaDonHang(params);

      console.log("Kết quả lấy danh sách đơn hàng:", result);

      if (result?.success) {
        const normalized = normalizeOrderListResponse(result);

        setOrders(normalized.list);
        setTotal(normalized.total);
      } else {
        setOrders([]);
        setTotal(0);
        setError(result?.error || "Không thể tải danh sách đơn hàng");
      }
    } catch (err) {
      console.error("Lỗi fetchOrders:", err);
      setOrders([]);
      setTotal(0);
      setError("Có lỗi khi tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filterStatus]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    fetchOrders(1);
  };

  const handleRefresh = () => {
    fetchOrders(page);
  };

  const handleViewDetail = async (id) => {
    if (!id) return;

    setDetailLoading(true);
    setSelectedOrder(null);

    try {
      const result = await donHangService.xemChiTietDonBatKy(id);

      console.log("Kết quả chi tiết đơn hàng:", result);

      if (result?.success) {
        setSelectedOrder(result.data);
      } else {
        alert(result?.error || "Không thể xem chi tiết đơn hàng");
      }
    } catch (err) {
      console.error("Lỗi xem chi tiết đơn:", err);
      alert("Có lỗi khi xem chi tiết đơn hàng");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleChangeStatus = async (order, nextStatus) => {
    if (!nextStatus || nextStatus === order.trang_thai) return;

    const confirmMessage = `Cập nhật đơn ${
      order.ma_don_hang || order.id
    } sang trạng thái "${STATUS_LABEL[nextStatus] || nextStatus}"?`;

    if (!window.confirm(confirmMessage)) return;

    setActionLoading(true);

    try {
      const result = await donHangService.capNhatTrangThaiDon(
        order.id,
        nextStatus,
      );

      if (result?.success) {
        alert("Cập nhật trạng thái thành công");

        await fetchOrders(page);

        if (selectedOrder?.id === order.id) {
          await handleViewDetail(order.id);
        }
      } else {
        alert(result?.error || "Cập nhật trạng thái thất bại");
      }
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
      alert("Có lỗi khi cập nhật trạng thái");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelOrder = async (order) => {
    if (!["cho_xac_nhan", "dang_chuan_bi"].includes(order.trang_thai)) {
      alert("Chỉ có thể hủy đơn ở trạng thái Chờ xác nhận hoặc Đang chuẩn bị");
      return;
    }

    if (
      !window.confirm(
        `Bạn có chắc muốn hủy đơn ${order.ma_don_hang || order.id}?`,
      )
    ) {
      return;
    }

    setActionLoading(true);

    try {
      const result = await donHangService.huyDonBatKy(order.id);

      if (result?.success) {
        alert("Hủy đơn hàng thành công");

        await fetchOrders(page);

        if (selectedOrder?.id === order.id) {
          setSelectedOrder(null);
        }
      } else {
        alert(result?.error || "Hủy đơn hàng thất bại");
      }
    } catch (err) {
      console.error("Lỗi hủy đơn:", err);
      alert("Có lỗi khi hủy đơn hàng");
    } finally {
      setActionLoading(false);
    }
  };

  const detailItems = getOrderItems(selectedOrder);

  return (
    <div
      className="dashboard-content"
      style={{
        flex: 1,
        backgroundColor: "#f6f7f8",
        minHeight: "100vh",
      }}
    >
      <Topbar />

      <div style={{ padding: "30px", textAlign: "left" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div>
            <h1
              style={{
                color: "#1c3f3a",
                margin: 0,
                fontSize: "26px",
                fontWeight: "bold",
              }}
            >
              Quản lý đơn hàng
            </h1>
            <p style={{ margin: "6px 0 0", color: "#667085" }}>
              Theo dõi, xác nhận, cập nhật trạng thái và hủy đơn hàng.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={loading}
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#1c3f3a",
              color: "#fff",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Đang tải..." : "Làm mới"}
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <StatCard title="Tổng đơn" value={stats.tongDon} />
          <StatCard title="Chờ xác nhận" value={stats.choXacNhan} />
          <StatCard title="Đang giao" value={stats.dangGiao} />
          <StatCard title="Hoàn thành" value={stats.hoanThanh} />
        </div>

        <form
          onSubmit={handleSearchSubmit}
          style={{
            backgroundColor: "#fff",
            padding: "18px",
            borderRadius: "12px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
            marginBottom: "20px",
            display: "flex",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Tìm theo mã đơn, tên khách hàng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              padding: "11px 14px",
              borderRadius: "8px",
              border: "1px solid #d0d5dd",
              outline: "none",
            }}
          />

          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1);
            }}
            style={{
              padding: "11px 14px",
              borderRadius: "8px",
              border: "1px solid #d0d5dd",
              minWidth: "190px",
            }}
          >
            {TRANG_THAI_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <button
            type="submit"
            style={{
              padding: "11px 18px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#1c3f3a",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Tìm kiếm
          </button>
        </form>

        {error && (
          <div
            style={{
              backgroundColor: "#fff1f0",
              color: "#cf1322",
              padding: "12px 14px",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
            overflowX: "auto",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid #eaecf0",
                  color: "#475467",
                  textAlign: "left",
                }}
              >
                <th style={thStyle}>Mã đơn</th>
                <th style={thStyle}>Khách hàng</th>
                <th style={thStyle}>Địa chỉ</th>
                <th style={thStyle}>Ngày đặt</th>
                <th style={thStyle}>Tổng tiền</th>
                <th style={thStyle}>Trạng thái</th>
                <th style={thStyle}>Cập nhật</th>
                <th style={thStyle}>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={emptyStyle}>
                    Đang tải đơn hàng...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="8" style={emptyStyle}>
                    Không có đơn hàng nào.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    style={{ borderBottom: "1px solid #f2f4f7" }}
                  >
                    <td style={tdStyle}>
                      <strong>{order.ma_don_hang || `DH-${order.id}`}</strong>
                    </td>

                    <td style={tdStyle}>{getCustomerName(order)}</td>

                    <td
                      style={{
                        ...tdStyle,
                        maxWidth: "260px",
                        color: "#667085",
                      }}
                    >
                      {order.dia_chi_giao || "-"}
                    </td>

                    <td style={tdStyle}>
                      {formatDate(order.ngay_dat || order.createdAt)}
                    </td>

                    <td
                      style={{
                        ...tdStyle,
                        color: "#2e7d32",
                        fontWeight: 700,
                      }}
                    >
                      {formatCurrency(getOrderTotal(order))}
                    </td>

                    <td style={tdStyle}>
                      <StatusBadge status={order.trang_thai} />
                    </td>

                    <td style={tdStyle}>
                      <select
                        value={order.trang_thai || ""}
                        disabled={actionLoading || order.trang_thai === "huy"}
                        onChange={(e) =>
                          handleChangeStatus(order, e.target.value)
                        }
                        style={{
                          padding: "8px 10px",
                          borderRadius: "8px",
                          border: "1px solid #d0d5dd",
                          cursor:
                            actionLoading || order.trang_thai === "huy"
                              ? "not-allowed"
                              : "pointer",
                        }}
                      >
                        {TRANG_THAI_OPTIONS.filter((item) => item.value).map(
                          (item) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ),
                        )}
                      </select>
                    </td>

                    <td style={tdStyle}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => handleViewDetail(order.id)}
                          style={buttonOutlineStyle}
                        >
                          Chi tiết
                        </button>

                        <button
                          onClick={() => handleCancelOrder(order)}
                          disabled={
                            actionLoading ||
                            !["cho_xac_nhan", "dang_chuan_bi"].includes(
                              order.trang_thai,
                            )
                          }
                          style={{
                            ...buttonDangerStyle,
                            opacity: ![
                              "cho_xac_nhan",
                              "dang_chuan_bi",
                            ].includes(order.trang_thai)
                              ? 0.5
                              : 1,
                            cursor:
                              actionLoading ||
                              !["cho_xac_nhan", "dang_chuan_bi"].includes(
                                order.trang_thai,
                              )
                                ? "not-allowed"
                                : "pointer",
                          }}
                        >
                          Hủy
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "18px",
            }}
          >
            <span style={{ color: "#667085" }}>
              Trang {page} / {totalPages} — Tổng {total} đơn
            </span>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                style={{
                  ...paginationButtonStyle,
                  opacity: page <= 1 ? 0.5 : 1,
                  cursor: page <= 1 ? "not-allowed" : "pointer",
                }}
              >
                Trước
              </button>

              <button
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((prev) => Math.min(totalPages, prev + 1))
                }
                style={{
                  ...paginationButtonStyle,
                  opacity: page >= totalPages ? 0.5 : 1,
                  cursor: page >= totalPages ? "not-allowed" : "pointer",
                }}
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>

      {(selectedOrder || detailLoading) && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "760px",
              maxHeight: "90vh",
              overflowY: "auto",
              backgroundColor: "#fff",
              borderRadius: "14px",
              padding: "24px",
            }}
          >
            {detailLoading ? (
              <p>Đang tải chi tiết đơn hàng...</p>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "16px",
                    alignItems: "flex-start",
                    marginBottom: "18px",
                  }}
                >
                  <div>
                    <h2 style={{ margin: 0, color: "#1c3f3a" }}>
                      Chi tiết đơn hàng
                    </h2>
                    <p style={{ margin: "6px 0 0", color: "#667085" }}>
                      {selectedOrder.ma_don_hang || `DH-${selectedOrder.id}`}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedOrder(null)}
                    style={{
                      border: "none",
                      backgroundColor: "#f2f4f7",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      cursor: "pointer",
                    }}
                  >
                    Đóng
                  </button>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    marginBottom: "18px",
                  }}
                >
                  <InfoBox
                    label="Khách hàng"
                    value={getCustomerName(selectedOrder)}
                  />
                  <InfoBox
                    label="Ngày đặt"
                    value={formatDate(
                      selectedOrder.ngay_dat || selectedOrder.createdAt,
                    )}
                  />
                  <InfoBox
                    label="Địa chỉ giao"
                    value={selectedOrder.dia_chi_giao || "-"}
                  />
                  <InfoBox
                    label="Số điện thoại"
                    value={
                      selectedOrder.sdt_nguoi_nhan ||
                      selectedOrder.so_dien_thoai ||
                      "-"
                    }
                  />
                  <InfoBox
                    label="Đơn vị vận chuyển"
                    value={
                      selectedOrder?.don_vi_van_chuyen?.ten_don_vi ||
                      selectedOrder?.don_vi_van_chuyen?.ten ||
                      selectedOrder?.donViVanChuyen?.ten ||
                      "-"
                    }
                  />
                  <InfoBox
                    label="Phương thức thanh toán"
                    value={
                      selectedOrder?.phuong_thuc_thanh_toan === "cod"
                        ? "Thanh toán khi nhận hàng"
                        : selectedOrder?.phuong_thuc_thanh_toan || "-"
                    }
                  />
                  <InfoBox
                    label="Trạng thái"
                    value={STATUS_LABEL[selectedOrder.trang_thai] || "-"}
                  />
                  <InfoBox
                    label="Tổng tiền"
                    value={formatCurrency(getOrderTotal(selectedOrder))}
                  />
                </div>

                <h3 style={{ color: "#1c3f3a", marginBottom: "12px" }}>
                  Sản phẩm trong đơn
                </h3>

                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid #eaecf0",
                        textAlign: "left",
                      }}
                    >
                      <th style={thStyle}>Tranh</th>
                      <th style={thStyle}>Số lượng</th>
                      <th style={thStyle}>Đơn giá</th>
                      <th style={thStyle}>Thành tiền</th>
                    </tr>
                  </thead>

                  <tbody>
                    {detailItems.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={emptyStyle}>
                          Chưa có dữ liệu chi tiết sản phẩm.
                        </td>
                      </tr>
                    ) : (
                      detailItems.map((item, index) => {
                        const soLuong = parseMoney(
                          item.so_luong || item.quantity || 1,
                        );
                        const donGia = parseMoney(
                          item.don_gia ||
                            item.gia ||
                            item.price ||
                            item.tranh?.gia_ban ||
                            0,
                        );

                        return (
                          <tr
                            key={item.id || index}
                            style={{ borderBottom: "1px solid #f2f4f7" }}
                          >
                            <td style={tdStyle}>
                              {item?.tranh?.ten_tranh ||
                                item?.ten_tranh ||
                                item?.title ||
                                "Tranh"}
                            </td>
                            <td style={tdStyle}>{soLuong}</td>
                            <td style={tdStyle}>{formatCurrency(donGia)}</td>
                            <td style={tdStyle}>
                              {formatCurrency(soLuong * donGia)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>

                <div
                  style={{
                    marginTop: "18px",
                    backgroundColor: "#f8fafc",
                    border: "1px solid #eaecf0",
                    borderRadius: "10px",
                    padding: "14px",
                  }}
                >
                  <div style={summaryLineStyle}>
                    <span>Tiền hàng</span>
                    <strong>
                      {formatCurrency(
                        selectedOrder.tong_tien_hang ||
                          selectedOrder.tam_tinh ||
                          getOrderTotal(selectedOrder),
                      )}
                    </strong>
                  </div>

                  <div style={summaryLineStyle}>
                    <span>Phí vận chuyển</span>
                    <strong>
                      {formatCurrency(selectedOrder.phi_van_chuyen)}
                    </strong>
                  </div>

                  {getOrderDiscount(selectedOrder) > 0 && (
                    <div style={summaryLineStyle}>
                      <span>Voucher giảm</span>
                      <strong style={{ color: "#cf1322" }}>
                        -{formatCurrency(getOrderDiscount(selectedOrder))}
                      </strong>
                    </div>
                  )}

                  <div
                    style={{
                      ...summaryLineStyle,
                      borderTop: "1px solid #eaecf0",
                      paddingTop: "10px",
                      marginTop: "10px",
                      color: "#2e7d32",
                      fontSize: "16px",
                    }}
                  >
                    <span>Tổng thanh toán</span>
                    <strong>
                      {formatCurrency(getOrderTotal(selectedOrder))}
                    </strong>
                  </div>
                </div>

                {selectedOrder.ghi_chu && (
                  <div style={{ marginTop: "18px" }}>
                    <strong>Ghi chú:</strong>
                    <p style={{ color: "#667085" }}>{selectedOrder.ghi_chu}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: "18px",
        borderRadius: "12px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
      }}
    >
      <p style={{ margin: 0, color: "#667085" }}>{title}</p>
      <h2 style={{ margin: "8px 0 0", color: "#1c3f3a" }}>{value}</h2>
    </div>
  );
}

function StatusBadge({ status }) {
  const style = STATUS_STYLE[status] || {
    backgroundColor: "#f2f4f7",
    color: "#344054",
  };

  return (
    <span
      style={{
        padding: "5px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 700,
        ...style,
      }}
    >
      {STATUS_LABEL[status] || status || "Không rõ"}
    </span>
  );
}

function InfoBox({ label, value }) {
  return (
    <div
      style={{
        backgroundColor: "#f8fafc",
        border: "1px solid #eaecf0",
        borderRadius: "10px",
        padding: "12px",
      }}
    >
      <p style={{ margin: 0, color: "#667085", fontSize: "13px" }}>{label}</p>
      <strong style={{ display: "block", marginTop: "6px", color: "#1c3f3a" }}>
        {value}
      </strong>
    </div>
  );
}

const thStyle = {
  padding: "12px",
  fontSize: "13px",
  fontWeight: 700,
};

const tdStyle = {
  padding: "12px",
  verticalAlign: "middle",
};

const emptyStyle = {
  padding: "28px",
  textAlign: "center",
  color: "#667085",
};

const buttonOutlineStyle = {
  padding: "8px 12px",
  borderRadius: "8px",
  border: "1px solid #1c3f3a",
  backgroundColor: "#fff",
  color: "#1c3f3a",
  fontWeight: 700,
  cursor: "pointer",
};

const buttonDangerStyle = {
  padding: "8px 12px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#ff4d4f",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

const paginationButtonStyle = {
  padding: "8px 14px",
  borderRadius: "8px",
  border: "1px solid #d0d5dd",
  backgroundColor: "#fff",
};

const summaryLineStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "8px",
};

export default Orders;
