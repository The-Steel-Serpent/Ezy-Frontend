import { message } from "antd";

const { useReducer, createContext, useContext } = require("react");
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
