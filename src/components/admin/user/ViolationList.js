import React, { useEffect, useState } from "react";
import { Table, Tabs, Button, notification, Modal } from "antd";
import axios from "axios";
import ResolveViolationModal from "./ResolveViolationModal";
import dayjs from "dayjs";

const { TabPane } = Tabs;

const ViolationList = ({ user, visible, onClose, refreshUsers }) => {
  const [pendingReports, setPendingReports] = useState([]);
  const [resolvedReports, setResolvedReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchViolations = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/violations/user/${user.user_id}`
      );
      if (response.data.success) {
        const reports = response.data.data;
        setPendingReports(reports.filter((r) => r.status === "Chưa xử lý"));
        setResolvedReports(reports.filter((r) => r.status === "Đã xử lý"));
      }
    } catch (error) {
      console.error("Error fetching user violations:", error);
    }
  };

  useEffect(() => {
    if (visible) fetchViolations();
  }, [visible]);

  const viewReportDetail = (report) => {
    setSelectedReport(report);
    setIsModalVisible(true);
  };

  const approveReport = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/violations/update-status`,
        {
          reportId: selectedReport.violation_id,
          updated_by_id: "admin_id",
        }
      );
      if (response.data.success) {
        notification.success({ message: "Duyệt báo cáo thành công!" });
        setIsModalVisible(false);
        setSelectedReport(null);
        fetchViolations();
        refreshUsers();
      }
    } catch (error) {
      console.error("Error approving report:", error);
      notification.error({ message: "Lỗi khi duyệt báo cáo!" });
    }
  };

  const columns = [
    { title: "Loại vi phạm", dataIndex: "violation_type", key: "violation_type" },
    { title: "Người gửi", dataIndex: "sender_id", key: "sender_id" },
    {
      title: "Ngày báo cáo",
      dataIndex: "date_reported",
      key: "date_reported",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm:ss"), 
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            onClick={() => viewReportDetail(record)}
            style={{ marginRight: 8 }}
          >
            Xem chi tiết
          </Button>
          <Button type="primary">Liên hệ người gửi</Button>
        </>
      ),
    },
  ];

  return (
    <Modal
      title={`Danh sách vi phạm của ${user.full_name}`}
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab={`Chờ duyệt (${pendingReports.length})`} key="1">
          <Table
            columns={columns}
            dataSource={pendingReports}
            rowKey="violation_id"
          />
        </TabPane>
        <TabPane tab={`Đã duyệt (${resolvedReports.length})`} key="2">
          <Table
            columns={columns}
            dataSource={resolvedReports}
            rowKey="violation_id"
            pagination={{ pageSize: 5 }}
          />
        </TabPane>
      </Tabs>

      <ResolveViolationModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        report={selectedReport}
        onApprove={approveReport}
      />
    </Modal>
  );
};

export default ViolationList;
