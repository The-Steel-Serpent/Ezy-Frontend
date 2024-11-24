import React, { useEffect, useState } from 'react';
import { Table, Button, message } from 'antd';
import axios from 'axios';
import { resetPassword } from '../../../firebase/AuthenticationFirebase';
import dayjs from 'dayjs';
import RegisterModal from './RegisterModal'; // Import modal đăng ký

const UserAccount = () => {
  const [userData, setUserData] = useState([]);
  const [isRegisterVisible, setIsRegisterVisible] = useState(false); // Trạng thái hiển thị modal đăng ký

  // Hàm format ngày sử dụng Day.js
  const formatDate = (dateString) => {
    if (!dateString) return null;
    return dayjs(dateString).format('DD/MM/YYYY');
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/all-user`);
      if (response.data.success) {
        const formattedData = response.data.data.map((user) => ({
          ...user,
          dob: formatDate(user.dob), // Format ngày sinh
        }));
        setUserData(formattedData);
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi tải dữ liệu người dùng:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Hàm gọi reset mật khẩu
  const handleResetPassword = async (email) => {
    try {
      await resetPassword(email);
      message.success(`Đã gửi email đặt lại mật khẩu đến: ${email}`);
    } catch (error) {
      console.error("Lỗi khi đặt lại mật khẩu:", error.message);
      message.error(error.message || "Đã xảy ra lỗi khi đặt lại mật khẩu.");
    }
  };

  // Hàm mở modal đăng ký
  const handleOpenRegisterModal = () => {
    setIsRegisterVisible(true);
  };

  // Hàm đóng modal đăng ký
  const handleCloseRegisterModal = () => {
    setIsRegisterVisible(false);
  };

  // Hàm xử lý khi đăng ký thành công
  const handleRegisterSuccess = async (values) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/create-user`, values);
      if (response.data.success) {
        message.success('Tạo tài khoản mới thành công!');
        fetchData(); // Tải lại danh sách người dùng
        handleCloseRegisterModal(); // Đóng modal
      }
    } catch (error) {
      console.error("Lỗi khi tạo tài khoản mới:", error);
      message.error('Đã xảy ra lỗi khi tạo tài khoản mới.');
    }
  };

  const columns = [
    {
      title: 'Họ và tên',
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone_number',
      key: 'phone_number',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dob',
      key: 'dob',
    },
    {
      title: 'Trạng thái khóa',
      dataIndex: 'is_banned',
      key: 'is_banned',
      render: (is_banned) => (is_banned ? 'Bị khóa' : 'Hoạt động'),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (text, record) => (
        <Button
          type="primary"
          onClick={() => handleResetPassword(record.email)}
        >
          Đặt lại mật khẩu
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={handleOpenRegisterModal} style={{ marginBottom: 16 }}>
        Tạo Người Dùng Mới
      </Button>
      <Table
        columns={columns}
        dataSource={userData}
        rowKey="user_id"
        pagination={{ pageSize: 5 }}
      />
      <RegisterModal
        visible={isRegisterVisible}
        onClose={handleCloseRegisterModal}
        onSubmit={handleRegisterSuccess}
      />
    </div>
  );
};

export default UserAccount;
