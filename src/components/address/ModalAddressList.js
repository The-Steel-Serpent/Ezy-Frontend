import { Button, Empty, List, message, Modal } from "antd";
import React, { memo, useEffect, useReducer } from "react";
import VirtualList from "rc-virtual-list";
import MyAddressItem from "./MyAddressItem";
import { PlusOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { getAddresses, setDefaultAddress } from "../../services/addressService";
import AddressInforModal from "./AddressInforModal";

const ModalAddressList = (props) => {
  const user = useSelector((state) => state.user);
  const { openAddressModal, handleCloseAddressModal, fetchDefaultAddress } =
    props;

  const [state, setState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "addressList":
          return { ...state, addressList: action.payload };
        case "openAddNewAddressModal":
          return { ...state, openAddNewAddressModal: action.payload };
        case "currentAddressItemSelected":
          return { ...state, currentAddressItemSelected: action.payload };
        case "type":
          return { ...state, type: action.payload };
        default:
          return state;
      }
    },
    {
      addressList: [],
      type: "add",
      currentAddressItemSelected: null,
      openAddNewAddressModal: false,
    }
  );

  const {
    addressList,
    openAddNewAddressModal,
    currentAddressItemSelected,
    type,
  } = state;
  const handleOpenAddNewAddressModal = (type, item = null) => {
    setState({ type: "openAddNewAddressModal", payload: true });
    setState({ type: "type", payload: type });
    if (item) {
      setState({ type: "currentAddressItemSelected", payload: item });
    }
  };
  const handleCloseAddNewAddressModal = () => {
    setState({ type: "openAddNewAddressModal", payload: false });
    setState({ type: "type", payload: "add" });
    setState({ type: "currentAddressItemSelected", payload: null });
    setState({ type: "addressList", payload: [] });
  };
  const fetchAddress = async () => {
    try {
      const response = await getAddresses(user?.user_id);
      if (response.success) {
        setState({ type: "addressList", payload: response.data });
      }
    } catch (error) {
      console.log("Lỗi khi lấy danh sách địa chỉ: ", error);
    }
  };

  const handleConfirm = async () => {
    const defaultAddress = addressList.find((item) => item.isDefault === 1);
    if (!defaultAddress) {
      message.error("Vui lòng chọn địa chỉ mặc định");
      return;
    }
    try {
      const response = await setDefaultAddress(
        user?.user_id,
        defaultAddress.user_address_id
      );
      if (response.success) {
        message.success("Đã cập nhật địa chỉ mặc định");
        await fetchDefaultAddress();
        handleCloseAddressModal();
      }
    } catch (error) {
      console.log("Lỗi khi cập nhật địa chỉ mặc định: ", error);
      message.error(error?.response?.data?.message || error.message);
    }
  };

  const handleOnRadioChange = (user_address_id) => {
    const updatedAddressList = addressList.map((item) =>
      item.user_address_id === user_address_id
        ? { ...item, isDefault: 1 }
        : { ...item, isDefault: 0 }
    );

    setState({ type: "addressList", payload: updatedAddressList });
  };

  const handleCloseAddressesModal = () => {
    handleCloseAddressModal();
    setState({ type: "addressList", payload: [] });
  };

  useEffect(() => {
    if (openAddressModal) {
      fetchAddress();
    }
  }, [openAddressModal]);

  return (
    <>
      <Modal
        title="Địa Chỉ Của Tôi"
        open={openAddressModal}
        onCancel={handleCloseAddressesModal}
        footer={
          <div className="flex justify-between items-center">
            <Button
              size="large"
              className=""
              onClick={() => handleOpenAddNewAddressModal("add")}
            >
              <PlusOutlined />
              Thêm địa chỉ mới
            </Button>
            <div className="flex items-center gap-2">
              <Button
                size="large"
                className="border-secondary text-secondary hover:bg-secondary hover:text-white"
                onClick={handleCloseAddressesModal}
              >
                Hủy
              </Button>
              <Button
                size="large"
                className="bg-primary text-white border-primary hover:opacity-80"
                onClick={handleConfirm}
              >
                Xác nhận
              </Button>
            </div>
          </div>
        }
      >
        {addressList.length === 0 ? (
          <div className="h-[500px] flex justify-center items-center">
            <Empty className="" description="Không có địa chỉ nào" />
          </div>
        ) : (
          <List>
            <VirtualList data={addressList} height={500} itemHeight={100}>
              {(dataItem) => (
                <List.Item>
                  <MyAddressItem
                    item={dataItem}
                    isSelected={dataItem.isDefault === 1}
                    handleOpenModal={() =>
                      handleOpenAddNewAddressModal("update", dataItem)
                    }
                    handleOnRadioChange={() =>
                      handleOnRadioChange(dataItem.user_address_id)
                    }
                    fetchAddress={fetchAddress}
                  />
                </List.Item>
              )}
            </VirtualList>
          </List>
        )}
      </Modal>
      <AddressInforModal
        type={type}
        openModal={openAddNewAddressModal}
        handleCancel={handleCloseAddNewAddressModal}
        fetchAddress={fetchAddress}
        currentAddressItemSelected={currentAddressItemSelected}
      />
    </>
  );
};

export default memo(ModalAddressList);
