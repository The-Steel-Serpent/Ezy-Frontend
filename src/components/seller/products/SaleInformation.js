import React, { useEffect, useReducer, useState } from 'react'
import { Form, Input, Upload, Button, Table, Row, Col, message, Modal, Slider } from 'antd';
import { GoPlus } from "react-icons/go";
import { VscClose } from "react-icons/vsc";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RiImageAddFill } from "react-icons/ri";
import { handleBeforeInput } from '../../../helpers/handleInput';
import { all } from 'axios';

const initialState = {
    add_product_level: 1, // 1: only product, 2: have classify, 3: have classify and varient
    showFormList: false,
    showFormList2: false,
    showButtonList2: false,
    classifyTypeName: '',
    variantName: '',
    allClassifyName: [],
    allVarientName: [],
    allImgClassification: [],
    allPrice: [],
    allStock: [],
    allSalePercent: [],
    priceDefault: '',
    sale_percent_default: 0,
    stockDefault: '',
    errorMessage: '',
    errorVisible: false,
    errorsDefault: {
        priceDefault: '',
        stockDefault: '',
        sale_percent_default: '',
    }
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_ADD_PRODUCT_LEVEL':
            return { ...state, add_product_level: action.payload };
        case 'SET_SHOW_FORM_LIST':
            return { ...state, showFormList: action.payload };
        case 'SET_SHOW_FORM_LIST2':
            return { ...state, showFormList2: action.payload };
        case 'SET_SHOW_BUTTON_LIST2':
            return { ...state, showButtonList2: action.payload };
        case 'SET_CLASSIFY_TYPE_NAME':
            return { ...state, classifyTypeName: action.payload };
        case 'SET_VARIANT_NAME':
            return { ...state, variantName: action.payload };
        case 'SET_ALL_CLASSIFY_NAME':
            return { ...state, allClassifyName: action.payload };
        case 'SET_ALL_VARIANT_NAME':
            return { ...state, allVarientName: action.payload };
        case 'SET_ALL_IMG_CLASSIFICATION':
            return { ...state, allImgClassification: action.payload };
        case 'SET_ALL_PRICE':
            return { ...state, allPrice: action.payload };
        case 'SET_ALL_STOCK':
            return { ...state, allStock: action.payload };
        case 'SET_ALL_SALE_PERCENT':
            return { ...state, allSalePercent: action.payload };
        case 'SET_PRICE_DEFAULT':
            return { ...state, priceDefault: action.payload };
        case 'SET_STOCK_DEFAULT':
            return { ...state, stockDefault: action.payload };
        case 'SET_ERROR_MESSAGE':
            return { ...state, errorMessage: action.payload };
        case 'SET_ERROR_VISIBLE':
            return { ...state, errorVisible: action.payload };
        case 'SET_SALE_PERCENT_DEFAULT':
            return { ...state, sale_percent_default: action.payload };
        case 'SET_ERRORS_DEFAULT':
            return { ...state, errorsDefault: action.payload };
        default:
            return state;
    }
};

const SaleInformation = ({ onData }) => {
    const [form] = Form.useForm();
    const [state, dispatch] = useReducer(reducer, initialState);

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

    const handleUploadClassifyImage = (index, e) => {
        let newImgClassification = [...state.allImgClassification];

        // Get the new file with its pos attribute
        const newFile = { file: e.file, pos: index };

        // Check if the file with the same pos already exists
        const existingIndex = newImgClassification.findIndex(item => item && item.pos === index);

        if (existingIndex !== -1) {
            // If file with the same pos exists, update it
            newImgClassification[existingIndex] = newFile;
        } else {
            // If it doesn't exist, add a new file
            newImgClassification.push(newFile);
        }

        // Check if the file is removed
        if (e.file.status === 'removed') {
            console.log('File removed');
            // Set the file and pos to null for removal
            newImgClassification[existingIndex] = { ...newFile, file: null, pos: null };

            // Filter out elements where both file and pos are null
            newImgClassification = newImgClassification.filter(
                item => item.file !== null || item.pos !== null
            );
        }

        // Dispatch the updated state
        dispatch({ type: 'SET_ALL_IMG_CLASSIFICATION', payload: newImgClassification });
    };



    const handleErrorCancel = () => dispatch({ type: 'SET_ERROR_VISIBLE', payload: false });

    const handleInputPrice = (index) => (e) => {
        // remove all price at index before set new price
        const removePrice = [...state.allPrice];
        removePrice[index] = null;
        dispatch({ type: 'SET_ALL_PRICE', payload: removePrice });

        if (isNaN(e.target.value)) {
            message.error('Giá tiền phải là số!');
        }
        else if (e.target.value === '') {
            message.error('Giá tiền không được để trống!');
        }
        else if (e.target.value < 1000) {
            message.error('Giá phải tối thiểu là 1000!');
        } else {
            const newPrice = [...state.allPrice];
            newPrice[index] = e.target.value;
            dispatch({ type: 'SET_ALL_PRICE', payload: newPrice });
        }
    };

    const handleNumberInputChange = (e, type) => {
        const value = e.target.value;
        if (!isNaN(value)) {
            dispatch({ type: type, payload: value });
        }
    };

    const handleInputStock = (index) => (e) => {
        const removeStock = [...state.allStock];
        removeStock[index] = null;
        dispatch({ type: 'SET_ALL_STOCK', payload: removeStock });

        if (isNaN(e.target.value)) {
            message.error('Số lượng hàng phải là số!');
        }
        else if (e.target.value === '') {
            message.error('Số lượng hàng không được để trống!');
        }
        else if (e.target.value <= 0) {
            message.error('Số lượng hàng phải lớn hơn 0 !');
        } else {
            const newStock = [...state.allStock];
            newStock[index] = e.target.value;
            dispatch({ type: 'SET_ALL_STOCK', payload: newStock });
        }
    };

    const handleSalePercent = (index) => (e) => {
        const removeSalePercent = [...state.allSalePercent];
        removeSalePercent[index] = null;
        dispatch({ type: 'SET_ALL_SALE_PERCENT', payload: removeSalePercent });

        if (isNaN(e.target.value)) {
            message.error('Số lượng hàng phải là số!');
        }
        else if (e.target.value === '') {
            message.error('Phần trăm giảm giá không được để trống!');
        }
        else if (e.target.value < 0 || e.target.value > 60) {
            message.error('Phần trăm giảm giá phải từ 0 đến 60!');
        } else {
            const newSalePercent = [...state.allSalePercent];
            newSalePercent[index] = e.target.value;
            dispatch({ type: 'SET_ALL_SALE_PERCENT', payload: newSalePercent });
        }
    };

    const toggleVisibility = () => {
        if (!state.showFormList) {
            form.setFieldsValue({ classifications: [{}] });
        }
        dispatch({ type: 'SET_CLASSIFY_TYPE_NAME', payload: '' });
        dispatch({ type: 'SET_VARIANT_NAME', payload: '' });
        dispatch({ type: 'SET_SHOW_FORM_LIST', payload: !state.showFormList });
        dispatch({ type: 'SET_SHOW_BUTTON_LIST2', payload: !state.showFormList });
        dispatch({ type: 'SET_SHOW_FORM_LIST2', payload: false });
        dispatch({ type: 'SET_ALL_CLASSIFY_NAME', payload: [] });
        dispatch({ type: 'SET_ALL_VARIANT_NAME', payload: [] });
        dispatch({ type: 'SET_ALL_PRICE', payload: [] });
        dispatch({ type: 'SET_ALL_STOCK', payload: [] });
        dispatch({ type: 'SET_PRICE_DEFAULT', payload: '' });
        dispatch({ type: 'SET_STOCK_DEFAULT', payload: '' });
        dispatch({ type: 'SET_SALE_PERCENT_DEFAULT', payload: 0 });
        if (state.add_product_level === 1)
            dispatch({ type: 'SET_ADD_PRODUCT_LEVEL', payload: 2 });
        else
            dispatch({ type: 'SET_ADD_PRODUCT_LEVEL', payload: 1 });
    };

    const toggleVisibility2 = () => {
        dispatch({ type: 'SET_SHOW_FORM_LIST2', payload: true });
        if (!state.showFormList2) {
            form.setFieldsValue({ varients: [{}] });
        }
        dispatch({ type: 'SET_SHOW_BUTTON_LIST2', payload: false });
        dispatch({ type: 'SET_ADD_PRODUCT_LEVEL', payload: 3 });
        dispatch({ type: 'SET_ALL_CLASSIFY_NAME', payload: [] });
        dispatch({ type: 'SET_ALL_VARIANT_NAME', payload: [] });
    };

    const toggleVisibility3 = () => {
        dispatch({ type: 'SET_SHOW_FORM_LIST2', payload: false });
        dispatch({ type: 'SET_SHOW_BUTTON_LIST2', payload: true });
        dispatch({ type: 'SET_ALL_CLASSIFY_NAME', payload: [] });
        dispatch({ type: 'SET_ALL_VARIANT_NAME', payload: [] });
        dispatch({ type: 'SET_ALL_PRICE', payload: [] });
        dispatch({ type: 'SET_ALL_STOCK', payload: [] });
        dispatch({ type: 'SET_ADD_PRODUCT_LEVEL', payload: 2 });
    };

    const handleRemoveClassification = (index, remove) => {
        const fields = form.getFieldValue('classifications');
        if (fields.length === 1) {
            return;
        }
        remove(index);
        const newClassifyName = [...state.allClassifyName];
        newClassifyName.splice(index, 1);
        dispatch({ type: 'SET_ALL_CLASSIFY_NAME', payload: newClassifyName });
        const newPrice = [...state.allPrice];
        newPrice.splice(index, 1);
        dispatch({ type: 'SET_ALL_PRICE', payload: newPrice });
        const newStock = [...state.allStock];
        newStock.splice(index, 1);
        dispatch({ type: 'SET_ALL_STOCK', payload: newStock });
        // remove allClassifyName, allPrice, allStock, allImgClassification at index
        const newImgClassification = [...state.allImgClassification];
        newImgClassification.splice(index, 1);
        dispatch({ type: 'SET_ALL_IMG_CLASSIFICATION', payload: newImgClassification });
    }

    const handleRemoveVariant = (index, remove) => {
        const fields = form.getFieldValue('varients');
        if (fields.length === 1) {
            return;
        }
        remove(index);
        const newVarientName = [...state.allVarientName];
        newVarientName.splice(index, 1);
        dispatch({ type: 'SET_ALL_VARIANT_NAME', payload: newVarientName });


        const newPrice = [...state.allPrice];
        newPrice.splice(index, 1);
        dispatch({ type: 'SET_ALL_PRICE', payload: newPrice });
        const newStock = [...state.allStock];
        newStock.splice(index, 1);
        dispatch({ type: 'SET_ALL_STOCK', payload: newStock });
    }




    const handleInputChange = (index, add) => (e) => {
        const fields = form.getFieldValue('classifications') || [];
        if (index === fields.length - 1 && e.target.value.trim() !== '') {
            add();
        }
    };

    const handleInputChange2 = (index, add) => (e) => {
        const fields = form.getFieldValue('varients') || [];
        if (index === fields.length - 1 && e.target.value.trim() !== '') {
            add();
        }
    };

    const checkForDuplicates = (rule, value) => {
        const fields = form.getFieldValue('classifications') || [];
        const trimmedValues = fields.map(item => item?.classification?.trim()).filter(Boolean);
        if (trimmedValues.filter(v => v === value?.trim()).length > 1) {
            return Promise.reject(new Error('Phân loại hàng không được trùng!'));
        }
        dispatch({ type: 'SET_ALL_CLASSIFY_NAME', payload: trimmedValues });
        return Promise.resolve();
    };

    const checkForDuplicates2 = (rule, value) => {
        const fields = form.getFieldValue('varients') || [];
        const trimmedValues = fields.map(item => item?.classification?.trim()).filter(Boolean);
        if (trimmedValues.filter(v => v === value?.trim()).length > 1) {
            return Promise.reject(new Error('Phân loại hàng không được trùng!'));
        }
        dispatch({ type: 'SET_ALL_VARIANT_NAME', payload: trimmedValues });
        return Promise.resolve();
    };

    useEffect(() => {
        if (state.showFormList) {
            const fields = form.getFieldValue('classifications') || [];
            if (fields.length === 0) {
                form.setFieldsValue({ classifications: [{}] });
            }
        }
    }, [state.showFormList, form]);

    useEffect(() => {
        if (state.showFormList2) {
            const fields = form.getFieldValue('varients') || [];
            if (fields.length === 0) {
                form.setFieldsValue({ varients: [{}] });
            }
        }
    }, [state.showFormList2, form]);

    const columns = [
        {
            title: `${state.classifyTypeName || 'Phân loại 1'}`,
            dataIndex: 'allClassifyName',
            key: 'allClassifyName',
            render: (text, row, index) => {
                const currentClassify = row.allClassifyName;
                const firstRowIndex = dataSource.findIndex(item => item.allClassifyName === currentClassify);
                const sameClassifyCount = dataSource.filter(item => item.allClassifyName === currentClassify).length;
                if (index === firstRowIndex) {
                    return {
                        children: (
                            <div>
                                {text}
                            </div>
                        ),
                        props: {
                            rowSpan: sameClassifyCount,
                        },
                    };
                }
                return {
                    props: {
                        rowSpan: 0,
                    },
                };
            },
        },
        ...(state.allVarientName.length > 0 ? [{
            title: `${state.variantName || 'Phân loại 2'}`,
            dataIndex: 'allVarientName',
            key: 'allVarientName',
        }] : []),
        {
            title: 'Kho hàng',
            dataIndex: 'stock',
            key: 'stock',
            render: (text, record, index) => (
                <Input
                    defaultValue={state.allStock[index]}
                    onBlur={handleInputStock(index)}
                    placeholder='Nhập số lượng hàng'
                    addonAfter='Cái'
                />
            ),
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (text, record, index) => (
                <Input
                    defaultValue={state.allPrice[index]}
                    onBlur={handleInputPrice(index)}
                    placeholder='Nhập giá'
                    addonAfter='VND'
                />
            ),
        },
        {
            title: 'Giảm giá',
            dataIndex: 'sale_percent',
            key: 'sale_percent',
            render: (text, record, index) => (
                <Input
                    defaultValue={state.allSalePercent[index]}
                    onBlur={handleSalePercent(index)}
                    placeholder='Phần trăm giảm giá'
                    addonAfter='%'
                />
            ),
        },
    ];

    const dataSource = state.allClassifyName.flatMap((classify, classifyIndex) => {
        return state.allVarientName.length > 0
            ? state.allVarientName.map((variant, variantIndex) => ({
                key: `${classifyIndex}-${variantIndex}`,
                allClassifyName: classify,
                allVarientName: variant,
            }))
            : [{
                key: `${classifyIndex}-0`,
                allClassifyName: classify,
                allVarientName: '',
            }];
    });

    const validateDefault = () => {
        let valid = true;
        let errors = {
            priceDefault: '',
            stockDefault: ''
        };

        if (state.priceDefault === '') {
            errors.priceDefault = 'Vui lòng nhập giá sản phẩm!';
            valid = false;
        }
        if (state.stockDefault === '') {
            errors.stockDefault = 'Vui lòng nhập số lượng hàng!';
            valid = false;
        }
        dispatch({ type: 'SET_ERRORS_DEFAULT', payload: errors });
        return valid;
    }

    const validateAddProductLevel2 = () => {
        let valid = true;
        const count_classification = state.allClassifyName.length;
        const count_img_classification = state.allImgClassification.length;
        const count_stock = state.allStock.length;
        const count_price = state.allPrice.length;
        const count_sale_percent = state.allSalePercent.length;
        if (
            count_classification !== count_img_classification ||
            state.classifyTypeName === '' ||
            state.allClassifyName.length === 0 ||
            count_stock !== count_classification ||
            count_price !== count_classification ||
            count_sale_percent !== count_classification) {
            valid = false;
        }
        for (let i = 0; i < count_classification; i++) {
            if (
                state.allClassifyName[i] === '' ||
                state.allImgClassification[i] === null ||
                state.allPrice[i] === null ||
                state.allStock[i] === null ||
                state.allSalePercent[i] === null) {
                valid = false;
                break;
            }
        }
        return valid;
    }

    const validateAddProductLevel3 = () => {
        let valid = true;
        const count_classification = state.allClassifyName.length;
        const count_img_classification = state.allImgClassification.length;
        const count_stock = state.allStock.length;
        const count_price = state.allPrice.length;
        const count_sale_percent = state.allSalePercent.length;
        if (
            count_classification !== count_img_classification ||
            state.classifyTypeName === '' ||
            state.allClassifyName.length === 0 ||
            count_stock !== count_classification ||
            count_price !== count_classification ||
            count_sale_percent !== count_classification ||
            state.allVarientName.length === 0 ||
            state.variantName === '') {
            valid = false;
        }
        for (let i = 0; i < count_classification; i++) {
            if (
                state.allClassifyName[i] === '' ||
                state.allImgClassification[i] === null ||
                state.allPrice[i] === null ||
                state.allStock[i] === null ||
                state.allSalePercent[i] === null) {
                valid = false;
                break;
            }
        }
    }

    useEffect(() => {
        validateDefault();
    }, [])

    useEffect(() => {
        validateDefault();
    }, [
        state.priceDefault,
        state.stockDefault,
        state.sale_percent_default
    ])

    useEffect(() => {
        onData({ noErrorSaleInfo: false });
        if (state.add_product_level === 1) {
            const errorsDefault = state.errorsDefault;
            if (
                errorsDefault.priceDefault === '' &&
                errorsDefault.stockDefault === ''
            ) {
                const data = {
                    price: state.priceDefault,
                    stock: state.stockDefault,
                    sale_percent: state.sale_percent_default,
                    add_product_level: state.add_product_level,
                    noErrorSaleInfo: true
                };
                onData(data);
                console.log("No errors: ", state.errorsDefault);

            }
            else {
                onData({ noErrorSaleInfo: false });
                console.log("Errors: ", state.errorsDefault);
            }
        }
        else if (state.add_product_level === 2) {
            const check = validateAddProductLevel2();
            if (!check) {
                onData({
                    add_product_level: state.add_product_level,
                    noErrorSaleInfo: false
                });
            }
            else {
                onData({
                    noErrorSaleInfo: true,
                    classifyTypeName: state.classifyTypeName,
                    allClassifyName: state.allClassifyName,
                    add_product_level: state.add_product_level,
                    classifyImage: state.allImgClassification,
                    stocks: state.allStock,
                    prices: state.allPrice,
                    sale_percent: state.allSalePercent
                });
            }

        }
        else if (state.add_product_level === 3) {
            onData({
                noErrorSaleInfo: true,
                classifyTypeName: state.classifyTypeName,
                allClassifyName: state.allClassifyName,
                add_product_level: state.add_product_level,
                classifyImage: state.allImgClassification,
                stock: state.allStock,
                price: state.allPrice,
                sale_percent: state.allSalePercent,
                allVarientName: state.allVarientName,
                variantName: state.variantName
            });
        }

    }, [
        state.errorsDefault,
        state.add_product_level,
        state.classifyTypeName,
        state.variantName,
        state.allClassifyName,
        state.allVarientName,
        state.allClassifyName,
        state.allImgClassification,
        state.allStock,
        state.allPrice,
        state.priceDefault,
        state.allSalePercent,
    ])

    return (
        <div>
            <h3 className='text-lg'>Thông tin bán hàng</h3>
            <Form layout='vertical' className='ml-5 gap-12' form={form}>
                <Row gutter={24}>
                    <Col span={3}>
                        <span className='text-sm'>Phân loại hàng</span>
                    </Col>
                    <Col span={21}>
                        {!state.showFormList && (
                            <Button type="dashed" icon={<GoPlus size={25} />} className='text-sm' onClick={toggleVisibility}>
                                Thêm nhóm phân loại
                            </Button>
                        )}
                        {state.showFormList && (
                            <div className="classification-form bg-[#F6F6F6] p-3 border rounded">
                                <div className='flex justify-end'>
                                    <VscClose onClick={toggleVisibility} size={20} className='cursor-pointer' />
                                </div>
                                <div className="classification-header">
                                    <Row gutter={24}>
                                        <Col span={3}>
                                            <span className='text-sm'>Phân loại 1</span>
                                        </Col>
                                        <Col span={21}>
                                            <Form.Item
                                                name="classifyTypeName"
                                                rules={[
                                                    { required: true, message: 'Không được để ô trống' },
                                                ]}
                                            >
                                                <Input
                                                    value={state.classifyTypeName}
                                                    onChange={(e) => dispatch({ type: 'SET_CLASSIFY_TYPE_NAME', payload: e.target.value })}
                                                    showCount
                                                    maxLength={15}
                                                    className='w-64'
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>
                                <div className='mt-3'>
                                    <Row gutter={12}>
                                        <Col span={3}>
                                            <span className='text-sm'>Tùy chọn</span>
                                        </Col>
                                        <Col span={21}>
                                            <Form.List name="classifications">
                                                {(fields, { add, remove }) => (
                                                    <div>
                                                        {fields.map(({ key, name, fieldKey, ...restField }, index) => (
                                                            <Row key={key} gutter={12} className='flex items-center gap-3'>
                                                                <Col span={10}>
                                                                    <Upload
                                                                        beforeUpload={beforeUpload}
                                                                        maxCount={1}
                                                                        listType='picture-card'
                                                                        className='cursor-pointer'
                                                                        onChange={(e) => handleUploadClassifyImage(index, e)}
                                                                    >
                                                                        {(!state.allImgClassification[index] || state.allImgClassification[index].file === null) && (
                                                                            <RiImageAddFill size={20} />
                                                                        )}
                                                                    </Upload>

                                                                </Col>
                                                                <Col span={14}>
                                                                    <Form.Item
                                                                        {...restField}
                                                                        name={[name, 'classification']}
                                                                        fieldKey={[fieldKey, 'classification']}
                                                                        rules={[
                                                                            { required: true, message: 'Nhập phân loại hàng' },
                                                                            { validator: checkForDuplicates }
                                                                        ]}
                                                                    >
                                                                        <Row gutter={12} className='flex items-center'>
                                                                            <Col span={12}>
                                                                                <Input
                                                                                    placeholder="Nhập phân loại hàng"
                                                                                    onChange={handleInputChange(index, add)}
                                                                                    maxLength={20}
                                                                                    showCount
                                                                                    className='w-64 input-classification'
                                                                                />
                                                                            </Col>
                                                                            <Col span={2}>
                                                                                {index > 0 && (
                                                                                    <RiDeleteBin6Line
                                                                                        onClick={
                                                                                            () => handleRemoveClassification(index, remove)
                                                                                        }
                                                                                        size={18}
                                                                                        className='cursor-pointer'
                                                                                    />
                                                                                )}
                                                                            </Col>
                                                                        </Row>
                                                                    </Form.Item>
                                                                </Col>
                                                            </Row>
                                                        ))}
                                                    </div>
                                                )}
                                            </Form.List>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        )}
                        {state.showButtonList2 && (
                            <div className='mt-3 bg-[#F6F6F6] p-3 border rounded'>
                                <Row gutter={24}>
                                    <Col span={3}>
                                        <span className='text-sm'>Phân loại 2</span>
                                    </Col>
                                    <Col span={21}>
                                        <Button type="dashed" icon={<GoPlus size={25} />} className='text-sm' onClick={toggleVisibility2}>
                                            Thêm nhóm phân loại 2
                                        </Button>
                                    </Col>
                                </Row>
                            </div>
                        )}
                        {
                            state.showFormList2 && (
                                <div className='mt-3 bg-[#F6F6F6] p-3 border rounded'>
                                    <div className='flex justify-end'>
                                        <VscClose onClick={toggleVisibility3} size={20} className='cursor-pointer' />
                                    </div>
                                    <div className="classification-header">
                                        <Row gutter={24}>
                                            <Col span={3}>
                                                <span className='text-sm'>Phân loại 2</span>
                                            </Col>
                                            <Col span={21}>
                                                <Form.Item
                                                    name="variantName"
                                                    rules={[
                                                        { required: true, message: 'Không được để ô trống' },
                                                    ]}
                                                    value={state.variantName}
                                                    onChange={(e) => dispatch({ type: 'SET_VARIANT_NAME', payload: e.target.value })}
                                                >
                                                    <Input showCount maxLength={15} className='w-64' />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                                    <div className='mt-3'>
                                        <Row gutter={24}>
                                            <Col span={3}>
                                                <span className='text-sm'>Tùy chọn</span>
                                            </Col>
                                            <Col span={21}>
                                                <Form.List name="varients">
                                                    {(fields, { add, remove }) => (
                                                        <div>
                                                            {fields.map(({ key, name, fieldKey, ...restField }, index) => (
                                                                <Row key={key} gutter={12} className='flex items-center'>
                                                                    <Col span={10}>
                                                                        <Form.Item
                                                                            {...restField}
                                                                            name={[name, 'classification']}
                                                                            fieldKey={[fieldKey, 'classification']}
                                                                            rules={[
                                                                                { required: true, message: 'Nhập phân loại hàng' },
                                                                                { validator: checkForDuplicates2 }
                                                                            ]}
                                                                        >
                                                                            <Row gutter={12} className='flex items-center'>
                                                                                <Col span={20}>
                                                                                    <Input
                                                                                        placeholder="Nhập phân loại hàng"
                                                                                        onChange={handleInputChange2(index, add)}
                                                                                        maxLength={20}
                                                                                        showCount
                                                                                        className='w-64'
                                                                                    />
                                                                                </Col>
                                                                                <Col span={4}>
                                                                                    {index > 0 && (
                                                                                        <RiDeleteBin6Line
                                                                                            onClick={() => handleRemoveVariant(index, remove)}
                                                                                            size={18}
                                                                                            className='cursor-pointer'
                                                                                        />
                                                                                    )}
                                                                                </Col>
                                                                            </Row>
                                                                        </Form.Item>
                                                                    </Col>
                                                                </Row>
                                                            ))}
                                                        </div>
                                                    )}
                                                </Form.List>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            )
                        }
                    </Col>
                </Row>
                {!state.showFormList && (
                    <Row gutter={24} className='mt-8'>
                        <Col span={3}>
                            <span className='text-sm'>Giá</span>
                        </Col>
                        <Col span={21}>
                            <Input
                                placeholder='Nhập giá'
                                value={state.priceDefault}
                                onChange={(e) => handleNumberInputChange(e, 'SET_PRICE_DEFAULT')}
                                onBeforeInput={handleBeforeInput}
                            />
                        </Col>
                    </Row>
                )}
                {!state.showFormList && (
                    <Row gutter={24} className='mt-8'>
                        <Col span={3}>
                            <span className='text-sm'>Kho hàng</span>
                        </Col>
                        <Col span={21}>
                            <Input
                                placeholder='Nhập số lượng hàng'
                                value={state.stockDefault}
                                onChange={(e) => handleNumberInputChange(e, 'SET_STOCK_DEFAULT')}
                                onBeforeInput={handleBeforeInput}
                            />
                        </Col>
                    </Row>
                )}
                {!state.showFormList && (
                    <Row gutter={24} className='mt-8 flex items-center'>
                        <Col span={3}>
                            <span className='text-sm'>Giảm giá</span>
                        </Col>
                        <Col span={21}>
                            <Slider
                                value={state.sale_percent_default}
                                onChange={(value) => dispatch({ type: 'SET_SALE_PERCENT_DEFAULT', payload: value })}
                                min={0}
                                max={60}
                                className='custom-slider'
                            />
                        </Col>
                    </Row>
                )}
                {state.showFormList && (
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        pagination={false}
                        bordered
                        className='mt-5'
                    />
                )}
            </Form>
            <Modal
                title="Lưu thông tin sản phẩm"
                visible={state.errorVisible}
                onOk={handleErrorCancel}
                onCancel={handleErrorCancel}
                okText='Đóng'
                cancelText='Hủy'
            >
                <p>{state.errorMessage}</p>
            </Modal>
        </div>
    );
}

export default SaleInformation;