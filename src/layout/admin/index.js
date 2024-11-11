import React, { useEffect, useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, message, theme, Spin } from "antd";
import AdminSidebar from "../../components/AdminSidebar";
import logo from "../../assets/image (1) (2).png";
import "../../styles/admin.css";
import AdminHeader from "../../components/AdminHeader";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logout, setToken, setUser } from "../../redux/userSlice";
import { startTokenRefreshListener } from "../../firebase/AuthenticationFirebase";
const ALLOWED_ROLES = [3, 4, 5]; // 3: Admin, 4: Event manager, 5: Shop manager
const { Header, Sider, Content } = Layout;

const AdminAuthLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleExpiredToken = () => {
    dispatch(logout());
    localStorage.clear();
    message.error("Vui lòng đăng nhập.");
    navigate("/admin/login");
  };

  const logOut = async () => {
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/logout`;
      await axios.post(
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
    } catch (error) {
      if (error.response?.data?.code === "auth/id-token-expired") {
        handleExpiredToken();
      } else {
        message.error("Đăng xuất không thành công. Vui lòng thử lại.");
      }
    }
  };

  const fetchUserData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
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
        setUserState({
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
          is_banned: user.is_banned,
        });
        dispatch(setUser(fetchedUser));
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
    startTokenRefreshListener();
    fetchUserData();
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
    </Layout>
  );
};

export default AdminAuthLayout;
