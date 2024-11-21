import React, { useEffect, useState } from "react";
import { Table, message, Button, Input, DatePicker, Row, Col } from "antd";
import axios from "axios";
import { acceptRequest } from "../../../services/requestSupportService";
import { useDispatch, useSelector } from "react-redux";
import { useSupportMessage } from "../../../providers/SupportMessagesProvider";
import { set } from "lodash";
import { io } from "socket.io-client";
import dayjs from "dayjs";
import {
  isNewRequest,
  setAcceptRequest,
  setSupportMessageState,
} from "../../../redux/supportMessageSlice";
const { Search } = Input;
const RequestSupport = () => {
  const [supportRequests, setSupportRequests] = useState([]);
  const supportMessageState = useSelector((state) => state.supportMessage);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const socketConnection = useSelector((state) => state.user.socketConnection);
  const dispatch = useDispatch();
  const fetchSupportRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/request-support/get-support-request`
      );
      if (response.data.success) {
        const sortedData = response.data.data.sort((a, b) => {
          // Ưu tiên trạng thái "processing"
          if (a.status === "Đang chờ xử lý" && b.status !== "Đang chờ xử lý")
            return -1;
          if (a.status !== "Đang chờ xử lý" && b.status === "Đang chờ xử lý")
            return 1;

          // Nếu trạng thái giống nhau, sắp xếp theo ngày tạo
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setSupportRequests(sortedData);
        setFilteredRequests(sortedData);
      } else {
        message.error("Lổi fetch yêu cầu hổ trợ");
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupportRequests();
  }, []);

  useEffect(() => {
    if (supportMessageState.isNewRequest || supportMessageState.isClosed) {
      fetchSupportRequests();
      dispatch(isNewRequest({ isNewRequest: false }));
    }
  }, [
    dispatch,
    supportMessageState.isNewRequest,
    supportMessageState.isClosed,
  ]);

  // useEffect(() => {
  //   if (socketConnection) {
  //     socketConnection.on("newSupportRequest", (data) => {
  //       fetchSupportRequests();
  //     });
  //   }
  //   // socket.on("supportRequestClosed", (data) => {
  //   //   console.log(data);
  //   //   fetchSupportRequests();
  //   // });
  // }, [ user, socketConnection]);

  const handleAcceptRequest = async (request_support_id, user_id) => {
    try {
      const res = await acceptRequest(request_support_id, user_id);
      if (res.success) {
        message.success("Đã xử lý yêu cầu hỗ trợ");
        localStorage.setItem("request_support_id", res.data.request_support_id);
        await fetchSupportRequests();
        const userId =
          user?.role_id === 1 || user?.role_id === 2
            ? res.supporter?.user_id
            : res.sender?.user_id;

        dispatch(
          setAcceptRequest({
            openSupportChatbox: true,
            selectedUserID: userId,
            requestSupport: res.data,
            supporter: res.supporter,
            sender: res.sender,
          })
        );
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  const handleStartDateChange = (date) => {
    setStartDate(date);
    filterRequests(searchTerm, date, endDate);
  };

  const handleEndDateChange = (date) => {
    setEndDate(dayjs(date).endOf("day"));
    filterRequests(searchTerm, startDate, dayjs(date).endOf("day"));
  };

  const filterRequests = (term, start, end) => {
    const lowerCaseTerm = term.toLowerCase();

    const filteredData = supportRequests.filter((request) => {
      const requestDate = dayjs(request.createdAt);

      const matchesDate =
        (!start ||
          requestDate.isAfter(dayjs(start).startOf("day"), "second")) &&
        (!end || requestDate.isBefore(dayjs(end).endOf("day"), "second")); // Sửa tại đây

      const matchesTerm =
        request.request_support_id.toString().includes(lowerCaseTerm) ||
        (request.UserAccount?.full_name?.toLowerCase() || "").includes(
          lowerCaseTerm
        );

      return matchesDate && matchesTerm;
    });

    setFilteredRequests(filteredData);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    filterRequests(value, startDate, endDate);
  };

  // Define table columns
  const columns = [
    {
      title: "ID",
      dataIndex: "request_support_id",
      key: "request_support_id",
    },
    {
      title: "Nguời yêu cầu",
      dataIndex: ["UserAccount", "full_name"],
      key: "UserAccount.full_name",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (text, record) => {
        const isActionDisabled = ["closed", "done", "processing"].includes(
          record.status.toLowerCase()
        );
        return (
          <Button
            type="primary"
            onClick={() =>
              handleAcceptRequest(record.request_support_id, user.user_id)
            }
            disabled={isActionDisabled || supportMessageState.selectedUserID}
          >
            Xử lý yêu cầu
          </Button>
        );
      },
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 20, fontSize: 20 }}>
        Danh sách yêu cầu hỗ trợ
      </h2>
      <div style={{ marginBottom: 20 }}>
        <Row gutter={[16, 16]} style={{ justifyContent: "flex-end" }}>
          <Col>
            <DatePicker
              onChange={handleStartDateChange}
              style={{ width: "200px" }}
              placeholder="Từ ngày"
            />
          </Col>
          <Col>
            <DatePicker
              onChange={handleEndDateChange}
              style={{ width: "200px" }}
              placeholder="Đến ngày"
            />
          </Col>
          <Col>
            <Search
              placeholder="Nhập id hoặc tên người dùng"
              onSearch={handleSearch}
              allowClear
              style={{ width: "400px" }}
            />
          </Col>
        </Row>
      </div>

      <Table
        dataSource={filteredRequests}
        columns={columns}
        rowKey="request_support_id"
        loading={loading}
        bordered
      />
    </div>
  );
};

export default RequestSupport;
