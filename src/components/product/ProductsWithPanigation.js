import React, { Suspense } from "react";
import { Pagination, Skeleton } from "antd";
const ProductCard = React.lazy(() => import("./ProductCard"));

const ProductsWithPanigation = ({
  list = [],
  currentPage,
  totalPage,
  onPageChange,
  itemsPerRow = 6,
}) => {
  const productList = Array.isArray(list) ? list : [];
  return (
    <>
      <div className="flex flex-col gap-10">
        <div
          className={`grid ${
            itemsPerRow === 6 ? "grid-cols-12" : `grid-cols-10`
          }  place-items-center`}
        >
          {productList.map((value, key) => (
            <Suspense fallback={<Skeleton.Image />}>
              <ProductCard key={key} value={value} itemsPerRow={itemsPerRow} />
            </Suspense>
          ))}
        </div>
        <Pagination
          align="center"
          defaultCurrent={currentPage}
          total={productList.length || 0}
          onChange={(page, pageSize) => onPageChange(page)}
        />
      </div>
    </>
  );
};

export default ProductsWithPanigation;
