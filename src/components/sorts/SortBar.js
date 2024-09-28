import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, Pagination, Space, Typography } from "antd";
import React, { lazy, useCallback, useState } from "react";
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
      key: "ASC",
      label: "Giá: Thấp đến Cao",
    },
    {
      key: "DESC",
      label: "Giá: Cao đến Thấp",
    },
  ];
  const [selectedSort, setSelectedSort] = useState("pop");

  const handleSortChange = useCallback(
    (sort) => {
      setSelectedSort(sort);
      onFilterChange({ ...filter, sortBy: sort }); // Gọi hàm onFilterChange từ component cha
    },
    [selectedSort, filter, onFilterChange]
  );

  return (
    <>
      <div className="px-5 py-[13px] bg-neutral-200 rounded flex font-normal justify-between items-center">
        <label className="text-slate-600">Sắp xếp theo</label>
        <div className="flex gap-1 justify-start items-center">
          <Button
            className={`${
              selectedSort === "pop"
                ? "bg-primary border-primary text-white hover:opacity-80"
                : "bg-white hover:bg-primary hover:text-white hover:border-primary "
            } px-5 py-5 transition-colors duration-200 `}
            onClick={() => handleSortChange("pop")}
          >
            Phổ Biến
          </Button>
          <Button
            className={`${
              selectedSort === "cTime"
                ? "bg-primary border-primary text-white hover:opacity-80"
                : "bg-white hover:bg-primary hover:text-white hover:border-primary "
            } px-5 py-5 transition-colors duration-200 `}
            onClick={() => handleSortChange("cTime")}
          >
            Mới Nhất
          </Button>
          <Button
            className={`${
              selectedSort === "sales"
                ? "bg-primary border-primary text-white hover:opacity-80"
                : "bg-white hover:bg-primary hover:text-white hover:border-primary "
            } px-5 py-5 transition-colors duration-200 `}
            onClick={() => handleSortChange("sales")}
          >
            Bán Chạy
          </Button>
          <Dropdown
            className={` border-primary border-[1px] `}
            menu={{
              items: sortItems,
              selectable: true,
              defaultSelectedKeys: ["1"],
              onClick: ({ key }) => handleSortChange(key),
            }}
          >
            <Typography.Link className={``}>
              <Space
                className={`flex justify-between gap-[120px] w-[294.766px] ${
                  selectedSort === "ASC" || selectedSort === "DESC"
                    ? "bg-primary text-white hover:text-white hover:opacity-80"
                    : "bg-white text-primary hover:bg-primary hover:text-white"
                }`}
              >
                {selectedSort === "ASC"
                  ? "Giá: Thấp đến Cao"
                  : selectedSort === "DESC"
                  ? "Giá: Cao đến Thấp"
                  : "Giá"}
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
