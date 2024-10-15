import { Modal } from "antd";
import React, { memo, useReducer } from "react";
import { useSelector } from "react-redux";
import ModalOTP from "./ModalOTP";

const ChangeEmail = () => {
  const user = useSelector((state) => state.user);
  console.log(user);
  const [state, setState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "isVerify":
          return { ...state, isVerify: action.payload };
        default:
          return state;
      }
    },
    {
      isVerify: false,
    }
  );

  const onVerify = () => {
    setState({ type: "isVerify", payload: true });
  };

  return (
    <>
      <div></div>
      <ModalOTP user={user} onVerify={onVerify} />
    </>
  );
};

export default memo(ChangeEmail);
