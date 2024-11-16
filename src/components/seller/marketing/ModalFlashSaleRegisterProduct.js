import { Button, Dropdown, Image, Input, message, Modal, Popconfirm, Table } from 'antd'
import React, { useEffect, useReducer } from 'react'
import { useSelector } from 'react-redux'
import { getShopProducts } from '../../../services/productService'
import { MdOutlineSell } from 'react-icons/md'
import { TiArrowBack } from "react-icons/ti";
import { getProductShopRegisterFlashSales, registerProductToFlashSale } from '../../../services/shopRegisterFlashSaleService'
import { set } from 'lodash'
import { MdOutlineUnsubscribe } from "react-icons/md";
const ModalFlashSaleRegisterProduct = (props) => {

    const shop = useSelector(state => state.shop);
    const initialState = {
        registed_products: [],
        productsFetch: [],
        dataSource: [],
        current_page: 1,
        page_size: 3,
        totalItems: 0,
        mode: "list",
        selectedProduct: null,
        flash_sales_price: 0,
        quantity: 0,
        registed_products: [],
        registed_products_frame_time: [],
        error: { flash_sales_price: "", quantity: "" },
        touched: { flash_sales_price: false, quantity: false },
        enable_submit: false,
        loading: false,
        success: false,
    };
    const [localState, setLocalState] = useReducer(
        (state, action) => {
            switch (action.type) {
                case "SET_VISIBLE_MODAL_REGISTER":
                    return { ...state, visible_modal_regiter: action.payload };
                case 'SET_PRODUCTS_FETCH':
                    return { ...state, productsFetch: action.payload };
                case 'SET_DATA_SOURCE':
                    return { ...state, dataSource: action.payload };
                case 'SET_TOTAL_ITEMS':
                    return { ...state, totalItems: action.payload };
                case 'SET_CURRENT_PAGE':
                    return { ...state, current_page: action.payload };
                case 'SET_PAGE_SIZE':
                    return { ...state, page_size: action.payload };
                case "SET_MODE":
                    return { ...state, mode: action.payload };
                case 'SET_SELECTED_PRODUCT':
                    return { ...state, selectedProduct: action.payload };
                case 'SET_FLASH_SALES_PRICE':
                    return { ...state, flash_sales_price: action.payload };
                case 'SET_QUANTITY':
                    return { ...state, quantity: action.payload };
                case 'SET_REGISTED_PRODUCTS':
                    return { ...state, registed_products: action.payload };
                case 'SET_ERROR':
                    return { ...state, error: { ...state.error, ...action.payload } };
                case 'SET_TOUCHED':
                    return { ...state, touched: { ...state.touched, ...action.payload } };
                case 'SET_ENABLE_SUBMIT':
                    return { ...state, enable_submit: action.payload };
                case 'SET_LOADING':
                    return { ...state, loading: action.payload };
                case 'SET_SUCCESS':
                    return { ...state, success: action.payload };
                case 'RESET_STATE':
                    return initialState;
                default:
                    return state;
            }
        },
        initialState
    )

    const onCancel = () => {
        props.setLocalState({ type: "SET_VISIBLE_MODAL_REGISTER", payload: false });
        setLocalState({ type: "RESET_STATE" });
    }

    const handleFlashSalePriceChange = (e) => {
        // validate price input
        setLocalState({ type: "SET_TOUCHED", payload: { flash_sales_price: true } });
        const price = parseFloat(e.target.value);
        if (isNaN(price) || price < 0) {
            setLocalState({ type: "SET_ERROR", payload: { flash_sales_price: "Giá không hợp lệ" } });
            setLocalState({ type: "SET_FLASH_SALES_PRICE", payload: price });
            return;
        }
        setLocalState({ type: "SET_ERROR", payload: { flash_sales_price: "" } });
        setLocalState({ type: "SET_FLASH_SALES_PRICE", payload: price });
    }

    const handleQuantityChange = (e) => {
        // validate quantity input
        setLocalState({ type: "SET_TOUCHED", payload: { quantity: true } });
        const quantity = parseInt(e.target.value, 10);
        if (isNaN(quantity) || quantity < 0) {
            setLocalState({ type: "SET_ERROR", payload: { quantity: "Số lượng không hợp lệ" } });
            setLocalState({ type: "SET_QUANTITY", payload: quantity });
            return;
        }
        setLocalState({ type: "SET_ERROR", payload: { quantity: "" } });
        setLocalState({ type: "SET_QUANTITY", payload: quantity });
    }

    useEffect(() => {
        if (localState.error.flash_sales_price === "" && localState.error.quantity === "") {
            setLocalState({ type: "SET_ENABLE_SUBMIT", payload: true });
        } else {
            setLocalState({ type: "SET_ENABLE_SUBMIT", payload: false });
        }
    }, [
        localState.error,
    ])


    const columns = [
        {
            title:
                <p className='text-center'>
                    Tên sản phẩm
                </p>,
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div className='flex flex-col items-center mx-auto max-w-52 gap-3 mb-3'>
                    <Image
                        src={record.thumbnail}
                        alt={text}
                        className='cursor-pointer min-w-20 max-w-20'
                    />
                    <div className='flex flex-col items-start'>
                        <span className='font-semibold max-w-36 line-clamp-2 break-words'>{text}</span>
                    </div>
                    {
                        // check if product is already registed to flash sale , if true then show tag
                        localState.registed_products.find((item) => item.product_id === record.product_id) ? (
                            <span className='text-xs text-white bg-green-500 px-2 py-1 rounded-full'>Đã đăng ký</span>
                        ) : null
                    }
                </div>
            )
        },
        {
            title: <p className='text-center'>Giá</p>,
            dataIndex: 'price',
            key: 'price',
            render: (text) => (
                <p className='text-center'>{text}</p>
            )
        },
        {
            title: <p className='text-center'>Kho hàng</p>,
            dataIndex: 'stocks',
            key: 'stocks',
            render: (text) => (
                <p className='text-center'>{text}</p>
            )
        },
        {
            title: <p className='text-center'>Thao tác</p>,
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <p className='text-center flex flex-col gap-2'>
                    {text}
                    {
                        localState.registed_products.find((item) => item.product_id === record.product_id) ? (
                            <Popconfirm
                                title="Bạn có chắc chắn muốn hủy đăng kí sản phẩm này?"

                            >
                                <Button
                                    className='hover:bg-orange-500'
                                    icon={<MdOutlineUnsubscribe />}
                                >
                                    Hủy đăng kí
                                </Button>
                            </Popconfirm>

                        ) : null
                    }
                </p>
            )
        }
    ]

    const createDataSource = () => {
        const dataSource = localState.productsFetch.map((product, index) => {
            return {
                key: index,
                product_id: product.product_id,
                name: product.product_name,
                thumbnail: product.thumbnail,
                price: product.base_price,
                stocks: product.stock,
                action: (
                    <Button
                        icon={<MdOutlineSell />}
                        onClick={() => handleRegister(product)}
                        className='bg-primary text-white hover:bg-white hover:text-primary'
                    >
                        Đăng ký
                    </Button>
                )
            }
        })
        return dataSource;
    }

    const onChangePage = (page, pageSize) => {
        setLocalState({ type: 'SET_CURRENT_PAGE', payload: page });
        setLocalState({ type: 'SET_PAGE_SIZE', payload: pageSize });
    };

    const handleRegister = (product) => {
        setLocalState({ type: "SET_SELECTED_PRODUCT", payload: product });
        setLocalState({ type: "SET_MODE", payload: "register" });
        const checkExist = localState.registed_products.find((item) => item.product_id === product.product_id);
        if (checkExist) {
            setLocalState({ type: "SET_FLASH_SALES_PRICE", payload: checkExist.flash_sale_price });
            setLocalState({ type: "SET_QUANTITY", payload: checkExist.quantity });
        }
    };

    const handleBack = () => {
        setLocalState({ type: "SET_MODE", payload: "list" });
        setLocalState({ type: "SET_FLASH_SALES_PRICE", payload: 0 });
        setLocalState({ type: "SET_QUANTITY", payload: 0 });
    }

    const handleSubmit = async () => {
        setLocalState({ type: "SET_LOADING", payload: true });
        const payload = {
            shop_id: shop.shop_id,
            product_id: localState.selectedProduct.product_id,
            flash_sale_time_frame_id: props.flash_sale_time_frame_id,
            original_price: localState.selectedProduct.base_price,
            flash_sale_price: localState.flash_sales_price,
            quantity: localState.quantity
        };
        try {
            const res = await registerProductToFlashSale(payload);
            if (res.success) {
                message.success("Đăng ký sản phẩm thành công");
                setLocalState({ type: "SET_MODE", payload: "list" });
                setLocalState({ type: "SET_FLASH_SALES_PRICE", payload: 0 });
                setLocalState({ type: "SET_QUANTITY", payload: 0 });
                setLocalState({ type: "SET_REGISTED_PRODUCTS", payload: [...localState.registed_products, payload] });
                setLocalState({ type: "SET_SUCCESS", payload: true });
            } else {
                console.error("Error registering product to flash sale:", res.message);
                message.error(res.message);
            }
        } catch (error) {
            console.error("Error registering product to flash sale:", error);
            message.error("Đăng ký sản phẩm thất bại");
        }
        setLocalState({ type: "SET_LOADING", payload: false });
    }

    useEffect(() => {
        if (localState?.productsFetch?.length > 0) {
            const dataSource = createDataSource();
            setLocalState({ type: 'SET_DATA_SOURCE', payload: dataSource });
            console.log("Data source:", dataSource);
        } else {
            setLocalState({ type: 'SET_DATA_SOURCE', payload: [] });
        }
    }, [
        localState.productsFetch
    ]);

    useEffect(() => {
        const fetchProducts = async () => {
            const shop_id = shop.shop_id;
            try {
                const products = await getShopProducts(shop_id, 1, localState.current_page, localState.page_size);
                console.log("Fetched products:", products);
                setLocalState({ type: 'SET_TOTAL_ITEMS', payload: products.totalItems });
                setLocalState({ type: 'SET_DATA_SOURCE', payload: products.data });
                setLocalState({ type: 'SET_PRODUCTS_FETCH', payload: products.data });
            } catch (error) {
                console.error("Error fetching shop products:", error);
                setLocalState({ type: 'SET_DATA_SOURCE', payload: [] });
            }
        };

        const fetchRegistedProducts = async () => {
            try {
                const res = await getProductShopRegisterFlashSales({ shop_id: shop.shop_id, flash_sale_time_frame_id: props.flash_sale_time_frame_id });
                if (res.success) {
                    setLocalState({ type: 'SET_REGISTED_PRODUCTS', payload: res.data });
                    console.log("Registed products:", res.data);
                } else {
                    console.error("Error fetching registed products:", res.message);
                }
            } catch (error) {
                console.error("Error fetching registed products:", error);
            }
        }
        if (shop.shop_id != '' || localState.success) {
            fetchProducts();
            fetchRegistedProducts();
            setLocalState({ type: 'SET_SUCCESS', payload: false });
        }
    }, [
        shop.shop_id,
        localState.current_page,
        localState.page_size,
        props.localState.visible_modal_regiter,
        localState.success
    ])

    return (
        <Modal
            title="Đăng ký sản phẩm"
            open={props.localState.visible_modal_regiter}
            onCancel={onCancel}
            className='min-w-[700px]'
            centered={true}
            footer={null}
        >
            {
                localState.registed_products.length > 0 ? (
                    <div>
                        {(() => {
                            const uniqueProducts = localState.registed_products.filter((product, index, self) =>
                                index === self.findIndex((p) => p.product_id === product.product_id)
                            );
                            return <p className='text-lg'>Đã đăng kí {uniqueProducts.length} sản phẩm</p>;
                        })()}
                    </div>
                ) : (
                    <div>Chưa có sản phẩm nào được đăng ký</div>
                )
            }

            {
                localState.mode === "list" ? (
                    <Table
                        columns={columns}
                        dataSource={localState.dataSource}
                        pagination={{
                            total: localState.totalItems,
                            current: localState.current_page,
                            pageSize: localState.page_size,
                            onChange: onChangePage,
                        }}
                        className='my-10 shadow-lg'
                    />
                ) : (
                    <div className="flex flex-col gap-2 bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
                        <div className="flex items-center gap-3">
                            <TiArrowBack
                                size={24}
                                className="cursor-pointer text-primary hover:text-primary-dark transition-colors"
                                onClick={() => handleBack()}
                            />
                            <h2 className="text-xl font-semibold text-gray-800">Thông tin đăng kí</h2>
                        </div>
                        <div className="text-lg items-center">
                            <p className="text-gray-900 break-words line-clamp-2">{localState.selectedProduct?.product_name || "Chưa chọn sản phẩm"}</p>
                        </div>
                        <div className="text-lg flex items-center">
                            <p className="font-medium text-gray-700">Giá gốc:</p>
                            <p className="ml-3 text-gray-900">{localState.selectedProduct?.base_price?.toLocaleString("vi-VN") || "0"} đ</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-gray-700">Giá flash sale</label>
                            <Input
                                type="number"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-primary-light"
                                placeholder="Nhập giá flash sale"
                                value={localState.flash_sales_price}
                                onChange={(e) => handleFlashSalePriceChange(e)}
                            />
                            {localState.touched.flash_sales_price && localState.error.flash_sales_price && <p className="text-red-500">{localState.error.flash_sales_price}</p>}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-gray-700">Số lượng</label>
                            <Input
                                type="number"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-primary-light"
                                placeholder="Nhập số lượng"
                                value={localState.quantity}
                                onChange={(e) => handleQuantityChange(e)}
                            />
                            {localState.touched.quantity && localState.error.quantity && <p className="text-red-500">{localState.error.quantity}</p>}
                        </div>
                        <Button
                            className={`w-full font-semibold ${localState.enable_submit ? 'bg-primary text-white' : 'bg-gray-400 text-gray-700'}`}
                            disabled={!localState.enable_submit}
                            onClick={handleSubmit}
                            loading={localState.loading}
                        >
                            Xác nhận
                        </Button>


                    </div>
                )
            }

        </Modal>
    )
}

export default ModalFlashSaleRegisterProduct