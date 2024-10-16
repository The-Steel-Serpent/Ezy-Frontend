import { Button, Divider, Input, message, Modal, Result } from "antd";
import React, { memo, useEffect, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalOTP from "./ModalOTP";
import { useLocation, useNavigate } from "react-router-dom";
import {
  handleSendSignInLinkToEmail,
  updateNewEmail,
} from "../../firebase/AuthenticationFirebase";
import { checkEmailExists, updateEmail } from "../../services/userService";
import { setUser } from "../../redux/userSlice";

const ChangeEmail = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");
  const step = queryParams.get("step");
  const navigate = useNavigate();
  const [state, setState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "setLoading":
          return { ...state, loading: action.payload };
        case "isVerify":
          return { ...state, isVerify: action.payload };
        case "setEmail":
          return { ...state, email: action.payload };
        case "setPassword":
          return { ...state, password: action.payload };
        case "setMessage":
          return { ...state, messageSuccess: action.payload };
        case "error":
          return { ...state, error: action.payload };
        default:
          return state;
      }
    },
    {
      loading: false,
      isVerify: false,
      email: "",
      password: "",
      error: {
        email: "",
        password: "",
      },
      messageSuccess: "",
    }
  );

  const { email, isVerify, error, messageSuccess, password, loading } = state;

  const onVerify = () => {
    setState({ type: "isVerify", payload: true });
  };

  const handleOnNewEmailChange = (e) => {
    setState({ type: "setEmail", payload: e.target.value });
  };

  const handleContinue = async () => {
    setState({
      type: "setLoading",
      payload: true,
    });
    let localErrors = {
      email: "",
      password: "",
    };

    if (email.length === 0) {
      localErrors.email = "Vui lòng nhập email mới";
    } else if (email === user.email) {
      localErrors.email = "Email mới không được trùng với email hiện tại";
    } else if (!email.includes("@")) {
      localErrors.email = "Email không hợp lệ";
    }
    const checkEmail = await checkEmailExists(email);
    if (checkEmail) {
      localErrors.email = "Email đã tồn tại";
    }
    if (password.length === 0) {
      localErrors.password = "Vui lòng nhập mật khẩu";
    }

    const hasErrors = Object.values(localErrors).some((err) => err.length > 0);
    if (hasErrors) {
      setState({ type: "error", payload: localErrors });
      setState({
        type: "setLoading",
        payload: false,
      });
      return;
    }
    try {
      const res = await handleSendSignInLinkToEmail(email);
      if (res) {
        localStorage.setItem("newEmail", email);
        setState({
          type: "setMessage",
          payload: "Vui lòng kiểm tra email để xác nhận",
        });
        setState({
          type: "setLoading",
          payload: false,
        });
      }
    } catch (error) {
      console.error("Lỗi khi gửi liên kết đăng nhập: ", error);
      setState({
        type: "setLoading",
        payload: false,
      });
      message.error(error?.message || "Đã có lỗi xảy ra, vui lòng thử lại sau");
    }
    // navigate("/user/account?type=email&step=2");
  };

  const handleOnPasswordChange = (e) => {
    setState({ type: "setPassword", payload: e.target.value });
  };

  const handleUpdateEmail = async () => {
    try {
      // const newEmail = localStorage.getItem("newEmail");
      const newEmail = "tungbeobede@gmail.com";
      const res = await updateNewEmail(
        newEmail,
        window.location.href,
        password
      );
      console.log(res);
      if (res) {
        const updateEmailInBackend = await updateEmail(user.user_id, newEmail);
        console.log(updateEmailInBackend);
        if (updateEmailInBackend.success) {
          const newUser = updateEmailInBackend.data;
          dispatch(setUser(newUser));
          localStorage.removeItem("newEmail");
          message.success("Cập nhật Email thành công");
          setTimeout(() => {
            navigate("/user/account?type=email&step=3");
          }, 500);
        }
      }
    } catch (error) {
      message.error(error?.message || "Đã có lỗi xảy ra, vui lòng thử lại sau");
      setState({ type: "error", payload: error?.message });
      localStorage.removeItem("newEmail");
    }
  };

  useEffect(() => {
    if (email.length !== 0 || email !== user.email || email.includes("@")) {
      setState({
        type: "error",
        payload: {
          ...error,
          email: "",
        },
      });
    }
    if (password.length > 0) {
      setState({
        type: "error",
        payload: {
          ...error,
          password: "",
        },
      });
    }
  }, [email, password]);

  return (
    <>
      <div className="bg-white w-full px-7 py-5 h-[400px]">
        <h1 className="text-xl font-garibato">Thay Đổi Địa Chỉ Email</h1>
        <Divider className="p-3" />
        <div className="w-full grid grid-cols-12">
          {step === "1" && (
            <>
              <div className="col-span-3 flex flex-col gap-10">
                <span className="text-lg">Địa chỉ email mới</span>
                <span className="text-lg">Xác nhận mật khẩu</span>
              </div>
              <div className="flex flex-col col-span-9">
                <div className="w-[50%] flex flex-col gap-6">
                  <div className="flex flex-col gap-3">
                    <Input
                      placeholder="Địa chỉ Email Mới"
                      size="large"
                      status={error.email !== "" ? "error" : ""}
                      onChange={handleOnNewEmailChange}
                    />
                    <span className="text-red-500">{error.email}</span>

                    <Input
                      type="password"
                      placeholder="Nhập mật khẩu tài khoản"
                      size="large"
                      status={error.password !== "" ? "error" : ""}
                      onChange={handleOnPasswordChange}
                    />
                    <span className="text-red-500">{error.password}</span>
                    {messageSuccess && (
                      <span className="text-green-500">{messageSuccess}</span>
                    )}
                  </div>
                  <Button
                    className="w-fit px-8 py-4"
                    onClick={handleContinue}
                    loading={loading}
                  >
                    Tiếp Theo
                  </Button>
                </div>
              </div>
            </>
          )}
          {step === "2" && (
            <>
              <div className="col-span-12">
                <Result
                  status="success"
                  title="Câp nhật Email Thành Công!"
                  extra={
                    <Button onClick={() => navigate("/")}>
                      Trở về trang chủ
                    </Button>
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>
      {step !== "2" && step !== "3" && (
        <ModalOTP user={user} onVerify={onVerify} />
      )}
    </>
  );
};

export default memo(ChangeEmail);
