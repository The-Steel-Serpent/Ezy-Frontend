import React, { useEffect, useReducer, useRef, useState } from 'react';
import { Form, Input, Upload, Button, Modal, Table, Row, Col, Select } from 'antd';
import { RiImageAddFill } from "react-icons/ri";
import { RightOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import '../../../styles/Quill.css';
import { getProductByID } from '../../../services/productService';
import { getSubCategoriesByID } from '../../../services/categoriesService';
import ModalCategory from '../category/ModalCategory';

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
    },
    touch: {
        fileListProduct: false,
        thumbnail: false,
        product_name: false,
        description: false,
        origin: false,
        brand: false
    },
    isCatModalVisible: false,
    selectedSubcat: null,
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
        case 'SET_CAT_MODAL_VISIBLE':
            return { ...state, isCatModalVisible: action.payload };
        case 'SET_SELECTED_SUBCAT':
            return { ...state, selectedSubcat: action.payload };
        case 'SET_TOUCHED':
            return {
                ...state,
                touch: {
                    ...state.touch,
                    [action.payload]: true
                }
            };
        default:
            return state;
    }
};

const EditBasicInformation = ({ product, onData }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const uploadRef = useRef(null);
    const [form] = Form.useForm();

    const showCatModal = () => {
        dispatch({ type: 'SET_CAT_MODAL_VISIBLE', payload: true });
    };
    const handleCatOK = (subcategory) => {
        // dispatch({ type: 'SET_SUBCATEGORY', payload: subcategory });
        dispatch({ type: 'SET_SELECTED_SUBCAT', payload: subcategory });
        form.setFieldsValue({
            sub_category: subcategory.sub_category_name
        });
        dispatch({ type: 'SET_CAT_MODAL_VISIBLE', payload: false });
    };

    const handleCatCancel = () => {
        dispatch({ type: 'SET_SELECTED_SUBCAT', payload: null });
        dispatch({ type: 'SET_CAT_MODAL_VISIBLE', payload: false });
    };

    const handleUploadListProductChange = ({ fileList: newFileList }) => {
        dispatch({ type: 'SET_FILE_LIST_PRODUCT', payload: newFileList });
        console.log("File List: ", state.fileListProduct);
        console.log("New List: ", newFileList);
        dispatch({ type: 'SET_TOUCHED', payload: 'fileListProduct' });
    };
    const handleRemoveProductImage = (file) => {
        dispatch({ type: 'SET_FILE_LIST_PRODUCT', payload: state.fileListProduct.filter(item => item.uid !== file.uid) });
    };
    const handleUploadThumbnailChange = ({ fileList: newList }) => {
        dispatch({ type: 'SET_THUMBNAIL', payload: newList });
        dispatch({ type: 'SET_TOUCHED', payload: 'thumbnail' });
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
        dispatch({ type: 'SET_TOUCHED', payload: 'description' });
    };


    useEffect(() => {
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
    }, []);



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
        if (state.selectedSubcat === null) {
            newErrors.subcategory = 'Hãy chọn danh mục';
            valid = false;
        }

        dispatch({ type: 'SET_ERRORS', payload: newErrors });
        return valid;
    };

    useEffect(() => {
        validate();
    }, [
        state.product_name,
        state.description,
        state.origin,
        state.brand,
        state.gender,
        state.fileListProduct,
        state.thumbnail,
        state.selectedSubcat
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
                sub_category_id: state.selectedSubcat.sub_category_id,
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


    useEffect(() => {
        if (product) {
            const setProductData = async () => {
                try {
                    const thumbail_payload = {
                        uid: '-1',
                        url: product.thumbnail,
                        status: 'done',
                    }
                    dispatch({ type: 'SET_THUMBNAIL', payload: [thumbail_payload] });
                    dispatch({ type: 'SET_PRODUCT_NAME', payload: product.product_name });
                    dispatch({ type: 'SET_DESCRIPTION', payload: product.description });
                    dispatch({ type: 'SET_FILE_LIST_PRODUCT', payload: product.ProductImgs });
                    dispatch({ type: 'SET_ORIGIN', payload: product.origin });
                    dispatch({ type: 'SET_GENDER', payload: product.gender_object });
                    dispatch({ type: 'SET_BRAND', payload: product.brand });
                    const subCategory = await getSubCategoriesByID(product.sub_category_id);
                    console.log('SubCategory present', subCategory.data);
                    dispatch({ type: 'SET_SELECTED_SUBCAT', payload: subCategory.data });
                    console.log('Producttttttttttttttt:', product);
                    form.setFieldsValue({
                        productName: product.product_name,
                        productDescription: product.description,
                        productImages: product.productImages,
                        productImages: product.thumbnail,
                        origin: product.origin,
                        gender: product.gender_object,
                        brand: product.brand,
                        sub_category: subCategory.data.sub_category_name
                    });

                } catch (error) {
                    console.error('Error fetching:', error);
                }
            };
            setProductData();
        }
    }, [product])



    return (
        <div>
            <h3 className='text-lg'>Thông tin cơ bản</h3>
            <Form layout='vertical' className='ml-5 gap-12' form={form}>
                <Form.Item
                    label="Hình ảnh sản phẩm"
                    name="productImages"
                    required>
                    <div>
                        <Upload
                            ref={uploadRef}
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
                        {state.errors.fileListProduct && state.touch.fileListProduct && <p className='text-red-500'>{state.errors.fileListProduct}</p>}
                    </div>
                </Form.Item>
                <Form.Item
                    label="Ảnh bìa"
                    name="thumbnail"
                    required>
                    <div className='flex items-center space-x-4'>
                        <Upload
                            ref={uploadRef}
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
                        {state.errors.thumbnail && state.touch.thumbnail && <p className='text-red-500'>{state.errors.thumbnail}</p>}
                        <div className='description'>
                            <ul className='list-disc pl-5 text-[14px] text-gray-400'>
                                <li>Tải lên hình ảnh 1:1.</li>
                                <li>Ảnh bìa sẽ được hiển thị tại các trang Kết quả tìm kiếm, Gợi ý hôm nay,... Việc sử dụng ảnh bìa đẹp sẽ thu hút thêm lượt truy cập vào sản phẩm của bạn</li>
                            </ul>
                        </div>
                    </div>
                </Form.Item>

                {/* Ngành hàng */}
                <Form.Item
                    label="Ngành hàng"
                    name="sub_category"
                    required>
                    <Input
                        value={state?.selectedSubcat?.sub_category_name ?? ''}
                        placeholder="Tìm theo ngành hàng"
                        readOnly
                        onClick={showCatModal}
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
                        placeholder="Tên sản phẩm"
                        maxLength={100}
                        onChange={(e) => dispatch({ type: 'SET_PRODUCT_NAME', payload: e.target.value })}
                        className='border rounded-md' />
                </Form.Item>

                {/* Mô tả sản phẩm */}
                <Form.Item
                    label="Mô tả sản phẩm"
                    rules={[
                        { required: true, message: 'Không được để ô trống' },
                    ]}
                >
                    <div>
                        <ReactQuill
                            value={state.description}
                            onChange={handleDescription}
                            placeholder='Mô tả sản phẩm'
                            name="productDescription"
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
                        {state.errors.description && state.touch.description && <p className='text-red-500'>{state.errors.description}</p>}


                    </div>
                </Form.Item>
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
            </Form>

            {/* Modal Categories */}
            <ModalCategory
                isCatModalVisible={state.isCatModalVisible}
                handleCatOK={handleCatOK}
                handleCatCancel={handleCatCancel}
            />

            {/* Preview Modal */}
            <Modal
                open={state.previewVisible}
                title={state.previewTitle}
                footer={null}
                onCancel={handleCancel}
            >
                <img alt="example" className='w-[100%]' src={state.previewImage} />
            </Modal>

            {/* Error Modal */}
            <Modal
                open={state.errorVisible}
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
    )
}

export default EditBasicInformation