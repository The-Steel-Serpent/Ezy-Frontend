import { message } from "antd";
import {
  checkOut,
  checkOutCOD,
  checkOutEzyWallet,
  checkOutMomo,
  checkOutVNPay,
} from "../services/cartService";
import { useNavigate } from "react-router-dom";
import { verifyOTP } from "../services/userService";

const {
  useReducer,
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
} = require("react");
const CheckoutContext = createContext();
export const CheckoutProvider = ({ children }) => {
  const navigate = useNavigate();

  const [state, setState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "loading":
          return { ...state, loading: action.payload };
        case "setUID":
          return { ...state, uid: action.payload };
        case "setDefaultAddress":
          return { ...state, defaultAddress: action.payload };
        case "isFetchingAddress":
          return { ...state, isFetchingAddress: action.payload };
        case "cartListWithoutInvalidItems":
          return { ...state, cartListWithoutInvalidItems: action.payload };
        case "openAddressModal":
          return { ...state, openAddressModal: action.payload };
        case "openModalVoucher":
          return { ...state, openModalVoucher: action.payload };
        case "openModalCheckoutError":
          return { ...state, openModalCheckoutError: action.payload };
        case "openModalOTP":
          return { ...state, openModalOTP: action.payload };
        case "verifyOTP":
          return { ...state, verifyOTP: action.payload };
        case "checkoutMessage":
          return { ...state, checkoutMessage: action.payload };
        case "updateTotal":
          const existingShopIndex = state.total.findIndex(
            (total) => total.shop_id === action.payload.shop_id
          );
          let updatedTotal;
          if (existingShopIndex !== -1) {
            updatedTotal = [...state.total];
            updatedTotal[existingShopIndex] = action.payload;
          } else {
            updatedTotal = [...state.total, action.payload];
          }

          return { ...state, total: updatedTotal };

        case "updateTotalPayment": {
          return { ...state, totalPayment: action.payload };
        }
        case "selectingVoucher": {
          return {
            ...state,
            selectingVoucher: action.payload,
          };
        }
        case "updateSelectedVoucher": {
          return {
            ...state,
            selectedVoucher: action.payload,
          };
        }

        case "shippingVoucher":
          return { ...state, shippingVoucher: action.payload };
        case "discountVoucher":
          return { ...state, discountVoucher: action.payload };
        case "selectedPaymentMethod":
          return { ...state, selectedPaymentMethod: action.payload };

        case "isUpdatedTotalPayment":
          return { ...state, isUpdatedTotalPayment: action.payload };

        case "selectedService":
          const existingShopOfServiceIndex = state.selectedService.findIndex(
            (service) => service.shop_id === action.payload.shop_id
          );
          let updatedService;
          if (existingShopOfServiceIndex !== -1) {
            updatedService = [...state.selectedService];
            updatedService[existingShopOfServiceIndex] = action.payload;
          } else {
            updatedService = [...state.selectedService, action.payload];
          }
          return { ...state, selectedService: updatedService };

        default:
          return state;
      }
    },
    {
      uid: null,
      loading: false,
      defaultAddress: null,
      isFetchingAddress: false,
      verifyOTP: false,
      cartListWithoutInvalidItems: [],
      openAddressModal: false,
      openModalVoucher: false,
      openModalOTP: false,
      checkoutMessage: "",
      openModalCheckoutError: false,
      total: [],

      shippingVoucher: [],
      discountVoucher: [],
      selectingVoucher: {
        shippingVoucher: null,
        discountVoucher: null,
      },
      selectedVoucher: {
        shippingVoucher: null,
        discountVoucher: null,
      },
      totalPayment: {
        totalPrice: 0,
        shippingFee: 0,
        discountPrice: 0,
        discountShippingFee: 0,
        final: 0,
      },
      isUpdatedTotalPayment: false,
      selectedPaymentMethod: 1,
      selectedService: [],
    }
  );
  const handleUpdateSelectedService = useCallback((service) => {
    const { shop_id, service_id, service_type_id } = service;
    setState({
      type: "selectedService",
      payload: {
        shop_id,
        service_id,
        service_type_id,
      },
    });
  }, []);
  const handleUpdateTotalPayment = useCallback((total) => {
    setState({
      type: "updateTotalPayment",
      payload: total.reduce(
        (acc, cur) => {
          return {
            totalPrice: acc.totalPrice + cur.totalPrice,
            shippingFee: acc.shippingFee + cur.shippingFee,
            discountPrice: acc.discountPrice + cur.discountPrice,
            discountShippingFee:
              acc.discountShippingFee + cur.discountShippingFee,
            final:
              acc.final +
              cur.totalPrice +
              cur.shippingFee -
              cur.discountPrice -
              cur.discountShippingFee,
          };
        },
        {
          totalPrice: 0,
          shippingFee: 0,
          discountPrice: 0,
          discountShippingFee: 0,
          final: 0,
        }
      ),
    });
  }, []);
  const handleCloseModalOTP = () => {
    setState({ type: "openModalOTP", payload: false });
  };
  const handleCloseAddressModal = () => {
    setState({ type: "openAddressModal", payload: false });
  };
  const handleOpenAddressModal = () => {
    setState({ type: "openAddressModal", payload: true });
  };

  const handleUpdateTotal = useCallback((total) => {
    const {
      shop_id,
      totalPrice,
      shippingFee,
      discountPrice,
      discountShippingFee,
    } = total;
    setState({
      type: "updateTotal",
      payload: {
        shop_id,
        totalPrice,
        shippingFee,
        discountPrice,
        discountShippingFee,
      },
    });
  }, []);

  const handleCancelModalVoucher = () => {
    setState({ type: "openModalVoucher", payload: false });
  };
  const handleOpenModalVoucher = () => {
    setState({ type: "openModalVoucher", payload: true });
  };

  const calculateVoucherDiscounts = useCallback((total, selectedVoucher) => {
    const totalPriceAllShops = total.reduce(
      (sum, shop) => sum + (shop.totalPrice || 0),
      0
    );
    const totalShippingFeeAllShops = total.reduce(
      (sum, shop) => sum + (shop.shippingFee || 0),
      0
    );

    const { shippingVoucher, discountVoucher } = selectedVoucher;
    let totalDiscountPrice = 0;
    let totalDiscountShippingFee = 0;

    if (discountVoucher) {
      const {
        discount_type,
        discount_value,
        discount_max_value,
        min_order_value,
      } = discountVoucher;
      if (totalPriceAllShops >= min_order_value) {
        if (discount_type === "THEO PHẦN TRĂM") {
          totalDiscountPrice = Math.min(
            (discount_value / 100) * totalPriceAllShops,
            discount_max_value
          );
        } else if (discount_type === "KHÔNG THEO PHẦN TRĂM") {
          totalDiscountPrice = Math.min(discount_value, totalPriceAllShops);
        }
      }
    }

    if (shippingVoucher) {
      const { discount_value } = shippingVoucher;
      totalDiscountShippingFee = Math.min(
        discount_value || 0,
        totalShippingFeeAllShops
      );
    }

    return total.map((shop) => {
      const shopPriceRatio = shop.totalPrice / totalPriceAllShops;
      const shopShippingFeeRatio = shop.shippingFee / totalShippingFeeAllShops;

      const discountPrice = Math.round(totalDiscountPrice * shopPriceRatio);
      const discountShippingFee = Math.round(
        totalDiscountShippingFee * shopShippingFeeRatio
      );
      return {
        shop_id: shop.shop_id,
        totalPrice: shop.totalPrice,
        shippingFee: shop.shippingFee,
        discountPrice,
        discountShippingFee,
      };
    });
  }, []);

  const handleSelectVoucher = (type, voucher) => {
    setState({
      type: "selectingVoucher",
      payload: {
        ...state.selectingVoucher,
        [type === 1 ? "shippingVoucher" : "discountVoucher"]: voucher,
      },
    });
  };

  const handleConfirmVoucher = (selectingVoucher) => {
    setState({
      type: "updateSelectedVoucher",
      payload: {
        shippingVoucher: selectingVoucher.shippingVoucher,
        discountVoucher: selectingVoucher.discountVoucher,
      },
    });
    setState({
      type: "selectingVoucher",
      payload: {
        shippingVoucher: null,
        discountVoucher: null,
      },
    });
    message.success("Cập nhật voucher Thành Công");
    handleCancelModalVoucher();
  };

  const handleApplyVoucher = (couponCode) => {
    const { discountVoucher, shippingVoucher } = state;
    let isFounded = false;
    if (couponCode.length === 0) {
      message.error("Vui lòng nhập mã giảm giá");
      return;
    }

    if (discountVoucher.length > 0 && !isFounded) {
      const selectedDiscountVoucher = discountVoucher.find(
        (voucher) =>
          voucher.discount_voucher_code === couponCode &&
          voucher.isVoucherValid === true
      );
      if (selectedDiscountVoucher) {
        handleSelectVoucher(2, selectedDiscountVoucher);
        isFounded = true;
      }
    }
    if (shippingVoucher.length > 0 && !isFounded) {
      const selectedShippingVoucher = shippingVoucher.find(
        (voucher) =>
          voucher.discount_voucher_code === couponCode &&
          voucher.isVoucherValid === true
      );
      if (selectedShippingVoucher) {
        handleSelectVoucher(1, selectedShippingVoucher);
        isFounded = true;
      }
    }
    if (!isFounded) {
      message.error("Mã giảm giá không hợp lệ");
    } else {
      message.success("Áp dụng mã giảm giá thành công");
    }
  };

  const handleOnVerifyOTP = () => {
    setState({ type: "verifyOTP", payload: true });
  };

  const onPaymentMethodChange = (e) => {
    setState({ type: "selectedPaymentMethod", payload: e.target.value });
  };
  const handleCheckoutClick = (userID) => {
    // console.log("User ID: ", userID);
    // console.log("Payment Method: ", state.selectedPaymentMethod);
    // console.log("Cart List: ", state.cartListWithoutInvalidItems);
    // console.log("Total Payment: ", state.totalPayment);
    // console.log("selectedVoucher: ", state.selectedVoucher);
    // console.log("totalPerItem: ", state.total);
    // console.log("click: ", true);
    setState({ type: "loading", payload: true });
    setState({ type: "setUID", payload: userID });
    setState({ type: "openModalOTP", payload: true });
  };
  useEffect(() => {
    console.log("selectedService: ", state.selectedService);
  }, [state.selectedService]);

  useEffect(() => {
    const checkoutMethod = async () => {
      const data = {
        user_id: state.uid,
        totalPayment: state.totalPayment,
        totalPerItem: state.total,
        validCart: state.cartListWithoutInvalidItems,
        address: state.defaultAddress,
        voucher: state.selectedVoucher || {},
        selectedService: state.selectedService,
      };
      // console.log("Data: ", data);
      try {
        const type =
          state.selectedPaymentMethod === 1
            ? "cod"
            : state.selectedPaymentMethod === 2
            ? "momo"
            : state.selectedPaymentMethod === 3
            ? "vnpay"
            : "ezywallet";
        const res = await checkOut(data, type);
        if (res.success) {
          console.log("Checkout Success: ", res);
          if (res.paymentUrl) {
            window.location.href = res.paymentUrl;
          } else {
            navigate("/cart/checkout/result?status=success");
          }
        }
      } catch (error) {
        console.log("Error: ", error.message);
        setState({ type: "openModalCheckoutError", payload: true });
        setState({ type: "checkoutMessage", payload: error.message || error });
      }
    };
    if (state.verifyOTP === true) {
      checkoutMethod();
    }
  }, [state.verifyOTP]);

  return (
    <CheckoutContext.Provider
      value={{
        state,
        setState,
        handleCloseAddressModal,
        handleOpenAddressModal,
        handleCancelModalVoucher,
        handleOpenModalVoucher,
        handleUpdateTotal,
        handleUpdateTotalPayment,
        handleCheckoutClick,
        handleSelectVoucher,
        handleConfirmVoucher,
        calculateVoucherDiscounts,
        handleApplyVoucher,
        onPaymentMethodChange,
        handleCloseModalOTP,
        handleOnVerifyOTP,
        handleUpdateSelectedService,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  return useContext(CheckoutContext);
};
