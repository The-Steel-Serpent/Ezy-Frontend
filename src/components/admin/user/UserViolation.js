import React, { useEffect, useState } from "react";
import { Table, Button, Tabs, Modal, notification } from "antd";
import axios from "axios";
import ViolationList from "./ViolationList";

const { TabPane } = Tabs;

const UserViolation = () => {
  const [usersWithViolations, setUsersWithViolations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchUsersWithViolations = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/violations/get-reported-customers`);
      if (response.data.success) {
        setUsersWithViolations(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching users with violations:", error);
    }
  };

  useEffect(() => {
    fetchUsersWithViolations();
  }, []);

  const openViolationList = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const columns = [
    { title: "Tên người dùng", dataIndex: "full_name", key: "full_name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Số lượng báo cáo", dataIndex: "violation_count", key: "violation_count" },
    { title: "Mức cảnh báo", dataIndex: "warning_level", key: "warning_level" },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Button type="primary" onClick={() => openViolationList(record)}>
          Duyệt báo cáo
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 20, fontSize: 20 }}>Danh sách người dùng cần xử lý</h2>
      <Table
        columns={columns}
        dataSource={usersWithViolations}
        rowKey="user_id"
        pagination={{ pageSize: 5 }}
      />
      {isModalVisible && (
        <ViolationList
          user={selectedUser}
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          refreshUsers={fetchUsersWithViolations}
        />
      )}
    </div>
  );
};

export default UserViolation;
