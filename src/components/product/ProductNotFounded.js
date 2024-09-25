import React from "react";
import { AiOutlineFileSearch } from "react-icons/ai";

const ProductNotFounded = () => {
  return (
    <div className="p-60 flex justify-center items-center">
      <div className="flex flex-col items-center">
        <AiOutlineFileSearch size={100} className="text-slate-700" />
        <span className="text-lg mt-2 text-slate-700">
          Không tìm thấy sản phẩm
        </span>
      </div>
    </div>
  );
};

export default ProductNotFounded;
