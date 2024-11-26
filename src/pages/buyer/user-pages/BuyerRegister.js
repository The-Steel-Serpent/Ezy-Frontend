import React, { useEffect, useReducer } from "react";
import { motion } from "framer-motion";
import { Button, DatePicker, Divider, Input, message, Select } from "antd";
import { FcGoogle } from "react-icons/fc";
import bgAbstract from "../../../assets/engaged.png";
import SecondaryHeader from "../../../components/SecondaryHeader";
import {
  signUpWithEmailPassword,
  signInWithGoogle,
} from "../../../firebase/AuthenticationFirebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ModalForgotPassword from "../../../components/user/ModalForgotPassword";
import { checkNumberPhone } from "../../../helpers/formatPhoneNumber";

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
const BuyerRegister = () => {
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
    const randomNumber = Math.floor(Math.random() * 1000);
    const username = `${email.split("@")[0]}${randomNumber}`;
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
      if (error.response.status === 404) {
        const rs = await saveUserAccount({
          user_id,
          email,
          username,
          fullname: fullname,
          avtUrl: avtUrl,
          isVerified: 1,
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
        `${process.env.REACT_APP_BACKEND_URL}/api/buyer-register`,
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
      console.log("res:", res);
      if (res.data.success) return true;
      else return false;
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
      if (res.data.success) return true;
      else return false;
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
          navigate("/buyer/login");
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
    } 
    else if (data.username.length < 6) {
      dispatch({
        type: "SET_ERROR",
        payload: {
          name: "username",
          value: "Tên đăng nhập phải có ít nhất 6 ký tự",
        },
      });
    }
    else if (data.username.length > 30) {
      dispatch({
        type: "SET_ERROR",
        payload: {
          name: "username",
          value: "Tên đăng nhập không được quá 30 ký tự",
        },
      });
    }
    else {
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
    } 
    else if (data.fullname.length > 30) {
      dispatch({
        type: "SET_ERROR",
        payload: {
          name: "fullname",
          value: "Họ và tên không được quá 30 ký tự",
        },
      });
    }
    else if (data.fullname.length < 6) {
      dispatch({
        type: "SET_ERROR",
        payload: {
          name: "fullname",
          value: "Họ và tên phải có ít nhất 6 ký tự",
        },
      });
    }
    else {
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
    const checkPhoneNumber = checkNumberPhone(data.phoneNumber);
    //PhoneNumber
    if (data.phoneNumber === "") {
      dispatch({
        type: "SET_ERROR",
        payload: {
          name: "phoneNumber",
          value: "Số điện thoại không được để trống",
        },
      });
    } else if (data.phoneNumber.length === 10 && checkPhoneNumber !== "") {
      dispatch({
        type: "SET_ERROR",
        payload: {
          name: "phoneNumber",
          value: checkPhoneNumber,
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
    } 
    else if (data.password.length > 30) {
      dispatch({
        type: "SET_ERROR",
        payload: {
          name: "password",
          value: "Mật khẩu không được quá 30 ký tự",
        },
      });
    }
    else {
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
    <div className="w-full bg-cover bg-background-Shop-2 relative flex items-center justify-center ">
      <div className="w-full h-full backdrop-blur-md ">
        <SecondaryHeader />
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex justify-center py-5"
        >
          <section className="w-fit flex justify-center  items-center border-solid shadow-2xl">
            <div className="hidden lg:block h-full">
              <img
                className="w-[700px] h-full object-cover  rounded-s"
                src={bgAbstract}
              />
            </div>
            <div className="w-[450px] h-full bg-white rounded px-7 py-11 ">
              <form onSubmit={handleSignUp} className=" flex flex-col ">
                <h1 className="font-[500] text-primary text-2xl text-center">
                  Đăng Ký
                </h1>
                <div className=" h-[60.45px]">
                  <Input
                    tabIndex={1}
                    className="border py-2 px-3 w-full"
                    status={error?.username ? "error" : ""}
                    name="username"
                    placeholder="Tên Đăng Nhập"
                    type="text"
                    onChange={onTextChanged}
                  />
                  <span className="text-sm text-red-700">
                    {error?.username ? error?.username : ""}
                  </span>
                </div>
                <div className=" h-[60.45px]">
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
                </div>
                <div className=" h-[60.45px]">
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
                </div>
                <div className=" h-[60.45px]">
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
                </div>

                <div className="grid grid-cols-12 gap-4 h-[60.45px]">
                  <div className="col-span-8 flex flex-col">
                    <DatePicker
                      format="YYYY-MM-DD"
                      tabIndex={6}
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

                  <Select
                    className="col-span-4"
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
                  />
                </div>
                <div className=" h-[60.45px]">
                  <Input
                    tabIndex={8}
                    className="border py-2 px-3 w-full"
                    name="password"
                    status={error?.password ? "error" : ""}
                    onChange={onTextChanged}
                    placeholder={"Mật khẩu"}
                    type="password"
                    // type={passwordInputType}
                    // onChange={handleOnChange}
                  />
                  <span className="text-sm text-red-700">
                    {error?.password ? error?.password : ""}
                  </span>
                </div>
                <div className=" h-[60.45px]">
                  <Input
                    tabIndex={8}
                    className="border py-2 px-3 w-full"
                    name="retypePassword"
                    onChange={onTextChanged}
                    status={error?.retypePassword ? "error" : ""}
                    placeholder={"Nhập lại mật khẩu"}
                    type="password"
                    // type={passwordInputType}
                    // onChange={handleOnChange}
                  />
                  <span className="text-sm text-red-700">
                    {error?.retypePassword ? error?.retypePassword : ""}
                  </span>
                </div>

                <Button
                  className="bg-custom-gradient text-white hover:opacity-90 mt-4"
                  // onSubmit={handleOnSubmit}
                  tabIndex={10}
                  htmlType="submit"
                  loading={loading}
                >
                  ĐĂNG KÝ
                </Button>
              </form>
              <div
                className="flex justify-end mt-4 text-sm text-[#05a]"
                tabIndex={11}
              >
                <span
                  className="cursor-pointer"
                  onClick={() =>
                    dispatch({ type: "SET_isVisbleResetModal", payload: true })
                  }
                >
                  Quên mật khẩu
                </span>
              </div>
              <Divider>
                <span className="text-slate-400 text-xs">HOẶC</span>
              </Divider>
              <div className="flex justify-center">
                <button
                  className="border rounded p-2 w-[165px]"
                  onClick={handleGoogleSignIn}
                >
                  <span className="flex gap-1 justify-center items-center">
                    <FcGoogle size={23} /> Google
                  </span>
                </button>
              </div>
              <div className="flex justify-center items-center gap-1 mt-8 mb-4 text-sm">
                <span className="text-slate-400 ">Đã có tài khoản?</span>
                <a href="/buyer/login" className="text-primary" tabIndex={12}>
                  Đăng nhập
                </a>
              </div>
            </div>
          </section>
        </motion.div>
      </div>
      <ModalForgotPassword
        isVisbleResetModal={isVisbleResetModal}
        onClosed={(callback) => {
          dispatch({ type: "SET_isVisbleResetModal", payload: false });
          if (callback) {
            dispatch({ type: "SET_isVisbleResetModal", payload: callback });
          }
        }}
      />
    </div>
  );
};

export default BuyerRegister;
