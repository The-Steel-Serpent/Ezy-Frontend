import React, { lazy, useEffect } from "react";
import PrimaryHeader from "../components/PrimaryHeader";
import { useLocation } from "react-router-dom";
import { setUser, setToken } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { message } from "antd";
import { logout } from "../redux/userSlice";
const AuthLayout = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const token = localStorage.getItem("token");
  const location = useLocation();
  const useType = location.pathname.split("/")[1];

  const logOut = async () => {
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/logout`;
      const res = await axios.post(
        URL,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        message.error("Tài khoản của bạn không phải là tài khoản khách hàng");
        dispatch(logout());
        localStorage.clear();
      }
    } catch (error) {
      message.error(error?.response?.data?.message);
    }
  };
  //side Effect
  useEffect(() => {
    console.log("Token: ", token);
    console.log("User: ", user);
    const fetchUserData = async () => {
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/api/fetch_user_data`;
        const res = await axios.post(
          url,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        if (res.status === 200) {
          const user = res.data.user;
          console.log("Dữ liệu: ", user);
          if (user.role_id === 1) {
            dispatch(
              setUser({
                user_id: user.user_id,
                username: user.username,
                full_name: user.full_name,
                email: user.email,
                phone_number: user.phone_number,
                gender: user.gender,
                dob: user.dob,
                avt_url: user.avt_url,
                role_id: user.role_id,
                setup: user.setup,
                isVerified: user.isVerified,
              })
            );
            dispatch(setToken(token));
          } else {
            await logOut();
          }
        } else {
          console.log("Lỗi khi Fetch dữ liệu người dùng: ", res);
        }
      } catch (error) {
        console.log("Lỗi khi Fetch dữ liệu người dùng: ", error);
      }
    };
    if (token && !user?.user_id) {
      fetchUserData();
      console.log("Fetch dữ liệu người dùng thành", user);
    } else {
      console.log("Token không tồn tại hoặc đã có dữ liệu");
    }
  }, [token, user?.user_id]);

  return (
    <>
      {useType !== "buyer" && <PrimaryHeader />}
      {children}
    </>
  );
};

export default AuthLayout;
