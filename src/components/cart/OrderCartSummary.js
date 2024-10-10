import React, { memo } from "react";

const OrderCartSummary = () => {
  return (
    <div className="w-full bg-white rounded flex flex-col gap-3 p-7">
      <h1 className="text-2xl flex flex-col">
        Tóm Tắt Đơn Hàng
        <span className="text-sm text-neutral-400">
          Giá cuối cùng sẽ được xác nhận khi đặt hàng
        </span>
      </h1>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between py-2 border-b-[1px]">
          <div className="font-semibold">Tổng Tiền Hàng</div>
          <div className="flex justify-center items-center font-semibold">
            <sup>đ</sup> 1.000.000
          </div>
        </div>
        <div className="flex justify-between py-2 border-b-[1px]">
          <div className="font-semibold">Giảm Giá Sản Phẩm</div>
          <div className="flex justify-center items-center font-semibold text-red-700">
            -<sup>đ</sup> 1.000.000
          </div>
        </div>
        <div className="flex flex-col mt-2 gap-3">
          <div className="flex justify-between items-center">
            <div className="font-semibold">Tiết Kiệm</div>
            <div className="flex justify-center items-center font-semibold text-yellow-600">
              <sup>đ</sup> 1.000.000
            </div>
          </div>
          <div className="flex justify-between items-center ">
            <div className="font-semibold flex flex-col ">
              Giá Ước Tính
              <span className="text-sm">(6 sản phẩm)</span>
            </div>
            <div className="flex justify-center items-center font-semibold text-primary text-2xl">
              <sup>đ</sup> 1.000.000
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(OrderCartSummary);
