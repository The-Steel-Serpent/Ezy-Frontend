import React, { memo, useReducer } from "react";
import { TbTicket } from "react-icons/tb";
import ModalVoucher from "./ModalVoucher";
const VoucherSection = (props) => {
  const { cart, total } = props;
  const [state, setState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "openModalVoucher":
          return { ...state, openModalVoucher: action.payload };
        default:
          return state;
      }
    },
    {
      openModalVoucher: true,
    }
  );

  const { openModalVoucher } = state;

  const handleCancelModalVoucher = () => {
    setState({ type: "openModalVoucher", payload: false });
  };
  const handleOpenModalVoucher = () => {
    setState({ type: "openModalVoucher", payload: true });
  };
  return (
    <>
      <div className="w-full flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <TbTicket className="text-[30px] text-primary" />
          <span className="text-lg">Ezy Voucher</span>
        </div>
        <span
          className="text-blue-500 cursor-pointer"
          onClick={handleOpenModalVoucher}
        >
          Chọn Voucher
        </span>
      </div>
      <ModalVoucher
        cart={cart}
        total={total}
        openModalVoucher={openModalVoucher}
        handleCancelModalVoucher={handleCancelModalVoucher}
      />
    </>
  );
};

export default memo(VoucherSection);
