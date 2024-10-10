import { Col, Form, Input, Row } from 'antd';
import React, { useEffect, useReducer } from 'react';
import { handleBeforeInput } from '../../../helpers/handleInput';

const initialState = {
    length: '',
    width: '',
    height: '',
    weight: '',
    errors:
    {
        length: '',
        width: '',
        height: '',
        weight: ''
    }
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'set_length':
            return { ...state, length: action.value };
        case 'set_width':
            return { ...state, width: action.value };
        case 'set_height':
            return { ...state, height: action.value };
        case 'set_weight':
            return { ...state, weight: action.value };
        case 'set_errors':
            return { ...state, errors: action.value };
        default:
            return state;
    }
};

const ShippingProductInformation = ({ onData }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const handleInputChange = (e, type) => {
        const value = e.target.value;
        if (!isNaN(value)) {
            dispatch({ type: type, value: value });
            console.log(state);
        }
    };

    const validate = () => {
        let valid = true;
        let errors = {
            length: '',
            width: '',
            height: '',
            weight: ''
        };

        if (state.length === '') {
            errors.length = 'Vui lòng nhập chiều dài';
            valid = false;
        }
        if (state.width === '') {

            errors.width = 'Vui lòng nhập chiều rộng';
            valid = false;
        }

        if (state.height === '') {
            errors.height = 'Vui lòng nhập chiều cao';
            valid = false;
        }

        if (state.weight === '') {
            errors.weight = 'Vui lòng nhập cân nặng';
            valid = false;
        }
        dispatch({ type: 'set_errors', value: errors });
        return valid;
    };

    useEffect(() => {
        validate();
    }, []);

    useEffect(() => {
        validate();
    }, [state.length, state.width, state.height, state.weight]);

    useEffect(() => {
        onData({ noErrorShippingInfo: false });
        const errors = state.errors;
        if (errors.length === '' && errors.width === '' && errors.height === '' && errors.weight === '') {
            const data = {
                length: state.length,
                width: state.width,
                height: state.height,
                weight: state.weight,
                noErrorShippingInfo: true
            };
            onData(data);
            console.log("No Error:", errors);
        }
        else {
            console.log("Error shipping info:", errors);
            onData({ noErrorShippingInfo: false });
        }

    }, [state.errors]);



    return (
        <div>
            <h3 className='text-lg'>Vận chuyển</h3>
            <Form>
                <Row gutter={12}>
                    <Col span={12}>
                        <Form.Item
                            label='Chiều dài'
                            name='length'
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập chiều dài'
                                }
                            ]}
                        >
                            <Input
                                value={state.length}
                                onChange={(e) => handleInputChange(e, 'set_length')}
                                onBeforeInput={handleBeforeInput}
                                addonAfter='cm'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Chiều rộng'
                            name='width'
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập chiều rộng'
                                }
                            ]}
                        >
                            <Input
                                value={state.width}
                                onChange={(e) => handleInputChange(e, 'set_width')}
                                onBeforeInput={handleBeforeInput}
                                addonAfter='cm'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Chiều cao'
                            name='height'
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập chiều cao'
                                }
                            ]}
                        >
                            <Input
                                value={state.height}
                                onChange={(e) => handleInputChange(e, 'set_height')}
                                onBeforeInput={handleBeforeInput}
                                addonAfter='cm'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Cân nặng'
                            name='weight'
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập cân nặng'
                                }
                            ]}
                        >
                            <Input
                                value={state.weight}
                                onChange={(e) => handleInputChange(e, 'set_weight')}
                                onBeforeInput={handleBeforeInput}
                                addonAfter='gram'
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default ShippingProductInformation;
