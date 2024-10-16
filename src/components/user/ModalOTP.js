import { Button, Flex, Input, message, Modal } from "antd";

import React, { memo, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { registerOTP, verifyOTP } from "../../services/userService";
import { setUser } from "../../redux/userSlice";
import { useDispatch } from "react-redux";

const ModalOTP = ({ user, onVerify }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [state, setState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "setOpenModal":
          return { ...state, openModal: action.payload };
        case "setLoading":
          return { ...state, loading: action.payload };
        case "CHANGE_OTP":
          return { ...state, otp: action.payload };
        case "CHANGE_STEP":
          return { ...state, step: action.payload };
        case "SET_ERROR":
          return { ...state, error: action.payload };
        default:
          return state;
      }
    },
    {
      openModal: true,
      loading: false,
      error: {
        newOTP: "",
        confirmOTP: "",
      },
      otp: {
        newOTP: "",
        confirmOTP: "",
      },
      step: 1,
    }
  );
  const onConfirmOTPChange = (text) => {
    setState({
      type: "CHANGE_OTP",
      payload: {
        ...state.otp,
        confirmOTP: text,
      },
    });
  };
  const onNewOTPChange = (text) => {
    setState({
      type: "CHANGE_OTP",
      payload: {
        ...state.otp,
        newOTP: text,
      },
    });
  };
  const { otp, step, error, openModal, loading } = state;
  const handleNextStep = () => {
    if (otp.newOTP.length !== 8) {
      setState({
        type: "SET_ERROR",
        payload: {
          ...error,
          newOTP: "Mã OTP phải có 8 ký tự",
        },
      });
      return;
    }
    setState({ type: "CHANGE_STEP", payload: 2 });
  };
  useEffect(() => {
    if (otp.newOTP.length === 8) {
      setState({
        type: "SET_ERROR",
        payload: {
          ...error,
          newOTP: "",
        },
      });
    }

    if (otp.newOTP === otp.confirmOTP) {
      setState({
        type: "SET_ERROR",
        payload: {
          ...error,
          confirmOTP: "",
        },
      });
    }
  }, [otp.newOTP, otp.confirmOTP]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleBackToStep1 = () => {
    setState({ type: "CHANGE_STEP", payload: 1 });
  };

  useEffect(() => {
    console.log("error: ", error);
  }, [error]);

  const handleRegisterOTP = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setState({ type: "setLoading", payload: true });
    if (otp.newOTP !== otp.confirmOTP) {
      setState({
        type: "SET_ERROR",
        payload: {
          ...error,
          confirmOTP: "Mã OTP không khớp",
        },
      });
      setState({ type: "setLoading", payload: false });
      return;
    }
    try {
      const res = await registerOTP(user.user_id, otp.confirmOTP);
      if (res.success) {
        message.success("Đăng ký Mật Khẩu Cấp 2 thành công");
        dispatch(setUser(res.data));
        await onVerify();
        setState({ type: "setLoading", payload: false });
        setState({ type: "setOpenModal", payload: false });
      }
    } catch (error) {
      console.log("Đăng ký Mật Khẩu Cấp 2 Thất Bại: ", error);
      setState({ type: "setLoading", payload: false });

      message.error(error.message);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (otp.confirmOTP.length !== 8) {
      setState({
        type: "SET_ERROR",
        payload: {
          ...error,
          confirmOTP: "Mã OTP phải có 8 ký tự",
        },
      });
      return;
    }
    // console.log("user.user_id: ", user.user_id);
    try {
      const res = await verifyOTP(user.user_id, otp.confirmOTP);
      if (res.success) {
        message.success("Xác Thực Mật Khẩu Cấp 2 thành công");
        dispatch(setUser(res.data));
        await onVerify();
        setState({ type: "setOpenModal", payload: false });
      }
    } catch (error) {
      console.log("Xác Thực Mật Khẩu Cấp 2 Thất Bại: ", error);
      message.error(error.message);
    }
  };

  const handleNavigateToForgotSecurityPassword = () => {
    navigate("/user/account?type=forgot-security-password");
  };

  return (
    <>
      <Modal
        footer={null}
        open={openModal}
        className="flex flex-col p-5 "
        closable={false}
      >
        {user?.security_password !== "" ? (
          <form
            className="w-full flex flex-col items-center justify-center gap-4"
            onSubmit={handleVerifyOTP}
          >
            <h1 className="font-garibato text-lg font-semibold">
              Mật khẩu Cấp 2
            </h1>
            <Input.OTP
              size="large"
              mask="🔒"
              length={8}
              onChange={onConfirmOTPChange}
            />
            <span className="text-red-500">{error?.confirmOTP}</span>
            <span className="text-xs text-neutral-700 mt-1">
              (Mật khẩu cấp 2 sẽ được sử dụng để xác thực các giao dịch, vui
              lòng ghi nhớ và không chia sẻ cho người khác)
            </span>
            <div className="flex w-full items-center justify-between">
              <Button
                className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                onClick={handleNavigateToForgotSecurityPassword}
              >
                Quên Mật Khẩu
              </Button>

              <div className="w-full flex items-center justify-between">
                <div className="flex w-full items-center justify-end gap-2">
                  <Button
                    className="border-secondary text-secondary hover:bg-secondary hover:text-white"
                    onClick={handleBack}
                  >
                    Trở Lại
                  </Button>
                  <Button
                    className="bg-primary text-white hover:opacity-80"
                    htmlType="submit"
                  >
                    Xác Nhận
                  </Button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <section className="w-full flex flex-col items-center justify-center gap-4">
            {step === 1 ? (
              <>
                <h1 className="font-garibato text-lg font-semibold">
                  Tạo Mới Mật khẩu Cấp 2
                </h1>
                <Input.OTP
                  size="large"
                  value={otp.newOTP}
                  status={error.newOTP === "" ? "success" : "error"}
                  length={8}
                  mask="🔒"
                  onChange={onNewOTPChange}
                />
                <span className="text-red-500">{error?.newOTP}</span>
                <span className="text-xs text-neutral-700 mt-1">
                  (Mật khẩu cấp 2 sẽ được sử dụng để xác thực các giao dịch, vui
                  lòng ghi nhớ và không chia sẻ cho người khác)
                </span>
                <div className="w-full items-center justify-between">
                  <Button
                    className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                    onClick={handleNavigateToForgotSecurityPassword}
                  >
                    Quên Mật Khẩu
                  </Button>

                  <div className="flex w-full items-center justify-end gap-2">
                    <Button
                      className="border-secondary text-secondary hover:bg-secondary hover:text-white"
                      onClick={handleBack}
                    >
                      Trở Lại
                    </Button>
                    <Button
                      className="bg-primary text-white hover:opacity-80"
                      onClick={handleNextStep}
                    >
                      Tiếp Theo
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <form
                  className="w-full flex flex-col items-center justify-center gap-4"
                  onSubmit={handleRegisterOTP}
                >
                  <h1 className="font-garibato text-lg font-semibold">
                    Xác Nhận Mật khẩu Cấp 2
                  </h1>
                  <Input.OTP
                    size="large"
                    value={otp.confirmOTP}
                    status={error.confirmOTP === "" ? "success" : "error"}
                    length={8}
                    mask="🔒"
                    onChange={onConfirmOTPChange}
                  />
                  <span className="text-red-500">{error?.confirmOTP}</span>
                  <span className="text-xs text-neutral-700 mt-1">
                    (Mật khẩu cấp 2 sẽ được sử dụng để xác thực các giao dịch,
                    vui lòng ghi nhớ và không chia sẻ cho người khác)
                  </span>
                  <div className="w-full flex justify-between items-center">
                    <Button
                      className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                      onClick={handleNavigateToForgotSecurityPassword}
                    >
                      Quên Mật Khẩu
                    </Button>
                    <div className="flex w-full items-center justify-end gap-2">
                      <Button
                        className="border-secondary text-secondary hover:bg-secondary hover:text-white"
                        onClick={handleBackToStep1}
                      >
                        Trở Lại
                      </Button>
                      <Button
                        className="bg-primary text-white hover:opacity-80"
                        htmlType="submit"
                        loading={loading}
                      >
                        Xác Nhận
                      </Button>
                    </div>
                  </div>
                </form>
              </>
            )}
          </section>
        )}
      </Modal>
    </>
  );
};

export default memo(ModalOTP);
