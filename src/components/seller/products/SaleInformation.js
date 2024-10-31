import React, { useEffect, useReducer, useState } from 'react'
import { Form, Input, Upload, Button, Table, Row, Col, message, Modal, Slider } from 'antd';
import { GoPlus } from "react-icons/go";
import { VscClose } from "react-icons/vsc";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RiImageAddFill } from "react-icons/ri";
import { handleBeforeInput } from '../../../helpers/handleInput';
import FormItem from 'antd/es/form/FormItem';

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
    enable_apply_all: false,
    apply_all_price: '',
    apply_all_stock: '',
    apply_all_sale_percent: '',
    errorPriceTable: [],
    errorStockTable: [],
    errorSalePercentTable: [], 
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
        case 'SET_APPLY_ALL_PRICE':
            return { ...state, apply_all_price: action.payload };
        case 'SET_APPLY_ALL_STOCK':
            return { ...state, apply_all_stock: action.payload };
        case 'SET_APPLY_ALL_SALE_PERCENT':
            return { ...state, apply_all_sale_percent: action.payload };
        case 'SET_ENABLE_APPLY_ALL':
            return { ...state, enable_apply_all: action.payload };
        case 'SET_ERROR_PRICE_TABLE':
            return { ...state, errorPriceTable: action.payload };
        case 'SET_ERROR_STOCK_TABLE':
            return { ...state, errorStockTable: action.payload };
        case 'SET_ERROR_SALE_PERCENT_TABLE':
            return { ...state, errorSalePercentTable: action.payload };
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
    const handleNumberInputChange = (e, type) => {
        const value = e.target.value;
        if (!isNaN(value)) {
            dispatch({ type: type, payload: value });
        }
    };

    const handleInputPrice = (index) => (e) => {
        const inputValue = e.target.value;

        const newPrice = [...state.allPrice];
        newPrice[index] = inputValue;
        dispatch({ type: 'SET_ALL_PRICE', payload: newPrice });

        const newErrorPrice = [...state.errorPriceTable];

        if (isNaN(inputValue)) {
            newErrorPrice[index] = 'Giá tiền phải là số';
        } else if (inputValue === '') {
            newErrorPrice[index] = 'Giá tiền không được để trống';
        } else if (parseInt(inputValue) < 1000) {
            newErrorPrice[index] = 'Giá phải tối thiểu là 1000';
        } else {
            newErrorPrice[index] = '';
        }

        dispatch({ type: 'SET_ERROR_PRICE_TABLE', payload: newErrorPrice });
    };


    const handleInputStock = (index) => (e) => {
        const inputValue = e.target.value;

        const newStock = [...state.allStock];
        newStock[index] = inputValue;
        dispatch({ type: 'SET_ALL_STOCK', payload: newStock });

        const newErrorStock = [...state.errorStockTable];

        if (isNaN(inputValue)) {
            newErrorStock[index] = 'Số lượng hàng phải là số';
        } else if (inputValue === '') {
            newErrorStock[index] = 'Số lượng hàng không được để trống';
        } else if (parseInt(inputValue) <= 0) {
            newErrorStock[index] = 'Số lượng hàng phải lớn hơn 0';
        } else {
            newErrorStock[index] = '';
        }
        dispatch({ type: 'SET_ERROR_STOCK_TABLE', payload: newErrorStock });
    };


    const handleSalePercent = (index) => (e) => {
        const inputValue = e.target.value;

        const newSalePercent = [...state.allSalePercent];
        newSalePercent[index] = inputValue;
        dispatch({ type: 'SET_ALL_SALE_PERCENT', payload: newSalePercent });

        const newErrorSalePercent = [...state.errorSalePercentTable];

        if (isNaN(inputValue)) {
            newErrorSalePercent[index] = 'Phần trăm giảm giá phải là số!';
        } else if (inputValue === '') {
            newErrorSalePercent[index] = 'Phần trăm giảm giá không được để trống!';
        } else if (parseInt(inputValue) < 0 || parseInt(inputValue) > 60) {
            newErrorSalePercent[index] = 'Phần trăm giảm giá phải từ 0 đến 60%';
        } else {
            newErrorSalePercent[index] = '';
        }

        // Cập nhật lại lỗi cho tất cả phần tử
        dispatch({ type: 'SET_ERROR_SALE_PERCENT_TABLE', payload: newErrorSalePercent });
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
        dispatch({ type: 'SET_ALL_IMG_CLASSIFICATION', payload: [] });
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
        // dispatch({ type: 'SET_ALL_CLASSIFY_NAME', payload: [] });
        // dispatch({ type: 'SET_ALL_VARIANT_NAME', payload: [] });
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

    // apply all
    const disableApplyAll = () => {
        dispatch({ type: 'SET_ENABLE_APPLY_ALL', payload: false });
    }
    const handleChangeApplyAll = async (e, type) => {
        const value = e.target.value;
        const parsedValue = parseFloat(value);
        let errorMessage = '';

        // Check for NaN
        if (isNaN(parsedValue)) {
            switch (type) {
                case 'apply-all-price':
                    errorMessage = 'Giá tiền phải là số!';
                    dispatch({ type: 'SET_APPLY_ALL_PRICE', payload: '' });
                    break;
                case 'apply-all-stock':
                    errorMessage = 'Số lượng hàng phải là số!';
                    dispatch({ type: 'SET_APPLY_ALL_STOCK', payload: '' });
                    break;
                case 'apply-all-sale-percent':
                    errorMessage = 'Phần trăm giảm giá phải là số!';
                    dispatch({ type: 'SET_APPLY_ALL_SALE_PERCENT', payload: '' });
                    break;
            }
            message.error(errorMessage);
            dispatch({ type: 'SET_ENABLE_APPLY_ALL', payload: false });
            return;
        }

        // Check for empty value
        if (value === '') {
            switch (type) {
                case 'apply-all-price':
                    errorMessage = 'Giá tiền không được để trống!';
                    break;
                case 'apply-all-stock':
                    errorMessage = 'Số lượng hàng không được để trống!';
                    break;
                case 'apply-all-sale-percent':
                    errorMessage = 'Phần trăm giảm giá không được để trống!';
                    break;
            }
            message.error(errorMessage);
            return;
        }

        // Check for minimum value conditions
        if (
            (type === 'apply-all-price' && parsedValue < 1000) ||
            (type === 'apply-all-stock' && parsedValue <= 0) ||
            (type === 'apply-all-sale-percent' && (parsedValue < 0 || parsedValue > 60))
        ) {
            switch (type) {
                case 'apply-all-price':
                    errorMessage = 'Giá phải tối thiểu là 1000!';
                    break;
                case 'apply-all-stock':
                    errorMessage = 'Số lượng hàng phải lớn hơn 0!';
                    break;
                case 'apply-all-sale-percent':
                    errorMessage = 'Phần trăm giảm giá phải từ 0 đến 60!';
                    break;
            }
            message.error(errorMessage);
            return;
        }

        // Dispatch the value to the relevant state
        switch (type) {
            case 'apply-all-price':
                dispatch({ type: 'SET_APPLY_ALL_PRICE', payload: value });
                break;
            case 'apply-all-stock':
                dispatch({ type: 'SET_APPLY_ALL_STOCK', payload: value });
                break;
            case 'apply-all-sale-percent':
                dispatch({ type: 'SET_APPLY_ALL_SALE_PERCENT', payload: value });
                break;
        }
        disableApplyAll();
    };

    useEffect(() => {
        if (state.apply_all_price !== '' && state.apply_all_stock !== '' && state.apply_all_sale_percent !== '')
            dispatch({ type: 'SET_ENABLE_APPLY_ALL', payload: true });
    }, [state.apply_all_price, state.apply_all_stock, state.apply_all_sale_percent])

    const handleApplyAllSubmit = () => {
        let quantity = 0;

        if (state.add_product_level === 2) {
            quantity = state.allClassifyName.length;
            console.log('Quantity', quantity);
        }
        else if (state.add_product_level === 3) {
            const classifyQuantity = state.allClassifyName.length;
            const variantQuantity = state.allVarientName.length;
            quantity = classifyQuantity * variantQuantity;
            console.log('Quantity', quantity);
        }
        let allPrice = [];
        let allStock = [];
        let allSalePercent = [];
        for (let i = 0; i < quantity; i++) {
            allPrice.push(state.apply_all_price);
            allStock.push(state.apply_all_stock);
            allSalePercent.push(state.apply_all_sale_percent);
        }
        dispatch({ type: 'SET_ALL_PRICE', payload: allPrice });
        dispatch({ type: 'SET_ALL_STOCK', payload: allStock });
        dispatch({ type: 'SET_ALL_SALE_PERCENT', payload: allSalePercent });

    }
    // apply all

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
            title: <span>Kho hàng</span>,
            dataIndex: 'stock',
            key: 'stock',
            render: (text, record, index) => (
                <div>
                    <Input
                        value={state.allStock[index]}
                        onChange={handleInputStock(index)}
                        placeholder='Nhập số lượng hàng'
                        addonAfter='Cái'
                    />
                    {/* error */}
                    <div className='text-red-500 text-sm'>{state.errorStockTable[index]}</div>
                </div>

            ),
        },
        {
            title: <span>Giá</span>,
            dataIndex: 'price',
            key: 'price',
            render: (text, record, index) => (
                <div>
                    <Input
                        value={state.allPrice[index]}
                        onChange={handleInputPrice(index)}
                        placeholder='Nhập giá'
                        addonAfter='VND'
                    />
                    {/* error */}
                    <div className='text-red-500 text-sm'>{state.errorPriceTable[index]}</div>
                </div>
            ),
        },
        {
            title: <span>Giảm giá</span>,
            dataIndex: 'sale_percent',
            key: 'sale_percent',
            render: (text, record, index) => (
                <div>
                    <Input
                        value={state.allSalePercent[index]}
                        onChange={handleSalePercent(index)}
                        placeholder='Phần trăm giảm giá'
                        addonAfter='%'
                    />
                    {/* error */}
                    <div className='text-red-500 text-sm'>{state?.errorSalePercentTable[index]}</div>
                </div>
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
        // check errorPriceTable, errorStockTable, errorSalePercentTable
        for (let i = 0; i < state.errorPriceTable.length; i++) {
            if (
                state.errorPriceTable[i] !== '' ||
                state.errorStockTable[i] !== '' ||
                state.errorSalePercentTable[i] !== ''
            ) {
                valid = false;
                break;
            }
        }
        return valid;
    }

    const validateAddProductLevel3 = () => {
        let valid = true;
        const count_classification = state.allClassifyName.length;
        const count_varient = state.allVarientName.length;
        const count_img_classification = state.allImgClassification.length;
        const count_stock = state.allStock.length;
        const count_price = state.allPrice.length;
        const count_sale_percent = state.allSalePercent.length;
        if (
            count_classification !== count_img_classification ||
            state.classifyTypeName === '' ||
            state.allClassifyName.length === 0 ||
            state.variantName === '' ||
            state.allVarientName.length === 0 ||
            count_stock !== count_classification * count_varient ||
            count_price !== count_classification * count_varient ||
            count_sale_percent !== count_classification * count_varient) {
            valid = false;
        }
        for (let i = 0; i < state.errorPriceTable.length; i++) {
            if (
                state.allClassifyName[i] === '' ||
                state.allImgClassification[i] === null
            ) {
                valid = false;
                break;
            }
        }
        for (let i = 0; i < count_varient; i++) {

            if (
                state.allVarientName[i] === ''
            ) {
                valid = false;
                break;
            }
        }

        console.log("Count classification: ", count_classification);
        console.log("Count varient: ", count_varient);
        console.log("Count img classification: ", count_img_classification);
        console.log("Count stock: ", count_stock);
        console.log("Count price: ", count_price);
        console.log("Count sale percent: ", count_sale_percent);

        return valid;
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
            const check = validateAddProductLevel3();
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
                    sale_percent: state.allSalePercent,
                    allVarientName: state.allVarientName,
                    variantName: state.variantName
                });
            }
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
        state.errorPriceTable,
        state.errorStockTable,
        state.errorSalePercentTable
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
                                                    placeholder='ví du: Màu sắc v.v'
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
                                                    <Input 
                                                        showCount 
                                                        maxLength={15}
                                                        placeholder='ví dụ: size v.v' 
                                                        className='w-64' />
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
                    <div className='mt-5'>
                        <Row gutter={12} className='flex mb-5'>
                            <Col span={3}>
                                <span className='font-semibold'>Danh sách phân loại hàng </span>
                            </Col>
                            <Col span={6}>
                                <FormItem
                                    name='apply-all-stock'
                                    rules={[
                                        { required: true, message: 'Nhập số lượng hàng' }
                                    ]}
                                >
                                    <Input
                                        placeholder='Số lượng hàng'
                                        value={state.apply_all_stock}
                                        onBlur={(e) => handleChangeApplyAll(e, 'apply-all-stock')}
                                    />

                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem
                                    name='apply-all-price'
                                    rules={[
                                        { required: true, message: 'Hãy Nhập giá' }
                                    ]}
                                >
                                    <Input
                                        placeholder='Giá'
                                        value={state.apply_all_price}
                                        onBlur={(e) => handleChangeApplyAll(e, 'apply-all-price')}
                                    />
                                </FormItem>

                            </Col>

                            <Col span={6}>
                                <FormItem
                                    name='apply-all-sale-percent'
                                    value={state.apply_all_sale_percent}
                                    rules={[
                                        { required: true, message: 'Nhập phần trăm giảm giá' }
                                    ]}
                                >
                                    <Input
                                        placeholder='Giảm giá (%)'
                                        value={state.apply_all_sale_percent}
                                        onBlur={(e) => handleChangeApplyAll(e, 'apply-all-sale-percent')}
                                    />
                                </FormItem>
                            </Col>
                            <Button
                                onClick={handleApplyAllSubmit}
                                disabled={!state.enable_apply_all}
                                span={3}>Áp dụng hàng loạt</Button>

                        </Row>
                        <Table
                            columns={columns}
                            dataSource={dataSource}
                            pagination={false}
                            bordered
                        />
                    </div>
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