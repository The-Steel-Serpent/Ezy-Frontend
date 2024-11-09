import { Button, List, Modal } from "antd";
import React, { memo, useEffect, useState } from "react";
import { getReviewOrder } from "../../services/orderService";
import VirtualList from "rc-virtual-list";
import ModalGetReviewItem from "./ModalGetReviewItem";
import { set } from "lodash";
const ModalGetReview = (props) => {
  const { orders, openModalGetReview, onCloseModalGetReview } = props;
  const [reviews, setReviews] = useState([]);
  const [orderWithReview, setOrderWithReview] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await getReviewOrder(orders.user_order_id);
        console.log(res);
        if (res.success) {
          setReviews(res.reviews);
        }
      } catch (error) {
        console.log("Error when fetchReviews", error);
      }
    };
    if (openModalGetReview) {
      console.log(orders);
      fetchReviews();
    }
  }, [openModalGetReview]);
  useEffect(() => {
    if (reviews.length > 0) {
      let orderWithReview = orders.UserOrderDetails.map((orderItem) => {
        const review = reviews.find(
          (review) =>
            review.product_varients_id === orderItem.product_varients_id
        );
        return {
          ...orderItem,
          rating: review?.rating || 0,
          review_content: review?.review_content || "",
          review_created_at: review?.created_at || "",
        };
      });
      setOrderWithReview(orderWithReview);
    }
  }, [reviews]);

  const handleOnClose = () => {
    onCloseModalGetReview();
    setOrderWithReview([]);
    setReviews([]);
  };

  return (
    <Modal
      width={800}
      open={openModalGetReview}
      onCancel={handleOnClose}
      onClose={handleOnClose}
      closable={false}
      title={
        <span className="text-2xl font-semibold capitalize">
          Xem Lại Đánh giá sản phẩm
        </span>
      }
      footer={
        <div className="w-full flex justify-end items-center gap-3">
          <Button
            size="large"
            className="text-secondary border-secondary hover:text-white hover:bg-secondary"
            onClick={handleOnClose}
          >
            Trở Lại
          </Button>
        </div>
      }
    >
      <List>
        <VirtualList data={orderWithReview} itemHeight={388} height={430}>
          {(item) => (
            <List.Item>
              <ModalGetReviewItem item={item} />
            </List.Item>
          )}
        </VirtualList>
      </List>
    </Modal>
  );
};

export default memo(ModalGetReview);
