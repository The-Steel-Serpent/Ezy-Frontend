import { Button, List, message, Modal } from "antd";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import ModalReviewItem from "./ModalReviewItem";
import VirtualList from "rc-virtual-list";
import { set } from "lodash";
import { reviewOrder } from "../../services/orderService";
const ModalReview = (props) => {
  const { orders, openModalReview, onCloseModalReview, onUpdateOrder } = props;

  const [resetTrigger, setResetTrigger] = useState(false);
  const reviewsRef = useRef([]);
  const validateRef = useRef([]);
  const handleCloseModalReview = useCallback(() => {
    setResetTrigger((prev) => !prev);
    onCloseModalReview();
    reviewsRef.current = [];
    validateRef.current = [];
  }, [onCloseModalReview]);

  const handleConfirmReview = useCallback(async () => {
    const tempValidate = [];
    if (reviewsRef.current.length === 0) {
      message.warning("Vui lòng đánh giá sản phẩm");
      return;
    }
    reviewsRef.current.forEach((review, index) => {
      const errors = {};
      if (review.rating === 0) {
        errors.rating = "Vui lòng đánh giá sản phẩm";
      }
      if (review.review === "") {
        errors.review = "Vui lòng nhập đánh giá";
      } else if (review.review.length < 30) {
        errors.review = "Đánh giá phải từ 30 ký tự trở lên";
      } else if (review.review.length > 120) {
        errors.review = "Đánh giá phải từ 120 ký tự trở xuống";
      }

      if (Object.keys(errors).length > 0) {
        tempValidate[index] = errors;
      }
    });
    console.log(tempValidate);
    if (tempValidate.length > 0) {
      validateRef.current = tempValidate;
      message.error("Vui lòng kiểm tra lại thông tin đánh giá");
      return;
    }
    validateRef.current = [];
    try {
      const res = await reviewOrder(
        orders.user_order_id,
        orders.user_id,
        reviewsRef.current
      );
      if (res.success) {
        message.success("Đánh giá sản phẩm thành công");
        onUpdateOrder();
        handleCloseModalReview();
      }
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại sau");
    }
  }, []);
  return (
    <Modal
      title={
        <span className="text-2xl font-semibold capitalize">
          Đánh giá sản phẩm
        </span>
      }
      open={openModalReview}
      closable={false}
      width={800}
      onCancel={handleCloseModalReview}
      onClose={handleCloseModalReview}
      footer={
        <div className="w-full flex justify-end items-center gap-3">
          <Button
            size="large"
            className="text-secondary border-secondary hover:text-white hover:bg-secondary"
            onClick={handleCloseModalReview}
          >
            Trở Lại
          </Button>
          <Button
            size="large"
            className="text-white bg-primary border-primary hover:opacity-80"
            onClick={handleConfirmReview}
          >
            Hoàn Thành
          </Button>
        </div>
      }
    >
      <List>
        <VirtualList
          data={orders?.UserOrderDetails}
          itemHeight={400}
          height={450}
        >
          {(item, index) => (
            <List.Item>
              <ModalReviewItem
                item={item}
                resetTrigger={resetTrigger}
                onSave={(data) => (reviewsRef.current[index] = data)}
                validateRef={validateRef.current[index]}
              />
            </List.Item>
          )}
        </VirtualList>
      </List>
    </Modal>
  );
};

export default memo(ModalReview);
