import { Button, List, Modal } from "antd";
import React, { memo, useEffect, useReducer } from "react";
import ShippingFeeItem from "./ShippingFeeItem";

const ModalShippingFees = (props) => {
  const {
    openModalShippingFees,
    defaultService,
    serviceList,
    handleCancelModalShippingFees,
    handleSelectService,
  } = props;

  const [state, setState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "currentService":
          return { ...state, currentService: action.payload };
        default:
          return state;
      }
    },
    {
      currentService: null,
    }
  );

  const { currentService } = state;

  const handleSetCurrentService = (service) => {
    setState({ type: "currentService", payload: service });
  };

  useEffect(() => {
    if (defaultService) {
      handleSetCurrentService(defaultService);
    }
  }, [defaultService]);

  return (
    <>
      <Modal
        open={openModalShippingFees}
        onCancel={handleCancelModalShippingFees}
        onClose={handleCancelModalShippingFees}
        title={
          <span className="text-lg font-semibold">Hình Thức Vận Chuyển</span>
        }
        footer={
          <div className="w-full flex justify-end items-center gap-3">
            <Button
              onClick={handleCancelModalShippingFees}
              className="bg-white border-secondary text-secondary hover:bg-secondary hover:text-white"
            >
              Trở Lại
            </Button>
            <Button
              className="bg-primary text-white border-primary hover:opacity-80"
              onClick={() => {
                handleSelectService(currentService);
              }}
            >
              HOÀN THÀNH
            </Button>
          </div>
        }
      >
        <List
          dataSource={serviceList}
          renderItem={(item, index) => (
            <List.Item>
              <ShippingFeeItem
                isSelected={currentService?.service_id === item?.service_id}
                item={item}
                handleSelectService={() => handleSetCurrentService(item)}
              />
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
};

export default memo(ModalShippingFees);
