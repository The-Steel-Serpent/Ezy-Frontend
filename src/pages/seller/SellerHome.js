import React from 'react';
import { Carousel } from 'antd';
import c1 from '../../assets/goat-and-the-word-flashsale.jpg';
import c2 from '../../assets/flash-sale-with-a-goat.jpg';
import MarketingContainer from '../../components/seller/marketing/MarketingContainer';
import ToDoList from '../../components/seller/statistic/ToDoList';
const SellerHome = () => {
  return (
    <div className="w-full bg-gray-100">
      <div className="w-full flex flex-col lg:flex-row gap-4">
        {/* Left Section */}
        <div className="lg:w-[70%] flex flex-col gap-4">
          <div className="bg-white shadow rounded p-4">
            <h2 className="text-lg font-semibold mb-2">Danh sách cần làm</h2>
            <span className="text-gray-600">Những việc bạn sẽ phải làm.</span>
            <ToDoList />
          </div>
          <div className="bg-white shadow rounded p-4">
            <h2 className="text-lg font-semibold mb-2">Chiến dịch Marketing</h2>
            <MarketingContainer />
          </div>
        </div>

        {/* Right Section */}
        <div className="lg:w-[30%] flex justify-center items-center lg:items-start">
          <div className="bg-white shadow rounded w-full">
            <Carousel autoplay arrows className="w-full rounded overflow-hidden">
              <div>
                <img
                  src={c1}
                  alt="Banner 1"
                  className="rounded w-full object-cover h-[350px]"
                />
              </div>
              <div>
                <img
                  src={c2}
                  alt="Banner 2"
                  className="rounded w-full object-cover h-[350px]"
                />
              </div>
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerHome;
