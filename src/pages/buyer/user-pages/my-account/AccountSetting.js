import {
  DownOutlined,
  FrownFilled,
  FrownOutlined,
  MehOutlined,
  SmileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Divider, Skeleton, Tree } from "antd";
import React, { lazy, Suspense, useEffect, useReducer, useState } from "react";
import { FaUserAstronaut } from "react-icons/fa";
import { PiNotepadBold } from "react-icons/pi";
import { IoNotificationsOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ImPencil2 } from "react-icons/im";
import { LuWallet } from "react-icons/lu";
import UpdateOTP from "../../../../components/user/UpdateOTP";

const NotificationSection = lazy(() =>
  import("../../../../components/notifications/NotificationSection")
);
const OrderDetailsSection = lazy(() =>
  import("../../../../components/order/OrderDetailsSection")
);
const WalletSection = lazy(() =>
  import("../../../../components/wallet/WalletSection")
);

const OrderSection = lazy(() =>
  import("../../../../components/order/OrderSection")
);
const EditProfile = lazy(() =>
  import("../../../../components/user/EditProfile")
);
const ChangeEmail = lazy(() =>
  import("../../../../components/user/ChangeEmail")
);
const AddressChange = lazy(() =>
  import("../../../../components/user/AddressChange")
);
const ChangePassword = lazy(() =>
  import("../../../../components/user/ChangePassword")
);
const AccountSetting = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const type = query.get("type");
  const [state, setState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "SET_LOADING":
          return { ...state, loading: action.payload };
        case "SELECTED_KEYS":
          return { ...state, selectedKeys: action.payload };
        case "EXPANDED_KEYS":
          return { ...state, expandedKeys: action.payload };
        default:
          return state;
      }
    },
    {
      loading: true,
      selectedKeys: ["account"],
      expandedKeys: ["account"],
    }
  );
  const { selectedKeys, expandedKeys, loading } = state;
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
        ...(user?.security_password !== null
          ? [
              {
                title: <span className="pl-2">Mật Khẩu Cấp 2</span>,
                key: "security-password",
                parenKey: "account",
              },
            ]
          : []),
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
        {
          title: <span className="pl-2">Hệ Thống</span>,
          key: "system",
          parentKey: "notification",
        },
      ],
    },
    {
      title: "Ví Ezy",
      key: "ezy-wallet",
      icon: <LuWallet size={22} className="text-primary" />,
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
        if (key === "purchase") {
          navigate(`/user/${key}?status-id=-1`);
        } else {
          navigate(`/user/${key}`);
        }
      }
    }
  };
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const type = query.get("type");
    if (type) {
      setState({ type: "SELECTED_KEYS", payload: type });
    } else {
      if (location.pathname.startsWith("/user/purchase/order")) {
        setState({
          type: "SELECTED_KEYS",
          payload: "purchase",
        });
      } else {
        setState({
          type: "SELECTED_KEYS",
          payload: location.pathname.split("/").pop(),
        });
      }
    }
  }, [location.pathname, location.search]);
  const renderContent = () => {
    if (type) {
      switch (type) {
        case "profile":
          return (
            <Suspense
              fallback={<Skeleton.Node active={true} className="w-full" />}
            >
              <EditProfile />
            </Suspense>
          );
        case "email":
          return (
            <Suspense
              fallback={<Skeleton.Node active={true} className="w-full" />}
            >
              <ChangeEmail />
            </Suspense>
          );
        case "address":
          return (
            <Suspense
              fallback={<Skeleton.Node active={true} className="w-full" />}
            >
              <AddressChange />
            </Suspense>
          );
        case "password":
          return (
            <Suspense
              fallback={<Skeleton.Node active={true} className="w-full" />}
            >
              <ChangePassword />
            </Suspense>
          );
        case "order":
          return (
            <Suspense
              fallback={<Skeleton.Node active={true} className="w-full" />}
            >
              <NotificationSection />
            </Suspense>
          );
        case "wallet":
          return (
            <Suspense
              fallback={<Skeleton.Node active={true} className="w-full" />}
            >
              <NotificationSection />
            </Suspense>
          );
        case "system":
          return (
            <Suspense
              fallback={<Skeleton.Node active={true} className="w-full" />}
            >
              <NotificationSection />
            </Suspense>
          );
        case "security-password":
          return (
            <Suspense
              fallback={<Skeleton.Node active={true} className="w-full" />}
            >
              <UpdateOTP />
            </Suspense>
          );
        default:
          return (
            <Suspense
              fallback={<Skeleton.Node active={true} className="w-full" />}
            >
              <EditProfile />
            </Suspense>
          );
      }
    } else if (location.pathname === "/user/ezy-wallet") {
      return (
        <Suspense fallback={<Skeleton.Node active={true} className="w-full" />}>
          <WalletSection />
        </Suspense>
      );
    } else if (location.pathname.startsWith("/user/purchase/order")) {
      return (
        <Suspense fallback={<Skeleton.Node active={true} className="w-full" />}>
          <OrderDetailsSection />
        </Suspense>
      );
    } else {
      return (
        <Suspense fallback={<Skeleton.Node active={true} className="w-full" />}>
          <OrderSection />
        </Suspense>
      );
    }
  };

  return (
    <>
      {user?.user_id !== "" && (
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
              selectedKeys={[selectedKeys]}
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
      )}
      {user?.user_id === "" && (
        <div className="flex justify-center items-center h-[400px]">
          <div className="flex flex-col items-center gap-2">
            <FrownFilled className="text-6xl text-red-500" />
            <span className="text-2xl">Bạn chưa đăng nhập</span>
            <Button
              className="bg-primary border-primary text-white hover:opacity-80"
              onClick={() => navigate("/buyer/login")}
            >
              Đăng nhập ngay
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountSetting;
