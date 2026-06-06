import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dashboardService } from "../../services";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    tong_tranh: 0,
    tong_khach_hang: 0,
    tong_don_hang: 0,
    don_hang_hom_nay: 0,
    don_cho_xac_nhan: 0,
    tong_doanh_thu: 0,
    doanh_thu_thang_nay: 0,
    vat_lieu_canh_bao: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllDashboardData = async () => {
    try {
      setLoading(true);

      const [statsRes, ordersRes, revenueRes] = await Promise.all([
        dashboardService.layDashboardTongQuan(),
        dashboardService.layDonHangGanDay(),
        dashboardService.layDoanhThuTheoThang(),
      ]);

      const revenueList = revenueRes.success ? revenueRes.data || [] : [];
      const currentMonth = new Date().getMonth() + 1;

      const doanhThuThangHienTaiTuBieuDo = Number(
        revenueList.find((item) => Number(item.thang) === currentMonth)
          ?.doanh_thu || 0,
      );

      const tongDoanhThuTuBieuDo = revenueList.reduce((sum, item) => {
        return sum + Number(item.doanh_thu || 0);
      }, 0);

      if (statsRes.success) {
        setStats({
          tong_tranh: Number(statsRes.data?.tong_tranh || 0),
          tong_khach_hang: Number(statsRes.data?.tong_khach_hang || 0),
          tong_don_hang: Number(statsRes.data?.tong_don_hang || 0),
          don_hang_hom_nay: Number(statsRes.data?.don_hang_hom_nay || 0),
          don_cho_xac_nhan: Number(statsRes.data?.don_cho_xac_nhan || 0),

          tong_doanh_thu:
            Number(statsRes.data?.tong_doanh_thu || 0) || tongDoanhThuTuBieuDo,

          doanh_thu_thang_nay:
            Number(statsRes.data?.doanh_thu_thang_nay || 0) ||
            doanhThuThangHienTaiTuBieuDo,

          vat_lieu_canh_bao: Number(statsRes.data?.vat_lieu_canh_bao || 0),
        });
      }

      if (ordersRes.success) {
        setRecentOrders(ordersRes.data || []);
      }

      if (revenueRes.success) {
        setRevenueData(revenueList);
      }
    } catch (error) {
      console.error("Lỗi nạp dữ liệu thống kê:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDashboardData();
  }, []);

  const currentMonth = new Date().getMonth() + 1;

  const visibleRevenueData = useMemo(() => {
    return revenueData
      .filter((item) => Number(item.thang) <= currentMonth)
      .slice(-6);
  }, [revenueData, currentMonth]);

  const maxRevenue = useMemo(() => {
    return Math.max(
      ...visibleRevenueData.map((item) => Number(item.doanh_thu || 0)),
      1,
    );
  }, [visibleRevenueData]);

  const formatCurrency = (value) => {
    return Number(value || 0).toLocaleString("vi-VN") + " ₫";
  };

  const formatCompactCurrency = (value) => {
    const number = Number(value || 0);

    if (number >= 1000000000) {
      return `${(number / 1000000000).toFixed(1)} tỷ`;
    }

    if (number >= 1000000) {
      return `${(number / 1000000).toFixed(1)} triệu`;
    }

    if (number >= 1000) {
      return `${(number / 1000).toFixed(0)}K`;
    }

    return number.toString();
  };

  const formatOrderDate = (dateValue) => {
    if (!dateValue) return "N/A";

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getCustomerName = (order) => {
    return (
      order?.khach_hang?.ho_ten ||
      order?.khach_hang?.ten ||
      order?.ten_khach_hang ||
      "Khách vãng lai"
    );
  };

  const getOrderAddress = (order) => {
    return order?.dia_chi_giao_hang || order?.dia_chi || "Tại xưởng";
  };

  const getStatusText = (status) => {
    if (
      status === "da_tra_loi" ||
      status === "hoan_thanh" ||
      status === "Hoàn thành" ||
      status === "da_thanh_toan" ||
      status === "thanh_cong"
    ) {
      return "Hoàn thành";
    }

    if (status === "cho_xac_nhan") return "Chờ xác nhận";
    if (status === "dang_xu_ly" || status === "Đang xử lý") return "Đang xử lý";
    if (status === "bi_huy" || status === "da_huy") return "Đã hủy";

    return status || "Đang xử lý";
  };

  if (loading) {
    return (
      <div style={loadingStyle}>
        <div style={loadingCardStyle}>Đang tải báo cáo từ SQL Server...</div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <div>
          <div style={eyebrowStyle}>ADMIN DASHBOARD</div>
          <h2 style={pageTitleStyle}>Báo cáo & thống kê</h2>
          <p style={pageDescriptionStyle}>
            Theo dõi doanh thu, đơn hàng và tình trạng vận hành cửa hàng.
          </p>
        </div>

        <button onClick={fetchAllDashboardData} style={refreshButtonStyle}>
          Làm mới
        </button>
      </div>

      <div style={heroGridStyle}>
        <div style={heroRevenueCardStyle}>
          <div style={heroTopStyle}>
            <div>
              <div style={heroLabelStyle}>Doanh thu tháng này</div>
              <div style={heroValueStyle}>
                {formatCurrency(stats.doanh_thu_thang_nay)}
              </div>
            </div>

            <div style={heroIconStyle}>₫</div>
          </div>

          <div style={heroBottomStyle}>
            <span style={positivePillStyle}>Tháng {currentMonth}</span>
            <span style={heroNoteStyle}>
              Dữ liệu lấy từ thanh toán hoặc doanh thu theo tháng
            </span>
          </div>
        </div>

        <StatCard
          label="Đơn hàng hôm nay"
          value={stats.don_hang_hom_nay}
          suffix="đơn"
          note={`Tổng đơn: ${stats.tong_don_hang}`}
          icon="🧾"
        />

        <StatCard
          label="Tranh đang bán"
          value={stats.tong_tranh}
          suffix="tác phẩm"
          note={`Khách hàng: ${stats.tong_khach_hang}`}
          icon="🖼️"
        />
      </div>

      <div style={miniGridStyle}>
        <MiniCard
          label="Tổng doanh thu"
          value={formatCurrency(stats.tong_doanh_thu)}
        />
        <MiniCard
          label="Đơn chờ xác nhận"
          value={`${stats.don_cho_xac_nhan} đơn`}
        />
        <MiniCard
          label="Vật liệu cảnh báo"
          value={`${stats.vat_lieu_canh_bao} loại`}
        />
      </div>

      <div style={contentGridStyle}>
        <section style={panelStyle}>
          <div style={panelHeaderStyle}>
            <div>
              <h3 style={panelTitleStyle}>Doanh thu 6 tháng gần đây</h3>
              <p style={panelSubTitleStyle}>
                Đơn vị hiển thị rút gọn theo triệu đồng.
              </p>
            </div>
          </div>

          {visibleRevenueData.length === 0 ? (
            <div style={emptyChartStyle}>Chưa có dữ liệu doanh thu.</div>
          ) : (
            <div style={chartStyle}>
              {visibleRevenueData.map((item) => {
                const doanhThu = Number(item.doanh_thu || 0);
                const height = Math.max((doanhThu / maxRevenue) * 100, 5);

                return (
                  <div key={item.thang} style={barItemStyle}>
                    <div style={barValueStyle}>
                      {formatCompactCurrency(doanhThu)}
                    </div>

                    <div style={barTrackStyle}>
                      <div
                        title={formatCurrency(doanhThu)}
                        style={{
                          ...barFillStyle,
                          height: `${height}%`,
                          opacity: doanhThu > 0 ? 1 : 0.25,
                        }}
                      />
                    </div>

                    <div style={barLabelStyle}>T{item.thang}</div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section style={panelStyle}>
          <div style={panelHeaderStyle}>
            <div>
              <h3 style={panelTitleStyle}>Đơn hàng mới</h3>
              <p style={panelSubTitleStyle}>
                10 đơn hàng gần nhất trong hệ thống.
              </p>
            </div>
          </div>

          <div style={tableWrapStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Mã đơn</th>
                  <th style={thStyle}>Khách hàng</th>
                  <th style={thStyle}>Địa chỉ</th>
                  <th style={thStyle}>Trạng thái</th>
                  <th style={thStyle}>Ngày đặt</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>Xem</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={emptyTableCellStyle}>
                      Hệ thống chưa có lịch sử đơn hàng.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} style={trStyle}>
                      <td style={orderCodeStyle}>
                        #
                        {order.id
                          ? order.id.toString().padStart(5, "0")
                          : "N/A"}
                      </td>

                      <td style={tdStyle}>{getCustomerName(order)}</td>

                      <td style={addressCellStyle}>{getOrderAddress(order)}</td>

                      <td style={tdStyle}>
                        <span style={getStatusBadgeStyle(order.trang_thai)}>
                          {getStatusText(order.trang_thai)}
                        </span>
                      </td>

                      <td style={tdStyle}>{formatOrderDate(order.ngay_dat)}</td>

                      <td style={{ ...tdStyle, textAlign: "center" }}>
                        <button
                          onClick={() =>
                            navigate(`/admin/don-hang/${order.id}`)
                          }
                          style={viewButtonStyle}
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, suffix, note, icon }) {
  return (
    <div style={statCardStyle}>
      <div style={statIconStyle}>{icon}</div>
      <div style={cardLabelStyle}>{label}</div>
      <div style={cardValueStyle}>
        {Number(value || 0).toLocaleString("vi-VN")}{" "}
        <span style={cardSuffixStyle}>{suffix}</span>
      </div>
      <div style={cardNoteStyle}>{note}</div>
    </div>
  );
}

function MiniCard({ label, value }) {
  return (
    <div style={miniCardStyle}>
      <div style={miniLabelStyle}>{label}</div>
      <div style={miniValueStyle}>{value}</div>
    </div>
  );
}

const loadingStyle = {
  minHeight: "100vh",
  background: "#f3f6f4",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "Arial, sans-serif",
};

const loadingCardStyle = {
  padding: "18px 24px",
  background: "#ffffff",
  borderRadius: "18px",
  boxShadow: "0 16px 40px rgba(20, 55, 48, 0.08)",
  color: "#1c3f3a",
  fontWeight: 700,
};

const pageStyle = {
  minHeight: "100vh",
  padding: "32px",
  background:
    "radial-gradient(circle at top left, #dfeee8 0, #f6f8f6 34%, #f3f6f4 100%)",
  fontFamily: "Arial, sans-serif",
  color: "#183b35",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "20px",
  marginBottom: "26px",
};

const eyebrowStyle = {
  fontSize: "12px",
  letterSpacing: "1.5px",
  fontWeight: 800,
  color: "#73918a",
  marginBottom: "6px",
};

const pageTitleStyle = {
  margin: 0,
  fontSize: "30px",
  lineHeight: "38px",
  color: "#143730",
  fontWeight: 900,
};

const pageDescriptionStyle = {
  margin: "8px 0 0",
  color: "#6b817b",
  fontSize: "14px",
};

const refreshButtonStyle = {
  border: "none",
  background: "#143730",
  color: "#ffffff",
  padding: "11px 18px",
  borderRadius: "999px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: 800,
  boxShadow: "0 10px 24px rgba(20, 55, 48, 0.22)",
};

const heroGridStyle = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr 1fr",
  gap: "18px",
  marginBottom: "18px",
};

const heroRevenueCardStyle = {
  padding: "24px",
  borderRadius: "24px",
  background: "linear-gradient(135deg, #143730 0%, #1f5a4f 100%)",
  color: "#ffffff",
  boxShadow: "0 22px 45px rgba(20, 55, 48, 0.24)",
};

const heroTopStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "20px",
};

const heroLabelStyle = {
  color: "rgba(255,255,255,0.72)",
  fontSize: "14px",
  fontWeight: 700,
  marginBottom: "12px",
};

const heroValueStyle = {
  fontSize: "34px",
  fontWeight: 900,
  letterSpacing: "-0.5px",
};

const heroIconStyle = {
  width: "48px",
  height: "48px",
  borderRadius: "16px",
  background: "rgba(255,255,255,0.14)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 900,
  fontSize: "22px",
};

const heroBottomStyle = {
  marginTop: "24px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  flexWrap: "wrap",
};

const positivePillStyle = {
  background: "#dff7e8",
  color: "#176c3a",
  borderRadius: "999px",
  padding: "6px 10px",
  fontSize: "12px",
  fontWeight: 900,
};

const heroNoteStyle = {
  color: "rgba(255,255,255,0.68)",
  fontSize: "12px",
};

const statCardStyle = {
  position: "relative",
  padding: "22px",
  borderRadius: "24px",
  background: "rgba(255,255,255,0.9)",
  border: "1px solid rgba(214,226,222,0.9)",
  boxShadow: "0 18px 42px rgba(20, 55, 48, 0.08)",
  overflow: "hidden",
};

const statIconStyle = {
  width: "42px",
  height: "42px",
  borderRadius: "14px",
  background: "#ecf5f1",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "20px",
  marginBottom: "14px",
};

const cardLabelStyle = {
  color: "#728b84",
  fontSize: "13px",
  fontWeight: 800,
  marginBottom: "8px",
};

const cardValueStyle = {
  color: "#143730",
  fontSize: "26px",
  fontWeight: 900,
};

const cardSuffixStyle = {
  color: "#8b9d98",
  fontSize: "14px",
  fontWeight: 700,
};

const cardNoteStyle = {
  color: "#7a908a",
  fontSize: "12px",
  marginTop: "10px",
  fontWeight: 700,
};

const miniGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "18px",
  marginBottom: "22px",
};

const miniCardStyle = {
  padding: "18px 20px",
  borderRadius: "20px",
  background: "#ffffff",
  border: "1px solid #e1ebe7",
  boxShadow: "0 12px 30px rgba(20, 55, 48, 0.06)",
};

const miniLabelStyle = {
  color: "#71847f",
  fontSize: "13px",
  fontWeight: 800,
  marginBottom: "8px",
};

const miniValueStyle = {
  color: "#143730",
  fontSize: "20px",
  fontWeight: 900,
};

const contentGridStyle = {
  display: "grid",
  gridTemplateColumns: "0.85fr 1.65fr",
  gap: "22px",
};

const panelStyle = {
  background: "rgba(255,255,255,0.96)",
  borderRadius: "24px",
  padding: "22px",
  border: "1px solid #e1ebe7",
  boxShadow: "0 18px 42px rgba(20, 55, 48, 0.07)",
};

const panelHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "18px",
};

const panelTitleStyle = {
  margin: 0,
  color: "#143730",
  fontSize: "18px",
  fontWeight: 900,
};

const panelSubTitleStyle = {
  margin: "6px 0 0",
  color: "#7b908a",
  fontSize: "12px",
  fontWeight: 700,
};

const emptyChartStyle = {
  height: "260px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#8ca09a",
  fontSize: "14px",
  fontWeight: 700,
};

const chartStyle = {
  height: "260px",
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "space-between",
  gap: "12px",
  paddingTop: "12px",
};

const barItemStyle = {
  height: "100%",
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-end",
};

const barValueStyle = {
  fontSize: "11px",
  color: "#667f78",
  fontWeight: 900,
  marginBottom: "8px",
  minHeight: "14px",
};

const barTrackStyle = {
  width: "100%",
  maxWidth: "38px",
  height: "190px",
  borderRadius: "999px",
  background: "#eef4f1",
  display: "flex",
  alignItems: "flex-end",
  overflow: "hidden",
};

const barFillStyle = {
  width: "100%",
  borderRadius: "999px",
  background: "linear-gradient(180deg, #2e8b75 0%, #143730 100%)",
  transition: "height 0.25s ease",
};

const barLabelStyle = {
  marginTop: "10px",
  color: "#6f8580",
  fontSize: "12px",
  fontWeight: 900,
};

const tableWrapStyle = {
  overflowX: "auto",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: "0 10px",
  minWidth: "760px",
};

const thStyle = {
  padding: "0 14px 8px",
  color: "#768b86",
  fontSize: "12px",
  fontWeight: 900,
  textAlign: "left",
  whiteSpace: "nowrap",
};

const trStyle = {
  background: "#f8fbfa",
};

const tdStyle = {
  padding: "14px",
  color: "#314944",
  fontSize: "13px",
  fontWeight: 700,
  borderTop: "1px solid #eef3f1",
  borderBottom: "1px solid #eef3f1",
};

const orderCodeStyle = {
  ...tdStyle,
  color: "#143730",
  fontWeight: 900,
  borderLeft: "1px solid #eef3f1",
  borderRadius: "14px 0 0 14px",
};

const addressCellStyle = {
  ...tdStyle,
  maxWidth: "190px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const emptyTableCellStyle = {
  padding: "32px",
  textAlign: "center",
  color: "#8ca09a",
  fontStyle: "italic",
  fontWeight: 700,
};

const viewButtonStyle = {
  background: "#143730",
  color: "#ffffff",
  border: "none",
  padding: "8px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 900,
  cursor: "pointer",
};

const getStatusBadgeStyle = (status) => {
  let bg = "#e7f6ed";
  let color = "#217846";

  if (
    status === "cho_xac_nhan" ||
    status === "dang_xu_ly" ||
    status === "Đang xử lý"
  ) {
    bg = "#fff4df";
    color = "#c46a13";
  }

  if (status === "bi_huy" || status === "da_huy") {
    bg = "#ffe9e9";
    color = "#c53030";
  }

  return {
    padding: "7px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 900,
    background: bg,
    color,
    display: "inline-block",
    whiteSpace: "nowrap",
  };
};

export default Dashboard;
