import apiClient from "./apiClient";

// Service xử lý các API liên quan đến Đánh giá
const danhGiaService = {
  // Xem đánh giá công khai theo tranh
  xemDanhGiaTheoTranh: async (tranhId) => {
    try {
      const response = await apiClient.get(`/danh-gia/tranh/${tranhId}`);

      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Lấy đánh giá sản phẩm thất bại",
      };
    }
  },

  // Khách hàng tạo đánh giá
  taoDanhGia: async ({
    tranh_id,
    don_hang_id,
    so_sao,
    noi_dung = "",
    hinh_anh_url = "",
  }) => {
    try {
      const response = await apiClient.post("/danh-gia", {
        tranh_id,
        don_hang_id,
        so_sao,
        noi_dung,
        hinh_anh_url,
      });

      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Gửi đánh giá thất bại",
      };
    }
  },

  // Xem đánh giá của tôi
  xemDanhGiaCuaToi: async () => {
    try {
      const response = await apiClient.get("/danh-gia/cua-toi");

      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Lấy đánh giá của tôi thất bại",
      };
    }
  },

  // Quản lý xem tất cả đánh giá
  adminXemTatCaDanhGia: async (trang_thai = "") => {
    try {
      const response = await apiClient.get("/danh-gia", {
        params: trang_thai ? { trang_thai } : {},
      });

      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Lấy danh sách đánh giá thất bại",
      };
    }
  },

  // Quản lý cập nhật trạng thái đánh giá
  adminCapNhatTrangThaiDanhGia: async (id, trang_thai) => {
    try {
      const response = await apiClient.patch(`/danh-gia/${id}/trang-thai`, {
        trang_thai,
      });

      return response.data;
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error ||
          "Cập nhật trạng thái đánh giá thất bại",
      };
    }
  },

  // Quản lý phản hồi đánh giá
  adminPhanHoiDanhGia: async (id, phan_hoi) => {
    try {
      const response = await apiClient.patch(`/danh-gia/${id}/phan-hoi`, {
        phan_hoi,
      });

      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Phản hồi đánh giá thất bại",
      };
    }
  },
};

export default danhGiaService;
