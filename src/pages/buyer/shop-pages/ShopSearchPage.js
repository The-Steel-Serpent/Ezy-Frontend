import axios from "axios";
import React, { useEffect, useReducer } from "react";
import { useLocation } from "react-router-dom";
import ShopCard from "../../../components/shop/ShopCard";
import { Pagination, Spin } from "antd";
import { FaShopSlash } from "react-icons/fa6";

const ShopSearchPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get("keyword");

  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "SET_LOADING":
          return { ...state, loading: action.payload };
        case "SET_LIST_SHOP":
          return { ...state, listShop: action.payload };
        case "SET_CURRENT_PAGE":
          return { ...state, currentPage: action.payload };
        case "SET_TOTAL_PAGE":
          return { ...state, totalPage: action.payload };
        default:
          return state;
      }
    },
    {
      loading: false,
      listShop: [],
      currentPage: 1,
      totalPage: 0,
    }
  );
  const { currentPage, listShop, totalPage, loading } = state;
  const arrayListShop = listShop?.length > 0 ? listShop : [];
  useEffect(() => {
    const fetchShops = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const url = `${process.env.REACT_APP_BACKEND_URL}/api/search-shop?keyword=${keyword}&page=${currentPage}`;
        const res = await axios.get(url);
        if (res.data.success) {
          dispatch({ type: "SET_LIST_SHOP", payload: res.data.shops });
          dispatch({ type: "SET_TOTAL_PAGE", payload: res.data.totalPages });
        }
        dispatch({ type: "SET_LOADING", payload: false });
      } catch (error) {
        console.log("Looxii khi lấy danh sách shop: ", error);
      }
    };
    fetchShops();
  }, [currentPage, keyword]);

  return (
    <div className="max-w-[1200px] mx-auto py-10">
      <span className="text-xl text-slate-500">
        Shop liên quan đến "{keyword}"
      </span>
      <div className="flex flex-col gap-3 mt-7">
        {loading ? (
          <Spin />
        ) : arrayListShop.length > 0 ? (
          arrayListShop.map((shop) => {
            return <ShopCard value={shop} />;
          })
        ) : (
          <div className="flex flex-col justify-center items-center gap-2 text-slate-500">
            <FaShopSlash size={40} />
            <span>Không tìm thấy shop nào</span>
          </div>
        )}
        {arrayListShop.length > 0 && (
          <Pagination
            className="mt-5"
            align="center"
            current={currentPage}
            defaultCurrent={currentPage}
            total={totalPage * 5}
            pageSize={28}
            showSizeChanger={false}
            onChange={(page, pageSize) => {
              dispatch({ type: "SET_CURRENT_PAGE", payload: page });
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ShopSearchPage;
