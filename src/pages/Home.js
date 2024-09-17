/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, setUser } from "../redux/userSlice";
import {
  Button,
  Card,
  Carousel,
  ColorPicker,
  ConfigProvider,
  Dropdown,
  Space,
} from "antd";
import { ColorFormat } from "antd/es/color-picker/interface";
import event1 from "../assets/event1.png";
import event2 from "../assets/event2.png";
import event3 from "../assets/event3.png";
import event4 from "../assets/event4.png";
import event5 from "../assets/event5.png";
import event6 from "../assets/event6.png";
import event7 from "../assets/event7.png";
import event8 from "../assets/event8.png";
import event9 from "../assets/event9.png";
import categoryImg1 from "../assets/category1.png";
import ProductCard from "../components/product/ProductCard";
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

const Products = [
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
  {
    thumbnail:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv2uc3o7qrcp85_tn.webp",
    name: "Quần nam Retro wash ống rộng heheheehehehe",
    price: 169.0,
    sold: 6000,
  },
];
const categories = [
  { img: categoryImg1, name: "Thời Trang Nam" },
  { img: categoryImg1, name: "Thời Trang Nam" },
  { img: categoryImg1, name: "Thời Trang Nam" },
  { img: categoryImg1, name: "Thời Trang Nam" },
  { img: categoryImg1, name: "Thời Trang Nam" },
  { img: categoryImg1, name: "Thời Trang Nam" },
  { img: categoryImg1, name: "Thời Trang Nam" },
  { img: categoryImg1, name: "Thời Trang Nam" },
  { img: categoryImg1, name: "Thời Trang Nam" },
  { img: categoryImg1, name: "Thời Trang Nam" },
  { img: categoryImg1, name: "Thời Trang Nam" },
  { img: categoryImg1, name: "Thời Trang Nam" },
  { img: categoryImg1, name: "Thời Trang Nam" },
  { img: categoryImg1, name: "Thời Trang Nam" },
  { img: categoryImg1, name: "Thời Trang Nam" },
  { img: categoryImg1, name: "Thời Trang Nam" },
  { img: categoryImg1, name: "Thời Trang Nam" },
  { img: categoryImg1, name: "Thời Trang Nam" },
  { img: categoryImg1, name: "Thời Trang Nam" },
  { img: categoryImg1, name: "Thời Trang Nam" },
  { img: categoryImg1, name: "Thời Trang Nam" },
  { img: categoryImg1, name: "Thời Trang Nam" },
  { img: categoryImg1, name: "Thời Trang Nam" },
  { img: categoryImg1, name: "Thời Trang Nam" },
  { img: categoryImg1, name: "Thời Trang Nam" },
  { img: categoryImg1, name: "Thời Trang Nam" },
  { img: categoryImg1, name: "Thời Trang Nam" },
  { img: categoryImg1, name: "Thời Trang Nam" },
  { img: categoryImg1, name: "Thời Trang Nam" },
  { img: categoryImg1, name: "Thời Trang Nam" },
  { img: categoryImg1, name: "Thời Trang Nam" },
  { img: categoryImg1, name: "Thời Trang Nam" },
  { img: categoryImg1, name: "Thời Trang Nam" },
  { img: categoryImg1, name: "Thời Trang Nam" },
  { img: categoryImg1, name: "Thời Trang Nam" },
  { img: categoryImg1, name: "Thời Trang Nam" },
  { img: categoryImg1, name: "Thời Trang Nam" },
  { img: categoryImg1, name: "Thời Trang Nam" },
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
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`;
        const res = await axios({
          method: "GET",
          url: URL,
          withCredentials: true,
        });
        dispatch(setUser(res.data.data));
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchUserDetails();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);

  return (
    <>
      <div className="w-full bg-white h-fit border-b-[1px]">
        <div className="flex lg:max-w-[1200px] lg:w-full m-auto flex-col">
          <div className="my-6 flex gap-[10px]">
            <Carousel
              className="lg:max-w-[797px] w-screen"
              arrows
              autoplay
              speed={300}
            >
              <div>
                <img
                  src="https://cf.shopee.vn/file/vn-11134258-7r98o-lyqajnu6gm8xba_xxhdpi"
                  className="rounded"
                />
              </div>
              <div>
                <img
                  src="https://cf.shopee.vn/file/sg-11134258-7rdwl-lyq71o5nyjef45_xxhdpi"
                  className="rounded"
                />
              </div>
              <div>
                <img
                  src="https://cf.shopee.vn/file/sg-11134258-7rdxy-lyq71mwzqik4b6_xxhdpi"
                  className="rounded"
                />
              </div>
              <div>
                <img
                  src="https://cf.shopee.vn/file/sg-11134258-7rdwh-lyqcftzv4yeg38_xxhdpi"
                  className="rounded"
                />
              </div>
            </Carousel>
            <div className="lg:flex flex-col gap-1 hidden">
              <a href="#">
                <img
                  src="https://cf.shopee.vn/file/sg-11134258-7rdxa-lyq96pc5o1ew00_xhdpi"
                  className="rounded"
                />
              </a>
              <a href="#">
                <img
                  src="https://cf.shopee.vn/file/sg-11134258-7rdwa-lyq90a6612nrc3_xhdpi"
                  className="rounded"
                />
              </a>
            </div>
          </div>
          <div className="flex justify-between overflow-x-auto whitespace-nowrap">
            {events.map((value, key) => {
              return (
                <a
                  key={key}
                  href="#"
                  className="flex justify-center items-center flex-col hover:transform hover:-translate-y-[1px] transition-transform lg:mx-0 mx-5"
                >
                  <img
                    src={value.img}
                    className="bg-contain bg-no-repeat size-[45px]"
                  />
                  <span className="text-center line-clamp-2 overflow-hidden whitespace-pre-line max-w-[100px] text-ellipsis text-sm mb-2">
                    {value.name}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
      <div className="max-w-[1200px] bg-white m-auto h-fit mt-5">
        <p className="py-6 px-5 text-[rgba(0,0,0,.54)] border-b-[1px] font-medium mb-0">
          DANH MỤC
        </p>
        <Carousel
          arrows
          className="category-carousel lg:max-w-[1200px] relative lg:overflow-visible overflow-hidden"
          slidesPerRow={10}
          rows={2}
          responsive={responsiveCateCarousel}
          infinite={false}
          dots={false}
        >
          {categories.map((value, key) => {
            return (
              <a className="max-w-[120px] mx-auto hover:shadow-lg" key={key}>
                <div className="flex flex-col justify-center items-center border-b-[1px] border-r-[1px]">
                  <img src={value.img} className="max-w-[84px]" />
                  <p>{value.name}</p>
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
      <div className="max-w-[1200px] m-auto ">
        <div className="grid grid-cols-12 place-items-center">
          {Products.slice(0, 24).map((value, key) => {
            return <ProductCard value={value} key={key} />;
          })}
        </div>
        <div className="flex justify-center items-center w-full ">
          <Button size="large" className="lg:max-w-[390px] w-full my-4">
            Xem Thêm
          </Button>
        </div>
      </div>
    </>
  );
};

export default Home;
