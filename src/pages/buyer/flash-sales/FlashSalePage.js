import React, { useEffect, useReducer } from "react";
import flashSaleIconShopee from "../../../assets/flash-sale-icon-shopee.svg";
import { ClockCircleFilled } from "@ant-design/icons";
import { Button, Divider, Modal, Pagination } from "antd";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import goatFlashSaleBanner from "../../../assets/banner-flash-sale-ezy-transparent.png";
import goatComponent from "../../../assets/ezy-chibi-transparent.png";

import {
  getAvailableFlashSalesTimeFrames,
  getProductByTimeFrame,
} from "../../../services/flashSaleService";
import moment from "moment-timezone";
import { useNavigate } from "react-router-dom";
import FlashSaleItemWithInfor from "../../../components/flash-sales/FlashSaleItemWithInfor";
import { GrNotes } from "react-icons/gr";

const FlashSalePage = () => {
  const query = new URLSearchParams(window.location.search);
  const flash_sale_time_frame_id = parseInt(
    query.get("flash_sale_time_frame_id")
  );
  const page = parseInt(query.get("page")) || 1;
  const navigate = useNavigate();

  const [localState, setLocalState] = useReducer(
    (state, action) => {
      return { ...state, [action.type]: action.payload };
    },
    {
      times: [],
      time: {
        status: "waiting",
        endtime: null,
      },
      products: [],
      loading: false,
      openModal: false,
      totalPages: 0,
    }
  );

  useEffect(() => {
    const fetchTimeFrames = async () => {
      try {
        const res = await getAvailableFlashSalesTimeFrames();
        setLocalState({ type: "times", payload: res.data });
      } catch (error) {
        console.log(error);
      }
    };
    fetchTimeFrames();
  }, []);

  useEffect(() => {
    const fetchProductByTimeFrame = async () => {
      try {
        const res = await getProductByTimeFrame(flash_sale_time_frame_id, page);
        setLocalState({ type: "products", payload: res.data.products });
        setLocalState({ type: "totalPages", payload: res.data.totalPages });
      } catch (error) {
        console.log(error);
      }
    };
    if (flash_sale_time_frame_id) {
      fetchProductByTimeFrame();
    }
  }, [flash_sale_time_frame_id, page]);

  useEffect(() => {
    if (localState.times.length > 0 && flash_sale_time_frame_id) {
      const findTimeFrame = localState.times.find(
        (time) => time.flash_sale_time_frame_id === flash_sale_time_frame_id
      );
      const startTime = moment.tz(
        findTimeFrame?.started_at,
        "Asia/Ho_Chi_Minh"
      );
      const endedTime = moment.tz(findTimeFrame?.ended_at, "Asia/Ho_Chi_Minh");
      const currentTime = moment.tz(new Date(), "Asia/Ho_Chi_Minh");
      if (currentTime.isBetween(startTime, endedTime)) {
        setLocalState({
          type: "time",
          payload: {
            endtime: endedTime.format("YYYY-MM-DD HH:mm:ss"),
            status: "active",
          },
        });
      } else if (currentTime.isAfter(endedTime)) {
        setLocalState({
          type: "time",
          payload: {
            endtime: endedTime.format("YYYY-MM-DD HH:mm:ss"),
            status: "ended",
          },
        });
      } else {
        setLocalState({
          type: "time",
          payload: {
            endtime: startTime.format("YYYY-MM-DD HH:mm:ss"),
            status: "waiting",
          },
        });
      }
    }
  }, [flash_sale_time_frame_id, localState.times]);

  return (
    <>
      <section className="pb-5">
        <div className="w-full bg-white border-[1px] shadow-lg flex justify-center items-center py-5 gap-3">
          <img
            className="bg-primary p-2 h-[50px]"
            src={flashSaleIconShopee}
            alt=""
          />
          <span className="text-neutral-600">
            <ClockCircleFilled />{" "}
            {localState.time.status === "active"
              ? "Kết Thúc Trong"
              : "Bắt Đầu Sau"}
          </span>

          <FlipClockCountdown
            to={localState.time.endtime}
            hideOnComplete={false}
            labels={["HOURS", "MINUTES", "SECONDS"]}
            labelStyle={{
              fontSize: 10,
              fontWeight: 500,
              textTransform: "uppercase",
            }}
            className="flip-clock mt-3"
            digitBlockStyle={{ width: 20, height: 30, fontSize: 30 }}
            dividerStyle={{ color: "white", height: 1 }}
            separatorStyle={{ color: "red", size: "6px" }}
            duration={0.5}
            renderMap={[false, true, true, true]}
          />
        </div>
        <div className="max-w-[1200px] mx-auto">
          <div className=" h-[400px]  bg-custom-gradient-3 flex">
            <img
              src={goatFlashSaleBanner}
              alt=""
              className="w-full object-contain size-full "
            />
            <img
              src={goatComponent}
              className="w-full object-contain size-full "
              alt=""
            />
          </div>
          <div className="flex justify-start items-center bg-neutral-600">
            {localState.times.map((time) => {
              const startedAt = moment.tz(time?.started_at, "Asia/Ho_Chi_Minh");
              const isToday = startedAt.isSame(moment(), "day");
              const isTomorrow = startedAt.isSame(
                moment().add(1, "day"),
                "day"
              );
              return (
                <div
                  key={time.flash_sale_time_frame_id}
                  className={`time-frame-item ${
                    time.flash_sale_time_frame_id === flash_sale_time_frame_id
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => {
                    navigate(
                      `/flash-sale?flash_sale_time_frame_id=${time.flash_sale_time_frame_id}`
                    );
                  }}
                >
                  <div>{startedAt.format("HH:mm")}</div>
                  <div>
                    {isToday
                      ? "Hôm Nay"
                      : isTomorrow
                      ? "Ngày Mai"
                      : startedAt.format("DD/MM/YYYY")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {localState.products.length > 0 && (
          <div className="max-w-[1200px] mx-auto mt-6 grid grid-cols-12 items-center gap-3">
            {localState.products.map((product) => (
              <FlashSaleItemWithInfor
                item={product}
                status={localState.time.status}
              />
            ))}
          </div>
        )}
        {localState.products.length === 0 && (
          <div className="max-w-[1200px] mx-auto mt-6 flex justify-center items-center h-[300px]">
            <div className="flex flex-col gap-2 items-center">
              <GrNotes className="text-primary text-[40px]" />
              Chưa có sản phẩm trong flash sale
            </div>
          </div>
        )}

        <Pagination
          className="mt-5"
          align="center"
          current={page}
          defaultCurrent={page}
          total={localState.totalPages * 30}
          pageSize={30}
          showSizeChanger={false}
          hideOnSinglePage={localState.products.length <= 30 ? true : false}
          onChange={(page, pageSize) =>
            navigate(
              `/flash-sale?flash_sale_time_frame_id=${flash_sale_time_frame_id}&page=${page}`
            )
          }
        />
      </section>

      <Modal
        open={localState.openModal}
        centered={true}
        closable={false}
        footer={
          <div className="w-full flex justify-center items-center">
            <Button size="large" onClick={() => navigate("/")}>
              Trở về
            </Button>
          </div>
        }
      >
        <div className="text-2xl text-center w-full font-semibold">
          Phiên Flash Sale Đã Kết Thúc. Cảm ơn bạn đã tham gia!
        </div>
      </Modal>
    </>
  );
};

export default FlashSalePage;
