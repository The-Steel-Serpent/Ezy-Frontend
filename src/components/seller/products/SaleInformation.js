import React, { useEffect, useReducer, useState } from 'react'
import { Form, Input, Upload, Button, Table, Row, Col, message, Modal, Slider } from 'antd';
import { GoPlus } from "react-icons/go";
import { VscClose } from "react-icons/vsc";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RiImageAddFill } from "react-icons/ri";
import { handleBeforeInput } from '../../../helpers/handleInput';

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
    priceDefault: '',
    sale_percent_default: 0,
    stockDefault: '',
    errorMessage: '',
    errorVisible: false,
    errors: {
        priceError: false,
        stockError: false,
        salePercentError: false,
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

    const handleErrorCancel = () => dispatch({ type: 'SET_ERROR_VISIBLE', payload: false });

    const handleUploadImage = (file, classificationIndex) => {
        console.log("Received classification index:", classificationIndex);
        const reader = new FileReader();
        reader.onload = () => {
            const newImage = { index: classificationIndex, url: reader.result };
            dispatch({
                type: 'SET_ALL_IMG_CLASSIFICATION',
                payload: state.allImgClassification.map((img, idx) => idx === classificationIndex ? newImage : img)
            });
        };
        reader.readAsDataURL(file.originFileObj);
        console.log("Processing file for classification index:", classificationIndex);
        console.log("allImgClassification", state.allImgClassification);
    };

    const handleInputPrice = (index) => (e) => {
        if (isNaN(e.target.value)) {
            message.error('Giá tiền phải là số!');
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
        if (isNaN(e.target.value)) {
            message.error('Số lượng hàng phải là số!');
        } else {
            const newStock = [...state.allStock];
            newStock[index] = e.target.value;
            dispatch({ type: 'SET_ALL_STOCK', payload: newStock });
        }
    };

    const toggleVisibility = () => {
        if (!state.showFormList) {
            form.setFieldsValue({ classifications: [{}] });
        }
        dispatch({ type: 'SET_SHOW_FORM_LIST', payload: !state.showFormList });
        dispatch({ type: 'SET_SHOW_BUTTON_LIST2', payload: !state.showFormList });
        dispatch({ type: 'SET_SHOW_FORM_LIST2', payload: false });
        dispatch({ type: 'SET_CLASSIFY_TYPE_NAME', payload: '' });
        dispatch({ type: 'SET_VARIANT_NAME', payload: '' });
        dispatch({ type: 'SET_ALL_CLASSIFY_NAME', payload: [] });
        dispatch({ type: 'SET_ALL_VARIANT_NAME', payload: [] });
        dispatch({ type: 'SET_ALL_IMG_CLASSIFICATION', payload: [] });
        dispatch({ type: 'SET_ALL_PRICE', payload: [] });
        dispatch({ type: 'SET_ALL_STOCK', payload: [] });
    };

    const toggleVisibility2 = () => {
        dispatch({ type: 'SET_SHOW_FORM_LIST2', payload: true });
        if (!state.showFormList2) {
            form.setFieldsValue({ varients: [{}] });
        }
        dispatch({ type: 'SET_SHOW_BUTTON_LIST2', payload: false });
    };

    const toggleVisibility3 = () => {
        dispatch({ type: 'SET_SHOW_FORM_LIST2', payload: false });
        dispatch({ type: 'SET_SHOW_BUTTON_LIST2', payload: true });
        dispatch({ type: 'SET_ALL_CLASSIFY_NAME', payload: [] });
        dispatch({ type: 'SET_ALL_VARIANT_NAME', payload: [] });
        dispatch({ type: 'SET_ALL_IMG_CLASSIFICATION', payload: [] });
        dispatch({ type: 'SET_ALL_PRICE', payload: [] });
        dispatch({ type: 'SET_ALL_STOCK', payload: [] });
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
        const newImgClassification = [...state.allImgClassification];
        newImgClassification.splice(index, 1);
        dispatch({ type: 'SET_ALL_IMG_CLASSIFICATION', payload: newImgClassification });
        const newPrice = [...state.allPrice];
        newPrice.splice(index, 1);
        dispatch({ type: 'SET_ALL_PRICE', payload: newPrice });
        const newStock = [...state.allStock];
        newStock.splice(index, 1);
        dispatch({ type: 'SET_ALL_STOCK', payload: newStock });
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
                            <div className='flex items-center gap-3 justify-center'>
                                <Upload
                                    listType="picture-card"
                                    maxCount={1}
                                    fileList={state.allImgClassification[index]}
                                    onChange={({ file }) => handleUploadImage(file, index)}
                                    beforeUpload={beforeUpload}
                                >
                                    {state.allImgClassification.find(img => img.index === index) ? (
                                        <img src={state.allImgClassification.find(img => img.index === index).url} alt="uploaded" className='w-16 h-16' />
                                    ) : (
                                        <RiImageAddFill size={18} />
                                    )}

                                </Upload>
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

    useEffect(() => {
        if (state.add_product_level === 1) {
            console.log('only product');
            console.log('Price:', state.priceDefault);
            console.log('Stock:', state.stockDefault);
            console.log('Sale percent:', state.sale_percent_default);
        }
    }, [state.priceDefault, state.stockDefault, state.sale_percent_default])

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
                                    <Row gutter={24}>
                                        <Col span={3}>
                                            <span className='text-sm'>Tùy chọn</span>
                                        </Col>
                                        <Col span={21}>
                                            <Form.List name="classifications">
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
                                                                            { validator: checkForDuplicates }
                                                                        ]}
                                                                    >
                                                                        <Row gutter={12} className='flex items-center'>
                                                                            <Col span={20}>
                                                                                <Input
                                                                                    placeholder="Nhập phân loại hàng"
                                                                                    onChange={handleInputChange(index, add)}
                                                                                    maxLength={20}
                                                                                    showCount
                                                                                    className='w-64'
                                                                                />
                                                                            </Col>
                                                                            <Col span={4}>
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
                                // onChange={(e) => dispatch({ type: 'SET_PRICE_DEFAULT', payload: e.target.value })}
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