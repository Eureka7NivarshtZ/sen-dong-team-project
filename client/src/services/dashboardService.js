import apiClient from "./apiClient";

const dashboardService = {
  layThongKeTongQuan: async () => {
    try {
      const response = await apiClient.get("/admin/dashboard/tong-quan");
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Lấy số liệu tổng quan thất bại" };
    }
  },

  layBaoCaoDoanhThu: async (params = {}) => {
    try {
      // params có thể truyền { tu_ngay, den_ngay } hoặc { thang, nam } tùy Backend của bạn
      const response = await apiClient.get("/admin/dashboard/doanh-thu", { params });
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Lấy báo cáo doanh thu thất bại" };
    }
  }
};

export default dashboardService;