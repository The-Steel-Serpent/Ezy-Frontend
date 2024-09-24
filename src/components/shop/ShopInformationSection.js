import { Button } from "antd";
import React, { memo } from "react";
import { BsShop } from "react-icons/bs";
import { MdChat } from "react-icons/md";
import formatNumber from "../../helpers/formatNumber";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
const ShopInformationSection = ({ value }) => {
  return (
    <div className="w-full pt-5 px-[25px] pb-[25px] items-center flex  overflow-visible">
      <div className="gap-4 justify-center items-center border-r-[1px] border-solid border-slate-300 flex max-w-[440px] pr-[25px]">
        <a href="#">
          <img className="rounded-full size-20" src={value?.logo_url} />
        </a>
        <div className="flex flex-col gap-2">
          <span className="text-lg font-semibold">{value?.shop_name}</span>
          <div className="flex gap-2">
            <Button className="h-10 text-base" icon={<MdChat />}>
              Chat Ngay
            </Button>
            <Button
              className="h-10 text-base border-slate-300 text-slate-800 hover:bg-slate-50 opacity-95"
              icon={<BsShop />}
            >
              Xem Shop
            </Button>
          </div>
        </div>
      </div>
      <div className="flex gap-10 pl-[25px]  text-lg">
        <div className="flex flex-row justify-between outline-0 overflow-visible gap-6">
          <label className="mr-3 text-slate-400 ">Đánh Giá</label>
          <span className="text-primary">
            {formatNumber(value?.total_reviews || 0)}
          </span>
        </div>
        <div className="flex flex-row justify-between outline-0 overflow-visible">
          <label className="mr-3 text-slate-400">Sản phẩm</label>
          <span className="text-primary">
            {formatNumber(value?.total_product || 0)}
          </span>
        </div>

        <div className="flex flex-row justify-between outline-0 overflow-visible gap-6">
          <label className="mr-3 text-slate-400">Tham Gia</label>
          <span className="text-primary">
            {value?.created_at
              ? formatDistanceToNow(new Date(value.created_at), {
                  addSuffix: true,
                  locale: vi,
                })
              : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(ShopInformationSection);
