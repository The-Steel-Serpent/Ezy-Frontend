import {
  Breadcrumb,
  Button,
  Carousel,
  Divider,
  Dropdown,
  InputNumber,
  Space,
  Typography,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import ReactImageGallery from "react-image-gallery";
import ReactStars from "react-rating-star-with-type";
import formatNumber from "../../helpers/formatNumber";
import { useParams } from "react-router-dom";
import axios from "axios";
import { IoCheckmarkDone } from "react-icons/io5";
import { TiShoppingCart } from "react-icons/ti";
import { TbTruckReturn } from "react-icons/tb";
import ShopInformationSection from "../../components/shop/ShopInformationSection";
import formatAddress from "../../helpers/formatAddress";
import { DownOutlined } from "@ant-design/icons";
import ReviewCard from "../../components/product/ReviewCard";
const DetailsProduct = () => {
  const { id } = useParams();
  const [sizes, setSizes] = useState([]);
  const [currentVarient, setCurrentVarient] = useState({});
  const [selectedClassify, setSelectedClassify] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // const [currentThumbnail, setCurrentThumbnail] = useState("");
  const [detailsProduct, setDetailsProduct] = useState({});
  const [reviews, setReviews] = useState([]);

  //Side Effect
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/product-details/${id}`
        );
        // if (
        //   res.data.product.ProductVarients &&
        //   res.data.product.ProductVarients.length > 0
        // ) {
        //   setCurrentVarient(res.data.product.ProductVarients[0]);
        // }
        // console.log(res.data.product);
        setDetailsProduct(res.data.product);
        if (res.data.product.ProductClassifies.length > 0) {
          const firstClassify = res.data.product?.ProductClassifies?.find(
            (classify) => classify.total_stock > 0
          );
          setSelectedClassify(firstClassify?.product_classify_id);
        }

        setReviews(res.data.reviews);
      } catch (error) {
        console.log("Lỗi khi lấy dữ liệu sản phẩm: ", error);
      }
    };
    fetchProductDetails();
  }, []);

  useEffect(() => {
    const fetchProductVarient = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/product-varients?product_id=${id}&product_classify_id=${selectedClassify}`
        );
        console.log(res.data.data[0]);

        setSizes(res.data.data);
        const firstInStock = res.data.data.find((varient) => varient.stock > 0);
        setCurrentVarient(firstInStock);
        // setSelectedSize(res.data.data[0]?.product_size_id);
        // setSelectedClassify(res.data.data[0]?.product_classify_id);
      } catch (error) {
        console.log("Lỗi khi lấy dữ liệu Varient: ", error);
      }
    };
    fetchProductVarient();
  }, [detailsProduct.product_id, selectedClassify]);

  //Handle

  const handleSizeClick = useCallback(
    (size) => {
      setCurrentVarient(size);
    },
    [currentVarient]
  );

  const handleClassifyClick = useCallback(
    (classifyID) => {
      setSelectedClassify(classifyID);
    },
    [selectedClassify]
  );

  const quantityOnChange = (value) => {
    setQuantity(value);
  };

  const handleRatingFilterClick = useCallback(
    ({ key }) => {
      const cleanValue = key.replace("tmp-", ""); // Loại bỏ tiền tố "tmp-"
      const value = parseInt(cleanValue);
      setRatingFilter(value);
      console.log("selected rating: ", value);
    },
    [ratingFilter]
  );
  //Product Details
  const imgs =
    detailsProduct?.ProductImgs?.map((img) => ({
      original: img?.url,
      thumbnail: img?.url,
    })) || [];
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const avgRating = totalRating / reviews.length || 0;

  const price =
    currentVarient != null ? currentVarient?.price : detailsProduct?.base_price;

  const sale_percents =
    currentVarient != null
      ? currentVarient?.sale_percents
      : detailsProduct?.sale_percents;

  const sale_price =
    currentVarient != null && currentVarient?.sale_percents > 0
      ? currentVarient?.price -
        (currentVarient?.price * currentVarient?.sale_percents) / 100
      : detailsProduct?.base_price -
        (detailsProduct?.base_price * detailsProduct?.sale_percents) / 100;

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
                  <a className="text-blue-500 hover:opacity-85" href="/">
                    Ezy
                  </a>
                ),
              },
              {
                title: (
                  <a className="text-blue-500 hover:opacity-85" href="/">
                    {detailsProduct?.SubCategory?.Category?.category_name}
                  </a>
                ),
              },
              {
                title: (
                  <a className="text-blue-500 hover:opacity-85" href="/">
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
        {/***Sản phẩm */}
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
            <div className="py-[15px] px-[20px] flex items-center bg-[#fafafa] mt-4 gap-2 mb-6">
              {sale_percents > 0 && (
                <>
                  <span className="text-slate-400 text-[18px] mr-[10px] line-through">
                    <sup>₫</sup>
                    {price?.toLocaleString("vi-VN")}
                  </span>
                  <span className="text-primary font-[500] text-[30px]">
                    <sup>₫</sup>
                    {sale_price?.toLocaleString("vi-VN")}
                  </span>
                  <div className="text-[12px] bg-primary items-center justify-center py-[2px] px-1 text-white ml-[15px] font-semibold text-nowrap rounded-[2px]">
                    {sale_percents}% GIẢM
                  </div>
                </>
              )}
              {sale_percents === 0 && (
                <>
                  <span className="text-primary font-[500] text-[30px]">
                    <sup>₫</sup>
                    {price?.toLocaleString("vi-VN")}
                  </span>
                </>
              )}
            </div>
            <div className="flex flex-col ">
              {/***Trả hàng */}
              <section className="flex flex-row mb-6 gap-1">
                <div className="text-slate-500 flex-shrink-0 w-[110px] font-[400] text-base">
                  Chính sách trả hàng
                </div>
                <div className="flex items-center gap-2">
                  <TbTruckReturn className="text-primary text-base" />
                  <span className="text-sm text-slate-400">
                    Trả hàng 7 ngày
                  </span>
                </div>
              </section>
              {/***Màu sắc */}
              {detailsProduct?.ProductClassifies?.[0] && (
                <>
                  <section className="flex flex-row mb-6">
                    <div className="text-slate-500 flex-shrink-0 w-[110px] font-[400] text-base">
                      {detailsProduct?.ProductClassifies?.[0]?.type_name}
                    </div>
                    <div className="flex items-center overflow-y-auto max-h-[220px] max-w-[515px] flex-wrap">
                      {detailsProduct?.ProductClassifies?.map(
                        (classify, key) => (
                          <button
                            onClick={() =>
                              classify?.total_stock > 0 &&
                              handleClassifyClick(classify?.product_classify_id)
                            }
                            className={`
                              ${
                                classify?.total_stock > 0
                                  ? "hover:border-primary hover:text-primary cursor-pointer bg-white"
                                  : "cursor-not-allowed bg-[#fafafa] text-gray-400"
                              }
                               ${
                                 selectedClassify ===
                                 classify?.product_classify_id
                                   ? "border-primary text-primary"
                                   : ""
                               }  items-center  border-[1px] border-solid  rounded box-border inline-flex justify-center mt-2 mr-2 min-h-10 min-w-20 overflow-visible p-2 relative text-left break-words`}
                          >
                            <img
                              src={classify?.thumbnail}
                              className="w-6 h-6"
                            />
                            <span className="ml-2">
                              {classify?.product_classify_name}
                            </span>
                            {selectedClassify ===
                              classify?.product_classify_id && (
                              <>
                                <div className="absolute bottom-0 right-0 size-[15px] overflow-hidden">
                                  <IoCheckmarkDone />
                                </div>
                              </>
                            )}
                          </button>
                        )
                      )}
                    </div>
                  </section>
                </>
              )}

              {/* **Kích cỡ */}
              {detailsProduct?.ProductSizes?.[0] && (
                <>
                  <section className="flex flex-row mb-6">
                    <div className="text-slate-500 flex-shrink-0 w-[110px] font-[400] text-base">
                      {detailsProduct?.ProductSizes?.[0]?.type_of_size}
                    </div>
                    <div className="flex items-center overflow-y-auto max-h-[220px] max-w-[515px] flex-wrap">
                      {sizes.map((size, key) => (
                        <button
                          onClick={() => {
                            size?.stock > 0 && handleSizeClick(size);
                          }}
                          className={`${
                            size?.stock > 0
                              ? "hover:border-primary hover:text-primary cursor-pointer bg-white"
                              : "cursor-not-allowed bg-[#fafafa] text-gray-400"
                          } ${
                            size?.stock > 0 &&
                            currentVarient?.ProductSize?.product_size_id ===
                              size?.product_size_id
                              ? "border-primary text-primary"
                              : ""
                          } items-center  border-[1px] border-solid rounded box-border  inline-flex justify-center mt-2 mr-2 min-h-10 min-w-20 overflow-visible p-2 relative text-left break-words`}
                        >
                          <span className="ml-2">
                            {size?.ProductSize?.product_size_name}
                          </span>
                          {size?.stock > 0 &&
                            currentVarient?.ProductSize?.product_size_id ===
                              size?.product_size_id && (
                              <>
                                <div className="absolute bottom-0 right-0 size-[15px] overflow-hidden">
                                  <IoCheckmarkDone />
                                </div>
                              </>
                            )}
                        </button>
                      ))}
                    </div>
                  </section>
                </>
              )}

              {/***Số lượng */}
              <section className="flex flex-row mb-6">
                <div className="text-slate-500 flex-shrink-0 w-[110px] font-[400] text-base">
                  Số lượng
                </div>
                {/* <div className="flex items-center overflow-y-auto max-h-[220px] max-w-[515px] flex-wrap"></div> */}
                <div className="flex justify-center items-center gap-2">
                  <InputNumber
                    min={1}
                    max={currentVarient?.stock}
                    defaultValue={1}
                    onChange={quantityOnChange}
                  />
                  {currentVarient?.stock > 0 && (
                    <>
                      <span className="text-slate-400 text-sm">
                        {currentVarient?.stock} sản phẩm có sẵn
                      </span>
                    </>
                  )}
                </div>
              </section>
              {/***Button */}
              <div className="flex gap-5 mt-2">
                <Button
                  size="large"
                  className="h-14 px-5 hover:bg-primary text-lg"
                  icon={<TiShoppingCart />}
                  onClick={() => {
                    console.log("Thêm vào giỏ hàng", currentVarient);
                  }}
                >
                  Thêm vào giỏ hàng
                </Button>
                <Button
                  className="bg-primary text-white hover:bg-opacity-80 px-8 h-14 text-lg"
                  size="large"
                  onClick={() => {
                    console.log("Mua Ngay", currentVarient);
                  }}
                >
                  Mua Ngay
                </Button>
              </div>
            </div>
          </section>
        </div>

        {/***Shop Information*/}
        <section className="bg-white rounded mt-[15px] pt-[25px]">
          <ShopInformationSection value={detailsProduct?.Shop} />
        </section>

        {/***Product Description Container */}
        <section className="bg-white rounded mt-[15px] p-[25px]">
          {/***Product Detail */}
          <div className="w-full flex flex-col mb-5">
            <div className="p-[14px] text-lg font-normal text-black bg-neutral-100">
              CHI TIẾT SẢN PHẨM
            </div>
            <div className="mt-[30px] mx-[15px] mb-[15px] flex flex-col gap-4">
              {/***Danh Mục */}
              <div className="flex flex-row items-center gap-2">
                <div className="text-slate-400 w-[150px] line-clamp-2 text-ellipsis">
                  Danh Mục
                </div>
                <div className="">
                  <Breadcrumb
                    items={[
                      {
                        title: (
                          <a
                            className="text-blue-500 hover:opacity-85"
                            href="/"
                          >
                            Ezy
                          </a>
                        ),
                      },
                      {
                        title: (
                          <a
                            className="text-blue-500 hover:opacity-85"
                            href="#"
                          >
                            {
                              detailsProduct?.SubCategory?.Category
                                ?.category_name
                            }
                          </a>
                        ),
                      },
                      {
                        title: (
                          <a
                            className="text-blue-500 hover:opacity-85"
                            href="#"
                          >
                            {detailsProduct?.SubCategory?.sub_category_name}
                          </a>
                        ),
                      },
                    ]}
                  />
                </div>
              </div>
              {/***Số lượng sản phẩm còn lại */}
              <div className="flex flex-row items-center gap-2">
                <div className="text-slate-400 w-[150px] line-clamp-2 text-ellipsis">
                  Số sản phẩm còn lại
                </div>
                <div className="">{detailsProduct?.stock}</div>
              </div>
              {/***Đối tượng */}
              <div className="flex flex-row items-center gap-2">
                <div className="text-slate-400 w-[150px] line-clamp-2 text-ellipsis">
                  Đối tượng
                </div>
                <div className="">{detailsProduct?.gender_object}</div>
              </div>

              {/***Thương hiệu */}
              <div className="flex flex-row items-center gap-2">
                <div className="text-slate-400 w-[150px] line-clamp-2 text-ellipsis">
                  Thương hiệu
                </div>
                <div className="">{detailsProduct?.brand}</div>
              </div>
              {/***Xuất xứ */}
              <div className="flex flex-row items-center gap-2">
                <div className="text-slate-400 w-[150px]">Xuất xứ</div>
                <div className="">{detailsProduct?.origin}</div>
              </div>
              {/***Gửi từ */}
              <div className="flex flex-row items-center gap-2">
                <div className="text-slate-400 w-[150px]">Gửi từ</div>
                <div className="">
                  {formatAddress(detailsProduct?.Shop?.shop_address)}
                </div>
              </div>
            </div>
          </div>
          {/***Product Description */}
          {detailsProduct?.description && (
            <>
              <div className="w-full flex flex-col">
                <div className="p-[14px] text-lg font-normal text-black bg-neutral-100">
                  MÔ TẢ SẢN PHẨM
                </div>
                <div
                  dangerouslySetInnerHTML={{
                    __html: detailsProduct?.description,
                  }}
                  className="mt-[30px] mx-[15px] mb-[15px] flex flex-col gap-4"
                ></div>
              </div>
            </>
          )}
        </section>

        {/***Review Container */}
        <section className="bg-white rounded mt-[15px] p-[25px]">
          <p className="text-lg">ĐÁNH GIÁ SẢN PHẨM</p>
          <div className="mt-4 p-[30px] justify-between border-primary bg-secondary border-[1px] border-solid flex flex-row gap-14">
            {/***Rating */}
            <div className="flex flex-row gap-3 w-fit">
              <span className="text-primary text-lg text-center">
                <span className="text-3xl text-primary font-semibold">
                  {avgRating}
                </span>{" "}
                trên 5
              </span>
              <ReactStars
                value={avgRating}
                activeColor="#66cce6"
                inactiveColor="#66cce6"
                isEdit={false}
                size={20}
              />
            </div>
            {/***Filter Rating*/}
            <div className="w-fit flex gap-2">
              {" "}
              <Dropdown
                className="border-primary border-[1px] border-solid rounded"
                menu={{
                  items: [
                    { key: "0", value: "0", label: "Tất cả" },
                    { key: "5", value: "5", label: "5 sao" },
                    { key: "4", value: "4", label: "4 sao" },
                    { key: "3", value: "3", label: "3 sao" },
                    { key: "2", value: "2", label: "2 sao" },
                    { key: "1", value: "1", label: "1 sao" },
                  ],
                  onClick: handleRatingFilterClick,
                  selectable: true,

                  defaultSelectedKeys: ["0"],
                }}
                placement="bottom"
                arrow={{
                  pointAtCenter: true,
                }}
              >
                <Typography.Link className="text-primary ">
                  <Space>
                    {ratingFilter === 0 ? "Tất cả" : `${ratingFilter} sao`}
                    <DownOutlined />
                  </Space>
                </Typography.Link>
              </Dropdown>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-5">
            {reviews?.map((review, key) => (
              <ReviewCard value={review} key={key} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default DetailsProduct;
