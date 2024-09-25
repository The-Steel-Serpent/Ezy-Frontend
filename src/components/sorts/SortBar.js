import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, Pagination, Space, Typography } from "antd";
import React, { lazy } from "react";
import withChildSuspense from "../../hooks/HOC/withChildSuspense";
const ProductsWithPanigation = withChildSuspense(
  lazy(() => import("../../components/product/ProductsWithPanigation"))
);

const Sorts = () => {
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
  return (
    <>
      <div className="px-5 py-[13px] bg-neutral-200 rounded flex font-normal justify-between items-center">
        <label className="text-slate-600">Sắp xếp theo</label>
        <div className="flex gap-1 justify-start items-center">
          <Button className="px-5 py-5 hover:bg-primary hover:text-white hover:border-primary transition-colors duration-200 ">
            Phổ Biến
          </Button>
          <Button className="px-5 py-5 hover:bg-primary hover:text-white hover:border-primary transition-colors duration-200">
            Mới Nhất
          </Button>
          <Button className="px-5 py-5 hover:bg-primary hover:text-white hover:border-primary transition-colors duration-200">
            Bán Chạy
          </Button>
          <Dropdown
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
        <Pagination simple defaultCurrent={2} total={50} />
      </div>
      <div className="w-full"></div>
    </>
  );
};

export default Sorts;
