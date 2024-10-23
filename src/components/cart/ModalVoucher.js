import { Button, Input, List, Modal } from "antd";
import React, { memo, useEffect, useReducer } from "react";

import { useSelector } from "react-redux";
import { getVoucherList } from "../../services/voucherService";
import VoucherItem from "./VoucherItem";
import VirtualList from "rc-virtual-list";

const ModalVoucher = (props) => {
  const user = useSelector((state) => state.user);
  const { openModalVoucher, handleCancelModalVoucher, cart, total } = props;

  const [state, setState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "shippingVoucher":
          return { ...state, shippingVoucher: action.payload };
        case "discountVoucher":
          return { ...state, discountVoucher: action.payload };
        default:
          return state;
      }
    },
    {
      shippingVoucher: [],
      discountVoucher: [],
    }
  );

  const { shippingVoucher, discountVoucher } = state;

  useEffect(() => {
    const fetchVoucher = async () => {
      const reqData = {
        user_id: user?.user_id,
        totalPayment: total,
        cart: cart,
      };
      const res = await getVoucherList(reqData);
      if (res.success) {
        const discountList = res?.data?.voucherDiscount;
        const freeShipList = res?.data?.voucherFreeShip;
        setState({
          type: "shippingVoucher",
          payload: freeShipList,
        });
        setState({
          type: "discountVoucher",
          payload: discountList,
        });
      }
    };
    if (openModalVoucher) {
      fetchVoucher();
    }
  }, [openModalVoucher]);

  return (
    <Modal
      title={<span className="text-lg font-semibold">Chọn Ezy Voucher</span>}
      open={openModalVoucher}
      onClose={handleCancelModalVoucher}
      onCancel={handleCancelModalVoucher}
      footer={
        <div className="w-full flex justify-end items-center gap-3">
          <Button
            size="large"
            onClick={handleCancelModalVoucher}
            className="bg-white border-secondary text-secondary hover:bg-secondary hover:text-white"
          >
            Trở Lại
          </Button>
          <Button
            size="large"
            className="bg-primary text-white border-primary hover:opacity-80"
          >
            Xác Nhận
          </Button>
        </div>
      }
    >
      <div className="w-full  flex flex-col gap-3">
        {/**Apply Voucher */}
        <div className="w-full grid grid-cols-12 items-center p-3 bg-third gap-3">
          <div className="col-span-3 text-center">Mã Voucher</div>
          <div className="col-span-6">
            <Input placeholder="Mã Ezy Voucher" />
          </div>
          <div className="col-span-3">
            <Button className="w-full bg-primary text-white hover:opacity-80">
              Áp Dụng
            </Button>
          </div>
        </div>
        <div className="flex flex-col w-full max-h-[487px] overflow-y-auto">
          <section>
            <div className="flex flex-col">
              <span className="text-lg">Mã Miễn Phí Vận Chuyển</span>
              <span className="text-neutral-500">Có thể chọn 1 Voucher</span>
            </div>
            {/**List of Voucher*/}
            <List>
              <VirtualList
                data={shippingVoucher}
                height={shippingVoucher?.length > 2 ? 129 * 2 : 129}
                itemHeight={129}
              >
                {(item) => <VoucherItem item={item} />}
              </VirtualList>
            </List>
          </section>
          <section>
            <div className="flex flex-col">
              <span className="text-lg">Mã Giảm Giá Đơn Hàng</span>
              <span className="text-neutral-500">Có thể chọn 1 Voucher</span>
            </div>
            <List>
              <VirtualList
                data={discountVoucher}
                height={discountVoucher?.length > 2 ? 129 * 2 : 129}
                itemHeight={129}
              >
                {(item) => <VoucherItem item={item} />}
              </VirtualList>
            </List>
          </section>
        </div>
      </div>
    </Modal>
  );
};

export default memo(ModalVoucher);
