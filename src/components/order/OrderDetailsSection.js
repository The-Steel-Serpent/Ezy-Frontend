import React, { memo, useEffect, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RxCaretLeft } from "react-icons/rx";
import { Divider, message, Spin, Steps } from "antd";
import { GrCopy } from "react-icons/gr";
import { getOrderDetails } from "../../services/orderService";
import { CgNotes } from "react-icons/cg";

import { MdLocalShipping } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";
import { HiInboxArrowDown } from "react-icons/hi2";
import { formatDate } from "date-fns";
import { forEach } from "lodash";
const statusDescriptions = {
  ready_to_pick: "Người bán đang chuẩn bị hàng",
  picking: "Đang lấy hàng",
  cancel: "Hủy đơn hàng",
  money_collect_picking: "Đang thu tiền người gửi",
  picked: "Đã lấy hàng",
  storing: "Hàng đang nằm ở kho",
  transporting: "Đang luân chuyển hàng",
  sorting: "Đang phân loại hàng hóa",
  delivering: "Nhân viên đang giao cho người nhận",
  money_collect_delivering: "Nhân viên đang thu tiền người nhận",
  delivered: "Giao hàng thành công",
  delivery_fail: "Giao hàng thất bại",
  waiting_to_return: "Đang đợi trả hàng về cho người gửi",
  return: "Trả hàng",
  return_transporting: "Đang luân chuyển hàng trả",
  return_sorting: "Đang phân loại hàng trả",
  returning: "Nhân viên đang đi trả hàng",
  return_fail: "Nhân viên trả hàng thất bại",
  returned: "Nhân viên trả hàng thành công",
  exception: "Đơn hàng ngoại lệ không nằm trong quy trình",
  damage: "Hàng bị hư hỏng",
  lost: "Hàng bị mất",
};
const OrderDetailsSection = () => {
  const { order_id } = useParams();

  const [localState, setLocalState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "SET_ORDER_DETAILS":
          return {
            ...state,
            orderDetails: action.payload,
          };
        case "SET_LOADING":
          return {
            ...state,
            loading: action.payload,
          };
        default:
          return state;
      }
    },
    {
      orderDetails: null,
      loading: false,
    }
  );
  document.title = "Chi tiết đơn hàng";
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  const handleCopyUserOrderId = () => {
    navigator.clipboard
      .writeText(order_id)
      .then(() => {
        message.success("Đã sao chép mã đơn hàng");
      })
      .catch(() => {
        message.error("Sao chép mã đơn hàng thất bại");
      });
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLocalState({ type: "SET_LOADING", payload: true });
      try {
        const response = await getOrderDetails(order_id);
        if (response.success) {
          setLocalState({
            type: "SET_ORDER_DETAILS",
            payload: response.order,
          });
        }
      } catch (error) {
        console.log("Error when fetchOrderDetails", error);
      } finally {
        setLocalState({ type: "SET_LOADING", payload: false });
      }
    };
    if (order_id) {
      fetchOrderDetails();
    }
  }, [order_id]);
  useEffect(() => {
    if (localState.orderDetails) {
      console.log(localState.orderDetails);
    }
  }, [localState.orderDetails]);

  return (
    <div className="w-full flex flex-col gap-[2px]">
      {localState.loading ? (
        <div className="flex justify-center items-center h-[300px]">
          <Spin />
        </div>
      ) : localState.orderDetails !== null ? (
        <>
          <div className="flex justify-between items-center p-5 rounded bg-white">
            <span
              className="flex items-center gap-2 text-lg capitalize cursor-pointer text-neutral-500"
              onClick={handleBack}
            >
              <RxCaretLeft />
              Trở lại
            </span>
            <div className="flex items-center gap-3">
              <span className="pr-3 border-r-[1px] border-black flex gap-2 items-center">
                Mã Đơn Hàng: {localState.orderDetails?.user_order_id}{" "}
                <GrCopy
                  className="text-primary cursor-pointer"
                  onClick={handleCopyUserOrderId}
                />
              </span>

              <span className="uppercase text-primary">
                {localState.orderDetails?.ghn_status
                  ? statusDescriptions[localState.orderDetails?.ghn_status]
                  : localState.orderDetails?.OrderStatus?.order_status_name}
              </span>
            </div>
          </div>
          {(localState.orderDetails?.order_status_id === 2 ||
            localState.orderDetails?.order_status_id === 3 ||
            localState.orderDetails?.order_status_id === 4 ||
            localState.orderDetails?.order_status_id === 5) && (
            <>
              <div className="bg-white p-5 rounded">
                <Steps
                  items={[
                    {
                      title: <span className="text-lg">Đặt Hàng</span>,
                      description: (
                        <span className="text-neutral-500">
                          {formatDate(
                            localState.orderDetails?.created_at,
                            "dd/MM/yyyy HH:mm:ss"
                          )}
                        </span>
                      ),
                      status: "finish",
                      icon: <CgNotes className="text-3xl" />,
                    },
                    {
                      title: <span className="text-lg">Đã Giao Cho ĐVVC</span>,
                      description:
                        localState.orderDetails?.log &&
                        localState.orderDetails.log.find(
                          (item) => item.status === "picked"
                        ) &&
                        formatDate(
                          localState.orderDetails.log.find(
                            (item) => item.status === "picked"
                          )?.updated_date,
                          "dd/MM/yyyy HH:mm:ss"
                        ),
                      status:
                        localState.orderDetails?.log &&
                        localState.orderDetails.log.some(
                          (item) => item.status === "picked"
                        )
                          ? "finish"
                          : "wait",
                      icon: <MdLocalShipping className="text-4xl" />,
                    },
                    {
                      title: <span className="text-lg">Chờ Giao Hàng</span>,
                      description: "",
                      status:
                        localState.orderDetails.order_status_id === 4 ||
                        localState.orderDetails.order_status_id === 5
                          ? "finish"
                          : "wait",
                      icon: <HiInboxArrowDown className="text-3xl" />,
                    },
                    {
                      title: <span className="text-lg">Đánh Giá</span>,
                      description: "",
                      status:
                        localState.orderDetails.is_reviewed === 1
                          ? "finish"
                          : "wait",
                      icon: <FaRegStar className="text-3xl " />,
                    },
                  ]}
                />
              </div>
              <div className="bg-third p-5 rounded"></div>
            </>
          )}
          {localState.orderDetails?.order_status_id === 6 && (
            <>
              <div className="rounded bg-third p-5 flex flex-col gap-1">
                <span className="text-lg text-primary">Đã Hủy Đơn Hàng</span>
                <span className="text-neutral-500">
                  vào{" "}
                  {formatDate(
                    localState.orderDetails?.updated_at,
                    "dd/MM/yyyy HH:mm:ss"
                  )}
                </span>
              </div>
              <div className="rounded bg-white p-5">
                Lý do:{" "}
                {
                  localState.orderDetails?.ReturnRequest?.ReturnReason
                    ?.return_reason_name
                }
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className="flex justify-between items-center p-5 rounded bg-white">
            <span
              className="flex items-center gap-2 text-lg capitalize cursor-pointer text-neutral-500"
              onClick={handleBack}
            >
              <RxCaretLeft />
              Trở lại
            </span>
          </div>
          <div className="flex justify-center items-center h-[300px] flex-col gap-3">
            <CgNotes className="text-[40px] text-primary" />
            <span>Không tìm thấy đơn hàng</span>
          </div>
        </>
      )}
    </div>
  );
};

export default memo(OrderDetailsSection);
