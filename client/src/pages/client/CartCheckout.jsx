import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  gioHangService,
  donHangService,
  khuyenMaiService,
  donViVanChuyenService,
} from "../../services";

function CartCheckout() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [isOrdering, setIsOrdering] = useState(false);
  const [step, setStep] = useState(1);
  const [createdOrder, setCreatedOrder] = useState(null);

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
    method: "",
    phi_van_chuyen: 0,
    payment: "cod",
  });

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

  const [shippingMethods, setShippingMethods] = useState([]);

  const svgFallback90 =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='90' height='90' viewBox='0 0 90 90'><rect width='100%' height='100%' fill='%23f9f9f9'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='10' fill='%23bbb'>No Image</text></svg>";

  const parsePrice = (value) => {
    if (value === null || value === undefined || value === "") return 0;
    if (typeof value === "number") return value;

    const text = String(value).trim();

    if (/^\d+(\.\d+)?$/.test(text)) return Number(text);

    return Number(text.replace(/[^\d]/g, "")) || 0;
  };

  const formatPrice = (num) => {
    return Number(num || 0).toLocaleString("vi-VN") + " đ";
  };

  const getCardImage = (item) => {
    const hinhAnhArray =
      item.tranh?.hinh_anh || item.tranh?.hinh_anh_tranh || [];

    if (Array.isArray(hinhAnhArray) && hinhAnhArray.length > 0) {
      return hinhAnhArray[0].url || hinhAnhArray[0].duong_dan || svgFallback90;
    }

    return (
      item.image ||
      item.tranh?.hinhAnhChinh?.duongDan ||
      item.tranh?.hinh_anh_chinh ||
      svgFallback90
    );
  };

  const getItemTitle = (item) => {
    return item.tranh?.ten_tranh || item.ten_tranh || item.title || "Tác phẩm";
  };

  const getItemPrice = (item) => {
    return parsePrice(
      item.tranh?.gia_ban || item.gia_ban || item.price || item.don_gia || 0,
    );
  };

  const getItemQuantity = (item) => {
    return Number(item.so_luong || item.quantity || 1);
  };

  const subtotal = (cartItems || []).reduce((sum, item) => {
    return sum + getItemPrice(item) * getItemQuantity(item);
  }, 0);

  const discountAmount = appliedCoupon
    ? parsePrice(
        appliedCoupon.so_tien_giam ||
          appliedCoupon.tien_giam ||
          appliedCoupon.gia_tri_giam ||
          appliedCoupon.khuyen_mai?.so_tien_giam ||
          appliedCoupon.khuyen_mai?.gia_tri_giam ||
          0,
      )
    : 0;

  const shippingFee = parsePrice(shippingInfo.phi_van_chuyen);

  const total = Math.max(
    subtotal - discountAmount + (step >= 3 ? shippingFee : 0),
    0,
  );

  const stepsTitle = [
    { id: 1, label: "Giỏ hàng" },
    { id: 2, label: "Thông tin đặt hàng" },
    { id: 3, label: "Vận chuyển" },
    { id: 4, label: "Thanh toán" },
  ];

  useEffect(() => {
    const fetchShippingMethods = async () => {
      try {
        const res = await donViVanChuyenService.layDanhSach();

        console.log("Danh sách đơn vị vận chuyển:", res);

        const list = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.danh_sach)
            ? res.data.danh_sach
            : Array.isArray(res?.data?.items)
              ? res.data.items
              : [];

        setShippingMethods(list);

        if (list.length > 0) {
          setShippingInfo((prev) => ({
            ...prev,
            method: list[0].id,
            phi_van_chuyen: parsePrice(list[0].phi_co_ban),
          }));
        }
      } catch (err) {
        console.error("Lỗi lấy đơn vị vận chuyển:", err);
        setShippingMethods([]);
      }
    };

    fetchShippingMethods();
  }, []);

  useEffect(() => {
    const layTatCaGioHang = async () => {
      try {
        const result = await gioHangService.xemGioHang();

        console.log("Kết quả lấy giỏ hàng:", result);

        if (result?.success) {
          const dataArray = Array.isArray(result.data)
            ? result.data
            : Array.isArray(result.data?.danh_sach)
              ? result.data.danh_sach
              : Array.isArray(result.data?.items)
                ? result.data.items
                : Array.isArray(result.data?.gio_hang)
                  ? result.data.gio_hang
                  : Array.isArray(result.data?.chi_tiet)
                    ? result.data.chi_tiet
                    : [];

          setCartItems(dataArray);
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
        setCartItems([]);
      }
    };

    layTatCaGioHang();
  }, []);

  const clearCart = async () => {
    setCartItems([]);

    try {
      if (typeof gioHangService.xoaTatCaGioHang === "function") {
        await gioHangService.xoaTatCaGioHang();
      } else if (typeof gioHangService.xoaGioHang === "function") {
        await gioHangService.xoaGioHang();
      } else if (typeof gioHangService.rongGioHang === "function") {
        await gioHangService.rongGioHang();
      }
    } catch (error) {
      console.warn("Không thể xóa giỏ hàng trên server:", error);
    }
  };

  const removeFromCart = async (chiTietId) => {
    if (!chiTietId) return;

    try {
      if (typeof gioHangService.xoaKhoiGioHang === "function") {
        const res = await gioHangService.xoaKhoiGioHang(chiTietId);

        if (res?.success) {
          setCartItems((prevItems) =>
            prevItems.filter((item) => item.id !== chiTietId),
          );
          alert("Đã xóa tác phẩm khỏi giỏ hàng thành công!");
        } else {
          setCartItems((prevItems) =>
            prevItems.filter((item) => item.id !== chiTietId),
          );
        }
      } else {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.id !== chiTietId),
        );
      }
    } catch (error) {
      console.error("Lỗi thực thi xóa giỏ hàng:", error);
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== chiTietId),
      );
    }
  };

  const updateQuantity = async (chiTietId, newQty) => {
    if (!chiTietId) return;
    if (newQty < 1) return;

    try {
      if (typeof gioHangService.capNhatSoLuong === "function") {
        const res = await gioHangService.capNhatSoLuong(chiTietId, newQty);

        if (res?.success) {
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
      } else {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === chiTietId
              ? { ...item, so_luong: newQty, quantity: newQty }
              : item,
          ),
        );
      }
    } catch (error) {
      console.error("Lỗi cập nhật số lượng giỏ hàng:", error);
    }
  };

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

    setStep(3);
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();

    setCouponError("");

    const ma = couponCode.trim().toUpperCase();

    if (!ma) {
      setCouponError("Vui lòng nhập mã giảm giá!");
      return;
    }

    if (subtotal <= 0) {
      setCouponError("Giỏ hàng chưa có giá trị để áp dụng mã giảm giá!");
      return;
    }

    try {
      const result = await khuyenMaiService.kiemTraMaGiamGia(ma, subtotal);

      console.log("Kết quả kiểm tra mã giảm giá:", result);

      if (result?.success && result.data) {
        setAppliedCoupon(result.data);
        setCouponError("");
        alert(`Áp dụng mã ${ma} thành công!`);
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

  const handlePlaceOrder = async () => {
    if (
      !shippingInfo.name.trim() ||
      !shippingInfo.phone.trim() ||
      !shippingInfo.address.trim()
    ) {
      alert("Vui lòng quay lại Bước 2 và điền đầy đủ thông tin bắt buộc (*)");
      setStep(2);
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      alert("Giỏ hàng đang trống, không thể đặt hàng!");
      setStep(1);
      return;
    }

    if (!shippingInfo.method) {
      alert("Vui lòng chọn phương thức vận chuyển!");
      setStep(3);
      return;
    }

    setIsOrdering(true);

    try {
      const chiTiet = cartItems.map((item) => ({
        tranh_id: item.tranh_id || item.tranh?.id || item.id_tranh,
        so_luong: getItemQuantity(item),
        don_gia: getItemPrice(item),
        thanh_tien: getItemPrice(item) * getItemQuantity(item),
      }));

      const donHangPayload = {
        ten_nguoi_nhan: shippingInfo.name.trim(),
        sdt_nguoi_nhan: shippingInfo.phone.trim(),
        dia_chi_giao: shippingInfo.address.trim(),
        ghi_chu: shippingInfo.note.trim(),

        phuong_thuc_van_chuyen: shippingInfo.method,
        don_vi_van_chuyen_id: shippingInfo.method,

        phuong_thuc_thanh_toan: "cod",

        khuyen_mai_id:
          appliedCoupon?.khuyen_mai?.id ||
          appliedCoupon?.id ||
          appliedCoupon?.khuyen_mai_id ||
          null,

        tong_tien_hang: subtotal,
        phi_van_chuyen: shippingFee,
        giam_gia: discountAmount,
        tong_thanh_toan: total,

        chi_tiet: chiTiet,
      };

      console.log("Payload tạo đơn hàng:", donHangPayload);

      const result = await donHangService.taoDonHang(donHangPayload);

      console.log("Kết quả tạo đơn hàng:", result);

      if (result?.success) {
        setCreatedOrder(result.data || result.don_hang || result.order || null);
        await clearCart();
        setAppliedCoupon(null);
        setCouponCode("");
        setStep(5);
      } else {
        alert(
          "Đặt hàng thất bại: " +
            (result?.error || "Hệ thống từ chối xử lý dữ liệu đơn hàng."),
        );
      }
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      alert(
        "Có lỗi kết nối xảy ra trong quá trình đặt hàng. Vui lòng thử lại!",
      );
    } finally {
      setIsOrdering(false);
    }
  };

  const renderSummaryBoxWithImages = () => (
    <div style={summaryBoxStyle}>
      <h4
        style={{
          margin: "0 0 15px 0",
          fontSize: "16px",
          borderBottom: "1px solid #eee",
          paddingBottom: "8px",
        }}
      >
        Sản phẩm ({cartItems.length})
      </h4>

      {cartItems.map((i) => {
        const title = getItemTitle(i);
        const price = getItemPrice(i);
        const qty = getItemQuantity(i);
        const imageUrl = getCardImage(i);

        return (
          <div
            key={i.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "14px",
              marginBottom: "12px",
              borderBottom: "1px dashed #f5f5f5",
              paddingBottom: "8px",
            }}
          >
            <img
              src={imageUrl}
              alt=""
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = svgFallback90;
              }}
              style={{
                width: "45px",
                height: "45px",
                objectFit: "cover",
                borderRadius: "4px",
                backgroundColor: "#f9f9f9",
                border: "1px solid #eee",
              }}
            />

            <div style={{ flex: 1, textAlign: "left" }}>
              <div
                style={{ fontWeight: "600", color: "#333", fontSize: "13px" }}
              >
                {title}
              </div>
              <span style={{ color: "#888", fontSize: "12px" }}>
                Số lượng: x{qty}
              </span>
            </div>

            <span style={{ fontWeight: "500" }}>
              {formatPrice(price * qty)}
            </span>
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

      {step >= 3 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "8px",
          }}
        >
          <span>Phí vận chuyển</span>
          <span>{formatPrice(shippingFee)}</span>
        </div>
      )}

      {discountAmount > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "8px",
            color: "#e74c3c",
          }}
        >
          <span>Giảm giá</span>
          <span>-{formatPrice(discountAmount)}</span>
        </div>
      )}

      <div
        style={{
          borderTop: "2px solid #1c3f3a",
          paddingTop: "10px",
          marginTop: "10px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontWeight: "bold" }}>Tổng thanh toán:</span>
        <strong style={{ color: "#2e7d32", fontSize: "18px" }}>
          {formatPrice(total)}
        </strong>
      </div>
    </div>
  );

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
        <div
          style={{
            textAlign: "left",
            marginBottom: "30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
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

          {step === 4 && (
            <button
              onClick={() => navigate("/khuyen-mai")}
              style={{
                background: "none",
                border: "1px dashed #1c3f3a",
                color: "#1c3f3a",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "bold",
              }}
            >
              🎟 Xem các mã giảm giá hiện có
            </button>
          )}
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
                {cartItems.map((item) => {
                  const title = getItemTitle(item);
                  const image = getCardImage(item);
                  const priceToDisplay = getItemPrice(item);
                  const qty = getItemQuantity(item);

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
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = svgFallback90;
                        }}
                        style={{
                          width: "90px",
                          height: "90px",
                          objectFit: "cover",
                          backgroundColor: "#f9f9f9",
                          borderRadius: "4px",
                          border: "1px solid #eee",
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
                          {formatPrice(priceToDisplay)}
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
                            onClick={() => updateQuantity(item.id, qty - 1)}
                          >
                            -
                          </button>
                          <span style={{ fontSize: "14px" }}>{qty}</span>
                          <button
                            style={{
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                              fontSize: "16px",
                            }}
                            onClick={() => updateQuantity(item.id, qty + 1)}
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
                  onClick={() => cartItems.length > 0 && setStep(2)}
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

            {renderSummaryBoxWithImages()}
          </div>
        )}

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
              {shippingMethods.length === 0 ? (
                <p style={{ color: "#888" }}>
                  Đang tải phương thức vận chuyển...
                </p>
              ) : (
                shippingMethods.map((m) => {
                  const selected = String(shippingInfo.method) === String(m.id);

                  return (
                    <div
                      key={m.id}
                      onClick={() =>
                        setShippingInfo({
                          ...shippingInfo,
                          method: m.id,
                          phi_van_chuyen: parsePrice(m.phi_co_ban),
                        })
                      }
                      style={{
                        ...methodBoxStyle,
                        borderColor: selected ? "#1c3f3a" : "#eee",
                      }}
                    >
                      <input type="radio" checked={selected} readOnly />

                      <div style={{ flex: 1, textAlign: "left" }}>
                        <h4 style={{ margin: 0 }}>
                          {m.ten || m.ten_don_vi || "Đơn vị vận chuyển"}
                        </h4>
                        {m.mo_ta && (
                          <p
                            style={{
                              margin: 0,
                              fontSize: "13px",
                              color: "#666",
                            }}
                          >
                            {m.mo_ta}
                          </p>
                        )}
                      </div>

                      <strong>{formatPrice(m.phi_co_ban)}</strong>
                    </div>
                  );
                })
              )}

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
                  disabled={shippingMethods.length === 0}
                  style={{
                    padding: "12px 25px",
                    backgroundColor:
                      shippingMethods.length === 0 ? "#999" : "#1c3f3a",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor:
                      shippingMethods.length === 0 ? "not-allowed" : "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Tiếp tục thanh toán
                </button>
              </div>
            </div>

            {renderSummaryBoxWithImages()}
          </div>
        )}

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
                style={{
                  ...methodBoxStyle,
                  borderColor: "#1c3f3a",
                  backgroundColor: "#fcfdfe",
                  cursor: "default",
                }}
              >
                <input type="radio" checked={true} readOnly />

                <div style={{ textAlign: "left" }}>
                  <h4 style={{ margin: "0 0 4px 0", color: "#1c3f3a" }}>
                    Thanh toán khi nhận hàng (COD)
                  </h4>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      color: "#666",
                      lineHeight: "1.4",
                    }}
                  >
                    Quý khách sẽ thanh toán tiền mặt trực tiếp cho nhân viên
                    giao hàng sau khi đã mở kiện kiểm tra tranh chuẩn nguyên
                    vẹn.
                  </p>
                </div>
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

            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <div style={summaryBoxStyle}>
                <h3
                  style={{
                    margin: "0 0 15px 0",
                    fontSize: "16px",
                    borderBottom: "1px solid #eee",
                    paddingBottom: "8px",
                  }}
                >
                  Mã giảm giá
                </h3>

                <form
                  onSubmit={handleApplyCoupon}
                  style={{ display: "flex", gap: "10px" }}
                >
                  <input
                    type="text"
                    placeholder="Mã giảm giá (Ví dụ: SENDONG20)"
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
                    ✓ Đang áp dụng mã:{" "}
                    <strong>
                      {appliedCoupon.khuyen_mai?.ma ||
                        appliedCoupon.ma ||
                        couponCode}
                    </strong>{" "}
                    (-{formatPrice(discountAmount)})
                  </p>
                )}
              </div>

              {renderSummaryBoxWithImages()}
            </div>
          </div>
        )}

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

            {createdOrder?.ma_don_hang && (
              <p style={{ color: "#1c3f3a", fontWeight: "bold" }}>
                Mã đơn hàng: {createdOrder.ma_don_hang}
              </p>
            )}

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

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => navigate("/don-hang/cua-toi")}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#2e7d32",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Xem đơn hàng của tôi
              </button>

              <button
                onClick={() => navigate("/", { replace: true })}
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
  boxSizing: "border-box",
  width: "100%",
};

export default CartCheckout;
