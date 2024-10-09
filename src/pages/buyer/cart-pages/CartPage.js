import React from "react";
import CartCarousel from "../../../components/cart/CartCarousel";

const CartPage = () => {
  return (
    <div className="max-w-[1400px] grid grid-cols-12 py-4 px-[45px] mx-auto">
      <section className="col-span-8">
        <CartCarousel />
      </section>
      <section className="col-span-4"></section>
    </div>
  );
};

export default CartPage;
