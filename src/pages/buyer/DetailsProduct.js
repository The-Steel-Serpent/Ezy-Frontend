import { Breadcrumb, Carousel, Divider } from "antd";
import React, { useEffect, useState } from "react";
import ReactImageGallery from "react-image-gallery";
import ReactStars from "react-rating-star-with-type";
import formatNumber from "../../helpers/formatNumber";
import { useParams } from "react-router-dom";
import axios from "axios";
// const details = {
//   id: 1,
//   category_id: 1,
//   category_name: "Thời Trang Nam",
//   sub_category_id: 1,
//   sub_category_name: "Quần jeans",
//   total_reviews: 7800,
//   total_rating: 5,
//   total_sold: 1000,
//   product_name:
//     "Quần Jean Nam Ống Rộng Dáng Suông Chất Vải Dày Dặn Màu Đen Trầm SMOKE V.1",
//   product_imgs: [
//     {
//       product_imgs_id: 1,
//       product_img:
//         "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ln2id781kgfn25@resize_w82_nl.webp",
//     },
//     {
//       product_imgs_id: 2,
//       product_img:
//         "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ln2id781kgfn25@resize_w82_nl.webp",
//     },
//     {
//       product_imgs_id: 3,
//       product_img:
//         "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ln2id781kgfn25@resize_w82_nl.webp",
//     },
//     {
//       product_imgs_id: 4,
//       product_img:
//         "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ln2id781kgfn25@resize_w164_nl.webp",
//     },
//     {
//       product_imgs_id: 5,
//       product_img:
//         "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ln2id781kgfn25@resize_w164_nl.webp",
//     },
//     {
//       product_imgs_id: 6,
//       product_img:
//         "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ln2id781kgfn25@resize_w164_nl.webp",
//     },
//   ],
//   product_varients: [
//     {
//       product_varients_id: 1,
//       product_varients_name: "Màu Đen Trầm",
//       thumbnail:
//         "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lvwjstcn2vh503",
//     },
//     {
//       product_varients_id: 2,
//       product_varients_name: "Màu Đen Trầm",
//       thumbnail:
//         "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lvwjstcn2vh503",
//     },
//     {
//       product_varients_id: 3,
//       product_varients_name: "Màu Đen Trầm",
//       thumbnail:
//         "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lvwjstcn2vh503",
//     },
//     {
//       product_varients_id: 4,
//       product_varients_name: "Màu Đen Trầm",
//       thumbnail:
//         "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lvwjstcn2vh503",
//     },
//   ],
// };

// const images = details.product_imgs.map((img) => ({
//   original:
//     "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lvwjstcn2vh503",
//   thumbnail:
//     "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lvwjstcn2vh503",
// }));
const DetailsProduct = () => {
  const { id } = useParams();
  const [currentVarient, setCurrentVarient] = useState({});
  const [currentThumbnail, setCurrentThumbnail] = useState("");
  const [detailsProduct, setDetailsProduct] = useState({});
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/product-details/${id}`
        );
        if (
          res.data.product.ProductVarients &&
          res.data.product.ProductVarients.length > 0
        ) {
          setCurrentVarient(res.data.product.ProductVarients[0]);
        }
        console.log(res.data.product);
        setDetailsProduct(res.data.product);
        setReviews(res.data.reviews);
      } catch (error) {
        console.log("Lỗi khi lấy dữ liệu sản phẩm: ", error);
      }
    };
    fetchProductDetails();
  }, []);

  //Product Details
  const imgs =
    detailsProduct?.ProductImgs?.map((img) => ({
      original: img?.url,
      thumbnail: img?.url,
    })) || [];
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const avgRating = totalRating / reviews.length || 0;
  const sale_price =
    currentVarient?.price -
    (currentVarient?.price * currentVarient?.sale_percents) / 100;
  // useEffect(() => {
  //   setCurrentThumbnail(details.product_varients[0].thumbnail);
  // }, [currentThumbnail]);
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
                title: (
                  <a href="/">
                    {detailsProduct?.SubCategory?.Category?.category_name}
                  </a>
                ),
              },
              {
                title: (
                  <a href="/">
                    {detailsProduct?.SubCategory?.sub_category_name}
                  </a>
                ),
              },
              {
                title: <span>{detailsProduct.product_name}</span>,
              },
            ]}
          />
        </div>
        <div className=" bg-white grid grid-flow-col lg:grid-cols-12 rounded">
          <section className="col-span-5 p-[15px]">
            <ReactImageGallery
              lazyLoad={true}
              items={imgs}
              showThumbnails={true}
            />
          </section>
          <section className="col-span-7 pl-5 pt-5 pr-9">
            {/***Tên sản phẩm */}
            <span className="text-xl font-semibold">
              {detailsProduct?.product_name}
            </span>
            {/***Đánh giá sản phẩm*/}
            <div className="w-full mt-[10px]">
              <div className="flex gap-1 items-center">
                <span className="text-base text-primary border-b-2 border-primary">
                  {avgRating}
                </span>
                <ReactStars
                  value={avgRating}
                  activeColor="#66cce6"
                  inactiveColor="#66cce6"
                  isEdit={false}
                  size={18}
                />
                <Divider type="vertical" className="divider-slate" />
                <div className="flex gap-1 ">
                  <span className="text-base border-b-2 border-black">
                    {formatNumber(reviews.length)}
                  </span>
                  <span className="text-base text-slate-400"> đánh giá</span>
                </div>
                <Divider type="vertical" className="divider-slate" />
                <div className="flex gap-1 ">
                  <span className="text-base">
                    {formatNumber(detailsProduct?.sold || 0)}
                  </span>
                  <span className="text-base text-slate-400"> đã bán</span>
                </div>
              </div>
            </div>
            {/***Giá sản phẩm*/}
            <div className="py-[15px] px-[20px] flex items-center bg-[#fafafa] mt-4 gap-2">
              <span className="text-slate-400 text-[18px] mr-[10px] line-through">
                <sup>₫</sup>
                {currentVarient?.price?.toLocaleString("vi-VN")}
              </span>
              <span className="text-primary font-[500] text-[30px]">
                <sup>₫</sup>
                {sale_price?.toLocaleString("vi-VN")}
              </span>
              <div className="text-[12px] bg-primary items-center justify-center py-[2px] px-1 text-white ml-[15px] font-semibold text-nowrap rounded-[2px]">
                {currentVarient?.sale_percents}% GIẢM
              </div>
            </div>

            <div className="flex flex-col mt-10">
              {/***Màu sắc */}
              <section className="flex flex-row mb-6">
                <div className="text-slate-400 flex-shrink-0 w-[110px] font-[400] text-lg">
                  {detailsProduct?.ProductClassifies?.[0]?.type_name}
                </div>
                <div className="flex items-center overflow-y-auto max-h-[220px] max-w-[515px] flex-wrap">
                  {detailsProduct?.ProductClassifies?.map((classify, key) => (
                    <button className="hover:border-primary hover:text-primary  items-center bg-white border-[1px] border-solid border-slate-400 rounded box-border text-black cursor-pointer inline-flex justify-center mt-2 mr-2 min-h-10 min-w-20 overflow-visible p-2 relative text-left break-words">
                      <img src={classify?.thumbnail} className="w-6 h-6" />
                      <span className="ml-2">
                        {classify?.product_classify_name}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
              {/***Kích cỡ */}
              <section className="flex flex-row mb-6">
                <div className="text-slate-400 flex-shrink-0 w-[110px] font-[400] text-lg">
                  {detailsProduct?.ProductSizes?.[0]?.type_of_size}
                </div>
                <div className="flex items-center overflow-y-auto max-h-[220px] max-w-[515px] flex-wrap">
                  {detailsProduct?.ProductSizes?.map((size, key) => (
                    <button className="hover:border-primary hover:text-primary  items-center bg-white border-[1px] border-solid border-slate-400 rounded box-border text-black cursor-pointer inline-flex justify-center mt-2 mr-2 min-h-10 min-w-20 overflow-visible p-2 relative text-left break-words">
                      <span className="ml-2">{size?.product_size_name}</span>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default DetailsProduct;
