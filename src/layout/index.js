import React, { lazy, useCallback, useEffect, useState } from "react";
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
import {
  checkSession,
  startTokenRefreshListener,
} from "../firebase/AuthenticationFirebase";
import { io } from "socket.io-client";
import { is } from "date-fns/locale";
import { SupportMessageProvider } from "../providers/SupportMessagesProvider";
import { connectSocket, disconnectSocket } from "../socket/socketActions";
import { getAuth, onAuthStateChanged, unlink } from "firebase/auth";
import Footer from "../components/Footer";
import { authFirebase } from "../firebase/firebase";
import toast from "react-hot-toast";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
const AuthLayout = ({ children }) => {
  const dispatch = useDispatch();
  const db = getFirestore();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const shop = useSelector((state) => state.shop);
  // const socketConnection = useSelector((state) => state.user.socketConnection);
  const token = localStorage.getItem("token");
  const location = useLocation();
  const useType = location.pathname.split("/")[1];

  const logOut = useCallback(async () => {
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
        localStorage.removeItem("sessionToken");
      }
    }
  }, [dispatch]);
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
            localStorage.removeItem("sessionToken");
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
    const handleCheckSession = async (userId) => {
      if (localStorage.getItem("skipSessionCheck") === "true") {
        console.log("Bỏ qua kiểm tra phiên đăng nhập.");
        return true;
      }
      if (localStorage.getItem("sessionToken") === null) {
        return true;
      }

      const isSessionValid = await checkSession(userId);

      if (isSessionValid) {
        console.log("Phiên hợp lệ");
        return true;
      } else {
        console.log("Phiên không hợp lệ, người dùng đã bị đăng xuất.");
        authFirebase.signOut();
        await logOut();
        return false;
      }
    };
    if (user.user_id !== "") {
      handleCheckSession(user.user_id);
    }
  }, [logOut, user.user_id]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(authFirebase, (user) => {
      if (user) {
        // let firstCheck = true; // Cờ để bỏ qua kiểm tra đầu tiên
        const unsubscribeSnapshot = onSnapshot(
          doc(db, "users", user.uid),
          async (docSnapshot) => {
            const data = docSnapshot.data();
            const localSessionToken = localStorage.getItem("sessionToken");

            // // Bỏ qua kiểm tra đầu tiên sau khi đăng nhập
            // if (firstCheck) {
            //   firstCheck = false;
            //   return;
            // }
            if (localSessionToken === null) {
              return;
            }
            // Kiểm tra nếu token không khớp, thực hiện đăng xuất
            if (data?.sessionToken !== localSessionToken) {
              toast.error(
                "Phiên của bạn đã bị đăng xuất do đăng nhập từ thiết bị khác."
              );
              authFirebase.signOut();
              await logOut();
              localStorage.removeItem("sessionToken");
              window.location.reload();
            }

            if (data?.isDisabled) {
              toast.error(
                "Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ hỗ trợ."
              );
              authFirebase.signOut();
              await logOut();
              localStorage.removeItem("sessionToken");
              window.location.reload();
            }
          }
        );

        return () => unsubscribeSnapshot();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user?.user_id) {
      dispatch(connectSocket(user.user_id));

      return () => {
        dispatch(disconnectSocket());
      };
    }
  }, [user, dispatch]);
  return (
    <>
      {useType !== "buyer" && useType !== "cart" && <PrimaryHeader />}
      {useType === "cart" && <CartHeader />}
      {children}
      <Footer />
    </>
  );
};

export default AuthLayout;
