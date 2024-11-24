import React, { useState, useEffect } from "react";
import { Modal, Table, Tabs, Button, message, Spin, Typography } from "antd";
import dayjs from "dayjs";
import ShopViolationDetail from "./ShopViolationDetail";

const { TabPane } = Tabs;
const { Title } = Typography;

const ShopViolationList = ({ shop, onClose }) => {
  const [violations, setViolations] = useState([]);
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [activeTab, setActiveTab] = useState("unviewed");
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
  }, [shop]);

  // Filter violations by status
  const renderViolations = (status) =>
    violations.filter((v) => v.status === status);

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
          onClick={() => setSelectedViolation(record)}
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
          onChange={setActiveTab}
          centered
          tabBarStyle={{ fontWeight: "bold" }}
        >
          <TabPane tab="Chờ xem" key="unviewed">
            <Table
              dataSource={renderViolations("Chờ xem")}
              columns={columns}
              rowKey="violation_id"
              pagination={{ pageSize: 5 }}
              bordered
              style={{ marginTop: "16px" }}
            />
          </TabPane>
          <TabPane tab="Đã xem" key="viewed">
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
          isViewedTab={activeTab === "viewed"}
          onClose={() => setSelectedViolation(null)}
        />
      )}
    </Modal>
  );
};

export default ShopViolationList;
