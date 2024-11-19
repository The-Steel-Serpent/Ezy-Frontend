import React, { lazy, useEffect, useState } from "react";
import PrimaryHeader from "../components/PrimaryHeader";
import { useLocation, useNavigate } from "react-router-dom";
import { setUser, setToken, setSocketConnection } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { message } from "antd";
import { logout } from "../redux/userSlice";
import { clearCart } from "../redux/cartSlice";
import { logoutShop } from "../redux/shopSlice";
import CartHeader from "../components/CartHeader";
import { startTokenRefreshListener } from "../firebase/AuthenticationFirebase";
import { io } from "socket.io-client";
import { is } from "date-fns/locale";
import { SupportMessageProvider } from "../providers/SupportMessagesProvider";
import { connectSocket, disconnectSocket } from "../socket/socketActions";
import { getAuth, onAuthStateChanged, unlink } from "firebase/auth";
const AuthLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const shop = useSelector((state) => state.shop);
  // const socketConnection = useSelector((state) => state.user.socketConnection);
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
        dispatch(logoutShop());
        dispatch(clearCart());
        localStorage.clear();
      }
    } catch (error) {
      if (error.response.data.code === "auth/id-token-expired") {
        message.error("Phiên Đăng nhập đã hết hạn");
      }
    }
  };
  //side Effect
  useEffect(() => {
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
          if (user.role_id === 1) {
            dispatch(
              setUser({
                user_id: user.user_id,
                username: user.username,
                full_name: user.full_name,
                email: user.email,
                security_password: user.security_password,
                phone_number: user.phone_number,
                gender: user.gender,
                dob: user.dob,
                avt_url: user.avt_url,
                role_id: user.role_id,
                setup: user.setup,
                isVerified: user.isVerified,
                is_banned: user.is_banned,
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
        console.log(
          "Lỗi khi Fetch dữ liệu người dùng: ",
          error.response.status
        );
        switch (error.response.status) {
          case 500:
            message.error("Phiên Đăng nhập đã hết hạn");
            break;
          default:
            break;
        }
        console.log("Lỗi khi Fetch dữ liệu người dùng: ", error);
      }
    };
    if (token && !user?.user_id) {
      fetchUserData();
    } else {
      console.log("Token không tồn tại hoặc đã có dữ liệu");
    }
  }, [token]);

  useEffect(() => {
    startTokenRefreshListener();
  }, []);

  // useEffect(() => {
  //   if (!user.user_id || user.user_id === "" || user.role_id !== 1) {
  //     return;
  //   }
  //   const socket = io.connect(process.env.REACT_APP_BACKEND_URL, {
  //     query: { user_id: user.user_id },
  //   });
  //   console.log("kết nối đến socket rồi nè", socket);

  //   socket.on("newOrder", (data) => {
  //     const { orderID, selectedVoucher, timestamp } = data;
  //     console.log("new order", data);
  //     socket.emit("cancelOrder", data);
  //   });

  //   socket.on("unBlockOrder", (data) => {
  //     socket.emit("updateBlockStatus", data);
  //   });
  //   dispatch(setSocketConnection(socket));

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [user.user_id, user.role_id, dispatch]);

  useEffect(() => {
    if (user?.user_id) {
      dispatch(connectSocket(user.user_id));

      return () => {
        dispatch(disconnectSocket());
      };
    }
  }, [user, dispatch]);
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User logged in after email verification: ", user);

        // Tiến hành unlink các provider không trùng email
        for (let provider of user.providerData) {
          if (provider.email !== user.email) {
            try {
              await unlink(auth, provider.providerId); // Xóa provider
              console.log(`Unlinked provider: ${provider.providerId}`);
            } catch (error) {
              console.error("Error unlinking provider: ", error);
            }
          }
        }
      } else {
        console.log("User is not logged in after email verification.");
      }
    });

    return () => unsubscribe();
  }, []);
  return (
    <>
      {useType !== "buyer" && useType !== "cart" && <PrimaryHeader />}
      {useType === "cart" && <CartHeader />}
      {children}
    </>
  );
};

export default AuthLayout;
