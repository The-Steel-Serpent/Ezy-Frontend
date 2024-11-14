import { SearchOutlined } from "@ant-design/icons";
import { Input, Menu, Skeleton } from "antd";
import axios from "axios";

import React, { lazy, memo, Suspense, useEffect, useReducer } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getOrderStatus } from "../../../services/orderService";

const ShopOrderContainer = lazy(() => import("./ShopOrderContainer"));

const ShopOrderSection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const status_id = query.get("status-id");
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "SET_LOADING":
          return { ...state, loading: action.payload };
        case "SET_ORDER_STATUS":
          return { ...state, orderStatus: action.payload };
        case "SET_SEARCH":
          return { ...state, searchText: action.payload };
        default:
          return state;
      }
    },
    {
      loading: false,
      orderStatus: [],
      searchText: "",
    }
  );


  useEffect(() => {
    const fetchStatus = async () => {
      setLocalState({ type: "SET_LOADING", payload: true });
      try {
        const res = await getOrderStatus();
        if (res.success) {
          setLocalState({ type: "SET_LOADING", payload: false });
          setLocalState({ type: "SET_ORDER_STATUS", payload: res.data });
        }
      } catch (error) {
        console.log("Lỗi khi getOrderStatus", error);
        setLocalState({ type: "SET_LOADING", payload: false });
      }
    };
    fetchStatus();
  }, []);

  return (
    <div className="w-full flex flex-col gap-3 p-5">
      <Menu
        mode="horizontal"
        selectedKeys={[status_id]}
        items={localState.orderStatus.map((item) => ({
          label: (
            <span
              onClick={() =>
                navigate(`/seller/order/shop-orders?status-id=${item.order_status_id}`)
              }
              className="font-semibold"
            >
              {item.order_status_name}
            </span>
          ),
          key: item.order_status_id,
        }))}
      />
      <div className="w-full flex flex-col gap-3">
    
        <Suspense fallback={<Skeleton.Node active={true} className="w-full" />}>
          <ShopOrderContainer status_id={status_id} />
        </Suspense>
      </div>
    </div>
  );
};

export default memo(ShopOrderSection);
