import React, { useEffect, useReducer, useState } from 'react';
import { Form, Input, Upload, Button, Modal, Table, Row, Col, Select } from 'antd';
import { RiImageAddFill } from "react-icons/ri";
import { RightOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import '../../../styles/Quill.css';

const { Option } = Select;

const initialState = {
    fileListProduct: [],
    thumbnail: [],
    product_name: '',
    previewImage: '',
    previewTitle: '',
    previewVisible: false,
    errorVisible: false,
    errorMessage: '',
    isSubmitted: false,
    description: '',
    origin: '',
    countries: [],
    brand: '',
    gender_objects: {
        "Nam": "Nam",
        "Nữ": "Nữ",
        "Unisex": "Unisex"
    },
    gender: '',
    subcategory: '',
    errors: {
        fileListProduct: '',
        thumbnail: '',
        product_name: '',
        description: '',
        origin: '',
        brand: '',
    }
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_FILE_LIST_PRODUCT':
            return { ...state, fileListProduct: action.payload };
        case 'SET_PRODUCT_NAME':
            return { ...state, product_name: action.payload };
        case 'SET_THUMBNAIL':
            return { ...state, thumbnail: action.payload };
        case 'SET_PREVIEW_IMAGE':
            return { ...state, previewImage: action.payload };
        case 'SET_PREVIEW_TITLE':
            return { ...state, previewTitle: action.payload };
        case 'SET_PREVIEW_VISIBLE':
            return { ...state, previewVisible: action.payload };
        case 'SET_ERROR_VISIBLE':
            return { ...state, errorVisible: action.payload };
        case 'SET_ERROR_MESSAGE':
            return { ...state, errorMessage: action.payload };
        case 'SET_IS_SUBMITTED':
            return { ...state, isSubmitted: action.payload };
        case 'SET_DESCRIPTION':
            return { ...state, description: action.payload };
        case 'SET_ORIGIN':
            return { ...state, origin: action.payload };
        case 'SET_COUNTRIES':
            return { ...state, countries: action.payload };
        case 'SET_BRAND':
            return { ...state, brand: action.payload };
        case 'SET_GENDER':
            return { ...state, gender: action.payload };
        case 'SET_SUBCATEGORY':
            return { ...state, subcategory: action.payload };
        case 'SET_ERRORS':
            return { ...state, errors: action.payload };
        default:
            return state;
    }
};

export const BasicInformation = ({ onData }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [isCatModalVisible, setIsCatModalVisible] = useState(false);
    const [selectedCategoryPath, setSelectedCategoryPath] = useState('');
    const [isRowClicked, setIsRowClicked] = useState(false);

    const showCatModal = () => {
        setIsCatModalVisible(true);
        dispatch({ type: 'SET_IS_SUBMITTED', payload: false });
    };

    const handleCatOK = () => {
        setIsCatModalVisible(false);
        dispatch({ type: 'SET_IS_SUBMITTED', payload: true });
    };

    const handleCatCancel = () => {
        setIsCatModalVisible(false);
    };

    const onCatSelect = (record) => {
        dispatch({ type: 'SET_SUBCATEGORY', payload: '' });
        if (record && record.category_name) {
            setSelectedCategoryPath(record.category_name);
            setSubCategories(record.SubCategories || []);
        } else {
            console.error('Category record is undefined or missing category_name');
        }
    };

    const onSubCatSelect = (record) => {
        if (record && record.sub_category_name) {
            setSelectedCategoryPath(prevPath => {
                const pathArray = prevPath.split(' > ');
                if (pathArray[0] !== selectedCategoryPath.split(' > ')[0]) {
                    return `${selectedCategoryPath.split(' > ')[0]} > ${record.sub_category_name}`;
                }
                if (pathArray.length > 1) {
                    pathArray[pathArray.length - 1] = record.sub_category_name;
                } else {
                    pathArray.push(record.sub_category_name);
                }
                return pathArray.join(' > ');
            });
            dispatch({ type: 'SET_SUBCATEGORY', payload: record.sub_category_id });
        } else {
            console.error('Subcategory record is undefined or missing sub_category_name');
        }
    };

    const handleRowCatClick = (record) => {
        onCatSelect(record);
        setIsRowClicked(false);
    };

    const handleRowSubCatClick = (record) => {
        onSubCatSelect(record);
        setIsRowClicked(true);
    };

    const handleUploadListProductChange = ({ fileList: newFileList }) => {
        // if (newFileList.length > 1) {
        //     newFileList.shift();
        // }
        dispatch({ type: 'SET_FILE_LIST_PRODUCT', payload: newFileList });
        console.log("File List: ", state.fileListProduct);
        console.log("New List: ", newFileList);
    };
    const handleRemoveProductImage = (file) => {
        dispatch({ type: 'SET_FILE_LIST_PRODUCT', payload: state.fileListProduct.filter(item => item.uid !== file.uid) });
    };
    const handleUploadThumbnailChange = ({ fileList: newList }) => {
        dispatch({ type: 'SET_THUMBNAIL', payload: newList });
    };

    const handlePreview = async file => {
        dispatch({ type: 'SET_PREVIEW_IMAGE', payload: file.url || file.thumbUrl });
        dispatch({ type: 'SET_PREVIEW_VISIBLE', payload: true });
        dispatch({ type: 'SET_PREVIEW_TITLE', payload: file.name || file.url.substring(file.url.lastIndexOf('/') + 1) });
    };

    const handleCancel = () => dispatch({ type: 'SET_PREVIEW_VISIBLE', payload: false });

    const handleErrorCancel = () => dispatch({ type: 'SET_ERROR_VISIBLE', payload: false });

    const beforeUpload = file => {
        const isImage = file.type.startsWith('image/');
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isImage) {
            dispatch({ type: 'SET_ERROR_MESSAGE', payload: 'Bạn chỉ có thể tải lên tệp hình ảnh!' });
            dispatch({ type: 'SET_ERROR_VISIBLE', payload: true });
            return Upload.LIST_IGNORE;
        }
        if (!isLt2M) {
            dispatch({ type: 'SET_ERROR_MESSAGE', payload: 'Kích thước tập tin vượt quá 2.0 MB' });
            dispatch({ type: 'SET_ERROR_VISIBLE', payload: true });
            return Upload.LIST_IGNORE;
        }
        return true;
    };



    const handleDescription = (value) => {
        dispatch({ type: 'SET_DESCRIPTION', payload: value });
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const URL = `${process.env.REACT_APP_BACKEND_URL}/api/categories-sub`;
                const res = await axios({
                    method: "GET",
                    url: URL,
                    withCredentials: true
                });
                if (res.data && Array.isArray(res.data.data)) {
                    setCategories(res.data.data);
                    console.log("data", res.data.data);
                } else {
                    console.error("API response is not an array:", res.data);
                }
            } catch (error) {
                console.log("Error:", error);
            }
        };
        axios.get('https://restcountries.com/v3.1/all')
            .then(response => {
                const countryList = response.data.map(country => ({
                    name: country.name.common,
                    code: country.cca2
                }));
                dispatch({ type: 'SET_COUNTRIES', payload: countryList });
            })
            .catch(error => {
                console.error('Error origin:', error);
            });
        fetchCategories();
    }, []);



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
    const validate = () => {
        let valid = true;
        let newErrors = {
            product_name: '',
            description: '',
            origin: '',
            brand: '',
            gender: '',
            fileListProduct: '',
            thumbnail: '',
            subcategory: ''

        };

        // Product Images
        if (state.fileListProduct.length === 0) {
            newErrors.fileListProduct = 'Hãy tải lên ít nhất 1 hình ảnh sản phẩm';
            valid = false;
        }
        // Thumbnail
        if (state.thumbnail.length === 0) {
            newErrors.thumbnail = 'Hãy tải lên ảnh bìa sản phẩm';
            valid = false;
        }
        // Product Name
        if (state.product_name.trim().length === 0) {
            newErrors.product_name = 'Tên sản phẩm không được để trống';
            valid = false;
        } else if (state.product_name.trim().length < 10) {
            newErrors.product_name = 'Tên sản phẩm quá ngắn. Vui lòng nhập ít nhất 10 kí tự';
            valid = false;
        }
        // description
        if (state.description.trim().length === 0) {
            newErrors.description = 'Mô tả sản phẩm không được để trống';
            valid = false;
        } else if (state.description.trim().length < 50) {
            newErrors.description = 'Mô tả sản phẩm quá ngắn. Vui lòng nhập ít nhất 50 kí tự';
            valid = false;
        }
        // origin
        if (state.origin.trim().length === 0) {
            newErrors.origin = 'Xuất xứ không được để trống';
            valid = false;
        }
        // brand
        if (state.brand.trim().length === 0) {
            newErrors.brand = 'Thương hiệu không được để trống';
            valid = false;
        }

        // gender
        if (state.gender.trim().length === 0) {
            newErrors.gender = 'Hãy chọn giới tính';
            valid = false;
        }

        // subcategory
        if (state.subcategory.length === 0) {
            newErrors.subcategory = 'Hãy chọn danh mục';
            valid = false;
        }

        dispatch({ type: 'SET_ERRORS', payload: newErrors });
        return valid;
    };

    useEffect(() => {
        console.log("Product Name: ", state.product_name);
        validate();
    }, [
        state.product_name,
        state.description,
        state.origin,
        state.brand,
        state.gender,
        state.fileListProduct,
        state.thumbnail,
        state.subcategory
    ]);

    useEffect(() => {
        onData({ noErrorBasicInfo: false });
        const errors = state.errors;
        if (
            errors.product_name === '' &&
            errors.description === '' &&
            errors.origin === '' &&
            errors.brand === '' &&
            errors.fileListProduct === '' &&
            errors.thumbnail === '' &&
            errors.subcategory === ''
        ) {
            const data = {
                product_name: state.product_name,
                description: state.description,
                origin: state.origin,
                brand: state.brand,
                fileListProduct: state.fileListProduct,
                thumbnail: state.thumbnail,
                sub_category_id: state.subcategory,
                gender: state.gender,
                noErrorBasicInfo: true
            };
            onData(data);
            console.log("No errors: ", state.errors);
        } else {
            onData({ noErrorBasicInfo: false });
            console.log("Errors: ", state.errors);
        }
    }, [state.errors]);

    return (
        <div>
            <h3 className='text-lg'>Thông tin cơ bản</h3>
            <Form layout='vertical' className='ml-5 gap-12'>
                <Form.Item
                    label="Hình ảnh sản phẩm"
                    required>
                    <Upload
                        listType="picture-card"
                        maxCount={5}
                        fileList={state.fileListProduct}
                        onChange={handleUploadListProductChange}
                        onPreview={handlePreview}
                        beforeUpload={beforeUpload}
                        onRemove={handleRemoveProductImage}
                        className='custom-upload'
                    >
                        {state.fileListProduct.length < 5 && (
                            <div className='flex flex-col items-center'>
                                <RiImageAddFill size={20} color='#EE4D2D' />
                                <div className='text-[#EE4D2D]'>Thêm hình ảnh {state.fileListProduct.length}/5</div>
                            </div>
                        )}
                    </Upload>
                </Form.Item>
                <Form.Item
                    label="Ảnh bìa"
                    required>
                    <div className='flex items-center space-x-4'>
                        <Upload
                            listType="picture-card"
                            fileList={state.thumbnail}
                            onChange={handleUploadThumbnailChange}
                            maxCount={1}
                            beforeUpload={beforeUpload}
                            className='custom-upload'>
                            {state.thumbnail.length < 1 && (
                                <div className='flex flex-col items-center '>
                                    <RiImageAddFill size={20} color='#EE4D2D' />
                                    <div className='text-[#EE4D2D]'>Thêm ảnh bìa {state.thumbnail.length}/1</div>
                                </div>
                            )}
                        </Upload>
                        <div className='description'>
                            <ul className='list-disc pl-5 text-[14px] text-gray-400'>
                                <li>Tải lên hình ảnh 1:1.</li>
                                <li>Ảnh bìa sẽ được hiển thị tại các trang Kết quả tìm kiếm, Gợi ý hôm nay,... Việc sử dụng ảnh bìa đẹp sẽ thu hút thêm lượt truy cập vào sản phẩm của bạn</li>
                            </ul>
                        </div>
                    </div>
                </Form.Item>

                {/* Ngành hàng */}
                <Form.Item label="Ngành hàng" required>
                    <Input
                        value={state.isSubmitted ? selectedCategoryPath : ''}
                        readOnly
                        onClick={showCatModal}
                        placeholder="Chọn ngành hàng"
                    />
                </Form.Item>

                <Form.Item
                    label="Tên sản phẩm"
                    name="productName"
                    rules={[
                        { required: true, message: 'Không được để ô trống' },
                        { min: 10, message: 'Tên sản phẩm của bạn quá ngắn. Vui lòng nhập ít nhất 10 kí tự' }
                    ]}
                >
                    <Input
                        showCount
                        maxLength={120}
                        onChange={(e) => dispatch({ type: 'SET_PRODUCT_NAME', payload: e.target.value })}
                        className='border rounded-md' />
                </Form.Item>

                {/* Mô tả sản phẩm */}
                <Form.Item
                    label="Mô tả sản phẩm"
                    name="productDescription"
                    rules={[
                        { required: true, message: 'Không được để ô trống' },
                    ]}
                >
                    <ReactQuill
                        value={state.description}
                        onChange={handleDescription}
                        modules={{
                            toolbar: [
                                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                ['bold', 'italic', 'underline'],
                                [{ 'align': [] }],
                                ['link', 'image']
                            ],
                        }}
                        formats={[
                            'header', 'font',
                            'list', 'bullet',
                            'bold', 'italic', 'underline',
                            'align',
                            'link', 'image'
                        ]}
                    />

                    {/* sex, brand and origin */}
                    <div className='mt-3'>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="origin"
                                    rules={[{ required: true, message: 'Không được để ô trống' }]}
                                    label="Xuất xứ">
                                    <Select
                                        showSearch
                                        className='border rounded-md'
                                        value={state.origin}
                                        onChange={(value) => dispatch({ type: 'SET_ORIGIN', payload: value })}
                                        placeholder="Chọn xuất xứ"
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {state.countries.map(country => (
                                            <Option key={country.code} value={country.name}>
                                                {country.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="gender"
                                    rules={[{ required: true, message: 'Không được để ô trống' }]}
                                    label="Giới tính">
                                    <Select
                                        className='border rounded-md'
                                        placeholder="Giới tính"
                                        value={state.gender}
                                        onChange={(value) => dispatch({ type: 'SET_GENDER', payload: value })}
                                    >
                                        {Object.keys(state.gender_objects).map(key => (
                                            <Option key={key} value={state.gender_objects[key]}>
                                                {state.gender_objects[key]}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item
                            name="brand"
                            rules={[{ required: true, message: 'Không được để ô trống' }]}
                            label="Thương hiệu">
                            <Input
                                className='border rounded-md'
                                value={state.brand}
                                placeholder="Thương hiệu"
                                onChange={(e) => dispatch({ type: 'SET_BRAND', payload: e.target.value })} />
                        </Form.Item>
                    </div>
                </Form.Item>
            </Form>

            {/* Modal */}
            <Modal
                title="Chọn ngành hàng"
                visible={isCatModalVisible}
                onOk={handleCatOK}
                onCancel={handleCatCancel}
                footer={[
                    <Button key="cancel" onClick={handleCatCancel}>Cancel</Button>,
                    <Button disabled={!isRowClicked} key="confirm" type="primary" onClick={handleCatOK}>Confirm</Button>
                ]}
            >
                <div className='flex h-72 overflow-hidden'>
                    <Table
                        columns={categoryColumns}
                        dataSource={categories}
                        pagination={false}
                        rowKey="category_id"
                        showHeader={false}
                        className='w-[50%] overflow-y-auto custom-scrollbar'
                        onRow={(record) => ({
                            onClick: () => handleRowCatClick(record),
                            className: record.category_name === selectedCategoryPath.split(' > ')[0] ? 'bg-gray-200' : ''
                        })}
                    />
                    <Table
                        columns={subCategoryColumns}
                        dataSource={subCategories}
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

            {/* Preview Modal */}
            <Modal
                visible={state.previewVisible}
                title={state.previewTitle}
                footer={null}
                onCancel={handleCancel}
            >
                <img alt="example" className='w-[100%]' src={state.previewImage} />
            </Modal>

            {/* Error Modal */}
            <Modal
                visible={state.errorVisible}
                title="Lưu ý"
                footer={[
                    <Button
                        key="ok"
                        type='primary'
                        onClick={handleErrorCancel}>
                        Xác nhận
                    </Button>
                ]}
                onCancel={handleErrorCancel}
            >
                <p>{state.errorMessage}</p>
            </Modal>
        </div>
    );
};