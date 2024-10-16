import {
  DownOutlined,
  FrownFilled,
  FrownOutlined,
  MehOutlined,
  SmileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Divider, Tree } from "antd";
import React, { useReducer, useState } from "react";
import { FaUserAstronaut } from "react-icons/fa";
import { PiNotepadBold } from "react-icons/pi";
import { IoNotificationsOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ImPencil2 } from "react-icons/im";
import EditProfile from "../../../../components/user/EditProfile";
import ChangeEmail from "../../../../components/user/ChangeEmail";

const AccountSetting = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "SELECTED_KEYS":
          return { ...state, selectedKeys: action.payload };
        case "EXPANDED_KEYS":
          return { ...state, expandedKeys: action.payload };
        default:
          return state;
      }
    },
    {
      selectedKeys: ["account"],
      expandedKeys: ["account"],
    }
  );
  const { selectedKeys, expandedKeys } = state;
  const treeData = [
    {
      title: <span className="">Tài Khoản Của Tôi</span>,
      key: "account",
      icon: <FaUserAstronaut size={22} className="text-primary" />,

      children: [
        {
          title: <span className="pl-2">Hồ Sơ</span>,
          key: "profile",
          parenKey: "account",
        },
        {
          title: <span className="pl-2">Địa Chỉ</span>,
          key: "address",
          parenKey: "account",
        },
        {
          title: <span className="pl-2">Đổi Mật Khẩu</span>,
          key: "password",
          parenKey: "account",
        },
      ],
    },
    {
      title: "Đơn Hàng",
      key: "purchase",
      icon: <PiNotepadBold size={22} className="text-primary" />,
    },
    {
      title: "Thông Báo",
      key: "notification",
      icon: <IoNotificationsOutline size={22} className="text-orange-400" />,
      children: [
        {
          title: <span className="pl-2">Cập Nhật Đơn Hàng</span>,
          key: "order",
          parentKey: "notification",
        },
        {
          title: <span className="pl-2">Cập Nhật Ví</span>,
          key: "wallet",
          parentKey: "notification",
        },
      ],
    },
  ];
  const onSelect = (keys, event) => {
    const { node } = event;
    const { key, children } = node;

    if (children && children.length > 0) {
      navigate(`/user/${key}?type=${children[0].key}`);
    } else {
      const parentNode = treeData.find(
        (item) =>
          item.children && item.children.some((child) => child.key === key)
      );

      if (parentNode) {
        navigate(`/user/${parentNode.key}?type=${key}`);
      } else {
        navigate(`/user/${key}`);
      }
    }
    setState({ type: "SELECTED_KEYS", payload: keys });
  };

  const renderContent = () => {
    const query = new URLSearchParams(location.search);
    const type = query.get("type");
    switch (type) {
      case "profile":
        return <EditProfile />;
      case "email":
        return <ChangeEmail />;
      default:
        return <EditProfile />;
    }
  };

  return (
    <main className="max-w-[1200px] mx-auto my-9 grid grid-cols-12 gap-2">
      <section className="col-span-3">
        <div className="flex items-center gap-2 px-3">
          {user?.avt_url ? (
            <Avatar
              className="cursor-pointer"
              src={user?.avt_url}
              size={50}
              onClick={() => navigate("/user/account?type=profile")}
            />
          ) : (
            <Avatar
              className="cursor-pointer"
              icon={<UserOutlined />}
              size={50}
              onClick={() => navigate("/user/account?type=profile")}
            />
          )}
          <div className="flex flex-col gap-1">
            <span className="font-semibold">{user?.username}</span>
            <span
              className="text-sm text-gray-400 flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/user/account?type=profile")}
            >
              <ImPencil2 /> Chỉnh sửa hồ sơ
            </span>
          </div>
        </div>
        <Divider className="my-3" />
        <Tree
          className="w-full bg-transparent text-lg "
          showIcon
          onSelect={onSelect}
          expandedKeys={expandedKeys}
          onExpand={(keys) =>
            setState({ type: "EXPANDED_KEYS", payload: keys })
          }
          defaultSelectedKeys={["profile"]}
          switcherIcon={<DownOutlined />}
          treeData={treeData}
        />
      </section>
      <section className="col-span-9">{renderContent()}</section>
    </main>
  );
};

export default AccountSetting;
