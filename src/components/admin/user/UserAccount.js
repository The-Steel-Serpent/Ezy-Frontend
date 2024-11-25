import React, { useEffect, useState } from 'react';
import { Table, Button, message, Input, Select, Row, Col, Modal } from 'antd';
import axios from 'axios';
import { resetPassword } from '../../../firebase/AuthenticationFirebase';
import dayjs from 'dayjs';
import RegisterModal from './RegisterModal';
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const UserAccount = () => {
  const [userData, setUserData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [roles, setRoles] = useState([]);
  const [isRegisterVisible, setIsRegisterVisible] = useState(false);

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
          dob: formatDate(user.dob),
        }));
        setUserData(formattedData);
        setFilteredData(formattedData);
      }
    } catch (error) {
      console.error('Có lỗi xảy ra khi tải dữ liệu người dùng:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/all-role`);
      if (response.data.success) {
        setRoles(response.data.data);
      }
    } catch (error) {
      console.error('Có lỗi xảy ra khi tải vai trò:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchRoles();
  }, []);

  const handleSearch = (value) => {
    setSearchText(value);
    filterData(value, selectedRole);
  };

  const handleRoleChange = (value) => {
    setSelectedRole(value);
    filterData(searchText, value);
  };

  const filterData = (search, role) => {
    const filtered = userData.filter((user) => {
      const matchesSearch =
        (user.full_name?.toLowerCase().includes(search.toLowerCase()) || false) ||
        (user.gender?.toLowerCase().includes(search.toLowerCase()) || false) ||
        (user.email?.toLowerCase().includes(search.toLowerCase()) || false) ||
        (user.phone_number?.includes(search) || false) ||
        (user.dob?.includes(search) || false);

      const matchesRole = role ? user.role_id === role : true;

      return matchesSearch && matchesRole;
    });

    setFilteredData(filtered);
  };

  const handleResetPassword = async (email) => {
    try {
      await resetPassword(email);
      message.success(`Đã gửi email đặt lại mật khẩu đến: ${email}`);
    } catch (error) {
      console.error('Lỗi khi đặt lại mật khẩu:', error.message);
      message.error(error.message || 'Đã xảy ra lỗi khi đặt lại mật khẩu.');
    }
  };

  const handleLockUnlockAccount = (user) => {
    Modal.confirm({
      title: `${user.is_banned ? 'Mở khóa' : 'Khóa'} tài khoản`,
      content: `Bạn có chắc chắn muốn ${user.is_banned ? 'mở khóa' : 'khóa'} tài khoản này không?`,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: async () => {
        const action = user.is_banned ? 'unlock-account' : 'lock-account';
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/${action}`,
            { user_id: user.user_id }
          );
          if (response.data.success) {
            message.success(`Tài khoản đã được ${user.is_banned ? 'mở khóa' : 'khóa'} thành công!`);
            fetchData();
          }
        } catch (error) {
          console.error(`Lỗi khi ${user.is_banned ? 'mở khóa' : 'khóa'} tài khoản:`, error.message);
          message.error(`Không thể ${user.is_banned ? 'mở khóa' : 'khóa'} tài khoản.`);
        }
      },
    });
  };

  const handleOpenRegisterModal = () => {
    setIsRegisterVisible(true);
  };

  const handleCloseRegisterModal = () => {
    setIsRegisterVisible(false);
  };

  const handleRegisterSuccess = async (values) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/create-user`, values);
      if (response.data.success) {
        message.success('Tạo tài khoản mới thành công!');
        fetchData();
        handleCloseRegisterModal();
      }
    } catch (error) {
      console.error('Lỗi khi tạo tài khoản mới:', error);
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
      title: 'Vai trò',
      dataIndex: ['Role', 'role_name'],
      key: 'role',
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
        <>
          <Button
            type="primary"
            onClick={() => handleResetPassword(record.email)}
            style={{ marginRight: 8 }}
          >
            Đặt lại mật khẩu
          </Button>
          <Button
            type="default"
            danger={!record.is_banned}
            style={{
              color: record.is_banned ? '#1890ff' : '#fff',
              borderColor: record.is_banned ? '#1890ff' : '#ff4d4f',
              backgroundColor: record.is_banned ? '#fff' : '#ff4d4f',
            }}
            onClick={() => handleLockUnlockAccount(record)}
          >
            {record.is_banned ? 'Mở khóa' : 'Khóa'}
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="text-center">
        <h3 className="text-3xl font-bold text-blue-600">Danh sách tài khoản người dùng</h3>
      </div>
      <div style={{ float: 'right', marginBottom: 16 }}>
        <Button
          type="primary"
          onClick={handleOpenRegisterModal}
          style={{ marginBottom: 16 }}
          icon={<PlusOutlined />}
        >
          Tạo Người Dùng Mới
        </Button>
      </div>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={16}>
          <Input
            placeholder="Tìm kiếm theo họ tên, giới tính, số điện thoại, ngày sinh..."
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Col>
        <Col span={8}>
          <Select
            placeholder="Lọc theo vai trò"
            style={{ width: '100%' }}
            onChange={handleRoleChange}
            allowClear
          >
            {roles.map((role) => (
              <Option key={role.role_id} value={role.role_id}>
                {role.role_name}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={filteredData}
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
