import React, { memo } from "react";
import { BsShop } from "react-icons/bs";
import { MdChat } from "react-icons/md";
import formatNumber from "../../helpers/formatNumber";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "antd";
import { RiProductHuntLine } from "react-icons/ri";
import { FaRegStar } from "react-icons/fa";
import { FaRegCommentDots } from "react-icons/fa";

const ShopCard = ({ value }) => {
  return (
    <div className="hover:shadow-lg w-full pt-5 px-[25px] pb-[25px] bg-white items-center flex  overflow-visible justify-between ">
      <div className="gap-4 justify-center items-center  flex max-w-[440px] pr-[25px]">
        <a href={`/shop/${value?.UserAccount?.username}`}>
          <img className="rounded-full size-20" src={value?.logo_url} />
        </a>

        <div className="flex flex-col">
          <span className="text-lg font-semibold">{value?.shop_name}</span>
          <span className="text-sm">{value?.UserAccount?.username}</span>
        </div>
      </div>
      <div className="flex gap-10 pl-[25px]  text-lg border-l-[1px] border-solid border-slate-300 ">
        <div className="flex flex-col">
          <div className="flex text-primary justify-center items-center gap-2">
            <RiProductHuntLine />
            <span className="">{formatNumber(value?.total_product || 0)}</span>
          </div>
          <span className="text-slate-500 text-center text-sm">Sản Phẩm</span>
        </div>
        <div className="flex flex-col">
          <div className="flex text-primary justify-center items-center gap-2">
            <FaRegStar />
            <span className="">{formatNumber(value?.total_ratings || 0)}</span>
          </div>
          <span className="text-slate-500 text-center text-sm">Đánh Giá</span>
        </div>
        <div className="flex flex-col">
          <div className="flex text-primary justify-center items-center gap-2">
            <FaRegCommentDots />
            <span className="">{formatNumber(value?.total_reviews || 0)}</span>
          </div>
          <span className="text-slate-500 text-center text-sm">
            Lượt Đánh Giá
          </span>
        </div>
        <div className="flex gap-2">
          <Button className="h-10 text-base" icon={<MdChat />}>
            Chat Ngay
          </Button>
          <Button
            className="h-10 text-base border-slate-300 text-slate-800 hover:bg-slate-50 opacity-95 cursor-pointer"
            icon={<BsShop />}
            onClick={() =>
              (window.location.href = `/shop/${value?.UserAccount?.username}`)
            }
          >
            Xem Shop
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(ShopCard);
