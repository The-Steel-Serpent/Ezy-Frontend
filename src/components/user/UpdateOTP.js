import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Button, Input, message, Result } from "antd";
import React, { memo, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { sendEmailVerificationAgain } from "../../firebase/AuthenticationFirebase";
import { registerOTP } from "../../services/userService";
import { setUser } from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";

const UpdateOTP = () => {
  const query = new URLSearchParams(window.location.search);
  const step = parseInt(query.get("step")) || 1;
  const verifyToken = query.get("verifyToken");
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      return { ...state, [action.type]: action.payload };
    },
    {
      step: step,
      loading: false,
      password: "",
      new_security_password: "",
      error: {
        password: "",
        new_security_password: "",
      },
      currentToken: "",
      success: "",
      isSend: false,
      isVerify: false,
    }
  );
  const handleOnPasswordChange = (e) => {
    const value = e.target.value;
    setLocalState({ type: "password", payload: value });
  };

  const handleOnNewSecurityPasswordChange = (text) => {
    setLocalState({ type: "new_security_password", payload: text });
  };

  const handleOnSendVerifyEmail = async () => {
    if (localState.password === "") {
      setLocalState({
        type: "error",
        payload: { password: "Vui lòng nhập mật khẩu" },
      });
      return;
    }

    setLocalState({ type: "loading", payload: true });
    try {
      await sendEmailVerificationAgain(localState.password);
      setLocalState({
        type: "success",
        payload: "Vui lòng kiểm tra email để xác nhận",
      });
      setLocalState({ type: "isSend", payload: true });
    } catch (error) {
      console.log(error);
      message.error(error.message);
    } finally {
      setLocalState({ type: "loading", payload: false });
    }
  };
  useEffect(() => {
    if (verifyToken) {
      setLocalState({ currentToken: verifyToken });
    }
  }, [verifyToken]);
  useEffect(() => {
    const currentTokenInLocalStorage = localStorage.getItem("verifyToken");
    const expirationTime = localStorage.getItem("tokenExpiration");
    if (step === 2) {
      console.log("Token cần xác thực: ", verifyToken);
      console.log("Lưu token rồi nè: ", currentTokenInLocalStorage);
      console.log("Thời gian token: ", expirationTime); // 5 minutes
      console.log("Date.now: ", Date.now());
      const bufferTime = 1000; // 1 second buffer
      if (Date.now() < expirationTime + bufferTime) {
        console.log("Token chưa hết hạn");
      } else {
        console.log("Token đã hết hạn");
      }
      if (
        currentTokenInLocalStorage === verifyToken &&
        Date.now() < expirationTime + bufferTime
      ) {
        setLocalState({ type: "isVerify", payload: true });
        message.success("Xác thực thành công");
      } else {
        setLocalState({ type: "isVerify", payload: false });
        message.error("Token không hợp lệ hoặc đã hết hạn");
      }
    }
  }, [step, verifyToken]);

  const handleRegisterNewOTP = async () => {
    setLocalState({ type: "loading", payload: true });
    if (localState.new_security_password.length < 8) {
      setLocalState({
        type: "error",
        payload: {
          new_security_password: "Mật khẩu cấp 2 phải có ít nhất 8 ký tự",
        },
      });
      setLocalState({ type: "loading", payload: false });
      return;
    }
    console.log("Mật khẩu cấp 2 mới: ", localState.new_security_password);
    try {
      const res = await registerOTP(
        user.user_id,
        localState.new_security_password
      );
      if (res.success) {
        message.success("Cập Nhật Mật Khẩu Cấp 2 thành công");
        dispatch(setUser(res.data));
        navigate("/user/account?type=security-password&step=3");
      }
    } catch (error) {
      console.log("Cập Nhật Mật Khẩu Cấp 2 Thất Bại: ", error);
      message.error(error.message);
    } finally {
      setLocalState({ type: "loading", payload: false });
      localStorage.removeItem("verifyToken");
      localStorage.removeItem("tokenExpiration");
    }
  };

  return (
    <section className="w-full bg-white p-5">
      <div className="flex flex-col border-b-[1px] pb-3">
        <span className="text-xl font-garibato">Mật Khẩu Cấp 2</span>
        <span className="text-sm">
          Cập nhật mật khẩu cấp 2 để bảo vệ tài khoản của bạn
        </span>
      </div>
      <div className="w-full">
        {step === 1 && (
          <>
            <div className="grid mt-5 grid-cols-12 gap-2 items-center w-full ">
              <label className="col-span-3 text-lg">Nhập lại mật khẩu</label>
              <div className="col-span-7">
                <Input.Password
                  name="oldPassword"
                  placeholder="Nhập mật khẩu để xác thực"
                  size="large"
                  onChange={handleOnPasswordChange}
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
                <span className="text-green-500">
                  {localState.success || ""}
                </span>
                <span className="text-red-500">
                  {localState.error.password || ""}
                </span>
              </div>
            </div>

            <div className="flex justify-center mt-5">
              <Button
                size="large"
                className="bg-primary text-white p-2 hover:opacity-80"
                onClick={handleOnSendVerifyEmail}
                disabled={localState.isSend}
                loading={localState.loading}
              >
                {localState.isSend ? "Đã gửi" : "Gửi Email Xác Thực"}
              </Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="grid grid-cols-12 mt-5 items-center">
              <label className="text-lg col-span-4">
                Nhập mật khẩu cấp 2 mới
              </label>
              <div className="col-span-8 flex flex-col">
                <Input.OTP
                  mask="🔒"
                  onChange={handleOnNewSecurityPasswordChange}
                  length={8}
                />
                <span className="text-red-500">
                  {localState.error.new_security_password || ""}
                </span>
              </div>
            </div>

            <div className="flex justify-center mt-5">
              <Button
                size="large"
                className="bg-primary text-white hover:opacity-80"
                onClick={handleRegisterNewOTP}
                loading={localState.loading}
                disabled={!localState.isVerify}
              >
                Cập Nhật
              </Button>
            </div>
          </>
        )}
        {step === 3 && (
          <div className="col-span-12">
            <Result
              status="success"
              title="Câp nhật Mật Khẩu Cấp 2 Thành Công!"
              extra={
                <Button onClick={() => navigate("/")}>Trở về trang chủ</Button>
              }
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default memo(UpdateOTP);
