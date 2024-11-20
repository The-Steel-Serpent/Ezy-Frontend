import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import VNpayIcon from "../assets/vnpay.png";
import GHNIcon from "../assets/GHNLogo.png";
import { RiInstagramFill } from "react-icons/ri";
import { FaFacebook } from "react-icons/fa";
import BoCongThuong1 from "../assets/logoCCDV.png";
import BoCongThuong2 from "../assets/bo-cong-thuong-2.png";
const Footer = () => {
  const ChamSocKhachHang = [
    {
      url: "/",
      title: "Trung tâm trợ giúp",
    },
    {
      url: "/",
      title: "Hướng dẫn mua hàng",
    },
    {
      url: "/",
      title: "Hướng dẫn bán hàng",
    },
    {
      url: "/",
      title: "Đơn Hàng",
    },
    {
      url: "/",
      title: "Liên Hệ Ezy",
    },
  ];
  const VeChungToi = [
    {
      url: "/",
      title: "Về Chúng Tôi",
    },
    {
      url: "/",
      title: "Tuyển Dụng",
    },
    {
      url: "/",
      title: "Điều Khoản",
    },
    {
      url: "/",
      title: "Chính Sách Bảo Mật",
    },
    {
      url: "/",
      title: "Kênh Người Bán",
    },
  ];
  const navigate = useNavigate();
  return (
    <>
      <div className="w-full bg-third py-4 border-y-[1px] mt-10">
        <div className="max-w-[1200px] mx-auto grid grid-cols-12 text-sm mt-5 border-b-[1px] border-solid border-neutral-400 pb-3">
          <div className="col-span-3 flex flex-col gap-4">
            <span className="font-semibold text-primary">EZY VIỆT NAM</span>
            <ul className="text-neutral-600 gap-2 flex flex-col">
              {VeChungToi.map((item, index) => (
                <li
                  key={index}
                  className="hover:text-secondary cursor-pointer"
                  onClick={() => navigate(item.url)}
                >
                  {item.title}
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-3 flex flex-col gap-4">
            <span className="font-semibold text-primary">
              DỊCH VỤ KHÁCH HÀNG
            </span>
            <ul className="text-neutral-600 gap-2 flex flex-col">
              {ChamSocKhachHang.map((item, index) => (
                <li
                  key={index}
                  className="hover:text-secondary cursor-pointer"
                  onClick={() => navigate(item.url)}
                >
                  {item.title}
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-3 flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-primary">THANH TOÁN</span>
              <div className=" bg-white flex justify-center items-center w-[50%] shadow">
                <img src={VNpayIcon} alt="vnpay" className="w-[52px]" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-primary">
                ĐƠN VỊ VẬN CHUYỂN
              </span>
              <div className=" bg-white flex justify-center items-center w-[50%] shadow">
                <img src={GHNIcon} alt="vnpay" className="w-36" />
              </div>
            </div>
          </div>
          <div className="col-span-3 flex flex-col gap-3">
            <span className="font-semibold text-primary">THEO DÕI EZY</span>
            <ul className="text-neutral-600 gap-2 flex flex-col">
              <li className="text-neutral-600 flex gap-2 items-center hover:text-secondary cursor-pointer">
                <FaFacebook className="text-lg" />
                <span>Facebook</span>
              </li>
              <li className="text-neutral-600 flex gap-2 items-center hover:text-secondary cursor-pointer">
                <RiInstagramFill className="text-lg" />
                <span>Instagram</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto py-4 text-neutral-500">
          <span>© 2024 Ezy.</span>
        </div>
      </div>
      <div className="w-full bg-white flex justify-center items-center py-7">
        <div className="max-w-[1200px]">
          <div className="flex justify-center items-center gap-10">
            <img className="w-36" src={BoCongThuong1} alt="" />
            <img className="w-12" src={BoCongThuong2} alt="" />
          </div>
          <div className="text-center text-neutral-500 flex flex-col gap-2">
            <span>Công ty TNHH Ezy</span>
            <div className="flex flex-col items-center">
              <span>
                Tòa nhà số 140 Đường Lê Trọng Tấn, Phường Tây Thạnh, Quận Tân
                Phú, Thành phố Hồ Chí Minh
              </span>
              <span>
                Giấy chứng nhận đăng ký doanh nghiệp số 0214124125 do Sở Kế
                Hoạch và Đầu Tư Thành phố Hồ Chí Minh cấp lần đầu vào ngày
                23/01/2024.
              </span>
              <span>Hotline: 1900 2307</span>
              <span>© 2024 - Bản quyền thuộc về Công ty TNHH Ezy</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Footer);
