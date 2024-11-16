/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import {
  React,
  memo,
  useEffect,
  useState,
  useCallback,
  useMemo,
  lazy,
  Suspense,
  useReducer,
} from "react";
import withSuspense from "../hooks/HOC/withSuspense";
import { IoLogoFacebook } from "react-icons/io5";
import { AiFillInstagram } from "react-icons/ai";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { FaAngleDown } from "react-icons/fa6";
import { TfiWorld } from "react-icons/tfi";
import WhitePhoto from "../assets/logo_ezy.png";
import { IoIosSearch } from "react-icons/io";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { useSelector } from "react-redux";
import AvatarWithPopover from "./AvatarWithPopover";
import {
  Button,
  Dropdown,
  FloatButton,
  Input,
  Popover,
  Skeleton,
  Space,
  Typography,
} from "antd";
import { AiTwotoneShop } from "react-icons/ai";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { el } from "date-fns/locale";
import { CustomerServiceOutlined, DownOutlined } from "@ant-design/icons";
import { GrSystem } from "react-icons/gr";

const CartComponent = lazy(() => import("./cart/CartComponent"));
// import FullLogo from "./FullLogo";
const ChatBox = lazy(() => import("./chatbox/ChatBox"));

const PrimaryHeader = () => {
  const user = useSelector((state) => state?.user);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { cat_id, shop_username } = useParams();
  const keyword = queryParams.get("keyword");
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "SET_SEARCH":
          return { ...state, search: action.payload };
        case "SET_CURRENT_CATEGORY": {
          return { ...state, currentCategory: action.payload };
        }
        case "SET_SELECTED_DROPDOWN":
          return { ...state, selectedDropdown: action.payload };
        case "SET_SEARCH_ITEM":
          return { ...state, searchItem: action.payload };
        case "SET_IS_FOCUSED":
          return { ...state, isFocused: action.payload };
        default:
          return state;
      }
    },
    {
      search: "",
      currentCategory: null,
      searchItem: [],
      isFocused: false,
      selectedDropdown: {
        key: "1",
        label: "Trong Ezy",
      },
    }
  );
  const { search, searchItem, isFocused, currentCategory, selectedDropdown } =
    state;

  const catIdExists =
    queryParams.has("cat_id") && queryParams.get("cat_id") !== "";

  const shopUsernameExists =
    queryParams.has("shop_username") && queryParams.get("shop_username") !== "";

  const catID = cat_id || (catIdExists && queryParams.get("cat_id"));
  const shopUsername = shop_username || queryParams.get("shop_username");

  const shouldShowDropdown =
    currentPath.startsWith("/categories") ||
    currentPath.startsWith("/shop") ||
    catIdExists ||
    shopUsernameExists;

  let dropdownItems = [
    {
      key: "1",
      label: "Trong Ezy",
    },
  ];

  if (
    currentPath.startsWith("/categories") ||
    (catIdExists && !shopUsernameExists)
  ) {
    dropdownItems.push({
      key: "2",
      label: "Trong " + currentCategory?.category_name,
    });
  } else if (
    currentPath.startsWith("/shop") ||
    (!catIdExists && shopUsernameExists)
  ) {
    dropdownItems.push({
      key: "2",
      label: "Trong Shop này",
    });
  }

  //Side Effect

  useEffect(() => {
    const fetchSuggestProductName = async () => {
      try {
        const url = `${
          process.env.REACT_APP_BACKEND_URL
        }/api/suggest-products-name?search=${search}&cat_id=${
          catID ? catID : ""
        }&shop_username=${shopUsername ? shopUsername : ""}`;
        const res = await axios.get(url);
        console.log("res", res.data);
        if (res.data.success) {
          dispatch({ type: "SET_SEARCH_ITEM", payload: res.data.products });
        }
      } catch (error) {
        console.log("Lỗi khi fetch gợi ý tên sản phẩm", error);
      }
    };
    if (search.length > 0 && isFocused) {
      fetchSuggestProductName();
    }
  }, [search, isFocused]);

  useEffect(() => {
    if (keyword) {
      dispatch({ type: "SET_SEARCH", payload: keyword });
    }
  }, [keyword]);

  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/api/categories_name/${
          cat_id || (catIdExists && queryParams.get("cat_id"))
        }`;
        const res = await axios.get(url);
        console.log("res", res.data);
        if (res.data.success) {
          dispatch({
            type: "SET_CURRENT_CATEGORY",
            payload: res.data.categories[0],
          });
        }
      } catch (error) {
        console.log("Lỗi khi fetch tên danh mục", error);
      }
    };
    if (cat_id != null || catIdExists) {
      fetchCategoryName();
      dispatch({
        type: "SET_SELECTED_DROPDOWN",
        payload: dropdownItems.find((item) => item.key === "2"),
      });
    } else if (shop_username != null || shopUsernameExists) {
      dispatch({
        type: "SET_SELECTED_DROPDOWN",
        payload: dropdownItems.find((item) => item.key === "2"),
      });
    }
  }, [cat_id, shop_username]);
  //Handle Function
  const handleOnSelectDropdownSearch = useCallback(
    ({ key }) => {
      dispatch({
        type: "SET_SELECTED_DROPDOWN",
        payload: dropdownItems.find((item) => item.key === key),
      });
    },
    [dispatch, selectedDropdown]
  );

  const handleOnSearch = useCallback(
    (e) => {
      dispatch({ type: "SET_SEARCH", payload: e.target.value });
    },
    [dispatch, search]
  );

  const handleOnSubmitSearch = useCallback(
    (e) => {
      e.preventDefault();
      if (search === "") {
        if (selectedDropdown?.key === "1") {
          window.location.href = "/categories/1";
        } else if (selectedDropdown?.key === "2") {
          e.preventDefault();
        }
      } else {
        if (selectedDropdown?.key === "1") {
          window.location.href = `/search?keyword=${search}`;
        } else {
          window.location.href = `/search?keyword=${search}&cat_id=${
            catID ? catID : ""
          }&shop_username=${shopUsername ? shopUsername : ""}`;
        }
      }
    },
    [search, selectedDropdown]
  );
  const placeholderText = useMemo(() => {
    if (selectedDropdown?.key === "1") {
      return "Bạn muốn tìm gì đó có Ezy lo...";
    } else if ((catIdExists || cat_id) && !shopUsernameExists) {
      return `Tìm trong ${currentCategory?.category_name}`;
    } else if (shopUsernameExists) {
      return "Tìm trong Shop này";
    } else {
      return "Tìm kiếm";
    }
  }, [
    selectedDropdown,
    catIdExists,
    shopUsernameExists,
    currentCategory,
    cat_id,
  ]);

  return (
    <>
      <header className="w-full h-fit bg-custom-gradient pt-1 sticky top-0 z-[100] left-0 right-0 shadow">
        <div className="text-white text-sm max-w-[1200px] hidden lg:flex m-auto h-[34px]">
          <ul className="flex ">
            <li className="p-1 nav-link nav-link-hoverable">
              <a href="/seller/login">Kênh người bán</a>
            </li>
            <li className="p-1 nav-link nav-link-hoverable">
              <a href="#" className="">
                Tải ứng dụng
              </a>
            </li>
            <li className="p-1">
              <div className="flex w-fit">
                <p className="mr-1">Kết nối </p>
                <a href="#" className="px-[3px] py-[2px] nav-link-hoverable">
                  <IoLogoFacebook size={19} />
                </a>
                <a className="px-[3px] py-[2px] nav-link-hoverable">
                  <AiFillInstagram size={19} />
                </a>
              </div>
            </li>
          </ul>
          <div className="flex-1"></div>
          <ul className="flex">
            <li className="p-1 mr-1">
              <a href="#" className="flex items-center nav-link-hoverable">
                <IoMdNotificationsOutline size={21} className="mr-1" /> Thông
                báo
              </a>
            </li>
            <li className="p-1 mr-1">
              <a href="#" className="flex items-center nav-link-hoverable">
                <AiOutlineQuestionCircle size={21} className="mr-1" /> Hỗ Trợ
              </a>
            </li>

            <li className="p-1 flex gap-2 ">
              {!user.user_id && (
                <>
                  <a href="/buyer/register" className="nav-link-hoverable">
                    Đăng ký
                  </a>
                  <div className="navbar__link-separator nav-link-hoverable"></div>
                  <a href="/buyer/login" className="divider nav-link-hoverable">
                    Đăng nhập
                  </a>
                </>
              )}
              {user.user_id && (
                <AvatarWithPopover
                  name={user.username}
                  img={user.avt_url}
                  size={23}
                />
              )}
            </li>
          </ul>
        </div>
        <div className="grid grid-cols-12 m-auto max-w-[1200px] pt-4 items-center">
          <a
            href="/"
            className="lg:col-span-2 col-span-full flex justify-center items-center lg:block mb-5 cursor-pointer"
          >
            <img src={WhitePhoto} className="pr-[30px]" />
            {/* <FullLogo className="fill-white" /> */}
          </a>
          <div className="col-span-8 ml-2 lg:ml-0 items-center">
            <form
              onSubmit={handleOnSubmitSearch}
              className="bg-white rounded flex p-[2px] lg:flex-row flex-row-reverse"
            >
              <div className="w-full relative">
                <Input
                  type="text"
                  className="p-2 border-none border-r-2  text-sm rounded  focus:after:border lg:mr-1 lg:ml-0 ml-1 text-ellipsis line-clamp-1"
                  placeholder={placeholderText}
                  value={search}
                  onChange={(e) => handleOnSearch(e)}
                  onFocus={() => {
                    dispatch({ type: "SET_IS_FOCUSED", payload: true });
                  }}
                  onBlur={() => {
                    setTimeout(
                      () =>
                        dispatch({ type: "SET_IS_FOCUSED", payload: false }),
                      200
                    );
                  }}
                />
                <div
                  id="search-content"
                  className={`${
                    isFocused ? "flex" : "hidden"
                  } z-[99999] rounded  h-fit flex-col absolute bg-white w-full gap-2 p-2 `}
                >
                  {search && selectedDropdown?.key === "1" && (
                    <a
                      href={`/search_shop?keyword=${search}`}
                      className="flex gap-2"
                    >
                      <AiTwotoneShop className="text-primary" size={20} /> Tìm
                      Shop "{search}"
                    </a>
                  )}
                  {searchItem.length > 0 &&
                    searchItem.map((value, key) => {
                      return (
                        <a
                          href={
                            selectedDropdown?.key === "1"
                              ? `/search?keyword=${value?.product_name}`
                              : `/search?keyword=${
                                  value?.product_name
                                }&cat_id=${catID ? catID : ""}&shop_username=${
                                  shopUsername ? shopUsername : ""
                                }`
                          }
                          className="block cursor-pointer text-slate-600 text-sm hover:text-white hover:bg-primary"
                        >
                          {value.product_name}
                        </a>
                      );
                    })}
                </div>
              </div>
              {shouldShowDropdown && (
                <Dropdown
                  menu={{
                    items: dropdownItems,
                    selectable: true,
                    defaultSelectedKeys: [selectedDropdown?.key],
                    onClick: handleOnSelectDropdownSearch,
                  }}
                >
                  <Typography.Link className="flex items-center px-2 border-l-2">
                    <div className="flex  gap-3 text-slate-500">
                      <span className="line-clamp-1 text-ellipsis w-[90px]">
                        {selectedDropdown?.label}
                      </span>

                      <DownOutlined className="text-slate-700" />
                    </div>
                  </Typography.Link>
                </Dropdown>
              )}

              <button
                onSubmit={handleOnSubmitSearch}
                className="lg:bg-custom-gradient lg:text-white w-16 rounded flex justify-center items-center text-slate-400"
              >
                <span>
                  <IoIosSearch size={20} />
                </span>
              </button>
            </form>
          </div>
          <div className="col-span-2 text-white flex justify-center items-center">
            <Suspense
              fallback={
                <div className="w-fit">
                  <Skeleton avatar className="size-[35px]" />
                </div>
              }
            >
              <CartComponent />
            </Suspense>
          </div>
          <div className="col-span-2 lg:hidden flex text-white text-sm items-center">
            {!user.user_id && (
              <a href="/buyer/login" className="divider nav-link-hoverable">
                Đăng nhập
              </a>
            )}
            {user.user_id && (
              <AvatarWithPopover img={user.profile_pic} size={30} />
            )}
          </div>
        </div>
      </header>
      <Suspense>
        <FloatButton.Group className="bottom-16">
          <FloatButton.BackTop className="go-first" />
          <Popover
            content={<div className="w-[400px] h-[300px] z-[999999999]"></div>}
            trigger="click"
            open={false}
            placement="left"
          >
            <FloatButton
              icon={<GrSystem className="text-blue-500" />}
              tooltip="Tin nhắn hệ thống"
            />
          </Popover>
          <ChatBox />

          <FloatButton
            icon={<CustomerServiceOutlined className="text-blue-500" />}
            tooltip="Hỗ trợ khách hàng"
          />
        </FloatButton.Group>
      </Suspense>
    </>
  );
};

export default memo(PrimaryHeader);
