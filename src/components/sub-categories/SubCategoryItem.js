import React, { memo } from "react";
import formatNumber from "../../helpers/formatNumber";
import topIcon from "../../assets/top-icon.png";
import { useNavigate } from "react-router-dom";
const SubCategoryItem = (props) => {
  const { item, key } = props;
  const navigate = useNavigate();
  return (
    <div
      key={key}
      className="w-[160px] flex flex-col gap-2 cursor-pointer"
      onClick={() =>
        navigate(`/top-products?sub_category_id=${item.sub_category_id}`)
      }
    >
      <div className="w-full relative h-fit">
        <img
          src={item.thumbnail}
          className="w-full rounded"
          alt={item.sub_category_name}
        />
        <img
          src={topIcon}
          alt=""
          className="absolute top-1 size-10 right-0 border-[1px] rounded-full bg-red-400"
        />
        <div
          className=" items-center bottom-0 absolute w-full text-center text-white"
          style={{ backgroundColor: "rgb(251 10 10 / 45%)" }}
        >
          Đã bán {formatNumber(item?.total_sold)}
        </div>
      </div>
      <div className="text-lg text-center text-ellipsis line-clamp-2 font-semibold">
        {item.sub_category_name}
      </div>
    </div>
  );
};

export default memo(SubCategoryItem);
