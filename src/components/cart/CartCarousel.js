import { Checkbox, Input, List } from "antd";
import React, { memo, useCallback, useEffect, useReducer } from "react";
import VirtualList from "rc-virtual-list";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartData, updateCartItems } from "../../redux/cartSlice";
import CartShop from "./CartShop";
import CartItem from "./CartItem";
import {
  updateAllItemsOfShop,
  updateSelectedAll,
} from "../../services/cartService";

const CartCarousel = () => {
  const user = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart.cart);

  const dispatch = useDispatch();
  const [state, setState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "setSelectAll":
          return { ...state, selectAll: action.payload };
        default:
          return state;
      }
    },
    {
      selectAll: false,
    }
  );

  useEffect(() => {
    if (user?.user_id !== "") {
      const userID = user?.user_id;
      dispatch(fetchCartData({ userID }));
    }
  }, [dispatch, user?.user_id]);
  const { selectAll } = state;
  const handleSelectAllChange = useCallback(
    async (e) => {
      const checked = e.target.checked === true ? 1 : 0;
      try {
        await updateSelectedAll(cart?.[0]?.cart_id, checked);
        dispatch(fetchCartData({ userID: user?.user_id }));
      } catch (error) {
        console.log("Lỗi khi cập nhật select all: ", error);
      }
    },
    [dispatch, user?.user_id, cart]
  );

  const handleShopSelectChange = useCallback(
    async (cart_shop_id, checked) => {
      try {
        await updateAllItemsOfShop(cart_shop_id, checked);
        dispatch(fetchCartData({ userID: user?.user_id }));
      } catch (error) {
        console.log("Lỗi khi cập nhật select all: ", error);
      }
    },
    [dispatch, user?.user_id]
  );

  useEffect(() => {
    const allSelected = cart?.every((item) => item.selected === 1);
    setState({
      type: "setSelectAll",
      payload: allSelected,
    });
  }, [cart, dispatch]);

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex justify-between items-center shadow p-3 rounded border-[1px] bg-white">
        <div className="w-fit flex items-center gap-3 ">
          <Checkbox
            className="checkbox-cart"
            checked={selectAll}
            onChange={handleSelectAllChange}
          />
          <span className=" text-lg text-primary font-garibato">Tất cả</span>
        </div>
      </div>
      <div className="w-full rounded flex flex-col gap-3">
        {cart?.length > 0 &&
          cart?.map((item) => {
            return (
              <div className="bg-white  rounded" key={item.id}>
                <CartShop
                  item={item}
                  onShopSelectedChange={handleShopSelectChange}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default memo(CartCarousel);
