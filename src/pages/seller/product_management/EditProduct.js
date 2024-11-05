import React, { useEffect, useReducer } from 'react'
import EditBasicInformation from '../../../components/seller/products/EditBasicInformation'
import { useNavigate, useParams } from 'react-router-dom'
import { addSomeProductImages, deleteSomeProductImages, getProductByID, updateBasicInfoProduct, updateShippingInfo } from '../../../services/productService'
import { Button, Empty, message } from 'antd'
import EditShippingProductInformation from '../../../components/seller/products/EditShippingProductInformation'
import LoadingModal from '../../../components/loading/LoadingModal'
import uploadFile from '../../../helpers/uploadFile'
const initialState = {
    product_edit: null,
    basicInfo: null,
    shippingInfo: null,
    get_product_success: false,
    loading: false,
    basicinfo_enable_submit: false,
    shippinginfo_enable_submit: false,
    enable_submit: false,
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_PRODUCT_EDIT':
            return { ...state, product_edit: action.payload }
        case 'SET_EDIT_BASIC_INFO':
            return { ...state, basicInfo: action.payload }
        case 'SET_SHIPPING_INFO':
            return { ...state, shippingInfo: action.payload }
        case 'SET_GET_PRODUCT_SUCCESS':
            return { ...state, get_product_success: action.payload }
        case 'SET_LOADING':
            return { ...state, loading: action.payload }
        case 'SET_BASIC_INFO_ENABLE_SUBMIT':
            return { ...state, basicinfo_enable_submit: action.payload }
        case 'SET_SHIPPING_INFO_ENABLE_SUBMIT':
            return { ...state, shippinginfo_enable_submit: action.payload }
        case 'SET_ENABLE_SUBMIT':
            return { ...state, enable_submit: action.payload }
        default:
            return state
    }
}

const EditProduct = () => {

    const [state, dispatch] = useReducer(reducer, initialState);
    const { product_id } = useParams();
    const navigate = useNavigate();
    // handle OnData 

    const handleBasicinfo = (data) => {
        dispatch({ type: 'SET_EDIT_BASIC_INFO', payload: data })
    }

    const handleShippingInfo = (data) => {
        dispatch({ type: 'SET_SHIPPING_INFO', payload: data })
    }

    const handleProductImagesChanges = (initial_file_list_product, file_list_product_changed) => {
        // compare initial_file_list_product with file_list_product_changed
        const add_file_list_product = [];
        const delete_file_list_product = [];
        const initial_file_list_product_temp = [...initial_file_list_product];
        const file_list_product_changed_temp = [...file_list_product_changed];
        initial_file_list_product_temp.forEach((initial_file) => {
            const index = file_list_product_changed_temp.findIndex((file) => file.uid === initial_file.uid);
            if (index === -1) {
                delete_file_list_product.push(initial_file);
            }
            else {
                file_list_product_changed_temp.splice(index, 1);
            }
        });
        add_file_list_product.push(...file_list_product_changed_temp);
        return { add_file_list_product, delete_file_list_product };
    }

    const handleThumbailChanges = (initial_thumbnail, thumbnail_changed) => {
        if (initial_thumbnail[0].uid !== thumbnail_changed[0].uid) {
            return { thumbnail: thumbnail_changed };
        }
        return { thumbnail: null };
    }
    const uploadProductImages = async (product_images) => {
        const uploadPromises = product_images.map(file => uploadFile(file.originFileObj, 'seller-img'));
        try {
            const uploadResults = await Promise.all(uploadPromises);
            console.log("Upload product images: ", uploadResults);
            const uploadUrls = uploadResults.map(file => file.url);
            return uploadUrls;
        } catch (error) {
            console.log("Error uploading product images:", error);
            return [];
        }
    }

    const handleErrorCancel = () => {
        message.error('Cập nhật thất bại');
        navigate('/seller/product-management/all');
    }

    const handleSuccess = () => {
        message.success('Cập nhật thành công sản phẩm');
        navigate('/seller/product-management/all');
    }

    const handleSubmit = async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        const { add_file_list_product, delete_file_list_product } = handleProductImagesChanges(state.basicInfo?.initial_file_list_product, state.basicInfo?.fileListProduct);
        console.log("Add file list product: ", add_file_list_product);
        console.log("Delete file list product: ", delete_file_list_product);
        console.log("Initial file list product: ", state.basicInfo?.initial_file_list_product);

        // add file list product
        if (add_file_list_product.length > 0) {
            const urls = await uploadProductImages(add_file_list_product);
            console.log("Urls: ", urls);
            console.log("Product ID: ", product_id);
            if (urls.length > 0) {
                const payload = {
                    product_id,
                    urls
                }
                const add_file_list_result = await addSomeProductImages(payload);
                if (add_file_list_result.success) {
                    console.log("Add file list product successfully");
                    message.info('Thêm thành công ' + urls.length + ' ảnh sản phẩm');
                }
                else {
                    return handleErrorCancel();
                }
            }
        }

        // delete file list product
        if (delete_file_list_product.length > 0) {
            const product_imgs_ids = delete_file_list_product.map(file => file.product_imgs_id);
            const delete_file_list_result = await deleteSomeProductImages(product_imgs_ids);
            if (delete_file_list_result.success) {
                console.log("Delete file list product successfully");
                message.info('Xóa thành công ' + delete_file_list_product.length + ' ảnh sản phẩm');
            }
            else {
                console.log("Delete file list product failed");
                return handleErrorCancel();
            }
        }

        // handle thumbnail changes
        const { thumbnail } = handleThumbailChanges(state.basicInfo?.initial_thumbnail, state.basicInfo?.thumbnail);
        console.log("Thumbnail: ", thumbnail);
        let payload = {
            product_id: product_id,
            sub_category_id: state.basicInfo?.sub_category_id,
            product_name: state.basicInfo?.product_name,
            description: state.basicInfo?.description,
            origin: state.basicInfo?.origin,
            gender_object: state.basicInfo?.gender_object,
            brand: state.basicInfo?.brand,
        }
        if (thumbnail != null) {
            const url = await uploadProductImages(thumbnail);
            if (url.length > 0) {
                payload = { ...payload, thumbnail: url[0] };
            }
        }
        const resBasic = await updateBasicInfoProduct(payload);
        if (resBasic.success) {
            console.log("Update product successfully: ", resBasic);
        }
        else {
            console.log("Error updating product: ", resBasic);
            handleErrorCancel();
        }

        let shippingInfo = {
            product_id: product_id,
            weight: state.shippingInfo?.weight,
            length: state.shippingInfo?.length,
            width: state.shippingInfo?.width,
            height: state.shippingInfo?.height,
        }

        const resShipping = await updateShippingInfo(shippingInfo);
        if (resShipping.success) {
            console.log("Update shipping info successfully: ", resShipping);
        }
        else {
            console.log("Error updating shipping info: ", resShipping);
            handleErrorCancel();
        }

        handleSuccess();


        // console.log("Initial thumbnail: ", state.basicInfo?.initial_thumbnail);
        dispatch({ type: 'SET_LOADING', payload: false });

    }

    useEffect(() => {
        const noErrorBasicInfo = state.basicInfo ? state.basicInfo.noErrorBasicInfo : false;
        const noErrorShippingInfo = state.shippingInfo ? state.shippingInfo.noErrorShippingInfo : false;
        if (noErrorBasicInfo) {
            console.log("Basic Info: ", state.basicInfo);
            dispatch({ type: 'SET_BASIC_INFO_ENABLE_SUBMIT', payload: true });
        }
        else {
            // console.log("Basic Info: ", state.basicInfo);
            dispatch({ type: 'SET_BASIC_INFO_ENABLE_SUBMIT', payload: false });
        }

        if (noErrorShippingInfo) {
            console.log("Shipping Info: ", state.shippingInfo);
            dispatch({ type: 'SET_SHIPPING_INFO_ENABLE_SUBMIT', payload: true });
        }
        else {
            // console.log("Shipping Info: ", state.shippingInfo);
            dispatch({ type: 'SET_SHIPPING_INFO_ENABLE_SUBMIT', payload: false });
        }

        if (noErrorBasicInfo && noErrorShippingInfo) {
            dispatch({ type: 'SET_ENABLE_SUBMIT', payload: true });
        }
        else {
            dispatch({ type: 'SET_ENABLE_SUBMIT', payload: false });
        }


    }, [
        state.basicInfo,
        state.shippingInfo
    ]);


    useEffect(() => {
        if (product_id) {
            const fetchProduct = async () => {
                try {
                    const res = await getProductByID(product_id);
                    dispatch({ type: 'SET_PRODUCT_EDIT', payload: res.data });
                } catch (error) {
                    console.error('Error fetching product:', error);

                }
            };
            fetchProduct();
        }
    }, [product_id])

    useEffect(() => {
        if (state.product_edit) {
            dispatch({ type: 'SET_GET_PRODUCT_SUCCESS', payload: true });
        }
    }, [state.product_edit])

    return (
        <div>
            {!state.get_product_success ?
                (
                    <div className='h-full mt-36'>
                        <Empty />
                    </div>
                )
                :
                (
                    <div>
                        <div className='bg-white border rounded p-5 mt-5'>
                            <EditBasicInformation product={state.product_edit} onData={handleBasicinfo} />
                        </div>
                        <div className='bg-white border rounded p-5 mt-5'>
                            <EditShippingProductInformation product={state.product_edit} onData={handleShippingInfo} />
                        </div>
                        <div className='flex gap-3 mt-5 justify-start mb-10'>
                            <Button
                                onClick={() => navigate('/seller/product-management/all')}
                                loading={state.loading}
                            >
                                Hủy
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                type="primary"
                                disabled={!state.enable_submit}
                                loading={state.loading}
                            >
                                Lưu
                            </Button>
                        </div>
                        <LoadingModal visible={state.loading} />
                    </div>
                )}

        </div>
    )
}

export default EditProduct