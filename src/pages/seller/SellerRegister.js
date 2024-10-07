import React, { useEffect, useReducer, useState } from "react";
import { Alert, Button, DatePicker, Divider, Input, message, Select } from "antd";
import { FcGoogle } from "react-icons/fc";
import { BsShop } from "react-icons/bs";
import { HiOutlineGift } from "react-icons/hi2";
import { PiHandshake } from "react-icons/pi";
import {
  signInWithGoogle,
  signUpWithEmailPassword,
} from "../../firebase/AuthenticationFirebase";
import { IoMdEye } from "react-icons/io";
import { RiEyeCloseLine } from "react-icons/ri";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ModalForgotPassword from "../../components/user/ModalForgotPassword";
const items = [
  {
    value: "Nam",
    label: <span>Nam</span>,
  },
  {
    value: "Nữ",
    label: <span>Nữ</span>,
  },
  {
    value: "Khác",
    label: <span>Khác</span>,
  },
];
const SellerRegister = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "SET_LOADING":
          return { ...state, loading: action.payload };
        case "hasStartedTyping":
          return { ...state, hasStartedTyping: true };
        case "SET_isVisbleResetModal":
          return { ...state, isVisbleResetModal: action.payload };
        case "SET_DATA":
          return {
            ...state,
            data: {
              ...state.data,
              [action.payload.name]: action.payload.value,
            },
          };
        case "SET_ERROR":
          return {
            ...state,
            error: {
              ...state.error,
              [action.payload.name]: action.payload.value,
            },
          };

        default:
          return state;
      }
    },
    {
      isVisbleResetModal: false,
      loading: false,
      data: {
        username: "",
        fullname: "",
        email: "",
        phoneNumber: "",
        dob: "",
        gender: "",
        password: "",
        retypePassword: "",
      },
      error: {
        username: "",
        fullname: "",
        email: "",
        phoneNumber: "",
        dob: "",
        gender: "",
        password: "",
        retypePassword: "",
      },
      hasStartedTyping: false,
    }
  );


  const { loading, data, error, hasStartedTyping, isVisbleResetModal } = state;
  const checkRole = async (user) => {
    const user_id = user.uid;
    const email = user.email;
    const username = email.split("@")[0];
    const fullname = user.displayName;
    const avtUrl = user.photoURL;

    const url = `${process.env.REACT_APP_BACKEND_URL}/api/find-user-email-or-username`;
    try {
      const response = await axios.post(
        url,
        {
          identifier: email,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        if (response.data.user.role_id !== 1) {
          message.error(
            "Đăng nhập thất bại. Tài khoản của bạn không phải là tài khoản khách hàng"
          );
          return;
        }
        localStorage.setItem("token", await user.getIdToken());
        message.success("Đăng nhập thành công");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (error) {
      console.error("Error:", error.response || error.message);

      //Lưu tài khoản khi không tìm thấy tài khoản trong db
      if (error.status === 404) {
        const rs = await saveUserAccount({
          user_id,
          email,
          username,
          fullname: fullname,
          avtUrl: avtUrl,
          iasVerified: 1,
        });
        console.log(rs ? "Lưu tài khoản thành công" : "Lưu tài khoản thất bại");
        localStorage.setItem("token", await user.getIdToken());
        message.success("Đăng nhập thành công");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else message.error("Đăng nhập thất bại");
    }
  };
  const handleGoogleSignIn = async (e) => {
    e.preventDefault();

    try {
      const user = await signInWithGoogle();
      if (user) {
        await checkRole(user);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
  //onTextChanged
  const onTextChanged = (e) => {
    const { name, value } = e.target;
    dispatch({
      type: "hasStartedTyping",
    });
    dispatch({
      type: "SET_DATA",
      payload: { name, value },
    });
  };

  //Handle

  const saveUserAccount = async ({
    user_id,
    username,
    fullname,
    email,
    phoneNumber,
    gender,
    dob,
    avtUrl,
    isVerified = 0,
  }) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/seller-register`,
        {
          user_id,
          username,
          fullname,
          email,
          phoneNumber,
          gender,
          dob,
          avtUrl,
          isVerified,
        }
      );
      if (res.status === 201) return true;
    } catch (error) {
      console.log("Error save user account:", error.message);
      return false;
    }
  };

  const checkEmail = async ({ email }) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/check-email?email=${email}`
      );
      if (res.status === 200) return true;
      if (res.status === 400) return false;
    } catch (error) {
      console.log("Error check email:", error.message);
      return false;
    }
  };
  const checkUsername = async ({ username }) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/check-username?username=${username}`
      );
      if (res.status === 200) return true;
      if (res.status === 400) return false;
    } catch (error) {
      console.log("Error check email:", error.message);
      return false;
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!hasStartedTyping) {
      message.error("Vui lòng nhập thông tin");
      return;
    }
    dispatch({
      type: "SET_LOADING",
      payload: true,
    });
    try {
      const email = await checkEmail({ email: data.email });
      const username = await checkUsername({ username: data.username });
      if (email) {
        message.error("Email đã tồn tại");
        dispatch({
          type: "SET_LOADING",
          payload: false,
        });
        return;
      }
      if (username) {
        message.error("Tên đăng nhập đã tồn tại");
        dispatch({
          type: "SET_LOADING",
          payload: false,
        });
        return;
      }
      if (
        error?.username ||
        error?.fullname ||
        error?.email ||
        error?.phoneNumber ||
        error?.dob ||
        error?.gender ||
        error?.password ||
        error?.retypePassword
      ) {
        dispatch({
          type: "SET_LOADING",
          payload: false,
        });
        message.error("Vui lòng kiểm tra lại thông tin");
        return;
      }
      const user = await signUpWithEmailPassword(data?.email, data?.password);
      if (user) {
        await saveUserAccount({
          user_id: user.uid,
          username: data.username,
          fullname: data.fullname,
          email: data.email,
          phoneNumber: data.phoneNumber,
          gender: data.gender,
          dob: data.dob,
        });
        message.warning("Vui lòng xác thực email để hoàn tất đăng ký");
        setTimeout(() => {
          navigate("/seller/login");
        }, 3000);
      }
      dispatch({
        type: "SET_LOADING",
        payload: false,
      });
    } catch (error) {
      message.error(error.message);
      dispatch({
        type: "SET_LOADING",
        payload: false,
      });
    }
  };

  useEffect(() => {
    if (!hasStartedTyping) return;
    //Username
    if (data.username === "") {
      dispatch({
        type: "SET_ERROR",
        payload: {
          name: "username",
          value: "Tên đăng nhập không được để trống",
        },
      });
    } else {
      dispatch({
        type: "SET_ERROR",
        payload: { name: "username", value: "" },
      });
    }

    //Fullname
    if (data.fullname === "") {
      dispatch({
        type: "SET_ERROR",
        payload: { name: "fullname", value: "Họ và tên không được để trống" },
      });
    } else {
      dispatch({
        type: "SET_ERROR",
        payload: { name: "fullname", value: "" },
      });
    }

    //Email
    if (data.email === "") {
      dispatch({
        type: "SET_ERROR",
        payload: { name: "email", value: "Email không được để trống" },
      });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      dispatch({
        type: "SET_ERROR",
        payload: { name: "email", value: "Email không hợp lệ" },
      });
    } else {
      dispatch({
        type: "SET_ERROR",
        payload: { name: "email", value: "" },
      });
    }

    //PhoneNumber
    if (data.phoneNumber === "") {
      dispatch({
        type: "SET_ERROR",
        payload: {
          name: "phoneNumber",
          value: "Số điện thoại không được để trống",
        },
      });
    } else if (!/^\d{10}$/.test(data.phoneNumber)) {
      dispatch({
        type: "SET_ERROR",
        payload: {
          name: "phoneNumber",
          value: "Số điện thoại không hợp lệ",
        },
      });
    } else {
      dispatch({
        type: "SET_ERROR",
        payload: { name: "phoneNumber", value: "" },
      });
    }

    //DOB
    if (data.dob === "") {
      dispatch({
        type: "SET_ERROR",
        payload: { name: "dob", value: "Ngày sinh không được để trống" },
      });
    }
    const dob = new Date(data.dob);

    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    if (dob > today) {
      dispatch({
        type: "SET_ERROR",
        payload: { name: "dob", value: "Ngày sinh không hợp lệ" },
      });
    } else if (
      age < 16 ||
      (age === 16 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))
    ) {
      dispatch({
        type: "SET_ERROR",
        payload: { name: "dob", value: "Bạn phải đủ 16 tuổi" },
      });
    } else {
      dispatch({
        type: "SET_ERROR",
        payload: { name: "dob", value: "" },
      });
    }

    //GENDER
    if (data.gender === "") {
      dispatch({
        type: "SET_ERROR",
        payload: { name: "gender", value: "Giới tính không được để trống" },
      });
    } else {
      dispatch({
        type: "SET_ERROR",
        payload: { name: "gender", value: "" },
      });
    }

    //Password
    if (data.password === "") {
      dispatch({
        type: "SET_ERROR",
        payload: { name: "password", value: "Mật khẩu không được để trống" },
      });
    } else if (data.password.length > 0 && data.password.length < 6) {
      dispatch({
        type: "SET_ERROR",
        payload: {
          name: "password",
          value: "Mật khẩu phải có ít nhất 6 ký tự",
        },
      });
    } else {
      dispatch({
        type: "SET_ERROR",
        payload: { name: "password", value: "" },
      });
    }

    //RetypePassword
    if (data.retypePassword === "") {
      dispatch({
        type: "SET_ERROR",
        payload: {
          name: "retypePassword",
          value: "Nhập lại mật khẩu không được để trống",
        },
      });
    } else {
      dispatch({
        type: "SET_ERROR",
        payload: { name: "retypePassword", value: "" },
      });
    }

    // Trường hợp mật khẩu không khớp
    if (data.password !== data.retypePassword) {
      dispatch({
        type: "SET_ERROR",
        payload: { name: "retypePassword", value: "Mật khẩu không khớp" },
      });
    }
  }, [data]);
  document.title = "Đăng Ký";
  return (
    <div className="bg-white w-full mt-1 shadow-inner flex justify-center gap-32 bg-inmg">
      <div className="max-w-96 px-3 my-24 hidden lg:block">
        <div className="text-primary text-2xl font-[490]">Ezy Việt Nam</div>
        <div className="text-primary text-4xl font-[490]">
          Trở thành người bán ngay hôm nay
        </div>
        <div className="text-primary flex items-center gap-5 pt-5">
          <div>
            <BsShop size={28} />
          </div>
          <div className="text-lg">
            Nền tảng thương mại điện tử hàng đầu Đông Nam Á và Đài Loan
          </div>
        </div>
        <div className="text-primary flex items-center gap-5 pt-5">
          <div>
            <HiOutlineGift size={28} />
          </div>
          <div className="text-lg">
            Phát triển trở thành thương hiệu toàn cầu
          </div>
        </div>
        <div className="text-primary flex items-center gap-5 pt-5">
          <div>
            <PiHandshake size={28} />
          </div>
          <div className="text-lg">
            Dẫn đầu lượng người dùng trên ứng dụng mua sắm tại Việt Nam
          </div>
        </div>
      </div>
      <div className="pt-16">
        <form
          onSubmit={handleSignUp}
          className="lg:w-[400px] shadow-xl px-6 py-6 mb-10 bg-white flex flex-col gap-2">
          <h1 className="font-[450] text-xl mb-5">Đăng ký</h1>
          <Input
            placeholder="Tên đăng nhập"
            className="border py-2 px-3 w-full"
            status={error?.username ? "error" : ""}
            name="username"
            type="text"
            onChange={onTextChanged}
          />
          <span className="text-sm text-red-700">
            {error?.username ? error?.username : ""}
          </span>
          <Input
            tabIndex={2}
            className="border py-2 px-3 w-full"
            name="fullname"
            status={error?.fullname ? "error" : ""}
            placeholder={"Họ và Tên"}
            type="text"
            onChange={onTextChanged}
          />
          <span className="text-sm text-red-700">
            {error?.fullname ? error?.fullname : ""}
          </span>
          <Input
            tabIndex={3}
            className="border py-2 px-3 w-full"
            name="email"
            status={error?.email ? "error" : ""}
            placeholder={error?.email ? error?.email : "Email"}
            type="email"
            onChange={onTextChanged}
          />
          <span className="text-sm text-red-700">
            {error?.email ? error?.email : ""}
          </span>
          <Input
            tabIndex={4}
            className="border py-2 px-3 w-full"
            name="phoneNumber"
            status={error?.phoneNumber ? "error" : ""}
            placeholder={
              error?.phoneNumber ? error?.phoneNumber : "Số Điện Thoại"
            }
            type="tel"
            onChange={onTextChanged}
          />
          <span className="text-sm text-red-700">
            {error?.phoneNumber ? error?.phoneNumber : ""}
          </span>
          <div className="flex gap-2">
            <div className="flex flex-col w-[60%]">
              <DatePicker
                format="YYYY-MM-DD"
                tabIndex={6}
                className="w-full"
                status={error?.dob ? "error" : ""}
                placeholder={"Ngày Sinh"}
                onChange={(date, dateString) => {
                  dispatch({
                    type: "SET_DATA",
                    payload: { name: "dob", value: dateString },
                  });
                  dispatch({
                    type: "hasStartedTyping",
                  });
                }}
              />
              <span className="text-sm text-red-700">
                {error?.dob ? error?.dob : ""}
              </span>
            </div>
            <div className="w-[40%]">
              <Select
                className="w-full"
                placeholder={error?.gender ? error?.gender : "Giới Tính"}
                status={error?.gender ? "error" : ""}
                style={{ width: 120 }}
                options={items}
                tabIndex={7}
                onChange={(value) => {
                  dispatch({
                    type: "SET_DATA",
                    payload: { name: "gender", value },
                  });
                  dispatch({
                    type: "hasStartedTyping",
                  });
                }}
              >
              </Select>
            </div>
          </div>
          <Input
            className="border py-2 px-3 w-full mt-2"
            tabIndex={8}
            name="password"
            status={error?.password ? "error" : ""}
            onChange={onTextChanged}
            placeholder={"Mật khẩu"}
            type="password"
          />
          <span className="text-sm text-red-700">
            {error?.password ? error?.password : ""}
          </span>
          <Input
            className="border py-2 px-3 w-full"
            tabIndex={8}
            name="retypePassword"
            onChange={onTextChanged}
            status={error?.retypePassword ? "error" : ""}
            placeholder={"Nhập lại mật khẩu"}
            type="password"
          />
          <span className="text-sm text-red-700">
            {error?.retypePassword ? error?.retypePassword : ""}
          </span>

          <Button
            className="w-full bg-primary p-3 rounded text-white hover:bg-[#f3664a]"
            tabIndex={10}
            htmlType="submit"
            loading={loading}
          >
            TIẾP THEO
          </Button>
          <Divider>
            <span className="text-slate-400 text-xs">HOẶC</span>
          </Divider>
          <div className="w-full flex items-center">
            <button
              className="border rounded p-2 w-[165px] hover:bg-slate-100 flex justify-center items-center m-auto"
            >
              <span className="gap-1 flex justify-center">
                <FcGoogle
                  size={23}
                  onClick={handleGoogleSignIn} /> Google
              </span>
            </button>
          </div>

          <div className="text-xs text-center mt-5">
            Bằng việc đăng kí, bạn đã đồng ý với Ezy về
            <br />
            <a
              className="text-primary"
            >
              {" "}
              Điều khoản dịch vụ
            </a>{" "}
            &amp;
            <a
              className="text-primary"
            >
              {" "}
              Chính sách bảo mật
            </a>
          </div>
          <div className="text-sm mt-10 w-full flex justify-center">
            <span className="text-slate-400">Bạn đã có tài khoản?</span>
            <a href="/seller/login" className="text-primary px-1">
              Đăng nhập
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerRegister;
