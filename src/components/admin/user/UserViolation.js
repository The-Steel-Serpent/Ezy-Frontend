import React, { useEffect, useState } from "react";
import { Table, Button, Tabs, Input } from "antd";
import ResolveViolationModal from "./ViolationList";
import ViolationHistoryModal from "./ViolationHistoryModal";
import WarningModal from "./WarningModal";

const { TabPane } = Tabs;
const { Search } = Input;

const UserViolation = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // For storing search results
  const [loading, setLoading] = useState(false);
  const [selectedUserForReports, setSelectedUserForReports] = useState(null);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [selectedUserIdForHistory, setSelectedUserIdForHistory] = useState(null);
  const [warningModalVisible, setWarningModalVisible] = useState(false);
  const [selectedUserForWarning, setSelectedUserForWarning] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/violations/get-reported-customers`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsers(data.data);
          setFilteredUsers(data.data); // Set initial filtered data
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter active and locked users
  const activeUsers = filteredUsers.filter((user) => !user.is_banned);
  const lockedUsers = filteredUsers.filter((user) => user.is_banned);

  // Handle search
  const handleSearch = (value) => {
    const lowerValue = value.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.user_id.toLowerCase().includes(lowerValue) ||
        user.full_name.toLowerCase().includes(lowerValue) ||
        user.email.toLowerCase().includes(lowerValue) ||
        user.phone_number.includes(lowerValue)
    );
    setFilteredUsers(filtered);
  };

  const columns = [
    {
      title: "Mã khách hàng",
      dataIndex: "user_id",
      key: "user_id",
      align: "left",
    },
    {
      title: "Họ tên",
      dataIndex: "full_name",
      key: "full_name",
      align: "left",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "left",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone_number",
      key: "phone_number",
      align: "center",
    },
    {
      title: "Chờ xem",
      dataIndex: "pending_count",
      key: "pending_count",
      align: "center",
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          <Button
            onClick={() => setSelectedUserForReports(record)}
            style={{ backgroundColor: "#f0f0f0", borderColor: "#d9d9d9" }}
          >
            Xem báo cáo
          </Button>
          <Button
            onClick={() => {
              setSelectedUserIdForHistory(record.user_id);
              setHistoryModalVisible(true);
            }}
            style={{ backgroundColor: "#f0f0f0", borderColor: "#d9d9d9" }}
          >
            Lịch sử vi phạm
          </Button>
          {!record.is_banned && (
            <Button
              type="primary"
              onClick={() => {
                setSelectedUserForWarning(record);
                setWarningModalVisible(true);
              }}
            >
              Cảnh báo vi phạm
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px", textAlign: "center", fontSize: "24px" }}>
        Danh sách khách hàng vi phạm
      </h1>
      <div style={{ marginBottom: "20px" }}>
        <Search
          placeholder="Tìm kiếm theo mã khách hàng, tên, email, số điện thoại"
          onSearch={handleSearch}
          enterButton
          allowClear
        />
      </div>
      <Tabs defaultActiveKey="active">
        <TabPane tab="Tài khoản đang hoạt động" key="active">
          <Table
            columns={columns}
            dataSource={activeUsers}
            loading={loading}
            rowKey="user_id"
            bordered
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
        <TabPane tab="Tài khoản đã khóa" key="locked">
          <Table
            columns={columns}
            dataSource={lockedUsers}
            loading={loading}
            rowKey="user_id"
            bordered
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
      </Tabs>
      {selectedUserForReports && (
        <ResolveViolationModal
          user={selectedUserForReports}
          onClose={() => setSelectedUserForReports(null)}
        />
      )}
      {historyModalVisible && (
        <ViolationHistoryModal
          visible={historyModalVisible}
          onClose={() => setHistoryModalVisible(false)}
          userId={selectedUserIdForHistory}
        />
      )}
      {warningModalVisible && (
        <WarningModal
          visible={warningModalVisible}
          onClose={() => setWarningModalVisible(false)}
          user={selectedUserForWarning}
        />
      )}
    </div>
  );
};

export default UserViolation;
