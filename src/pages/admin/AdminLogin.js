import React, { useState } from "react";
import wallpaper from "../../assets/wallpaper-seller1.png"
import { Divider } from "antd";
import { IoMdEye } from "react-icons/io";
import { RiEyeCloseLine } from "react-icons/ri";

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
        <div className="text-slate-600 text-[21px] py-2">Kênh Quản Trị</div>
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
        </form>
      </div>
    </div>
  )
}

export default AdminLogin