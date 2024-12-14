import { Menu } from "antd";
import React, { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { getTopSubCategories } from "../../../services/categoriesService";
import { getTopProduct } from "../../../services/productService";
import TopProductItem from "../../../components/product/TopProductItem";

const TopSellingSubCategoriesPage = () => {
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      return {
        ...state,
        [action.type]: action.payload,
      };
    },
    {
      topSellingCategories: [],
      topProducts: [],
      selectedSubCategory: null,
      loading: false,
    }
  );
  const query = new URLSearchParams(window.location.search);
  const sub_category_id = parseInt(query.get("sub_category_id"));
  const navigate = useNavigate();
  useEffect(() => {
    const fetchTopSellingCategories = async () => {
      setLocalState({ type: "loading", payload: true });

      try {
        const res = await getTopSubCategories(1, 50);

        setLocalState({
          type: "topSellingCategories",
          payload: res.data,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLocalState({ type: "loading", payload: false });
      }
    };
    fetchTopSellingCategories();
  }, []);
  useEffect(() => {
    if (sub_category_id) {
      const selectedSubCategory = localState.topSellingCategories.find(
        (item) => item.sub_category_id === sub_category_id
      );
      setLocalState({
        type: "selectedSubCategory",
        payload: selectedSubCategory,
      });
    } else {
      setLocalState({
        type: "selectedSubCategory",
        payload: localState.topSellingCategories[0],
      });
    }
  }, [sub_category_id, localState.topSellingCategories]);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const res = await getTopProduct(
          localState.selectedSubCategory?.sub_category_id
        );
        setLocalState({
          type: "topProducts",
          payload: res.data,
        });
      } catch (error) {
        console.error(error);
      }
    };
    if (localState.selectedSubCategory) {
      fetchTopProducts();
    }
  }, [localState.selectedSubCategory]);

  return (
    <div className="max-w-[1200px] mx-auto mb-7 flex flex-col gap-3">
      <div className="flex relative w-full mb-20 mt-20">
        <div className="text-center bg-primary text-white cursor-default inline-block translate-x-[-50%] -translate-y-[50%] text-xl font-medium absolute left-[50%] py-[1.125rem] px-5 select-none z-[1] rounded-md">
          DANH MỤC BÁN CHẠY
        </div>
        <hr className="absolute w-full top-[50%] left-0" />
      </div>
      <Menu
        items={
          localState.topSellingCategories?.length > 0 &&
          localState.topSellingCategories?.map((item) => ({
            label: (
              <span
                className={`text-lg ${
                  item.sub_category_id ===
                  localState.selectedSubCategory?.sub_category_id
                    ? "text-primary"
                    : ""
                }`}
              >
                {item.sub_category_name}
              </span>
            ),
            key: item.sub_category_id,
          }))
        }
        onClick={({ key }) => {
          console.log(key);
          navigate(`/top-products?sub_category_id=${key}`);
        }}
        selectedKeys={localState.selectedSubCategory?.sub_category_id.toString()}
        mode="horizontal"
        className="py-2"
      />

      <div className="w-full grid-cols-12 gap-4 grid mt-3">
        {localState.topProducts?.map((item, key) => (
          <TopProductItem item={item} key={key} top={key + 1} />
        ))}
      </div>
    </div>
  );
};

export default TopSellingSubCategoriesPage;
