import React, { useEffect, useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Button, Layout, message, theme } from 'antd';
import AdminSidebar from '../../components/AdminSidebar';
import logo from '../../assets/image (1) (2).png';
import "../../styles/admin.css";
import AdminHeader from '../../components/AdminHeader';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios

const { Header, Sider, Content } = Layout;

const AdminAuthLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Hàm đăng xuất
  const onLogout = () => {
    localStorage.removeItem('token'); // Xóa token
    navigate('/admin/login'); // Chuyển hướng về trang đăng nhập
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/admin/login'); 
    } else {
      const fetchUserData = async () => {
        try {
          const url = `${process.env.REACT_APP_BACKEND_URL}/api/fetch_user_data`; // URL API
          const res = await axios.post(
            url,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );

          if (res.status === 200) {
            const fetchedUser = res.data.user;
            if (fetchedUser.role_id === 3) { // Kiểm tra role_id
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
              });
            } else {
              message.error("Tài khoản của bạn không có quyền truy cập vào trang này");
              onLogout();
            }
          } else {
            console.log("Lỗi khi Fetch dữ liệu người dùng: ", res);
          }
        } catch (error) {
          console.log("Lỗi khi Fetch dữ liệu người dùng: ", error.response?.status);
          switch (error.response?.status) {
            case 500:
              message.error("Phiên Đăng nhập đã hết hạn");
              navigate("/admin/login");
              break;
            default:
              break;
          }
          console.log("Lỗi khi Fetch dữ liệu người dùng: ", error);
        }
      };

      // Fetch user data nếu token tồn tại
      if (token && !user?.user_id) {
        fetchUserData();
      } else {
        console.log("Token không tồn tại hoặc đã có dữ liệu");
        if (user?.user_id === "") {
          navigate("/admin/login");
        }
      }
    }
  }, [navigate, user]);

  return (
    <Layout>
      <Sider theme='light' trigger={null} collapsible collapsed={collapsed} className='sider'>
        <div style={{ backgroundColor: theme.primaryColor }}>
          <img src={logo} alt='logo' />
        </div>
        <AdminSidebar />
        <Button
          type='text'
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className='trigger-btn'
        />
      </Sider>
      <Layout>
        <Header className='header'>
          {/* Truyền user vào AdminHeader */}
          <AdminHeader onLogout={onLogout} user={user} />
        </Header>
        <Content className='content'>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminAuthLayout;
