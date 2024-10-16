import { Button } from "antd";
import React, { memo } from "react";

const AddressItem = (props) => {
  const { item } = props;
  return (
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
          <span className="text-base text-blue-500 cursor-pointer">
            Cập Nhật
          </span>
          {item?.isDefault !== 1 && (
            <span className="text-base text-blue-500 cursor-pointer">Xóa</span>
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
          <Button disabled={item?.isDefault === 1 ? true : false}>
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
  );
};

export default memo(AddressItem);
