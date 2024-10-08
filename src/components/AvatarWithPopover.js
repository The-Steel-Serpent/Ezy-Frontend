import React from "react";
import { Dropdown, Space, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/cartSlice";

const AvatarWithPopover = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/logout`;
      const res = await axios.post(
        URL,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      toast.success("Đăng xuất thành công");
      if (res.data.success) {
        dispatch(logout());
        dispatch(clearCart());
        navigate("/");
        localStorage.clear();
      }
    } catch (error) {
      if (error.response.data.code === "auth/id-token-expired") {
        toast.error("Phiên Đăng nhập đã hết hạn");
      }
    }
  };
  const items = [
    {
      key: "1",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          Tài Khoản Của Tôi
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.aliyun.com"
        >
          Đơn Mua
        </a>
      ),
    },
    {
      key: "3",
      label: <button onClick={handleLogout}>Đăng Xuất</button>,
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap">
        <Dropdown
          menu={{
            items,
          }}
          placement="bottom"
          arrow={{
            pointAtCenter: true,
          }}
        >
          <div className="flex gap-2">
            {props.img && <Avatar src={props.img} size={props.size} />}
            {!props.img && (
              <Avatar
                className="bg-primary"
                size={props.size}
                icon={<UserOutlined className="text-white" />}
              />
            )}
            <button className="text-white lg:block hidden hover:text-slate-300">
              {props.name}
            </button>
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default AvatarWithPopover;
