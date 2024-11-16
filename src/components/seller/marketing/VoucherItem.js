import { Empty, Table } from 'antd'
import React from 'react'
import { AiOutlineNotification } from "react-icons/ai";


const VoucherItem = () => {
  return (
    <div className='mt-5'>
      <Table
        locale={{
          emptyText: (
            <Empty
              image={<AiOutlineNotification size={100} />}
              description="Hiện tại chưa có chương trình nào"
            />
          )
        }}
      />
    </div>
  )
}

export default VoucherItem