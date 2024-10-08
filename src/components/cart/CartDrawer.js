import { Drawer } from "antd";
import React, { memo } from "react";

const CartDrawer = (props) => {
  const { onShowCartDrawer } = props;
  return (
    <Drawer
      width={720}
      placement="right"
      closable={false}
      onClose={() => onShowCartDrawer(false)}
      open={() => onShowCartDrawer()}
    >
      <h1> hehe</h1>
    </Drawer>
  );
};

export default memo(CartDrawer);
