import { Button, message, Modal, Radio } from "antd";
import React, { memo, useEffect, useReducer } from "react";
import {
  cancelOrder,
  getReasons,
  sendRequest,
} from "../../services/orderService";
import TextArea from "antd/es/input/TextArea";
import { set } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotificationsData } from "../../redux/notificationsSlice";

const ModalSendRequest = (props) => {
  const {
    order,
    type,
    openModalSendRequest,
    onCloseModalSendRequest,
    onUpdateOrder,
  } = props;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  //user_order_id, reason_type_id, return_reason_id, note, status
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "setLoading":
          return { ...state, loading: action.payload };
        case "reasons":
          return { ...state, reasons: action.payload };
        case "selectedReason":
          return { ...state, selectedReason: action.payload };
        case "note":
          return { ...state, note: action.payload };
        case "error":
          return { ...state, error: action.payload };
        default:
          return state;
      }
    },
    {
      loading: false,
      reasons: [],
      selectedReason: null,
      note: "",
      error: {
        selectedReason: "",
        note: "",
      },
    }
  );
  const handleCloseModalSendRequest = () => {
    onCloseModalSendRequest();
    setLocalState({ type: "selectedReason", payload: null });
    setLocalState({ type: "note", payload: "" });
    setLocalState({ type: "error", payload: { selectedReason: "", note: "" } });
  };

  const handleOnNoteChange = (e) => {
    const value = e.target.value;
    setLocalState({ type: "note", payload: value });
  };

  const handleOnReasonChange = (e) => {
    const value = e.target.value;
    setLocalState({ type: "selectedReason", payload: value });
  };

  useEffect(() => {
    const fetchReasons = async () => {
      setLocalState({ type: "setLoading", payload: true });
      try {
        const res = await getReasons(type);
        if (res.success) {
          setLocalState({ type: "reasons", payload: res.reasons });
        }
      } catch (error) {
        console.log("Error when fetchReasons", error);
      } finally {
        setLocalState({ type: "setLoading", payload: false });
      }
    };
    if (openModalSendRequest) {
      fetchReasons();
    }
  }, [openModalSendRequest]);

  const handleSendRequest = async () => {
    let localErrors = {
      selectedReason: "",
      note: "",
    };
    if (!localState.selectedReason) {
      localErrors.selectedReason = "Vui lòng chọn lý do";
    }
    if (localState.note.length > 0 && localState.note.length < 30) {
      localErrors.note = "Ghi chú tối thiểu 30 ký tự";
    } else if (localState.note.length > 120) {
      localErrors.note = "Ghi chú không được quá 120 ký tự";
    }

    const hasErrors = Object.values(localErrors).some((error) => error !== "");
    if (hasErrors) {
      setLocalState({ type: "error", payload: localErrors });
      return;
    }
    const payload = {
      user_order_id: order.user_order_id,
      return_type_id: type === "cancel-request" ? 1 : 2,
      return_reason_id: localState.selectedReason,
      note: localState.note,
      ghn_status: order.ghn_status,
    };
    console.log("payload", payload);
    try {
      const res = await sendRequest(payload);
      if (res.success) {
        message.success("Gửi yêu cầu thành công");
        handleCloseModalSendRequest();
        onUpdateOrder();
        dispatch(
          fetchNotificationsData({ userID: user?.user_id, page: 1, limit: 5 })
        );
      }
    } catch (error) {
      console.log("Error when handleSendRequest", error);
      message.error("Có lỗi xảy ra, vui lòng thử lại sau");
    }
  };
  return (
    <Modal
      width={800}
      closable={false}
      title={
        <span className="text-xl font-semibold capitalize">
          Yêu cầu {type === "cancel-request" ? "Hủy Đơn" : "Trả Hàng/Hoàn Tiền"}
        </span>
      }
      onCancel={handleCloseModalSendRequest}
      onClose={handleCloseModalSendRequest}
      open={openModalSendRequest}
      footer={
        <div className="w-full flex justify-end gap-3 items-center mt-3">
          <Button
            size="large"
            className="text-secondary border-secondary hover:text-white hover:bg-secondary"
            onClick={handleCloseModalSendRequest}
          >
            Trở Lại
          </Button>
          <Button
            size="large"
            className="text-white bg-primary border-primary hover:opacity-80"
            onClick={handleSendRequest}
          >
            Gửi Yêu Cầu
          </Button>
        </div>
      }
    >
      <div className="w-full flex flex-col gap-3 pb-3">
        <div className="flex flex-col gap-2">
          <span className="text-lg font-semibold text-neutral-500">
            Lý do:{" "}
          </span>
          <Radio.Group
            className="flex flex-col justify-start items-start"
            onChange={handleOnReasonChange}
            value={localState.selectedReason}
          >
            {localState.reasons.map((reason) => (
              <Radio value={reason.return_reason_id}>
                {reason.return_reason_name}
              </Radio>
            ))}
          </Radio.Group>
          <span className="text-red-500">
            {localState.error.selectedReason}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-lg font-semibold text-neutral-500">
            Ghi chú:{" "}
          </span>
          <TextArea
            autoSize={{
              minRows: 8,
              maxRows: 12,
            }}
            value={localState.note}
            onChange={handleOnNoteChange}
            count={{
              show: true,
              max: 120,
            }}
            className="text-base"
            placeholder="Nếu có, vui lòng ghi rõ lý do cụ thể"
          />
          <span className="text-red-500">{localState.error.note}</span>
        </div>
      </div>
    </Modal>
  );
};

export default memo(ModalSendRequest);
