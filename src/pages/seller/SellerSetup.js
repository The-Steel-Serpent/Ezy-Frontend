import React, { useState } from 'react'
import { Button, message, Steps, theme, Result } from 'antd';
import BasicShopInformation from '../../components/setup/BasicShopInformation';
import TaxInformation from '../../components/setup/TaxInformation';
import { SmileOutlined } from '@ant-design/icons';

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
    const { token } = theme.useToken();
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
 
  return (
    <div className='w-[80%] mx-auto'>
          <Steps current={current} items={items} />
          <div className='mt-8 w-full bg-white p-5 border rounded-lg'>{steps[current].content}</div>
          <div
              style={{
                  marginTop: 24,
              }}
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
  )
}

export default SellerSetup