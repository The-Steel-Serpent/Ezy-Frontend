import React from "react";
import FlashSale from "../../../assets/flash-sale.png";
import { Divider } from "antd";
import { FcGoogle } from "react-icons/fc";
import bgAbstract from "../../../assets/engaged.png";
const BuyerRegister = () => {
  document.title = "Đăng Ký";
  return (
    <div className="w-full bg-cover bg-background-Shop-2 h-screen relative ">
      <div className="absolute w-full h-full backdrop-blur-md">
        <div className="flex justify-center  px-10 py-36 ">
          <section className="w-fit flex justify-center  items-center border-solid shadow-2xl">
            <div className="hidden lg:block">
              <img
                className="object-cover w-[400px] h-[477px] rounded-s"
                src={bgAbstract}
              />
            </div>
            <div className="w-96 h-full bg-white rounded px-7 py-5 ">
              <form className=" flex flex-col gap-7 ">
                <h1 className="font-[500] text-primary text-2xl text-center">
                  Đăng Ký
                </h1>
                <input
                  tabIndex={1}
                  className="border py-2 px-3 w-full"
                  name="phoneNumber"
                  placeholder="Email/Tên đăng nhập"
                  type="text"
                />
                <div className="relative flex">
                  <input
                    tabIndex={2}
                    className="border py-2 px-3 w-full"
                    name="password"
                    placeholder="Mật khẩu"
                    // type={passwordInputType}
                    // onChange={handleOnChange}
                  />
                </div>

                <button
                  className="bg-custom-gradient text-white hover:opacity-90 rounded py-2"
                  type="submit"
                  // onSubmit={handleOnSubmit}
                  tabIndex={3}
                >
                  ĐĂNG KÝ
                </button>
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
                <span className="text-slate-400 ">Đã có tài khoản?</span>
                <a href="/buyer/login" className="text-primary" tabIndex={5}>
                  Đăng nhập
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default BuyerRegister;
