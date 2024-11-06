import { Button, Col, Input, message, Modal, Popconfirm, Row, Upload } from 'antd'
import React, { forwardRef, useEffect, useImperativeHandle, useReducer, useRef } from 'react'
import { handleBeforeInput } from '../../../helpers/handleInput'
import FormItem from 'antd/es/form/FormItem'
import { updateSomeSaleInfoProductVarients } from '../../../services/productService'

const initialState = {
    varients_names: [],
    product_level: null,
    prices: [],
    stocks: [],
    sale_percents: [],
    errors_prices: [],
    errors_stocks: [],
    errors_sale_percents: [],
    apply_all_price: '',
    apply_all_stock: '',
    apply_all_sale_percent: '',
    enable_apply_all: false,
    enable_submit: false,
    submit_loading: false
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_PRODUCT_LEVEL':
            return { ...state, product_level: action.payload }
        case 'SET_VARIENTS_NAMES':
            return { ...state, varients_names: action.payload }
        case 'SET_PRICES':
            return { ...state, prices: action.payload };
        case 'SET_STOCKS':
            return { ...state, stocks: action.payload };
        case 'SET_SALE_PERCENTS':
            return { ...state, sale_percents: action.payload }
        case 'SET_ERRORS_PRICES':
            return { ...state, errors_prices: action.payload }
        case 'SET_ERRORS_STOCKS':
            return { ...state, errors_stocks: action.payload }
        case 'SET_ERRORS_SALE_PERCENTS':
            return { ...state, errors_sale_percents: action.payload }
        case 'SET_APPLY_ALL_PRICE':
            return { ...state, apply_all_price: action.payload };
        case 'SET_APPLY_ALL_STOCK':
            return { ...state, apply_all_stock: action.payload };
        case 'SET_APPLY_ALL_SALE_PERCENT':
            return { ...state, apply_all_sale_percent: action.payload };
        case 'SET_ENABLE_APPLY_ALL':
            return { ...state, enable_apply_all: action.payload };
        case 'SET_ENABLE_SUBMIT':
            return { ...state, enable_submit: action.payload };
        case 'SET_SUBMIT_LOADING':
            return { ...state, submit_loading: action.payload };
        case 'RESET':
            return initialState
        default:
            return state
    }
}

const EditSaleInfoModal = forwardRef(({ visible, onCancel, product, resetDataSource }, ref) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const handleInputPrices = (index) => (e) => {
        // Giá tiền phải là số, Giá tiền không được để trống, Giá phải tối thiểu là 1000
        // set error 
        const value = e.target.value;
        const errors = [...state.errors_prices];
        if (value === '') {
            errors[index] = 'Vui lòng nhập giá';
        } else if (value < 1000) {
            errors[index] = 'Giá tiền tối thiểu là 1000';
        } else {
            errors[index] = '';
        }
        dispatch({ type: 'SET_ERRORS_PRICES', payload: errors });
        const prices = [...state.prices];
        prices[index].price = value;
        dispatch({ type: 'SET_PRICES', payload: prices });
    }

    const handleInputStocks = (index) => (e) => {
        const value = e.target.value;
        const errors = [...state.errors_stocks];
        if (value === '') {
            errors[index] = 'Vui lòng nhập số lượng';
        } else {
            errors[index] = '';
        }
        dispatch({ type: 'SET_ERRORS_STOCKS', payload: errors });
        const stocks = [...state.stocks];
        stocks[index].stock = value;
        dispatch({ type: 'SET_STOCKS', payload: stocks });
    }

    const handleInputSalePercents = (index) => (e) => {
        const value = e.target.value;
        const errors = [...state.errors_sale_percents];
        if (value === '') {
            errors[index] = 'Vui lòng nhập phần trăm giảm giá';
        } else if (value < 0 || value > 60) {
            errors[index] = 'Phần trăm giảm giá phải nằm trong khoảng 0-60';
        } else {
            errors[index] = '';
        }
        dispatch({ type: 'SET_ERRORS_SALE_PERCENTS', payload: errors });
        const sale_percents = [...state.sale_percents];
        sale_percents[index].sale_percents = value;
        dispatch({ type: 'SET_SALE_PERCENTS', payload: sale_percents });
    }

    useEffect(() => {
        // Check if there are any errors in the prices, stocks, or sale_percents
        const hasErrors = [
            ...state.errors_prices,
            ...state.errors_stocks,
            ...state.errors_sale_percents
        ].some((error) => error !== '' && error !== undefined);

        dispatch({ type: 'SET_ENABLE_SUBMIT', payload: !hasErrors });

        console.log('errors_prices:', state.errors_prices);
        console.log('errors_stocks:', state.errors_stocks);
        console.log('errors_sale_percents:', state.errors_sale_percents);
    }, [
        state.errors_prices,
        state.errors_sale_percents,
        state.errors_stocks,
        state.prices,
        state.sale_percents,
        state.stocks
    ]);

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
        const prices = state.prices.map((item) => ({ ...item, price: state.apply_all_price }));
        const stocks = state.stocks.map((item) => ({ ...item, stock: state.apply_all_stock }));
        const sale_percents = state.sale_percents.map((item) => ({ ...item, sale_percents: state.apply_all_sale_percent }));
        dispatch({ type: 'SET_PRICES', payload: prices });
        dispatch({ type: 'SET_STOCKS', payload: stocks });
        dispatch({ type: 'SET_SALE_PERCENTS', payload: sale_percents });
    }

    const handleSubmit = async () => {
        dispatch({ type: 'SET_SUBMIT_LOADING', payload: true });
        const prices = state.prices.map((item) => (item.price));
        const stocks = state.stocks.map((item) => (item.stock));
        const sale_percents = state.sale_percents.map((item) => (item.sale_percents));
        const product_varients_ids = state.prices.map((item) => item.product_varients_id);


        const payload = {
            prices: prices,
            stocks: stocks,
            sale_percents: sale_percents,
            product_varients_ids: product_varients_ids,
        }
        console.log('payload:', payload);
        const res = await updateSomeSaleInfoProductVarients(payload);
        if (res.success) {
            message.success('Cập nhật thông tin bán hàng thành công');
        }
        else {
            message.error('Cập nhật thông tin bán hàng thất bại');
        }
        dispatch({ type: 'SET_SUBMIT_LOADING', payload: false });
        resetDataSource();
        onCancel();
    }

    const resetState = () => {
        dispatch({ type: 'SET_APPLY_ALL_STOCK', payload: '' });
        dispatch({ type: 'SET_APPLY_ALL_PRICE', payload: '' });
        dispatch({ type: 'SET_APPLY_ALL_SALE_PERCENT', payload: '' });
        dispatch({ type: 'RESET' })
    }

    useImperativeHandle(ref, () => ({
        resetState
    }));


    useEffect(() => {
        if (product && product?.ProductVarients[0]?.ProductClassify == null) {
            console.log('level 1:', product.ProductVarients);
            dispatch({ type: 'SET_PRODUCT_LEVEL', payload: 1 });
            dispatch({ type: 'SET_VARIENTS_NAMES', payload: product?.product_name });

            const prices = product.ProductVarients.map((item) => ({
                price: item.price,
                product_varients_id: item.product_varients_id
            }));
            dispatch({ type: 'SET_PRICES', payload: prices });
            console.log('prices:', prices);

            const stocks = product.ProductVarients.map((item) => ({
                stock: item.stock,
                product_varients_id: item.product_varients_id
            }));
            dispatch({ type: 'SET_STOCKS', payload: stocks });
            console.log('stocks:', stocks);

            const sale_percents = product.ProductVarients.map((item) => ({
                sale_percents: item.sale_percents,
                product_varients_id: item.product_varients_id
            }));
            dispatch({ type: 'SET_SALE_PERCENTS', payload: sale_percents });
            console.log('sale_percents:', sale_percents);
        }
        if (product && product?.ProductVarients[0]?.ProductClassify && product.ProductVarients[0]?.ProductSize == null) {
            console.log('level 2:', product.ProductVarients);
            dispatch({ type: 'SET_PRODUCT_LEVEL', payload: 2 })
            const varients_names = product.ProductVarients.map((item) => item.ProductClassify.product_classify_name);
            dispatch({ type: 'SET_VARIENTS_NAMES', payload: varients_names });
            console.log('varients_names:', varients_names);

            const prices = product.ProductVarients.map((item) => ({
                price: item.price,
                product_varients_id: item.product_varients_id
            }));
            dispatch({ type: 'SET_PRICES', payload: prices });
            console.log('prices:', prices);

            const stocks = product.ProductVarients.map((item) => ({
                stock: item.stock,
                product_varients_id: item.product_varients_id
            }));
            dispatch({ type: 'SET_STOCKS', payload: stocks });
            console.log('stocks:', stocks);

            const sale_percents = product.ProductVarients.map((item) => ({
                sale_percents: item.sale_percents,
                product_varients_id: item.product_varients_id
            }));
            dispatch({ type: 'SET_SALE_PERCENTS', payload: sale_percents });
            console.log('sale_percents:', sale_percents);


        }

        if (product && product?.ProductVarients[0]?.ProductClassify && product.ProductVarients[0]?.ProductSize) {
            console.log('level 3:', product.ProductVarients);
            dispatch({ type: 'SET_PRODUCT_LEVEL', payload: 3 })
            const varients_names = product.ProductVarients.map((item) => item.ProductClassify.product_classify_name + ' - ' + item.ProductSize.product_size_name);
            console.log('varients_names:', varients_names);
            dispatch({ type: 'SET_VARIENTS_NAMES', payload: varients_names });

            const prices = product.ProductVarients.map((item) => ({
                price: item.price,
                product_varients_id: item.product_varients_id
            }));
            dispatch({ type: 'SET_PRICES', payload: prices });
            console.log('prices:', prices);


            const stocks = product.ProductVarients.map((item) => ({
                stock: item.stock,
                product_varients_id: item.product_varients_id
            }));
            dispatch({ type: 'SET_STOCKS', payload: stocks });
            console.log('stocks:', stocks);

            const sale_percents = product.ProductVarients.map((item) => ({
                sale_percents: item.sale_percents,
                product_varients_id: item.product_varients_id
            }));
            dispatch({ type: 'SET_SALE_PERCENTS', payload: sale_percents });
            console.log('sale_percents:', sale_percents);

        }
    }, [product])
    return (
        <div>
            <Modal
                open={visible}
                title="Cập nhật thông tin bán hàng"
                onCancel={onCancel}
                centered={true}
                footer={[
                    <Button
                        key="cancel"
                        onClick={onCancel}
                        loading={state.submit_loading}
                    >
                        Hủy
                    </Button>,
                    <Popconfirm
                        description="Xác nhận"
                        onConfirm={handleSubmit}
                    >
                        <Button
                            disabled={!state.enable_submit}
                            loading={state.submit_loading}
                            type="primary">
                            Lưu thay đổi
                        </Button>
                    </Popconfirm>
                ]}
                className='w-1/2'
            >
                <div className='mb-10'>
                    {state.product_level === 1 && (
                        <div className='mt-5'>
                            <label className='font-semibold'>{state.varients_names}</label>
                            <Row gutter={10} className='mt-5'>
                                <Col span={8}>
                                    <label>Giá bán</label>
                                    <Input
                                        value={state?.prices[0].price}
                                        className='mt-2'
                                        addonAfter='đ'
                                        onBeforeInput={handleBeforeInput}
                                        onChange={handleInputPrices(0)}
                                    />
                                    {state.errors_prices[0] && (<p className='text-red-500'>{state.errors_prices[0]}</p>)}
                                </Col>
                                <Col span={8}>
                                    <label>Số lượng</label>
                                    <Input
                                        value={state?.stocks[0].stock}
                                        className='mt-2'
                                        addonAfter='sp'
                                        onBeforeInput={handleBeforeInput}
                                        onChange={handleInputStocks(0)}
                                    />
                                    {state.errors_stocks[0] && (<p className='text-red-500'>{state.errors_stocks[0]}</p>)}
                                </Col>
                                <Col span={8}>
                                    <label>Giảm giá</label>
                                    <Input
                                        value={state?.sale_percents[0].sale_percents}
                                        className='mt-2'
                                        addonAfter='%'
                                        onBeforeInput={handleBeforeInput}
                                        onChange={handleInputSalePercents(0)}
                                    />
                                    {state.errors_sale_percents[0] && (<p className='text-red-500'>{state.errors_sale_percents[0]}</p>)}
                                </Col>
                            </Row>
                        </div>
                    )}

                    {state.product_level !== 1 && (
                        <div className='mt-5'>
                            <label className='font-semibold text-lg'>{product?.product_name}</label>
                            <div className='font-semibold mt-5 mb-2'>Chỉnh sửa hàng loạt</div>
                            <Row gutter={12}>
                                <Col span={6}>
                                    <FormItem
                                        name='apply-all-price'
                                        rules={[
                                            { required: true, message: 'Hãy Nhập giá' }
                                        ]}
                                    >
                                        <Input
                                            placeholder='đ'
                                            value={state.apply_all_price}
                                            onBlur={(e) => handleChangeApplyAll(e, 'apply-all-price')}
                                            addonAfter='Giá'
                                        />
                                    </FormItem>

                                </Col>
                                <Col span={6}>
                                    <FormItem
                                        name='apply-all-stock'
                                        rules={[
                                            { required: true, message: 'Nhập số lượng hàng' }
                                        ]}
                                    >
                                        <Input
                                            placeholder='sp'
                                            value={state.apply_all_stock}
                                            onBlur={(e) => handleChangeApplyAll(e, 'apply-all-stock')}
                                            addonAfter='Số lượng'
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
                                            placeholder='%'
                                            value={state.apply_all_sale_percent}
                                            onBlur={(e) => handleChangeApplyAll(e, 'apply-all-sale-percent')}
                                            addonAfter='Giảm giá'
                                        />
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <Button
                                        onClick={handleApplyAllSubmit}
                                        disabled={!state.enable_apply_all}
                                        className='w-full'
                                    >
                                        Áp dụng hàng loạt
                                    </Button>
                                </Col>

                            </Row>
                            <Row gutter={10}>
                                <Col span={4}>
                                    <label>Phân loại hàng</label>
                                </Col>
                                <Col span={7}>
                                    <label>Giá bán</label>
                                </Col>
                                <Col span={7}>
                                    <label>Số lượng</label>
                                </Col>
                                <Col span={6}>
                                    <label>Giảm giá</label>
                                </Col>
                            </Row>
                            {state.varients_names.map((item, index) => (
                                <div key={index}>
                                    <Row gutter={10} className='mt-5 flex items-center'>
                                        <Col span={4}>
                                            <span
                                                className='mt-2 ml-2'
                                            >{item}</span>
                                        </Col>
                                        <Col span={7}>
                                            <Input
                                                value={state?.prices[index].price}
                                                className='mt-2'
                                                addonAfter='đ'
                                                onBeforeInput={handleBeforeInput}
                                                onChange={handleInputPrices(index)}
                                            />
                                            {state.errors_prices[index] && (<p className='text-red-500'>{state.errors_prices[index]}</p>)}
                                        </Col>
                                        <Col span={7}>
                                            <Input
                                                value={state?.stocks[index].stock}
                                                className='mt-2'
                                                addonAfter='sp'
                                                onBeforeInput={handleBeforeInput}
                                                onChange={handleInputStocks(index)}
                                            />
                                            {state.errors_stocks[index] && (<p className='text-red-500'>{state.errors_stocks[index]}</p>)}
                                        </Col>
                                        <Col span={6}>
                                            <Input
                                                value={state?.sale_percents[index].sale_percents}
                                                className='mt-2'
                                                addonAfter='%'
                                                onBeforeInput={handleBeforeInput}
                                                onChange={handleInputSalePercents(index)}
                                            />
                                            {state.errors_sale_percents[index] && (<p className='text-red-500'>{state.errors_sale_percents[index]}</p>)}
                                        </Col>
                                    </Row>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    )
});


export default EditSaleInfoModal