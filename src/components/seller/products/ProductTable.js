import { Image, Table } from 'antd'
import React, { useEffect, useReducer } from 'react'
import { useSelector } from 'react-redux'
import { getShopProducts, searchShopProducts } from '../../../services/productService'
import { MdOutlineSell } from "react-icons/md";
// reducer
const initialState = {
    selectedRowKeys: [],
    productsFetch: [],
    products_name: [],
    products_thumbnail: [],
    classifications_name: [],
    varients_name: [],
    prices: [],
    stocks: [],
    sold: [],
    products_status: [],
    rating: [],
    dataSource: [],
    current_page: 1,
    page_size: 5,
    totalItems: 0,
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SELECT_ROW':
            return { ...state, selectedRowKeys: action.payload };
        case 'SET_PRODUCTS_FETCH':
            return { ...state, productsFetch: action.payload };
        case 'SET_PRODUCTS_NAME':
            return { ...state, products_name: action.payload };
        case 'SET_PRODUCTS_THUMBNAIL':
            return { ...state, products_thumbnail: action.payload };
        case 'SET_CLASSIFICATIONS_NAME':
            return { ...state, classifications_name: action.payload };
        case 'SET_VARIENTS_NAME':
            return { ...state, varients_name: action.payload };
        case 'SET_PRICES':
            return { ...state, prices: action.payload };
        case 'SET_STOCKS':
            return { ...state, stocks: action.payload };
        case 'SET_SOLD':
            return { ...state, sold: action.payload };
        case 'SET_RATING':
            return { ...state, rating: action.payload };
        case 'SET_PRODUCTS_STATUS':
            return { ...state, products_status: action.payload };
        case 'SET_DATA_SOURCE':
            return { ...state, dataSource: action.payload };
        case 'SET_CURRENT_PAGE':
            return { ...state, current_page: action.payload };
        case 'SET_PAGE_SIZE':
            return { ...state, page_size: action.payload };
        case 'SET_TOTAL_ITEMS':
            return { ...state, totalItems: action.payload };
        default:
            return state;
    }
}

const ProductTable = ({ product_status, search_product_name, search_sub_category }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const shop = useSelector(state => state.shop);
    // select row
    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        dispatch({ type: 'SELECT_ROW', payload: newSelectedRowKeys })
    };
    const rowSelection = {
        selectedRowKeys: state.selectedRowKeys,
        onChange: onSelectChange,
    };
    // select row

    // table
    const columns = [
        {
            title:
                <p className='text-center'>
                    Tên sản phẩm
                </p>,
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div className='flex items-center mx-auto max-w-52 h-36 gap-3'>
                    <Image
                        src={record.thumbnail}
                        alt={text}
                        width={50}
                        className='cursor-pointer'
                        preview={{
                            mask: record.product_status === 0 ? (
                                <span className='text-red-500 text-center'>Đã tạm dừng</span>
                            ) : null
                        }}
                    />
                    <div className='flex flex-col items-start'>
                        <span className='font-semibold'>{text}</span>
                        <div className='flex w-full h-full items-center gap-2'>
                            <div>
                                <MdOutlineSell className='text-slate-500' />
                            </div>
                            <div className='mt-[10px] text-slate-500'>
                                {record.sold}
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: <p className='text-center'>Phân loại hàng</p>,
            dataIndex: 'classification',
            key: 'classification',
        },
        {
            title: <p className='text-center'>Giá</p>,
            dataIndex: 'prices',
            key: 'prices',
        },
        {
            title: <p className='text-center'>Kho hàng</p>,
            dataIndex: 'stocks',
            key: 'stocks',
        },
        {
            title: <p className='text-center'>Đã bán</p>,
            dataIndex: 'sold',
            key: 'sold',
        },
        {
            title: <p className='text-center'>Thao tác</p>,
            dataIndex: 'action',
            key: 'action',
        }
    ]

    const createDataSource = () => {
        const dataSource = state.products_name.map((product_name, index) => {
            return {
                key: index,
                name: product_name,
                thumbnail: state.products_thumbnail[index],
                product_status: state.products_status[index],
                classification:
                    <div className='flex flex-col'>
                        {
                            state?.varients_name[index].map((varient, pos) => (
                                <div className='text-center'>
                                    {
                                        (state.classifications_name[index][pos] ?? '-') + (varient ? ',' + varient : '')
                                    }
                                </div>
                            ))
                        }
                    </div >,
                prices:
                    state.prices[index].map((price, index) => (
                        <div key={index} className='text-center'>{price}</div>
                    )),
                stocks:
                    state.stocks[index].map((stock, index) => (
                        <div key={index} className='text-center'>{stock}</div>
                    )),
                sold:
                    <p className='text-center'>{state.sold[index]}</p>,
                action:
                    <div className='flex flex-col mx-auto'>
                        <button className='btn btn-primary text-primary'>Sửa</button>
                        <button className='btn btn-danger text-primary'>Xóa</button>
                    </div>
            }
        });
        return dataSource;
    }
    // table

    const handleSetFetchProducts = (products) => {
        const totalItems = products.totalItems || products.data.length;
        dispatch({ type: 'SET_TOTAL_ITEMS', payload: totalItems });
        dispatch({ type: 'SET_PRODUCTS_FETCH', payload: products.data });
        // get name of products
        const products_name = products.data.map(product => product.product_name);
        dispatch({ type: 'SET_PRODUCTS_NAME', payload: products_name });
        // get thumbnail of products
        const products_thumbnail = products.data.map(product => product.thumbnail);
        dispatch({ type: 'SET_PRODUCTS_THUMBNAIL', payload: products_thumbnail });
        // get rating of products
        const rating = products.data.map(product => product.avgRating);
        dispatch({ type: 'SET_RATING', payload: rating });
        // get name of classifications and varients
        const classifications_name = products.data.map(product => product.ProductVarients.map(varient => varient?.ProductClassify?.product_classify_name));
        dispatch({ type: 'SET_CLASSIFICATIONS_NAME', payload: classifications_name });
        // get vareints name
        const varients_name = products.data.map(product => product.ProductVarients.map(varient => varient?.ProductSize?.product_size_name));
        dispatch({ type: 'SET_VARIENTS_NAME', payload: varients_name });
        // get prices
        const prices = products.data.map(product => product.ProductVarients.map(varient => varient.price));
        dispatch({ type: 'SET_PRICES', payload: prices });
        // get stocks
        const stocks = products.data.map(product => product.ProductVarients.map(varient => varient.stock));
        dispatch({ type: 'SET_STOCKS', payload: stocks });
        // get sold
        const sold = products.data.map(product => product.sold);
        dispatch({ type: 'SET_SOLD', payload: sold });
        // get status
        const products_status = products.data.map(product => product.product_status);
        dispatch({ type: 'SET_PRODUCTS_STATUS', payload: products_status });
    }
    // call api
    // fetch products
    useEffect(() => {
        let products;

        const fetchProducts = async () => {
            const shop_id = shop.shop_id;
            try {
                products = await getShopProducts(shop_id, product_status, state.current_page, state.page_size);
                console.log("Fetched products:", products);
                dispatch({ type: 'SET_PRODUCTS_FETCH', payload: products.data });
                handleSetFetchProducts(products);
            } catch (error) {
                console.error("Error fetching shop products:", error);
                dispatch({ type: 'SET_DATA_SOURCE', payload: [] });
            }
        };
        if (shop.shop_id != '') {
            if (search_product_name != null || search_sub_category != null) {
                handleSearchProducts(shop.shop_id, product_status, search_product_name, search_sub_category, state.current_page, state.page_size);
            }
            else {
                fetchProducts();
            }
        }

    }, [
        shop.shop_id,
        product_status,
        state.current_page,
        state.page_size
    ]);


    // set data source
    useEffect(() => {
        if (state?.productsFetch?.length > 0) {
            const dataSource = createDataSource();
            console.log("Data source:", dataSource);
            dispatch({ type: 'SET_DATA_SOURCE', payload: dataSource });
        } else {
            dispatch({ type: 'SET_DATA_SOURCE', payload: [] });
        }
    }, [state.productsFetch]);

    // pagination change
    const onChangePage = (page, pageSize) => {
        dispatch({ type: 'SET_CURRENT_PAGE', payload: page });
        dispatch({ type: 'SET_PAGE_SIZE', payload: pageSize });
    };

    const handleSearchProducts = async (shop_id, product_status, product_name, sub_category_id, page, limit) => {
        try {
            const products = await searchShopProducts(shop_id, product_status, product_name, sub_category_id, page, limit);
            console.log("Search products:", products);
            dispatch({ type: 'SET_PRODUCTS_FETCH', payload: products.data });
            handleSetFetchProducts(products);
        }
        catch (error) {
            console.error("Error searching products:", error);
        }
    }

    useEffect(() => {
        console.log('Search Sub Category:', search_sub_category);
        handleSearchProducts(shop.shop_id, product_status, search_product_name, search_sub_category);
    }, [search_product_name, search_sub_category])

    return (
        <div className='mt-10'>
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={state.dataSource}
                pagination={{
                    total: state.totalItems,
                    current: state.current_page,
                    pageSize: state.page_size,
                    onChange: onChangePage,
                }}
            />
        </div>
    )
}

export default ProductTable