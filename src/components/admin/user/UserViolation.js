import React, { useEffect, useState } from "react";
import { Table, Button } from "antd";
import axios from "axios";
import ViolationList from "./ViolationList";
import ViolationHistoryModal from "./ViolationHistoryModal";
import { useMessages } from "../../../providers/MessagesProvider";

const UserViolation = () => {
  const [usersWithViolations, setUsersWithViolations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isListModalVisible, setIsListModalVisible] = useState(false);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const { handleUserSelected } = useMessages();

  const fetchUsersWithViolations = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/violations/get-reported-customers`
      );
      if (response.data.success) {
        const sortedData = response.data.data.sort((a, b) => {
          // Ưu tiên user chưa bị ban (is_banned = 0)
          if (a.is_banned !== b.is_banned) {
            return a.is_banned - b.is_banned;
          }
          // Sắp xếp theo số vi phạm (giảm dần)
          return b.total_violations - a.total_violations;
        });
        setUsersWithViolations(sortedData);
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
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => {
              setSelectedUser(record);
              setIsListModalVisible(true);
            }}
            disabled={record.is_banned === 1}
          >
            Xem báo cáo
          </Button>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => {
              setSelectedUser(record);
              setIsHistoryModalVisible(true);
            }}
          >
            Lịch sử xử lý vi phạm
          </Button>
          <Button
            type="primary"
            onClick={() => {
              handleUserSelected(record.user_id);
            }}
          >
            Liên hệ người dùng
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Danh sách người dùng bị báo cáo</h2>
      <Table
        columns={columns}
        dataSource={usersWithViolations}
        rowKey="user_id"
        pagination={{ pageSize: 10 }}
      />
      {isListModalVisible && selectedUser && (
        <ViolationList
          user={selectedUser}
          visible={isListModalVisible}
          onClose={() => setIsListModalVisible(false)}
          refreshUsers={fetchUsersWithViolations}
        />
      )}
      {isHistoryModalVisible && selectedUser && (
        <ViolationHistoryModal
          userId={selectedUser.user_id}
          visible={isHistoryModalVisible}
          onClose={() => setIsHistoryModalVisible(false)}
        />
      )}
    </div>
  );
};

export default UserViolation;
