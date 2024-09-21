import React, { useState } from "react";
import { Alert, Divider } from "antd";
import { FcGoogle } from "react-icons/fc";
import { BsShop } from "react-icons/bs";
import { HiOutlineGift } from "react-icons/hi2";
import { PiHandshake } from "react-icons/pi";
import { signInWithGoogle, signUpWithEmailPassword } from "../../firebase/AuthenticationFirebase";
import { IoMdEye } from "react-icons/io";
import { RiEyeCloseLine } from "react-icons/ri";

const SellerRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);

  const [hidePassword, setHidePassword] = useState(false);

  const handleHidePassword = (e) => {
    e.preventDefault();
    setHidePassword(!hidePassword)
  }
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const user = await signUpWithEmailPassword(email, password);
      setWarning('Please check your email to verify');
      setError(null);
    } catch (error) {
      setError(error.message);
      setSuccess(null);
      console.log("Error roi dcm:", error);
    }
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


  return (
    <div className="bg-white w-full mt-1 shadow-inner flex justify-center gap-32 bg-inmg">
      <div className="max-w-96 px-3 my-24 hidden lg:block">
        <div className="text-primary text-2xl font-[490]">Ezy Việt Nam</div>
        <div className="text-primary text-4xl font-[490]">Trở thành người bán ngay hôm nay</div>
        <div className="text-primary flex items-center gap-5 pt-5">
          <div>
            <BsShop size={28} />
          </div>
          <div className="text-lg">Nền tảng thương mại điện tử hàng đầu Đông Nam Á và Đài Loan</div>
        </div>
        <div className="text-primary flex items-center gap-5 pt-5">
          <div>
            <HiOutlineGift size={28} />
          </div>
          <div className="text-lg">Phát triển trở thành thương hiệu toàn cầu</div>
        </div>
        <div className="text-primary flex items-center gap-5 pt-5">
          <div>
            <PiHandshake size={28} />
          </div>
          <div className="text-lg">Dẫn đầu lượng người dùng trên ứng dụng mua sắm tại Việt Nam</div>
        </div>
      </div>
      <div className="pt-16">
        <form className="lg:w-[400px] shadow-xl px-6 py-6 mb-10 bg-white" onSubmit={handleSignUp}>
          <h1 className="font-[450] text-xl mb-5">Đăng ký</h1>
          <input
            type="text"
            placeholder="Email"
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
            {warning && <Alert message={warning} type="warning" showIcon className="mb-5" />}
          </div>
          <button className="w-full bg-primary p-3 rounded text-white hover:bg-[#f3664a]">
            TIẾP THEO
          </button>
          <Divider>
            <span className="text-slate-400 text-xs">HOẶC</span>
          </Divider>
          <div className="w-full flex items-center">
            <button 
            onClick={handleGoogleSignIn}
            className="border rounded p-2 w-[165px] hover:bg-slate-100 flex justify-center items-center m-auto">
              <span className="gap-1 flex justify-center">
                <FcGoogle size={23} /> Google
              </span>
            </button>
          </div>

          <div className="text-xs text-center mt-5">Bằng việc đăng kí, bạn đã đồng ý với Ezy về
            <br />
            <a className="text-primary" href="https://help.shopee.vn/portal/article/77243" > Điều khoản dịch vụ</a> &amp;
            <a className="text-primary" href="https://help.shopee.vn/portal/article/77244"> Chính sách bảo mật</a>
          </div>
          <div className="text-sm mt-10 w-full flex justify-center">
            <span className="text-slate-400">Bạn đã có tài khoản?</span>
            <a href="/seller/login" className="text-primary px-1">Đăng nhập</a>
          </div>
        </form>
      </div>
    </div>
  )
};

export default SellerRegister;
