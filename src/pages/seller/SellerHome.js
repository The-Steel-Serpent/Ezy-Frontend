import React from 'react'
import { Carousel } from 'antd';
import c1 from '../../assets/c1.jpg'
import c2 from '../../assets/c2.png'
import MarketingContainer from '../../components/seller/marketing/MarketingContainer';
const SellerHome = () => {
  return (
    <>
      <div className='w-full flex gap-2'>
        <div className='lg:min-w-[70%]'>
          <div className='bg-white rounded m-2 p-2'>Danh sách cần làm</div>
          <div className='bg-white rounded m-2 p-2'>Phân tích bán hàng</div>
          <div className='bg-white rounded m-2 p-2'>
            <MarketingContainer />
          </div>
        </div>
        <div className='w-[30%] flex items-center lg:block'>
          <Carousel arrows autoplay>
            <div>
              <img 
                src={c1}
                className='rounded w-96 h-44'
              />
            </div>
            <div>
              <img
                src={c2}
                className='rounded w-96 h-44'
              />
            </div>
          </Carousel>
           <Carousel arrows autoplay>
            <div>
              <img 
                src={c1}
                className='rounded w-96 h-44'
              />
            </div>
            <div>
              <img
                src={c2}
                className='rounded w-96 h-44'
              />
            </div>
          </Carousel>
        </div>
      </div>
    </>
  )
}

export default SellerHome