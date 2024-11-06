import { debounce, set } from "lodash";
import React, { memo, useCallback, useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import { getOrders } from "../../services/orderService";
import { Skeleton, Spin, Pagination, Input } from "antd";
import { TbNotesOff } from "react-icons/tb";
import OrderItem from "./OrderItem";
import { SearchOutlined } from "@ant-design/icons";

const OrderContainer = (props) => {
  const user = useSelector((state) => state.user);
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
      searchText: "",
      loading: false,
      order: [],
      page: 1,
      totalPages: 1,
      search_query: "",
    }
  );
  const fetchOrder = useCallback(async () => {
    setLocalState({ type: "SET_LOADING", payload: true });
    try {
      const order_status_id = parseInt(status_id);
      const res = await getOrders(
        user.user_id,
        order_status_id,
        localState.page,
        3,
        localState.search_query
      );
      console.log(res);
      if (res.success) {
        setLocalState({ type: "SET_ORDER", payload: res.orders });
        setLocalState({ type: "SET_TOTAL_PAGES", payload: res.totalPages });
      }
    } catch (error) {
      console.log("Lỗi khi getOrderStatus", error);
    } finally {
      setLocalState({ type: "SET_LOADING", payload: false });
    }
  }, [status_id, user.user_id, localState.page, localState.search_query]);

  useEffect(() => {
    if (user?.user_id && status_id) {
      fetchOrder();
    }
  }, [fetchOrder]);

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
      <div className="grid grid-cols-12 w-full items-center">
        <Input
          className="col-span-9"
          size="large"
          prefix={<SearchOutlined className="text-2xl text-neutral-400" />}
          placeholder="Bạn có thể tìm kiếm theo tên Shop, ID đơn hàng hoặc Tên Sản Phẩm"
          onChange={handleOnSearch}
          onKeyDown={handleSubmitSearch}
        />
        <Pagination
          className="col-span-3 flex items-center justify-center"
          simple
          current={localState.page}
          defaultCurrent={localState.page}
          total={localState.totalPages * 3}
          pageSize={3}
          showSizeChanger={false}
          onChange={(page, pageSize) => handlePageChange(page)}
        />
      </div>
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
            <OrderItem order={item} />
          ))}

          <Pagination
            align="center"
            current={localState.page}
            defaultCurrent={localState.page}
            total={localState.totalPages * 3}
            pageSize={3}
            showSizeChanger={false}
            hideOnSinglePage={localState.order.length <= 3 ? true : false}
            onChange={(page, pageSize) => handlePageChange(page)}
          />
        </div>
      )}
    </>
  );
};

export default memo(OrderContainer);
