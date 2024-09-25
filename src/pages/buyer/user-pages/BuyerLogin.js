import React, { useState } from "react";
import FlashSale from "../../../assets/flash-sale.png";
import { Divider } from "antd";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IoMdEye } from "react-icons/io";
import { RiEyeCloseLine } from "react-icons/ri";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../../../redux/userSlice";
const BuyerLogin = () => {
  const [data, setData] = useState(null);
  const [hidePassword, setHidePassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/login`;
    try {
      const response = await axios({
        method: "POST",
        url: url,
        data: {
          phoneNumber: data?.phoneNumber,
          password: data?.password,
        },
        withCredentials: true,
      });
      toast.success(response.data.message);
      if (response.data.success) {
        console.log(response?.data?.token);
        dispatch(setToken(response?.data?.token));
        localStorage.setItem("token", response?.data?.token);
        setData({
          password: "",
        });
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <div>
      <div className="bg-primary w-full flex justify-center items-center p-10 gap-10">
        <div className="max-w-[1200px] hidden lg:block">
          <img src={FlashSale} width={500} />
        </div>
        <div className="w-96 bg-white rounded px-7 py-5 ">
          <form className=" flex flex-col gap-7 " onSubmit={handleOnSubmit}>
            <h1 className="font-[500] text-xl">Đăng nhập</h1>
            <input
              className="border py-2 px-3 w-full"
              name="phoneNumber"
              placeholder="Email/Số điện thoại/Tên đăng nhập"
              onChange={handleOnChange}
              type="text"
            />
            <div className="relative flex">
              <input
                className="border py-2 px-3 w-full"
                name="password"
                placeholder="Mật khẩu"
                type={passwordInputType}
                onChange={handleOnChange}
              />
              <button onClick={handleHidePassword}>
                {hidePassword ? (
                  <IoMdEye
                    size={20}
                    className="absolute right-3 top-3 text-slate-500"
                  />
                ) : (
                  <RiEyeCloseLine
                    size={20}
                    className="absolute right-3 top-3 text-slate-500"
                  />
                )}
              </button>
            </div>

            <button
              className="bg-custom-gradient text-white hover:opacity-90 rounded py-2"
              onSubmit={handleOnSubmit}
            >
              ĐĂNG NHẬP
            </button>
          </form>
          <div className="flex justify-between mt-4 text-sm text-[#05a]">
            <a href="/">Quên mật khẩu</a>
            <a href="/">Đăng nhập với SMS</a>
          </div>
          <Divider>
            <span className="text-slate-400 text-xs">HOẶC</span>
          </Divider>
          <div className="flex gap-2">
            <button className="border rounded p-2 w-[165px]">
              <span className="flex gap-1 justify-center items-center">
                <FaFacebook size={23} className="text-[#1877f2]" /> Facebook
              </span>
            </button>
            <button className="border rounded p-2 w-[165px]">
              <span className="flex gap-1 justify-center items-center">
                <FcGoogle size={23} /> Google
              </span>
            </button>
          </div>
          <div className="flex justify-center items-center gap-1 mt-8 mb-4 text-sm">
            <span className="text-slate-400 ">Bạn mới biết đến Shopee?</span>
            <a href="/buyer/register" className="text-primary">
              Đăng ký
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerLogin;
