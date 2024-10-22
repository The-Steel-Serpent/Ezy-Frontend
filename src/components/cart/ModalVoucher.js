import { Button, Input, Modal } from "antd";
import React, { memo } from "react";

import { useSelector } from "react-redux";

const ModalVoucher = (props) => {
  const user = useSelector((state) => state.user);
  const { openModalVoucher, handleCancelModalVoucher, cart } = props;
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
      </div>
    </Modal>
  );
};

export default memo(ModalVoucher);
