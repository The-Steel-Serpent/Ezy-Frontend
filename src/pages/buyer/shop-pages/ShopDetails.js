import React, { lazy, Suspense, useEffect, useMemo, useReducer } from "react";
import { useParams } from "react-router-dom";
import backgroundShop from "../../../assets/backgroundShop.jpg";
import axios from "axios";
import { BiChat, BiListPlus } from "react-icons/bi";
import { Button, Carousel, Menu } from "antd";
import { AiOutlineShop } from "react-icons/ai";
import { FaRegStar } from "react-icons/fa";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { FaUserAstronaut } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { MdOutlineDescription } from "react-icons/md";
import { RightOutlined } from "@ant-design/icons";
import ProductCard from "../../../components/product/ProductCard";
import { TfiMenuAlt } from "react-icons/tfi";
const SortBar = lazy(() => import("../../../components/sorts/SortBar"));

const ShopDetails = () => {
  const { shop_username } = useParams();
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
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
        case "FETCH_SUGGEST_PRODUCT":
          return { ...state, suggestProduct: action.payload };
        default:
          return state;
      }
    },

    {
      shop: null,
      subCategory: [],
      suggestProduct: [],
    }
  );

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

  const { shop, subCategory, suggestProduct } = state;
  const menuItems = useMemo(
    () => [
      {
        key: "1",
        label: (
          <a href="#" className="w-[200px] text-center">
            <span className="text-sm">Dạo</span>
          </a>
        ),
        title: "Dạo",
      },
      {
        key: "2",
        label: (
          <a href="#productList" className="w-[200px] text-center">
            <span className="text-sm">TẤT CẢ SẢN PHẨM</span>
          </a>
        ),
      },
      ...(Array.isArray(subCategory)
        ? subCategory.map((items) => ({
            key: items.sub_category_id,
            label: (
              <a href="#" className="w-[200px] text-center">
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
        {shop?.CustomizeShop != null && (
          <section className="w-full  mt-10">
            <Carousel arrows={true} infinite={false}>
              {shop?.CustomizeShop?.img_carousel_1 && (
                <div>
                  <img
                    className="h-full"
                    src={shop?.CustomizeShop?.img_carousel_1}
                  />
                </div>
              )}
              {shop?.CustomizeShop?.img_carousel_2 && (
                <div>
                  <img
                    className="h-full"
                    src={shop?.CustomizeShop?.img_carousel_2}
                  />
                </div>
              )}
              {shop?.CustomizeShop?.img_carousel_3 && (
                <div>
                  <img
                    className="h-full"
                    src={shop?.CustomizeShop?.img_carousel_3}
                  />
                </div>
              )}
            </Carousel>
          </section>
        )}
        {/**Sản phẩm*/}
        <section id="productList" className="mt-10">
          <div className="grid grid-cols-12 w-full">
            <div className="col-span-2">
              <div className="w-[90%] mb-2">
                <div className=" text-lg text-black font-bold h-[3.125rem] flex justify-start items-center gap-3 mb-[0.625rem] border-b-slate-300 border-b-[1px] border-solid">
                  <TfiMenuAlt />
                  Danh Mục
                </div>
                <ul
                  className={`flex flex-col gap-3 transition-all overflow-hidden duration-700`}
                >
                  {subCategory.map((item) => (
                    <li
                      key={item.sub_category_id}
                      className="text-slate-500 text-base"
                    >
                      <a href="#">{item.sub_category_name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-span-10">
              <Suspense fallback={<div>Loading...</div>}>
                <SortBar />
              </Suspense>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ShopDetails;
