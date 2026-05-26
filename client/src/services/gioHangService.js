import apiClient from "./apiClient";

const gioHangService = {
  xemGioHang: async () => {
    const res = await apiClient.get("/gio-hang");
    return res.data;
  },

  themVaoGioHang: async () => {
    const res = await apiClient.post("/gio-hang/them");
    return res.data;
  },

  capNhatSoLuong: async (id, data) => {
    const res = await apiClient.put(`/gio-hang/${id}`, data);
    return res.data;
  },

  xoaMotGioHang: async (id) => {
    const res = await apiClient.delete(`/gio-hang/${id}`);
    return res.data;
  },

  xoaTatCaGioHang: async () => {
    const res = await apiClient.delete("/gio-hang");
    return res.data;
  },
};

export default gioHangService;
