import React, { useEffect, useState } from "react";
import { Table, message, Button } from "antd";
import axios from "axios";
import { acceptRequest } from "../../../services/requestSupportService";
import { useDispatch, useSelector } from "react-redux";
import { useSupportMessage } from "../../../providers/SupportMessagesProvider";
import { set } from "lodash";
import { io } from "socket.io-client";
import {
  isNewRequest,
  setAcceptRequest,
  setSupportMessageState,
} from "../../../redux/supportMessageSlice";

const RequestSupport = () => {
  const [supportRequests, setSupportRequests] = useState([]);
  const supportMessageState = useSelector((state) => state.supportMessage);
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
        setSupportRequests(response.data.data);
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
      render: (text, record) => (
        <Button
          type="primary"
          onClick={() =>
            handleAcceptRequest(record.request_support_id, user.user_id)
          }
          disabled={supportMessageState.selectedUserID}
        >
          Xử lý yêu cầu
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 20, fontSize: 20 }}>
        Danh sách yêu cầu hổ trợ
      </h2>
      <Table
        dataSource={supportRequests}
        columns={columns}
        rowKey="request_support_id"
        loading={loading}
        bordered
      />
    </div>
  );
};

export default RequestSupport;
