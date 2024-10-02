import React, { useState } from 'react'
import { Button, message, Steps, theme, Result } from 'antd';
import BasicShopInformation from '../../components/setup/BasicShopInformation';
import TaxInformation from '../../components/setup/TaxInformation';
import { SmileOutlined } from '@ant-design/icons';
import logo from '../../assets/onboarding-setup.png'

const steps = [
    {
        title: 'Thông tin shop',
        content: <BasicShopInformation />,
    },
    {
        title: 'Thông tin thuế',
        content: <TaxInformation />,
    },
    {
        title: 'Hoàn tất',
        content: <Result
            icon={<SmileOutlined />}
            title="Đã hoàn tất hồ sơ"
            extra={<Button type="primary">Tiếp theo</Button>}
        />,
    },
];


const SellerSetup = () => {
    const [current, setCurrent] = useState(0);
    const next = () => {
        setCurrent(current + 1);
    };
    const prev = () => {
        setCurrent(current - 1);
    };
    const items = steps.map((item) => ({
        key: item.title,
        title: item.title,
    }));

    const handleStart = () => {
        setStepOn(true);
    }

    const [stepOn, setStepOn] = useState(false);

    return (
        <div>
            {!stepOn && (
                <div className='mx-auto w-[80%] h-[500px] bg-white pt-[35px] flex flex-col gap-3'>
                    <img
                        src={logo}
                        alt='logo'
                        className='w-[200px] h-[200px] mx-auto' />
                    <div className='flex items-center'>
                        <h5 className='text-lg mx-auto'>Chào mừng đến với Ezy!</h5>
                    </div>
                    <div className='flex items-center'>
                        <p className='text-sm mx-auto'>Vui lòng cung cấp thông tin để thành lập tài khoản người bán trên Ezy</p>
                    </div>
                    <div className='flex items-center'>
                        <Button
                            onClick={handleStart}
                            className='text-lg mx-auto bg-primary text-white'
                        >Bắt đầu đăng ký</Button>
                    </div>
                </div>
            )}
            {stepOn && (
                <div className='w-[80%] mx-auto'>
                    <Steps current={current} items={items} />
                    <div className='mt-8 w-full bg-white p-5 border rounded-lg'>{steps[current].content}</div>
                    <div
                        className='mt-5 mb-10'
                    >
                        {current < steps.length - 1 && (
                            <Button type="primary" onClick={() => next()}>
                                Tiếp
                            </Button>
                        )}
                        {current === steps.length - 1 && (
                            <Button type="primary" onClick={() => message.success('Processing complete!')}>
                                Xong
                            </Button>
                        )}
                        {current > 0 && (
                            <Button
                                style={{
                                    margin: '0 8px',
                                }}
                                onClick={() => prev()}
                            >
                                Quay lại
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>

    )
}

export default SellerSetup