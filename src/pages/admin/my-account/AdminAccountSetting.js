import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Divider, Skeleton, Tree } from "antd";
import React, { lazy, Suspense, useEffect, useReducer } from "react";
import { ImPencil2 } from "react-icons/im";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import UpdateOTP from "../../../components/admin/UpdateOTP";

const EditProfile = lazy(() => import("../../../components/admin/EditProfile"));
const ChangePassword = lazy(() =>
  import("../../../components/admin/changePassword")
);

const AdminAccountSetting = () => {
  const admin = useSelector((state) => state.user);
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
  const { selectedKeys, expandedKeys } = state;

  const treeData = [
    {
      title: "Tài Khoản Của Tôi",
      key: "account",
      icon: <UserOutlined className="text-primary" />,
      children: [
        {
          title: "Hồ Sơ",
          key: "profile",
          parenKey: "account",
        },
        {
          title: "Đổi Mật Khẩu",
          key: "password",
          parenKey: "account",
        },
        ...(admin?.security_password
          ? [
              {
                title: "Mật Khẩu Cấp 2",
                key: "security-password",
                parenKey: "account",
              },
            ]
          : []),
      ],
    },
  ];

  const onSelect = (keys, event) => {
    const { key } = event.node;
    navigate(`/admin/account?type=${key}`);
  };

  useEffect(() => {
    if (type) {
      setState({ type: "SELECTED_KEYS", payload: type });
    } else {
      setState({
        type: "SELECTED_KEYS",
        payload: location.pathname.split("/").pop(),
      });
    }
  }, [location.pathname, location.search]);

  const renderContent = () => {
    switch (type) {
      case "profile":
        return (
          <Suspense fallback={<Skeleton active />}>
            <EditProfile />
          </Suspense>
        );
      case "password":
        return (
          <Suspense fallback={<Skeleton active />}>
            <ChangePassword />
          </Suspense>
        );
      case "security-password":
        return (
          <Suspense fallback={<Skeleton active />}>
            <UpdateOTP />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<Skeleton active />}>
            <EditProfile />
          </Suspense>
        );
    }
  };

  return (
    <main className="max-w-[1200px] mx-auto my-9 grid grid-cols-12 gap-2">
      <section className="col-span-3">
        <div className="flex items-center gap-2 px-3">
          <Avatar
            className="cursor-pointer"
            src={admin?.avt_url}
            icon={!admin?.avt_url && <UserOutlined />}
            size={50}
          />
          <div className="flex flex-col gap-1">
            <span className="font-semibold">{admin?.username}</span>
            <span
              className="text-sm text-gray-400 flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/admin/account?type=profile")}
            >
              <ImPencil2 /> Chỉnh sửa hồ sơ
            </span>
          </div>
        </div>
        <Divider className="my-3" />
        <Tree
          className="w-full bg-transparent text-lg"
          showIcon
          onSelect={onSelect}
          expandedKeys={expandedKeys}
          selectedKeys={[selectedKeys]}
          treeData={treeData}
        />
      </section>
      <section className="col-span-9">{renderContent()}</section>
    </main>
  );
};

export default AdminAccountSetting;
