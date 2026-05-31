import apiClient from "./apiClient";

// 1. Quản lý Nhà Cung Cấp khung tranh, vải, mực
export const nhaCungCapService = {
  layDanhSach: async () => {
    const res = await apiClient.get("/admin/kho/nha-cung-cap");
    return res.data;
  },
  taoMoi: async (data) => {
    const res = await apiClient.post("/admin/kho/nha-cung-cap", data);
    return res.data;
  }
};

// 2. Quản lý Vật Liệu (mực in, canvas, gỗ làm khung...)
export const vatLieuService = {
  layDanhSach: async () => {
    const res = await apiClient.get("/admin/kho/vat-lieu");
    return res.data;
  },
  capNhatTonKho: async (id, data) => {
    const res = await apiClient.put(`/admin/kho/vat-lieu/${id}`, data);
    return res.data;
  }
};

// 3. Quản lý Phiếu Nhập Kho vật tư
export const phieuNhapService = {
  layDanhSach: async () => {
    const res = await apiClient.get("/admin/kho/phieu-nhap");
    return res.data;
  },
  taoPhieuNhap: async (data) => {
    const res = await apiClient.post("/admin/kho/phieu-nhap/them", data);
    return res.data;
  }
};

// 4. Quản lý Thiết Bị (Máy in tranh, máy căng khung...)
export const thietBiService = {
  layDanhSach: async () => {
    const res = await apiClient.get("/admin/kho/thiet-bi");
    return res.data;
  },
  capNhatTrangThai: async (id, trangThai) => {
    const res = await apiClient.put(`/admin/kho/thiet-bi/${id}/trang-thai`, { trangThai });
    return res.data;
  }
};