import React, { useEffect, useState } from 'react'
import { Form, Input, Upload, Button, Modal, Table, Row, Col, Select, Space } from 'antd';
import { GoPlus } from "react-icons/go";
import { VscClose } from "react-icons/vsc";
import { RiDeleteBin6Line } from "react-icons/ri";


const SaleInformation = () => {
    const [form] = Form.useForm();
    const [showFormList, setShowFormList] = useState(false); 
    const [showButtonList2, setShowButtonList2] = useState(false);
    const [showFormList2, setShowFormList2] = useState(false);

    const toggleVisibility = () => {
        if (!showFormList) {
            form.setFieldsValue({ classifications: [{}] });
        }
        if(showFormList)
            setShowButtonList2(false);
        else
            setShowButtonList2(true);
        setShowFormList(prevState => !prevState);
    };

    const toggleVisibility2 = () => {
        // hide button
        setShowButtonList2(false);
        // show form
        setShowFormList2(true);
    };

    const handleInputChange = (index, add) => (e) => {
        const fields = form.getFieldValue('classifications') || [];
        if (index === fields.length - 1 && e.target.value.trim() !== '') {
            add();
        }
    };
    const checkForDuplicates = (rule, value, callback) => {
        const fields = form.getFieldValue('classifications') || [];
        const trimmedValues = fields.map(item => item?.classification?.trim()).filter(Boolean);

        if (trimmedValues.filter(v => v === value?.trim()).length > 1) {
            return Promise.reject(new Error('Phân loại hàng không được trùng!'));
        }

        return Promise.resolve(); // Nếu không trùng, resolve bình thường

    };
    useEffect(() => {
        if (showFormList) {
            const fields = form.getFieldValue('classifications') || [];
            if (fields.length === 0) {
                form.setFieldsValue({ classifications: [{}] });
            }
        }
    }, [showFormList, form]);
    return (
        <div>
            <h3 className='text-lg'>Thông tin cơ bản</h3>
            <Form layout='vertical' className='ml-5 gap-12' form={form}>
                <Row gutter={1}>
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
                                <div className="classification-header flex justify-between">
                                    <div className='flex items-center'>
                                        <Row gutter={1}>
                                            <Col span={5} className='w-96'>
                                                <span className='text-sm'>Phân loại 1</span>
                                            </Col>
                                            <Col span={19} className='w-3/5'>
                                                <Input className='w-48' showCount maxLength={15} />
                                            </Col>
                                        </Row>
                                    </div>
                                    <VscClose onClick={toggleVisibility} size={20} className='cursor-pointer' />
                                </div>
                                <div className='flex mt-3 items-center'>
                                    <Row gutter={1}>
                                        <Col span={4} className='w-96'>
                                            <span className='text-sm'>Tùy chọn</span>
                                        </Col>
                                        <Col span={20} className='w-3/5'>
                                            <Form.List name="classifications">
                                                {(fields, { add, remove }) => (
                                                    <div className='flex flex-wrap gap-4'>
                                                        {fields.map(({ key, name, fieldKey, ...restField }, index) => (
                                                            <div key={key} className='flex items-center'>
                                                                <Form.Item
                                                                    {...restField}
                                                                    name={[name, 'classification']}
                                                                    fieldKey={[fieldKey, 'classification']}
                                                                    rules={[
                                                                        { required: true, message: 'Nhập phân loại hàng' },
                                                                        { validator: checkForDuplicates }
                                                                    ]}
                                                                >
                                                                    <Input
                                                                        placeholder="Nhập phân loại hàng"
                                                                        onChange={handleInputChange(index, add)}
                                                                        maxLength={20}
                                                                        showCount
                                                                        suffix={index > 0 && (
                                                                            <RiDeleteBin6Line onClick={() => remove(name)} size={18} className='cursor-pointer' />
                                                                        )}
                                                                        className='w-48'
                                                                    />
                                                                </Form.Item>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </Form.List>
                                        </Col>
                                    </Row>
                                </div>
                              
                            </div>
                        )}
                        {
                            showButtonList2 && (
                                <div className='mt-3 bg-[#F6F6F6] p-3 border rounded'>
                                    <Button type="dashed" icon={<GoPlus size={25} />} className='text-sm' onClick={toggleVisibility2}>
                                        Thêm nhóm phân loại 2
                                    </Button>
                                </div>
                            )
                        }
                      
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

export default SaleInformation