import React, { useEffect } from 'react'
import {  Menu } from 'antd';
import "../../../styles/seller.css"
import { useNavigate } from 'react-router-dom';
const items = [
    {
        key: '/seller/order/all',
        label: 'Tất cả',

    },
    {
        key: 'sub2',
        label: 'Chờ xác nhận'
    },
    {
        key: 'sub3',
        label: 'Chờ lấy hàng'
    },
    {
        key: 'sub4',
        label: 'Đang giao'
    },
    {
        key: 'sub5',
        label: 'Đã giao'
    },
    {
        key: '/seller/order/ordercancelled',
        label: 'Đơn hủy'
    },
    {
        key: 'sub7',
        label: 'Trả hàng/Hoàn tiền'
    },
    {
        key: 'sub8',
        label: 'Giao không thành công'
    }
];
const OrderStatus = ({ status }) => {
    const navigate = useNavigate();

    const handleNavigate = (e) => {
        if (e.key) {
            navigate(e.key)
        }
    }
    useEffect(() => {
        console.log('status',status);
    }, [])
    return (
        <div>
            <div className='pt-4 pl-4 flex justify-between'>
                <h5 className='text-lg '>Tất cả</h5>
                <div className='flex gap-3 mr-3'>
                    <button className='border rounded px-4 py-2 hover:bg-slate-100'>Xuất</button>
                    <button className='border rounded px-4 py-2 hover:bg-slate-100'>Lịch sử xuất báo cáo</button>
                </div>
            </div>
            <Menu
                defaultOpenKeys={['sub1', 'sub2']}
                defaultSelectedKeys={status}
                mode="horizontal"
                theme="light"
                items={items}
                className="custom-menu-order-status font-[500]"
                onClick={handleNavigate}
            />
        </div>
    )
}

export default OrderStatus