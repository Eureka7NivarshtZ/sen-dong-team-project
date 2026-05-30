import apiClient from "./apiClient";

const hoTroService = {
  taoYeuCauHoTro: async (payload) => {
    try {
      const result = await apiClient.post("/ho-tro", payload);
      return result.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Tao yeu cau ho tro that bai",
      };
    }
  },

  xemYeuCauHoTroCuaToi: async () => {
    try {
      const result = await apiClient.get("/ho-tro/cua-toi");
      return result.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || "Xem yeu cau ho tro that bai",
      };
    }
  },

  xemChiTietYeuCauHoTro: async (id) => {
    try {
      const result = await apiClient.get(`/ho-tro/chi-tiet/${id}`);
      return result.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || "Xem chi tiet that bai",
      };
    }
  },

  guiPhanHoi: async (id, payload) => {
    try {
      const result = await apiClient.post(`/ho-tro/${id}/phan-hoi`, payload);
      return result.data;
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.error || "Phan hoi yeu cau ho tro that bai",
      };
    }
  },
};

export default hoTroService;
