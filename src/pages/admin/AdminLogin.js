import React, { useState } from "react";
import wallpaper from "../../assets/wallpaper-seller1.png"
import { Divider } from "antd";
import { IoMdEye } from "react-icons/io";
import { RiEyeCloseLine } from "react-icons/ri";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const AdminLogin = () => {
    const [hidePassword, setHidePassword] = useState(false);
  const handleHidePassword = (e) => {
    e.preventDefault();
    setHidePassword(!hidePassword)
  }
  return (
    
    <div className="bg-white w-full mt-1 shadow-inner flex justify-center gap-32">
      <div className="max-w-96 px-3 my-24 hidden lg:block">
        <div className="text-primary text-3xl font-[490]">Bán hàng chuyên nghiệp</div>
        <div className="text-slate-600 text-[21px] py-2">Quản lý shop một cách hiệu quả hơn trên Shopee với Shopee - Kênh Quản Trị</div>
        <img
          src={wallpaper}
          width={500}
          alt="wallpaper"
        />
      </div>
      <div>
        <form className="w-96 shadow-lg px-6 py-10 mb-10">
          <h1 className="font-[450] text-xl mb-10">Đăng nhập</h1>
          <input
            type="text"
            placeholder="Email/Số điện thoại/Tên Đăng nhập"
            className="p-3 w-full border rounded mb-8"
            id="username"
          />
          <div className="relative flex items-center mb-8">
            <input
              type={hidePassword ? "text" : "password"}
              placeholder="Mật khẩu"
              className="p-3 w-full border rounded"
              id="password"
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
          <button className="w-full bg-primary p-3 rounded text-white hover:bg-[#f3664a]">
            Đăng nhập
          </button>
          <div className="w-full py-3 flex justify-between">
            <a className="text-[15px] text-[#05a]" href="#">Quên mật khẩu</a>
            <a className="text-[15px] text-[#05a]" href="#">Đăng nhập bằng SMS</a>
          </div>
          <Divider>
            <span className="text-slate-400 text-xs">HOẶC</span>
          </Divider>
          <div className="w-full flex justify-between">
            <button className="border rounded p-2 w-[180px] hover:bg-slate-100">
              <span className="flex gap-1 justify-center items-center">
                <FaFacebook size={23} className="text-[#1877f2]" /> Facebook
              </span>
            </button>
            <button className="border rounded p-2 w-[180px] hover:bg-slate-100">
              <span className="flex gap-1 justify-center items-center">
                <FcGoogle size={23} /> Google
              </span>
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default AdminLogin