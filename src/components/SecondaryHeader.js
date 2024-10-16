/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { React, useEffect, memo } from "react";
import whiteLogo from "../assets/logo_ezy.png";
const SecondaryHeader = () => {
  const pathname = window.location.pathname;
  const title = pathname.split("/")[2];

  return (
    <div className="bg-transparent h-fit shadow-lg border-solid">
      <div className="max-w-[1200px] py-4 flex m-auto justify-between ">
        <div className="ml-4">
          <a href="/">
            <img src={whiteLogo} width={200} />
          </a>
        </div>
        <a
          href="#"
          className="items-center justify-center flex text-sm text-white"
        >
          Bạn cần giúp đỡ?
        </a>
      </div>
    </div>
  );
};

export default memo(SecondaryHeader);
