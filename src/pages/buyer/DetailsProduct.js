import { Breadcrumb, Carousel, Divider } from "antd";
import React, { useEffect, useState } from "react";
import ReactImageGallery from "react-image-gallery";
import ReactStars from "react-rating-star-with-type";
import formatNumber from "../../helpers/formatNumber";
const details = {
  id: 1,
  category_id: 1,
  category_name: "Thời Trang Nam",
  sub_category_id: 1,
  sub_category_name: "Quần jeans",
  total_reviews: 7800,
  total_rating: 5,
  total_sold: 1000,
  product_name:
    "Quần Jean Nam Ống Rộng Dáng Suông Chất Vải Dày Dặn Màu Đen Trầm SMOKE V.1",
  product_imgs: [
    {
      product_imgs_id: 1,
      product_img:
        "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ln2id781kgfn25@resize_w82_nl.webp",
    },
    {
      product_imgs_id: 2,
      product_img:
        "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ln2id781kgfn25@resize_w82_nl.webp",
    },
    {
      product_imgs_id: 3,
      product_img:
        "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ln2id781kgfn25@resize_w82_nl.webp",
    },
    {
      product_imgs_id: 4,
      product_img:
        "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ln2id781kgfn25@resize_w164_nl.webp",
    },
    {
      product_imgs_id: 5,
      product_img:
        "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ln2id781kgfn25@resize_w164_nl.webp",
    },
    {
      product_imgs_id: 6,
      product_img:
        "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ln2id781kgfn25@resize_w164_nl.webp",
    },
  ],
  product_varients: [
    {
      product_varients_id: 1,
      product_varients_name: "Màu Đen Trầm",
      thumbnail:
        "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lvwjstcn2vh503",
    },
    {
      product_varients_id: 2,
      product_varients_name: "Màu Đen Trầm",
      thumbnail:
        "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lvwjstcn2vh503",
    },
    {
      product_varients_id: 3,
      product_varients_name: "Màu Đen Trầm",
      thumbnail:
        "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lvwjstcn2vh503",
    },
    {
      product_varients_id: 4,
      product_varients_name: "Màu Đen Trầm",
      thumbnail:
        "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lvwjstcn2vh503",
    },
  ],
};

const images = details.product_imgs.map((img) => ({
  original:
    "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lvwjstcn2vh503",
  thumbnail:
    "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lvwjstcn2vh503",
}));
const DetailsProduct = () => {
  const [currentThumbnail, setCurrentThumbnail] = useState("");
  useEffect(() => {
    setCurrentThumbnail(details.product_varients[0].thumbnail);
  }, [currentThumbnail]);
  return (
    <>
      <div className="max-w-[1200px] mx-auto">
        <div className=" flex justify-center lg:justify-start my-4">
          <Breadcrumb
            items={[
              {
                title: (
                  <a className="text-primary" href="/">
                    Ezy
                  </a>
                ),
              },
              {
                title: <a href="/">{details.category_name}</a>,
              },
              {
                title: <a href="/">{details.sub_category_name}</a>,
              },
              {
                title: <span>{details.product_name}</span>,
              },
            ]}
          />
        </div>
        <div className=" bg-white grid grid-flow-col lg:grid-cols-12 rounded">
          <section className="col-span-5 p-[15px]">
            <ReactImageGallery
              lazyLoad={true}
              items={images}
              showThumbnails={true}
            />
          </section>
          <section className="col-span-7 pl-5 pt-5 pr-9">
            {/***Tên sản phẩm */}
            <span className="text-xl font-semibold">
              {details.product_name}
            </span>
            {/***Đánh giá sản phẩm*/}
            <div className="w-full mt-[10px]">
              <div className="flex gap-1 items-center">
                <span className="text-base text-primary border-b-2 border-primary">
                  {details.total_rating}.0
                </span>
                <ReactStars
                  value={4.2}
                  activeColor="#66cce6"
                  inactiveColor="#66cce6"
                  isEdit={false}
                  size={18}
                />
                <Divider type="vertical" className="divider-slate" />
                <div className="flex gap-1 ">
                  <span className="text-base border-b-2 border-black">
                    {formatNumber(details.total_reviews)}
                  </span>
                  <span className="text-base text-slate-400"> đánh giá</span>
                </div>
                <Divider type="vertical" className="divider-slate" />
                <div className="flex gap-1 ">
                  <span className="text-base">
                    {formatNumber(details.total_sold)}
                  </span>
                  <span className="text-base text-slate-400"> đã bán</span>
                </div>
              </div>
            </div>
            {/***Giá sản phẩm*/}
            <div className="py-[15px] px-[20px] flex items-center bg-[#fafafa] mt-4 gap-2">
              <span className="text-slate-400 text-[18px] mr-[10px] line-through">
                <sup>₫</sup>250.000
              </span>
              <span className="text-primary font-[500] text-[30px]">
                <sup>₫</sup>175.000
              </span>
              <div className="text-[12px] bg-primary items-center justify-center py-[2px] px-1 text-white ml-[15px] font-semibold text-nowrap rounded-[2px]">
                34% GIẢM
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default DetailsProduct;
