import React, { useEffect, useState } from "react";
import { Table, Tabs, Button, Typography, Spin, message, Input } from "antd";
import ShopViolationList from "./ShopViolationList";
import ShopViolationHistoryModal from "./ShopViolationHistoryModal";
import ShopWarningModal from "./ShopWarningModal";

const { TabPane } = Tabs;
const { Title } = Typography;
const { Search } = Input;

const ShopViolation = () => {
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]); // Dữ liệu sau khi lọc
  const [loading, setLoading] = useState(false);
  const [selectedShopForViolations, setSelectedShopForViolations] = useState(null);
  const [selectedShopForHistory, setSelectedShopForHistory] = useState(null);
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
          setFilteredShops(data.data); // Khởi tạo dữ liệu lọc
        } else {
          console.error("Failed to fetch shop violations.");
        }
      })
      .catch(() => console.error("Error fetching shops with violations."))
      .finally(() => setLoading(false));
  }, []);

  // Xử lý tìm kiếm
  const handleSearch = (value) => {
    const keyword = value.toLowerCase();
    const filtered = shops.filter(
      (shop) =>
        shop.shop_id.toString().toLowerCase().includes(keyword) ||
        shop.shop_name.toLowerCase().includes(keyword) ||
        shop.full_name.toLowerCase().includes(keyword) ||
        shop.email.toLowerCase().includes(keyword)
    );
    setFilteredShops(filtered);
  };

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
          <Button onClick={() => {
            console.log("Selected Shop:", record);
            setSelectedShopForHistory(record);
            setHistoryModalVisible(true);
          }}>
            Lịch sử vi phạm
          </Button>
          {!record.is_banned && (
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
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Title level={3} style={{ textAlign: "center", marginBottom: "20px" }}>
        Danh sách cửa hàng vi phạm
      </Title>
      <Search
        placeholder="Tìm kiếm theo Mã, Tên cửa hàng, Chủ cửa hàng, hoặc Email"
        onSearch={handleSearch}
        enterButton
        style={{ marginBottom: "20px" }}
      />
      <Tabs defaultActiveKey="active">
        <TabPane tab="Cửa hàng đang hoạt động" key="active">
          {loading ? (
            <Spin tip="Đang tải dữ liệu..." style={{ width: "100%", marginTop: "20px" }} />
          ) : (
            <Table
              columns={columns}
              dataSource={filteredShops.filter((shop) => shop.is_banned === 0)} // Lọc cửa hàng đang hoạt động
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
              dataSource={filteredShops.filter((shop) => shop.is_banned === 1)} // Lọc cửa hàng đã khóa
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
          ownerId={selectedShopForHistory?.user_id}
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
