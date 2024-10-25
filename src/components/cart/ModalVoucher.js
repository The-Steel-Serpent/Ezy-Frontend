import { Button, Input, List, Modal } from "antd";
import React, { memo, useEffect, useReducer, useState } from "react";

import { useSelector } from "react-redux";
import { getVoucherList } from "../../services/voucherService";
import VoucherItem from "./VoucherItem";
import VirtualList from "rc-virtual-list";
import { useCheckout } from "../../providers/CheckoutProvider";

const ModalVoucher = (props) => {
  const user = useSelector((state) => state.user);

  const [localState, setLocalState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "couponCode":
          return { ...state, couponCode: action.payload };
        default:
          return state;
      }
    },
    {
      couponCode: "",
    }
  );

  const { openModalVoucher, handleCancelModalVoucher, cart } = props;
  const { couponCode } = localState;
  const {
    state,
    setState,
    handleSelectVoucher,
    handleConfirmVoucher,
    handleApplyVoucher,
  } = useCheckout();

  const {
    shippingVoucher,
    discountVoucher,
    totalPayment,
    selectedVoucher,
    selectingVoucher,
  } = state;

  const onCouponCodeChange = (e) => {
    const coupon = e.target.value;
    setLocalState({
      type: "couponCode",
      payload: coupon,
    });
  };

  useEffect(() => {
    const fetchVoucher = async () => {
      try {
        const reqData = {
          user_id: user?.user_id,
          totalPayment: totalPayment,
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
      } catch (error) {
        setState({
          type: "shippingVoucher",
          payload: [],
        });
        setState({
          type: "discountVoucher",
          payload: [],
        });
      }
    };
    if (openModalVoucher) {
      fetchVoucher();
    }
  }, [openModalVoucher, cart, totalPayment, user?.user_id]);

  useEffect(() => {
    if (selectedVoucher) {
      setState({
        type: "selectingVoucher",
        payload: {
          shippingVoucher: selectedVoucher?.shippingVoucher,
          discountVoucher: selectedVoucher?.discountVoucher,
        },
      });
    }
  }, [openModalVoucher, selectedVoucher]);

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
            onClick={() => handleConfirmVoucher(selectingVoucher)}
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
            <Input
              placeholder="Mã Ezy Voucher"
              name="couponCode"
              onChange={onCouponCodeChange}
            />
          </div>
          <div className="col-span-3">
            <Button
              className="w-full bg-primary text-white hover:opacity-80"
              onClick={() => handleApplyVoucher(couponCode)}
            >
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
            {shippingVoucher.length === 0 ? (
              <List dataSource={shippingVoucher} />
            ) : (
              <List>
                <VirtualList
                  data={shippingVoucher}
                  height={shippingVoucher?.length > 1 ? 129 * 2 : 129}
                  itemHeight={129}
                >
                  {(item) => (
                    <VoucherItem
                      isSelected={
                        selectingVoucher?.shippingVoucher
                          ?.discount_voucher_id === item?.discount_voucher_id
                      }
                      item={item}
                      onCheckboxChange={(e) =>
                        handleSelectVoucher(1, e.target.checked ? item : null)
                      }
                    />
                  )}
                </VirtualList>
              </List>
            )}
          </section>
          <section>
            <div className="flex flex-col">
              <span className="text-lg">Mã Giảm Giá Đơn Hàng</span>
              <span className="text-neutral-500">Có thể chọn 1 Voucher</span>
            </div>
            {discountVoucher.length === 0 ? (
              <List dataSource={discountVoucher} />
            ) : (
              <List>
                <VirtualList
                  data={discountVoucher}
                  height={discountVoucher?.length > 2 ? 129 * 2 : 129}
                  itemHeight={129}
                >
                  {(item) => (
                    <VoucherItem
                      isSelected={
                        selectingVoucher?.discountVoucher
                          ?.discount_voucher_id === item?.discount_voucher_id
                      }
                      item={item}
                      onCheckboxChange={(e) =>
                        handleSelectVoucher(2, e.target.checked ? item : null)
                      }
                    />
                  )}
                </VirtualList>
              </List>
            )}
          </section>
        </div>
      </div>
    </Modal>
  );
};

export default memo(ModalVoucher);
