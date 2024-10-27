import { Button, Modal, Table, Select, message } from 'antd';
import React, { useEffect, useReducer, useState } from 'react'
import { getCategoriesByShop } from '../../../services/categoriesService';
import { RightOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";

const { Option } = Select;

const initialState = {
    categories: [],
    subcategory: [],
    isRowClicked: false,
    selectedCategoryPath: '',
    selectedSubCategory: '',
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_CATEGORIES':
            return { ...state, categories: action.payload };
        case 'SET_SUBCATEGORY':
            return { ...state, subcategory: action.payload };
        case 'SET_SELECTED_CATEGORY_PATH':
            return { ...state, selectedCategoryPath: action.payload };
        case 'SET_IS_ROW_CLICKED':
            return { ...state, isRowClicked: action.payload };
        case 'SET_SELECTED_SUBCATEGORY':
            return { ...state, selectedSubCategory: action.payload };
        default:
            return state;
    }
};

const ModalShopCategory = ({ isCatModalVisible, handleCatOK, handleCatCancel }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const shop = useSelector(state => state.shop);
    const [selectedCatRow, setSelectedCatRow] = useState('');
    const [selectedCategoryPath, setSelectedCategoryPath] = useState('');

    const onCatSelect = (record) => {
        dispatch({ type: 'SET_SUBCATEGORY', payload: '' });
        if (record && record.category_name) {
            dispatch({ type: 'SET_SELECTED_CATEGORY_PATH', payload: record.category_name });
            dispatch({ type: 'SET_SUBCATEGORY', payload: record.SubCategories || [] });
            setSelectedCatRow(record.category_name);
        } else {
            console.error('Category record is undefined or missing category_name');
        }
    };

    const onSubCatSelect = (record) => {
        console.log("Subcat", record);
        if (record && record.sub_category_name) {
            setSelectedCategoryPath(`${selectedCategoryPath.split(' > ')[0]} > ${record.sub_category_name}`);
            dispatch({ type: 'SET_SELECTED_SUBCATEGORY', payload: record });
        } else {
            console.error('Subcategory record is undefined or missing sub_category_name');
        }
    };

    const handleRowCatClick = (record) => {
        onCatSelect(record);
        dispatch({ type: 'SET_SUBCATEGORY', payload: record.sub_categories });
        dispatch({ type: 'SET_IS_ROW_CLICKED', payload: false });
    };

    const handleRowSubCatClick = (record) => {
        onSubCatSelect(record);
        dispatch({ type: 'SET_IS_ROW_CLICKED', payload: true });
    };

    const handleSubmit = () => {
        handleCatOK(state.selectedSubCategory);
    }
    const categoryColumns = [
        {
            title: 'Category Name',
            dataIndex: 'category_name',
            key: 'category_name',
            render: (text) => (
                <div className='flex justify-between'>
                    <span>{text}</span>
                    <RightOutlined />
                </div>
            ),
        }
    ];

    const subCategoryColumns = [
        {
            title: 'Subcategory Name',
            dataIndex: 'sub_category_name',
            key: 'sub_category_id',
        }
    ];
    useEffect(() => {
        let categories = []
        const fetchCategories = async () => {
            const shop_id = shop.shop_id;
            try {
                categories = await getCategoriesByShop(shop_id);
                console.log("Fetched categories:", categories);
                categories = categories.data.map(category => {
                    return {
                        key: category.category_id,
                        category_name: category.category_name,
                        sub_categories: category.SubCategories
                    }
                }
                );
                dispatch({ type: 'SET_CATEGORIES', payload: categories });
            } catch (error) {
                console.error("Error fetching shop products:", error);
                dispatch({ type: 'SET_CATEGORIES', payload: [] });
            }
        };
        if (shop.shop_id != "") {
            fetchCategories();
        }
    }, [shop]);


    return (
        <div>
            <Modal
                title="Chọn ngành hàng"
                open={isCatModalVisible}
                onCancel={handleCatCancel}
                footer={[
                    <Button key="cancel" onClick={handleCatCancel}>Cancel</Button>,
                    <Button disabled={!state.isRowClicked} key="confirm" type="primary" onClick={handleSubmit}>Confirm</Button>
                ]}
            >
                <div className='flex h-72 overflow-hidden'>
                    <Table
                        columns={categoryColumns}
                        dataSource={state.categories}
                        pagination={false}
                        rowKey="category_id"
                        showHeader={false}
                        className='w-[50%] overflow-y-auto custom-scrollbar'
                        onRow={(record) => ({
                            onClick: () => handleRowCatClick(record),
                            className: record.category_name === selectedCatRow ? 'bg-gray-200' : ''
                        })}
                    />
                    <Table
                        columns={subCategoryColumns}
                        dataSource={state.subcategory}
                        pagination={false}
                        rowKey="sub_category_id"
                        showHeader={false}
                        className='w-[50%] overflow-y-auto custom-scrollbar'
                        onRow={(record) => ({
                            onClick: () => handleRowSubCatClick(record),
                            className: record.sub_category_name === selectedCategoryPath.split(' > ')[1] ? 'bg-gray-200' : ''
                        })}
                    />
                </div>
                <div className='mt-4'>
                    <p>Đã chọn: {selectedCategoryPath}</p>
                </div>
            </Modal>
        </div>
    )
}

export default ModalShopCategory