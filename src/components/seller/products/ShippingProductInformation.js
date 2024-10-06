import { Col, Form, Input, Row } from 'antd';
import React, { useReducer } from 'react';
import { handleBeforeInput } from '../../../helpers/handleInput';

const initialState = {
    length: '',
    width: '',
    height: '',
    weight: ''
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
        default:
            return state;
    }
};

const ShippingProductInformation = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const handleInputChange = (e, type) => {
        const value = e.target.value;
        if (!isNaN(value)) {
            dispatch({ type: type, value: value });
            console.log(state);
        }
    };


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
                                onBeforeInput={handleBeforeInput} />
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
                                 />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default ShippingProductInformation;
