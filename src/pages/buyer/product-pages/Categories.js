import axios from "axios";
import React, { lazy, Suspense, useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
const SortBar = lazy(() => import("../../../components/sorts/SortBar"));
const FilterBar = lazy(() => import("../../../components/sorts/FilterBar"));
const Categories = () => {
  const { cat_id } = useParams();

  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "SET_LOADING":
          return { ...state, loading: action.payload };
        case "FETCH_PRODUCT_BY_CATEGORY":
          return { ...state, listProductByCategory: action.payload };
        case "SET_CURRENT_PAGE":
          return { ...state, currentPage: action.payload };
        case "SET_TOTAL_PAGE":
          return { ...state, totalPage: action.payload };
        case "SET_FILTER":
          return {
            ...state,
            filter: {
              ...state.filter,
              ...action.payload,
            },
          };
        default:
          return state;
      }
    },
    {
      loading: false,
      listProductByCategory: [],
      currentPage: 1,
      totalPage: 0,
      filter: {
        sortBy: "pop",
        facet: [],
        price: {
          minPrice: null,
          maxPrice: null,
        },
        ratingFilter: null,
      },
    }
  );

  const { listProductByCategory, currentPage, totalPage, filter, loading } =
    state;

  useEffect(() => {
    const fetchProductByCategory = async () => {
      console.log("current page: ", currentPage);
      const url = `${
        process.env.REACT_APP_BACKEND_URL
      }/api/product-by-sort-and-filter/${cat_id}?pageNumbers=${currentPage}&sortBy=${
        filter.sortBy
      }&minPrice=${
        filter.price.minPrice ? filter.price.minPrice : ""
      }&maxPrice=${
        filter.price.maxPrice ? filter.price.maxPrice : ""
      }&ratingFilter=${filter.ratingFilter ? filter.ratingFilter : ""}&facet=${
        filter.facet ? filter.facet : ""
      }`;
      try {
        const response = await axios.get(url);
        dispatch({ type: "SET_LOADING", payload: true });
        if (response.status === 200) {
          console.log(
            "Dữ liệu product theo category: ",
            response.data.products
          );
          dispatch({
            type: "FETCH_PRODUCT_BY_CATEGORY",
            payload: response.data.products,
          });

          dispatch({
            type: "SET_TOTAL_PAGE",
            payload: response.data.totalPages,
          });
        }
        dispatch({ type: "SET_LOADING", payload: false });
      } catch (error) {
        console.log("Lỗi khi fetch dữ liệu product theo category: ", error);
      }
    };
    fetchProductByCategory();
  }, [cat_id, currentPage, filter]);
  return (
    <div className="max-w-[1200px] mx-auto grid grid-cols-12 py-10">
      <div className="col-span-2">
        <Suspense fallback={<div>Loading...</div>}>
          <FilterBar
            onFilterChange={(filter) => {
              dispatch({ type: "SET_FILTER", payload: filter });
              dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
              console.log("filter", filter);
            }}
            filter={filter}
          />
        </Suspense>
      </div>
      <div className="col-span-10">
        <section className="">
          <Suspense fallback={<div>Loading...</div>}>
            <SortBar
              listProductByCategory={listProductByCategory}
              loading={loading}
              currentPage={currentPage}
              totalPage={totalPage}
              filter={filter}
              onPageChange={(page) =>
                dispatch({ type: "SET_CURRENT_PAGE", payload: page })
              }
              onFilterChange={(filter) => {
                dispatch({ type: "SET_FILTER", payload: filter });
                dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
                console.log("filter", filter);
              }}
            />
          </Suspense>
        </section>
      </div>
    </div>
  );
};

export default Categories;
