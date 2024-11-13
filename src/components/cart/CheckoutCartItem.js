import { ClockCircleFilled } from "@ant-design/icons";
import { Avatar, Button, Divider, Image, Input, Modal, Statistic } from "antd";
import React, { memo, useEffect, useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
const { Countdown } = Statistic;

const CheckoutCartItem = (props) => {
  const { item } = props;

  const navigate = useNavigate();

  const isEnoughFlashSaleStock =
    item?.ProductVarient?.Product?.ShopRegisterFlashSales?.length > 0 &&
    item?.ProductVarient?.Product?.ShopRegisterFlashSales[0]?.quantity -
      item?.ProductVarient?.Product?.ShopRegisterFlashSales[0]?.sold !==
      0;
  const stock =
    item?.ProductVarient?.Product?.ShopRegisterFlashSales?.length > 0 &&
    isEnoughFlashSaleStock
      ? item?.ProductVarient?.Product?.ShopRegisterFlashSales[0]?.quantity -
        item?.ProductVarient?.Product?.ShopRegisterFlashSales[0]?.sold
      : item?.ProductVarient?.stock;

  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("flashSaleEnded")) {
      setOpenModal(true);
    }
  }, []);
  return (
    <>
      <div className="grid grid-cols-12 items-center px-[30px] ">
        <div className="col-span-2 flex justify-center">
          <Image
            className="size-24"
            src={
              item?.ProductVarient?.ProductClassify !== null
                ? item?.ProductVarient?.ProductClassify?.thumbnail
                : item?.ProductVarient?.Product?.thumbnail
            }
          />
        </div>
        <div className="col-span-10 flex flex-col items-start gap-2 relative h-full">
          <span className="text-base font-garibato font-semibold text-ellipsis line-clamp-1">
            {item?.ProductVarient?.Product?.product_name}
          </span>
          <span className="w-fit flex gap-3 items-center">
            Phân loại hàng:{" "}
            {item?.ProductVarient?.ProductClassify?.product_classify_name}
            {item?.ProductVarient?.ProductSize &&
              item?.ProductVarient?.ProductSize?.product_size_name}
            <span>-</span>
            <span>Số lượng: {item?.quantity}</span>
            {stock <= 10 && (
              <div className="flex gap-2 items-center">
                <span className="text-sm text-gray-400">Còn lại:</span>
                <span className="text-sm text-primary font-semibold">
                  {stock} sản phẩm
                </span>
              </div>
            )}
          </span>
          <div className="absolute bottom-0 w-full">
            <div className="flex justify-between ">
              <div className="flex gap-2">
                <span className="flex text-lg text-primary items-center font-garibato font-bold">
                  <sup>₫</sup>
                  {item?.price?.toLocaleString("vi-VN")}
                </span>
                {((item?.ProductVarient?.sale_percents > 0 &&
                  item?.ProductVarient?.Product?.ShopRegisterFlashSales
                    ?.length === 0) ||
                  isEnoughFlashSaleStock) && (
                  <span className="flex items-center text-slate-400 line-through font-garibato italic">
                    <sup>₫</sup>
                    {(
                      item?.quantity * item?.ProductVarient?.price
                    ).toLocaleString("vi-VN")}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 flex justify-between">
          {item?.ProductVarient?.Product?.ShopRegisterFlashSales?.length >
            0 && (
            <>
              <div className="w-fit pl-12 text-orange-500 flex gap-2 items-center mt-2">
                <ClockCircleFilled /> Flash Sale kết thúc trong{" "}
                <Countdown
                  valueStyle={{
                    color: "#ff4d4f",
                    fontSize: "18px",
                    fontWeight: 500,
                  }}
                  onFinish={() => {
                    localStorage.setItem("flashSaleEnded", true);
                    setOpenModal(true);
                  }}
                  value={moment(
                    item?.ProductVarient?.Product?.ShopRegisterFlashSales[0]
                      ?.FlashSaleTimeFrame?.ended_at
                  )}
                />
              </div>
            </>
          )}
        </div>
      </div>
      <Modal
        open={openModal}
        centered={true}
        closable={false}
        footer={
          <div className="w-full flex justify-center items-center">
            <Button
              size="large"
              onClick={() => (
                navigate("/cart"), localStorage.removeItem("flashSaleEnded")
              )}
            >
              Trở về
            </Button>
          </div>
        }
      >
        <div className="text-2xl text-center w-full font-semibold">
          Phiên Flash Sale Đã Kết Thúc
        </div>
      </Modal>
    </>
  );
};

export default memo(CheckoutCartItem);
