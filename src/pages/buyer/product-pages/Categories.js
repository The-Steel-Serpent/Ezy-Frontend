import React, { lazy, Suspense, useEffect } from "react";
import { useParams } from "react-router-dom";
const SortBar = lazy(() => import("../../../components/sorts/SortBar"));
const Categories = () => {
  const { cat_id } = useParams();

  useEffect(() => {
    const fetchProductByCategory = async () => {};
    fetchProductByCategory();
  }, [cat_id]);
  return (
    <div className="max-w-[1200px] mx-auto grid grid-cols-12 py-10">
      <div className="col-span-3">
        <div className="w-[190px]">Hehe</div>
      </div>
      <div className="col-span-9">
        <section className="">
          <Suspense fallback={<div>Loading...</div>}>
            <SortBar />
          </Suspense>
        </section>
      </div>
    </div>
  );
};

export default Categories;
