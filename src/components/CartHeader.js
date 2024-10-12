import React, { Suspense, useEffect, useState } from "react";
import whiteEzy from "../assets/logo_ezy.png";
import AvatarWithPopover from "./AvatarWithPopover";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FloatButton } from "antd";
import ChatBox from "./chatbox/ChatBox";
const CartHeader = () => {
  const user = useSelector((state) => state.user);
  const userID = user?.user_id;
  const navigate = useNavigate();
  const [isStateReady, setIsStateReady] = useState(false);
  useEffect(() => {
    // Đặt cờ isStateReady thành true khi state đã được cập nhật
    if (user) {
      setIsStateReady(true);
    }
  }, [user]);

  useEffect(() => {
    if (isStateReady && !userID) {
      navigate("/buyer/login");
    }
  }, [userID, navigate]);
  return (
    <>
      <div className="bg-custom-gradient w-full px-[29px] py-3 flex items-center justify-between">
        <div className="flex gap-2 items-center ">
          <a href="/" className="w-[170px]">
            <img src={whiteEzy} className="w-full" />
          </a>
          <span className="text-3xl text-white">Giỏ Hàng</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white">
            <a href="#" className="flex items-center nav-link-hoverable">
              <IoMdNotificationsOutline size={21} className="mr-1" /> Thông báo
            </a>
          </span>
          {!user.user_id && (
            <a
              href="/buyer/login"
              className="divider nav-link-hoverable text-white"
            >
              Đăng nhập
            </a>
          )}
          {user.user_id && (
            <AvatarWithPopover
              img={user.profile_pic}
              name={user.username}
              size={30}
            />
          )}
        </div>
      </div>
      <Suspense>
        <FloatButton.BackTop className="go-first" />
        <ChatBox />
      </Suspense>
    </>
  );
};

export default CartHeader;
