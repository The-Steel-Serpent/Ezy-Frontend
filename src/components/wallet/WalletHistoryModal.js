import { SearchOutlined, WalletFilled } from "@ant-design/icons";
import { Button, Input, List, Modal } from "antd";
import React, { memo } from "react";
import VirtualList from "rc-virtual-list";

const WalletHistoryModal = (props) => {
  const { walletHistory, openWalletHistoryModal = true } = props;
  const formatCurrency = (balance) => {
    return new Intl.NumberFormat("vi-VN").format(balance);
  };
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const groupTransactionsByMonth = (transactions) => {
    return transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.transaction_date);
      const month = date.getMonth() + 1; // Months are zero-indexed
      const year = date.getFullYear();
      const monthYear = `${month}/${year}`;

      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }

      acc[monthYear].push(transaction);
      return acc;
    }, {});
  };
  const groupedTransactions = groupTransactionsByMonth(walletHistory);
  return (
    <Modal
      open={openWalletHistoryModal}
      title={<span className="text-xl">Lịch sử giao dịch</span>}
      footer={
        <Button size="large" className="bg-primary text-white hover:opacity-80">
          Đóng
        </Button>
      }
    >
      <div className="py-2">
        <Input
          size="large"
          prefix={<SearchOutlined />}
          placeholder="Nhập vào mã giao dịch"
        />
        <List>
          {Object.keys(groupedTransactions).map((monthYear) => (
            <div key={monthYear}>
              <h2 className="text-lg font-semibold mt-4">{monthYear}</h2>
              <VirtualList
                data={groupedTransactions[monthYear]}
                height={400}
                itemHeight={47}
                itemKey="id"
              >
                {(item) => (
                  <div className="grid grid-cols-12 pt-3">
                    <div className="col-span-2 flex justify-start items-center ">
                      <div className="size-14 rounded-full bg-primary flex justify-center items-center">
                        <WalletFilled className="text-white text-2xl" />
                      </div>
                    </div>
                    <div className="col-span-7 px-2 flex flex-col justify-start items-start">
                      <span className="font-semibold text-xl">
                        {item?.transaction_type}
                      </span>
                      <span className="text-base">{item?.description}</span>
                      <span className="text-sm text-gray-500">
                        {formatDateTime(item?.transaction_date)}
                      </span>
                    </div>
                    <div className="col-span-3 flex justify-end items-center">
                      <span
                        className={`text-lg font-semibold ${
                          item?.amount?.toString().includes("-")
                            ? "text-red-500"
                            : ""
                        }`}
                      >
                        {formatCurrency(item?.amount || 0)}
                        <sup>đ</sup>
                      </span>
                    </div>
                  </div>
                )}
              </VirtualList>
            </div>
          ))}
        </List>
      </div>
    </Modal>
  );
};

export default memo(WalletHistoryModal);
