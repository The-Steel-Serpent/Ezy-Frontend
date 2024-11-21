import React, { useEffect, useState } from "react";
import { Table, Button } from "antd";
import axios from "axios";
import ShopViolationList from "./ShopViolationList";
import ViolationHistoryModal from "../user/ViolationHistoryModal";

const ShopViolation = () => {
  const [shopsWithViolations, setShopsWithViolations] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [isListModalVisible, setIsListModalVisible] = useState(false);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);

  const fetchShopsWithViolations = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/violations/get-shops-with-violations`
      );
      if (response.data.success) {
        setShopsWithViolations(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching shops with violations:", error);
    }
  };

  useEffect(() => {
    fetchShopsWithViolations();
  }, []);

  const columns = [
    { title: "Tên cửa hàng", dataIndex: "shop_name", key: "shop_name" },
    { title: "Chủ sở hữu", dataIndex: "owner_name", key: "owner_name" },
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
              setSelectedShop(record);
              setIsListModalVisible(true);
            }}
          >
            Xem báo cáo
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setSelectedShop(record);
              setIsHistoryModalVisible(true);
            }}
          >
            Lịch sử xử lý vi phạm
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Danh sách cửa hàng bị báo cáo</h2>
      <Table
        columns={columns}
        dataSource={shopsWithViolations}
        rowKey="shop_id"
        pagination={{ pageSize: 10 }}
      />
      {isListModalVisible && selectedShop && (
        <ShopViolationList
          user={selectedShop} 
          visible={isListModalVisible}
          onClose={() => setIsListModalVisible(false)}
          refreshUsers={fetchShopsWithViolations}
        />
      )}
      {isHistoryModalVisible && selectedShop && (
        <ViolationHistoryModal
          userId={selectedShop.owner_id}
          visible={isHistoryModalVisible}
          onClose={() => setIsHistoryModalVisible(false)}
        />
      )}
    </div>
  );
};

export default ShopViolation;
