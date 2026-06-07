import apiClient from "./apiClient";

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

  // Dạng MySQL DATETIME: 2026-06-06 15:30:20
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

  // Dạng MySQL DATE: 2026-06-06
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

  // Dạng Việt Nam: 06/06/2026 hoặc 06/06/2026 15:30:20
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

function normalizeOrderDeliveryFields(order) {
  if (!order || typeof order !== "object") return order;

  const ngayDat = getOrderDateValue(order);
  const ngayGiaoDuKien = getExpectedDeliveryDateValue(order);
  const ngayGiaoThuc = getActualDeliveryDateValue(order);

  return {
    ...order,

    // Giữ cả snake_case và camelCase để component nào cũng đọc được.
    ngay_dat: order.ngay_dat || ngayDat,
    ngayDat: order.ngayDat || ngayDat,

    ngay_giao_du_kien: order.ngay_giao_du_kien || ngayGiaoDuKien,
    ngayGiaoDuKien: order.ngayGiaoDuKien || ngayGiaoDuKien,

    ngay_giao_thuc: order.ngay_giao_thuc || ngayGiaoThuc,
    ngayGiaoThuc: order.ngayGiaoThuc || ngayGiaoThuc,
  };
}

function normalizeOrderArray(list) {
  if (!Array.isArray(list)) return list;

  return list.map(normalizeOrderDeliveryFields);
}

function getOrderTimestamp(order) {
  const date = parseOrderDate(getOrderDateValue(order));

  // Đơn không có ngày đặt cho xuống cuối.
  return date ? date.getTime() : -Infinity;
}

function getOrderId(order) {
  const directId = Number(order?.id);

  if (!Number.isNaN(directId) && directId > 0) return directId;

  const maDonHang = String(order?.ma_don_hang || order?.maDonHang || "");
  const idFromCode = Number(maDonHang.replace(/[^\d]/g, ""));

  return Number.isNaN(idFromCode) ? 0 : idFromCode;
}

function sortOrdersNewestFirst(list) {
  if (!Array.isArray(list)) return list;

  return normalizeOrderArray(list).sort((a, b) => {
    const timeDiff = getOrderTimestamp(b) - getOrderTimestamp(a);

    if (timeDiff !== 0) return timeDiff;

    return getOrderId(b) - getOrderId(a);
  });
}

function sortOrderResponse(responseData) {
  if (!responseData) return responseData;

  // Trường hợp API trả thẳng array.
  if (Array.isArray(responseData)) {
    return sortOrdersNewestFirst(responseData);
  }

  const cloned = {
    ...responseData,
    data:
      responseData.data && typeof responseData.data === "object"
        ? Array.isArray(responseData.data)
          ? [...responseData.data]
          : { ...responseData.data }
        : responseData.data,
  };

  // Trường hợp response.data là array.
  if (Array.isArray(cloned.data)) {
    cloned.data = sortOrdersNewestFirst(cloned.data);
  }

  // Trường hợp response.data có danh sách bên trong.
  if (cloned.data && typeof cloned.data === "object") {
    const dataListKeys = [
      "danh_sach",
      "orders",
      "don_hang",
      "donHangs",
      "rows",
      "items",
      "data",
    ];

    dataListKeys.forEach((key) => {
      if (Array.isArray(cloned.data[key])) {
        cloned.data[key] = sortOrdersNewestFirst(cloned.data[key]);
      }
    });
  }

  // Trường hợp danh sách nằm ở root response.
  const rootListKeys = ["orders", "don_hang", "donHangs", "rows", "items"];

  rootListKeys.forEach((key) => {
    if (Array.isArray(cloned[key])) {
      cloned[key] = sortOrdersNewestFirst(cloned[key]);
    }
  });

  return cloned;
}

function buildNewestOrderParams(params = {}) {
  return {
    ...params,

    // Gửi nhiều kiểu tên để backend nào cũng dễ nhận.
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
}

const donHangService = {
  // ================= KHÁCH HÀNG =================

  capNhatThongTinGiaoHangCuaToi: async (id, data) => {
    try {
      const response = await apiClient.put(
        `/don-hang/cap-nhat-thong-tin-giao-hang/${id}`,
        data,
      );

      return {
        ...response.data,
        data: normalizeOrderDeliveryFields(response.data?.data),
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error ||
          "Cập nhật thông tin giao hàng thất bại",
      };
    }
  },

  taoDonHang: async (donHangData) => {
    try {
      const response = await apiClient.post("/don-hang/them", donHangData);

      return {
        ...response.data,
        data: normalizeOrderDeliveryFields(response.data?.data),
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Tạo đơn hàng thất bại",
      };
    }
  },

  xemDonCuaToi: async (params = {}) => {
    try {
      const response = await apiClient.get("/don-hang/cua-toi", {
        params: buildNewestOrderParams(params),
      });

      return sortOrderResponse(response.data);
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Lấy đơn hàng thất bại",
      };
    }
  },

  xemChiTietDonCuaToi: async (id) => {
    try {
      const response = await apiClient.get(`/don-hang/chi-tiet/${id}`);

      return {
        ...response.data,
        data: normalizeOrderDeliveryFields(response.data?.data),
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Lấy chi tiết đơn hàng thất bại",
      };
    }
  },

  huyDonCuaToi: async (id) => {
    try {
      const response = await apiClient.put(`/don-hang/huy/${id}`, {});

      return {
        ...response.data,
        data: normalizeOrderDeliveryFields(response.data?.data),
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Hủy đơn hàng thất bại",
      };
    }
  },

  // ================= NHÂN VIÊN / QUẢN LÝ =================

  xemTatCaDonHang: async (params = {}) => {
    try {
      const response = await apiClient.get("/don-hang", {
        params: buildNewestOrderParams(params),
      });

      return sortOrderResponse(response.data);
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Lấy danh sách đơn hàng thất bại",
      };
    }
  },

  xemChiTietDonBatKy: async (id) => {
    try {
      const response = await apiClient.get(`/don-hang/${id}`);

      return {
        ...response.data,
        data: normalizeOrderDeliveryFields(response.data?.data),
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Lấy chi tiết đơn hàng thất bại",
      };
    }
  },

  capNhatTrangThaiDon: async (id, trang_thai) => {
    try {
      const response = await apiClient.put(`/don-hang/${id}/trang-thai`, {
        trang_thai,
      });

      return {
        ...response.data,
        data: normalizeOrderDeliveryFields(response.data?.data),
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Cập nhật trạng thái thất bại",
      };
    }
  },

  huyDonBatKy: async (id) => {
    try {
      const response = await apiClient.put(`/don-hang/${id}/huy`, {});

      return {
        ...response.data,
        data: normalizeOrderDeliveryFields(response.data?.data),
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Hủy đơn hàng thất bại",
      };
    }
  },
};

export default donHangService;