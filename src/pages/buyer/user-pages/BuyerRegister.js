import React, { useState } from "react";
import FlashSale from "../../../assets/flash-sale.png";
import {
  Button,
  DatePicker,
  Divider,
  Dropdown,
  Input,
  message,
  Select,
  Space,
  Upload,
} from "antd";
import { FcGoogle } from "react-icons/fc";
import bgAbstract from "../../../assets/engaged.png";
import { DownOutlined } from "@ant-design/icons";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import SecondaryHeader from "../../../components/SecondaryHeader";
const items = [
  {
    value: "Nam",
    label: <span>Nam</span>,
  },
  {
    value: "Nữ",
    label: <span>Nữ</span>,
  },
  {
    value: "Khác",
    label: <span>Khác</span>,
  },
];
const BuyerRegister = () => {
  const [loading, setLoading] = useState(false);

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );
  document.title = "Đăng Ký";

  return (
    <div className="w-full bg-cover bg-background-Shop-2 h-screen relative flex items-center justify-center ">
      <div className="w-full h-full backdrop-blur-md ">
        <SecondaryHeader />
        <div className="flex justify-center mt-8">
          <section className="w-fit flex justify-center  items-center border-solid shadow-2xl">
            <div className="hidden lg:block">
              <img
                className="object-cover w-[700px] h-[700px] rounded-s"
                src={bgAbstract}
              />
            </div>
            <div className="w-[450px] h-full bg-white rounded px-7 py-11 ">
              <form className=" flex flex-col gap-3 ">
                <h1 className="font-[500] text-primary text-2xl text-center">
                  Đăng Ký
                </h1>

                <Input
                  tabIndex={1}
                  className="border py-2 px-3 w-full"
                  name="username"
                  placeholder="Tên Đăng Nhập"
                  type="text"
                />
                <Input
                  tabIndex={2}
                  className="border py-2 px-3 w-full"
                  name="fullname"
                  placeholder="Họ và Tên"
                  type="text"
                />
                <Input
                  tabIndex={3}
                  className="border py-2 px-3 w-full"
                  name="email"
                  placeholder="Email"
                  type="email"
                />
                <Input
                  tabIndex={5}
                  className="border py-2 px-3 w-full"
                  name="phoneNumber"
                  placeholder="Số Điện Thoại"
                  type="tel"
                />
                <div className="grid grid-cols-12 gap-4">
                  <DatePicker
                    className="col-span-8"
                    format={{
                      format: "YYYY-MM-DD",
                      type: "mask",
                    }}
                    tabIndex={6}
                    placeholder="Ngày Sinh"
                    // onChange={onChange}
                  />
                  <Select
                    className="col-span-4"
                    placeholder="Giới Tính"
                    style={{ width: 120 }}
                    // onChange={handleChange}
                    options={items}
                    tabIndex={7}
                  />
                </div>

                <div className="relative flex">
                  <Input
                    tabIndex={8}
                    className="border py-2 px-3 w-full"
                    name="password"
                    placeholder="Mật khẩu"
                    // type={passwordInputType}
                    // onChange={handleOnChange}
                  />
                </div>

                <Button
                  className="bg-custom-gradient text-white hover:opacity-90 "
                  // onSubmit={handleOnSubmit}
                  tabIndex={9}
                >
                  ĐĂNG KÝ
                </Button>
              </form>
              <div
                className="flex justify-end mt-4 text-sm text-[#05a]"
                tabIndex={10}
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
                <a href="/buyer/login" className="text-primary" tabIndex={11}>
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
