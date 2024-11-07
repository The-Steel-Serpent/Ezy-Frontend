import { set } from "lodash";
import React, { memo, useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import { Skeleton, Spin, Pagination } from "antd";
import { TbNotesOff } from "react-icons/tb";
import { getShopOrders } from "../../../services/orderService";
import ShopOrderItem from "./ShopOrderItem";
// import OrderItem from "./ShopOrderItem";

const ShopOrderContainer = (props) => {
  const shop = useSelector((state) => state.shop);
  const { status_id } = props;

  const [localState, setLocalState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "SET_LOADING":
          return { ...state, loading: action.payload };
        case "SET_ORDER":
          return { ...state, order: action.payload };
        case "SET_PAGE":
          return { ...state, page: action.payload };
        case "SET_TOTAL_PAGES":
          return { ...state, totalPages: action.payload };
        default:
          return state;
      }
    },
    {
      loading: false,
      order: [],
      page: 1,
      totalPages: 1,
    }
  );

  useEffect(() => {
    const fetchOrder = async () => {
      setLocalState({ type: "SET_LOADING", payload: true });
      try {
        const order_status_id = parseInt(status_id);
        const res = await getShopOrders(
          shop.shop_id,
          order_status_id,
          localState.page,
          3
        );
        console.log(res);
        console.log("Shop orders: ",shop.shop_id, order_status_id, localState.page, 3);
        if (res.success) {
          setLocalState({ type: "SET_ORDER", payload: res.orders });
          setLocalState({ type: "SET_TOTAL_PAGES", payload: res.totalPages });
          console.log("Shop orders: ",res.orders);
        }
      } catch (error) {
        console.log("Lỗi khi getOrderStatus", error);
      } finally {
        setLocalState({ type: "SET_LOADING", payload: false });
      }
    };
    if (shop?.shop_id && status_id) {
      fetchOrder();
    }
  }, [shop, status_id]);

  return (
    <>
      {localState.loading ? (
        <div className="w-full flex items-center justify-center mt-5">
          <Spin />
        </div>
      ) : (
        <div className="w-full pb-10">
          {localState.order.length === 0 && (
            <div className="w-full h-[500px] bg-white flex items-center justify-center mt-5">
              <p className="flex flex-col gap-2 items-center">
                <TbNotesOff size={70} className="text-primary" />
                <span className="text-lg font-semibold text-neutral-500">
                  Không có đơn hàng
                </span>
              </p>
            </div>
          )}

          {localState.order.map((item) => (
            <ShopOrderItem order={item} />
          ))}

          <Pagination
            align="center"
            current={localState.page}
            defaultCurrent={localState.page}
            total={localState.totalPages * 3}
            pageSize={3}
            showSizeChanger={false}
            hideOnSinglePage={localState.order.length <= 3 ? true : false}
          />
        </div>
      )}
    </>
  );
};

export default memo(ShopOrderContainer);
