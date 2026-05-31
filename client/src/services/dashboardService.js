import apiClient from "./apiClient";

const dashboardService = {
  // Lấy tổng quan số liệu (Tổng doanh thu, tổng đơn, tổng số tranh đã bán)
  layThongKeTongQuan: async () => {
    try {
      const response = await apiClient.get("/admin/dashboard/tong-quan");
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Lấy số liệu tổng quan thất bại" };
    }
  },

  // Lấy dữ liệu doanh thu theo tháng/ngày để vẽ biểu đồ
  layBaoCaoDoanhThu: async (thang, nam) => {
    try {
      const response = await apiClient.get("/admin/dashboard/doanh-thu", { params: { thang, nam } });
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Lấy báo cáo doanh thu thất bại" };
    }
  }
};

export default dashboardService;