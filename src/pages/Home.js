/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import axios from "axios";
import { motion } from "framer-motion";

import React, { lazy, Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, setUser } from "../redux/userSlice";
import { Button, Carousel, Spin } from "antd";
import event1 from "../assets/event1.png";
import event2 from "../assets/event2.png";
import event3 from "../assets/event3.png";
import event4 from "../assets/event4.png";
import event5 from "../assets/event5.png";
import event6 from "../assets/event6.png";
import event7 from "../assets/event7.png";
import event8 from "../assets/event8.png";
import event9 from "../assets/event9.png";
import backgroundEngaged from "../assets/engaged.png";
import categoryImg1 from "../assets/category1.png";
const ProductSuggestions = lazy(() =>
  import("../components/product/ProductSuggestions")
);

const events = [
  { img: event1, name: "Vourcher Giảm Đến 1 Triệu" },
  { img: event2, name: "Miễn Phí Ship - Có Shopee" },
  { img: event3, name: "Shopee Choice Mua 3 Giảm 50%" },
  { img: event4, name: "Khung Giờ Săn Sale" },
  { img: event5, name: "Mã Giảm Giá" },
  { img: event6, name: "Shopee Siêu Rẻ" },
  { img: event7, name: "Shopee Style Voucher 40%" },
  { img: event8, name: "Quốc Tế Siêu Trợ Giá" },
  { img: event9, name: "Nạp Thẻ, Dịch Vụ & Vé Máy Bay" },
];

const responsiveCateCarousel = [
  {
    breakpoint: 767,
    settings: {
      slidesPerRow: 4,
    },
  },
  {
    breakpoint: 1024,
    settings: {
      slidesPerRow: 7,
    },
  },
];

const Home = () => {
  const [categories, setCategories] = useState([]);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // useEffect(() => {
  //   const fetchUserDetails = async () => {
  //     try {
  //       const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`;
  //       const res = await axios({
  //         method: "GET",
  //         url: URL,
  //         withCredentials: true,
  //       });
  //       dispatch(setUser(res.data.data));
  //     } catch (error) {
  //       console.log("Error", error);
  //     }
  //   };
  //   fetchUserDetails();
  // }, []);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/categories`;
        const res = await axios({
          method: "GET",
          url: URL,
          withCredentials: true,
        });
        setCategories(res.data.categories);
      } catch (error) {
        console.log("Khoong the lay du lieu", error);
      }
    };
    fetchCategories();
  }, []);
  return (
    <>
      <div className="w-full h-fit border-b-[1px]">
        <div className="relative">
          <img
            src={backgroundEngaged}
            className="object-cover w-full h-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-full h-[40%] absolute bottom-0 flex flex-col items-center justify-center gap-5 pb-10  "
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-center text-[32px] text-white uppercase font-garibato italic"
            >
              Mua sắm cực kỳ đơn giản, dễ như cách bạn vắt một quả chanh
            </motion.div>
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <Button
                onClick={() => navigate("/categories/1")}
                className=" bg-[#b29d7b] border-[#b29d7b] text-white rounded-full h-12 w-36 hover:opacity-90"
              >
                MUA SẮM NGAY
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1200px] bg-white m-auto h-fit mt-5">
        <p className="py-6 px-5 text-[rgba(0,0,0,.54)] border-b-[1px] font-medium mb-0">
          DANH MỤC
        </p>
        <Carousel
          arrows
          className="animation-pulse category-carousel lg:max-w-[1200px] relative lg:overflow-visible overflow-hidden"
          slidesPerRow={10}
          rows={2}
          responsive={responsiveCateCarousel}
          infinite={false}
          dots={false}
        >
          {categories.map((value, key) => {
            return (
              <a
                className="max-w-[120px] mx-auto hover:shadow-lg"
                key={value?.category_id}
                href={`/categories/${value?.category_id}`}
              >
                <div className="flex flex-col justify-center items-center border-b-[1px] border-r-[1px] p-2">
                  <img
                    loading="lazy"
                    src={value?.thumbnail}
                    className="max-w-[83px]"
                  />
                  <p className="line-clamp-2 text-ellipsis  h-10 mb-[10px] text-sm">
                    {value?.category_name}
                  </p>
                </div>
              </a>
            );
          })}
        </Carousel>
      </div>
      <div className="max-w-[1200px] bg-white m-auto h-fit mt-5">
        <div className="flex flex-col mb-1">
          <div className="py-6 px-5 text-primary border-b-[1px] font-medium mb-0 flex justify-center sticky">
            GỢI Ý HÔM NAY
          </div>
          <div className="bg-primary h-1"></div>
        </div>
      </div>
      {/***Product Carousel */}
      <Suspense
        fallback={
          <div className="w-full flex justify-center items-center">
            <Spin size="large" />
          </div>
        }
      >
        <ProductSuggestions />
      </Suspense>
    </>
  );
};

export default Home;
