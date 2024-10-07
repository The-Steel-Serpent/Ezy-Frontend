import { Button, Popover } from "antd";
import React, { memo, useEffect, useReducer } from "react";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { useSelector } from "react-redux";
import MiniCartItem from "./MiniCartItem";

const CartComponent = () => {
  const user = useSelector((state) => state.user);
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "FETCH_CART":
          return {
            ...state,
            cartItems: action.payload.cartItems,
            totalItems: action.payload.totalItems,
          };
        default:
          return state;
      }
    },
    {
      cartItems: [],
      totalItems: 0,
    }
  );
  const { cartItems, totalItems } = state;

  useEffect(() => {}, [user?.user_id]);

  //Content
  const content = (
    <div>
      <div className="max-w-[390px]">
        <MiniCartItem />
      </div>
      <div className="max-w-[390px]">
        <MiniCartItem />
      </div>
      <div className="max-w-[390px]">
        <MiniCartItem />
      </div>
      <div className="max-w-[390px]">
        <MiniCartItem />
      </div>
      <div className="max-w-[390px]">
        <MiniCartItem />
      </div>
      <div className="flex justify-between items-center gap-10 mt-2">
        <span className="">56 trong giỏ hàng</span>
        <Button className="bg-primary text-white hover:opacity-80">
          Xem Giỏ Hàng
        </Button>
      </div>
    </div>
  );

  return (
    <div className="w-fit">
      <Popover
        placement="bottomRight"
        className="relative"
        title="Sản phẩm mới thêm"
        content={content}
      >
        <div className="rounded-full text-primary bg-white px-2 py-1 -right-3 absolute bottom-3">
          {totalItems}
        </div>
        <PiShoppingCartSimpleBold size={35} />
      </Popover>
    </div>
  );
};

export default memo(CartComponent);
