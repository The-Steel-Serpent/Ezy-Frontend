import React, { useEffect, useState } from 'react'
import { Form, Input, Upload, Button, Table, Row, Col, message, Modal } from 'antd';
import { GoPlus } from "react-icons/go";
import { VscClose } from "react-icons/vsc";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsQuestionCircle } from "react-icons/bs";
import { RiImageAddFill } from "react-icons/ri";

const SaleInformation = () => {
    const [form] = Form.useForm();
    const [showFormList, setShowFormList] = useState(false);
    const [showFormList2, setShowFormList2] = useState(false);
    const [showButtonList2, setShowButtonList2] = useState(false);

    const [classifyTypeName, setClassifyTypeName] = useState('');
    const [variantName, setVariantName] = useState('');
    const [allClassifyName, setAllClassifyName] = useState([]);
    const [allVarientName, setAllVarientName] = useState([]);
    const [allImgClassification, setAllImgClassification] = useState([]);
    const [allPrice, setAllPrice] = useState([]);
    const [allStock, setAllStock] = useState([]);

    
    const [errorMessage, setErrorMessage] = useState('');
    const [errorVisible, setErrorVisible] = useState(false);


    const beforeUpload = file => {
        const isImage = file.type.startsWith('image/');
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isImage) {
            setErrorMessage('Bạn chỉ có thể tải lên tệp hình ảnh!');
            setErrorVisible(true);
            return Upload.LIST_IGNORE;
        }
        if (!isLt2M) {
            setErrorMessage('Kích thước tập tin vượt quá 2.0 MB');
            setErrorVisible(true);
            return Upload.LIST_IGNORE;
        }
        return true;
    };
    const handleErrorCancel = () => setErrorVisible(false);

    const handleUploadImage = (file, classificationIndex) => {
        console.log("Received classification index:", classificationIndex); 
        const reader = new FileReader();
        reader.onload = () => {
            const newImage = { index: classificationIndex, url: reader.result };  
            setAllImgClassification(prevState => {
                const updatedState = [...prevState];
                const existingImageIndex = updatedState.findIndex(img => img.index === classificationIndex);
                if (existingImageIndex !== -1) {
                    // Update the existing image
                    updatedState[existingImageIndex] = newImage;
                } else {
                    // Add the new image
                    updatedState.push(newImage);
                    console.log("Added new image at classification index:", classificationIndex);
                }
                return updatedState;
            });
        };
        reader.readAsDataURL(file.originFileObj);
        console.log("Processing file for classification index:", classificationIndex);
        console.log("allImgClassification", allImgClassification);
    };

    const handleInputPrice = (index) => (e) => {
        const newPrice = [...allPrice];
        newPrice[index] = e.target.value; // Cập nhật giá trị tại index
        setAllPrice(newPrice); // Cập nhật state mà không làm mất các giá trị khác
    };

    const handleInputStock = (index) => (e) => {
        const newStock = [...allStock];
        newStock[index] = e.target.value; // Cập nhật giá trị tại index
        setAllStock(newStock); // Cập nhật state mà không làm mất các giá trị khác
    };
    
    const toggleVisibility = () => {
        if (!showFormList) {
            form.setFieldsValue({ classifications: [{}] });

        }
        setShowFormList(!showFormList);
        setShowButtonList2(!showFormList);
        setShowFormList2(false);
        setClassifyTypeName('');
        setVariantName('');
        // clear data source
        setAllClassifyName([]);
        setAllVarientName([]);
        setAllImgClassification([]);
        setAllPrice([]);
        setAllStock([]);
    };

    const toggleVisibility2 = () => {
        setShowFormList2(true);
        if (!showFormList2) {
            form.setFieldsValue({ varients: [{}] });
        }
        setShowButtonList2(false);
    
    };

    const toggleVisibility3 = () => {
        setShowFormList2(false);
        setShowButtonList2(true);
        // clear data source
        setAllClassifyName([]);
        setAllVarientName([]);
        setAllImgClassification([]);
        setAllPrice([]);
        setAllStock([]);
       
    };

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
        setAllClassifyName(trimmedValues);
        return Promise.resolve();
    };



    const checkForDuplicates2 = (rule, value) => {
        const fields = form.getFieldValue('varients') || [];
        const trimmedValues = fields.map(item => item?.classification?.trim()).filter(Boolean);
        if (trimmedValues.filter(v => v === value?.trim()).length > 1) {
            return Promise.reject(new Error('Phân loại hàng không được trùng!'));
        }
        setAllVarientName(trimmedValues);
        return Promise.resolve();
    };


    useEffect(() => {
        if (showFormList) {
            const fields = form.getFieldValue('classifications') || [];
            if (fields.length === 0) {
                form.setFieldsValue({ classifications: [{}] });
            }
        }
    }, [showFormList, form]);

    useEffect(() => {
        if (showFormList2) {
            const fields = form.getFieldValue('varients') || [];
            if (fields.length === 0) {
                form.setFieldsValue({ varients: [{}] });
            }
        }
    }, [showFormList2, form]);
    const columns = [
        {
            title: `${classifyTypeName || 'Phân loại 1'}`,
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
                                    onChange={({ file }) => handleUploadImage(file, index)}
                                    beforeUpload={beforeUpload}
                                >
                                    {allImgClassification.find(img => img.index === index) ? (
                                        <img src={allImgClassification.find(img => img.index === index).url} alt="uploaded" className='w-16 h-16' />
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
        ...(allVarientName.length > 0 ? [{
            title: `${variantName || 'Phân loại 2'}`,
            dataIndex: 'allVarientName',
            key: 'allVarientName',
        }] : []),
        {
            title: 'Kho hàng',
            dataIndex: 'stock',
            key: 'stock',
            render: (text, record, index) => (
                <Input
                    defaultValue={allStock[index]} 
                    onBlur={handleInputStock(index)}
                />
            ),
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (text, record, index) => (
                <Input
                    defaultValue={allPrice[index]} 
                    onBlur={handleInputPrice(index)}
                />
            ),
        },
    ];
    const dataSource = allClassifyName.flatMap((classify, classifyIndex) => {
        return allVarientName.length > 0
            ? allVarientName.map((variant, variantIndex) => ({
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
        console.log(dataSource);
        console.log(allPrice);
        console.log(allStock);
        console.log(allImgClassification);
    }, [dataSource]);

    

    return (
        <div>
            <h3 className='text-lg'>Thông tin bán hàng</h3>
            <Form layout='vertical' className='ml-5 gap-12' form={form}>
                <Row gutter={24}>
                    <Col span={3}>
                        <span className='text-sm'>Phân loại hàng</span>
                    </Col>
                    <Col span={21}>
                        {!showFormList && (
                            <Button type="dashed" icon={<GoPlus size={25} />} className='text-sm' onClick={toggleVisibility}>
                                Thêm nhóm phân loại
                            </Button>
                        )}
                        {showFormList && (
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
                                                    value={classifyTypeName}
                                                    onChange={(e) => setClassifyTypeName(e.target.value)}
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
                                                                                        onClick={() => remove(name)}
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
                        {showButtonList2 && (
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
                            showFormList2 && (
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
                                                    value={variantName}
                                                    onChange={(e) => setVariantName(e.target.value)}
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
                                                                                            onClick={() => remove(name)}
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
                {!showFormList && (
                    <Row gutter={24} className='mt-8'>
                        <Col span={3}>
                            <span className='text-sm'>Giá</span>
                        </Col>
                        <Col span={21}>
                            <Form.Item
                                name="price"
                                rules={[
                                    {
                                        validator: (_, value) => {
                                            if (!value) {
                                                return Promise.reject('Không được để trống');
                                            }
                                            if (isNaN(value)) {
                                                return Promise.reject('Giá trị phải là số');
                                            }
                                            if (Number(value) < 10) {
                                                return Promise.reject('Giá trị phải ít nhất 10');
                                            }
                                            return Promise.resolve();
                                        }
                                    }]}
                            >
                                <Input
                                    placeholder="Nhập vào"
                                    className='w-64'
                                    prefix='VND'
                                />
                            </Form.Item>
                        </Col>

                    </Row>
                )}
                {!showFormList && (
                    <Row gutter={24} className='mt-3'>
                        <Col span={3}>
                            <span className='text-sm'>Kho hàng</span>
                        </Col>
                        <Col span={21}>
                            <Form.Item
                                name="quantity"
                                rules={[
                                    {
                                        validator: (_, value) => {
                                            if (!value) {
                                                return Promise.reject('Không được để trống');
                                            }
                                            if (isNaN(value)) {
                                                return Promise.reject('Giá trị phải là số');
                                            }

                                            return Promise.resolve();
                                        }
                                    }]}
                            >
                                <Input
                                    placeholder="Nhập vào"
                                    className='w-64'
                                    prefix={<BsQuestionCircle size={15} />}
                                />
                            </Form.Item>
                        </Col>

                    </Row>
                )}
                {showFormList && (

                    <Row gutter={12}>
                        <Col span={3}>
                            Danh sách phân loại
                        </Col>
                        <Col span={21}>
                            <Table
                                columns={columns}
                                dataSource={dataSource}
                                pagination={false}
                                rowKey="key"
                                className='mx-auto mt-5 border border-gray-300'
                                bordered
                                components={{
                                    header: {
                                        cell: (props) => <th {...props} className="border-r border-b border-gray-300" />,
                                    },
                                    body: {
                                        row: (props) => <tr {...props} className="border-b border-gray-300" />,
                                        cell: (props) => <td {...props} className="border-r border-gray-300" />,
                                    },
                                }}
                            />
                        </Col>
                    </Row>
                )}

            </Form>
            <Modal
                visible={errorVisible}
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
                <p>{errorMessage}</p>
            </Modal>
        </div>
    )
}

export default SaleInformation