import { Avatar, Checkbox, Tree } from "antd";
import React, { memo } from "react";
import CartItem from "./CartItem";

const CartShop = (props) => {
  const { item } = props;
  console.log("item: ", item);

  return (
    <div className=" flex flex-col w-full gap-1">
      <div className="flex py-3 gap-3  items-center border-b-[1px] border-b-slate-200">
        <Checkbox className="ml-3 checkbox-cart" />
        <Avatar src={item?.Shop?.logo_url} size={40} />
        <span className="text-lg font-semibold">{item?.Shop?.shop_name}</span>
        <div className="size-5 fill-primary cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M18 6.07a1 1 0 01.993.883L19 7.07v10.365a1 1 0 01-1.64.768l-1.6-1.333H6.42a1 1 0 01-.98-.8l-.016-.117-.149-1.783h9.292a1.8 1.8 0 001.776-1.508l.018-.154.494-6.438H18zm-2.78-4.5a1 1 0 011 1l-.003.077-.746 9.7a1 1 0 01-.997.923H4.24l-1.6 1.333a1 1 0 01-.5.222l-.14.01a1 1 0 01-.993-.883L1 13.835V2.57a1 1 0 011-1h13.22zm-4.638 5.082c-.223.222-.53.397-.903.526A4.61 4.61 0 018.2 7.42a4.61 4.61 0 01-1.48-.242c-.372-.129-.68-.304-.902-.526a.45.45 0 00-.636.636c.329.33.753.571 1.246.74A5.448 5.448 0 008.2 8.32c.51 0 1.126-.068 1.772-.291.493-.17.917-.412 1.246-.74a.45.45 0 00-.636-.637z"></path>
          </svg>
        </div>
      </div>
      <div className="m-5">
        <div className="flex flex-col gap-5 p-4">
          {item?.CartItems?.map((cartItem) => {
            return <CartItem item={cartItem} />;
          })}
        </div>
      </div>
      ,
    </div>
  );
};

export default memo(CartShop);
