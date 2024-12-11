import { Alert, Button, Input, message, Modal } from "antd";
import React, { useReducer, useState } from "react";
import { checkEmailFormat } from "../../helpers/formatEmail";
import { checkEmailExists } from "../../services/userService";
const { resetPassword } = require("../../firebase/AuthenticationFirebase");
const ModalForgotPassword = (props) => {
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "emailReset":
          return { ...state, emailReset: action.value };
        case "error":
          return { ...state, error: action.value };
        case "warning":
          return { ...state, warning: action.value };
        default:
          return state;
      }
    },
    {
      emailReset: "",
      error: null,
      warning: null,
    }
  );

  const { emailReset, error, warning } = state;
  const { isVisbleResetModal = false, onClosed } = props;
  const handleEmailResetChange = (e) => {
    const emailReset = e.target.value;
    dispatch({ type: "emailReset", value: emailReset });
    if (!emailReset) {
      dispatch({ type: "error", value: "Email không được để trống" });
    } else {
      dispatch({ type: "error", value: null });
    }
  };

  const onSubmitReset = async (e) => {
    e.preventDefault();
    if (!emailReset) {
      dispatch({ type: "error", value: "Email không được để trống" });
      return;
    } else if (!checkEmailFormat(emailReset)) {
      dispatch({ type: "error", value: "Email không hợp lệ" });
      return;
    }
    try {
      const checkEmail = await checkEmailExists(emailReset);
      if (!checkEmail) {
        message.error("Email không tồn tại");
        return;
      }
      await resetPassword(emailReset);
      dispatch({ type: "error", value: null });
      dispatch({
        type: "warning",
        value: "Vui lòng kiểm tra email để đặt lại mật khẩu",
      });
      message.success("Vui lòng kiểm tra email để đặt lại mật khẩu");
      onCancelModal(false);
    } catch (error) {
      dispatch({ type: "error", value: error.message });
    }
  };
  const onCancelModal = () => {
    onClosed();
    dispatch({ type: "emailReset", value: "" });
    dispatch({ type: "error", value: null });
    dispatch({ type: "warning", value: null });
  };
  return (
    <Modal
      open={isVisbleResetModal}
      footer={null}
      onCancel={onCancelModal}
      centered
    >
      <h3 className="flex justify-center text-[25px]">Đặt lại mật khẩu</h3>
      <div className="flex flex-col gap-4 px-8 mb-3 mt-5">
        <div className="h-[70px]">
          <Input
            placeholder="Nhập email của bạn"
            className="w-full border p-3 mb-1"
            value={emailReset}
            onChange={handleEmailResetChange}
          />
          <span className="text-red-800">{error}</span>
          <span className="text-green-600">{warning}</span>
        </div>

        <Button
          onClick={onSubmitReset}
          className="bg-primary text-white w-full h-12"
        >
          Tiếp theo
        </Button>
      </div>
    </Modal>
  );
};

export default ModalForgotPassword;
