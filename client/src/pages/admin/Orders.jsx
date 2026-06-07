import { useEffect, useMemo, useState } from "react";
import Topbar from "../../components/admin/Topbar";
import donHangService from "../../services/donHangService";
import { dashboardService } from "../../services";

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
  return parseMoney(value).toLocaleString("vi-VN") + " đ";
}

function parseOrderDate(value) {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === "number") {
    const timestamp = value < 10000000000 ? value * 1000 : value;
    const date = new Date(timestamp);

    return Number.isNaN(date.getTime()) ? null : date;
  }

  const text = String(value).trim();

  if (!text) return null;

  // MySQL DATETIME: 2026-06-06 15:30:20
  const mysqlDateTimeMatch = text.match(
    /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/,
  );

  if (mysqlDateTimeMatch) {
    const [, year, month, day, hour, minute, second = "0"] =
      mysqlDateTimeMatch;

    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second),
    );

    return Number.isNaN(date.getTime()) ? null : date;
  }

  // MySQL DATE: 2026-06-06
  const mysqlDateMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (mysqlDateMatch) {
    const [, year, month, day] = mysqlDateMatch;

    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      0,
      0,
      0,
    );

    return Number.isNaN(date.getTime()) ? null : date;
  }

  // Việt Nam: 06/06/2026 hoặc 06/06/2026 15:30:20
  const vietnameseDateMatch = text.match(
    /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/,
  );

  if (vietnameseDateMatch) {
    const [, day, month, year, hour = "0", minute = "0", second = "0"] =
      vietnameseDateMatch;

    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second),
    );

    return Number.isNaN(date.getTime()) ? null : date;
  }

  const normalizedText = text.replace(" ", "T");
  const date = new Date(normalizedText);

  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDateTime(value) {
  const date = parseOrderDate(value);

  if (!date) return "-";

  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatDateOnly(value) {
  const date = parseOrderDate(value);

  if (!date) return "-";

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function normalizeStatus(status) {
  if (!status) return "";

  const text = String(status).trim();
  const lower = text.toLowerCase();

  if (
    [
      "cho_xac_nhan",
      "chờ xác nhận",
      "cho xac nhan",
      "pending",
      "wait_confirm",
    ].includes(lower)
  ) {
    return "cho_xac_nhan";
  }

  if (
    [
      "dang_chuan_bi",
      "dang_xu_ly",
      "đang chuẩn bị",
      "đang xử lý",
      "dang xu ly",
      "processing",
    ].includes(lower)
  ) {
    return "dang_chuan_bi";
  }

  if (
    ["dang_giao", "đang giao", "dang giao", "shipping", "delivering"].includes(
      lower,
    )
  ) {
    return "dang_giao";
  }

  if (
    [
      "hoan_thanh",
      "da_tra_loi",
      "hoàn thành",
      "hoan thanh",
      "completed",
      "complete",
      "done",
    ].includes(lower)
  ) {
    return "hoan_thanh";
  }

  if (
    [
      "huy",
      "da_huy",
      "bi_huy",
      "đã hủy",
      "hủy",
      "da huy",
      "cancelled",
      "canceled",
    ].includes(lower)
  ) {
    return "huy";
  }

  return text;
}

function getStatusLabel(status) {
  const normalizedStatus = normalizeStatus(status);

  return STATUS_LABEL[normalizedStatus] || status || "Không rõ";
}

function getOrderDateValue(order) {
  return (
    order?.ngay_dat ||
    order?.ngayDat ||
    order?.NgayDat ||
    order?.created_at ||
    order?.createdAt ||
    order?.ngay_tao ||
    order?.ngayTao ||
    order?.thoi_gian_dat ||
    order?.thoiGianDat ||
    order?.order_date ||
    order?.date ||
    null
  );
}

function getExpectedDeliveryDateValue(order) {
  return (
    order?.ngay_giao_du_kien ||
    order?.ngayGiaoDuKien ||
    order?.ngay_giao_du_kien_text ||
    order?.expected_delivery_date ||
    order?.expectedDeliveryDate ||
    order?.delivery_date ||
    order?.deliveryDate ||
    null
  );
}

function getActualDeliveryDateValue(order) {
  return (
    order?.ngay_giao_thuc ||
    order?.ngayGiaoThuc ||
    order?.ngay_giao_thuc_te ||
    order?.actual_delivery_date ||
    order?.actualDeliveryDate ||
    null
  );
}

function getDeliveryDateDisplay(order) {
  const actualDate = getActualDeliveryDateValue(order);
  const expectedDate = getExpectedDeliveryDateValue(order);

  if (actualDate) {
    return `Đã giao: ${formatDateOnly(actualDate)}`;
  }

  if (expectedDate) {
    return `Dự kiến: ${formatDateOnly(expectedDate)}`;
  }

  return "-";
}

function getOrderTimestamp(order) {
  const date = parseOrderDate(getOrderDateValue(order));

  return date ? date.getTime() : null;
}

function getOrderIdValue(order) {
  const directId = Number(order?.id);

  if (!Number.isNaN(directId) && directId > 0) return directId;

  const maDonHang = String(order?.ma_don_hang || order?.maDonHang || "");
  const idFromCode = Number(maDonHang.replace(/[^\d]/g, ""));

  return Number.isNaN(idFromCode) ? 0 : idFromCode;
}

function sortOrdersNewestFirst(list) {
  return [...(list || [])].sort((a, b) => {
    const timeA = getOrderTimestamp(a);
    const timeB = getOrderTimestamp(b);

    if (timeA !== null && timeB !== null && timeA !== timeB) {
      return timeB - timeA;
    }

    return getOrderIdValue(b) - getOrderIdValue(a);
  });
}

function getOrderUniqueKey(order, index = 0) {
  if (order?.id !== undefined && order?.id !== null) {
    return `id-${order.id}`;
  }

  if (order?.ma_don_hang) {
    return `ma-${order.ma_don_hang}`;
  }

  if (order?.maDonHang) {
    return `ma-${order.maDonHang}`;
  }

  return `unknown-${index}`;
}

function mergeOrders(...orderGroups) {
  const map = new Map();

  orderGroups.flat().forEach((order, index) => {
    if (!order || typeof order !== "object") return;

    const key = getOrderUniqueKey(order, index);
    const oldOrder = map.get(key);

    map.set(key, oldOrder ? { ...oldOrder, ...order } : order);
  });

  return sortOrdersNewestFirst(Array.from(map.values()));
}

function getCustomerName(order) {
  return (
    order?.ten_nguoi_nhan ||
    order?.tenNguoiNhan ||
    order?.khach_hang?.ho_ten ||
    order?.khach_hang?.ten ||
    order?.khach_hang?.ten_khach_hang ||
    order?.khach_hang?.tai_khoan?.ho_ten ||
    order?.khach_hang?.email ||
    order?.nguoi_dung?.ho_ten ||
    order?.user?.ho_ten ||
    order?.user?.name ||
    "Khách hàng"
  );
}

function getOrderAddress(order) {
  return (
    order?.dia_chi_giao ||
    order?.dia_chi_giao_hang ||
    order?.diaChiGiao ||
    order?.diaChiGiaoHang ||
    order?.dia_chi_nhan_hang ||
    order?.dia_chi ||
    order?.address ||
    "-"
  );
}

function getOrderPhone(order) {
  return (
    order?.sdt_nguoi_nhan ||
    order?.so_dien_thoai ||
    order?.phone ||
    order?.khach_hang?.so_dien_thoai ||
    order?.khach_hang?.sdt ||
    "-"
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

  if (order?.tongThanhToan !== undefined && order?.tongThanhToan !== null) {
    return parseMoney(order.tongThanhToan);
  }

  if (order?.thanh_tien !== undefined && order?.thanh_tien !== null) {
    return parseMoney(order.thanh_tien);
  }

  if (order?.thanhTien !== undefined && order?.thanhTien !== null) {
    return parseMoney(order.thanhTien);
  }

  if (order?.tong_tien !== undefined && order?.tong_tien !== null) {
    return parseMoney(order.tong_tien);
  }

  if (order?.tongTien !== undefined && order?.tongTien !== null) {
    return parseMoney(order.tongTien);
  }

  const tongTienHang = parseMoney(order?.tong_tien_hang || order?.tam_tinh);
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

function extractOrderList(result) {
  const data = result?.data;

  const possibleLists = [
    result,
    data,
    data?.danh_sach,
    data?.orders,
    data?.don_hang,
    data?.donHangs,
    data?.rows,
    data?.items,
    data?.data,
    data?.data?.rows,
    data?.data?.items,
    data?.data?.orders,
    result?.orders,
    result?.don_hang,
    result?.rows,
    result?.items,
  ];

  return possibleLists.find((item) => Array.isArray(item)) || [];
}

function normalizeOrderListResponse(result) {
  return sortOrdersNewestFirst(extractOrderList(result));
}

function isOrderMatchSearch(order, searchText) {
  const keyword = searchText.trim().toLowerCase();

  if (!keyword) return true;

  const searchableValues = [
    order?.id,
    order?.ma_don_hang,
    order?.maDonHang,
    getCustomerName(order),
    getOrderAddress(order),
    getOrderPhone(order),
    order?.khach_hang?.email,
    order?.user?.email,
  ];

  return searchableValues.some((value) =>
    String(value || "")
      .toLowerCase()
      .includes(keyword),
  );
}

function isOrderMatchStatus(order, filterStatus) {
  if (!filterStatus) return true;

  return normalizeStatus(order?.trang_thai) === filterStatus;
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const params = {
        page: 1,
        limit: 1000,
        per_page: 1000,
        pageSize: 1000,
        page_size: 1000,
        size: 1000,
        all: true,
        no_pagination: true,
        sort_by: "ngay_dat",
        sort_order: "desc",
        order_by: "ngay_dat",
        order: "desc",
        sortBy: "ngay_dat",
        sortOrder: "DESC",
        sort: "ngay_dat:desc",
        _sort: "ngay_dat",
        _order: "desc",
      };

      const allOrdersRequest = donHangService.xemTatCaDonHang(params);

      const recentOrdersRequest = dashboardService?.layDonHangGanDay
        ? dashboardService.layDonHangGanDay()
        : Promise.resolve({ success: false, data: [] });

      const [allOrdersResult, recentOrdersResult] = await Promise.allSettled([
        allOrdersRequest,
        recentOrdersRequest,
      ]);

      let allOrders = [];
      let recentOrders = [];

      if (allOrdersResult.status === "fulfilled") {
        console.log("Kết quả lấy tất cả đơn hàng:", allOrdersResult.value);

        if (allOrdersResult.value?.success !== false) {
          allOrders = normalizeOrderListResponse(allOrdersResult.value);
        } else {
          setError(
            allOrdersResult.value?.error ||
              allOrdersResult.value?.message ||
              "Không thể tải danh sách đơn hàng",
          );
        }
      } else {
        console.error("Lỗi API xemTatCaDonHang:", allOrdersResult.reason);
        setError("Không thể tải danh sách đơn hàng");
      }

      if (recentOrdersResult.status === "fulfilled") {
        console.log("Kết quả lấy đơn hàng gần đây:", recentOrdersResult.value);

        if (recentOrdersResult.value?.success !== false) {
          recentOrders = normalizeOrderListResponse(recentOrdersResult.value);
        }
      } else {
        console.warn(
          "Không lấy được API đơn gần đây:",
          recentOrdersResult.reason,
        );
      }

      setOrders(mergeOrders(allOrders, recentOrders));
    } catch (err) {
      console.error("Lỗi fetchOrders:", err);
      setOrders([]);
      setError("Có lỗi khi tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const displayOrders = useMemo(() => {
    return sortOrdersNewestFirst(orders)
      .filter((order) => isOrderMatchStatus(order, filterStatus))
      .filter((order) => isOrderMatchSearch(order, search));
  }, [orders, filterStatus, search]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
  };

  const handleViewDetail = async (id) => {
    if (!id) {
      alert("Không tìm thấy ID đơn hàng");
      return;
    }

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
    const currentStatus = normalizeStatus(order.trang_thai);

    if (!nextStatus || nextStatus === currentStatus) return;

    const confirmMessage = `Cập nhật đơn ${
      order.ma_don_hang || order.maDonHang || order.id
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

        await fetchOrders();

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
    const currentStatus = normalizeStatus(order.trang_thai);

    if (!["cho_xac_nhan", "dang_chuan_bi"].includes(currentStatus)) {
      alert("Chỉ có thể hủy đơn ở trạng thái Chờ xác nhận hoặc Đang chuẩn bị");
      return;
    }

    if (
      !window.confirm(
        `Bạn có chắc muốn hủy đơn ${
          order.ma_don_hang || order.maDonHang || order.id
        }?`,
      )
    ) {
      return;
    }

    setActionLoading(true);

    try {
      const result = await donHangService.huyDonBatKy(order.id);

      if (result?.success) {
        alert("Hủy đơn hàng thành công");

        await fetchOrders();

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
    <div className="dashboard-content" style={pageWrapperStyle}>
      <Topbar />

      <div style={pageContentStyle}>
        <div style={pageHeaderStyle}>
          <h1 style={pageTitleStyle}>Danh sách đơn hàng xưởng vẽ</h1>

          <form onSubmit={handleSearchSubmit} style={toolbarStyle}>
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={searchInputStyle}
            />

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={statusFilterStyle}
            >
              {TRANG_THAI_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={fetchOrders}
              disabled={loading}
              style={{
                ...refreshButtonStyle,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Đang tải..." : "Làm mới"}
            </button>
          </form>
        </div>

        {error && <div style={errorBoxStyle}>{error}</div>}

        <div style={tableCardStyle}>
          <div style={tableInfoStyle}>
            Đang hiển thị <strong>{displayOrders.length}</strong> đơn.
          </div>

          <div style={tableResponsiveStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, width: "12%" }}>Mã đơn</th>
                  <th style={{ ...thStyle, width: "15%" }}>Khách hàng</th>
                  <th style={{ ...thStyle, width: "16%" }}>Địa chỉ</th>
                  <th style={{ ...thStyle, width: "12%" }}>Ngày đặt</th>
                  <th style={{ ...thStyle, width: "13%" }}>Ngày giao</th>
                  <th style={{ ...thStyle, width: "12%" }}>Tổng tiền</th>
                  <th style={{ ...thStyle, width: "11%" }}>Trạng thái</th>
                  <th style={{ ...thStyle, width: "9%" }}>Hành động</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" style={emptyStyle}>
                      Đang tải đơn hàng...
                    </td>
                  </tr>
                ) : displayOrders.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={emptyStyle}>
                      Không có đơn hàng nào.
                    </td>
                  </tr>
                ) : (
                  displayOrders.map((order, index) => {
                    const currentStatus = normalizeStatus(order.trang_thai);
                    const canCancel = [
                      "cho_xac_nhan",
                      "dang_chuan_bi",
                    ].includes(currentStatus);

                    return (
                      <tr key={getOrderUniqueKey(order, index)}>
                        <td style={tdStyle}>
                          <strong style={orderCodeStyle}>
                            {order.ma_don_hang ||
                              order.maDonHang ||
                              `DH-${order.id || index + 1}`}
                          </strong>
                        </td>

                        <td style={tdStyle}>
                          <div style={customerNameStyle}>
                            {getCustomerName(order)}
                          </div>
                          <div style={customerPhoneStyle}>
                            {getOrderPhone(order)}
                          </div>
                        </td>

                        <td style={tdStyle}>
                          <div
                            style={ellipsisStyle}
                            title={getOrderAddress(order)}
                          >
                            {getOrderAddress(order)}
                          </div>
                        </td>

                        <td style={tdStyle}>
                          {formatDateTime(getOrderDateValue(order))}
                        </td>

                        <td style={tdStyle}>
                          <span style={deliveryDateStyle}>
                            {getDeliveryDateDisplay(order)}
                          </span>
                        </td>

                        <td style={tdStyle}>
                          <strong style={moneyStyle}>
                            {formatCurrency(getOrderTotal(order))}
                          </strong>
                        </td>

                        <td style={tdStyle}>
                          <StatusBadge status={order.trang_thai} />

                          <select
                            value={currentStatus || ""}
                            disabled={actionLoading || currentStatus === "huy"}
                            onChange={(e) =>
                              handleChangeStatus(order, e.target.value)
                            }
                            style={miniSelectStyle}
                          >
                            {TRANG_THAI_OPTIONS.filter(
                              (item) => item.value,
                            ).map((item) => (
                              <option key={item.value} value={item.value}>
                                {item.label}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td style={tdStyle}>
                          <div style={actionGroupStyle}>
                            <button
                              onClick={() => handleViewDetail(order.id)}
                              disabled={!order.id}
                              style={{
                                ...detailButtonStyle,
                                opacity: order.id ? 1 : 0.5,
                              }}
                            >
                              Chi tiết
                            </button>

                            <button
                              onClick={() => handleCancelOrder(order)}
                              disabled={
                                actionLoading || !canCancel || !order.id
                              }
                              style={{
                                ...cancelButtonStyle,
                                opacity: canCancel && order.id ? 1 : 0.5,
                              }}
                            >
                              Hủy
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {(selectedOrder || detailLoading) && (
        <div style={modalOverlayStyle}>
          <div style={modalBoxStyle}>
            {detailLoading ? (
              <p>Đang tải chi tiết đơn hàng...</p>
            ) : (
              <>
                <div style={modalHeaderStyle}>
                  <div>
                    <h2 style={modalTitleStyle}>Chi tiết đơn hàng</h2>

                    <p style={modalSubtitleStyle}>
                      {selectedOrder.ma_don_hang ||
                        selectedOrder.maDonHang ||
                        `DH-${selectedOrder.id}`}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedOrder(null)}
                    style={closeButtonStyle}
                  >
                    Đóng
                  </button>
                </div>

                <div style={infoGridStyle}>
                  <InfoBox
                    label="Khách hàng"
                    value={getCustomerName(selectedOrder)}
                  />

                  <InfoBox
                    label="Ngày đặt"
                    value={formatDateTime(getOrderDateValue(selectedOrder))}
                  />

                  <InfoBox
                    label="Ngày giao dự kiến"
                    value={formatDateOnly(
                      getExpectedDeliveryDateValue(selectedOrder),
                    )}
                  />

                  <InfoBox
                    label="Ngày giao thực tế"
                    value={formatDateOnly(
                      getActualDeliveryDateValue(selectedOrder),
                    )}
                  />

                  <InfoBox
                    label="Địa chỉ giao"
                    value={getOrderAddress(selectedOrder)}
                  />

                  <InfoBox
                    label="Số điện thoại"
                    value={getOrderPhone(selectedOrder)}
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
                    value={getStatusLabel(selectedOrder.trang_thai)}
                  />

                  <InfoBox
                    label="Tổng tiền"
                    value={formatCurrency(getOrderTotal(selectedOrder))}
                  />
                </div>

                <h3 style={sectionTitleStyle}>Sản phẩm trong đơn</h3>

                <table style={detailTableStyle}>
                  <thead>
                    <tr>
                      <th style={detailThStyle}>Tranh</th>
                      <th style={detailThStyle}>Số lượng</th>
                      <th style={detailThStyle}>Đơn giá</th>
                      <th style={detailThStyle}>Thành tiền</th>
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
                          <tr key={item.id || index}>
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

                <div style={summaryBoxStyle}>
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

                  <div style={summaryTotalLineStyle}>
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

function StatusBadge({ status }) {
  const normalizedStatus = normalizeStatus(status);

  const style = STATUS_STYLE[normalizedStatus] || {
    backgroundColor: "#f2f4f7",
    color: "#344054",
  };

  return (
    <span
      style={{
        padding: "6px 11px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 700,
        display: "inline-block",
        marginBottom: "8px",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {getStatusLabel(status)}
    </span>
  );
}

function InfoBox({ label, value }) {
  return (
    <div style={infoBoxStyle}>
      <p style={infoLabelStyle}>{label}</p>
      <strong style={infoValueStyle}>{value || "-"}</strong>
    </div>
  );
}

const pageWrapperStyle = {
  flex: 1,
  backgroundColor: "#f6f7f8",
  minHeight: "100vh",
  overflowX: "hidden",
};

const pageContentStyle = {
  padding: "40px",
  textAlign: "left",
};

const pageHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  marginBottom: "32px",
};

const pageTitleStyle = {
  margin: 0,
  color: "#123c35",
  fontSize: "30px",
  fontWeight: "bold",
};

const toolbarStyle = {
  display: "flex",
  gap: "12px",
  alignItems: "center",
};

const searchInputStyle = {
  width: "260px",
  padding: "12px 16px",
  borderRadius: "6px",
  border: "1px solid #d0d5dd",
  fontSize: "15px",
  outline: "none",
  backgroundColor: "#fff",
};

const statusFilterStyle = {
  width: "190px",
  padding: "12px 14px",
  borderRadius: "6px",
  border: "1px solid #d0d5dd",
  fontSize: "15px",
  backgroundColor: "#fff",
};

const refreshButtonStyle = {
  padding: "12px 24px",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#123c35",
  color: "#fff",
  fontWeight: "bold",
  fontSize: "15px",
};

const errorBoxStyle = {
  backgroundColor: "#fff1f0",
  color: "#cf1322",
  padding: "12px 14px",
  borderRadius: "8px",
  marginBottom: "16px",
};

const tableCardStyle = {
  backgroundColor: "#fff",
  borderRadius: "10px",
  padding: "28px",
  boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
};

const tableInfoStyle = {
  color: "#667085",
  marginBottom: "18px",
  fontSize: "15px",
};

const tableResponsiveStyle = {
  width: "100%",
  overflowX: "auto",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  tableLayout: "fixed",
};

const thStyle = {
  padding: "14px 12px",
  textAlign: "left",
  color: "#4a5568",
  fontSize: "15px",
  fontWeight: "bold",
  borderBottom: "2px solid #edf2f7",
};

const tdStyle = {
  padding: "16px 12px",
  verticalAlign: "middle",
  borderBottom: "1px solid #edf2f7",
  color: "#1f2937",
  fontSize: "14px",
};

const orderCodeStyle = {
  color: "#123c35",
  wordBreak: "break-word",
};

const customerNameStyle = {
  fontWeight: "bold",
  color: "#1f2937",
  lineHeight: 1.35,
};

const customerPhoneStyle = {
  marginTop: "4px",
  color: "#98a2b3",
  fontSize: "13px",
};

const ellipsisStyle = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  color: "#667085",
};

const deliveryDateStyle = {
  display: "inline-block",
  color: "#475467",
  fontSize: "13px",
  lineHeight: 1.35,
};

const moneyStyle = {
  color: "#16803c",
  fontWeight: "bold",
  wordBreak: "break-word",
};

const miniSelectStyle = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: "6px",
  border: "1px solid #d0d5dd",
  backgroundColor: "#fff",
  fontSize: "14px",
};

const actionGroupStyle = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
};

const detailButtonStyle = {
  padding: "8px 12px",
  borderRadius: "6px",
  border: "1px solid #123c35",
  backgroundColor: "#fff",
  color: "#123c35",
  fontWeight: "bold",
  cursor: "pointer",
};

const cancelButtonStyle = {
  padding: "8px 12px",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#ff4d4f",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer",
};

const emptyStyle = {
  padding: "28px",
  textAlign: "center",
  color: "#667085",
};

const modalOverlayStyle = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2000,
  padding: "20px",
};

const modalBoxStyle = {
  width: "820px",
  maxWidth: "100%",
  maxHeight: "90vh",
  overflowY: "auto",
  backgroundColor: "#fff",
  borderRadius: "12px",
  padding: "24px",
};

const modalHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  alignItems: "flex-start",
  marginBottom: "18px",
};

const modalTitleStyle = {
  margin: 0,
  color: "#123c35",
};

const modalSubtitleStyle = {
  margin: "6px 0 0",
  color: "#667085",
};

const closeButtonStyle = {
  border: "none",
  backgroundColor: "#f2f4f7",
  color: "#344054",
  borderRadius: "8px",
  padding: "8px 12px",
  cursor: "pointer",
  fontWeight: "bold",
};

const infoGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
  marginBottom: "18px",
};

const infoBoxStyle = {
  backgroundColor: "#f8fafc",
  border: "1px solid #eaecf0",
  borderRadius: "10px",
  padding: "12px",
};

const infoLabelStyle = {
  margin: 0,
  color: "#667085",
  fontSize: "13px",
};

const infoValueStyle = {
  display: "block",
  marginTop: "6px",
  color: "#123c35",
};

const sectionTitleStyle = {
  color: "#123c35",
  margin: "18px 0 12px",
};

const detailTableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  border: "1px solid #eaecf0",
};

const detailThStyle = {
  padding: "12px",
  textAlign: "left",
  backgroundColor: "#f8fafc",
  fontSize: "13px",
  color: "#475467",
};

const summaryBoxStyle = {
  marginTop: "18px",
  backgroundColor: "#f8fafc",
  border: "1px solid #eaecf0",
  borderRadius: "10px",
  padding: "14px",
};

const summaryLineStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "8px",
};

const summaryTotalLineStyle = {
  ...summaryLineStyle,
  borderTop: "1px solid #eaecf0",
  paddingTop: "10px",
  marginTop: "10px",
  color: "#16803c",
  fontSize: "16px",
  fontWeight: "bold",
};

export default Orders;