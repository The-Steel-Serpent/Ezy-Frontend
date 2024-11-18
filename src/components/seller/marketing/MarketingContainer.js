import { Menu } from 'antd'
import React, { useReducer } from 'react'
import FlashSaleItem from './FlashSaleItem'
import SaleEventsItem from './SaleEventsItem'
const MarketingContainer = () => {

    const [localState, setLocalState] = useReducer(
        (state, action) => {
            switch (action.type) {
                case 'SET_CURRENT_COMPONENT':
                    return { ...state, currentComponent: action.payload };
                default:
                    return state;
            }
        },
        {
            currentComponent: 'flashSale',
        }
    )

    const handleMenuClick = (e) => {
        setLocalState({ type: 'SET_CURRENT_COMPONENT', payload: e.key });
    }

    return (
        <div>
            <h3 className='text-2xl font-semibold'>Kênh Marketing</h3>
            <Menu
                className="custom-menu-seller-product font-[500] mt-6 bg-transparent bg-white"
                mode="horizontal"
                onClick={handleMenuClick}
                selectedKeys={[localState.currentComponent]}>
                <Menu.Item key="flashSale" className='text-lg'>Ezy Flash Sale</Menu.Item>
                <Menu.Item key="voucher" className='text-lg'>Chương trình giảm giá</Menu.Item>
            </Menu>
            <div>
                {localState.currentComponent === 'flashSale' && <FlashSaleItem />}
                {localState.currentComponent === 'voucher' && <SaleEventsItem />}
            </div>
        </div>
    )
}

export default MarketingContainer