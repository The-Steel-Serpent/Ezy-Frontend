import { Button, Dropdown, Image, Modal, Table } from 'antd'
import React, { useEffect, useReducer } from 'react'
import { useSelector } from 'react-redux'
import { getShopProducts } from '../../../services/productService'
import { MdOutlineSell } from 'react-icons/md'

const ModalFlashSaleRegisterProduct = (props) => {

    const shop = useSelector(state => state.shop);
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
                default:
                    return state;
            }
        },
        {
            registed_products: [],
            productsFetch: [],
            dataSource: [],
            current_page: 1,
            page_size: 3,
            totalItems: 0
        }
    )

    const onCancel = () => {
        props.setLocalState({ type: "SET_VISIBLE_MODAL_REGISTER", payload: false });
    }

    const columns = [
        {
            title:
                <p className='text-center'>
                    Tên sản phẩm
                </p>,
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div className='flex flex-col items-center mx-auto max-w-52 h-36 gap-3 mb-3'>
                    <Image
                        src={record.thumbnail}
                        alt={text}
                        className='cursor-pointer min-w-20 max-w-20'
                    />
                    <div className='flex flex-col items-start'>
                        <span className='font-semibold max-w-36 line-clamp-2 break-words'>{text}</span>
                    </div>
                </div>
            )
        },
        {
            title: <p className='text-center'>Giá</p>,
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: <p className='text-center'>Kho hàng</p>,
            dataIndex: 'stocks',
            key: 'stocks',
        },
        {
            title: <p className='text-center'>Thao tác</p>,
            dataIndex: 'action',
            key: 'action',
        }
    ]

    const createDataSource = () => {
        const dataSource = localState.productsFetch.map((product, index) => {
            return {
                key: index,
                name: product.product_name,
                thumbnail: product.thumbnail,
                price: product.base_price,
                stocks: product.stock,
                action: (
                    <Button
                        icon={<MdOutlineSell />}
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
        if (shop.shop_id != '') {
            fetchProducts();
        }
    }, [
        shop.shop_id,
        localState.current_page,
        localState.page_size

    ])

    return (
        <Modal
            title="Đăng ký sản phẩm"
            open={props.localState.visible_modal_regiter}
            onCancel={onCancel}
            className='min-w-[700px]'
        >
            {
                localState.registed_products.length > 0 ? (
                    <div>
                        <div className="flex justify-between items-center">
                            <div className="font-semibold">Danh sách sản phẩm đã đăng ký</div>
                            <div className="font-semibold">Thời gian</div>
                        </div>
                        <div>
                            {
                                localState.registed_products.map((product, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <div>{product.name}</div>
                                        <div>{product.time}</div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                ) : (
                    <div>Chưa có sản phẩm nào được đăng ký</div>
                )
            }

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
        </Modal>
    )
}

export default ModalFlashSaleRegisterProduct