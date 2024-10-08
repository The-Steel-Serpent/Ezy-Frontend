import React from 'react'
import { LoadingOutlined } from '@ant-design/icons';
import { Flex, Spin, Modal } from 'antd';
const LoadingModal = () => {
  return (
    <div>
        <Modal
            title={null}
            open={true}
            footer={null}
            closable={false}
            centered
            width={100}
        >
            <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </Modal>
    </div>
  )
}

export default LoadingModal