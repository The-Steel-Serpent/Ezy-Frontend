import { message } from "antd";

const {
  useReducer,
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} = require("react");
const CheckoutContext = createContext();
export const CheckoutProvider = ({ children }) => {
  const [state, setState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "setDefaultAddress":
          return { ...state, defaultAddress: action.payload };
        case "cartListWithoutInvalidItems":
          return { ...state, cartListWithoutInvalidItems: action.payload };
        case "openAddressModal":
          return { ...state, openAddressModal: action.payload };
        case "openModalVoucher":
          return { ...state, openModalVoucher: action.payload };
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

        default:
          return state;
      }
    },
    {
      defaultAddress: null,
      cartListWithoutInvalidItems: [],
      openAddressModal: false,
      openModalVoucher: false,
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
    }
  );

  const prevTotalRef = useRef([]);
  const prevSelectedVoucherRef = useRef(state.selectedVoucher);
  const handleUpdateTotalPayment = (total) => {
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
  };

  const handleCloseAddressModal = () => {
    setState({ type: "openAddressModal", payload: false });
  };
  const handleOpenAddressModal = () => {
    setState({ type: "openAddressModal", payload: true });
  };

  const handleUpdateTotal = (total) => {
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
  };
  const calculateVoucherDiscounts = useCallback((total, selectedVoucher) => {
    const totalPriceAllShops = total.reduce(
      (sum, shop) => sum + shop.totalPrice,
      0
    );
    const totalShippingFeeAllShops = total.reduce(
      (sum, shop) => sum + shop.shippingFee,
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
        discount_value,
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

  const handleCancelModalVoucher = () => {
    setState({ type: "openModalVoucher", payload: false });
  };
  const handleOpenModalVoucher = () => {
    setState({ type: "openModalVoucher", payload: true });
  };

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

  const handleCheckoutClick = () => {
    //  handle checkout
  };

  useEffect(() => {
    if (state.total.length > 0) {
      handleUpdateTotalPayment(state.total);
    }
  }, [state.total]);

  useEffect(() => {
    const updatedTotal = calculateVoucherDiscounts(
      state.total,
      state.selectedVoucher
    );
    if (JSON.stringify(prevTotalRef.current) !== JSON.stringify(updatedTotal)) {
      updatedTotal.forEach((totalOfShop) => {
        const existingShop = prevTotalRef.current.find(
          (shop) => shop.shop_id === totalOfShop.shop_id
        );
        if (
          !existingShop ||
          existingShop.totalPrice !== totalOfShop.totalPrice ||
          existingShop.discountPrice !== totalOfShop.discountPrice ||
          existingShop.shippingFee !== totalOfShop.shippingFee
        ) {
          handleUpdateTotal(totalOfShop);
        }
      });
      prevTotalRef.current = updatedTotal;
      prevSelectedVoucherRef.current = state.selectedVoucher;
    }
  }, [state.total, state.selectedVoucher, calculateVoucherDiscounts]);

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
        handleCheckoutClick,
        handleSelectVoucher,
        handleConfirmVoucher,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  return useContext(CheckoutContext);
};
