import { Avatar, Flex, Typography } from 'antd'
import React from 'react'
import Search from 'antd/es/transfer/search'
import { MessageOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons'
const AdminHeader = () => {
    return (
        <Flex align="center" justify="space-between">
            <Typography.Title level={3} type="secondary">Kênh quản trị</Typography.Title>
            <Flex align="center" gap="3rem">
                <Search placeholder="Tìm kiếm" allowClear />
                <Flex align="center" gap="10px">
                    <NotificationOutlined className='header-icon' />
                    <MessageOutlined className='header-icon' />
                    <Avatar icon={<UserOutlined />} />
                </Flex>
            </Flex>
        </Flex>
    )
}

export default AdminHeader