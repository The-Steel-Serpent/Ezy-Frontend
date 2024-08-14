/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { React, useEffect, memo } from "react";
import OrangeLogo from "../assets/orange-logo.png";

const SecondaryHeader = () => {
  const pathname = window.location.pathname;
  const title = pathname.split("/")[2];

  return (
    <div className="bg-white h-20 shadow">
      <div className="max-w-[1200px] flex m-auto p-4 justify-between">
        <div className="flex gap-3">
          <a href="/">
            <img src={OrangeLogo} width={130} />
          </a>
          <div className="text-2xl flex justify-center items-end p-[1px] font-[500] text-[#222]">
            <span>{title === "register" ? "Đăng ký" : "Đăng nhập"}</span>
          </div>
        </div>
        <a
          href="#"
          className="items-center justify-center flex text-sm text-[#ee4d2d]"
        >
          Bạn cần giúp đỡ?
        </a>
      </div>
    </div>
  );
};

export default memo(SecondaryHeader);
