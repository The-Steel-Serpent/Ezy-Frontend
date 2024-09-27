import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, Pagination, Space, Typography } from "antd";
import React, { lazy, useState } from "react";
import withChildSuspense from "../../hooks/HOC/withChildSuspense";
import { useParams } from "react-router-dom";
const ProductsWithPanigation = withChildSuspense(
  lazy(() => import("../../components/product/ProductsWithPanigation"))
);
const ProductNotFounded = withChildSuspense(
  lazy(() => import("../../components/product/ProductNotFounded"))
);
const Sorts = (props) => {
  const {
    listProductByCategory = [],
    currentPage,
    totalPage,
    onPageChange,
    onFilterChange,
    filter,
  } = props;
  const sortItems = [
    {
      key: "1",
      label: "Giá: Thấp đến Cao",
    },
    {
      key: "2",
      label: "Giá: Cao đến Thấp",
    },
  ];
  const [selectedSort, setSelectedSort] = useState("pop");

  const handleSortChange = (sort) => {
    setSelectedSort(sort);
    onFilterChange({ ...filter, sortBy: sort }); // Gọi hàm onFilterChange từ component cha
  };

  return (
    <>
      <div className="px-5 py-[13px] bg-neutral-200 rounded flex font-normal justify-between items-center">
        <label className="text-slate-600">Sắp xếp theo</label>
        <div className="flex gap-1 justify-start items-center">
          <Button
            className="px-5 py-5 bg-white hover:bg-primary hover:text-white hover:border-primary transition-colors duration-200 "
            onClick={() => handleSortChange("pop")}
          >
            Phổ Biến
          </Button>
          <Button
            className="px-5 py-5 bg-white hover:bg-primary hover:text-white hover:border-primary transition-colors duration-200"
            onClick={() => handleSortChange("cTime")}
          >
            Mới Nhất
          </Button>
          <Button
            className="px-5 py-5 bg-white hover:bg-primary hover:text-white hover:border-primary transition-colors duration-200"
            onClick={() => handleSortChange("sales")}
          >
            Bán Chạy
          </Button>
          <Dropdown
            className="border-primary border-[1px] text-primary"
            menu={{
              items: sortItems,
              selectable: true,
              defaultSelectedKeys: ["1"],
            }}
          >
            <Typography.Link className="text-black">
              <Space className="flex justify-between gap-[120px]">
                Giá
                <DownOutlined />
              </Space>
            </Typography.Link>
          </Dropdown>
        </div>
        <Pagination
          simple
          defaultCurrent={currentPage}
          current={currentPage}
          pageSize={2}
          total={totalPage * 2}
          onChange={onPageChange}
        />
      </div>
      <div className="w-full">
        {listProductByCategory?.length > 0 ? (
          <ProductsWithPanigation
            list={listProductByCategory}
            currentPage={currentPage}
            itemsPerRow={5}
            totalPage={totalPage}
            onPageChange={onPageChange}
          />
        ) : (
          <ProductNotFounded />
        )}
      </div>
    </>
  );
};

export default Sorts;
