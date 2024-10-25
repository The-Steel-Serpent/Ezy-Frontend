import { Button, Result } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const CheckoutResult = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="">
        <Result
          status={"success"}
          title="Đặt Hàng Thành Công!"
          subTitle={"Cảm ơn bạn đã ủng hộ"}
          extra={
            <Button
              className="bg-primary text-white hover:opacity-80"
              size="large"
              onClick={() => navigate("/")}
            >
              Trở về trang chủ
            </Button>
          }
        />
      </div>
    </>
  );
};

export default CheckoutResult;
