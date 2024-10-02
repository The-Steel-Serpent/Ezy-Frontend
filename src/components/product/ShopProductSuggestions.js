import React from "react";
import ProductsWithPanigation from "../../components/product/ProductsWithPanigation";

const ShopProductSuggestions = (props) => {
  const { listSuggest, currentPage, totalPage, handlePageChange } = props;
  return (
    <div className="max-w-[1200px] mx-auto py-20">
      <div className="flex relative w-full mb-20">
        <div className="text-center bg-primary text-white cursor-default inline-block translate-x-[-50%] -translate-y-[50%] text-xl font-medium absolute left-[50%] py-[1.125rem] px-5 select-none z-[1] rounded-md">
          GỢI Ý HÔM NAY
        </div>
        <hr className="absolute w-full top-[50%] left-0" />
      </div>
      <div className="w-full">
        <ProductsWithPanigation
          list={listSuggest}
          currentPage={currentPage}
          totalPage={totalPage}
          onPageChange={handlePageChange}
          itemsPerRow={6}
        />
      </div>
    </div>
  );
};

export default ShopProductSuggestions;
