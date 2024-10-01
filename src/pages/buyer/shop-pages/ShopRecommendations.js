import React, { lazy, useEffect, useReducer } from "react";
import withSuspense from "../../../hooks/HOC/withSuspense";
import ShopProductSuggestions from "../../../components/product/ShopProductSuggestions";
import { useParams } from "react-router-dom";
import axios from "axios";
const ShopRecommendations = () => {
  const { shop_id } = useParams();
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "FETCH_SUGGEST_PRODUCT":
          return { ...state, suggestProduct: action.payload };
        case "SET_CURRENT_PAGE":
          return { ...state, currentPage: action.payload };
        case "SET_TOTAL_PAGE":
          return { ...state, totalPage: action.payload };
        default:
          return state;
      }
    },
    {
      suggestProduct: [],
      currentPage: 1,
      totalPage: 0,
    }
  );
  const { suggestProduct, currentPage, totalPage } = state;
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/api/shop_recommendations/${shop_id}`;
        const res = await axios.get(url);
        if (res.data.success) {
          dispatch({
            type: "FETCH_SUGGEST_PRODUCT",
            payload: res.data.products,
          });
          dispatch({ type: "SET_TOTAL_PAGE", payload: res.data.totalPage });
        }
      } catch (error) {
        console.log("Lỗi khi fetch gợi ý sản phẩm shop: ", error);
      }
    };
    fetchShop();
  }, [shop_id]);
  return (
    <ShopProductSuggestions
      listSuggest={suggestProduct}
      currentPage={currentPage}
      totalPage={totalPage}
      handlePageChange={(page) =>
        dispatch({ type: "SET_CURRENT_PAGE", payload: page })
      }
      itemsPerRow={6}
    />
  );
};

export default ShopRecommendations;
