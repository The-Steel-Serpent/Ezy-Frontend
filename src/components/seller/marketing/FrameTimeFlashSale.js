import { Button, message } from "antd";
import React, { useEffect, useReducer } from "react";
import { TiArrowBack } from "react-icons/ti";
import { formatDate } from "../../../helpers/formatDate";
import ModalFlashSaleRegisterProduct from "./ModalFlashSaleRegisterProduct";
import dayjs from "dayjs";
import { da } from "date-fns/locale";

const FrameTimeFlashSale = (props) => {
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "SET_VISIBLE_MODAL_REGISTER":
          return { ...state, visible_modal_regiter: action.payload };
        case "SET_FLASH_SALE_TIME_FRAME_ID":
          return { ...state, flash_sale_time_frame_id: action.payload };
        default:
          return state;
      }
    },
    {
      visible_modal_regiter: false,
      flash_sale_time_frame_id: null
    }
  )

  const handleClose = () => {
    props.setLocalState({ type: "SET_VISIBLE_TIME_FRAME", payload: false });
    props.setLocalState({ type: "SET_SELECTED_TIME_FRAMES", payload: [] });
  };

  
  useEffect(() => {
    
    console.log("frame", props.localState.selected_time_frames);
  }, [props.localState.selected_time_frames]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "waiting":
        return "text-blue-600";
      case "active":
        return "text-green-600";
      case "ended":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "waiting":
        return "Sắp diễn ra";
      case "active":
        return "Đang diễn ra";
      case "ended":
        return "Đã kết thúc";
      default:
        return "Không xác định";
    }
  };

  const handleRegisterProduct = (frame) => {
    console.log("Đăng ký sản phẩm cho khung giờ:", frame);
    if (!checkTime(frame.started_at)) {
      message.error("Đã qua giờ đăng ký sản phẩm cho khung giờ này");
      return;
    }
    setLocalState({ type: "SET_VISIBLE_MODAL_REGISTER", payload: true });
    setLocalState({ type: "SET_FLASH_SALE_TIME_FRAME_ID", payload: frame.flash_sale_time_frame_id });
  };


  const checkTime = (started_at) => {
    if (!started_at) {
      console.error("Invalid started_at value");
      return false;
    }

    const now = dayjs(new Date());
    const startedAt = dayjs(started_at);

    const diff = Math.abs(now - new Date(startedAt));
    const minutesDiff = Math.floor((diff / 1000) / 60);
    console.log("minutesDiff", minutesDiff);
    console.log(now)
    if (minutesDiff < 30) {
      return false;
    }
    return true;
  };


  return (
    <div className="px-6 bg-white rounded-lg">
      <div className="flex items-center mb-6">
        <TiArrowBack
          onClick={handleClose}
          size={24}
          className="cursor-pointer mr-3 text-primary"
        />
        <h2 className="text-2xl font-bold text-gray-800 mt-1">
          Khung giờ sự kiện
        </h2>
      </div>

      {props.localState.selected_time_frames &&
        props.localState.selected_time_frames.length > 0 ? (
        <div className="space-y-4">
          {props.localState.selected_time_frames.map((frame, index) => (
            <div
              key={index}
              className="relative border rounded-lg p-4 shadow-lg bg-gray-50 hover:bg-gray-100 transition"
            >
              {
                frame.status === "waiting" && (
                  <Button
                    className="absolute top-4 right-4 px-4 py-2 bg-primary text-white font-medium shadow-md transition"
                    onClick={() => handleRegisterProduct(frame)}
                    disabled={frame.status === "ended"}
                  >
                    Đăng ký sản phẩm
                  </Button>
                )
              }

              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-800">
                  Thời gian bắt đầu:
                </span>{" "}
                {dayjs(frame?.started_at).format("DD/MM/YYYY HH:mm:ss")}

              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-800">
                  Thời gian kết thúc:
                </span>{" "}
                {dayjs(frame?.ended_at).format("DD/MM/YYYY HH:mm:ss")}

              </p>
              <p
                className={`text-sm font-semibold ${getStatusStyle(
                  frame.status
                )}`}
              >
                Trạng thái: {getStatusLabel(frame.status)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center">
          Không có khung giờ nào được chọn.
        </p>
      )}
      <ModalFlashSaleRegisterProduct
        localState={localState} setLocalState={setLocalState}
        flash_sale_time_frame_id={localState.flash_sale_time_frame_id} />
    </div>
  );
};

export default FrameTimeFlashSale;
