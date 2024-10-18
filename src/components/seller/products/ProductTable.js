import { Table } from 'antd'
import React, { useEffect, useReducer } from 'react'
import { useSelector } from 'react-redux'
import { getShopProducts } from '../../../services/productService'

// reducer
const initialState = {
    selectedRowKeys: [],
    products_name: [],
    product_thumbnail: [],
    classifications_name: [],
    varients_name: [],
    prices: [],
    stocks: [],
    sold: [],
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
        case 'SET_PRODUCTS_NAME':
            return { ...state, products_name: action.payload };
        case 'SET_PRODUCT_THUMBNAIL':
            return { ...state, product_thumbnail: action.payload };
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

const ProductTable = ({ product_status }) => {
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
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div>
                    <img src={record.thumbnail} alt={text} style={{ width: 50, marginRight: 10 }} />
                    {text}
                </div>
            )
        },
        {
            title: 'Phân loại hàng',
            dataIndex: 'classification',
            key: 'classification',
        },
        {
            title: 'Giá',
            dataIndex: 'prices',
            key: 'prices',
        },
        {
            title: 'Kho hàng',
            dataIndex: 'stocks',
            key: 'stocks',
        },
        {
            title: 'Đã bán',
            dataIndex: 'sold',
            key: 'sold',
        },
        {
            title: 'Thao tác',
            dataIndex: 'action',
            key: 'action',
        }
    ]

    const createDataSource = (products) => {
        return products.map((product, index) => ({
            key: index,
            name: product.product_name,
            thumbnail: product.thumbnail,
            classification: product.ProductVarients.map(varient => varient?.ProductClassify?.product_classify_name).join(', '),
            prices: product.ProductVarients.map(varient => varient.price).join(', '),
            stocks: product.ProductVarients.map(varient => varient.stock).join(', '),
            sold: product.sold,
            rating: product.avgRating,
            action: '...' // Define actions as needed
        }));
    }
    // table

    // call api
    // fetch products
    useEffect(() => {
        let products;
        const fetchProducts = async () => {
            const shop_id = shop.shop_id;
            try {
                products = await getShopProducts(shop_id, product_status, state.current_page, state.page_size);
                console.log("Fetched products:", products);
                const totalItems = products.totalItems || products.data.length;
                dispatch({ type: 'SET_TOTAL_ITEMS', payload: totalItems }); 
                // get name of products
                const products_name = products.data.map(product => product.product_name);
                dispatch({ type: 'SET_PRODUCTS_NAME', payload: products_name });
                // get thumbnail of products
                const product_thumbnail = products.data.map(product => product.thumbnail);
                dispatch({ type: 'SET_PRODUCT_THUMBNAIL', payload: product_thumbnail });
                // get rating of products
                const rating = products.data.map(product => product.avgRating);
                dispatch({ type: 'SET_RATING', payload: rating });
                // get name of classifications and varients
                const classifications_name = products.data.map(product => product.ProductVarients.map(varient => varient?.ProductClassify?.product_classify_name));
                dispatch({ type: 'SET_CLASSIFICATIONS_NAME', payload: classifications_name });
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

                // set data source
                if (products?.data) {
                    const dataSource = createDataSource(products.data);
                    console.log("Data source:", dataSource);
                    dispatch({ type: 'SET_DATA_SOURCE', payload: dataSource });
                } else {
                    dispatch({ type: 'SET_DATA_SOURCE', payload: [] });
                }

            } catch (error) {
                console.error("Error fetching shop products:", error);
                dispatch({ type: 'SET_DATA_SOURCE', payload: [] });
            }
        };
        if (shop.shop_id != '') {
            fetchProducts();
        }
    }, [shop.shop_id, product_status, state.current_page, state.page_size]);
    
    // pagination change
    const onChangePage = (page, pageSize) => {
        dispatch({ type: 'SET_CURRENT_PAGE', payload: page });
        dispatch({ type: 'SET_PAGE_SIZE', payload: pageSize });
    };

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