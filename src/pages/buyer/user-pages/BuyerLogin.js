import React, { useEffect, useState } from "react";
import FlashSale from "../../../assets/flash-sale.png";
import { Button, Divider, Input, message } from "antd";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IoMdEye } from "react-icons/io";
import { RiEyeCloseLine } from "react-icons/ri";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../../../redux/userSlice";
import bgAbstract from "../../../assets/engaged.png";
import SecondaryHeader from "../../../components/SecondaryHeader";
import { motion } from "framer-motion";
import {
  signInWithGoogle,
  signInWithEmailPassword,
} from "../../../firebase/AuthenticationFirebase";
import ModalForgotPassword from "../../../components/user/ModalForgotPassword";
import { getAuth, unlink } from "firebase/auth";
const BuyerLogin = () => {
  document.title = "Đăng nhập";

  const [data, setData] = useState(null);
  const [hidePassword, setHidePassword] = useState(false);
  const [error, setError] = useState({
    identifier: "",
    password: "",
  });
  const [isVisbleResetModal, setIsVisbleResetModal] = useState(false);
  const navigate = useNavigate();
  const passwordInputType = hidePassword ? "text" : "password";

  const handleHidePassword = (e) => {
    e.preventDefault();
    setHidePassword((prev) => !prev);
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const handleSignIn = async ({ email, password }) => {
    try {
      const user = await signInWithEmailPassword(email, password);

      if (user.emailVerified) {
        const token = await user.getIdToken();
        localStorage.setItem("token", token);
        toast.success("Đăng nhập thành công");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        toast.error(
          "Tài khoản của bạn chưa xác thực vui lòng xác thực email trước khi đăng nhập"
        );
        return;
      }
    } catch (error) {
      console.error("Error during sign-in:", error.message);
      console.error("Error message:", error.message);
      toast.error(error?.message || "Đăng nhập thất bại");
    }
  };
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!data?.identifier || !data?.password) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/find-user-email-or-username`;
    try {
      const response = await axios.post(
        url,
        {
          identifier: data.identifier,
        },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        if (response.data.user.role_id !== 1) {
          toast.error("Tài khoản của bạn không phải là tài khoản khách hàng");
          return;
        } else {
          const email = response.data.user.email;
          const password = data.password;
          await handleSignIn({ email, password });
        }
      }
    } catch (error) {
      if (error.status === 404) {
        toast.error("Tài khoản không tồn tại");
      } else toast.error("Đăng nhập thất bại");
    }
  };

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
          toast.error(
            "Đăng nhập thất bại. Tài khoản của bạn không phải là tài khoản khách hàng"
          );
          return;
        }
        localStorage.setItem("token", await user.getIdToken());
        toast.success("Đăng nhập thành công");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (error) {
      console.error("Error:", error.response || error.message);
      console.log("error ", error.response.status);
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
        toast.success("Đăng nhập thành công");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else toast.error("Đăng nhập thất bại");
    }
  };
  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      const user = await signInWithGoogle();
      const auth = getAuth();
      const currentUser = auth.currentUser;
      for (let provider of user.providerData) {
        if (provider.email !== user.email) {
          try {
            await unlink(currentUser, provider.providerId);
            console.log(`Unlinked provider: ${provider.providerId}`);
          } catch (error) {
            console.error("Error unlinking provider: ", error);
          }
        }
      }
      if (user) {
        await checkRole(user);
      }
    } catch (error) {
      toast.error(error?.message || "Đăng nhập thất bại");
    }
  };
  useEffect(() => {
    if (data?.identifier === "") {
      setError((prev) => ({
        ...prev,
        identifier: "Vui lòng không để trống Email/Tên Đăng Nhập",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        identifier: "",
      }));
    }
    if (data?.password === "") {
      setError((prev) => ({
        ...prev,
        password: "Vui lòng không để trống mật khẩu",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        password: "",
      }));
    }
  }, [data]);
  return (
    <div className="w-full bg-cover bg-background-Shop-2 h-screen relative flex items-center justify-center">
      <div className="w-full h-full backdrop-blur-md">
        <SecondaryHeader />
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex justify-center mt-14"
        >
          <section className="w-fit flex justify-center  items-center border-solid shadow-2xl">
            <div className="hidden h-full lg:block">
              <img
                className="object-cover w-[500px] h-full rounded-s"
                src={bgAbstract}
              />
            </div>
            <div className="w-[400px] h-full bg-white rounded px-7 py-10 ">
              <form className=" flex flex-col" onSubmit={handleOnSubmit}>
                <h1 className="font-[500] text-primary text-2xl text-center mb-7">
                  Đăng nhập
                </h1>
                <div className="flex flex-col h-[74px]">
                  <Input
                    tabIndex={1}
                    className="border py-2 px-3 w-full"
                    name="identifier"
                    status={error?.identifier ? "error" : ""}
                    placeholder="Email/Tên đăng nhập"
                    onChange={handleOnChange}
                    type="text"
                  />
                  <span className="text-red-700 text-sm">
                    {error?.identifier}
                  </span>
                </div>

                <div className="relative flex">
                  <div className="w-full h-[74px]">
                    <Input
                      tabIndex={2}
                      className="border py-2 px-3 w-full"
                      name="password"
                      status={error?.password ? "error" : ""}
                      placeholder="Mật khẩu"
                      type={passwordInputType}
                      onChange={handleOnChange}
                    />
                    <span className="text-red-700 text-sm">
                      {error?.password}
                    </span>
                  </div>

                  <div onClick={handleHidePassword}>
                    {hidePassword ? (
                      <IoMdEye
                        size={20}
                        className="absolute right-3 top-2 text-slate-500"
                      />
                    ) : (
                      <RiEyeCloseLine
                        size={20}
                        className="absolute right-3 top-2 text-slate-500"
                      />
                    )}
                  </div>
                </div>

                <Button
                  className="bg-custom-gradient text-white hover:opacity-90 rounded py-2"
                  htmlType="submit"
                  tabIndex={3}
                >
                  ĐĂNG NHẬP
                </Button>
              </form>
              <div
                className="flex justify-end mt-4 text-sm text-[#05a]"
                tabIndex={4}
              >
                <span
                  className="cursor-pointer"
                  onClick={() => setIsVisbleResetModal(true)}
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
                <span className="text-slate-400 ">Bạn mới biết đến Ezy?</span>
                <a href="/buyer/register" className="text-primary" tabIndex={5}>
                  Đăng ký
                </a>
              </div>
            </div>
          </section>
        </motion.div>
      </div>
      <ModalForgotPassword
        isVisbleResetModal={isVisbleResetModal}
        onClosed={(callback) => {
          setIsVisbleResetModal(false);
          if (callback) {
            setIsVisbleResetModal(callback);
          }
        }}
      />
    </div>
  );
};

export default BuyerLogin;
