import { Avatar, Flex, Typography, Dropdown, Space } from 'antd';
import React from 'react';
import { MessageOutlined, NotificationOutlined, UserOutlined, DownOutlined } from '@ant-design/icons';

const AdminHeader = ({ onLogout, user }) => {
    const items = [
        {
            key: "1",
            label: <a href="/admin/account?type=profile">Tài Khoản Của Tôi</a>,
          },
        {
            key: '2',
            label: 'Logout',
            onClick: onLogout,
        },
    ];

    const handleDropdownClick = (item) => {
        if (item.key === '2') {
            onLogout(); // Gọi hàm đăng xuất
        } else {
            console.log(`Clicked on ${item.label}`);
        }
    };

    return (
        <Flex 
            align="center" 
            justify="space-between" 
            style={{ 
                height: '52px', 
                padding: '0 20px', 
                backgroundColor: '#66CCE6' 
            }}
        >
            <Typography.Title 
                level={2} 
                style={{ 
                    color: '#fff', 
                    margin: 0 
                }}
            >
                Kênh quản trị
            </Typography.Title>
            <Flex 
                align="center" 
                gap="20px" 
                style={{ 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center'
                }}
            >
                {/* <NotificationOutlined 
                    className='header-icon' 
                    style={{ 
                        fontSize: '20px', 
                        color: '#fff', 
                        cursor: 'pointer' 
                    }} 
                />
                <MessageOutlined 
                    className='header-icon' 
                    style={{ 
                        fontSize: '20px', 
                        color: '#fff', 
                        cursor: 'pointer' 
                    }} 
                /> */}
                <Dropdown
                    menu={{
                        items,
                        onClick: handleDropdownClick,
                    }}
                >
                    <a onClick={(e) => e.preventDefault()}>
                        <Space 
                            className="bg-transparent" 
                            style={{ 
                                backgroundColor: 'transparent'
                            }}
                        >
                            <Avatar 
                                src={user?.avt_url}
                                icon={!user?.avt_url && <UserOutlined />}
                                style={{ 
                                    border: '2px solid #fff',
                                    boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
                                }}
                            />
                            <span style={{ 
                                color: '#fff', 
                                fontSize: '15px' 
                            }}>
                                {user?.full_name || 'Admin'}
                            </span>
                            <DownOutlined style={{ 
                                color: '#fff' 
                            }} />
                        </Space>
                    </a>
                </Dropdown>
            </Flex>
        </Flex>
    );
}

export default AdminHeader;
