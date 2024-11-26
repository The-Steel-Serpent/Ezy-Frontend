import React, { useEffect, useState } from "react";
import { Table, Tabs, Button, Typography, Spin, message } from "antd";
import ShopViolationList from "./ShopViolationList";
import ShopViolationHistoryModal from "./ShopViolationHistoryModal";
import ShopWarningModal from "./ShopWarningModal";

const { TabPane } = Tabs;
const { Title } = Typography;

const ShopViolation = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedShopForViolations, setSelectedShopForViolations] = useState(null);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [warningModalVisible, setWarningModalVisible] = useState(false);
  const [warningShop, setWarningShop] = useState(null);

  // Fetch shops with violations
  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/violations/get-shops-with-violations`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setShops(data.data);
        } else {
          console.error("Failed to fetch shop violations.");
        }
      })
      .catch(() => console.error("Error fetching shops with violations."))
      .finally(() => setLoading(false));
  }, []);

  // Filter shops based on is_banned
  const activeShops = shops.filter((shop) => shop.is_banned === 0);
  const lockedShops = shops.filter((shop) => shop.is_banned === 1);

  const columns = [
    {
      title: "Mã cửa hàng",
      dataIndex: "shop_id",
      key: "shop_id",
      align: "center",
    },
    {
      title: "Tên cửa hàng",
      dataIndex: "shop_name",
      key: "shop_name",
    },
    {
      title: "Chủ cửa hàng",
      dataIndex: "full_name",
      key: "full_name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Chờ xử lý",
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
          <Button onClick={() => setSelectedShopForViolations(record)}>Xem báo cáo</Button>
          <Button onClick={() => setHistoryModalVisible(true)}>Lịch sử vi phạm</Button>
          <Button
            type="primary"
            onClick={() => {
              if (record) {
                setWarningShop(record);
                setWarningModalVisible(true);
              } else {
                console.error("Record is null or undefined");
                message.error("Không thể mở modal. Dữ liệu cửa hàng không hợp lệ.");
              }
            }}
          >
            Cảnh báo vi phạm
          </Button>


        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Title level={3} style={{ textAlign: "center", marginBottom: "20px" }}>
        Danh sách cửa hàng vi phạm
      </Title>
      <Tabs defaultActiveKey="active">
        <TabPane tab="Cửa hàng đang hoạt động" key="active">
          {loading ? (
            <Spin tip="Đang tải dữ liệu..." style={{ width: "100%", marginTop: "20px" }} />
          ) : (
            <Table
              columns={columns}
              dataSource={activeShops}
              rowKey="user_id"
              pagination={{ pageSize: 10 }}
              bordered
            />
          )}
        </TabPane>
        <TabPane tab="Cửa hàng đã khóa" key="locked">
          {loading ? (
            <Spin tip="Đang tải dữ liệu..." style={{ width: "100%", marginTop: "20px" }} />
          ) : (
            <Table
              columns={columns}
              dataSource={lockedShops}
              rowKey="user_id"
              pagination={{ pageSize: 10 }}
              bordered
            />
          )}
        </TabPane>
      </Tabs>

      {/* Modals */}
      {selectedShopForViolations && (
        <ShopViolationList
          shop={selectedShopForViolations}
          onClose={() => setSelectedShopForViolations(null)}
        />
      )}
      {historyModalVisible && (
        <ShopViolationHistoryModal
          visible={historyModalVisible}
          onClose={() => setHistoryModalVisible(false)}
          shop={selectedShopForViolations}
        />
      )}
      {warningModalVisible && warningShop && (
        <ShopWarningModal
          visible={warningModalVisible}
          onClose={() => {
            setWarningModalVisible(false);
            setWarningShop(null); // Đặt lại giá trị sau khi đóng modal
          }}
          shop={warningShop}
        />
      )}
    </div>
  );
};

export default ShopViolation;
