import { Avatar, Flex, Typography } from 'antd'
import React from 'react'
import { MessageOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons'
const AdminHeader = () => {
    return (
        <Flex align="center" justify="space-between">
            <Typography.Title level={2} style={{ color: '#fff' }}>Kênh quản trị</Typography.Title>
            <Flex align="center" gap="3rem">

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