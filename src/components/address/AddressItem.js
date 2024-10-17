import { Button, message, Modal } from "antd";
import React, { memo, useReducer } from "react";
import AddressInforModal from "./AddressInforModal";
import {
  deleteAddress,
  setDefaultAddress,
} from "../../services/addressService";
import { WarningFilled } from "@ant-design/icons";

const AddressItem = (props) => {
  const { item, handleOpenModal, fetchAddress } = props;
  const [state, setState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "openRemoveModal":
          return { ...state, openRemoveModal: action.payload };
        default:
          return state;
      }
    },
    {
      openRemoveModal: false,
    }
  );

  const { openRemoveModal } = state;

  const handleRemoveAddress = async () => {
    try {
      const response = await deleteAddress(item?.user_address_id);
      if (response.success) {
        message.success("Xóa địa chỉ thành công");

        await fetchAddress();
        setState({ type: "openRemoveModal", payload: false });
      }
    } catch (error) {
      console.log("Lỗi khi xóa địa chỉ: ", error);
      message.error(error?.response?.data?.message || error.message);
    }
  };
  const handleSetDefaultAddress = async () => {
    try {
      const response = await setDefaultAddress(
        item?.user_id,
        item?.user_address_id
      );
      if (response.success) {
        message.success("Đặt địa chỉ mặc định thành công");
        fetchAddress();
      }
    } catch (error) {
      console.log("Lỗi khi đặt địa chỉ mặc định: ", error);
      message.error(error?.response?.data?.message || error.message);
    }
  };

  const handleCancelRemoveModal = () => {
    setState({ type: "openRemoveModal", payload: false });
  };
  const handleOpenRemoveModal = () => {
    setState({ type: "openRemoveModal", payload: true });
  };

  return (
    <>
      <div className="w-full flex flex-col gap-1 py-3">
        <div className="flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <span className="text-lg font-semibold border-r-[1px] pr-3">
              {item?.full_name}
            </span>
            <span className="text-base text-neutral-500">
              {item?.phone_number}
            </span>
          </div>
          <div className="flex gap-3">
            <span
              className="text-base text-blue-500 cursor-pointer"
              onClick={() => handleOpenModal("edit", item)}
            >
              Cập Nhật
            </span>
            {item?.isDefault !== 1 && (
              <span
                className="text-base text-blue-500 cursor-pointer"
                onClick={handleOpenRemoveModal}
              >
                Xóa
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-base text-neutral-500 line-clamp-2 text-ellipsis">
              {item?.address}
            </span>
          </div>
          <div className="">
            <Button
              disabled={item?.isDefault === 1 ? true : false}
              onClick={handleSetDefaultAddress}
            >
              Thiết Lập Mặc Định
            </Button>
          </div>
        </div>
        {item?.isDefault === 1 && (
          <span className="rounded border-primary bg-white text-primary px-2 py-1 border-[1px] w-fit ">
            Mặc định
          </span>
        )}
      </div>
      <Modal
        title={
          <span className="text-2xl">
            <WarningFilled className="text-yellow-400" /> Xóa Địa Chỉ
          </span>
        }
        open={openRemoveModal}
        onCancel={handleCancelRemoveModal}
        onOk={handleRemoveAddress}
        okButtonProps={{ className: "bg-primary text-white hover:opacity-80" }}
        cancelButtonProps={{
          className:
            "bg-white text-primary hover:bg-secondary hover:text-white hover:border-secondary",
        }}
        okText="Đồng ý"
        cancelText="Trở lại"
      >
        <p className="text-lg">Bạn có chắc chắn muốn xóa địa chỉ này không?</p>
      </Modal>
    </>
  );
};

export default memo(AddressItem);
