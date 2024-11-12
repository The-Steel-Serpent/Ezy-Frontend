import React, { memo, useCallback, useEffect, useReducer } from "react";
import flashSaleIcon from "../../assets/flash-sale-ezy.png";
import { RxCaretRight } from "react-icons/rx";
import { Carousel, Statistic } from "antd";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import FlashSaleItem from "./FlashSaleItem";

import { getFlashSalesActive } from "../../services/flashSaleService";

import moment from "moment-timezone";
const FlashSalesSection = () => {
  const [localState, setLocalState] = useReducer(
    (state, action) => ({
      ...state,
      [action.type]: action.payload,
    }),
    {
      endtime: 0,
      flashSalesItem: [],
    }
  );

  const { endtime, flashSalesItem } = localState;
  const fetchSalesItem = useCallback(async () => {
    try {
      const res = await getFlashSalesActive();
      if (res.success) {
        const data = res.data;
        setLocalState({
          type: "flashSalesItem",
          payload: data,
        });
        const timeInVietnam = moment.utc(data[0].ended_at);
        setLocalState({
          type: "endtime",
          payload: timeInVietnam.format("YYYY-MM-DD HH:mm:ss"),
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchSalesItem();
  }, [fetchSalesItem]);

  useEffect(() => {
    console.log(flashSalesItem);
    console.log(endtime);
  }, [flashSalesItem, endtime]);

  return (
    <>
      <div className="max-w-[1200px] bg-white m-auto h-fit mt-5 px-5">
        {/**Countdown */}

        <div className="flex justify-between items-center">
          <div className="flex justify-center items-center gap-2">
            <img src={flashSaleIcon} className="size-[100px]" alt="" />
            <FlipClockCountdown
              to={endtime}
              labels={["HOURS", "MINUTES", "SECONDS"]}
              labelStyle={{
                fontSize: 10,
                fontWeight: 500,
                textTransform: "uppercase",
              }}
              className="flip-clock mt-3"
              digitBlockStyle={{ width: 20, height: 40, fontSize: 30 }}
              dividerStyle={{ color: "white", height: 1 }}
              separatorStyle={{ color: "red", size: "6px" }}
              duration={0.5}
              renderMap={[false, true, true, true]}
            />
          </div>
          <span className="text-primary cursor-pointer flex items-center gap-1">
            Xem Tất Cả <RxCaretRight className="" />
          </span>
        </div>
        {/**Carousel */}
        <div className="pb-3">
          <Carousel
            arrows
            className={`animation-pulse category-carousel lg:max-w-[1200px] relative lg:overflow-visible overflow-hidden ${
              flashSalesItem[0]?.ShopRegisterFlashSales.length < 6 &&
              "not-enough-slide"
            }`}
            rows={1}
            slidesToShow={6}
            infinite={false}
            dots={false}
            centerMode={false}
            focusOnSelect={true}
          >
            {flashSalesItem[0]?.ShopRegisterFlashSales?.map((value, key) => (
              <FlashSaleItem item={value} />
            ))}
          </Carousel>
        </div>
      </div>
    </>
  );
};

export default memo(FlashSalesSection);
