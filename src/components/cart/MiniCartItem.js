import React, { memo } from "react";

const MiniCartItem = () => {
  return (
    <div className="grid grid-cols-12 p-3 gap-3 hover:bg-slate-200">
      <div className="col-span-2">
        <img
          src="https://down-vn.img.susercontent.com/file/sg-11134201-7rd45-lx4lpxipu4mh6d@resize_w450_nl.webp"
          className="size-9"
        />
      </div>
      <div className="col-span-7">
        <span className="text-ellipsis line-clamp-1">
          2006 ARG Argentina sân khách sân nhà Retro Soccer Jersey Bóng đá Messi
          #19
        </span>
      </div>
      <div className="col-span-3">
        <span className="text-primary text-end text-ellipsis line-clamp-1">
          ₫199.000
        </span>
      </div>
    </div>
  );
};

export default memo(MiniCartItem);
