import { PlusOutlined } from "@ant-design/icons";
import { Button, List } from "antd";
import React, { memo, useEffect, useReducer } from "react";
import AddressItem from "../address/AddressItem";
import AddressInforModal from "../address/AddressInforModal";
import { useSelector } from "react-redux";
import { getAddresses } from "../../services/addressService";

const data = [
  {
    full_name: "Dung Ho",
    phone_number: "0123456789",
    address: "123 Nguyen Trai, Thanh Xuan, Ha Noi",
    isDefault: 1,
  },
  {
    full_name: "Dung Ho",
    phone_number: "0123456789",
    address: "123 Nguyen Trai, Thanh Xuan, Ha Noi",
    isDefault: 0,
  },
  {
    full_name: "Dung Ho",
    phone_number: "0123456789",
    address: "123 Nguyen Trai, Thanh Xuan, Ha Noi",
    isDefault: 0,
  },
  {
    full_name: "Dung Ho",
    phone_number: "0123456789",
    address: "123 Nguyen Trai, Thanh Xuan, Ha Noi",
    isDefault: 0,
  },
];
const AddressChange = () => {
  const user = useSelector((state) => state.user);
  const [state, setState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "openModal":
          return { ...state, openModal: action.payload };
        case "listAddress":
          return { ...state, listAddress: action.payload };
        case "setType":
          return { ...state, type: action.payload };
        case "currentAddressItemSelected":
          return { ...state, currentAddressItemSelected: action.payload };
        default:
          return state;
      }
    },
    {
      listAddress: [],
      openModal: false,
      type: "add",
      currentAddressItemSelected: null,
    }
  );
  const { listAddress, openModal, type, currentAddressItemSelected } = state;

  const fetchAddress = async () => {
    try {
      const res = await getAddresses(user?.user_id);
      if (res.success) {
        setState({ type: "listAddress", payload: res.data });
      }
    } catch (error) {
      console.error("Lỗi khi lấy địa chỉ: ", error?.response?.data?.message);
    }
  };

  const handleOpenModal = (type, item = null) => {
    setState({ type: "openModal", payload: true });
    setState({ type: "setType", payload: type });
    if (item) {
      setState({ type: "currentAddressItemSelected", payload: item });
    }
  };
  const handleCancel = () => {
    setState({ type: "openModal", payload: false });
    setState({ type: "setType", payload: "add" });
    setState({ type: "currentAddressItemSelected", payload: null });
  };

  useEffect(() => {
    if (user?.user_id) {
      fetchAddress();
    }
  }, [user?.user_id]);

  return (
    <>
      <div className=" bg-white w-full border-b-[1px]">
        <div className="flex justify-between items-center px-7 py-5">
          <span className="text-xl font-garibato">Địa chỉ của tôi</span>
          <Button
            onClick={() => {
              handleOpenModal("add");
            }}
            className="bg-primary border-primary text-white hover:opacity-80 py-6"
          >
            <PlusOutlined /> Thêm địa chỉ mới
          </Button>
        </div>
      </div>
      <div className="bg-white w-full px-7 py-5 h-fit flex flex-col gap-2">
        <span className="text-lg">Địa chỉ</span>
        <section>
          <List
            itemLayout="horizontal"
            dataSource={listAddress}
            renderItem={(item) => (
              <List.Item>
                <AddressItem
                  item={item}
                  handleOpenModal={() => {
                    handleOpenModal("edit", item);
                  }}
                  fetchAddress={fetchAddress}
                />
              </List.Item>
            )}
          />
        </section>
      </div>

      <AddressInforModal
        openModal={openModal}
        handleCancel={handleCancel}
        type={type}
        currentAddressItemSelected={currentAddressItemSelected}
        fetchAddress={fetchAddress}
      />
    </>
  );
};

export default memo(AddressChange);
