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
  const handleCloseModalReview = useCallback(() => {
    setResetTrigger((prev) => !prev);
    onCloseModalReview();
  }, [onCloseModalReview]);

  const handleConfirmReview = useCallback(async () => {
    console.log(reviewsRef.current);
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
          itemHeight={388}
          height={430}
        >
          {(item, index) => (
            <List.Item>
              <ModalReviewItem
                item={item}
                resetTrigger={resetTrigger}
                onSave={(data) => (reviewsRef.current[index] = data)}
              />
            </List.Item>
          )}
        </VirtualList>
      </List>
    </Modal>
  );
};

export default memo(ModalReview);
