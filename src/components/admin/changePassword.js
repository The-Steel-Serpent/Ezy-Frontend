import React, { memo, useEffect, useReducer } from "react";
import ModalOTP from "../user/ModalOTP";
import { useDispatch, useSelector } from "react-redux";
import { Button, Divider, Input, message, Modal } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { is } from "date-fns/locale";
import { changePassword } from "../../firebase/AuthenticationFirebase";
import { logOut } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/userSlice";
import { clearCart } from "../../redux/cartSlice";
import { IoCheckmarkDoneCircle } from "react-icons/io5";

const ChangePassword = (props) => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [state, setState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "loading":
          return { ...state, loading: action.payload };
        case "isVerify":
          return { ...state, isVerify: action.payload };
        case "error":
          return { ...state, error: action.payload };
        case "data":
          return { ...state, data: action.payload };
        default:
          return state;
      }
    },
    {
      loading: false,
      isVerify: false,
      data: {
        oldPassword: "",
        newPassword: "",
        reNewPassword: "",
      },
      error: {
        oldPassword: "",
        newPassword: "",
        reNewPassword: "",
      },
    }
  );
  const { isVerify, data, error, loading} = state;
  const onVerify = () => {
    setState({ type: "isVerify", payload: true });
  };
  const handleOnChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setState({
      type: "data",
      payload: {
        ...state.data,
        [name]: value,
      },
    });
  };
  const validate = () => {
    let localErrors = {
      oldPassword: "",
      newPassword: "",
      reNewPassword: "",
    };
    if (!data.oldPassword) {
      localErrors.oldPassword = "Mật khẩu cũ không được để trống";
    } else if (data.oldPassword?.length < 6) {
      localErrors.oldPassword = "Mật khẩu cũ phải có ít nhất 6 ký tự";
    }
    if (!data.newPassword) {
      localErrors.newPassword = "Mật khẩu mới không được để trống";
    } else if (data.newPassword?.length < 6) {
      localErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
    } else if (data.newPassword === data.oldPassword) {
      localErrors.newPassword = "Mật khẩu mới không được trùng với mật khẩu cũ";
    }
    if (!data.reNewPassword) {
      localErrors.reNewPassword = "Nhập lại mật khẩu mới không được để trống";
    }

    if (data.newPassword !== data.reNewPassword) {
      localErrors.reNewPassword = "Mật khẩu nhập lại không trùng khớp";
    }
    console.log(localErrors);
    const hasErrors = Object.values(localErrors).some((error) => error !== "");
    console.log(hasErrors);
    if (hasErrors) {
      setState({
        type: "error",
        payload: localErrors,
      });
      return false;
    }
    return true;
  };
  useEffect(() => {
    if (data.oldPassword !== "") {
      setState({ type: "error", payload: { oldPassword: "" } });
    } else if (data.oldPassword?.length > 6) {
      setState({ type: "error", payload: { oldPassword: "" } });
    }

    if (data.newPassword !== "") {
      setState({ type: "error", payload: { newPassword: "" } });
    } else if (data.newPassword?.length > 6) {
      setState({ type: "error", payload: { newPassword: "" } });
    } else if (data.newPassword !== data.oldPassword) {
      setState({ type: "error", payload: { newPassword: "" } });
    }

    if (data.reNewPassword !== "") {
      setState({ type: "error", payload: { reNewPassword: "" } });
    }

    if (data.reNewPassword === data.newPassword) {
      setState({ type: "error", payload: { reNewPassword: "" } });
    }
  }, [data]);
  const handleSubmit = async () => {
    const isValid = validate();
    setState({ type: "loading", payload: true });
    if (!isValid) {
      setState({ type: "loading", payload: false });
      return;
    }
    try {
      const res = await changePassword(data.oldPassword, data.newPassword);
      if (res) {
        message.success("Đổi mật khẩu thành công, vui lòng đăng nhập lại");
        const logoutRes = await logOut();
        if (logoutRes) {
          dispatch(logout());
          dispatch(clearCart());
          navigate("/admin/login");
          setState({ type: "loading", payload: false });
        }
      }
    } catch (error) {
      console.log(error);
      setState({ type: "loading", payload: false });
      message.error(error.message);
    }
  };
  return (
    <>
      <div className="w-full bg-white p-5">
        <span className="text-xl font-garibato">Đổi Mật Khẩu</span>
        <Divider className="my-3" />
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-12 items-center justify-center">
            <span className="col-span-3 text-base">Mật Khẩu Cũ</span>
            <div className="col-span-6 flex flex-col gap-1">
              <Input.Password
                name="oldPassword"
                placeholder="Mật Khẩu Cũ"
                size="large"
                onChange={handleOnChange}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
              <span className="text-red-500">{error?.oldPassword}</span>
            </div>
          </div>
          <div className="grid grid-cols-12 items-center justify-center">
            <span className="col-span-3 text-base">Mật Khẩu Mới</span>
            <div className="col-span-6 flex flex-col gap-1">
              <Input.Password
                placeholder="Mật Khẩu Mới"
                size="large"
                name="newPassword"
                onChange={handleOnChange}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
              <span className="text-red-500">{error?.newPassword}</span>
            </div>
          </div>
          <div className="grid grid-cols-12 items-center justify-center ">
            <span className="col-span-3 text-base">Nhập Lại Mật Khẩu Mới</span>
            <div className="col-span-6 flex flex-col gap-1">
              <Input.Password
                placeholder="Nhập Lại Mật Khẩu Mới"
                size="large"
                name="reNewPassword"
                onChange={handleOnChange}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
              <span className="text-red-500">{error?.reNewPassword}</span>
            </div>
          </div>
          <div className="w-[80%] flex justify-center items-center mt-2">
            <Button
              loading={loading}
              className="bg-primary text-white py-2 rounded hover:opacity-80"
              onClick={handleSubmit}
            >
              Đổi Mật Khẩu
            </Button>
          </div>
        </div>
      </div>
      <ModalOTP user={user} onVerify={onVerify} />
    </>
  );
};

export default memo(ChangePassword);
