/* eslint-disable jsx-a11y/alt-text */
import {
  Breadcrumb,
  Button,
  Carousel,
  Divider,
  Dropdown,
  InputNumber,
  notification,
  Pagination,
  Skeleton,
  Space,
  Spin,
  Typography,
} from "antd";
import "react-multi-carousel/lib/styles.css";
import React, { lazy, Suspense, useCallback, useEffect, useState } from "react";
import ReactStars from "react-rating-star-with-type";
import formatNumber from "../../../helpers/formatNumber";
import { useNavigate, useNavigation, useParams } from "react-router-dom";
import axios from "axios";
import { IoCheckmarkDone } from "react-icons/io5";
import { TiShoppingCart } from "react-icons/ti";
import { TbTruckReturn } from "react-icons/tb";
import { MdArrowForwardIos } from "react-icons/md";
import formatAddress from "../../../helpers/formatAddress";
import { DownOutlined } from "@ant-design/icons";
import ProductCard from "../../../components/product/ProductCard";
import ProductNotFounded from "../../../components/product/ProductNotFounded";
import withChildSuspense from "../../../hooks/HOC/withChildSuspense";
import { useDispatch, useSelector } from "react-redux";
import ReactImageGallery from "react-image-gallery";

const ReviewCard = lazy(() => import("../../../components/product/ReviewCard"));
const ShopInformationSection = lazy(() =>
  import("../../../components/shop/ShopInformationSection")
);
const CarouselProduct = withChildSuspense(
  lazy(() => import("react-multi-carousel"))
);
const ProductSuggestions = withChildSuspense(
  lazy(() => import("../../../components/product/ProductSuggestions"))
);

const { addToCart } = require("../../../services/cartService");
const { fetchMiniCartData } = require("../../../redux/cartSlice");
const DetailsProduct = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [success, setSuccess] = useState(true);
  const [isGalleryReady, setIsGalleryReady] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [currentVarient, setCurrentVarient] = useState({});
  const [selectedClassify, setSelectedClassify] = useState("");
  const [ratingFilter, setRatingFilter] = useState(6);
  const [totalReviews, setTotalReviews] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [avgRating, setAvgRating] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [detailsProduct, setDetailsProduct] = useState({});
  const [reviews, setReviews] = useState([]);
  const [shopProducts, setShopProducts] = useState([]);

  //Side Effect
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/product-details/${id}`
        );
        setDetailsProduct(res.data.product);
        if (res?.data?.product?.ProductClassifies?.length > 0) {
          const firstClassify = res.data.product?.ProductClassifies?.find(
            (classify) => classify.total_stock > 0
          );
          setSelectedClassify(firstClassify?.product_classify_id);
          setCurrentImageUrl(firstClassify?.thumbnail);
        }
        setAvgRating(res.data.avgRating);
        setTotalReviews(res.data.totalReviews);
      } catch (error) {
        console.log("Lỗi khi lấy dữ liệu sản phẩm: ", error);
        setSuccess(false);
      }
    };
    fetchProductDetails();
  }, [id]);
  useEffect(() => {
    const fetchProductReviews = async () => {
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/api/product-reviews/${id}?page=${page}&rating=${ratingFilter}`;
        const res = await axios.get(url);
        setReviews(res?.data?.reviews);
        setTotalPage(res?.data?.totalPage);
      } catch (error) {
        console.log("Lỗi khi lấy dữ liệu Review: ", error);
      }
    };
    if (detailsProduct != {}) {
      fetchProductReviews();
    }
  }, [page, ratingFilter]);

  useEffect(() => {
    const fetchProductVarient = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/product-varients?product_id=${id}&product_classify_id=${selectedClassify}`
        );
        if (res.data.success && Array.isArray(res.data.data)) {
          setSizes(res.data.data);
          const firstInStock = res.data.data.find(
            (varient) => varient.stock > 0
          );
          if (firstInStock) {
            setCurrentVarient(firstInStock);
          } else {
            setCurrentVarient(res.data.data[0]);
          }
        }
        // setSelectedSize(res.data.data[0]?.product_size_id);
        // setSelectedClassify(res.data.data[0]?.product_classify_id);
      } catch (error) {
        console.log("Lỗi khi lấy dữ liệu Varient: ", error);
      }
    };
    if (detailsProduct != {}) {
      fetchProductVarient();
    }
  }, [detailsProduct.product_id, selectedClassify]);

  useEffect(() => {
    const fetchShopProducts = async () => {
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/api/shop-products?shop_id=${detailsProduct?.Shop?.shop_id}&product_id=${id}`;
        const res = await axios.get(url);
        setShopProducts(res.data.products);
      } catch (error) {
        console.log("Lỗi khi lấy dữ liệu sản phẩm của shop: ", error);
      }
    };
    if (detailsProduct) {
      fetchShopProducts();
    }
  }, [detailsProduct?.Shop?.shop_id]);
  //Handle
  const handleMouseEnter = (thumbnail) => {
    setCurrentImageUrl(thumbnail);
  };

  const handleSlide = (currentIndex) => {
    setCurrentImageIndex(currentIndex);
    setCurrentImageUrl(null);
  };

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

  //Cart
  const handleAddToCart = async (productVarient) => {
    try {
      if (detailsProduct?.stock <= 0 || currentVarient?.stock <= 0) {
        return;
      }
      if (!user?.user_id) {
        navigate("/buyer/login");
      }
      // console.log("Quantity: ", quantity);
      const res = await addToCart(
        user.user_id,
        detailsProduct?.Shop?.shop_id,
        productVarient.product_varients_id,
        quantity
      );
      if (res.success) {
        notification.success({
          message: res.message,
          showProgress: true,
          pauseOnHover: false,
        });
        dispatch(await fetchMiniCartData(user.user_id));
      }
    } catch (error) {
      notification.error({
        message: error.message,
        showProgress: true,
        pauseOnHover: false,
      });
    }
  };

  const handleBuyNow = async (productVarient) => {
    try {
      if (detailsProduct?.stock <= 0 || currentVarient?.stock <= 0) {
        return;
      }
      if (!user?.user_id) {
        navigate("/buyer/login");
      }
      // console.log("Quantity: ", quantity);
      const res = await addToCart(
        user.user_id,
        detailsProduct?.Shop?.shop_id,
        productVarient.product_varients_id,
        quantity
      );
      if (res.success) {
        notification.success({
          message: res.message,
          showProgress: true,
          pauseOnHover: false,
        });
        dispatch(await fetchMiniCartData(user.user_id));
        navigate("/cart");
      }
    } catch (error) {
      notification.error({
        message: error?.response?.data?.message,
        showProgress: true,
        pauseOnHover: false,
      });
    }
  };
  //Product Details
  const imgs =
    detailsProduct?.ProductImgs?.map((img) => ({
      original: img?.url,
      thumbnail: img?.url,
    })) || [];

  const updatedImgs = imgs.map((img, index) => ({
    ...img,
    original:
      index === currentImageIndex && currentImageUrl
        ? currentImageUrl
        : img.original,
  }));
  useEffect(() => {
    if (updatedImgs && updatedImgs.length > 0) {
      setIsGalleryReady(true);
    }
  }, [updatedImgs]);

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
      {success ? (
        <div className="max-w-[1200px]  mx-auto">
          <div className=" flex justify-center lg:justify-start my-4">
            <Breadcrumb
              className="max-w-[1200px] w-full"
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
                  title: (
                    <span className="line-clamp-1 text-ellipsis">
                      {detailsProduct.product_name}
                    </span>
                  ),
                },
              ]}
            />
          </div>
          {/***Sản phẩm */}
          <div className=" bg-white grid grid-flow-col lg:grid-cols-12 rounded">
            {/***Ảnh sản phẩm */}
            <section className="col-span-5 p-[15px]">
              <ReactImageGallery
                lazyLoad={true}
                items={updatedImgs}
                showThumbnails={true}
                onSlide={handleSlide}
                startIndex={currentImageIndex}
              />
            </section>
            {/***Lựa chọn sản phẩm */}
            <section className="col-span-7 pl-5 pt-5 pr-9">
              {/***Tên sản phẩm */}
              <span className="text-xl font-semibold break-words">
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
                      {formatNumber(totalReviews)}
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
                      <div className="text-slate-500 flex-shrink-0 w-[100px] font-[400] text-base break-words">
                        {detailsProduct?.ProductClassifies?.[0]?.type_name}
                      </div>
                      <div className="flex items-center overflow-y-auto max-h-[220px] max-w-[515px] flex-wrap">
                        {detailsProduct?.ProductClassifies?.map(
                          (classify, key) => (
                            <button
                              onClick={() => {
                                if (classify?.total_stock > 0) {
                                  handleClassifyClick(
                                    classify?.product_classify_id
                                  );
                                  classify?.thumbnail &&
                                    handleMouseEnter(classify?.thumbnail);
                                }
                              }}
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
                                loading="lazy"
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
                      <div className="text-slate-500 flex-shrink-0 w-[110px] font-[400] text-base break-words">
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
                  {currentVarient?.stock > 0 && detailsProduct?.stock > 0 && (
                    <>
                      <Button
                        size="large"
                        className={`${
                          detailsProduct?.stock > 0 || currentVarient?.stock > 0
                            ? `hover:bg-primary hover:text-white  cursor-pointer`
                            : `hover:bg-white hover:text-primary cursor-not-allowed opacity-60`
                        } h-14 px-5  text-lg`}
                        icon={<TiShoppingCart />}
                        onClick={async () =>
                          await handleAddToCart(currentVarient)
                        }
                      >
                        Thêm vào giỏ hàng
                      </Button>
                      <Button
                        className={`${
                          detailsProduct?.stock > 0 || currentVarient?.stock > 0
                            ? "hover:bg-opacity-80 cursor-pointer"
                            : "opacity-60 cursor-not-allowed"
                        } bg-primary text-white px-8 h-14 text-lg`}
                        size="large"
                        onClick={async () => {
                          if (
                            detailsProduct?.stock > 0 ||
                            currentVarient?.stock > 0
                          ) {
                            await handleBuyNow(currentVarient);
                          }
                        }}
                      >
                        Mua Ngay
                      </Button>
                    </>
                  )}
                  {currentVarient?.stock <= 0 && (
                    <Button
                      disabled
                      className="h-14 px-5 w-[200px]  text-lg"
                      size="large"
                    >
                      Hết Hàng
                    </Button>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/***Shop Information*/}
          <section className="bg-white rounded mt-[15px] pt-[25px]">
            <Suspense fallback={<Skeleton avatar paragraph={{ rows: 1 }} />}>
              <ShopInformationSection value={detailsProduct?.Shop} />
            </Suspense>
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
            <div className="w-full flex flex-col">
              <div className="p-[14px] text-lg font-normal text-black bg-neutral-100">
                MÔ TẢ SẢN PHẨM
              </div>
              {detailsProduct?.description ? (
                <>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: detailsProduct?.description,
                    }}
                    className="mt-[30px] mx-[15px] mb-[15px] flex flex-col gap-4 break-words"
                  ></div>
                </>
              ) : (
                <>
                  <div className="mt-[30px] mx-[15px] mb-[15px] flex flex-col gap-4">
                    Không có mô tả sản phẩm
                  </div>
                </>
              )}
            </div>
          </section>

          {/***Review Container */}
          <section className="bg-white rounded mt-[15px] p-[25px]">
            <p className="text-lg">ĐÁNH GIÁ SẢN PHẨM</p>
            <div className="mt-4 p-[30px] justify-between border-primary bg-third border-[1px] border-solid flex flex-row gap-14">
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
                      { key: "6", value: "6", label: "Tất cả" },
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
                      {ratingFilter === 6 ? "Tất cả" : `${ratingFilter} sao`}
                      <DownOutlined />
                    </Space>
                  </Typography.Link>
                </Dropdown>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-5 p-5">
              {reviews?.length > 0 ? (
                <>
                  {reviews?.map((review, key) => (
                    <Suspense
                      fallback={
                        <Skeleton
                          avatar
                          paragraph={{
                            rows: 3,
                          }}
                        />
                      }
                    >
                      <ReviewCard value={review} key={key} />
                    </Suspense>
                  ))}
                  <Pagination
                    align="center"
                    defaultCurrent={page}
                    pageSize={10}
                    total={totalPage * 10 || 0}
                    hideOnSinglePage={reviews.length <= 10 ? true : false}
                  />
                </>
              ) : (
                <>
                  <div className="w-full text-center mt-5">
                    Không có dữ liệu đánh giá nào cho sản phẩm này
                  </div>
                </>
              )}
            </div>
          </section>
          {/***Other Product of Shop */}
          {shopProducts?.length > 0 && (
            <>
              <div className="mt-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-normal">
                    CÁC SẢN PHẨM KHÁC CỦA SHOP
                  </span>
                  <a
                    href={`/shop/${detailsProduct?.Shop?.UserAccount?.username}?sub_category_id=-1#productList`}
                    className="text-primary flex items-center gap-1"
                  >
                    Xem Tất Cả <MdArrowForwardIos size={16} />
                  </a>
                </div>

                <CarouselProduct
                  additionalTransfrom={0}
                  arrows
                  centerMode={false}
                  className="animation-pulse mt-5 w-full"
                  containerClass="container"
                  dotListClass=""
                  draggable
                  focusOnSelect={false}
                  infinite={false}
                  itemClass="lg:w-[195px] mr-[6px]"
                  keyBoardControl
                  minimumTouchDrag={1000}
                  pauseOnHover
                  renderArrowsWhenDisabled={false}
                  renderButtonGroupOutside={false}
                  renderDotsOutside={false}
                  responsive={{
                    desktop: {
                      breakpoint: {
                        max: 3000,
                        min: 1024,
                      },
                      items: 6,
                      partialVisibilityGutter: 50,
                    },
                    mobile: {
                      breakpoint: {
                        max: 464,
                        min: 0,
                      },
                      items: 1,
                      partialVisibilityGutter: 30,
                    },
                    tablet: {
                      breakpoint: {
                        max: 1024,
                        min: 464,
                      },
                      items: 2,
                      partialVisibilityGutter: 30,
                    },
                  }}
                  rewind={false}
                  rewindWithAnimation={false}
                  rtl={false}
                  shouldResetAutoplay
                  showDots={false}
                  sliderClass=""
                  slidesToSlide={2}
                  swipeable
                >
                  {shopProducts.map((product, key) => (
                    <ProductCard value={product} />
                  ))}
                </CarouselProduct>
              </div>
            </>
          )}

          {/***Product Suggestions */}
          <div className="mt-10">
            <span className="text-lg font-normal">CÓ THỂ BẠN CŨNG THÍCH</span>
            <ProductSuggestions />
          </div>
        </div>
      ) : (
        <ProductNotFounded />
      )}
    </>
  );
};

export default DetailsProduct;
