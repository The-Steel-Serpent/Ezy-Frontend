import { Checkbox, Input, List } from "antd";
import React, { memo, useEffect, useReducer } from "react";
import VirtualList from "rc-virtual-list";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartData } from "../../redux/cartSlice";
import CartShop from "./CartShop";

const CartCarousel = () => {
  const user = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart.cart);

  const dispatch = useDispatch();
  const [state, setState] = useReducer(
    (state, action) => {
      switch (action.type) {
        default:
          return state;
      }
    },
    {
      offset: 0,
      limit: 3,
    }
  );

  useEffect(() => {
    if (user?.user_id !== "") {
      const userID = user?.user_id;
      dispatch(fetchCartData({ userID }));
    }
  }, [dispatch, user?.user_id]);

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex justify-between items-center shadow p-3 rounded border-[1px] bg-white">
        <div className="w-fit flex items-center gap-3 ">
          <Checkbox className="checkbox-cart" />
          <span className=" text-lg text-primary font-garibato">Tất cả</span>
        </div>
      </div>
      <div className="w-full rounded flex flex-col gap-3">
        {cart?.length > 0 &&
          cart?.map((item) => {
            return (
              <div className="bg-white  rounded" key={item.id}>
                <CartShop item={item} />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default memo(CartCarousel);
