import React, { useEffect, useReducer } from "react";
import ProductsWithPanigation from "../../../components/product/ProductsWithPanigation";
import axios from "axios";

const SuggestProduct = () => {
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "SET_CURRENT_PAGE":
          return { ...state, currentPage: action.payload };
        case "SET_TOTAL_PAGE":
          return { ...state, totalPage: action.payload };
        case "SET_LIST_SUGGEST":
          return { ...state, listSuggest: action.payload };
        default:
          return state;
      }
    },
    {
      listSuggest: [],
      currentPage: 1,
      totalPage: 0,
    }
  );
  const { listSuggest, currentPage, totalPage } = state;
  useEffect(() => {
    const fetchSuggestList = async () => {
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/api/suggest-products?pageNumbers=${currentPage}`;
        const res = await axios.get(url);
        if (res.status === 200) {
          console.log("res.data", res.data);
          dispatch({ type: "SET_LIST_SUGGEST", payload: res.data.data });
          dispatch({ type: "SET_TOTAL_PAGE", payload: res.data.totalPages });
        }
      } catch (error) {
        console.log("Lỗi khi fetch suggest list: ", error);
      }
    };
    fetchSuggestList();
  }, [currentPage]);

  const handlePageChange = (page) => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: page });
    console.log("page", page);
  };
  return (
    <div className="max-w-[1200px] mx-auto py-20">
      <div className="flex relative w-full mb-20">
        <div className="text-center bg-primary text-white cursor-default inline-block translate-x-[-50%] -translate-y-[50%] text-xl font-medium absolute left-[50%] py-[1.125rem] px-5 select-none z-[1] rounded-md">
          GỢI Ý HÔM NAY
        </div>
        <hr className="absolute w-full top-[50%] left-0" />
      </div>
      <div className="w-full">
        <ProductsWithPanigation
          list={listSuggest}
          currentPage={currentPage}
          totalPage={totalPage}
          onPageChange={handlePageChange}
          itemsPerRow={6}
        />
      </div>
    </div>
  );
};

export default SuggestProduct;
