import { Rate } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { memo, useCallback, useEffect, useReducer } from "react";
const desc = ["Tệ", "Không Hài Lòng", "Bình Thường", "Hài Lòng", "Tuyệt Vời"];
const ModalReviewItem = (props) => {
  const { item, resetTrigger, onSave } = props;

  const [localState, setLocalState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "rating":
          return { ...state, rating: action.payload };
        case "review":
          return { ...state, review: action.payload };
        default:
          return state;
      }
    },
    {
      rating: 5,
      review: "",
    }
  );

  const handleViewProduct = () => {
    window.location.href = `/product-details/${item.ProductVarient.Product.product_id}`;
  };

  const handleRating = useCallback((value) => {
    setLocalState({ type: "rating", payload: value });
  }, []);
  const handleOnTextAreaChange = useCallback((e) => {
    const value = e.target.value;
    setLocalState({ type: "review", payload: value });
  }, []);

  useEffect(() => {
    if (resetTrigger) {
      setLocalState({ type: "rating", payload: 5 });
      setLocalState({ type: "review", payload: "" });
    }
  }, [resetTrigger]);

  useEffect(() => {
    onSave({
      product_varients_id: item.ProductVarient.product_varients_id,
      rating: localState.rating,
      review: localState.review,
    });
  }, [
    item.ProductVarient.product_varients_id,
    localState.rating,
    localState.review,
    onSave,
  ]);

  return (
    <div className="w-full flex flex-col gap-4">
      <div
        className="flex gap-2 items-start cursor-pointer"
        onClick={handleViewProduct}
      >
        <img
          className="size-20 rounded border-2 border-solid border-neutral-300"
          src={item.thumbnail}
          alt={item.varient_name}
        />
        <div className="flex flex-col">
          <span className="text-base font-semibold line-clamp-2 text-ellipsis">
            {item.varient_name}
          </span>
          <span className="text-sm text-neutral-500">
            Phân Loại Hàng: {item.classify}
          </span>
        </div>
      </div>
      <div className="flex justify-start items-center gap-5">
        <span className="font-semibold text-lg text-neutral-500">
          Chất lượng sản phẩm
        </span>
        <Rate
          className="text-[40px]"
          value={localState.rating}
          onChange={handleRating}
        />
        <span
          className={`text-xl ${
            localState.rating >= 3 ? "text-primary" : "text-red-700"
          } `}
        >
          {localState.rating ? desc[localState.rating - 1] : ""}
        </span>
      </div>

      <TextArea
        autoSize={{
          minRows: 8,
          maxRows: 12,
        }}
        value={localState.review}
        onChange={handleOnTextAreaChange}
        className="text-lg"
        placeholder="Hãy chia sẻ những điều bạn thích về những người mua khác nhé"
      />
    </div>
  );
};

export default memo(ModalReviewItem);
