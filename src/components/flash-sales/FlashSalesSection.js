import React, { memo, useCallback, useEffect, useReducer } from "react";
import flashSaleIcon from "../../assets/flash-sale-ezy.png";
import { RxCaretRight } from "react-icons/rx";
import { Carousel, Statistic } from "antd";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import FlashSaleItem from "./FlashSaleItem";

import { getFlashSalesActive } from "../../services/flashSaleService";

import moment from "moment-timezone";
import { useNavigate } from "react-router-dom";
import SaleBanner from "../sale-banner/SaleBanner";
const FlashSalesSection = () => {
  const navigate = useNavigate();
  const [localState, setLocalState] = useReducer(
    (state, action) => ({
      ...state,
      [action.type]: action.payload,
    }),
    {
      time: {
        status: "waiting",
        endtime: null,
      },
      flashSalesItem: [],
      flashSale: null,
    }
  );

  const { time, flashSalesItem, isComplete, flashSale } = localState;
  const fetchSalesItem = useCallback(async () => {
    try {
      const res = await getFlashSalesActive();
      if (res.success) {
        const data = res.data;
        setLocalState({
          type: "flashSale",
          payload: res.flashSales,
        });
        setLocalState({
          type: "flashSalesItem",
          payload: data,
        });

        const startTime = moment.tz(data[0]?.started_at, "Asia/Ho_Chi_Minh");
        const endedTime = moment.tz(data[0]?.ended_at, "Asia/Ho_Chi_Minh");
        const currentTime = moment.tz(new Date(), "Asia/Ho_Chi_Minh");

        if (currentTime.isBetween(startTime, endedTime)) {
          setLocalState({
            type: "flashSalesItem",
            payload: data,
          });
          setLocalState({
            type: "time",
            payload: {
              endtime: endedTime.format("YYYY-MM-DD HH:mm:ss"),
              status: "active",
            },
          });
        } else if (currentTime.isAfter(endedTime)) {
          // Nếu đã kết thúc
          setLocalState({
            type: "time",
            payload: {
              endtime: endedTime.format("YYYY-MM-DD HH:mm:ss"),
              status: "ended",
            },
          });
          // console.log("Flash sale đã kết thúc.");
        } else {
          // Nếu chưa đến giờ bắt đầu
          // console.log("Countdown không hoạt động do chưa tới giờ bắt đầu.");
          setLocalState({
            type: "time",
            payload: {
              endtime: startTime.format("YYYY-MM-DD HH:mm:ss"),
              status: "waiting",
            }, // Thiết lập countdown thành 00:00:00
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchSalesItem();
  }, [fetchSalesItem]);

  // useEffect(() => {
  //   console.log(flashSalesItem);
  //   console.log(time);
  // }, [flashSalesItem, time]);

  return (
    <>
      {flashSale && flashSalesItem && flashSalesItem.length > 0 && (
        <div className="max-w-[1200px] bg-white m-auto h-fit mt-5 px-5">
          {/**Countdown */}

          <div className="flex justify-between items-center">
            <div className="flex justify-center items-center gap-2">
              <img src={flashSaleIcon} className="size-[100px]" alt="" />

              <FlipClockCountdown
                to={time.endtime}
                hideOnComplete={false}
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
              {time.status && (
                <span className="text-lg font-semibold text-red-500">
                  {time.status === "waiting" && "Sắp diễn ra"}
                  {time.status === "active" && "Đang diễn ra"}
                  {time.status === "ended" && "Đã kết thúc"}
                </span>
              )}
            </div>
            <span
              className="text-primary cursor-pointer flex items-center gap-1"
              onClick={() =>
                navigate(
                  `/flash-sale?flash_sale_time_frame_id=${flashSalesItem[0].flash_sale_time_frame_id}&page=1`
                )
              }
            >
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
                <FlashSaleItem item={value} status={time.status} />
              ))}
            </Carousel>
          </div>
        </div>
      )}
      {flashSale && (
        <SaleBanner
          thumbnail={flashSale?.thumbnail}
          status={flashSale?.status}
        />
      )}
    </>
  );
};

export default memo(FlashSalesSection);
