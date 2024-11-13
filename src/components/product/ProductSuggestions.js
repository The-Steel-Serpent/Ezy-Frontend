import { Button, Skeleton } from "antd";
import { motion } from "framer-motion";
import React, { Suspense, useEffect, useState } from "react";

import axios from "axios";
import { useSelector } from "react-redux";

const ProductCard = React.lazy(() => import("./ProductCard"));
const ProductSuggestions = () => {
  const user = useSelector((state) => state.user);
  const [suggestProducts, setSuggestProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/suggest-products-limit?user_id=${user?.user_id}`
        );
        if (res.data.success) {
          setSuggestProducts(res.data.data);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-[1200px] m-auto ">
      <motion.div className="grid grid-cols-12 place-items-center">
        {suggestProducts.map((value, key) => {
          return (
            <Suspense
              fallback={
                <Skeleton.Image className="lg:w-48 lg:h-[261px] mt-3 lg:col-span-2" />
              }
            >
              <ProductCard loading={loading} value={value} />
            </Suspense>
          );
        })}
      </motion.div>
      <div className="flex justify-center items-center w-full ">
        <Button
          size="large"
          className="lg:max-w-[390px] w-full my-4"
          onClick={() => window.location.replace("/suggest-products")}
        >
          Xem Thêm
        </Button>
      </div>
    </div>
  );
};

export default React.memo(ProductSuggestions);
