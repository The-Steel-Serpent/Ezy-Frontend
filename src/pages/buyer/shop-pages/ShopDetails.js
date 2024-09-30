import React, { useEffect, useMemo, useReducer } from "react";
import { useParams } from "react-router-dom";
import backgroundShop from "../../../assets/backgroundShop.jpg";
import axios from "axios";
import { BiChat, BiListPlus } from "react-icons/bi";
import { Button, Menu } from "antd";
import { AiOutlineShop } from "react-icons/ai";
import { FaRegStar } from "react-icons/fa";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { FaUserAstronaut } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { MdOutlineDescription } from "react-icons/md";

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
        default:
          return state;
      }
    },

    {
      shop: null,
      subCategory: [],
    }
  );

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/shop/${shop_username}`
        );
        if (res.data.success) {
          dispatch({ type: "FETCH_SHOP", payload: res.data.shop });
          dispatch({
            type: "FETCH_SUB_CATEGORY",
            payload: res.data.subCategories,
          });
        }
      } catch (error) {
        console.log("Lỗi khi fetch dữ liệu của shop: ", error);
      }
    };
    fetchShop();
  }, []);

  const { shop, subCategory } = state;
  const menuItems = useMemo(
    () => [
      {
        key: "1",
        label: (
          <a href="#" className="w-[200px] text-center">
            <span className="text-base">Dạo</span>
          </a>
        ),
        title: "Dạo",
      },
      {
        key: "2",
        label: (
          <a href="#" className="w-[200px] text-center">
            <span className="text-base">TẤT CẢ SẢN PHẨM</span>
          </a>
        ),
      },
      ...(Array.isArray(subCategory)
        ? subCategory.map((items) => ({
            key: items.sub_category_id,
            label: (
              <a href="#" className="w-[200px] text-center">
                <span className="text-base">{items.sub_category_name}</span>
              </a>
            ),
          }))
        : []), // Make sure subCategory is an array before mapping
    ],
    [subCategory]
  );

  return (
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
          <Menu mode="horizontal" items={menuItems} />
        </div>
      </div>
    </div>
  );
};

export default ShopDetails;
