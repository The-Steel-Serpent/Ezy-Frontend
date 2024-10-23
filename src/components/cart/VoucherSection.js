import React, { memo, useReducer } from "react";
import { TbTicket } from "react-icons/tb";
import ModalVoucher from "./ModalVoucher";
import { Tag } from "antd";
import { useCheckout } from "../../providers/CheckoutProvider";
const VoucherSection = (props) => {
  const { cart, total } = props;
  const { state, setState, handleOpenModalVoucher, handleCancelModalVoucher } =
    useCheckout();

  const { selectedVoucher, openModalVoucher } = state;
  return (
    <>
      <div className="w-full flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <TbTicket className="text-[30px] text-primary" />
          <span className="text-lg">Ezy Voucher</span>
        </div>
        <div className="flex gap-1">
          {selectedVoucher?.discountVoucher && (
            <Tag color="red">Giảm Giá Đơn Hàng</Tag>
          )}
          {selectedVoucher?.shippingVoucher && (
            <Tag color="green">Miễn phí vận chuyển</Tag>
          )}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={handleOpenModalVoucher}
          >
            Chọn Voucher
          </span>
        </div>
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
