import { SearchOutlined } from "@ant-design/icons";
import { Input, Menu } from "antd";
import axios from "axios";

import React, { memo, useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

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
        default:
          return state;
      }
    },
    {
      loading: false,
      orderStatus: [],
    }
  );
  useEffect(() => {
    const fetchStatus = async () => {
      setLocalState({ type: "SET_LOADING", payload: true });
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/api/order/order-status`;
        const res = await axios.get(url);
        if (res.data.success) {
          setLocalState({ type: "SET_LOADING", payload: false });
          setLocalState({ type: "SET_ORDER_STATUS", payload: res.data.data });
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
      <div className="w-full">
        <Input
          size="large"
          prefix={<SearchOutlined className="text-2xl text-neutral-400" />}
          placeholder="Bạn có thể tìm kiếm theo tên Shop, ID đơn hàng hoặc Tên Sản Phẩm"
        />
      </div>
    </div>
  );
};

export default memo(OrderSection);
