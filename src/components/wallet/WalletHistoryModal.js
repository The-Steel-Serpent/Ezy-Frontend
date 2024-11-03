import { FilterFilled, SearchOutlined, WalletFilled } from "@ant-design/icons";
import { Button, DatePicker, Empty, Input, List, Modal, Spin } from "antd";
import React, { memo, useEffect, useReducer } from "react";
import VirtualList from "rc-virtual-list";
import { getWalletHistory } from "../../services/walletService";
import WalletHistoryItem from "./WalletHistoryItem";
import moment from "moment"; // Import moment if not already done

const { RangePicker } = DatePicker;
const WalletHistoryModal = (props) => {
  const {
    walletId,
    openWalletHistoryModal = true,
    handleCloseHistoryWalletModal,
  } = props;
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "SET_WALLET_HISTORY": {
          const updatedHistory = { ...state.walletHistory };

          for (const [month, transactions] of Object.entries(action.payload)) {
            if (!updatedHistory[month]) {
              updatedHistory[month] = [];
            }
            updatedHistory[month] = [...updatedHistory[month], ...transactions];
          }
          return {
            ...state,
            walletHistory: updatedHistory,
          };
        }
        case "SET_SINGLE_TRANSACTION": {
          return {
            ...state,
            walletHistory: action.payload,
          };
        }
        case "RESET_WALLET_HISTORY": {
          return {
            ...state,
            walletHistory: {}, // Reset to an empty object or initial state
          };
        }
        case "SET_PAGE": {
          return {
            ...state,
            page: action.payload,
          };
        }
        case "SET_LIMIT": {
          return {
            ...state,
            limit: action.payload,
          };
        }
        case "SET_TOTAL_PAGES": {
          return {
            ...state,
            totalPages: action.payload,
          };
        }
        case "SET_CURRENT_PAGE": {
          return {
            ...state,
            currentPage: action.payload,
          };
        }
        case "SET_FILTER": {
          return { ...state, filter: { ...state.filter, ...action.payload } };
        }
        default:
          return state;
      }
    },
    {
      loading: false,
      walletHistory: [],
      page: 1,
      limit: 10,
      totalPages: 1,
      currentPage: 0,
      filter: {
        wallet_transaction_id: "",
        startDate: null,
        endDate: null,
        isFiltering: false,
      },
    }
  );
  const { loading, walletHistory, page, limit, totalPages, filter } =
    localState;
  const fetchWalletHistory = async () => {
    try {
      setLocalState({ type: "SET_LOADING", payload: true });
      const { wallet_transaction_id, startDate, endDate } = filter;
      const res = await getWalletHistory(
        walletId,
        new Date().getFullYear(),
        page,
        limit,
        wallet_transaction_id,
        startDate,
        endDate
      );

      if (res.success) {
        if (wallet_transaction_id !== "") {
          setLocalState({
            type: "SET_SINGLE_TRANSACTION",
            payload: res.walletHistory,
          });
        } else {
          setLocalState({
            type: "SET_WALLET_HISTORY",
            payload: res.walletHistory,
          });
          setLocalState({
            type: "SET_TOTAL_PAGES",
            payload: res.totalPages,
          });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLocalState({ type: "SET_LOADING", payload: false });
    }
  };
  useEffect(() => {
    if (openWalletHistoryModal && walletId && page) {
      fetchWalletHistory();
    }
  }, [walletId, page, openWalletHistoryModal, filter.isFiltering]);
  const onScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight + 1) {
      if (page < totalPages) {
        setLocalState({
          type: "SET_PAGE",
          payload: page + 1,
        });
      }
    }
  };
  const combinedHistory = Object.entries(walletHistory).flatMap(
    ([month, transactions]) => [
      { month, isMonth: true, height: 28 },
      ...transactions.map((transaction, index) => ({
        ...transaction,
        month,
        height: 84,
        key: `${transaction.wallet_transaction_id}-${month}-${index}`,
      })),
    ]
  );
  const handleFilterChange = (type, value) => {
    setLocalState({
      type: "SET_FILTER",
      payload: { [type]: value },
    });
  };
  const handleSubmitFilter = async () => {
    if (filter.isFiltering) {
      setLocalState({
        type: "SET_FILTER",
        payload: {
          isFiltering: false,
          wallet_transaction_id: "",
          startDate: null,
          endDate: null,
        },
      });
    } else {
      setLocalState({
        type: "SET_FILTER",
        payload: {
          isFiltering: true,
        },
      });
    }
    setLocalState({ type: "RESET_WALLET_HISTORY" });
    setLocalState({ type: "SET_PAGE", payload: 1 });
  };
  const handleCloseModal = () => {
    setLocalState({
      type: "RESET_WALLET_HISTORY",
    });
    setLocalState({
      type: "SET_PAGE",
      payload: 1,
    });
    setLocalState({
      type: "SET_FILTER",
      payload: {
        isFiltering: false,
        wallet_transaction_id: "",
        startDate: null,
        endDate: null,
      },
    });
    handleCloseHistoryWalletModal();
  };
  return (
    <Modal
      open={openWalletHistoryModal}
      title={<span className="text-xl">Lịch sử giao dịch</span>}
      onCancel={handleCloseModal}
      onClose={handleCloseModal}
      footer={
        <Button
          size="large"
          className="bg-primary text-white hover:opacity-80"
          onClick={handleCloseModal}
        >
          Đóng
        </Button>
      }
    >
      <div className="py-2">
        <div className="flex flex-col gap-3">
          <Input
            size="large"
            disabled={filter.isFiltering}
            prefix={<SearchOutlined />}
            placeholder="Nhập vào mã giao dịch"
            value={filter.wallet_transaction_id}
            onChange={(e) =>
              handleFilterChange("wallet_transaction_id", e.target.value)
            }
          />
          <div className="flex w-full items-center gap-2">
            <RangePicker
              disabled={filter.isFiltering}
              className="flex-1"
              size="large"
              placeholder={["Từ Ngày", "Đến Ngày"]}
              allowEmpty={[true, true]}
              value={[
                filter.startDate
                  ? moment(filter.startDate, "YYYY-MM-DD")
                  : null,
                filter.endDate ? moment(filter.endDate, "YYYY-MM-DD") : null,
              ]}
              onChange={(dates) => {
                if (dates) {
                  const startDate = dates[0]
                    ? dates[0].format("YYYY-MM-DD")
                    : null;
                  const endDate = dates[1]
                    ? dates[1].format("YYYY-MM-DD")
                    : null;

                  handleFilterChange("startDate", startDate);
                  handleFilterChange("endDate", endDate);
                } else {
                  // Handle case where dates is null (if needed)
                  handleFilterChange("startDate", null);
                  handleFilterChange("endDate", null);
                }
              }}
            />
            <Button size="large" onClick={handleSubmitFilter}>
              <span className="flex gap-2">
                {filter.isFiltering ? (
                  <>
                    <FilterFilled />
                    Hủy
                  </>
                ) : (
                  <>
                    <FilterFilled />
                    Lọc
                  </>
                )}
              </span>
            </Button>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center mt-4">
            <Spin size="large" />
          </div>
        ) : (
          <>
            {walletHistory.length === 0 ? (
              <Empty className="mt-4" description="Không có giao dịch" />
            ) : (
              <List className="mt-2">
                <VirtualList
                  data={combinedHistory}
                  height={400}
                  itemHeight={(item) => item.height}
                  itemKey="key"
                  onScroll={onScroll}
                >
                  {(item) => (
                    <>
                      {item.isMonth ? (
                        <h2 className="text-lg font-semibold mt-4">
                          {item.month}
                        </h2>
                      ) : (
                        <WalletHistoryItem item={item} />
                      )}
                    </>
                  )}
                </VirtualList>
              </List>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default memo(WalletHistoryModal);
