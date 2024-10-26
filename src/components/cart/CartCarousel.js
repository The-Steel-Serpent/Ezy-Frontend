import {
  Button,
  Checkbox,
  Input,
  List,
  message,
  Modal,
  notification,
} from "antd";
import React, { memo, useCallback, useEffect, useReducer } from "react";
import VirtualList from "rc-virtual-list";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartData, updateCartItems } from "../../redux/cartSlice";
import CartShop from "./CartShop";
import CartItem from "./CartItem";
import {
  removeAllItems,
  updateAllItemsOfShop,
  updateSelectedAll,
} from "../../services/cartService";
import { WarningFilled } from "@ant-design/icons";

const CartCarousel = () => {
  const user = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart.cart);
  const invalidItems = useSelector((state) => state.cart.invalidItems);
  const dispatch = useDispatch();
  const [state, setState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "setSelectAll":
          return { ...state, selectAll: action.payload };
        case "setOpenModal":
          return { ...state, openModal: action.payload };
        default:
          return state;
      }
    },
    {
      selectAll: false,
      openModal: false,
    }
  );
  const [modal, contextHolder] = Modal.useModal();
  useEffect(() => {
    const fetchCart = async () => {
      const userID = user?.user_id;
      dispatch(await fetchCartData({ userID }));
    };
    if (user?.user_id !== "") {
      fetchCart();
    }
  }, [dispatch, user?.user_id]);
  const { selectAll, openModal } = state;
  const handleSelectAllChange = useCallback(
    async (e) => {
      const checked = e.target.checked === true ? 1 : 0;
      try {
        await updateSelectedAll(cart?.[0]?.cart_id, checked);
        dispatch(fetchCartData({ userID: user?.user_id }));
      } catch (error) {
        console.log("Lỗi khi cập nhật select all: ", error);
      }
    },
    [dispatch, user?.user_id, cart]
  );

  const handleShopSelectChange = useCallback(
    async (cart_shop_id, checked) => {
      try {
        await updateAllItemsOfShop(cart_shop_id, checked);
        dispatch(fetchCartData({ userID: user?.user_id }));
      } catch (error) {
        console.log("Lỗi khi cập nhật select all: ", error);
      }
    },
    [dispatch, user?.user_id]
  );

  useEffect(() => {
    const allSelected = cart?.every((item) => item.selected === 1);
    setState({
      type: "setSelectAll",
      payload: allSelected,
    });
  }, [cart, dispatch]);
  const handleDestroyCart = async () => {
    try {
      const res = await removeAllItems(cart?.[0]?.cart_id);
      if (res.success) {
        notification.success({
          message: "Xóa giỏ hàng thành công",
          showProgress: true,
          pauseOnHover: false,
        });
        dispatch(fetchCartData({ userID: user?.user_id }));
      }
    } catch (error) {
      console.log("Lỗi khi xóa giỏ hàng: ", error);
      notification.error({
        message: error.message,
        showProgress: true,
        pauseOnHover: false,
      });
    }
  };
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
      <div className="w-full flex flex-col gap-3">
        <div className="flex justify-between items-center shadow p-3 rounded border-[1px] bg-white">
          <div className="w-fit flex items-center gap-3 ">
            <Checkbox
              className="checkbox-cart"
              checked={selectAll}
              onChange={handleSelectAllChange}
            />
            <span className=" text-lg text-primary font-garibato">Tất cả</span>
          </div>
          {selectAll && (
            <Button className="" onClick={handleShowModal}>
              Xóa Tất Cả
            </Button>
          )}
        </div>
        <div className="w-full rounded flex flex-col gap-3">
          {cart?.length > 0 &&
            cart?.map((item) => {
              return (
                <div className="bg-white  rounded" key={item.id}>
                  <CartShop
                    item={item}
                    onShopSelectedChange={handleShopSelectChange}
                  />
                </div>
              );
            })}
        </div>
        {invalidItems?.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="w-full bg-white rounded py-3 px-3">
              <span className="text-lg text-black font-garibato">
                Danh Sách Sản Phẩm Không Hoạt Động
              </span>
            </div>
            <div className="w-full rounded flex flex-col">
              {invalidItems?.length > 0 &&
                invalidItems?.map((item) => {
                  return (
                    <div className="bg-white  rounded p-3" key={item.id}>
                      <CartItem item={item} type="invalid" />
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      <Modal
        title={
          <span className="text-2xl">
            <WarningFilled className="text-yellow-400" /> Xóa Giỏ Hàng
          </span>
        }
        open={openModal}
        onCancel={handleCancelModal}
        onOk={handleDestroyCart}
        okButtonProps={{ className: "bg-primary text-white hover:opacity-80" }}
        cancelButtonProps={{
          className:
            "bg-white text-primary hover:bg-secondary hover:text-white hover:border-secondary",
        }}
        okText="Đồng ý"
        cancelText="Trở lại"
      >
        <p className="text-lg">Bạn có chắc chắn muốn xóa giỏ hàng không?</p>
      </Modal>
    </>
  );
};

export default memo(CartCarousel);
