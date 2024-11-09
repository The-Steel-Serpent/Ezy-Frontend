import { Button, message, Modal, Radio } from "antd";
import React, { memo, useEffect, useReducer } from "react";
import { getReasons, sendRequest } from "../../services/orderService";
import TextArea from "antd/es/input/TextArea";
import { set } from "lodash";

const ModalSendRequest = (props) => {
  const {
    userOrderId,
    type,
    openModalSendRequest,
    onCloseModalSendRequest,
    onUpdateOrder,
  } = props;
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
        default:
          return state;
      }
    },
    {
      loading: false,
      reasons: [],
      selectedReason: null,
      note: "",
    }
  );
  const handleCloseModalSendRequest = () => {
    onCloseModalSendRequest();
    setLocalState({ type: "selectedReason", payload: null });
    setLocalState({ type: "note", payload: "" });
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
    const payload = {
      user_order_id: userOrderId,
      return_type_id: type === "cancel-request" ? 1 : 2,
      return_reason_id: localState.selectedReason,
      note: localState.note,
      status: 1,
    };
    try {
      const res = await sendRequest(payload);
      if (res.success) {
        message.success("Gửi yêu cầu thành công");
        handleCloseModalSendRequest();
        onUpdateOrder();
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
        <div className="w-full flex justify-end gap-3 items-center">
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
      <div className="w-full flex flex-col gap-3">
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
            className="text-base"
            placeholder="Nếu có, vui lòng ghi rõ lý do cụ thể"
          />
        </div>
      </div>
    </Modal>
  );
};

export default memo(ModalSendRequest);
