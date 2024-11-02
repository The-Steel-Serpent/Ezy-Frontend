import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import axios from 'axios';

const Role = () => {
  const [roleData, setRoleData] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/all-role`)
      .then(response => {
        if (response.data.success) {
          setRoleData(response.data.data);
        }
      })
      .catch(error => {
        console.error("Lỗi khi fetch dữ liệu:", error);
      });
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'role_id',
      key: 'role_id',
    },
    {
      title: 'Tên quyền',
      dataIndex: 'role_name',
      key: 'role_name',
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={roleData}
      rowKey="role_id"
      pagination={{ pageSize: 5 }}
    />
  );
};

export default Role;
