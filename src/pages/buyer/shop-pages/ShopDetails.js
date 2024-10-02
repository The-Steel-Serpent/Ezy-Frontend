import React, { lazy, Suspense, useEffect, useMemo, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import backgroundShop from "../../../assets/backgroundShop.jpg";
import axios from "axios";
import { BiChat, BiListPlus } from "react-icons/bi";
import { Button, Carousel, Menu } from "antd";
import { AiOutlineShop } from "react-icons/ai";
import { FaRegStar } from "react-icons/fa";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { FaUserAstronaut } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { tr, vi } from "date-fns/locale";
import { MdOutlineDescription } from "react-icons/md";
import { CaretRightFilled, RightOutlined } from "@ant-design/icons";
import ProductCard from "../../../components/product/ProductCard";
import { TfiMenuAlt } from "react-icons/tfi";
import { FaShopSlash } from "react-icons/fa6";

const SortBar = lazy(() => import("../../../components/sorts/SortBar"));

const ShopDetails = () => {
  const navigate = useNavigate();
  const query = new URLSearchParams(window.location.search);
  let sub_category_id = query.get("sub_category_id");
  if (!sub_category_id) {
    sub_category_id = "-1";
  }
  const { shop_username } = useParams();
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "SET_LOADING":
          return { ...state, loading: action.payload };
        case "SET_IS_FETCHED_PRODUCT": {
          return {
            ...state,
            isFetchedProduct: action.payload,
          };
        }

        case "FETCH_SHOP":
          return {
            ...state,
            shop: action.payload,
          };
        case "FETCH_SUB_CATEGORY":
          return {
            ...state,
            subCategory: action.payload,
          };
        case "FETCH_PRODUCT_BY_SUB_CATEGORY":
          return {
            ...state,
            productBySub: action.payload,
          };
        case "SET_CURRENT_PAGE":
          return {
            ...state,
            currentPage: action.payload,
          };
        case "SET_TOTAL_PAGE":
          return {
            ...state,
            totalPage: action.payload,
          };
        case "SET_FILTER":
          return {
            ...state,
            filter: {
              ...state.filter,
              ...action.payload,
            },
          };
        case "FETCH_SUGGEST_PRODUCT":
          return { ...state, suggestProduct: action.payload };
        default:
          return state;
      }
    },

    {
      shop: null,
      loading: false,
      isFetchedProduct: false,
      subCategory: [],
      currentPage: 1,
      totalPage: 0,
      suggestProduct: [],
      productBySub: [],
      filter: {
        sortBy: "pop",
      },
    }
  );
  const {
    shop,
    subCategory,
    productBySub,
    suggestProduct,
    currentPage,
    totalPage,
    filter,
    loading,
    isFetchedProduct,
  } = state;
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/shop/${shop_username}`
        );
        if (res.data.success) {
          console.log("res.data", res.data);
          dispatch({ type: "FETCH_SHOP", payload: res.data.shop });
          dispatch({
            type: "FETCH_SUB_CATEGORY",
            payload: res.data.subCategories,
          });
          dispatch({
            type: "FETCH_SUGGEST_PRODUCT",
            payload: res.data.shop.Products,
          });
        }
      } catch (error) {
        console.log("Lỗi khi fetch dữ liệu của shop: ", error);
      }
    };
    fetchShop();
  }, []);
  useEffect(() => {
    const fetchProductBySubCategory = async () => {
      dispatch({ type: "SET_IS_FETCHED_PRODUCT", payload: false });

      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/product-by-sub-category/${sub_category_id}?pageNumbers=${state.currentPage}&sortBy=${state.filter.sortBy}`
        );
        if (res.data.success) {
          console.log("res.data", res.data);
          dispatch({
            type: "FETCH_PRODUCT_BY_SUB_CATEGORY",
            payload: res.data.products,
          });
          dispatch({
            type: "SET_TOTAL_PAGE",
            payload: res.data.totalPages,
          });
        }
        dispatch({ type: "SET_IS_FETCHED_PRODUCT", payload: true });
        localStorage.setItem("isFetchedProduct", "true");
      } catch (error) {
        console.log(
          "Lỗi khi fetch dữ liệu sản phẩm theo sub category: ",
          error
        );
        dispatch({ type: "SET_IS_FETCHED_PRODUCT", payload: true });
        localStorage.setItem("isFetchedProduct", "true");
      }
    };
    fetchProductBySubCategory();
  }, [sub_category_id, currentPage, filter.sortBy]);

  useEffect(() => {
    const scrollToProductList = () => {
      if (window.location.hash === "#productList") {
        const element = document.getElementById("productList");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    };
    const timeout = setTimeout(scrollToProductList, 200);

    window.addEventListener("hashchange", scrollToProductList);
    return () => {
      window.removeEventListener("hashchange", scrollToProductList);
      clearTimeout(timeout);
    };
  }, [isFetchedProduct]);
  useEffect(() => {
    const savedIsFetchedProduct = localStorage.getItem("isFetchedProduct");
    if (savedIsFetchedProduct === "true") {
      dispatch({ type: "SET_IS_FETCHED_PRODUCT", payload: true });
    }
  }, []);

  const menuItems = useMemo(
    () => [
      {
        key: "1",
        label: (
          <a href={`/shop/${shop_username}`} className="w-[200px] text-center">
            <span className="text-sm">Dạo</span>
          </a>
        ),
        title: "Dạo",
      },
      {
        key: "2",
        label: (
          <a
            href={`?sub_category_id=-1#productList`}
            className="w-[200px] text-center"
          >
            <span className="text-sm">TẤT CẢ SẢN PHẨM</span>
          </a>
        ),
      },
      ...(Array.isArray(subCategory)
        ? subCategory.map((items) => ({
            key: items.sub_category_id,
            label: (
              <a
                href={`?sub_category_id=${items.sub_category_id}#productList`}
                className="w-[200px] text-center"
              >
                <span className="text-sm">{items.sub_category_name}</span>
              </a>
            ),
          }))
        : []), // Make sure subCategory is an array before mapping
    ],
    [subCategory]
  );

  return (
    <>
      {shop ? (
        <section>
          <div className="w-full bg-white">
            <div className="max-w-[1200px] mx-auto pt-10">
              <div className="grid grid-cols-12">
                <div className="col-span-3">
                  <div className="relative w-full bg-background-Shop bg-cover rounded bg-center  ">
                    <div className="p-4 flex w-full gap-2 inset-0  backdrop-blur-sm items-center">
                      <img
                        className="size-16 rounded-full border-[2px] border-solid"
                        src={shop?.logo_url}
                      />
                      <div className="flex flex-col gap-1">
                        <span className="text-white text-lg font-semibold">
                          {shop?.shop_name}
                        </span>
                        <Button className="border-white text-white">
                          <BiChat />
                          Chat Ngay
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-9 text-slate-700 ">
                  <section className="flex">
                    <div className="w-full px-7 flex flex-col flex-nowrap gap-2">
                      <div className="py-1 flex gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <AiOutlineShop />
                          <span>Sản Phẩm: </span>
                        </div>
                        <span className="text-primary">
                          {shop?.total_product || 0}
                        </span>
                      </div>
                      <div className="py-1 flex gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <FaRegStar />
                          <span>Đánh Giá: </span>
                        </div>
                        <span className="text-primary">
                          {shop?.total_ratings || 0}
                        </span>
                      </div>
                      <div className="py-1 flex gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <IoChatboxEllipsesOutline />
                          <span>Lượt Đánh Giá: </span>
                        </div>
                        <span className="text-primary">
                          {shop?.total_reviews || 0}
                        </span>
                      </div>
                    </div>
                    <div className="w-full px-7 flex flex-col flex-nowrap gap-2">
                      <div className="py-1 flex gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <FaUserAstronaut />
                          <span>Tham Gia: </span>
                        </div>
                        <span className="text-primary">
                          {shop?.created_at
                            ? formatDistanceToNow(new Date(shop.created_at), {
                                addSuffix: true,
                                locale: vi,
                              })
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
              <div className="w-full mt-3">
                <Menu mode="horizontal" items={menuItems} selectedKeys={"1"} />
              </div>
            </div>
          </div>
          <div className="max-w-[1200px] mx-auto py-5">
            {/**Gợi ý sản phẩm */}
            {suggestProduct.length > 0 && (
              <section className="">
                <div className="flex justify-between text-sm mt-6">
                  <span className="text-slate-600">GỢI Ý CHO BẠN</span>
                  <a
                    href={`/shop/shop_recommendations/${shop?.shop_id}`}
                    className="text-primary"
                  >
                    Xem Tất Cả <RightOutlined />
                  </a>
                </div>
                <div className="grid grid-cols-12">
                  {suggestProduct?.map((product) => {
                    return <ProductCard value={product} itemsPerRow={6} />;
                  })}
                </div>
              </section>
            )}
            {/**CarouselBanner*/}
            {shop?.CustomizeShops.length > 0 && (
              <section className="w-full flex flex-col gap-4 mt-10">
                {shop?.CustomizeShops?.map((banner) => {
                  return (
                    <div className="shop-carousel">
                      <Carousel arrows={true} infinite={true} autoplay={true}>
                        {banner?.ImgCustomizeShops?.length > 0 &&
                          banner?.ImgCustomizeShops?.map((img) => {
                            return (
                              <img
                                className="w-[1200px] object-contain"
                                src={img.img_url}
                              />
                            );
                          })}
                      </Carousel>
                    </div>
                  );
                })}
              </section>
            )}
            {/**Sản phẩm*/}
            <section id="productList" className="my-10 max-h-[1200px]">
              <div className="grid grid-cols-12 w-full">
                {/**Danh mục */}
                <div className="col-span-2">
                  <div className="w-[90%] mb-2">
                    <div className=" text-lg text-black font-bold h-[3.125rem] flex justify-start items-center gap-3 mb-[0.625rem] border-b-slate-300 border-b-[1px] border-solid">
                      <TfiMenuAlt />
                      Danh Mục
                    </div>
                    <ul
                      className={`flex flex-col gap-3 transition-all overflow-hidden duration-700`}
                    >
                      <li
                        onClick={() =>
                          navigate(`?sub_category_id=-1#productList`)
                        }
                        className={`${
                          parseInt(sub_category_id) === -1
                            ? "text-primary pl-1"
                            : "hover:text-primary text-black pl-4 "
                        }   cursor-pointer text-sm`}
                      >
                        {parseInt(sub_category_id) === -1 && (
                          <CaretRightFilled />
                        )}
                        Sản phẩm
                      </li>
                      {subCategory.map((item) => (
                        <li
                          onClick={() =>
                            navigate(
                              `?sub_category_id=${item.sub_category_id}#productList`
                            )
                          }
                          className={`${
                            item.sub_category_id === parseInt(sub_category_id)
                              ? "text-primary pl-1"
                              : "hover:text-primary text-black pl-4"
                          }   cursor-pointer text-sm`}
                        >
                          {item.sub_category_id ===
                            parseInt(sub_category_id) && <CaretRightFilled />}
                          <span>{item.sub_category_name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/**Sản phẩm */}
                <div className="col-span-10">
                  <Suspense fallback={<div>Loading...</div>}>
                    <SortBar
                      listProductByCategory={productBySub}
                      currentPage={currentPage}
                      totalPage={totalPage}
                      filter={filter}
                      onPageChange={(page) =>
                        dispatch({ type: "SET_CURRENT_PAGE", payload: page })
                      }
                      onFilterChange={(filter) => {
                        dispatch({ type: "SET_FILTER", payload: filter });
                        dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
                        console.log("filter", filter);
                      }}
                    />
                  </Suspense>
                </div>
              </div>
            </section>
          </div>
        </section>
      ) : (
        <section className="py-20 gap-2 flex flex-col justify-center items-center text-2xl text-slate-600">
          <div className="">
            <FaShopSlash size={100} />
          </div>
          <span>Không tìm thấy cửa hàng</span>
        </section>
      )}
    </>
  );
};

export default ShopDetails;
