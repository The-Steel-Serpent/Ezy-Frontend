import React, { useState } from "react";
import wallpaper from "../../assets/wallpaper-seller1.png"
import { Alert, Divider } from "antd";
import { IoMdEye } from "react-icons/io";
import { RiEyeCloseLine } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { signInWithGoogle, signInWithEmailPassword } from "../../firebase/AuthenticationFirebase";

const SellerLogin = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const [hidePassword, setHidePassword] = useState(false);

  const handleHidePassword = (e) => {
    e.preventDefault();
    setHidePassword(!hidePassword)
  }

  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      setSuccess('Successfully signed in with Google');
      console.log(user);
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
      const user = await signInWithEmailPassword(email,password);
      setSuccess('Successfully email password');
      console.log(user);
      setError(null);
    } catch (error) {
      setError(error.message);
      setSuccess(null);
      console.log("Error:", error);
    }
  }


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
        onSubmit={handleSignInEmailPassword}
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
          <div className="w-full py-3 flex">
            <a className="text-[15px] text-[#05a]" href="#">Quên mật khẩu</a>
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
      </div>
    </div>
  )
};

export default SellerLogin;
