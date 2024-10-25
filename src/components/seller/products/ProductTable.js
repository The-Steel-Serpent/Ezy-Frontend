import { Button, Checkbox, Image, message, Modal, Table } from 'antd'
import React, { useEffect, useReducer } from 'react'
import { useSelector } from 'react-redux'
import { getShopProducts, searchShopProducts, updateProductStatus } from '../../../services/productService'
import { MdOutlineSell } from "react-icons/md";
// reducer
const initialState = {
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
    is_checked_all: false,
    open_bottom: false,
    seletedRows: [],
    selectedRowKeys: [],
    selected_products_id: [],
    count_hide_products: 0,
    count_active_products: 0,
    title_modal: '',
    content_modal: '',
    visible_modal: false,
    status_modal: null,
    loading_update_product_status: false,
}

const reducer = (state, action) => {
    switch (action.type) {
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
        case 'SET_SELECTED_ROWS':
            return { ...state, selectedRows: action.payload };
        case 'SET_SELECTED_ROW_KEYS':
            return { ...state, selectedRowKeys: action.payload };
        case 'SET_IS_CHECKED_ALL':
            return { ...state, is_checked_all: action.payload };
        case 'SET_SELECTED_PRODUCTS_ID':
            return { ...state, selected_products_id: action.payload };
        case 'OPEN_BOTTOM':
            return { ...state, open_bottom: action.payload };
        case 'SET_COUNT_HIDE_PRODUCTS':
            return { ...state, count_hide_products: action.payload };
        case 'SET_COUNT_ACTIVE_PRODUCTS':
            return { ...state, count_active_products: action.payload };
        case 'SET_TITLE_MODAL':
            return { ...state, title_modal: action.payload };
        case 'SET_CONTENT_MODAL':
            return { ...state, content_modal: action.payload };
        case 'SET_VISIBLE_MODAL':
            return { ...state, visible_modal: action.payload }
        case 'SET_STATUS_MODAL':
            return { ...state, status_modal: action.payload }
        case 'SET_LOADING_UPDATE_PRODUCT_STATUS':
            return { ...state, loading_update_product_status: action.payload }
        default:
            return state;
    }
}

const ProductTable =
    ({
        product_status,
        search_product_name,
        search_sub_category,
    }) => {
        const [state, dispatch] = useReducer(reducer, initialState)
        const shop = useSelector(state => state.shop);

        const rowSelection = {
            selectedRowKeys: state.selectedRowKeys,
            onChange: (selectedRowKeys) => {
                dispatch({ type: 'SET_SELECTED_ROW_KEYS', payload: selectedRowKeys });
                onSelectChange(selectedRowKeys, state.dataSource.filter((item) => selectedRowKeys.includes(item.key)));
                const is_checked_all = selectedRowKeys.length === state.dataSource.length;
                dispatch({ type: 'SET_IS_CHECKED_ALL', payload: is_checked_all });
            },
            getCheckboxProps: (record) => ({
                product_id: record.product_id,
            }),

        };

        const setCountStatucProducts = (selected_products) => {
            const count_hide_products = selected_products.filter(product => product.product_status === 0).length;
            const count_active_products = selected_products.filter(product => product.product_status === 1).length;
            dispatch({ type: 'SET_COUNT_HIDE_PRODUCTS', payload: count_hide_products });
            dispatch({ type: 'SET_COUNT_ACTIVE_PRODUCTS', payload: count_active_products });
        }

        const onSelectChange = (newSelectedRowKeys, selectedRows) => {
            if (newSelectedRowKeys.length > 0) {
                // open bottom
                dispatch({ type: 'OPEN_BOTTOM', payload: true });
            }
            else {
                // close bottom
                dispatch({ type: 'OPEN_BOTTOM', payload: false });
            }
            const selectedProductIds = selectedRows ? selectedRows.map(row => row.product_id) : [];
            dispatch({ type: 'SET_SELECTED_ROW_KEYS', payload: newSelectedRowKeys });
            dispatch({ type: 'SET_SELECTED_PRODUCTS_ID', payload: selectedProductIds });
            dispatch({ type: 'SET_SELECTED_ROWS', payload: selectedRows });
            setCountStatucProducts(selectedRows);
            console.log('selectedRowKeys changed: ', newSelectedRowKeys);
            console.log('selectedRows changed: ', selectedRows);
            console.log('Selected product_ids: ', selectedProductIds);
        };

        const handleSelectAllChange = (e) => {
            const checked = e.target.checked;
            const selectedRowKeys = checked ? state.dataSource.map(item => item.key) : [];
            dispatch({ type: 'SET_SELECTED_ROW_KEYS', payload: selectedRowKeys });
            onSelectChange(selectedRowKeys, state.dataSource.filter((item) => selectedRowKeys.includes(item.key)));
            const is_checked_all = selectedRowKeys.length === state.dataSource.length;
            dispatch({ type: 'SET_IS_CHECKED_ALL', payload: is_checked_all });
        };

        useEffect(() => {
            console.log('Count hide products:', state.count_hide_products);
            console.log('Count active products:', state.count_active_products);
        }, [state.count_active_products, state.count_hide_products])



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
                    product_id: state.productsFetch[index].product_id,
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
                            {/* <button className='btn btn-danger text-primary'>Xóa</button> */}
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
                dispatch({ type: 'SET_COUNT_HIDE_PRODUCTS', payload: 0 });
                dispatch({ type: 'SET_COUNT_ACTIVE_PRODUCTS', payload: 0 });
            }
        }, [state.productsFetch]);

        // pagination change
        const onChangePage = (page, pageSize) => {
            dispatch({ type: 'SET_CURRENT_PAGE', payload: page });
            dispatch({ type: 'SET_PAGE_SIZE', payload: pageSize });
            // clear selected row
            dispatch({ type: 'SET_SELECTED_ROW_KEYS', payload: [] });
            onSelectChange([], []);

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

        const hideProductModalMessage = () => {
            const messages = {
                title: '',
                content: '',
            }
            if (state.count_active_products > 0 && state.count_hide_products > 0) {
                messages.title = 'Không thể ẩn sản phẩm'
                messages.content = 'Bạn đã chọn ' +
                    state.count_active_products +
                    ' sản phẩm đang hoạt động và ' +
                    state.count_hide_products +
                    ' sản phẩm đã tạm dừng. Vui lòng xác nhận để ẩn '
                    + state.count_active_products
                    + ' sản phẩm đang hoạt động ';
            }
            else {
                messages.title = 'Bạn có chắc chắn muốn ẩn ' + state.count_active_products + ' sản phẩm đã chọn'
                messages.content = 'Người mua sẽ không thể xem hoặc mua sản phẩm đã ẩn';
            }
            return messages;
        }


        const activeProductModalMessage = () => {
            const messages = {
                title: '',
                content: '',
            }
            if (state.count_active_products > 0 && state.count_hide_products > 0) {
                messages.title = 'Không thể hiển thị sản phẩm'
                messages.content = 'Bạn đã chọn ' +
                    state.count_active_products +
                    ' sản phẩm đang hoạt động và ' +
                    state.count_hide_products +
                    ' sản phẩm đã tạm dừng. Vui lòng xác nhận để hiển thị '
                    + state.count_hide_products
                    + ' sản phẩm đã tạm dừng ';
            }
            else {
                messages.title = 'Bạn có chắc chắn muốn hiển thị ' + state.count_hide_products + ' sản phẩm đã chọn'
                messages.content = 'Người mua sẽ có thể xem và mua sản phẩm đã hiển thị';
            }
            return messages;
        }

        const handleModalHideProduct = () => {
            // show modal
            const { title, content } = hideProductModalMessage();
            dispatch({ type: 'SET_VISIBLE_MODAL', payload: true });
            dispatch({ type: 'SET_TITLE_MODAL', payload: title })
            dispatch({ type: 'SET_CONTENT_MODAL', payload: content })
            dispatch({ type: 'SET_STATUS_MODAL', payload: 0 });


        }


        const handleModalActiveProduct = () => {
            // show modal
            const { title, content } = activeProductModalMessage();
            dispatch({ type: 'SET_VISIBLE_MODAL', payload: true });
            dispatch({ type: 'SET_TITLE_MODAL', payload: title })
            dispatch({ type: 'SET_CONTENT_MODAL', payload: content })
            dispatch({ type: 'SET_STATUS_MODAL', payload: 1 });
        }

        const handleSubmitUpdateProductStatus = async () => {
            const update_status = state.status_modal;
            const selectedRows = state.selectedRows;

            dispatch({ type: 'SET_LOADING_UPDATE_PRODUCT_STATUS', payload: true });

            const handle_products = selectedRows
                .map(product => ({ product_id: product.product_id, product_status: product.product_status }))
                .filter(product => product.product_status != update_status);

            try {
                const updatePromises = handle_products.map(product =>
                    updateProductStatus(product.product_id, update_status)
                );
                await Promise.all(updatePromises).then(() => {
                    message.success('Cập nhật trạng thái sản phẩm thành công');
                    // reset data source
                    dispatch({ type: 'SET_DATA_SOURCE', payload: [] });
                    // fetch products
                    const shop_id = shop.shop_id;
                    getShopProducts(shop_id, product_status, state.current_page, state.page_size)
                        .then(products => {
                            console.log("Fetched products:", products);
                            dispatch({ type: 'SET_PRODUCTS_FETCH', payload: products.data });
                            handleSetFetchProducts(products);
                        });
                    // clear selected row
                    dispatch({ type: 'SET_SELECTED_ROW_KEYS', payload: [] });
                });
            } catch (error) {
                console.error('Error updating product status:', error);
                message.error('Cập nhật trạng thái sản phẩm thất bại');
            } finally {
                dispatch({ type: 'SET_LOADING_UPDATE_PRODUCT_STATUS', payload: false });
                dispatch({ type: 'SET_VISIBLE_MODAL', payload: false });
            }
        };



        useEffect(() => {
            console.log('Search Sub Category:', search_sub_category);
            handleSearchProducts(shop.shop_id, product_status, search_product_name, search_sub_category);
        }, [search_product_name, search_sub_category])

        return (
            <div>
                <div className='rounded bg-white p-5'>
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
                <div className={
                    state.open_bottom ?
                        'w-full flex justify-between rounded-sm px-5 mb-10 bottom-0 sticky bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.15)] h-14' :
                        'hidden'}>
                    <Checkbox
                        className='my-auto'
                        checked={state.is_checked_all}
                        onChange={handleSelectAllChange}>
                        Chọn Tất cả
                    </Checkbox>
                    <div className='flex gap-3 items-center'>
                        <div>{state.selected_products_id.length} sản phẩm đã được chọn</div>
                        {state.count_active_products > 0 && (
                            <Button
                                onClick={handleModalHideProduct}
                            >
                                Ẩn
                            </Button>
                        )}
                        {state.count_hide_products > 0 && (
                            <Button
                                className='bg-primary text-white'
                                onClick={handleModalActiveProduct}
                            >
                                Hiển thị
                            </Button>
                        )}
                    </div>
                </div>
                {/* Hide / Active confirm modal */}
                <Modal
                    title={state.title_modal}
                    open={state.visible_modal}
                    centered={true}
                    onCancel={() => dispatch({ type: 'SET_VISIBLE_MODAL', payload: false })}
                    footer={[
                        <Button
                            key="cancel"
                            onClick={() => dispatch({ type: 'SET_VISIBLE_MODAL', payload: false })}
                            loading={state.loading_update_product_status}
                        >
                            Cancel
                        </Button>,
                        <Button
                            key="confirm"
                            type="primary"
                            loading={state.loading_update_product_status}
                            onClick={handleSubmitUpdateProductStatus}
                        >
                            Confirm
                        </Button>
                    ]}
                >
                    <p>{state.content_modal}</p>
                </Modal>
            </div>

        )
    }

export default ProductTable