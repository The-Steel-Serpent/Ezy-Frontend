import React, { useEffect, useState } from "react";
import wallpaper from "../../assets/wallpaper-seller1.png"
import { Alert, Button, Divider, Input, Modal, message } from "antd";
import { IoMdEye } from "react-icons/io";
import { RiEyeCloseLine } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { signInWithGoogle, signInWithEmailPassword, resetPassword } from "../../firebase/AuthenticationFirebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { checkEmailFormat } from "../../helpers/formatEmail";

const SellerLogin = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);
  const [hidePassword, setHidePassword] = useState(false);
  const [isVisbleResetModal, setIsVisibleResetModal] = useState(false);
  const [emailReset, setEmailReset] = useState('');
  const navigate = useNavigate();

  const handleHidePassword = (e) => {
    e.preventDefault();
    setHidePassword(!hidePassword)
  }

  const showResetModal = () => {
    setIsVisibleResetModal(true);
  }

  const handleEmailResetChange = (e) => {
    const emailReset = e.target.value;
    setEmailReset(emailReset);
    if (!emailReset) {
      setError("Email không được để trống");
    }
    else {
      setError(null);
    }
  }

  const onSubmitReset = async (e) => {
    e.preventDefault();
    if (!emailReset) {
      setError("Email không được để trống");
      return;
    }
    else if (!checkEmailFormat(emailReset)) {
      setError("Email không hợp lệ");
      return;
    }
    try {
      await resetPassword(emailReset);
      setError(null);
      setWarning('Vui lòng kiểm tra email để đặt lại mật khẩu');
    } catch (error) {
      setError(error.message);
    }
  }

  const onCancelReset = () => {
    setIsVisibleResetModal(false);
  }

  const checkEmail = async ({ email }) => {
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/check-email?email=${email}`;
      const res = await axios({
        method: "GET",
        url: URL,
        withCredentials: true
      });
      if (res.status === 200)
        return true;
      else
        return false;
    } catch (error) {
      console.log("Error check email:", error.message);
      return false;
    }
  }

  const saveSeller = async ({ user_id, email }) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/seller-register`, {
        user_id,
        email,
      })
      console.log('User created successfully:', res.data);
      return res.data;
    } catch (error) {
      console.log("Register error:", error.message);
      return error.message;
    }
  }


  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      const user = await signInWithGoogle();
      // setSuccess('Successfully signed in with Google');
      message.success('Đăng nhập thành công');
      const user_id = user.uid;
      const email = user.email;
      const check = await checkEmail({ email });
      if (!check) {
        const rs = await saveSeller({ user_id, email });
        if (rs) {
          console.log("Oke roi em oiw");
        }
        else {
          console.log("Loi roi em oi");
        }
      }
      else {
        console.log("Đã có tài khoản");
      }
      navigate("/seller");
      setError(null);
    } catch (error) {
      setError(error.message);
      setSuccess(null);
      console.log("Error:", error);
    }
  }

  const handleSignInEmailPassword = async (e) => {
    e.preventDefault();
    try {
      const user = await signInWithEmailPassword(email, password);
      if (user) {
        console.log("Email is verified");
      }
      const user_id = user.uid;
      const check = await checkEmail({ email });
      if (!check) {
        const rs = await saveSeller({ user_id, email });
        if (rs) {
          console.log("Oke roi em oiw");
        }
        else {
          console.log("Loi roi em oi");
        }
      }
      else {
        console.log("Đã có tài khoản");
      }
      // setSuccess('Successfully email password');
      console.log("user:", user);
      message.success('Đăng nhập thành công');
      navigate("/seller");
      setError(null);
    } catch (error) {
      setError(error.message);
      setSuccess(null);
      console.log("Error:", error.message);
    }
  }

  // Clear Alert
  useEffect(() => {
    let timer;
    if (success) {
      timer = setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } else if (error) {
      timer = setTimeout(() => {
        setError(null);
      }, 5000);
    } else if (warning) {
      timer = setTimeout(() => {
        setWarning(null);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [success, error, warning]);
  return (
    <div className="bg-white w-full mt-1 shadow-inner flex justify-center gap-32">
      <div className="max-w-96 px-3 my-24 hidden lg:block">
        <div className="text-primary text-3xl font-[490]">Bán hàng chuyên nghiệp</div>
        <div className="text-slate-600 text-[21px] py-2">Quản lý shop của bạn một cách hiệu quả và Ezy hơn trên Ezy - Kênh Người bán</div>
        <img
          src={wallpaper}
          width={500}
          alt="wallpaper"
        />
      </div>
      <div>
        <form
          className="lg:w-96 shadow-lg px-6 py-10 mb-10">
          <h1 className="font-[450] text-xl mb-10">Đăng nhập</h1>
          <input
            type="text"
            placeholder="Email/Số điện thoại"
            className="py-3.5 px-3 w-full border rounded mb-8"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="relative flex items-center mb-8">
            <input
              type={hidePassword ? "text" : "password"}
              placeholder="Mật khẩu"
              className="py-3.5 px-3 w-full border rounded"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="absolute right-3" onClick={handleHidePassword}>
              {
                hidePassword ? (
                  <IoMdEye className="text-slate-500" size={25} />
                ) : (
                  <RiEyeCloseLine className="text-slate-500" size={25} />
                )
              }
            </button>
          </div>
          {/* success / error */}
          <div>
            {success && <Alert message={success} type="success" showIcon className="mb-5" />}
            {error && <Alert message={error} type="error" showIcon className="mb-5" />}
          </div>
          <button
            onClick={handleSignInEmailPassword}
            className="w-full bg-primary p-3 rounded text-white hover:bg-[#f3664a]">
            Đăng nhập
          </button>
          <div className="w-full py-3 flex cursor-pointer">
            <span
              className="text-[15px] text-[#05a]"
              onClick={showResetModal}
            >Quên mật khẩu</span>
          </div>
          <Divider>
            <span className="text-slate-400 text-xs">HOẶC</span>
          </Divider>
          <div className="w-full flex justify-between">
            <button
              onClick={handleGoogleSignIn}
              className="border rounded p-2 w-[180px] hover:bg-slate-100 m-auto">
              <span className="flex gap-1 justify-center items-center">
                <FcGoogle size={23} /> Google
              </span>
            </button>
          </div>
          <div className="text-sm mt-10 w-full flex justify-center">
            <span className="text-slate-400">Bạn mới biết đến Ezy?</span>
            <a href="/seller/register" className="text-primary px-1">Đăng ký</a>
          </div>
        </form>
        <Modal
          open={isVisbleResetModal}
          footer={null}
          onCancel={onCancelReset}
          centered
        >
          <h3 className="flex justify-center text-[25px]">Đặt lại mật khẩu</h3>
          <div className="flex flex-col items-center gap-6 px-8 mb-3 mt-5">
            <Input
              placeholder="Nhập email của bạn"
              className="w-full border p-3"
              value={emailReset}
              onChange={handleEmailResetChange}
            />
            <Button
              onClick={onSubmitReset}
              className="bg-primary text-white w-full h-12"
            >
              Tiếp theo
            </Button>
            {error && <Alert message={error} type="error" showIcon />}
            {warning && <Alert message={warning} type="warning" showIcon />}
          </div>
        </Modal>
      </div>
    </div>
  )
};

export default SellerLogin;
