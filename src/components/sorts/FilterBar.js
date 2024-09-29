import {
  CaretRightFilled,
  DownOutlined,
  FilterOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Input, message, Rate, Tooltip } from "antd";
import axios from "axios";
import React, { useCallback, useEffect, useReducer } from "react";
import { TfiMenuAlt } from "react-icons/tfi";
import { useNavigate, useParams } from "react-router-dom";
import formatNumber from "../../helpers/formatNumber";
import NumericInput from "../input/NumericInput";

const Filter = (props) => {
  const { cat_id } = useParams();
  const { enabledCategories = true, onFilterChange, filter } = props;

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
        case "SET_MIN_PRICE":
          return { ...state, minPrice: action.payload };
        case "SET_MAX_PRICE":
          return { ...state, maxPrice: action.payload };
        case "SET_SELECTED_CHECKBOXES":
          return { ...state, selectedCheckboxes: action.payload };
        case "SET_RATING_FILTER":
          return { ...state, ratingFilter: action.payload };
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
      selectedCheckboxes: [],
      minPrice: null,
      maxPrice: null,
      ratingFilter: null,
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
    selectedCheckboxes,
    minPrice,
    maxPrice,
    ratingFilter,
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

  const handleCheckboxChange = useCallback(
    (facet) => {
      const updatedCheckboxes = selectedCheckboxes.includes(facet)
        ? selectedCheckboxes.filter((item) => item !== facet)
        : [...selectedCheckboxes, facet];
      console.log("updatedCheckboxes", updatedCheckboxes);
      dispatch({ type: "SET_SELECTED_CHECKBOXES", payload: updatedCheckboxes });
      onFilterChange({ ...filter, facet: updatedCheckboxes });
    },
    [selectedCheckboxes, filter, dispatch, onFilterChange]
  );

  return (
    <>
      <div className="w-full flex flex-col items-start">
        {/* Tất cả danh mục */}
        <section
          className={`w-[90%] mb-2 ${enabledCategories ? "block" : "hidden"}`}
        >
          <div className=" text-lg text-black font-bold h-[3.125rem] flex justify-start items-center gap-3 mb-[0.625rem] border-b-slate-300 border-b-[1px] border-solid">
            <TfiMenuAlt />
            Tất Cả Danh Mục
          </div>
          <ul
            className={`flex flex-col gap-3 ${
              isCategoryExpanded ? "max-h-[1000px]" : `max-h-[230px]`
            }  transition-all overflow-hidden duration-700`}
          >
            {listCategory
              ?.slice(0, visibleCategoryItems)
              ?.map((category, key) => {
                return (
                  <li
                    onClick={() =>
                      (window.location.href = `/categories/${category?.category_id}`)
                    }
                    className={`${
                      category?.category_id === parseInt(cat_id)
                        ? "text-primary"
                        : "hover:text-primary text-black pl-4"
                    } cursor-pointer text-sm`}
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
        <section className="w-[90%] ">
          <div className=" text-[17px] text-black font-bold h-[3.125rem] flex justify-start items-center gap-3 mb-[0.625rem]">
            <FilterOutlined />
            BỘ LỌC TÌM KIẾM
          </div>

          {/* Theo danh mục */}
          {enabledCategories && (
            <section className="mb-2">
              <div className="mb-2">Theo Danh Mục</div>
              <div
                className={`flex flex-col  gap-2 ${
                  isSubCategoryExpanded ? "max-h-[1200px]" : "max-h-[200px]"
                } transition-all overflow-hidden duration-700 border-b-[1px] border-solid border-b-slate-300 pb-4`}
              >
                {listSubCategories
                  ?.slice(0, visibleSubCategoryItems)
                  ?.map((subCategory, key) => {
                    return (
                      <>
                        <Checkbox
                          className="w-full"
                          checked={selectedCheckboxes.includes(
                            subCategory?.sub_category_id?.toString()
                          )}
                          onChange={() =>
                            handleCheckboxChange(
                              subCategory?.sub_category_id?.toString()
                            )
                          }
                        >
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
          )}

          {/* Khoảng Giá */}
          <section className="mb-2 mt-4 flex flex-col gap-3 border-b-[1px] border-solid border-b-slate-300 pb-4">
            <div>Khoảng Giá</div>
            <div className="flex justify-between items-center">
              <NumericInput
                style={{
                  width: 80,
                }}
                value={minPrice}
                onChange={(value) => {
                  dispatch({ type: "SET_MIN_PRICE", payload: value });
                }}
                placeholder="Từ"
              />
              <span> - </span>
              <NumericInput
                style={{
                  width: 80,
                }}
                value={maxPrice}
                onChange={(value) => {
                  dispatch({ type: "SET_MAX_PRICE", payload: value });
                }}
                placeholder="Đến"
              />
            </div>
            <Button
              className="bg-primary text-white border-primary hover:opacity-80"
              onClick={() => {
                if (parseInt(minPrice) < 0 || parseInt(maxPrice) < 0) {
                  message.error("Vui lòng nhập giá trị lớn hơn 0");
                  return;
                }
                if (
                  parseInt(minPrice) > parseInt(maxPrice) &&
                  maxPrice !== "" &&
                  minPrice !== ""
                ) {
                  message.error("Giá tối thiểu không được lớn hơn giá tối đa");
                  return;
                } else if (
                  parseInt(minPrice) > parseInt(maxPrice) &&
                  maxPrice !== "" &&
                  minPrice !== ""
                ) {
                  message.error("Giá tối đa không được nhỏ hơn giá tối thiểu");
                  return;
                }
                onFilterChange({
                  ...filter,
                  price: {
                    ...filter.price,
                    minPrice: minPrice === "" ? null : minPrice,
                    maxPrice: maxPrice === "" ? null : maxPrice,
                  },
                });
              }}
            >
              ÁP DỤNG
            </Button>
          </section>
          {/* Đánh Giá */}
          <section className="mb-2 mt-4 flex flex-col gap-3 border-b-[1px] border-solid border-b-slate-300 pb-4">
            <div>Đánh Giá</div>
            <div className="flex flex-col justify-start items-start  text-[16px] ">
              <div
                className={`cursor-pointer w-fit px-2 py-1 ${
                  ratingFilter === 5 ? "bg-neutral-200" : "bg-none"
                }  rounded-3xl`}
                onClick={() => {
                  dispatch({ type: "SET_RATING_FILTER", payload: 5 });
                  onFilterChange({
                    ...filter,
                    ratingFilter: 5,
                  });
                }}
              >
                <Rate className="text-primary" disabled defaultValue={5} />
              </div>
              <div
                className={`cursor-pointer w-fit px-2 py-1 ${
                  ratingFilter === 4 ? "bg-neutral-200" : "bg-none"
                }  rounded-3xl`}
                onClick={() => {
                  dispatch({ type: "SET_RATING_FILTER", payload: 4 });
                  onFilterChange({
                    ...filter,
                    ratingFilter: 4,
                  });
                }}
              >
                <Rate className="text-primary" disabled defaultValue={4} />
              </div>
              <div
                className={`cursor-pointer w-fit px-2 py-1 ${
                  ratingFilter === 3 ? "bg-neutral-200" : "bg-none"
                }  rounded-3xl`}
                onClick={() => {
                  dispatch({ type: "SET_RATING_FILTER", payload: 3 });
                  onFilterChange({
                    ...filter,
                    ratingFilter: 3,
                  });
                }}
              >
                <Rate className="text-primary" disabled defaultValue={3} />
              </div>
              <div
                className={`cursor-pointer w-fit px-2 py-1 ${
                  ratingFilter === 2 ? "bg-neutral-200" : "bg-none"
                }  rounded-3xl`}
                onClick={() => {
                  dispatch({ type: "SET_RATING_FILTER", payload: 2 });
                  onFilterChange({
                    ...filter,
                    ratingFilter: 2,
                  });
                }}
              >
                <Rate className="text-primary" disabled defaultValue={2} />
              </div>
              <div
                className={`cursor-pointer w-fit px-2 py-1 ${
                  ratingFilter === 1 ? "bg-neutral-200" : "bg-none"
                }  rounded-3xl`}
                onClick={() => {
                  dispatch({ type: "SET_RATING_FILTER", payload: 1 });
                  onFilterChange({
                    ...filter,
                    ratingFilter: 1,
                  });
                }}
              >
                <Rate className="text-primary" disabled defaultValue={1} />
              </div>
            </div>
          </section>
          {/* Xóa tất cả */}
          <Button
            className="w-full mt-3 bg-primary text-white border-primary hover:opacity-80"
            onClick={() => {
              dispatch({ type: "SET_MIN_PRICE", payload: null });
              dispatch({ type: "SET_MAX_PRICE", payload: null });
              dispatch({ type: "SET_SELECTED_CHECKBOXES", payload: [] });
              dispatch({ type: "SET_RATING_FILTER", payload: null });

              onFilterChange({
                ...filter,
                ratingFilter: null,
                price: {
                  minPrice: null,
                  maxPrice: null,
                },
                facet: [],
              });
            }}
          >
            XÓA TẤT CẢ
          </Button>
        </section>
      </div>
    </>
  );
};

export default Filter;
