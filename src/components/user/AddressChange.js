import { PlusOutlined } from "@ant-design/icons";
import { Button, List } from "antd";
import React, { memo } from "react";
import AddressItem from "../address/AddressItem";

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
  return (
    <>
      <div className=" bg-white w-full border-b-[1px]">
        <div className="flex justify-between items-center px-7 py-5">
          <span className="text-xl font-garibato">Địa chỉ của tôi</span>
          <Button className="bg-primary border-primary text-white hover:opacity-80 py-6">
            <PlusOutlined /> Thêm địa chỉ mới
          </Button>
        </div>
      </div>
      <div className="bg-white w-full px-7 py-5 h-fit flex flex-col gap-2">
        <span className="text-lg">Địa chỉ</span>
        <section>
          <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item) => (
              <List.Item>
                <AddressItem item={item} />
              </List.Item>
            )}
          />
        </section>
      </div>
    </>
  );
};

export default memo(AddressChange);
