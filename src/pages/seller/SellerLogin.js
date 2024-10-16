import React, { useEffect, useState } from "react";
import wallpaper from "../../assets/wallpaper-seller1.png";
import { Button, Divider, Input, message } from "antd";
import { IoMdEye } from "react-icons/io";
import { RiEyeCloseLine } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import {
  signInWithGoogle,
  signInWithEmailPassword,
} from "../../firebase/AuthenticationFirebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ModalForgotPassword from "../../components/user/ModalForgotPassword";

const SellerLogin = () => {
  document.title = "Đăng nhập";

  const [hidePassword, setHidePassword] = useState(false);
  const [isVisibleResetModal, setIsVisibleResetModal] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState({
    identifier: "",
    password: "",
  });
  const passwordInputType = hidePassword ? "text" : "password";

  const navigate = useNavigate();

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

  //
  const handleSignIn = async ({ email, password }) => {
    try {
      const user = await signInWithEmailPassword(email, password);

      if (user.emailVerified) {
        const token = await user.getIdToken();
        localStorage.setItem("token", token);
        message.success("Đăng nhập thành công");
        setTimeout(() => {
          navigate("/seller");
        }, 2000);
      } else {
        message.error(
          "Tài khoản của bạn chưa xác thực vui lòng xác thực email trước khi đăng nhập"
        );
        return;
      }
    } catch (error) {
      console.error("Error during sign-in:", error.message);
      console.error("Error message:", error.message);
      message.error(error.message || "Đăng nhập thất bại");
    }
  };
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!data?.identifier || !data?.password) {
      message.error("Vui lòng nhập đầy đủ thông tin.");
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
        if (response.data.user.role_id !== 2) {
          message.error("Tài khoản của bạn không phải là tài khoản cửa hàng");
          return;
        } else {
          const email = response.data.user.email;
          const password = data.password;
          await handleSignIn({ email, password });
        }
      }
    } catch (error) {
      if (error.status === 404) {
        message.error("Tài khoản không tồn tại");
      } else message.error("Đăng nhập thất bại");
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
        if (response.data.user.role_id !== 2) {
          message.error(
            "Đăng nhập thất bại. Tài khoản của bạn không phải là tài khoản cửa hàng"
          );
          return;
        }
        localStorage.setItem("token", await user.getIdToken());
        message.success("Đăng nhập thành công");
        setTimeout(() => {
          navigate("/seller");
        }, 3000);
      }
    } catch (error) {
      console.error("Error:", error.response || error.message);
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
          navigate("/seller");
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
    <div className="bg-white w-full mt-1 shadow-inner flex justify-center gap-32">
      <div className="max-w-96 px-3 my-24 hidden lg:block">
        <div className="text-primary text-3xl font-[490]">
          Bán hàng chuyên nghiệp
        </div>
        <div className="text-slate-600 text-[21px] py-2">
          Quản lý shop của bạn một cách hiệu quả và Ezy hơn trên Ezy - Kênh
          Người bán
        </div>
        <img src={wallpaper} width={500} alt="wallpaper" />
      </div>
      <div>
        <form
          onSubmit={handleOnSubmit}
          className="lg:w-96 shadow-lg px-6 py-10 mb-10">
          <h1 className="font-[450] text-xl mb-10">Đăng nhập</h1>
          <Input
            className="py-3.5 px-3 w-full border rounded"
            name="identifier"
            status={error?.identifier ? "error" : ""}
            placeholder="Email/Tên đăng nhập"
            onChange={handleOnChange}
            type="text"
          />
          <span className="text-red-700 text-sm">
            {error?.identifier}
          </span>
          <div className="relative flex items-center mt-8">
            <Input
              placeholder="Mật khẩu"
              className="py-3.5 px-3 w-full border rounded"
              name="password"
              type={passwordInputType}
              status={error?.password ? "error" : ""}
              onChange={handleOnChange}
            />
            <button className="absolute right-3" onClick={handleHidePassword}>
              {hidePassword ? (
                <IoMdEye className="text-slate-500" size={25} />
              ) : (
                <RiEyeCloseLine className="text-slate-500" size={25} />
              )}
            </button>
          </div>
          <span className="text-red-700 text-sm">
            {error?.password}
          </span>
          <Button
            htmlType="submit"
            className="w-full bg-primary p-3 rounded text-white hover:bg-[#f3664a] mt-8"
          >
            Đăng nhập
          </Button>
          <div className="w-full py-3 flex cursor-pointer">
            <span
              onClick={() => setIsVisibleResetModal(true)}
              className="text-[15px] text-[#05a]" >
              Quên mật khẩu
            </span>
          </div>
          <Divider>
            <span className="text-slate-400 text-xs">HOẶC</span>
          </Divider>
          <div className="w-full flex justify-between">
            <button
              onClick={handleGoogleSignIn}
              className="border rounded p-2 w-[180px] hover:bg-slate-100 m-auto"
            >
              <span className="flex gap-1 justify-center items-center">
                <FcGoogle size={23} /> Google
              </span>
            </button>
          </div>
          <div className="text-sm mt-10 w-full flex justify-center">
            <span className="text-slate-400">Bạn mới biết đến Ezy?</span>
            <a href="/seller/register" className="text-primary px-1">
              Đăng ký
            </a>
          </div>
        </form>
        <ModalForgotPassword
          isVisbleResetModal={isVisibleResetModal}
          onClosed={(callback) => {
            setIsVisibleResetModal(false);
            if (callback) {
              setIsVisibleResetModal(callback);
            }
          }}
        />
      </div>
    </div>
  );
};

export default SellerLogin;
