import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import axios from 'axios';

const UserAccount = () => {
  const [userData, setUserData] = useState([]);
  const fecthData = async () => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/all-user`)
      .then(response => {
        if (response.data.success) {
          setUserData(response.data.data);
        }
      })
      .catch(error => {
        console.error("There was an error fetching the user data:", error);
      });
  };
  useEffect(() => {
    fecthData();
  }, []);

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
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
      title: 'Quyền tài khoản',
      dataIndex: ['Role', 'role_name'],
      key: 'role_name',
    },
    {
      title: 'Xác thực',
      dataIndex: 'isVerified',
      key: 'isVerified',
      render: (isVerified) => (isVerified ? 'Đã xác thục' : 'Chưa xác thực'),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={userData}
      rowKey="user_id"
      pagination={{ pageSize: 5 }}
    />
  );
};

export default UserAccount;
