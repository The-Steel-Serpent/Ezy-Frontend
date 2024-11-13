/* eslint-disable jsx-a11y/alt-text */
import {
  ClockCircleFilled,
  DownOutlined,
  SearchOutlined,
  WarningFilled,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Checkbox,
  InputNumber,
  message,
  Modal,
  notification,
  Popover,
  Statistic,
} from "antd";
import axios from "axios";
import React, { memo, useCallback, useEffect, useReducer } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { IoCheckmarkDone } from "react-icons/io5";
import {
  removeItem,
  updateItemQuantity,
  updateSelected,
  updateVarients,
} from "../../services/cartService";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCartData,
  updateCartVarients,
  updateVarientQuantity,
} from "../../redux/cartSlice";
import moment from "moment";
const text = <span className="text-lg font-semibold">Phân loại hàng</span>;
const { Countdown } = Statistic;
const CartItem = (props) => {
  const { item, onCartItemSelectedChange, type = "valid" } = props;
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [state, setState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "checked":
          return { ...state, checked: action.payload };
        case "openPopover":
          return { ...state, openPopover: action.payload };
        case "selectedClassify":
          return { ...state, selectedClassify: action.payload };
        case "currentVarients":
          return { ...state, currentVarient: action.payload };
        case "classifyList":
          return { ...state, classifyList: action.payload };
        case "sizeList":
          return { ...state, sizeList: action.payload };
        case "setOpenModal":
          return { ...state, openModal: action.payload };
        default:
          return state;
      }
    },
    {
      checked: item.selected,
      selectedClassify: null,
      currentVarient: item?.ProductVarient || null,
      classifyList: [],
      sizeList: [],
      openPopover: false,
      openModal: false,
    }
  );

  const {
    checked,
    selectedClassify,
    currentVarient,
    classifyList,
    sizeList,
    openPopover,
    openModal,
  } = state;

  //Side Effect
  useEffect(() => {
    const fetchClassify = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/classify-products?product_id=${item?.ProductVarient?.Product?.product_id}`
        );
        if (res.status === 200) {
          setState({ type: "classifyList", payload: res.data.data });
          if (res.data.data.length > 0 && Array.isArray(res.data.data)) {
            const selectedClassify = res.data.data.find(
              (data) =>
                data.product_classify_id ===
                item?.ProductVarient?.product_classify_id
            );
            if (selectedClassify) {
              setState({
                type: "selectedClassify",
                payload: selectedClassify?.product_classify_id,
              });
            } else {
              setState({
                type: "selectedClassify",
                payload: res?.data?.data?.[0]?.product_classify_id,
              });
            }
          }
        }
      } catch (error) {
        console.log("Lỗi khi fetch dữ liệu phân loại: ", error);
      }
    };
    if (openPopover && item?.ProductVarient?.Product?.product_id) {
      fetchClassify();
    }
  }, [openPopover]);

  useEffect(() => {
    const fetchSize = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/product-varients?product_id=${item?.ProductVarient?.Product?.product_id}&product_classify_id=${selectedClassify}`
        );
        if (res.status === 200) {
          if (res?.data?.data?.[0]?.ProductSize === null) {
            setState({
              type: "currentVarients",
              payload: res?.data?.data?.[0],
            });
          } else {
            if (res.data.data.length > 0 && Array.isArray(res.data.data)) {
              const selectedSize = res.data.data.find(
                (data) =>
                  data.ProductSize.product_size_id ===
                  item?.ProductVarient?.product_size_id
              );
              if (selectedSize) {
                setState({ type: "currentVarients", payload: selectedSize });
              } else {
                setState({
                  type: "currentVarients",
                  payload: res?.data?.data?.[0],
                });
              }
              setState({ type: "sizeList", payload: res.data.data });
            }
          }
        }
      } catch (error) {
        console.log("Lỗi khi fetch dữ liệu size: ", error);
      }
    };
    if (selectedClassify && item?.ProductVarient?.Product?.product_id) {
      fetchSize();
    }
  }, [
    openPopover,
    selectedClassify,
    item?.ProductVarient?.Product?.product_id,
    item?.ProductVarient?.product_size_id,
  ]);

  useEffect(() => {
    setState({ type: "checked", payload: item.selected });
  }, [item.selected]);

  //Handler
  const handleOpenChange = (newOpen) => {
    setState({ type: "openPopover", payload: newOpen });
  };

  const handleUpdateVarient = async () => {
    try {
      const res = await updateVarients(
        item?.cart_item_id,
        currentVarient?.product_varients_id
      );
      if (res.success) {
        message.success("Cập nhật sản phẩm thành công");

        if (user?.user_id !== "") {
          dispatch(
            updateCartVarients({
              cartItemID: item?.cart_item_id,
              productVarientsID: currentVarient?.product_varients_id,
            })
          );
          dispatch(fetchCartData({ userID: user?.user_id }));
          setState({ type: "openPopover", payload: false });
        }
      }
    } catch (error) {
      console.log("Lỗi khi cập nhật biến thể: ", error);
      message.error(error?.message || "Cập nhật sản phẩm thất bại");
    }
  };

  const handleUpdateQuantity = useCallback(
    async (value) => {
      const quantityValue = parseInt(value, 10);
      if (quantityValue !== 0) {
        try {
          const res = await updateItemQuantity(
            item?.cart_item_id,
            quantityValue
          );
          console.log("res", res);
          if (res?.success) {
            if (user?.user_id !== "") {
              dispatch(fetchCartData({ userID: user?.user_id }));
            }
          }
        } catch (error) {
          console.log("Lỗi khi cập nhật số lượng sản phẩm: ", error);
          message.error(
            error?.message || "Cập nhật số lượng sản phẩm thất bại"
          );
        }
      } else {
        handleShowModal();
      }
    },
    [item.cart_item_id, dispatch, user?.user_id]
  );

  const handleCheckboxChange = useCallback(
    async (e) => {
      const isChecked = e.target.checked === true ? 1 : 0;
      setState({ type: "checked", payload: isChecked });
      onCartItemSelectedChange(item.cart_item_id, isChecked);
    },
    [onCartItemSelectedChange, item.cart_item_id]
  );
  const handleRemoveCartItem = async () => {
    console.log("item", item);
    try {
      const res = await removeItem(item?.cart_item_id);
      if (res.success) {
        notification.success({
          message: "Xóa sản phẩm thành công",
          showProgress: true,
          pauseOnHover: false,
        });
        setState({ type: "setOpenModal", payload: false });
        dispatch(fetchCartData({ userID: user?.user_id }));
      }
    } catch (error) {
      console.log("Lỗi khi xóa sản phẩm: ", error);
      notification.error({
        message: error.message,
        showProgress: true,
        pauseOnHover: false,
      });
    }
  };

  console.log("item", item);
  const isEnoughFlashSaleStock =
    item?.ProductVarient?.Product?.ShopRegisterFlashSales?.length > 0 &&
    item?.ProductVarient?.Product?.ShopRegisterFlashSales[0]?.quantity -
      item?.ProductVarient?.Product?.ShopRegisterFlashSales[0]?.sold !==
      0;
  const stock =
    item?.ProductVarient?.Product?.ShopRegisterFlashSales?.length > 0 &&
    isEnoughFlashSaleStock
      ? item?.ProductVarient?.Product?.ShopRegisterFlashSales[0]?.quantity -
        item?.ProductVarient?.Product?.ShopRegisterFlashSales[0]?.sold
      : item?.ProductVarient?.stock;
  //popover content
  const content = (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <span className="font-semibold">{classifyList[0]?.type_name}</span>
        <div className="flex items-center overflow-y-auto max-h-[220px] max-w-[515px] flex-wrap">
          {classifyList.map((classify, key) => (
            <button
              key={key}
              onClick={() => {
                if (classify?.total_stock > 0) {
                  setState({
                    type: "selectedClassify",
                    payload: classify?.product_classify_id,
                  });
                }
              }}
              className={`
                ${
                  classify?.total_stock > 0
                    ? "hover:border-primary hover:text-primary cursor-pointer bg-white"
                    : "cursor-not-allowed bg-[#fafafa] text-gray-400"
                }
                
                 ${
                   selectedClassify === classify?.product_classify_id
                     ? "border-primary text-primary"
                     : ""
                 }  items-center  border-[1px] border-solid  rounded box-border inline-flex justify-center mt-2 mr-2 min-h-10 min-w-20 overflow-visible p-2 relative text-left break-words`}
            >
              <img
                loading="lazy"
                src={classify?.thumbnail}
                className="w-6 h-6"
              />
              <span className="ml-2">{classify?.product_classify_name}</span>
              {selectedClassify === classify?.product_classify_id && (
                <>
                  <div className="absolute bottom-0 right-0 size-[15px] overflow-hidden">
                    <IoCheckmarkDone />
                  </div>
                </>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-semibold">
          {sizeList[0]?.ProductSize?.type_of_size}
        </span>
        {sizeList.length > 0 && (
          <div className="flex items-center overflow-y-auto max-h-[220px] max-w-[515px] flex-wrap">
            {sizeList.map((size, key) => (
              <button
                key={key}
                onClick={() => {
                  size?.stock > 0 &&
                    setState({ type: "currentVarients", payload: size });
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
        )}
      </div>
      <div className="flex gap-2 justify-end items-center">
        <Button
          onClick={() => {
            setState({ type: "openPopover", payload: false });
          }}
        >
          TRỞ LẠI
        </Button>
        <Button
          onClick={() => {
            if (
              currentVarient?.product_varients_id !==
              item?.ProductVarient?.product_varients_id
            ) {
              handleUpdateVarient();
            } else {
              setState({ type: "openPopover", payload: false });
            }
          }}
        >
          XÁC NHẬN
        </Button>
      </div>
    </div>
  );
  const handleCancelModal = () => {
    setState({
      type: "setOpenModal",
      payload: false,
    });
  };
  const handleShowModal = () => {
    setState({
      type: "setOpenModal",
      payload: true,
    });
  };

  return (
    <>
      <div
        className={`${
          type === "invalid" && "opacity-50"
        } grid grid-cols-12 gap-3  `}
      >
        {type === "valid" && (
          <div className="col-span-1 items-center flex justify-center">
            <Checkbox
              checked={checked}
              onChange={handleCheckboxChange}
              className="checkbox-cart"
            />
          </div>
        )}

        <div className="col-span-2 items-center flex justify-center">
          <img
            loading="lazy"
            onClick={() =>
              (window.location.href = `/product-details/${item?.ProductVarient?.Product?.product_id}`)
            }
            className="size-24 cursor-pointer"
            src={
              item?.ProductVarient?.ProductClassify !== null
                ? item?.ProductVarient?.ProductClassify?.thumbnail
                : item?.ProductVarient?.Product?.thumbnail
            }
          />
        </div>
        <div className="col-span-9 relative">
          <div className="flex flex-col gap-2">
            <a
              href={`/product-details/${item?.ProductVarient?.Product?.product_id}`}
              className="text-base font-garibato font-semibold hover:text-primary text-ellipsis line-clamp-1"
              title={item?.ProductVarient?.Product?.product_name}
            >
              {item?.ProductVarient?.Product?.product_name}
            </a>
            {item?.ProductVarient?.ProductClassify !== null && (
              <Popover
                placement="bottom"
                title={text}
                content={content}
                open={openPopover}
                onOpenChange={handleOpenChange}
                trigger={["click"]}
              >
                <span className="w-fit cursor-pointer flex gap-2 items-center">
                  Phân loại hàng:{" "}
                  {item?.ProductVarient?.ProductClassify?.product_classify_name}
                  ,{" "}
                  {item?.ProductVarient?.ProductSize &&
                    item?.ProductVarient?.ProductSize?.product_size_name}{" "}
                  <DownOutlined />
                </span>
              </Popover>
            )}
          </div>
          <div className="absolute bottom-0 w-full">
            <div className="flex justify-between ">
              <div className="flex gap-2">
                <span className="flex text-lg text-primary items-center font-garibato font-bold">
                  <sup>₫</sup>
                  {item?.price?.toLocaleString("vi-VN")}
                </span>

                {((item?.ProductVarient?.sale_percents > 0 &&
                  item?.ProductVarient?.Product?.ShopRegisterFlashSales
                    ?.length === 0) ||
                  isEnoughFlashSaleStock) && (
                  <span className="flex items-center text-slate-400 line-through font-garibato italic">
                    <sup>₫</sup>
                    {(
                      item?.quantity * item?.ProductVarient?.price
                    ).toLocaleString("vi-VN")}
                  </span>
                )}
              </div>

              <div className="flex gap-4">
                {type === "valid" && (
                  <InputNumber
                    prefix="Sl: "
                    min={0}
                    max={stock}
                    defaultValue={item?.quantity}
                    value={item?.quantity}
                    onChange={handleUpdateQuantity}
                  />
                )}

                {/* <Button
                  className="border-0 hover:bg-secondary"
                  shape="circle"
                  onClick={() => {}}
                  icon={<SearchOutlined />}
                /> */}
                <Button
                  className="border-0 hover:bg-secondary text-primary"
                  shape="circle"
                  onClick={handleShowModal}
                  icon={<FaRegTrashAlt />}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 flex justify-between">
          {item?.ProductVarient?.Product?.ShopRegisterFlashSales?.length >
            0 && (
            <>
              <div className="w-fit pl-16 text-orange-500 flex gap-2 items-center">
                <ClockCircleFilled /> Flash Sale kết thúc trong{" "}
                <Countdown
                  valueStyle={{
                    color: "#ff4d4f",
                    fontSize: "18px",
                    fontWeight: 500,
                  }}
                  onFinish={() => {
                    message.warning("Flash Sale đã kết thúc");
                    dispatch(fetchCartData({ userID: user?.user_id }));
                  }}
                  value={moment(
                    item?.ProductVarient?.Product?.ShopRegisterFlashSales[0]
                      ?.FlashSaleTimeFrame?.ended_at
                  )}
                />
              </div>
              {stock <= 10 && (
                <div className="flex gap-2 items-center">
                  <span className="text-sm text-gray-400">Còn lại:</span>
                  <span className="text-sm text-primary font-semibold">
                    {stock} sản phẩm
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Modal
        title={
          <span className="text-2xl">
            <WarningFilled className="text-yellow-400" /> Xóa Sản Phẩm
          </span>
        }
        open={openModal}
        onCancel={handleCancelModal}
        onOk={handleRemoveCartItem}
        okButtonProps={{ className: "bg-primary text-white hover:opacity-80" }}
        cancelButtonProps={{
          className:
            "bg-white text-primary hover:bg-secondary hover:text-white hover:border-secondary",
        }}
        okText="Đồng ý"
        cancelText="Trở lại"
      >
        <p className="text-lg">Bạn có chắc chắn muốn xóa sản phẩm không?</p>
      </Modal>
    </>
  );
};

export default memo(CartItem);
