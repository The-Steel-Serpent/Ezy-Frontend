import React, { useState } from "react";
import FlashSale from "../../../assets/flash-sale.png";
import { Button, Divider, Input } from "antd";
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
const BuyerLogin = () => {
  document.title = "Đăng nhập";

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
    <div className="w-full bg-cover bg-background-Shop-2 h-screen relative flex items-center justify-center">
      <div className="w-full h-full backdrop-blur-md">
        <SecondaryHeader />
        <div className="flex justify-center mt-14">
          <section className="w-fit flex justify-center  items-center border-solid shadow-2xl">
            <div className="hidden lg:block">
              <img
                className="object-cover w-[400px] h-[477px] rounded-s"
                src={bgAbstract}
              />
            </div>
            <div className="w-96 h-full bg-white rounded px-7 py-5 ">
              <form className=" flex flex-col gap-7 " onSubmit={handleOnSubmit}>
                <h1 className="font-[500] text-primary text-2xl text-center">
                  Đăng nhập
                </h1>
                <Input
                  tabIndex={1}
                  className="border py-2 px-3 w-full"
                  name="phoneNumber"
                  placeholder="Email/Tên đăng nhập"
                  onChange={handleOnChange}
                  type="text"
                />
                <div className="relative flex">
                  <Input
                    tabIndex={2}
                    className="border py-2 px-3 w-full"
                    name="password"
                    placeholder="Mật khẩu"
                    type={passwordInputType}
                    onChange={handleOnChange}
                  />
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
                  onSubmit={handleOnSubmit}
                  tabIndex={3}
                >
                  ĐĂNG NHẬP
                </Button>
              </form>
              <div
                className="flex justify-end mt-4 text-sm text-[#05a]"
                tabIndex={4}
              >
                <a href="/">Quên mật khẩu</a>
              </div>
              <Divider>
                <span className="text-slate-400 text-xs">HOẶC</span>
              </Divider>
              <div className="flex justify-center">
                <button className="border rounded p-2 w-[165px]">
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
        </div>
      </div>
    </div>
  );
};

export default BuyerLogin;
