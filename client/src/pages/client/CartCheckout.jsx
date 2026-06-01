import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// 🛠️ ĐÃ KẾT NỐI: Import thêm donHangService để kích hoạt tạo đơn hàng thật
import {
  gioHangService,
  donHangService,
  khuyenMaiService,
  hoaDonService,
  thanhToanService,
} from "../../services";

function CartCheckout() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [isOrdering, setIsOrdering] = useState(false);
  const [step, setStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
    method: "standard",
    payment: "cod",
  });

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { id, code, gia_tri, gia_tri_phan_tram }
  const [couponError, setCouponError] = useState("");

  useEffect(() => {
    const layTatCaGioHang = async () => {
      try {
        const result = await gioHangService.xemGioHang();

        if (result && result.success) {
          // Bóc tách dữ liệu linh hoạt theo cấu trúc Backend trả về (.data hoặc .data.danh_sach)
          const dataArray = result.data?.danh_sach || result.data || [];
          setCartItems(Array.isArray(dataArray) ? dataArray : []);
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
        setCartItems([]); // Phòng ngừa sập trang
      }
    };

    layTatCaGioHang();
  }, []);

  const clearCart = () => {
    setCartItems([]);
  };

  // 1. Hàm XÓA THẬT sản phẩm dưới Database khi bấm nút Xóa
  // Hàm xử lý bấm nút Xóa tác phẩm
  const removeFromCart = async (chiTietId) => {
    if (!chiTietId) return;

    try {
      // Gọi đúng tên hàm xoaKhoiGioHang từ Service
      if (
        gioHangService &&
        typeof gioHangService.xoaKhoiGioHang === "function"
      ) {
        const res = await gioHangService.xoaKhoiGioHang(chiTietId);

        if (res && res.success) {
          // Xóa thành công dưới DB -> Cập nhật UI xóa dòng đó trên giao diện
          setCartItems((prevItems) =>
            prevItems.filter((item) => item.id !== chiTietId),
          );
          alert("Đã xóa tác phẩm khỏi giỏ hàng thành công!");
        } else {
          // Lưới bảo vệ: Nếu lỗi DB vẫn cho xóa tạm trên UI để tránh đơ nút
          setCartItems((prevItems) =>
            prevItems.filter((item) => item.id !== chiTietId),
          );
        }
      }
    } catch (error) {
      console.error("Lỗi thực thi xóa giỏ hàng:", error);
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== chiTietId),
      );
    }
  };

  // Hàm xử lý bấm nút tăng/giảm số lượng (+) (-)
  const updateQuantity = async (chiTietId, newQty) => {
    if (newQty < 1) return;

    try {
      if (
        gioHangService &&
        typeof gioHangService.capNhatSoLuong === "function"
      ) {
        const res = await gioHangService.capNhatSoLuong(chiTietId, newQty);

        if (res && res.success) {
          setCartItems((prevItems) =>
            prevItems.map((item) =>
              item.id === chiTietId
                ? { ...item, so_luong: newQty, quantity: newQty }
                : item,
            ),
          );
        } else {
          alert(
            "Cập nhật số lượng thất bại: " + (res?.error || "Lỗi hệ thống"),
          );
        }
      }
    } catch (error) {
      console.error("Lỗi cập nhật số lượng giỏ hàng:", error);
    }
  };

  // 🛠️ ĐÃ THÊM: Hàm kiểm tra validate thông tin nhập vào ở Bước 2 trước khi cho đi tiếp
  const handleValidateStep2 = () => {
    if (!shippingInfo.name.trim()) {
      alert("Vui lòng nhập họ và tên người nhận tranh!");
      return;
    }
    if (!shippingInfo.phone.trim()) {
      alert("Vui lòng nhập số điện thoại liên hệ giao hàng!");
      return;
    }
    if (!shippingInfo.address.trim()) {
      alert("Vui lòng điền địa chỉ nhận tranh chi tiết!");
      return;
    }
    setStep(3); // Thỏa mãn điều kiện thì mới chuyển sang bước 3 Vận chuyển
  };

  // 🛠️ ĐÃ KẾT NỐI API CHÍNH XÁC: Hàm kích hoạt nạp đơn hàng lên Cơ sở dữ liệu Backend
  const handlePlaceOrder = async () => {
    // Phòng hờ kiểm tra lại thông tin khách hàng một lần nữa
    if (
      !shippingInfo.name.trim() ||
      !shippingInfo.phone.trim() ||
      !shippingInfo.address.trim()
    ) {
      alert(
        "Vui lòng quay lại Bước 2 và điền đầy đủ các thông tin bắt buộc (*)",
      );
      setStep(2);
      return;
    }

    setIsOrdering(true);
    try {
      // Đóng gói Payload theo cấu trúc dữ liệu chuẩn của API Controller
      const donHangPayload = {
        ten_nguoi_nhan: shippingInfo.name,
        sdt_nguoi_nhan: shippingInfo.phone,
        dia_chi_giao: shippingInfo.address,
        ghi_chu: shippingInfo.note,
        phuong_thuc_van_chuyen: shippingInfo.method,
        phuong_thuc_thanh_toan: shippingInfo.payment,
        khuyen_mai_id: appliedCoupon ? appliedCoupon.id : null,
        giam_gia: discountAmount,
        phi_van_chuyen: shippingFee,
        tong_tien: total,
      };

      // Gọi API taoDonHang từ file donHangService.js
      const resultDonHang = await donHangService.taoDonHang(donHangPayload);

      if (resultDonHang && resultDonHang.success) {
        const donHangId = resultDonHang.data?.id;

        // 🛠️ Tạo hóa đơn cho đơn hàng vừa tạo
        if (donHangId) {
          const resultHoaDon = await hoaDonService.taoHoaDon({
            don_hang_id: donHangId,
          });

          if (resultHoaDon && resultHoaDon.success) {
            const hoaDonId = resultHoaDon.data?.id;

            // 🛠️ Tạo bản ghi thanh toán
            if (hoaDonId) {
              await thanhToanService.taoThanhToan({
                hoa_don_id: hoaDonId,
                so_tien: total,
                phuong_thuc: shippingInfo.payment === "cod" ? "tien_mat" : "chuyen_khoan",
              });
            }
          }
        }

        // Đặt hàng thành công vĩnh viễn -> Làm sạch giỏ hàng UI và đẩy sang màn hình Bước 5 chúc mừng
        clearCart();
        setStep(5);
      } else {
        alert(
          "Đặt hàng thất bại: " +
            (resultDonHang.error || "Hệ thống từ chối xử lý dữ liệu đơn hàng."),
        );
      }
    } catch (error) {
      console.error("Lỗi sụp luồng xử lý đặt hàng API:", error);
      alert(
        "Có lỗi kết nối xảy ra trong quá trình đặt hàng. Vui lòng thử lại!",
      );
    } finally {
      setIsOrdering(false);
    }
  };

  // Deprecated: Hardcoded coupons - now fetched from API via khuyenMaiService
  // const availableCoupons = [
  //   {
  //     code: "SUMMER20",
  //     value: "20%",
  //     minSpend: 1000000,
  //     label: "Giảm 20% mùa hè",
  //   },
  //   {
  //     code: "ART100K",
  //     value: "100000",
  //     minSpend: 700000,
  //     label: "Giảm trực tiếp 100.000 đ",
  //   },
  //   {
  //     code: "VIP15",
  //     value: "15%",
  //     minSpend: 2000000,
  //     label: "Ưu đãi khách VIP giảm 15%",
  //   },
  // ];

  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    if (typeof priceStr === "number") return priceStr;
    return parseInt(priceStr.replace(/[^0-9]/g, ""), 10);
  };

  const subtotal = (cartItems || []).reduce((sum, item) => {
    const itemPrice = item.tranh?.gia_ban || item.price || item.thanh_tien || 0;
    const itemQty = item.so_luong || item.quantity || 1;
    return sum + parsePrice(itemPrice) * itemQty;
  }, 0);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError("");

    if (!couponCode.trim()) {
      setCouponError("Vui lòng nhập mã giảm giá!");
      return;
    }

    try {
      const result = await khuyenMaiService.kiemTraMaGiamGia(couponCode.trim());

      if (result && result.success && result.data) {
        // API trả về thông tin khuyến mãi bao gồm ID, code, gia_tri, gia_tri_phan_tram, v.v.
        setAppliedCoupon(result.data);
        setCouponError("");
        alert(`Áp dụng mã ${couponCode.trim()} thành công!`);
      } else {
        setCouponError(
          result?.error || "Mã giảm giá không tồn tại hoặc đã hết hạn!",
        );
        setAppliedCoupon(null);
      }
    } catch (error) {
      console.error("Lỗi kiểm tra mã giảm giá:", error);
      setCouponError("Lỗi khi kiểm tra mã giảm giá. Vui lòng thử lại!");
      setAppliedCoupon(null);
    }
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;

    // Nếu API trả về gia_tri_phan_tram (phần trăm) hoặc gia_tri (giá trị cố định)
    if (appliedCoupon.gia_tri_phan_tram) {
      return (subtotal * appliedCoupon.gia_tri_phan_tram) / 100;
    }

    if (appliedCoupon.gia_tri) {
      return parseInt(appliedCoupon.gia_tri, 10);
    }

    return 0;
  };

  const discountAmount = calculateDiscount();
  const shippingFee = shippingInfo.method === "express" ? 50000 : 30000;
  const total = subtotal - discountAmount + (step >= 3 ? shippingFee : 0);

  const formatPrice = (num) => num.toLocaleString("vi-VN") + " đ";

  const stepsTitle = [
    { id: 1, label: "Giỏ hàng" },
    { id: 2, label: "Thông tin đặt hàng" },
    { id: 3, label: "Vận chuyển" },
    { id: 4, label: "Thanh toán" },
  ];

  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#ffffff",
        padding: "40px 100px 80px 100px",
      }}
    >
      {step < 5 && (
        <div style={{ textAlign: "left", marginBottom: "30px" }}>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "normal",
              color: "#111111",
              margin: 0,
            }}
          >
            {step === 1
              ? "Giỏ hàng"
              : step === 2
                ? "Thông tin đặt hàng"
                : step === 3
                  ? "Vận chuyển"
                  : "Thanh toán"}
          </h1>
        </div>
      )}

      {step < 5 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "40px",
            paddingBottom: "20px",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          {stepsTitle.map((s, index) => (
            <React.Fragment key={s.id}>
              <div
                onClick={() => step !== 5 && setStep(s.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  color: step === s.id ? "#1c3f3a" : "#aaaaaa",
                  fontWeight: step === s.id ? "bold" : "normal",
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: step === s.id ? "#1c3f3a" : "#f0f0f0",
                    color: step === s.id ? "#fff" : "#666",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                  }}
                >
                  {s.id}
                </div>
                <span style={{ fontSize: "14px" }}>{s.label}</span>
              </div>
              {index < stepsTitle.length - 1 && (
                <div
                  style={{
                    width: "40px",
                    height: "1px",
                    backgroundColor: "#ddd",
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      <div style={{ textAlign: "left" }}>
        {/* ================= BƯỚC 1: GIỎ HÀNG ================= */}
        {step === 1 &&
          (!cartItems || cartItems.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "80px 0",
                color: "#888888",
              }}
            >
              <div style={{ fontSize: "50px", marginBottom: "15px" }}>🛒</div>
              <p style={{ fontSize: "16px", margin: "0 0 20px 0" }}>
                Giỏ hàng trống
              </p>
              <button
                onClick={() => navigate("/tranh")}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#1c3f3a",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Khám phá bộ sưu tập ngay
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr 0.6fr",
                gap: "60px",
              }}
            >
              <div>
                {Array.isArray(cartItems) &&
                  cartItems.map((item) => {
                    const title =
                      item.tranh?.ten_tranh ||
                      item.title ||
                      "Tác phẩm nghệ thuật";
                    const image =
                      item.image ||
                      item.tranh?.hinhAnhChinh?.duongDan ||
                      "https://via.placeholder.com/90";
                    const currentQty = item.so_luong || item.quantity || 1;
                    const priceToDisplay =
                      item.tranh?.gia_ban || item.thanh_tien || item.price || 0;

                    return (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "25px",
                          padding: "20px 0",
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        <img
                          src={image}
                          alt=""
                          style={{
                            width: "90px",
                            height: "90px",
                            objectFit: "contain",
                            backgroundColor: "#f9f9f9",
                            borderRadius: "4px",
                          }}
                        />

                        <div style={{ flex: 1 }}>
                          <h4
                            style={{
                              margin: "0 0 6px 0",
                              fontSize: "16px",
                              fontWeight: "bold",
                            }}
                          >
                            {title}
                          </h4>
                          <span style={{ color: "#888", fontSize: "13px" }}>
                            {item.category || "Tranh độc bản Sen Đông"}
                          </span>
                          <div
                            style={{
                              marginTop: "10px",
                              fontWeight: "bold",
                              fontSize: "15px",
                            }}
                          >
                            {typeof priceToDisplay === "number"
                              ? formatPrice(priceToDisplay)
                              : priceToDisplay}
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "15px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              border: "1px solid #ddd",
                              padding: "4px 12px",
                              borderRadius: "4px",
                            }}
                          >
                            <button
                              style={{
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                                fontSize: "16px",
                              }}
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  (item.so_luong || item.quantity) - 1,
                                )
                              }
                            >
                              -
                            </button>

                            <span style={{ fontSize: "14px" }}>
                              {item.so_luong || item.quantity}
                            </span>

                            <button
                              style={{
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                                fontSize: "16px",
                              }}
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  (item.so_luong || item.quantity) + 1,
                                )
                              }
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            style={{
                              border: "none",
                              background: "none",
                              color: "#e74c3c",
                              cursor: "pointer",
                              fontSize: "14px",
                              fontWeight: "500",
                              padding: "5px",
                            }}
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div
                style={{
                  border: "1px solid #f0f0f0",
                  padding: "25px",
                  borderRadius: "8px",
                  height: "fit-content",
                  backgroundColor: "#fafafa",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 20px 0",
                    fontSize: "18px",
                    borderBottom: "1px solid #eee",
                    paddingBottom: "10px",
                  }}
                >
                  Tóm tắt đơn hàng
                </h3>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                >
                  <span>Tạm tính</span>
                  <strong style={{ fontSize: "16px" }}>
                    {formatPrice(subtotal)}
                  </strong>
                </div>
                <button
                  onClick={() => {
                    if (!cartItems || cartItems.length === 0) {
                      alert(
                        "Giỏ hàng đang trống, không thể tiến hành thanh toán!",
                      );
                      return;
                    }
                    setStep(2);
                  }}
                  style={{
                    width: "100%",
                    padding: "14px 0",
                    backgroundColor: "#1c3f3a",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "15px",
                  }}
                >
                  Tiến hành thanh toán
                </button>
              </div>
            </div>
          ))}

        {/* ================= BƯỚC 2: THÔNG TIN ĐẶT HÀNG ================= */}
        {step === 2 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.3fr 0.7fr",
              gap: "60px",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              <input
                type="text"
                placeholder="Họ và tên *"
                value={shippingInfo.name}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, name: e.target.value })
                }
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Số điện thoại *"
                value={shippingInfo.phone}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, phone: e.target.value })
                }
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Địa chỉ nhận tranh chi tiết *"
                value={shippingInfo.address}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, address: e.target.value })
                }
                style={inputStyle}
              />
              <textarea
                placeholder="Ghi chú đơn hàng..."
                rows="3"
                value={shippingInfo.note}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, note: e.target.value })
                }
                style={{ ...inputStyle, resize: "none" }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                }}
              >
                <button
                  onClick={() => setStep(1)}
                  style={{
                    padding: "10px 20px",
                    background: "none",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Quay lại
                </button>
                {/* 🛠️ ĐÃ SỬA: Thay onClick trực tiếp thành hàm handleValidateStep2 để check lỗi trống trường */}
                <button
                  onClick={handleValidateStep2}
                  style={{
                    padding: "12px 25px",
                    backgroundColor: "#1c3f3a",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Tiếp tục vận chuyển
                </button>
              </div>
            </div>

            <div style={summaryBoxStyle}>
              <h4>Sản phẩm ({cartItems.length})</h4>
              {Array.isArray(cartItems) &&
                cartItems.map((i) => {
                  const title = i.tranh?.ten_tranh || i.title || "Tác phẩm";
                  const price = i.tranh?.gia_ban || i.price || 0;
                  const qty = i.so_luong || i.quantity || 1;
                  return (
                    <div
                      key={i.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "14px",
                        marginBottom: "8px",
                      }}
                    >
                      <span>
                        {title} x{qty}
                      </span>
                      <span>{formatPrice(price * qty)}</span>
                    </div>
                  );
                })}
              <div
                style={{
                  borderTop: "1px solid #eee",
                  paddingTop: "10px",
                  marginTop: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>Tạm tính</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
            </div>
          </div>
        )}

        {/* ================= BƯỚC 3: VẬN CHUYỂN ================= */}
        {step === 3 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.3fr 0.7fr",
              gap: "60px",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              <div
                onClick={() =>
                  setShippingInfo({ ...shippingInfo, method: "standard" })
                }
                style={{
                  ...methodBoxStyle,
                  borderColor:
                    shippingInfo.method === "standard" ? "#1c3f3a" : "#eee",
                }}
              >
                <input
                  type="radio"
                  checked={shippingInfo.method === "standard"}
                  readOnly
                />
                <div style={{ flex: 1, textAlign: "left" }}>
                  <h4>Giao hàng Tiêu Chuẩn</h4>
                  <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>
                    Nhận tranh sau 3-5 ngày làm việc
                  </p>
                </div>
                <strong>30.000 đ</strong>
              </div>

              <div
                onClick={() =>
                  setShippingInfo({ ...shippingInfo, method: "express" })
                }
                style={{
                  ...methodBoxStyle,
                  borderColor:
                    shippingInfo.method === "express" ? "#1c3f3a" : "#eee",
                }}
              >
                <input
                  type="radio"
                  checked={shippingInfo.method === "express"}
                  readOnly
                />
                <div style={{ flex: 1, textAlign: "left" }}>
                  <h4>Giao hàng Hỏa tốc</h4>
                  <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>
                    Nhận tranh ngay trong ngày
                  </p>
                </div>
                <strong>50.000 đ</strong>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                }}
              >
                <button
                  onClick={() => setStep(2)}
                  style={{
                    padding: "10px 20px",
                    background: "none",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Quay lại
                </button>
                <button
                  onClick={() => setStep(4)}
                  style={{
                    padding: "12px 25px",
                    backgroundColor: "#1c3f3a",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Tiếp tục thanh toán
                </button>
              </div>
            </div>

            <div style={summaryBoxStyle}>
              <div style={summaryRowStyle}>
                <span>Tiền hàng</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div style={summaryRowStyle}>
                <span>Phí vận chuyển</span>
                <span>{formatPrice(shippingFee)}</span>
              </div>
              <div
                style={{
                  ...summaryRowStyle,
                  borderTop: "1px solid #eee",
                  paddingTop: "10px",
                  marginTop: "10px",
                }}
              >
                <span>Tổng tiền</span>
                <strong style={{ color: "#1c3f3a", fontSize: "18px" }}>
                  {formatPrice(total)}
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* ================= BƯỚC 4: THANH TOÁN ================= */}
        {step === 4 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 0.8fr",
              gap: "50px",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              <div
                onClick={() =>
                  setShippingInfo({ ...shippingInfo, payment: "cod" })
                }
                style={{
                  ...methodBoxStyle,
                  borderColor:
                    shippingInfo.payment === "cod" ? "#1c3f3a" : "#eee",
                }}
              >
                <input
                  type="radio"
                  checked={shippingInfo.payment === "cod"}
                  readOnly
                />
                <h4>Thanh toán khi nhận hàng (COD)</h4>
              </div>

              <div
                onClick={() =>
                  setShippingInfo({ ...shippingInfo, payment: "bank" })
                }
                style={{
                  ...methodBoxStyle,
                  flexDirection: "column",
                  gap: "15px",
                  alignItems: "flex-start",
                  borderColor:
                    shippingInfo.payment === "bank" ? "#1c3f3a" : "#eee",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "15px" }}
                >
                  <input
                    type="radio"
                    checked={shippingInfo.payment === "bank"}
                    readOnly
                  />
                  <h4>Chuyển khoản tài khoản ngân hàng</h4>
                </div>
                {shippingInfo.payment === "bank" && (
                  <div
                    style={{
                      padding: "5px 30px",
                      color: "#555",
                      fontSize: "14px",
                      lineHeight: "1.6",
                      textAlign: "left",
                    }}
                  >
                    Số tài khoản: <strong>123456789</strong>
                    <br />
                    Ngân hàng: <strong>Vietcombank</strong>
                    <br />
                    Chủ tài khoản: <strong>XƯỞNG TRANH SEN ĐÔNG</strong>
                  </div>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                }}
              >
                <button
                  onClick={() => setStep(3)}
                  disabled={isOrdering}
                  style={{
                    padding: "10px 20px",
                    background: "none",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    cursor: isOrdering ? "not-allowed" : "pointer",
                  }}
                >
                  Quay lại
                </button>
                {/* 🛠 * ĐÃ SỬA: Thay nút setStep(5) ảo cũ bằng hàm handlePlaceOrder gửi dữ liệu thật xuống Backend */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={isOrdering}
                  style={{
                    padding: "12px 30px",
                    backgroundColor: isOrdering ? "#999" : "#2e7d32",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: isOrdering ? "not-allowed" : "pointer",
                    fontWeight: "bold",
                    fontSize: "15px",
                  }}
                >
                  {isOrdering ? "Đang xử lý đơn hàng..." : "Đặt hàng ngay"}
                </button>
              </div>
            </div>

            <div style={summaryBoxStyle}>
              <h3
                style={{
                  margin: "0 0 15px 0",
                  fontSize: "16px",
                  borderBottom: "1px solid #eee",
                  paddingBottom: "8px",
                }}
              >
                Chi tiết thanh toán
              </h3>

              <div style={{ marginBottom: "20px" }}>
                <form
                  onSubmit={handleApplyCoupon}
                  style={{ display: "flex", gap: "10px" }}
                >
                  <input
                    type="text"
                    placeholder="Mã giảm giá (Ví dụ: SUMMER20)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: "10px 18px",
                      backgroundColor: "#1c3f3a",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "13px",
                    }}
                  >
                    Áp dụng
                  </button>
                </form>
                {couponError && (
                  <p
                    style={{
                      color: "#e74c3c",
                      fontSize: "13px",
                      margin: "6px 0 0 0",
                    }}
                  >
                    {couponError}
                  </p>
                )}
                {appliedCoupon && (
                  <p
                    style={{
                      color: "#2e7d32",
                      fontSize: "13px",
                      margin: "6px 0 0 0",
                    }}
                  >
                    ✓ Đang áp dụng mã: <strong>{appliedCoupon.code}</strong> (-
                    {appliedCoupon.value})
                  </p>
                )}
              </div>

              <div style={summaryRowStyle}>
                <span>Tổng tiền hàng:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div style={summaryRowStyle}>
                  <span>Giảm giá chương trình:</span>
                  <span style={{ color: "#e74c3c", fontWeight: "500" }}>
                    -{formatPrice(discountAmount)}
                  </span>
                </div>
              )}
              <div style={summaryRowStyle}>
                <span>Phí vận chuyển giao hàng:</span>
                <span>{formatPrice(shippingFee)}</span>
              </div>
              <div
                style={{
                  ...summaryRowStyle,
                  borderTop: "2px solid #1c3f3a",
                  paddingTop: "12px",
                  marginTop: "12px",
                }}
              >
                <span style={{ fontWeight: "bold", fontSize: "15px" }}>
                  Tổng thanh toán cần trả:
                </span>
                <strong style={{ color: "#2e7d32", fontSize: "20px" }}>
                  {formatPrice(total)}
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* ================= BƯỚC 5: ĐẶT HÀNG THÀNH CÔNG ================= */}
        {step === 5 && (
          <div style={{ textAlign: "center", padding: "50px 0" }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "#e8f5e9",
                color: "#2e7d32",
                fontSize: "32px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
              }}
            >
              ✓
            </div>
            <h2 style={{ color: "#2e7d32", margin: "0 0 10px 0" }}>
              Đặt hàng thành công!
            </h2>
            <p
              style={{
                color: "#555",
                maxWidth: "500px",
                margin: "0 auto 30px auto",
                lineHeight: "1.6",
              }}
            >
              Cảm ơn bạn đã ủng hộ xưởng tranh Sen Đông. Nhân viên xưởng sẽ sớm
              liên hệ qua điện thoại để xác nhận đơn hàng.
            </p>
            <button
              onClick={() => {
                setStep(1);
                clearCart();
                setAppliedCoupon(null);
                setCouponCode("");
                navigate("/", { replace: true });
              }}
              style={{
                padding: "12px 24px",
                backgroundColor: "#1c3f3a",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Quay lại trang chủ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
};
const summaryBoxStyle = {
  border: "1px solid #f0f0f0",
  padding: "20px",
  borderRadius: "8px",
  backgroundColor: "#fafafa",
  height: "fit-content",
};
const methodBoxStyle = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
  border: "1px solid",
  padding: "20px",
  borderRadius: "6px",
  cursor: "pointer",
  boxSizing: "border-box",
  width: "100%",
};
const summaryRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px",
  fontSize: "14px",
};

export default CartCheckout;
