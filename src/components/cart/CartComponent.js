import { Badge, Button, Empty, Popover } from "antd";
import React, { memo, useEffect, useState } from "react";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import MiniCartItem from "./MiniCartItem";
import { fetchMiniCartData } from "../../redux/cartSlice";
import { useNavigate } from "react-router-dom";

const CartComponent = () => {
  const user = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.user_id !== "") {
      dispatch(fetchMiniCartData(user?.user_id));
    }
  }, [user?.user_id, dispatch]);

  //Content
  const content =
    cart?.miniCart?.length > 0 ? (
      <div>
        {cart?.miniCart?.map((item) => {
          return (
            <>
              <div className="max-w-[390px]">
                <MiniCartItem item={item} />
              </div>
            </>
          );
        })}
        <div className="flex justify-between items-center gap-10 mt-2">
          <span className="">
            {cart?.miniCart?.length}/{cart?.totalItems} trong giỏ hàng
          </span>
          <Button
            className="bg-primary text-white hover:opacity-80"
            onClick={() => navigate("/cart")}
          >
            Xem Giỏ Hàng
          </Button>
        </div>
      </div>
    ) : (
      <Empty
        className="p-6"
        description="Không có sản phẩm nào trong giỏ hàng"
      />
    );

  return (
    <>
      <div className="w-fit">
        <Popover
          placement="bottomRight"
          className="relative"
          title={cart?.miniCart?.length > 0 && "Giỏ Hàng"}
          content={content}
        >
          {/* <div className="rounded-full text-primary bg-white px-2 py-1 -right-3 absolute bottom-3">
   
        </div> */}
          <Badge count={cart?.totalItems} showZero>
            <PiShoppingCartSimpleBold
              className="text-white cursor-pointer"
              size={35}
              onClick={() => navigate("/cart")}
            />
          </Badge>
        </Popover>
      </div>
    </>
  );
};

export default memo(CartComponent);
