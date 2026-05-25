DROP DATABASE IF EXISTS sen_dong_production;
CREATE DATABASE sen_dong_production
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
USE sen_dong_production;
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- NHÓM 1: NGƯỜI DÙNG & XÁC THỰC
-- ============================================================

CREATE TABLE tai_khoan (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(191) NOT NULL UNIQUE, /* Đã fix lỗi 1071 (255 -> 191) */
    mat_khau_hash VARCHAR(255) NOT NULL,
    loai VARCHAR(20) NOT NULL CHECK (loai IN ('nhan_vien', 'khach_hang')),
    kich_hoat BOOLEAN NOT NULL DEFAULT 1,
    token_dat_lai_mat_khau VARCHAR(255) NULL,
    token_dat_lai_mat_khau_het_han DATETIME NULL,
    tao_luc DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cap_nhat_luc DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE nhan_vien (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    tai_khoan_id VARCHAR(36) NOT NULL UNIQUE,
    ho_ten VARCHAR(100) NOT NULL,
    ngay_sinh DATE,
    dia_chi TEXT,
    sdt VARCHAR(20),
    vai_tro VARCHAR(20) NOT NULL CHECK (vai_tro IN ('quan_ly', 'ban_hang', 'kho')),
    hoat_dong BOOLEAN NOT NULL DEFAULT 1,
    FOREIGN KEY (tai_khoan_id) REFERENCES tai_khoan(id) ON DELETE CASCADE
);

CREATE TABLE khach_hang (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    tai_khoan_id VARCHAR(36) NOT NULL UNIQUE,
    ho_ten VARCHAR(100) NOT NULL,
    sdt VARCHAR(20),
    dia_chi TEXT,
    tao_luc DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tai_khoan_id) REFERENCES tai_khoan(id) ON DELETE CASCADE
);

-- ============================================================
-- NHÓM 2: NHÂN SỰ
-- ============================================================

CREATE TABLE ca (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    ten_ca VARCHAR(50) NOT NULL,
    gio_bat_dau TIME NOT NULL,
    gio_ket_thuc TIME NOT NULL,
    phu_cap DECIMAL(12, 2) NOT NULL DEFAULT 0
);

CREATE TABLE lich_lam_viec (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    nhan_vien_id VARCHAR(36) NOT NULL,
    ca_id VARCHAR(36) NOT NULL,
    ngay DATE NOT NULL,
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'da_lam' CHECK (trang_thai IN ('da_lam', 'vang', 'tre')),
    UNIQUE (nhan_vien_id, ca_id, ngay),
    FOREIGN KEY (nhan_vien_id) REFERENCES nhan_vien(id) ON DELETE CASCADE,
    FOREIGN KEY (ca_id) REFERENCES ca(id)
);

CREATE TABLE bang_luong (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    nhan_vien_id VARCHAR(36) NOT NULL,
    thang SMALLINT NOT NULL CHECK (thang BETWEEN 1 AND 12),
    nam SMALLINT NOT NULL,
    luong_co_ban DECIMAL(15, 2) NOT NULL DEFAULT 0,
    thuong DECIMAL(15, 2) NOT NULL DEFAULT 0,
    phat DECIMAL(15, 2) NOT NULL DEFAULT 0,
    tong_luong DECIMAL(15, 2) GENERATED ALWAYS AS (luong_co_ban + thuong - phat) STORED,
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'cho_duyet' CHECK (trang_thai IN ('cho_duyet', 'da_tra')),
    UNIQUE (nhan_vien_id, thang, nam),
    FOREIGN KEY (nhan_vien_id) REFERENCES nhan_vien(id)
);

-- ============================================================
-- NHÓM 3: SẢN PHẨM
-- ============================================================

CREATE TABLE danh_muc (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    ten VARCHAR(100) NOT NULL UNIQUE,
    cha_id VARCHAR(36),
    FOREIGN KEY (cha_id) REFERENCES danh_muc(id) ON DELETE SET NULL
);

CREATE TABLE tac_gia (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    ho_ten VARCHAR(100) NOT NULL,
    ngay_sinh DATE,
    dia_chi TEXT,
    sdt VARCHAR(20),
    tieu_su TEXT
);

CREATE TABLE kho_hang (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    ten_kho VARCHAR(100) NOT NULL,
    dia_chi TEXT NOT NULL,
    tien_thue DECIMAL(15, 2) NOT NULL DEFAULT 0,
    hoat_dong BOOLEAN NOT NULL DEFAULT 1
);

CREATE TABLE tranh (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    tac_gia_id VARCHAR(36) NOT NULL,
    danh_muc_id VARCHAR(36),
    kho_id VARCHAR(36),
    ten_tranh VARCHAR(200) NOT NULL,
    mo_ta TEXT,
    kich_thuoc VARCHAR(50),
    gia_ban DECIMAL(15, 2) NOT NULL DEFAULT 0,
    gia_von DECIMAL(15, 2) NOT NULL DEFAULT 0,
    so_luong_ton INT NOT NULL DEFAULT 0 CHECK (so_luong_ton >= 0),
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'ban' CHECK (trang_thai IN ('ban', 'het_hang', 'an')),
    nhan_vien_tao_id VARCHAR(36),
    nhan_vien_cap_nhat_id VARCHAR(36),
    tao_luc DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cap_nhat_luc DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tac_gia_id) REFERENCES tac_gia(id),
    FOREIGN KEY (danh_muc_id) REFERENCES danh_muc(id) ON DELETE SET NULL,
    FOREIGN KEY (kho_id) REFERENCES kho_hang(id) ON DELETE SET NULL
);

CREATE TABLE hinh_anh_tranh (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    tranh_id VARCHAR(36) NOT NULL,
    url TEXT NOT NULL,
    la_chinh BOOLEAN NOT NULL DEFAULT 0,
    thu_tu INT NOT NULL DEFAULT 0,
    FOREIGN KEY (tranh_id) REFERENCES tranh(id) ON DELETE CASCADE
);

-- ============================================================
-- NHÓM 4: KHO & VẬT TƯ
-- ============================================================

CREATE TABLE nha_cung_cap (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    ten VARCHAR(150) NOT NULL,
    sdt VARCHAR(20),
    dia_chi TEXT,
    email VARCHAR(255),
    loai VARCHAR(20) NOT NULL DEFAULT 'ca_hai' CHECK (loai IN ('vat_lieu', 'thiet_bi', 'ca_hai'))
);

CREATE TABLE vat_lieu (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    nha_cung_cap_id VARCHAR(36) NOT NULL,
    ten VARCHAR(150) NOT NULL,
    loai VARCHAR(50),
    don_vi VARCHAR(20) NOT NULL DEFAULT 'cái',
    gia_nhap DECIMAL(15, 2) NOT NULL DEFAULT 0,
    so_luong_ton INT NOT NULL DEFAULT 0 CHECK (so_luong_ton >= 0),
    muc_canh_bao INT NOT NULL DEFAULT 10,
    FOREIGN KEY (nha_cung_cap_id) REFERENCES nha_cung_cap(id)
);

CREATE TABLE phieu_nhap_vat_lieu (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    nha_cung_cap_id VARCHAR(36) NOT NULL,
    nhan_vien_id VARCHAR(36) NOT NULL,
    ngay_nhap DATE NOT NULL DEFAULT (CURRENT_DATE),
    tong_tien DECIMAL(15, 2) NOT NULL DEFAULT 0,
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'cho_duyet' CHECK (trang_thai IN ('cho_duyet', 'da_nhap', 'huy')),
    FOREIGN KEY (nha_cung_cap_id) REFERENCES nha_cung_cap(id),
    FOREIGN KEY (nhan_vien_id) REFERENCES nhan_vien(id)
);

CREATE TABLE chi_tiet_phieu_nhap (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    phieu_id VARCHAR(36) NOT NULL,
    vat_lieu_id VARCHAR(36) NOT NULL,
    so_luong INT NOT NULL CHECK (so_luong > 0),
    don_gia DECIMAL(15, 2) NOT NULL DEFAULT 0,
    thanh_tien DECIMAL(15, 2) GENERATED ALWAYS AS (so_luong * don_gia) STORED,
    FOREIGN KEY (phieu_id) REFERENCES phieu_nhap_vat_lieu(id) ON DELETE CASCADE,
    FOREIGN KEY (vat_lieu_id) REFERENCES vat_lieu(id)
);

CREATE TABLE thiet_bi (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    nha_cung_cap_id VARCHAR(36) NOT NULL,
    ten VARCHAR(150) NOT NULL,
    loai VARCHAR(50),
    thong_so TEXT,
    han_bao_hanh DATE,
    gia DECIMAL(15, 2) NOT NULL DEFAULT 0,
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'hoat_dong' CHECK (trang_thai IN ('hoat_dong', 'hong', 'bao_tri')),
    FOREIGN KEY (nha_cung_cap_id) REFERENCES nha_cung_cap(id)
);

-- ============================================================
-- NHÓM 5: VẬN CHUYỂN
-- ============================================================

CREATE TABLE don_vi_van_chuyen (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    ten VARCHAR(150) NOT NULL,
    sdt VARCHAR(20),
    email VARCHAR(255),
    phi_co_ban DECIMAL(12, 2) NOT NULL DEFAULT 0,
    hoat_dong BOOLEAN NOT NULL DEFAULT 1
);

-- ============================================================
-- NHÓM 6: GIỎ HÀNG
-- ============================================================

CREATE TABLE gio_hang (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    khach_hang_id VARCHAR(36) NOT NULL UNIQUE,
    cap_nhat_luc DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (khach_hang_id) REFERENCES khach_hang(id) ON DELETE CASCADE
);

CREATE TABLE gio_hang_chi_tiet (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    gio_hang_id VARCHAR(36) NOT NULL,
    tranh_id VARCHAR(36) NOT NULL,
    so_luong INT NOT NULL DEFAULT 1 CHECK (so_luong > 0),
    don_gia DECIMAL(15, 2) NOT NULL,
    UNIQUE (gio_hang_id, tranh_id),
    FOREIGN KEY (gio_hang_id) REFERENCES gio_hang(id) ON DELETE CASCADE,
    FOREIGN KEY (tranh_id) REFERENCES tranh(id) ON DELETE CASCADE
);

-- ============================================================
-- NHÓM 7: ĐƠN HÀNG (Vận hành)
-- ============================================================

CREATE TABLE don_hang (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    khach_hang_id VARCHAR(36) NOT NULL,
    nhan_vien_id VARCHAR(36),
    don_vi_van_chuyen_id VARCHAR(36),
    ma_don_hang VARCHAR(50) NOT NULL UNIQUE,
    dia_chi_giao TEXT NOT NULL,
    tong_tien_hang DECIMAL(15, 2) NOT NULL DEFAULT 0,
    phi_van_chuyen DECIMAL(12, 2) NOT NULL DEFAULT 0,
    giam_gia DECIMAL(12, 2) NOT NULL DEFAULT 0,
    thanh_tien DECIMAL(15, 2) GENERATED ALWAYS AS (tong_tien_hang + phi_van_chuyen - giam_gia) STORED,
    ngay_dat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_giao_du_kien DATE,
    ngay_giao_thuc DATE,
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'cho_xac_nhan' CHECK (trang_thai IN ('cho_xac_nhan', 'dang_chuan_bi', 'dang_giao', 'hoan_thanh', 'huy')),
    ghi_chu TEXT,
    FOREIGN KEY (khach_hang_id) REFERENCES khach_hang(id),
    FOREIGN KEY (nhan_vien_id) REFERENCES nhan_vien(id) ON DELETE SET NULL,
    FOREIGN KEY (don_vi_van_chuyen_id) REFERENCES don_vi_van_chuyen(id) ON DELETE SET NULL
);

CREATE TABLE don_hang_chi_tiet (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    don_hang_id VARCHAR(36) NOT NULL,
    tranh_id VARCHAR(36) NOT NULL,
    so_luong INT NOT NULL DEFAULT 1 CHECK (so_luong > 0),
    don_gia DECIMAL(15, 2) NOT NULL,
    thanh_tien DECIMAL(15, 2) GENERATED ALWAYS AS (so_luong * don_gia) STORED,
    co_lap_khung BOOLEAN NOT NULL DEFAULT 0,
    FOREIGN KEY (don_hang_id) REFERENCES don_hang(id) ON DELETE CASCADE,
    FOREIGN KEY (tranh_id) REFERENCES tranh(id)
);

CREATE TABLE van_don (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    don_hang_id VARCHAR(36) NOT NULL,
    don_vi_id VARCHAR(36) NOT NULL,
    ma_van_don VARCHAR(100) UNIQUE,
    ngay_lay_hang DATETIME,
    ngay_giao DATETIME,
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'cho_lay' CHECK (trang_thai IN ('cho_lay', 'dang_giao', 'da_giao', 'that_bai')),
    FOREIGN KEY (don_hang_id) REFERENCES don_hang(id) ON DELETE CASCADE,
    FOREIGN KEY (don_vi_id) REFERENCES don_vi_van_chuyen(id)
);

-- ============================================================
-- NHÓM 8: HÓA ĐƠN (Tài chính)
-- ============================================================

CREATE TABLE hoa_don (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    don_hang_id VARCHAR(36) NOT NULL,
    so_hoa_don VARCHAR(50) NOT NULL UNIQUE,
    ngay_xuat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tong_tien_truoc_thue DECIMAL(15, 2) NOT NULL DEFAULT 0,
    thue_suat DECIMAL(5, 2) NOT NULL DEFAULT 10,
    tien_thue DECIMAL(15, 2) GENERATED ALWAYS AS (tong_tien_truoc_thue * thue_suat / 100) STORED,
    tong_tien_sau_thue DECIMAL(15, 2) GENERATED ALWAYS AS (tong_tien_truoc_thue + tong_tien_truoc_thue * thue_suat / 100) STORED,
    loai VARCHAR(20) NOT NULL DEFAULT 'ban_hang' CHECK (loai IN ('ban_hang', 'hoan_tien')),
    hoa_don_goc_id VARCHAR(36),
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'da_xuat' CHECK (trang_thai IN ('nhap', 'da_xuat', 'da_huy')),
    FOREIGN KEY (don_hang_id) REFERENCES don_hang(id),
    FOREIGN KEY (hoa_don_goc_id) REFERENCES hoa_don(id),
    CONSTRAINT chk_hoan_tien CHECK (
        loai = 'ban_hang' OR hoa_don_goc_id IS NOT NULL
    )
);

CREATE TABLE thanh_toan (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    hoa_don_id VARCHAR(36) NOT NULL,
    so_tien DECIMAL(15, 2) NOT NULL CHECK (so_tien > 0),
    phuong_thuc VARCHAR(20) NOT NULL CHECK (phuong_thuc IN ('tien_mat', 'chuyen_khoan', 'the')),
    thoi_gian DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'thanh_cong' CHECK (trang_thai IN ('thanh_cong', 'that_bai', 'hoan_tien')),
    ma_giao_dich VARCHAR(100),
    FOREIGN KEY (hoa_don_id) REFERENCES hoa_don(id) ON DELETE CASCADE
);

-- ============================================================
-- NHÓM 9: SẢN XUẤT (Đóng khung)
-- ============================================================

CREATE TABLE don_lap_khung (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    don_hang_chi_tiet_id VARCHAR(36) NOT NULL,
    tranh_id VARCHAR(36) NOT NULL,
    nhan_vien_id VARCHAR(36),
    ngay_bat_dau DATE NOT NULL DEFAULT (CURRENT_DATE),
    ngay_hoan_thanh DATE,
    ghi_chu TEXT,
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'cho' CHECK (trang_thai IN ('cho', 'dang_lam', 'hoan_thanh')),
    FOREIGN KEY (don_hang_chi_tiet_id) REFERENCES don_hang_chi_tiet(id) ON DELETE CASCADE,
    FOREIGN KEY (tranh_id) REFERENCES tranh(id),
    FOREIGN KEY (nhan_vien_id) REFERENCES nhan_vien(id) ON DELETE SET NULL,
    CONSTRAINT chk_ngay CHECK (
        ngay_hoan_thanh IS NULL OR ngay_hoan_thanh >= ngay_bat_dau
    )
);

CREATE TABLE vat_lieu_don_lap_khung (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    don_id VARCHAR(36) NOT NULL,
    vat_lieu_id VARCHAR(36) NOT NULL,
    so_luong_su_dung INT NOT NULL CHECK (so_luong_su_dung > 0),
    UNIQUE (don_id, vat_lieu_id),
    FOREIGN KEY (don_id) REFERENCES don_lap_khung(id) ON DELETE CASCADE,
    FOREIGN KEY (vat_lieu_id) REFERENCES vat_lieu(id)
);

CREATE TABLE thiet_bi_don_lap_khung (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    don_id VARCHAR(36) NOT NULL,
    thiet_bi_id VARCHAR(36) NOT NULL,
    UNIQUE (don_id, thiet_bi_id),
    FOREIGN KEY (don_id) REFERENCES don_lap_khung(id) ON DELETE CASCADE,
    FOREIGN KEY (thiet_bi_id) REFERENCES thiet_bi(id)
);

-- ============================================================
-- INDEX - Tối ưu truy vấn thường gặp
-- ============================================================

CREATE INDEX idx_nhan_vien_tai_khoan  ON nhan_vien(tai_khoan_id);
CREATE INDEX idx_khach_hang_tai_khoan ON khach_hang(tai_khoan_id);
CREATE INDEX idx_tranh_tac_gia        ON tranh(tac_gia_id);
CREATE INDEX idx_tranh_danh_muc       ON tranh(danh_muc_id);
CREATE INDEX idx_tranh_trang_thai     ON tranh(trang_thai);
CREATE INDEX idx_tranh_so_luong_ton   ON tranh(so_luong_ton);
CREATE INDEX idx_don_hang_khach_hang  ON don_hang(khach_hang_id);
CREATE INDEX idx_don_hang_trang_thai  ON don_hang(trang_thai);
CREATE INDEX idx_don_hang_ngay_dat    ON don_hang(ngay_dat);
CREATE INDEX idx_don_hang_chi_tiet    ON don_hang_chi_tiet(don_hang_id);
CREATE INDEX idx_hoa_don_don_hang     ON hoa_don(don_hang_id);
CREATE INDEX idx_hoa_don_ngay_xuat    ON hoa_don(ngay_xuat);
CREATE INDEX idx_hoa_don_trang_thai   ON hoa_don(trang_thai);
CREATE INDEX idx_hoa_don_goc          ON hoa_don(hoa_don_goc_id);
CREATE INDEX idx_van_don_don_hang     ON van_don(don_hang_id);
CREATE INDEX idx_van_don_trang_thai   ON van_don(trang_thai);
CREATE INDEX idx_lich_lam_viec_ngay   ON lich_lam_viec(ngay, nhan_vien_id);
CREATE INDEX idx_bang_luong_nv_thang  ON bang_luong(nhan_vien_id, nam, thang);
CREATE INDEX idx_don_lap_khung_tt     ON don_lap_khung(trang_thai);
CREATE INDEX idx_don_lap_khung_nv     ON don_lap_khung(nhan_vien_id);
CREATE INDEX idx_vat_lieu_canh_bao    ON vat_lieu(so_luong_ton);

-- ============================================================
-- VIEW tiện ích
-- ============================================================

CREATE VIEW v_don_hang_tong_quan AS
SELECT 
    dh.id,
    dh.ma_don_hang,
    kh.ho_ten        AS khach_hang,
    dh.thanh_tien,
    dh.trang_thai    AS trang_thai_don,
    hd.so_hoa_don,
    hd.trang_thai    AS trang_thai_hoa_don,
    COALESCE(SUM(CASE WHEN tt.trang_thai = 'thanh_cong' THEN tt.so_tien ELSE 0 END), 0) AS da_thanh_toan,
    dh.ngay_dat,
    dh.ngay_giao_du_kien
FROM don_hang dh
JOIN khach_hang kh ON kh.id = dh.khach_hang_id
LEFT JOIN hoa_don hd ON hd.don_hang_id = dh.id AND hd.loai = 'ban_hang'
LEFT JOIN thanh_toan tt ON tt.hoa_don_id = hd.id
GROUP BY dh.id, dh.ma_don_hang, kh.ho_ten, dh.thanh_tien, dh.trang_thai, hd.so_hoa_don, hd.trang_thai, dh.ngay_dat, dh.ngay_giao_du_kien;

CREATE VIEW v_vat_lieu_canh_bao AS
SELECT 
    v.id,
    v.ten,
    v.loai,
    v.don_vi,
    v.so_luong_ton,
    v.muc_canh_bao,
    ncc.ten AS nha_cung_cap,
    ncc.sdt
FROM vat_lieu v
JOIN nha_cung_cap ncc ON ncc.id = v.nha_cung_cap_id
WHERE v.so_luong_ton <= v.muc_canh_bao;

CREATE VIEW v_don_lap_khung_hoat_dong AS
SELECT 
    dlk.id,
    t.ten_tranh,
    nv.ho_ten       AS nhan_vien,
    dlk.ngay_bat_dau,
    dlk.ngay_hoan_thanh,
    dlk.trang_thai,
    dh.ma_don_hang
FROM don_lap_khung dlk
JOIN tranh t  ON t.id  = dlk.tranh_id
JOIN don_hang_chi_tiet dhct ON dhct.id = dlk.don_hang_chi_tiet_id
JOIN don_hang dh ON dh.id = dhct.don_hang_id
LEFT JOIN nhan_vien nv ON nv.id = dlk.nhan_vien_id
WHERE dlk.trang_thai IN ('cho', 'dang_lam');