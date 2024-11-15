import React, { Suspense, useEffect, useReducer } from "react";
import ProductsWithPanigation from "../../../components/product/ProductsWithPanigation";
import axios from "axios";
import { useSelector } from "react-redux";
import { Button, Skeleton } from "antd";
import ProductCard from "../../../components/product/ProductCard";

const SuggestProduct = () => {
  const user = useSelector((state) => state.user);
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "SET_LOADING":
          return { ...state, loading: action.payload };
        case "SET_CURRENT_PAGE":
          return { ...state, currentPage: action.payload };
        case "SET_TOTAL_PAGE":
          return { ...state, totalPage: action.payload };
        case "SET_LIST_SUGGEST":
          return { ...state, listSuggest: action.payload };
        case "SET_EXCLUDE_PRODUCT_IDS":
          return { ...state, excludeProductIds: action.payload };
        default:
          return state;
      }
    },
    {
      loading: false,
      listSuggest: [],
      currentPage: 1,
      totalPage: 0,
      excludeProductIds: [],
    }
  );
  const { listSuggest, currentPage, totalPage, excludeProductIds, loading } =
    state;
  useEffect(() => {
    const fetchSuggestList = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/api/suggest-products`;
        console.log("excludeProductIds: ", excludeProductIds);
        const res = await axios.get(url, {
          params: {
            user_id: user.user_id,
            excludeProductIds: excludeProductIds,
            limit: 28,
          },
        });
        if (res.status === 200) {
          const newProducts = res.data.data;
          console.log("totalPages: ", res.data.totalPages);
          const updatedListSuggest = [...listSuggest, ...newProducts];
          dispatch({ type: "SET_LIST_SUGGEST", payload: updatedListSuggest });
          const newProductIds = newProducts.map(
            (product) => product.product_id
          );

          // Loại bỏ các product_id trùng lặp
          const updatedExcludeProductIds = [
            ...new Set([...excludeProductIds, ...newProductIds]), // Dùng Set để loại bỏ trùng lặp
          ];
          dispatch({
            type: "SET_EXCLUDE_PRODUCT_IDS",
            payload: updatedExcludeProductIds,
          });
          dispatch({ type: "SET_TOTAL_PAGE", payload: res.data.totalPages });
        }
      } catch (error) {
        console.log("Lỗi khi fetch suggest list: ", error);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };
    fetchSuggestList();
  }, [currentPage]);

  return (
    <div className="max-w-[1200px] mx-auto py-20">
      <div className="flex relative w-full mb-20">
        <div className="text-center bg-primary text-white cursor-default inline-block translate-x-[-50%] -translate-y-[50%] text-xl font-medium absolute left-[50%] py-[1.125rem] px-5 select-none z-[1] rounded-md">
          GỢI Ý HÔM NAY
        </div>
        <hr className="absolute w-full top-[50%] left-0" />
      </div>
      <div className="flex flex-col gap-10">
        <div className={`grid grid-cols-12  place-items-center`}>
          {listSuggest.map((value, key) => (
            <Suspense fallback={<Skeleton.Image />}>
              <ProductCard key={key} value={value} />
            </Suspense>
          ))}
        </div>
        {!loading &&
          Array.isArray(listSuggest) &&
          listSuggest.length > 0 &&
          totalPage > 1 && (
            <div className="w-full flex justify-center items-center">
              <Button
                size="large"
                onClick={() =>
                  dispatch({
                    type: "SET_CURRENT_PAGE",
                    payload: currentPage + 1,
                  })
                }
              >
                Xem Thêm
              </Button>
            </div>
          )}
        {loading && (
          <div className="w-full flex justify-center items-center">
            <Skeleton.Button active={true} size="large" />
          </div>
        )}
      </div>
    </div>
  );
};

export default SuggestProduct;
