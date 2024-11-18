import React, { Suspense, useEffect, useState } from "react";
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
import { startTokenRefreshListener } from "../../firebase/AuthenticationFirebase";
import { GrSystem } from "react-icons/gr";
import SupportChatbox from "../../components/support-chatbox/SupportChatbox";
import { useSupportMessage } from "../../providers/SupportMessagesProvider";
import { io } from "socket.io-client";
const ALLOWED_ROLES = [3, 4, 5]; // 3: Admin, 4: Event manager, 5: Shop manager
const { Header, Sider, Content } = Layout;

const AdminAuthLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  // const [user, setUserState] = useState(null);
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { supportMessageState, setSupportMessageState } = useSupportMessage();
  const handleExpiredToken = () => {
    dispatch(logout());
    localStorage.clear();
    message.error("Vui lòng đăng nhập.");
    navigate("/admin/login");
  };
  const token = localStorage.getItem("token");

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
      handleExpiredToken();
      if (res.data.success) {
        dispatch(logout());
        localStorage.clear();
      }
    } catch (error) {
      if (error.response?.data?.code === "auth/id-token-expired") {
        handleExpiredToken();
        message.error("Phiên Đăng nhập đã hết hạn");
      }
    }
  };

  const fetchUserData = async () => {
    setLoading(true);
    if (!token) {
      handleExpiredToken();
      return;
    }

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
        // setUserState({
        //   user_id: fetchedUser.user_id,
        //   username: fetchedUser.username,
        //   full_name: fetchedUser.full_name,
        //   email: fetchedUser.email,
        //   phone_number: fetchedUser.phone_number,
        //   gender: fetchedUser.gender,
        //   dob: fetchedUser.dob,
        //   avt_url: fetchedUser.avt_url,
        //   role_id: fetchedUser.role_id,
        //   setup: fetchedUser.setup,
        //   isVerified: fetchedUser.isVerified,
        //   //is_banned: user.is_banned,
        // });
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
            // is_banned: user.is_banned,
          })
        );
        dispatch(setToken(token));
      } else {
        message.error(
          "Tài khoản của bạn không có quyền truy cập vào trang này"
        );
        handleExpiredToken();
      }
    } catch (error) {
      console.error("Error while fetching user data: ", error);
      if (error.response) {
        console.error("Error Response: ", error.response.data);
        if (
          error.response.status === 401 ||
          error.response.data.code === "auth/id-token-expired"
        ) {
          handleExpiredToken();
        } else {
          message.error("Lỗi hệ thống, vui lòng thử lại sau.");
        }
      } else {
        message.error("Lỗi hệ thống, vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!user.user_id || user.user_id === "") {
      return;
    }
    const socket = io.connect(process.env.REACT_APP_BACKEND_URL, {
      query: { user_id: user.user_id },
    });
    socket.on("supportRequestClosed", (data) => {
      console.log(data);
      localStorage.removeItem("request_support_id");
      setSupportMessageState({
        type: "requestSupport",
        payload: null,
      });
      setSupportMessageState({ type: "sender", payload: null });
      setSupportMessageState({ type: "supporter", payload: null });
    });
    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    fetchUserData();
  }, [token]);

  useEffect(() => {
    startTokenRefreshListener();
  }, []);

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
          <Popover trigger="click" open={false} placement="left">
            <FloatButton
              icon={<GrSystem className="text-blue-500" />}
              tooltip="Tin nhắn hệ thống"
            />
          </Popover>
          <Popover
            trigger="click"
            content={<SupportChatbox />}
            open={supportMessageState.openSupportChatbox}
            onOpenChange={(newOpen) => {
              setSupportMessageState({
                type: "openSupportChatbox",
                payload: newOpen,
              });
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
