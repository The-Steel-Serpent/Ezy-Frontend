import { Table } from 'antd'
import React from 'react'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
function ProductSubCategory() {

    const columns = [
        {
            key: '1',
            title: 'ID',
            dataIndex: 'sub_category_id',
        },
        {
            key: '2',
            title: 'Tên danh mục',
            dataIndex: 'sub_category_name',
        },
        {
            key: '3',
            title: 'Thao tác',
            render: () => (
                <div>
                    <EditOutlined />
                    <DeleteOutlined style={{ color: "red", marginLeft: 12 }} />
                </div>
            )
        }
    ];
  return (
    <div>
        
        <Table 
            columns={columns} 
            dataSource={[]} 
        />
    </div>
  )
}

export default ProductSubCategory
