import React from "react";
import { Dropdown, Space, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const AvatarWithPopover = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/logout`;
      const res = await axios.get(URL);
      toast.success(res.data.message);
      if (res.data.success) {
        dispatch(logout());
        navigate("/");
        localStorage.clear();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
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
    <Space direction="vertical">
      <Space wrap>
        <Dropdown
          menu={{
            items,
          }}
          placement="bottom"
          arrow={{
            pointAtCenter: true,
          }}
        >
          <Space wrap>
            {props.img && <Avatar src={props.img} size={props.size} />}
            {!props.img && (
              <Avatar
                style={{ backgroundColor: "#87d068" }}
                size={props.size}
                icon={<UserOutlined />}
              />
            )}
            <button className="text-white lg:block hidden hover:text-slate-300">
              {props.name}
            </button>
          </Space>
        </Dropdown>
      </Space>
    </Space>
  );
};

export default AvatarWithPopover;
