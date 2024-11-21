/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import axios from "axios";
import { motion } from "framer-motion";

import React, { lazy, Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, setUser } from "../redux/userSlice";
import { Button, Carousel, Skeleton, Spin } from "antd";
import event1 from "../assets/page-1.png";
import event2 from "../assets/page-2.png";
import event3 from "../assets/page-3.png";
import event4 from "../assets/page-4.png";

import backgroundEngaged from "../assets/engaged.png";
import categoryImg1 from "../assets/category1.png";
import SaleBanner from "../components/sale-banner/SaleBanner";

const TopSellingCategoriesSection = lazy(() =>
  import("../components/sub-categories/TopSellingCategoriesSection")
);
const FlashSalesSection = lazy(() =>
  import("../components/flash-sales/FlashSalesSection")
);

const ProductSuggestions = lazy(() =>
  import("../components/product/ProductSuggestions")
);

const events = [event1, event2, event3, event4];

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
      <Carousel
        className="max-w-[1200px] mx-auto mt-5"
        arrows
        infinite={true}
        autoplay={true}
      >
        {events.map((event, index) => (
          <img key={index} src={event} className="w-full" />
        ))}
      </Carousel>

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
      <Suspense fallback={<Skeleton.Node active={true} className="w-full" />}>
        <FlashSalesSection />
      </Suspense>

      <Suspense fallback={<Skeleton.Node active={true} className="w-full" />}>
        <TopSellingCategoriesSection />
      </Suspense>

      <div className="max-w-[1200px] bg-white m-auto h-fit mt-5">
        <div className="flex flex-col mb-1">
          <div className="py-6 px-5 text-primary border-b-[1px] font-medium mb-0 flex justify-center sticky">
            GỢI Ý HÔM NAY
          </div>
          <div className="bg-primary h-1"></div>
        </div>
      </div>
      {/***Product Carousel */}
      <Suspense fallback={<Skeleton.Node active={true} className="w-full" />}>
        <ProductSuggestions />
      </Suspense>
    </>
  );
};

export default Home;
