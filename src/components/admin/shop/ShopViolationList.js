import React, { useState, useEffect } from "react";
import { Modal, Table, Tabs, Button, message, Spin, Typography } from "antd";
import dayjs from "dayjs";
import ShopViolationDetail from "./ShopViolationDetail";

const { TabPane } = Tabs;
const { Title } = Typography;

const ShopViolationList = ({ shop, onClose }) => {
  const [violations, setViolations] = useState([]);
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [activeTab, setActiveTab] = useState("Chờ xử lý");
  const [loading, setLoading] = useState(false);

  // Fetch violations for the selected shop
  const fetchViolations = () => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/violations/user/${shop.user_id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setViolations(data.data);
        } else {
          message.error("Không thể tải danh sách vi phạm.");
        }
      })
      .catch(() => message.error("Đã xảy ra lỗi khi tải danh sách vi phạm."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchViolations();
  }, [activeTab]);

  const renderViolations = (status) => {
    if (status === "Chờ xử lý") {
      return violations.filter((v) => v.status === "Chưa xử lý");
    }
    if (status === "Đã xem") {
      return violations.filter((v) => v.status === "Đã xem");
    }
    return [];
  };
  const handleMarkAsViewed = async (violationId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/violations/mark-as-viewed`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId: violationId }),
      });

      const result = await response.json();

      if (result.success) {
        // Cập nhật danh sách sau khi đánh dấu là đã xem
        fetchViolations();
      } else {
        message.error(result.message || "Cập nhật trạng thái thất bại.");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi cập nhật trạng thái.");
    }
  };
  const handleViewDetail = (record) => {
    // Cập nhật trạng thái vi phạm thành "Đã xem"
    handleMarkAsViewed(record.violation_id);
    // Hiển thị chi tiết
    setSelectedViolation(record);
  };

  // Table columns configuration
  const columns = [
    {
      title: "Mã vi phạm",
      dataIndex: "violation_id",
      key: "violation_id",
      align: "center",
    },
    {
      title: "Loại vi phạm",
      dataIndex: "violation_type",
      key: "violation_type",
      align: "left",
    },
    {
      title: "Ngày báo cáo",
      dataIndex: "date_reported",
      key: "date_reported",
      align: "center",
      render: (text) =>
        text ? dayjs(text).format("DD/MM/YYYY HH:mm:ss") : "N/A",
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => handleViewDetail(record)}
          style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <Modal
      visible
      onCancel={onClose}
      title={
        <Title level={4} style={{ textAlign: "center", margin: 0 }}>
          Danh sách vi phạm - Cửa hàng: {shop.shop_name}
        </Title>
      }
      footer={null}
      centered
      width={800}
      bodyStyle={{ padding: "20px" }}
    >
      <Spin spinning={loading}>
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
          centered
          tabBarStyle={{ fontWeight: "bold" }}
        >
          <TabPane tab="Chờ xem" key="Chờ xử lý">
            <Table
              dataSource={renderViolations("Chờ xử lý")}
              columns={columns}
              rowKey="violation_id"
              pagination={{ pageSize: 5 }}
              bordered
              style={{ marginTop: "16px" }}
            />
          </TabPane>
          <TabPane tab="Đã xem" key="Đã xem">
            <Table
              dataSource={renderViolations("Đã xem")}
              columns={columns}
              rowKey="violation_id"
              pagination={{ pageSize: 5 }}
              bordered
              style={{ marginTop: "16px" }}
            />
          </TabPane>
        </Tabs>
      </Spin>
      {selectedViolation && (
        <ShopViolationDetail
          violation={selectedViolation}
          isViewedTab={activeTab === "Đã xem"}
          onClose={() => setSelectedViolation(null)}
        />
      )}
    </Modal>
  );
};

export default ShopViolationList;
