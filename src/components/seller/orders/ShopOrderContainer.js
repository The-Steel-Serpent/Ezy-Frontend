import { set } from "lodash";
import React, { memo, useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import { Skeleton, Spin, Pagination, Input } from "antd";
import { TbNotesOff } from "react-icons/tb";
import { getShopOrders } from "../../../services/orderService";
import ShopOrderItem from "./ShopOrderItem";
import { SearchOutlined } from "@ant-design/icons";
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
        case "SET_SEARCH":
          return { ...state, searchText: action.payload };
        case "search_query": {
          return { ...state, search_query: action.payload };
        }
        default:
          return state;
      }
    },
    {
      loading: false,
      order: [],
      page: 1,
      totalPages: 1,
      search_query: "",
      searchText: "",
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
          3,
          localState.search_query
        );
        console.log(res);
        console.log("Shop orders: ", shop.shop_id, order_status_id, localState.page, 3);
        if (res.success) {
          setLocalState({ type: "SET_ORDER", payload: res.orders });
          setLocalState({ type: "SET_TOTAL_PAGES", payload: res.totalPages });
          console.log("Shop orders: ", res.orders);
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
  }, [
    shop,
    status_id,
    localState.page,
    localState.search_query,
  ]);

  const handlePageChange = (page) => {
    setLocalState({ type: "SET_PAGE", payload: page });
  };

  const handleOnSearch = (e) => {
    const value = e.target.value;
    setLocalState({ type: "SET_SEARCH", payload: value });
  };

  const handleSubmitSearch = (e) => {
    if (e.key === "Enter") {
      setLocalState({ type: "SET_PAGE", payload: 1 });
      setLocalState({ type: "SET_TOTAL_PAGES", payload: 1 });
      setLocalState({ type: "search_query", payload: localState.searchText });
    }
  };

  return (
    <>
      {localState.loading ? (
        <div className="w-full flex items-center justify-center mt-5">
          <Spin />
        </div>
      ) : (
        <div className="w-full pb-10">
          <Input
            size="large"
            prefix={<SearchOutlined className="text-2xl text-neutral-400" />}
            placeholder="Bạn có thể tìm kiếm theo ID đơn hàng hoặc Tên Sản Phẩm"
            onChange={handleOnSearch}
            onKeyDown={handleSubmitSearch}
          />
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
            onChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
};

export default memo(ShopOrderContainer);
