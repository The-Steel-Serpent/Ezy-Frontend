import React, { memo, useEffect, useReducer } from "react";
import { getTopSubCategories } from "../../services/categoriesService";
import { RxCaretRight } from "react-icons/rx";
import { Carousel } from "antd";
import SubCategoryItem from "./SubCategoryItem";
import { GiSmallFire } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

const TopSellingCategoriesSection = () => {
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      return {
        ...state,
        [action.type]: action.payload,
      };
    },
    {
      topSellingCategories: [],
      loading: false,
    }
  );
  const navigate = useNavigate();
  useEffect(() => {
    const fetchTopSellingCategories = async () => {
      setLocalState({ type: "loading", payload: true });

      try {
        const res = await getTopSubCategories(1, 10);

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
  return (
    <>
      {localState.topSellingCategories?.length > 0 && (
        <div className="max-w-[1200px] mx-auto bg-white p-5 mt-5">
          <div className="w-full flex justify-between">
            <span className="text-red-500 font-semibold text-lg flex items-center gap-1">
              <GiSmallFire className="text-2xl" /> DANH MỤC BÁN CHẠY
            </span>
            <span
              className="text-primary cursor-pointer flex items-center gap-1"
              onClick={() => navigate("/top-products")}
            >
              Xem Tất Cả <RxCaretRight />{" "}
            </span>
          </div>
          <div className="py-3">
            <Carousel
              arrows
              className={`animation-pulse category-carousel lg:max-w-[1200px] relative lg:overflow-visible overflow-hidden ${
                localState.topSellingCategories.length < 6 && "not-enough-slide"
              }`}
              rows={1}
              slidesToShow={6}
              infinite={false}
              dots={false}
              centerMode={false}
              focusOnSelect={true}
            >
              {localState.topSellingCategories.map((value, key) => (
                <SubCategoryItem item={value} key={key} />
              ))}
            </Carousel>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(TopSellingCategoriesSection);
