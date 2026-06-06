import apiClient from "./apiClient";

const dashboardService = {
  // ========== DASHBOARD ENDPOINTS ==========

  layDashboardTongQuan: async () => {
    try {
      const response = await apiClient.get("/dashboard");
      return response.data;
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error ||
          "Lấy thông tin dashboard thất bại",
      };
    }
  },

  layDonHangGanDay: async () => {
    try {
      const response = await apiClient.get("/dashboard/don-hang-gan-day");
      return response.data;
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error ||
          "Lấy đơn hàng gần đây thất bại",
      };
    }
  },

  layDoanhThuTheoThang: async (nam = null) => {
    try {
      const params = nam ? { nam } : {};
      const response = await apiClient.get("/dashboard/doanh-thu-theo-thang", {
        params,
      });

      return response.data;
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error ||
          "Lấy doanh thu theo tháng thất bại",
      };
    }
  },

  // ========== KHÁCH HÀNG / NHÂN VIÊN MANAGEMENT ==========

  layTatCaKhachHang: async (params = {}) => {
    try {
      const response = await apiClient.get("/admin/khach-hang", { params });
      return response.data;
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error ||
          "Lấy danh sách khách hàng thất bại",
      };
    }
  },
};

export default dashboardService;