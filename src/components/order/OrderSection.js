import { SearchOutlined } from "@ant-design/icons";
import { Input, Menu, Skeleton } from "antd";
import axios from "axios";

import React, { lazy, memo, Suspense, useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getOrderStatus } from "../../services/orderService";

const OrderContainer = lazy(() => import("./OrderContainer"));

const OrderSection = () => {
  const user = useSelector((state) => state.user);
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

  const handleOnSearch = (e) => {
    const value = e.target.value;
    setLocalState({ type: "SET_SEARCH", payload: value });
  };

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
    <div className="w-full flex flex-col gap-3">
      <Menu
        mode="horizontal"
        selectedKeys={[status_id]}
        items={localState.orderStatus.map((item) => ({
          label: (
            <span
              onClick={() =>
                navigate(`/user/purchase?status-id=${item.order_status_id}`)
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
        <Input
          size="large"
          prefix={<SearchOutlined className="text-2xl text-neutral-400" />}
          placeholder="Bạn có thể tìm kiếm theo tên Shop, ID đơn hàng hoặc Tên Sản Phẩm"
          onChange={handleOnSearch}
        />
        <Suspense fallback={<Skeleton.Node active={true} className="w-full" />}>
          <OrderContainer status_id={status_id} />
        </Suspense>
      </div>
    </div>
  );
};

export default memo(OrderSection);
