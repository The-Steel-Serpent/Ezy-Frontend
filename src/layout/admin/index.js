import React, { Suspense, useCallback, useEffect, useState } from "react";
import {
  CustomerServiceOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import {
  Button,
  Layout,
  message,
  theme,
  Spin,
  FloatButton,
  Popover,
} from "antd";
import AdminSidebar from "../../components/AdminSidebar";
import logo from "../../assets/image (1) (2).png";
import "../../styles/admin.css";
import AdminHeader from "../../components/AdminHeader";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout, setToken, setUser } from "../../redux/userSlice";
import {
  checkSession,
  startTokenRefreshListener,
} from "../../firebase/AuthenticationFirebase";
import { GrSystem } from "react-icons/gr";
import SupportChatbox from "../../components/support-chatbox/SupportChatbox";
import {
  SupportMessageProvider,
  useSupportMessage,
} from "../../providers/SupportMessagesProvider";
import { io } from "socket.io-client";
import { setSupportMessageState } from "../../redux/supportMessageSlice";
import { connectSocket, disconnectSocket } from "../../socket/socketActions";
import ChatBox from "../../components/chatbox/ChatBox";
import { authFirebase, db } from "../../firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import toast from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";
const ALLOWED_ROLES = [3, 4, 5, 6]; // 3: Admin, 4: Event manager, 5: Shop manager
const { Header, Sider, Content } = Layout;

const AdminAuthLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  // const [user, setUserState] = useState(null);

  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const supportMessageState = useSelector((state) => state.supportMessage);
  const token = localStorage.getItem("token");
  const handleExpiredToken = () => {
    dispatch(logout());
    localStorage.clear();
    //message.error("Phiên đăng nhập đã hết hạn.");
    navigate("/admin/login");
  };

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
        dispatch(logout());
        localStorage.clear();
      }
    } catch (error) {
      if (error.response.data.code === "auth/id-token-expired") {
        //message.error("Phiên Đăng nhập đã hết hạn");
        dispatch(logout());
        localStorage.clear();
      }
    }
  }, [dispatch]);

  const fetchUserData = async () => {
    setLoading(true);
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

      const fetchedUser = res.data.user;

      if (ALLOWED_ROLES.includes(fetchedUser.role_id)) {
        dispatch(
          setUser({
            user_id: fetchedUser.user_id,
            username: fetchedUser.username,
            full_name: fetchedUser.full_name,
            email: fetchedUser.email,
            phone_number: fetchedUser.phone_number,
            gender: fetchedUser.gender,
            dob: fetchedUser.dob,
            avt_url: fetchedUser.avt_url,
            role_id: fetchedUser.role_id,
            setup: fetchedUser.setup,
            isVerified: fetchedUser.isVerified,
            security_password: fetchedUser.security_password,
            is_banned: fetchedUser.is_banned,
          })
        );
        dispatch(setToken(token));
      } else {
        message.error(
          "Tài khoản của bạn không có quyền truy cập vào trang này"
        );
      }
    } catch (error) {
      console.error("Error while fetching user data: ", error);
      handleExpiredToken();
      if (error.response) {
        console.error("Error Response: ", error.response.data);
        if (
          error.response.status === 401 ||
          error.response.data.code === "auth/id-token-expired"
        ) {
          handleExpiredToken();
        } else {
          message.error("Vui lòng đăng nhập để tiếp tục.");
        }
      } else {
        message.error("Lỗi hệ thống, vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Token: ", token);
    fetchUserData();
  }, [token]);

  useEffect(() => {
    startTokenRefreshListener();
  }, []);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(authFirebase, (user) => {
      if (user) {
        let firstCheck = true; // Cờ để bỏ qua kiểm tra đầu tiên
        const unsubscribeSnapshot = onSnapshot(
          doc(db, "users", user.uid),
          async (docSnapshot) => {
            const data = docSnapshot.data();
            const localSessionToken = localStorage.getItem("sessionToken");

            // Bỏ qua kiểm tra đầu tiên sau khi đăng nhập
            if (firstCheck) {
              firstCheck = false;
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
          }
        );

        return () => unsubscribeSnapshot();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const handleCheckSession = async (userId) => {
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
    if (user?.user_id) {
      dispatch(connectSocket(user.user_id));

      return () => {
        dispatch(disconnectSocket());
      };
    }
  }, [user, dispatch]);

  return (
    <Layout>
      <Sider
        theme="light"
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="sider"
      >
        <div style={{ backgroundColor: theme.primaryColor }}>
          <img src={logo} alt="logo" />
        </div>
        {!loading && user && <AdminSidebar role_id={user.role_id} />}
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className="trigger-btn"
        />
      </Sider>
      <Layout>
        <Header className="header">
          <AdminHeader onLogout={logOut} user={user} />
        </Header>
        <Content className="content">
          {loading ? <Spin size="large" /> : children}
        </Content>
      </Layout>
      <Suspense>
        <FloatButton.Group className="bottom-16">
          <FloatButton.BackTop className="go-first" />
          <ChatBox />
          <Popover
            trigger="click"
            content={<SupportChatbox />}
            open={supportMessageState.openSupportChatbox}
            onOpenChange={(newOpen) => {
              console.log("newOpen", newOpen);
              dispatch(
                setSupportMessageState({
                  openSupportChatbox: newOpen,
                })
              );
            }}
            placement="leftTop"
          >
            <FloatButton
              icon={<CustomerServiceOutlined className="text-blue-500" />}
              tooltip="Hỗ trợ khách hàng"
            />
          </Popover>
        </FloatButton.Group>
      </Suspense>
    </Layout>
  );
};

export default AdminAuthLayout;
