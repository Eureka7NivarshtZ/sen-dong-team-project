const { QueryTypes } = require("sequelize");
const models = require("../models");

const sequelize = models.sequelize;

const toNumber = (value) => Number(value || 0);

const buildMonthData = (rows) => {
  const data = [];

  for (let thang = 1; thang <= 12; thang++) {
    const found = rows.find((item) => Number(item.thang) === thang);

    data.push({
      thang,
      doanh_thu: toNumber(found?.doanh_thu),
    });
  }

  return data;
};

const getLatestRevenueMonth = async () => {
  const paymentRows = await sequelize.query(
    `
    SELECT 
      YEAR(thoi_gian) AS nam,
      MONTH(thoi_gian) AS thang,
      SUM(so_tien) AS doanh_thu
    FROM thanh_toan
    WHERE trang_thai = 'thanh_cong'
    GROUP BY YEAR(thoi_gian), MONTH(thoi_gian)
    HAVING SUM(so_tien) > 0
    ORDER BY nam DESC, thang DESC
    LIMIT 1
    `,
    { type: QueryTypes.SELECT },
  );

  if (paymentRows.length > 0) {
    return {
      source: "thanh_toan",
      nam: Number(paymentRows[0].nam),
      thang: Number(paymentRows[0].thang),
      doanh_thu: toNumber(paymentRows[0].doanh_thu),
    };
  }

  const orderRows = await sequelize.query(
    `
    SELECT 
      YEAR(ngay_dat) AS nam,
      MONTH(ngay_dat) AS thang,
      SUM(thanh_tien) AS doanh_thu
    FROM don_hang
    WHERE trang_thai = 'hoan_thanh'
    GROUP BY YEAR(ngay_dat), MONTH(ngay_dat)
    HAVING SUM(thanh_tien) > 0
    ORDER BY nam DESC, thang DESC
    LIMIT 1
    `,
    { type: QueryTypes.SELECT },
  );

  if (orderRows.length > 0) {
    return {
      source: "don_hang",
      nam: Number(orderRows[0].nam),
      thang: Number(orderRows[0].thang),
      doanh_thu: toNumber(orderRows[0].doanh_thu),
    };
  }

  return {
    source: null,
    nam: new Date().getFullYear(),
    thang: new Date().getMonth() + 1,
    doanh_thu: 0,
  };
};

// 1. Tổng quan dashboard
const tongQuanDashboard = async (req, res) => {
  try {
    const now = new Date();

    const dauNgayHomNay = new Date(now);
    dauNgayHomNay.setHours(0, 0, 0, 0);

    const dauNgayMai = new Date(dauNgayHomNay);
    dauNgayMai.setDate(dauNgayMai.getDate() + 1);

    const dauThangNay = new Date(now.getFullYear(), now.getMonth(), 1);
    const dauThangSau = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const [
      tongTranhRows,
      tongKhachHangRows,
      tongDonHangRows,
      donHangHomNayRows,
      donChoXacNhanRows,
      tongDoanhThuRows,
      doanhThuThangNayRows,
      vatLieuCanhBaoRows,
    ] = await Promise.all([
      sequelize.query(
        `
        SELECT COUNT(*) AS total
        FROM tranh
        WHERE trang_thai = 'ban'
        `,
        { type: QueryTypes.SELECT },
      ),

      sequelize.query(
        `
        SELECT COUNT(*) AS total
        FROM khach_hang
        `,
        { type: QueryTypes.SELECT },
      ),

      sequelize.query(
        `
        SELECT COUNT(*) AS total
        FROM don_hang
        `,
        { type: QueryTypes.SELECT },
      ),

      sequelize.query(
        `
        SELECT COUNT(*) AS total
        FROM don_hang
        WHERE ngay_dat >= :dauNgayHomNay
          AND ngay_dat < :dauNgayMai
        `,
        {
          type: QueryTypes.SELECT,
          replacements: {
            dauNgayHomNay,
            dauNgayMai,
          },
        },
      ),

      sequelize.query(
        `
        SELECT COUNT(*) AS total
        FROM don_hang
        WHERE trang_thai = 'cho_xac_nhan'
        `,
        { type: QueryTypes.SELECT },
      ),

      sequelize.query(
        `
        SELECT COALESCE(SUM(so_tien), 0) AS total
        FROM thanh_toan
        WHERE trang_thai = 'thanh_cong'
        `,
        { type: QueryTypes.SELECT },
      ),

      sequelize.query(
        `
        SELECT COALESCE(SUM(so_tien), 0) AS total
        FROM thanh_toan
        WHERE trang_thai = 'thanh_cong'
          AND thoi_gian >= :dauThangNay
          AND thoi_gian < :dauThangSau
        `,
        {
          type: QueryTypes.SELECT,
          replacements: {
            dauThangNay,
            dauThangSau,
          },
        },
      ),

      sequelize.query(
        `
        SELECT COUNT(*) AS total
        FROM tranh
        WHERE so_luong_ton <= 10
        `,
        { type: QueryTypes.SELECT },
      ),
    ]);

    let doanhThuThangNay = toNumber(doanhThuThangNayRows[0]?.total);

    // Fallback: nếu chưa có thanh_toan trong tháng này, lấy từ đơn hàng hoàn thành.
    if (doanhThuThangNay === 0) {
      const fallbackRows = await sequelize.query(
        `
        SELECT COALESCE(SUM(thanh_tien), 0) AS total
        FROM don_hang
        WHERE trang_thai = 'hoan_thanh'
          AND ngay_dat >= :dauThangNay
          AND ngay_dat < :dauThangSau
        `,
        {
          type: QueryTypes.SELECT,
          replacements: {
            dauThangNay,
            dauThangSau,
          },
        },
      );

      doanhThuThangNay = toNumber(fallbackRows[0]?.total);
    }

    const latestRevenue = await getLatestRevenueMonth();

    // Card hiển thị: ưu tiên tháng này, nếu tháng này 0 thì lấy tháng gần nhất có doanh thu.
    const doanhThuCard =
      doanhThuThangNay > 0 ? doanhThuThangNay : latestRevenue.doanh_thu;

    const thangDoanhThuHienThi =
      doanhThuThangNay > 0
        ? `Tháng ${now.getMonth() + 1}/${now.getFullYear()}`
        : latestRevenue.doanh_thu > 0
          ? `Tháng ${latestRevenue.thang}/${latestRevenue.nam}`
          : `Tháng ${now.getMonth() + 1}/${now.getFullYear()}`;

    res.json({
      success: true,
      message: "Lấy tổng quan dashboard thành công",
      data: {
        tong_tranh: toNumber(tongTranhRows[0]?.total),
        tong_khach_hang: toNumber(tongKhachHangRows[0]?.total),
        tong_don_hang: toNumber(tongDonHangRows[0]?.total),
        don_hang_hom_nay: toNumber(donHangHomNayRows[0]?.total),
        don_cho_xac_nhan: toNumber(donChoXacNhanRows[0]?.total),
        tong_doanh_thu: toNumber(tongDoanhThuRows[0]?.total),
        doanh_thu_thang_nay: doanhThuThangNay,
        doanh_thu_card: doanhThuCard,
        thang_doanh_thu_hien_thi: thangDoanhThuHienThi,
        nguon_doanh_thu_hien_thi: latestRevenue.source,
        vat_lieu_canh_bao: toNumber(vatLieuCanhBaoRows[0]?.total),
      },
    });
  } catch (error) {
    console.error("Lỗi SQL đếm số liệu dashboard:", error);

    res.status(500).json({
      success: false,
      error: "Lỗi SQL đếm số liệu dashboard: " + error.message,
    });
  }
};

// 2. Đơn hàng gần đây
const donHangGanDay = async (req, res) => {
  try {
    const danhSach = await sequelize.query(
      `
      SELECT
        dh.id,
        dh.ma_don_hang,
        dh.dia_chi_giao AS dia_chi_giao_hang,
        dh.thanh_tien,
        dh.ngay_dat,
        dh.trang_thai,
        kh.id AS khach_hang_id,
        kh.ho_ten AS ten_khach_hang,
        kh.sdt AS sdt_khach_hang
      FROM don_hang dh
      LEFT JOIN khach_hang kh ON kh.id = dh.khach_hang_id
      ORDER BY dh.ngay_dat DESC
      LIMIT 10
      `,
      { type: QueryTypes.SELECT },
    );

    const data = danhSach.map((order) => ({
      ...order,
      khach_hang: {
        id: order.khach_hang_id,
        ho_ten: order.ten_khach_hang,
        ten: order.ten_khach_hang,
        sdt: order.sdt_khach_hang,
      },
    }));

    res.json({
      success: true,
      message: "Lấy đơn hàng gần đây thành công",
      data,
    });
  } catch (error) {
    console.error("Lỗi lấy đơn hàng gần đây:", error);

    res.status(500).json({
      success: false,
      error: "Lỗi lấy đơn hàng gần đây: " + error.message,
    });
  }
};

// 3. Doanh thu theo tháng
const doanhThuTheoThang = async (req, res) => {
  try {
    let namSo = Number(req.query.nam);

    if (!namSo) {
      const latestRevenue = await getLatestRevenueMonth();
      namSo = latestRevenue.nam || new Date().getFullYear();
    }

    let rows = await sequelize.query(
      `
      SELECT 
        MONTH(thoi_gian) AS thang,
        COALESCE(SUM(so_tien), 0) AS doanh_thu
      FROM thanh_toan
      WHERE trang_thai = 'thanh_cong'
        AND YEAR(thoi_gian) = :nam
      GROUP BY MONTH(thoi_gian)
      ORDER BY thang ASC
      `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          nam: namSo,
        },
      },
    );

    let source = "thanh_toan";
    let total = rows.reduce((sum, item) => sum + toNumber(item.doanh_thu), 0);

    // Fallback: nếu thanh_toan chưa có dữ liệu, lấy từ đơn hàng hoàn thành.
    if (total === 0) {
      rows = await sequelize.query(
        `
        SELECT 
          MONTH(ngay_dat) AS thang,
          COALESCE(SUM(thanh_tien), 0) AS doanh_thu
        FROM don_hang
        WHERE trang_thai = 'hoan_thanh'
          AND YEAR(ngay_dat) = :nam
        GROUP BY MONTH(ngay_dat)
        ORDER BY thang ASC
        `,
        {
          type: QueryTypes.SELECT,
          replacements: {
            nam: namSo,
          },
        },
      );

      source = "don_hang";
      total = rows.reduce((sum, item) => sum + toNumber(item.doanh_thu), 0);
    }

    res.json({
      success: true,
      message: "Lấy doanh thu theo tháng thành công",
      source,
      nam: namSo,
      total,
      data: buildMonthData(rows),
    });
  } catch (error) {
    console.error("Lỗi lấy doanh thu theo tháng:", error);

    res.status(500).json({
      success: false,
      error: "Lỗi lấy doanh thu theo tháng: " + error.message,
    });
  }
};

module.exports = {
  tongQuanDashboard,
  donHangGanDay,
  doanhThuTheoThang,
};
