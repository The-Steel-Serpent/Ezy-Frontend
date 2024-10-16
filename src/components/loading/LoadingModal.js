import React from 'react'
import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Modal } from 'antd';
const LoadingModal = ({ visible }) => {
  return (
    <Modal open={visible} footer={null} closable={false} centered>
      <div className="flex flex-col justify-center items-center h-full">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        <p>Vui lòng đợi trong giây lát</p>
      </div>
    </Modal>
  )
}

export default LoadingModal