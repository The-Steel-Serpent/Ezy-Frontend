import { Radio } from "antd";
import React, { memo, useEffect, useReducer } from "react";

const MyAddressItem = (props) => {
  const { item, handleOpenModal, isSelected, handleOnRadioChange } = props;

  return (
    <div className="w-full grid grid-cols-12">
      <div className="col-span-1 flex items-start justify-center">
        <Radio
          className=""
          checked={isSelected}
          onChange={handleOnRadioChange}
        />
      </div>

      <div className="col-span-9 flex flex-col gap-2">
        <div className="flex items-center">
          <span className="text-base font-bold">{item?.full_name}</span>
          <span className="mx-2">-</span>
          <span className="">{item?.phone_number}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="break-words">{item?.address}</span>
          {item?.isDefault === 1 && (
            <span className="px-2 py-1 border-primary text-primary border-[1px] w-fit">
              Mặc định
            </span>
          )}
        </div>
      </div>
      <div className="col-span-2">
        <span
          className="text-blue-500 cursor-pointer"
          onClick={handleOpenModal}
        >
          Cập Nhật
        </span>
      </div>
    </div>
  );
};

export default memo(MyAddressItem);
