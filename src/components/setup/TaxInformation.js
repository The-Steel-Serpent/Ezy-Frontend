import { Button, Col, Row } from 'antd'
import React from 'react'
import { useLocation } from 'react-router-dom'

const TaxInformation = () => {
  const location = useLocation();
  const isSellerSetupPath = location.pathname === '/seller/seller-setup';
  return (
    <div>
      <div className='flex justify-between'>
        <h3 className='text-lg font-semibold'>Thông tin thuế</h3>
        {!isSellerSetupPath && (
          <div className='flex gap-2'>
            <Button>
              Chỉnh sửa
            </Button>
          </div>
        )}
      </div>
      <div className='mt-5 ml-10 mb-20'>
        <Row gutter={12}>
          <Col span={4} className='flex justify-end font-semibold text-sm'>Loại hình kinh doanh</Col>
          <Col span={20}>Cá nhân</Col>
        </Row>
        <Row gutter={12} className='mt-5'>
          <Col span={4} className='flex justify-end font-semibold  text-sm'>Địa chỉ Shop</Col>
          <Col span={20}>29 Nguyễn Hồng Đào, Phường 14, Quận Tân Bình, TP. Hồ Chí Minh</Col>
        </Row>
        <Row gutter={12} className='mt-5'>
          <Col span={4} className='flex justify-end font-semibold  text-sm'>Email</Col>
          <Col span={20}>tungbeobede@gmail.com</Col>
        </Row>
        <Row gutter={12} className='mt-5'>
          <Col span={4} className='flex justify-end font-semibold  text-sm'>Mã số thuế</Col>
          <Col span={20}>-</Col>
        </Row>
      </div>
    </div>
  )
}

export default TaxInformation