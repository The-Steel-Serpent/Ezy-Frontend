/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import {
  React,
  memo,
  useEffect,
  useState,
  useCallback,
  useMemo,
  lazy,
  Suspense,
} from "react";
import withSuspense from "../hooks/HOC/withSuspense";
import { IoLogoFacebook } from "react-icons/io5";
import { AiFillInstagram } from "react-icons/ai";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { FaAngleDown } from "react-icons/fa6";
import { TfiWorld } from "react-icons/tfi";
import WhitePhoto from "../assets/image (1) (2).png";
import { IoIosSearch } from "react-icons/io";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { useSelector } from "react-redux";
import AvatarWithPopover from "./AvatarWithPopover";
import { Skeleton } from "antd";
// import FullLogo from "./FullLogo";
const ChatBox = lazy(() => import("./chatbox/ChatBox"));

const PrimaryHeader = () => {
  const user = useSelector((state) => state?.user);

  const searchItem = [
    "Điện Thoại Giá 1k",
    "Áo Thun Nam Form Rộng",
    "Điện Thoại 8plus Giá Rẻ",
    "Ăn Vặt",
    "Váy Babydoll",
    "Capybara Chảy Nước Mũi",
    "Vòng Cổ Cặp",
  ];

  return (
    <>
      <header className="w-full h-fit bg-custom-gradient pt-1 sticky top-0 z-[100] left-0 right-0">
        <div className="text-white text-sm max-w-[1200px] hidden lg:flex m-auto h-[34px]">
          <ul className="flex ">
            <li className="p-1 nav-link nav-link-hoverable">
              <a href="/seller/login">Kênh người bán</a>
            </li>
            <li className="p-1 nav-link nav-link-hoverable">
              <a href="#" className="">
                Tải ứng dụng
              </a>
            </li>
            <li className="p-1">
              <div className="flex w-fit">
                <p className="mr-1">Kết nối </p>
                <a href="#" className="px-[3px] py-[2px] nav-link-hoverable">
                  <IoLogoFacebook size={19} />
                </a>
                <a className="px-[3px] py-[2px] nav-link-hoverable">
                  <AiFillInstagram size={19} />
                </a>
              </div>
            </li>
          </ul>
          <div className="flex-1"></div>
          <ul className="flex">
            <li className="p-1 mr-1">
              <a href="#" className="flex items-center nav-link-hoverable">
                <IoMdNotificationsOutline size={21} className="mr-1" /> Thông
                báo
              </a>
            </li>
            <li className="p-1 mr-1">
              <a href="#" className="flex items-center nav-link-hoverable">
                <AiOutlineQuestionCircle size={21} className="mr-1" /> Hỗ Trợ
              </a>
            </li>
            <li className="p-1 mr-1">
              <a href="#" className="flex items-center nav-link-hoverable">
                <TfiWorld size={16} className="mr-1" />
                Tiếng Việt
                <FaAngleDown size={16} className="ml-1" />
              </a>
            </li>
            <li className="p-1 flex gap-2 ">
              {!user._id && (
                <>
                  <a href="/buyer/register" className="nav-link-hoverable">
                    Đăng ký
                  </a>
                  <div className="navbar__link-separator nav-link-hoverable"></div>
                  <a href="/buyer/login" className="divider nav-link-hoverable">
                    Đăng nhập
                  </a>
                </>
              )}
              {user._id && (
                <AvatarWithPopover
                  name={user.username}
                  img={user.profile_pic}
                  size={23}
                />
              )}
            </li>
          </ul>
        </div>
        <div className="grid grid-cols-12 m-auto max-w-[1200px] pt-4 items-center">
          <a
            href="/"
            className="lg:col-span-2 col-span-full flex justify-center items-center lg:block mb-5"
          >
            <img src={WhitePhoto} className="pr-[30px]" />
            {/* <FullLogo className="fill-white" /> */}
          </a>
          <div className="col-span-8 ml-2 lg:ml-0 items-center">
            <form className="bg-white rounded flex p-[2px] lg:flex-row flex-row-reverse">
              <input
                type="text"
                className="p-2 w-full text-sm rounded focus:after:border lg:mr-1 lg:ml-0 ml-1 text-ellipsis line-clamp-1"
                placeholder="Shopee bao ship 0Đ - Đăng ký ngay!"
              />
              <button className="lg:bg-custom-gradient lg:text-white w-16 rounded flex justify-center items-center text-slate-400">
                <span>
                  <IoIosSearch size={20} />
                </span>
              </button>
            </form>
            {/* <ul className="text-xs text-white hidden justify-between items-center mt-2 gap-1 lg:flex">
              {searchItem.map((value, key) => {
                return (
                  <li key={key}>
                    <a href="#">{value}</a>
                  </li>
                );
              })}
            </ul> */}
          </div>
          <div className="col-span-2 text-white flex justify-center items-center">
            <a href="#">
              <PiShoppingCartSimpleBold size={27} />
            </a>
          </div>
          <div className="col-span-2 lg:hidden flex text-white text-sm items-center">
            {!user._id && (
              <a href="/buyer/login" className="divider nav-link-hoverable">
                Đăng nhập
              </a>
            )}
            {user._id && <AvatarWithPopover img={user.profile_pic} size={30} />}
          </div>
        </div>
      </header>
      <Suspense fallback={<Skeleton.Node style={{ width: 160 }} />}>
        <ChatBox />
      </Suspense>
    </>
  );
};

export default memo(PrimaryHeader);
