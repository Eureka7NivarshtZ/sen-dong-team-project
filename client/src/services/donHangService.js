import apiClient from "./apiClient";

const donHangService = {
  // ================= KHÁCH HÀNG =================
  capNhatThongTinGiaoHangCuaToi: async (id, data) => {
    try {
      const response = await apiClient.put(
        `/don-hang/cap-nhat-thong-tin-giao-hang/${id}`,
        data,
      );
      return response.data;
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
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Tạo đơn hàng thất bại",
      };
    }
  },

  xemDonCuaToi: async () => {
    try {
      const response = await apiClient.get("/don-hang/cua-toi");
      return response.data;
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
      return response.data;
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
      return response.data;
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
      const response = await apiClient.get("/don-hang", { params });
      return response.data;
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
      return response.data;
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
      return response.data;
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
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Hủy đơn hàng thất bại",
      };
    }
  },
};

export default donHangService;
