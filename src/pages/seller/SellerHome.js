import React from 'react';
import { Carousel } from 'antd';
import c1 from '../../assets/goat-and-the-word-flashsale.jpg';
import c2 from '../../assets/flash-sale-with-a-goat.jpg';
import MarketingContainer from '../../components/seller/marketing/MarketingContainer';
import ToDoList from '../../components/seller/statistic/ToDoList';
import { SmileOutlined, FireOutlined } from '@ant-design/icons'; // Biểu tượng từ Ant Design

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
        <div className="lg:w-[30%] flex flex-col gap-4">
          {/* Carousel */}
          <div className="bg-white shadow rounded w-full">
            <Carousel autoplay arrows className="w-full rounded overflow-hidden">
              <div>
                <img
                  src={c2}
                  alt="Banner 2"
                  className="rounded w-full object-cover h-[350px]"
                />
              </div>
              <div>
                <img
                  src={c1}
                  alt="Banner 1"
                  className="rounded w-full object-cover h-[350px]"
                />
              </div>
            </Carousel>
          </div>

          {/* Decorative Section */}
          <div className="bg-white shadow rounded p-6 flex flex-col items-center text-center gap-4">
            <SmileOutlined className="text-4xl text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-700">Hôm nay là một ngày tuyệt vời!</h3>
            <p className="text-gray-500">
              "Không có gì là không thể, bạn chỉ cần bắt đầu và nỗ lực mỗi ngày."
            </p>
            <FireOutlined className="text-4xl text-red-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerHome;
