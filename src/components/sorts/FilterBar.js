import {
  CaretRightFilled,
  DownOutlined,
  FilterOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { Checkbox } from "antd";
import axios from "axios";
import React, { useCallback, useEffect, useReducer } from "react";
import { TfiMenuAlt } from "react-icons/tfi";
import { useNavigate, useParams } from "react-router-dom";
import formatNumber from "../../helpers/formatNumber";

const Filter = () => {
  const { cat_id } = useParams();
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "SET_LIST_CATEGORY":
          return { ...state, listCategory: action.payload };
        case "SET_LIST_SUB_CATEGORIES":
          return { ...state, listSubCategories: action.payload };
        case "SET_SELECTED_CATEGORY":
          return { ...state, selectedCategory: action.payload };
        case "SET_MORE_VISIBLE_CATEGORY_ITEMS":
          return {
            ...state,
            visibleCategoryItems: action.payload.visibleCategoryItems,
            isCategoryExpanded: action.payload.isCategoryExpanded,
          };
        case "SET_MORE_VISIBLE_SUB_CATEGORY_ITEMS":
          return {
            ...state,
            visibleSubCategoryItems: action.payload.visibleSubCategoryItems,
            isSubCategoryExpanded: action.payload.isSubCategoryExpanded,
          };
        default:
          return state;
      }
    },
    {
      listCategory: [],
      listSubCategories: [],
      visibleCategoryItems: 6,
      visibleSubCategoryItems: 4,
      isCategoryExpanded: false,
      isSubCategoryExpanded: false,
      selectedCategory: null,
    }
  );

  const {
    listCategory,
    selectedCategory,
    visibleCategoryItems,
    visibleSubCategoryItems,
    isCategoryExpanded,
    isSubCategoryExpanded,
    listSubCategories,
  } = state;

  //Side Effects
  useEffect(() => {
    const fetchCategory = async () => {
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/categories`;
      try {
        const res = await axios.get(url);
        if (res?.data?.categories) {
          const sortedCategories = res.data.categories.sort((a, b) => {
            return a.category_id === parseInt(cat_id) ? -1 : 1;
          });
          dispatch({ type: "SET_LIST_CATEGORY", payload: sortedCategories });
        }
      } catch (error) {
        console.log("Lỗi khi fetch dữ liệu Categories: ", error);
      }
    };
    fetchCategory();
  }, []);
  useEffect(() => {
    const fetchSubCategories = async () => {
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/sub-categories/${cat_id}`;
      try {
        const res = await axios.get(url);
        if (res?.data?.subCategories) {
          dispatch({
            type: "SET_LIST_SUB_CATEGORIES",
            payload: res.data.subCategories,
          });
        }
      } catch (error) {
        console.log("Lỗi khi fetch dữ liệu SubCategories: ", error);
      }
    };
    fetchSubCategories();
  }, [cat_id]);

  //Handle
  const handleSetMoreVisibleCategoryItems = useCallback(() => {
    dispatch({
      type: "SET_MORE_VISIBLE_CATEGORY_ITEMS",
      payload: {
        visibleCategoryItems: listCategory?.length,
        isCategoryExpanded: true,
      },
    });
  }, [dispatch, listCategory]);
  const handleSetDefaultVisibleCategoryItems = useCallback(() => {
    dispatch({
      type: "SET_MORE_VISIBLE_CATEGORY_ITEMS",
      payload: {
        visibleCategoryItems: 6,
        isCategoryExpanded: false,
      },
    });
  }, [dispatch, listCategory]);

  const handleSetMoreVisibleSubCategoryItems = useCallback(() => {
    dispatch({
      type: "SET_MORE_VISIBLE_SUB_CATEGORY_ITEMS",
      payload: {
        visibleSubCategoryItems: listSubCategories?.length,
        isSubCategoryExpanded: true,
      },
    });
  }, [dispatch, listSubCategories]);

  const handleSetDefaultVisibleSubCategoryItems = useCallback(() => {
    dispatch({
      type: "SET_MORE_VISIBLE_SUB_CATEGORY_ITEMS",
      payload: {
        visibleSubCategoryItems: 4,
        isSubCategoryExpanded: false,
      },
    });
  }, [dispatch, listSubCategories]);

  return (
    <>
      <div className="w-full flex flex-col items-start">
        {/* Tất cả danh mục */}
        <section className="w-[90%] mb-2">
          <div className=" text-lg text-black font-bold h-[3.125rem] flex justify-start items-center gap-3 mb-[0.625rem] border-b-slate-300 border-b-[1px] border-solid">
            <TfiMenuAlt />
            Tất Cả Danh Mục
          </div>
          <ul
            className={`flex flex-col gap-3 ${
              isCategoryExpanded ? "max-h-[1000px]" : `max-h-[200px]`
            }  transition-all overflow-hidden duration-700`}
          >
            {listCategory
              ?.slice(0, visibleCategoryItems)
              ?.map((category, key) => {
                return (
                  <li
                    onClick={() =>
                      navigate(`/categories/${category?.category_id}`)
                    }
                    className={`${
                      category?.category_id === parseInt(cat_id)
                        ? "text-primary"
                        : "hover:text-primary text-black pl-4"
                    } cursor-pointer`}
                  >
                    {category?.category_id === parseInt(cat_id) && (
                      <CaretRightFilled />
                    )}
                    {category?.category_name}
                  </li>
                );
              })}
            {visibleCategoryItems < listCategory?.length ? (
              <div
                className="font-semibold flex items-center gap-1 cursor-pointer hover:text-primary pl-4"
                onClick={handleSetMoreVisibleCategoryItems}
              >
                Thêm <DownOutlined size={10} />
              </div>
            ) : (
              <div
                className="font-semibold flex items-center gap-1 cursor-pointer  hover:text-primary pl-4"
                onClick={handleSetDefaultVisibleCategoryItems}
              >
                Thu Gọn <UpOutlined size={10} />
              </div>
            )}
          </ul>
        </section>
        {/* Bộ Lọc Tìm Kiếm */}
        <section className="w-full">
          <div className=" text-lg text-black font-bold h-[3.125rem] flex justify-start items-center gap-3 mb-[0.625rem]">
            <FilterOutlined />
            BỘ LỌC TÌM KIẾM
          </div>
          {/* Theo danh mục */}
          <div className="mb-2">Theo Danh Mục</div>
          <div
            className={`flex flex-col  gap-2 ${
              isSubCategoryExpanded ? "max-h-[1200px]" : "max-h-[200px]"
            } transition-all overflow-hidden duration-700`}
          >
            {listSubCategories
              ?.slice(0, visibleSubCategoryItems)
              ?.map((subCategory, key) => {
                return (
                  <>
                    <Checkbox className="w-full">
                      {subCategory?.sub_category_name} (
                      {formatNumber(subCategory?.totalProduct || 0)})
                    </Checkbox>
                  </>
                );
              })}
            {visibleSubCategoryItems < listSubCategories?.length ? (
              <div
                className="font-semibold flex items-center gap-1 cursor-pointer hover:text-primary pl-4"
                onClick={handleSetMoreVisibleSubCategoryItems}
              >
                Thêm <DownOutlined size={10} />
              </div>
            ) : (
              <div
                className="font-semibold flex items-center gap-1 cursor-pointer  hover:text-primary pl-4"
                onClick={handleSetDefaultVisibleSubCategoryItems}
              >
                Thu Gọn <UpOutlined size={10} />
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Filter;
