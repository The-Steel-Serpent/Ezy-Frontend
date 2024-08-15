import React, { useState } from "react";
import { Divider } from "antd";
import { IoMdEye } from "react-icons/io";
import { RiEyeCloseLine } from "react-icons/ri";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { BsShop } from "react-icons/bs";
import { HiOutlineGift } from "react-icons/hi2";
import { PiHandshake } from "react-icons/pi";

const SellerRegister = () => {
  return (
    <div className="bg-white w-full mt-1 shadow-inner flex justify-center gap-32 bg-inmg">
      <div className="max-w-96 px-3 my-24 hidden lg:block">
        <div className="text-primary text-2xl font-[490]">Shopee Việt Nam</div>
        <div className="text-primary text-4xl font-[490]">Trở thành người bán ngay hôm nay</div>
        <div className="text-primary flex items-center gap-5 pt-5">
          <div>
            <BsShop size={28} />
          </div>
          <div className="text-lg">Nền tảng thương mại điện tử hàng đầu Đông Nam Á và Đài Loan</div>
        </div>
        <div className="text-primary flex items-center gap-5 pt-5">
          <div>
            <HiOutlineGift size={28} />
          </div>
          <div className="text-lg">Phát triển trở thành thương hiệu toàn cầu</div>
        </div>
        <div className="text-primary flex items-center gap-5 pt-5">
          <div>
            <PiHandshake size={28} />
          </div>
          <div className="text-lg">Dẫn đầu lượng người dùng trên ứng dụng mua sắm tại Việt Nam</div>
        </div>
      </div>
      <div className="pt-16">
        <form className="w-[400px] shadow-xl px-6 py-6 mb-10 bg-white">
          <h1 className="font-[450] text-xl mb-5">Đăng ký</h1>
          <input
            type="text"
            placeholder="Số điện thoại"
            className="p-3 w-full border rounded mb-8"
            id="username"
          />
          <button className="w-full bg-primary p-3 rounded text-white hover:bg-[#f3664a]">
            TIẾP THEO
          </button>
          <Divider>
            <span className="text-slate-400 text-xs">HOẶC</span>
          </Divider>
          <div className="w-full flex justify-between">
            <button className="border rounded p-2 w-[165px] hover:bg-slate-100">
              <span className="flex gap-1 justify-center items-center">
                <FaFacebook size={23} className="text-[#1877f2]" /> Facebook
              </span>
            </button>
            <button className="border rounded p-2 w-[165px] hover:bg-slate-100">
              <span className="flex gap-1 justify-center items-center">
                <FcGoogle size={23} /> Google
              </span>
            </button>
          </div>
          <div className="text-xs text-center mt-5">Bằng việc đăng kí, bạn đã đồng ý với Shopee về
            <br />
            <a className="text-primary" href="https://help.shopee.vn/portal/article/77243" > Điều khoản dịch vụ</a> &amp;
            <a className="text-primary" href="https://help.shopee.vn/portal/article/77244"> Chính sách bảo mật</a>
          </div>
          <div className="text-sm mt-10 w-full flex justify-center">
            <span className="text-slate-400">Bạn đã có tài khoản?</span>
            <a href="/seller/login" className="text-primary px-1">Đăng nhập</a>
          </div>
        </form>
      </div>
    </div>
  )
};

export default SellerRegister;
