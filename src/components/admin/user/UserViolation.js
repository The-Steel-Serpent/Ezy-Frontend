import React, { useEffect, useState } from "react";
import { Table, Button } from "antd";
import axios from "axios";
import ViolationList from "./ViolationList";

const UserViolation = () => {
  const [usersWithViolations, setUsersWithViolations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchUsersWithViolations = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/violations/get-reported-customers`
      );
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

  const columns = [
    { title: "Tên người dùng", dataIndex: "full_name", key: "full_name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Chờ xử lý", dataIndex: "pending_count", key: "pending_count" },
    { title: "Đã xử lý", dataIndex: "resolved_count", key: "resolved_count" },
    //{ title: "Tổng số báo cáo", dataIndex: "total_violations", key: "total_violations" },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => {
            setSelectedUser(record);
            setIsModalVisible(true);
          }}
        >
          Xem báo cáo
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 20, fontSize: 20 }}>Danh sách người dùng bị báo cáo</h2>
      <Table
        columns={columns}
        dataSource={usersWithViolations}
        rowKey="user_id"
        pagination={{ pageSize: 10 }}
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
