import React, {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import logo from "../../assets/logo_ezy.png";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { GoBook } from "react-icons/go";
import { VscBell } from "react-icons/vsc";
import {
  Divider,
  Menu,
  Button,
  theme,
  Layout,
  Dropdown,
  Space,
  message,
  Avatar,
  FloatButton,
  Popover,
} from "antd";
import { TfiWallet } from "react-icons/tfi";
import { FaUserCircle } from "react-icons/fa";
import { CiShop } from "react-icons/ci";
import { SlLogout } from "react-icons/sl";
import { AiOutlineProfile } from "react-icons/ai";
import { logoutShop, setShop } from "../../redux/shopSlice";
import { logout, setUser, setToken } from "../../redux/userSlice";

import "../../styles/seller.css";

import {
  AppstoreOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  checkSession,
  startTokenRefreshListener,
} from "../../firebase/AuthenticationFirebase";
import { connectSocket, disconnectSocket } from "../../socket/socketActions";
import { GrSystem } from "react-icons/gr";
import SupportChatbox from "../../components/support-chatbox/SupportChatbox";
import { setSupportMessageState } from "../../redux/supportMessageSlice";
import NotificationPopover from "../../components/notifications/NotificationPopover";
import { authFirebase, db } from "../../firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import toast from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";
const ChatBox = lazy(() => import("../../components/chatbox/ChatBox"));

const { Header, Content, Sider } = Layout;
const items = [
  {
    key: "sub1",
    label: "Quản Lý Đơn Hàng",
    icon: <MailOutlined />,
    children: [
      {
        key: "/seller/order/shop-orders?status-id=-1",
        label: "Tất cả",
      },
      {
        key: "/seller/order/orders-return",
        label: "Trả hàng / Hoàn tiền",
      },
      {
        key: "/seller/order/orders-cancel",
        label: "Hủy đơn",
      },
    ],
  },
  {
    key: "sub2",
    label: "Quản Lý Sản Phẩm",
    icon: <AppstoreOutlined />,
    children: [
      {
        key: "/seller/product-management/all",
        label: "Tất cả sản phẩm",
      },
      {
        key: "/seller/product-management/add-product",
        label: "Thêm sản phẩm",
      },
    ],
  },
  {
    key: "sub3",
    label: "Tài Chính",
    icon: <TfiWallet />,
    children: [
      {
        key: "/seller/statistic/sales-revenue",
        label: "Doanh thu",
      },
      {
        key: "/seller/wallet/shop-wallet",
        label: "Ví Ezy",
      },
      {
        key: "/seller/account",
        label: "Mật khẩu cấp 2",
      },
    ],
  },
];

const items_info = [
  {
    key: "profile_shop",
    label: "Hồ sơ Shop",
    icon: <AiOutlineProfile size={20} className="mr-3" />,
  },
  {
    key: "decor_shop",
    label: "Trang trí Shop",
    icon: <CiShop size={20} className="mr-3" />,
  },
  {
    key: "logout",
    label: "Đăng xuất",
    icon: <SlLogout size={18} className="mr-3" />,
  },
];

const initialState = () => {
  return {
    user: {
      user_id: "",
      username: "",
      full_name: "",
      email: "",
      phone_number: "",
      setup: 0,
      avt_url: "",
    },
    authenticate: false,
  };
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_AUTHENTICATE":
      return { ...state, authenticate: action.payload };
    default:
      return state;
  }
};

const SellerAuthLayout = ({ children }) => {
  document.title = "Ezy - Seller";
  const [current, setCurrent] = useState("1");
  const [state, dispatchMain] = useReducer(reducer, initialState);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const location = useLocation();
  const navigate = useNavigate();
  const supportMessageState = useSelector((state) => state.supportMessage);

  const handleNavigate = (e) => {
    // console.log('click ', e.key);
    setCurrent(e.key);
    if (e.key) navigate(e.key);
  };

  const setUpNavigate = () => {
    if (state.authenticate) {
      if (state.user.setup === 0) navigate("/seller/seller-setup");
    }
  };

  const navigateHome = () => {
    navigate("/seller");
    setUpNavigate();
  };

  const dispatch = useDispatch();
  const dispatchShop = useDispatch();
  const user = useSelector((state) => state.user);
  const shop = useSelector((state) => state.shop);
  const token = localStorage.getItem("token");
  //
  const logOut = useCallback(async () => {
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

      if (res.data.success) {
        dispatch(logout());
        dispatch(logoutShop());
        localStorage.clear();
      }
    } catch (error) {
      if (error.response.data.code === "auth/id-token-expired") {
        message.error("Phiên Đăng nhập đã hết hạn");
      }
    }
  }, [dispatch]);

  const handleDropDownProfileClick = (e) => {
    console.log("key", e.key);
    if (e.key == "logout") {
      logOut();
      message.success("Đăng xuất thành công");
      navigate("/seller/login");
    } else if (e.key == "profile_shop") {
      navigate("/seller/seller-edit-profile");
      setUpNavigate();
    } else if (e.key == "decor_shop") {
      navigate("/seller/customize-shop");
    }
  };

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  useEffect(() => {
    // update window width
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    // listen event when window width change
    window.addEventListener("resize", handleResize);
    // Cleanup when component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setCollapsed(false);
  }, [windowWidth]);

  useEffect(() => {
    // console.log("Token: ", token);
    // console.log("User: ", user);
    // console.log("Shop: ", shop);

    const fetchUserData = async () => {
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/api/fetch_user_data`;
        const res = await axios.post(
          url,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        if (res.status === 200) {
          const user = res.data.user;
          if (user.role_id === 2) {
            dispatch(
              setUser({
                user_id: user.user_id,
                username: user.username,
                full_name: user.full_name,
                email: user.email,
                phone_number: user.phone_number,
                security_password: user.security_password,
                gender: user.gender,
                dob: user.dob,
                avt_url: user.avt_url,
                role_id: user.role_id,
                setup: user.setup,
                isVerified: user.isVerified,
                is_banned: user.is_banned,
              })
            );
            dispatchMain({ type: "SET_USER", payload: user });
            dispatchMain({ type: "SET_AUTHENTICATE", payload: true });
            dispatch(setToken(token));
          } else {
            message.error("Tài khoản của bạn không phải là tài khoản cửa hàng");
            await logOut();
          }
        } else {
          console.log("Lỗi khi Fetch dữ liệu người dùng: ", res);
        }
      } catch (error) {
        console.log(
          "Lỗi khi Fetch dữ liệu người dùng: ",
          error.response.status
        );
        switch (error.response.status) {
          case 500:
            message.error("Phiên Đăng nhập đã hết hạn");
            navigate("/seller/login");
            break;
          default:
            break;
        }
        console.log("Lỗi khi Fetch dữ liệu người dùng: ", error);
      }
    };
    if (token && !user?.user_id) {
      fetchUserData();
      console.log("Fetch dữ liệu người dùng thành", user);
    } else {
      console.log("Token không tồn tại hoặc đã có dữ liệu");
      if (user.user_id == "") {
        navigate("/seller/login");
      }
    }
  }, [token]);

  useEffect(() => {
    startTokenRefreshListener();
  }, []);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/api/get-shop`;
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
          params: { user_id: user.user_id },
          withCredentials: true,
        });

        if (res.status === 200 && res.data.success) {
          const shop = res.data.data;
          console.log("Dữ liệu Shop: ", shop);
          dispatchShop(setShop(shop));
        } else {
          console.log("Lỗi khi Fetch dữ liệu Shop: ", res);
        }
      } catch (error) {
        console.log("Lỗi khi Fetch dữ liệu Shop: ", error);
      }
    };

    if (state.authenticate) {
      if (state.user.setup === 0) {
        navigate("/seller/seller-setup");
      } else {
        fetchShopData();
      }
    }
  }, [state.authenticate]);
  useEffect(() => {
    if (user?.user_id) {
      dispatch(connectSocket(user.user_id));

      return () => {
        dispatch(disconnectSocket());
      };
    }
  }, [user, dispatch]);

  useEffect(() => {
    const handleCheckSession = async (userId) => {
      const isSessionValid = await checkSession(userId);

      if (isSessionValid) {
        console.log("Phiên hợp lệ");
        return true;
      } else {
        console.log("Phiên không hợp lệ, người dùng đã bị đăng xuất.");
        authFirebase.signOut();
        await logOut();
        return false;
      }
    };
    if (user.user_id !== "") {
      handleCheckSession(user.user_id);
    }
  }, [logOut, user.user_id]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(authFirebase, (user) => {
      if (user) {
        let firstCheck = true; // Cờ để bỏ qua kiểm tra đầu tiên
        const unsubscribeSnapshot = onSnapshot(
          doc(db, "users", user.uid),
          async (docSnapshot) => {
            const data = docSnapshot.data();
            const localSessionToken = localStorage.getItem("sessionToken");

            // Bỏ qua kiểm tra đầu tiên sau khi đăng nhập
            if (firstCheck) {
              firstCheck = false;
              return;
            }

            // Kiểm tra nếu token không khớp, thực hiện đăng xuất
            if (data?.sessionToken !== localSessionToken) {
              toast.error(
                "Phiên của bạn đã bị đăng xuất do đăng nhập từ thiết bị khác."
              );
              authFirebase.signOut();
              await logOut();
              localStorage.removeItem("sessionToken");
              window.location.reload();
            }
          }
        );

        return () => unsubscribeSnapshot();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const isSellerSetupPath = location.pathname === "/seller/seller-setup";

  return (
    <>
      <Layout>
        <header className="bg-primary w-full h-[60px] flex justify-between items-center custom-header sticky-header">
          <div className="flex px-4 py-2 items-center gap-2">
            <img
              src={logo}
              alt="logo"
              width={100}
              className="cursor-pointer"
              onClick={navigateHome}
            />
            <div className="text-lg mt-2 text-white">
              <a href="/seller" className="hover:text-slate-200">
                Kênh người bán
              </a>
            </div>
          </div>
          <div className="flex mx-10 items-center h-full text-lg">
            <div className="py-4 px-3 text-white text-lg hidden lg:block">
              <NotificationPopover />
            </div>
            <Divider type="vertical" variant="dotted" style={{ height: 30 }} />
            <div className="flex h-full items-center text-slate-600 gap-3 hover:bg-[#8ad3e5] py-4">
              <Dropdown
                menu={{
                  items: items_info,
                  onClick: handleDropDownProfileClick,
                }}
              >
                <a onClick={(e) => e.preventDefault()}>
                  <Space className="bg-transparent">
                    {shop.logo_url != "" ? (
                      <Avatar src={shop.logo_url} size={20} />
                    ) : (
                      <Avatar
                        src={state?.user?.avt_url}
                        size={20}
                        icon={<FaUserCircle />}
                      />
                    )}
                    <span className="text-white">
                      {shop.shop_name != ""
                        ? shop.shop_name
                        : state?.user?.email}
                    </span>
                    <DownOutlined size={20} className="text-white" />
                  </Space>
                </a>
              </Dropdown>
            </div>
          </div>
        </header>
        <Layout className="h-full">
          {!isSellerSetupPath && (
            <Sider
              trigger={null}
              collapsible
              collapsed={collapsed}
              className="bg-white shadow-xl h-screen overflow-y-auto"
            >
              <div className="demo-logo-vertical" />
              <Menu
                defaultOpenKeys={["sub1", "sub2", "sub3", "sub4"]}
                mode="inline"
                theme="light"
                items={items}
                onClick={handleNavigate}
                className="custom-menu text-slate-500 font-[400] lg:w-52"
              />
            </Sider>
          )}
          <Layout className="layout-full-height">
            <Header
              style={{
                padding: 0,
                background: colorBgContainer,
              }}
              className="lg:hidden w-fit bg-opacity-100 rounded"
            >
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                }}
              />
            </Header>
            <Content className="min-h-72 mx-8 mt-3">{children}</Content>
          </Layout>
        </Layout>
      </Layout>
      <Suspense>
        <FloatButton.BackTop className="go-first" />
        <Popover trigger="click" open={false} placement="left">
          <FloatButton
            icon={<GrSystem className="text-blue-500" />}
            tooltip="Tin nhắn hệ thống"
          />
        </Popover>
        <Popover
          trigger="click"
          content={<SupportChatbox />}
          open={supportMessageState.openSupportChatbox}
          onOpenChange={(newOpen) => {
            console.log("newOpen", newOpen);
            dispatch(
              setSupportMessageState({
                openSupportChatbox: newOpen,
              })
            );
          }}
          placement="leftTop"
        >
          <FloatButton
            icon={<CustomerServiceOutlined className="text-blue-500" />}
            tooltip="Hỗ trợ khách hàng"
          />
        </Popover>
        <ChatBox />
      </Suspense>
    </>
  );
};

export default SellerAuthLayout;
