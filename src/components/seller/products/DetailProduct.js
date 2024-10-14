import React, { useEffect, useReducer, useRef, useState } from 'react';
import { Button, Menu, message } from 'antd';
import { BasicInformation } from './BasicInformation';
import SaleInformation from './SaleInformation';
import ShippingProductInformation from './ShippingProductInformation';
import uploadFile from '../../../helpers/uploadFile';
import { useSelector } from 'react-redux';
import { addProduct, addProductClassify, addProductVarient, findClassifiesID, saveProductImages } from '../../../services/productService';
import LoadingModal from '../../loading/LoadingModal';
import { useNavigate } from 'react-router-dom';

const items = [
    {
        key: '1',
        label: 'Thông tin cơ bản'
    },
    {
        key: '2',
        label: 'Thông tin bán hàng'
    },
    {
        key: '3',
        label: 'Vận chuyển'
    }
];

const initialState = {
    basicInfo: null,
    saleInfo: null,
    shippingInfo: null,
    basicinfo_enable_submit: false,
    saleinfo_enable_submit: false,
    shippinginfo_enable_submit: false,
    list_product_images: [],
    thumbail_upload: null,
    classify_thumnail: [],
    upload_classify_thumbnails_complete: false,
    uploadComplete: false,
    uploadThumbnailComplete: false,
    enable_submit: false,
    loading: false
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_BASIC_INFO':
            return { ...state, basicInfo: action.payload };
        case 'SET_SALE_INFO':
            return { ...state, saleInfo: action.payload };
        case 'SET_SHIPPING_INFO':
            return { ...state, shippingInfo: action.payload };
        case 'SET_BASIC_INFO_ENABLE_SUBMIT':
            return { ...state, basicinfo_enable_submit: action.payload };
        case 'SET_SALE_INFO_ENABLE_SUBMIT':
            return { ...state, saleinfo_enable_submit: action.payload };
        case 'SET_SHIPPING_INFO_ENABLE_SUBMIT':
            return { ...state, shippinginfo_enable_submit: action.payload };
        case 'SET_ENABLE_SUBMIT':
            return { ...state, enable_submit: action.payload };
        case 'SET_LIST_PRODUCT_IMAGES':
            return { ...state, list_product_images: action.payload };
        case 'SET_UPLOAD_COMPLETE':
            return { ...state, uploadComplete: action.payload };
        case 'SET_UPLOAD_THUMBNAIL_COMPLETE':
            return { ...state, uploadThumbnailComplete: action.payload };
        case 'SET_UPLOAD_CLASSIFY_THUMBNAIL_COMPLETE':
            return { ...state, upload_classify_thumbnails_complete: action.payload };
        case 'SET_THUMBNAIL_UPLOAD':
            return { ...state, thumbail_upload: action.payload };
        case 'SET_CLASSIFY_THUMBNAIL':
            return { ...state, classify_thumnail: action.payload };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        default:
            return state;
    }
};

const DetailProduct = () => {
    const basicInfoRef = useRef(null);
    const salesInfoRef = useRef(null);
    const shippingInfoRef = useRef(null);
    const navigate = useNavigate();

    const [state, dispatch] = useReducer(reducer, initialState);
    const shop = useSelector(state => state.shop);
    const handleBasicInfo = (data) => {
        dispatch({ type: 'SET_BASIC_INFO', payload: data });
    }

    const handleSaleInfo = (data) => {
        dispatch({ type: 'SET_SALE_INFO', payload: data });
    }

    const handleShippingInfo = (data) => {
        dispatch({ type: 'SET_SHIPPING_INFO', payload: data });
    }

    const handleFocusMenu = (e) => {
        const offset = 100;
        const scrollWithOffset = (element) => {
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - offset;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        };
        switch (e.key) {
            case '1':
                scrollWithOffset(basicInfoRef.current);
                break;
            case '2':
                scrollWithOffset(salesInfoRef.current);
                break;
            case '3':
                scrollWithOffset(shippingInfoRef.current);
                break;
            default:
                break;
        }
    };


    const handleUploadProductImages = async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        console.log("List Image:", state.basicInfo.fileListProduct);
        const uploadPromises = state.basicInfo.fileListProduct.map(file => uploadFile(file.originFileObj, 'seller-img'));
        try {
            const uploadResults = await Promise.all(uploadPromises);
            console.log("Upload: ", uploadResults);
            const uploadUrls = uploadResults.map(file => file.url);
            dispatch({ type: 'SET_LIST_PRODUCT_IMAGES', payload: uploadUrls });
            dispatch({ type: 'SET_UPLOAD_COMPLETE', payload: true });

        } catch (error) {
            console.error("Error uploading images:", error);
        }
    }

    const handleUploadClassifyThumnail = async (thumnails) => {
        console.log("Classify Thumnail: ", thumnails);
        const uploadPromises = thumnails.map(file => uploadFile(file.file.originFileObj, 'seller-img'));
        try {
            const uploadResults = await Promise.all(uploadPromises);
            console.log("Upload Classify Thumnail: ", uploadResults);
            const uploadUrls = uploadResults.map(file => file.url);
            dispatch({ type: 'SET_CLASSIFY_THUMBNAIL', payload: uploadUrls });
            dispatch({ type: 'SET_UPLOAD_CLASSIFY_THUMBNAIL_COMPLETE', payload: true });
        } catch (error) {
            console.log("Error uploading classify thumnail:", error);
        }
    }

    const handleUploadThumnail = async () => {
        const thumbnail = state.basicInfo.thumbnail[0].originFileObj;
        try {
            const uploadResult = await uploadFile(thumbnail, 'seller-img');
            console.log("Upload Thumnail: ", uploadResult);
            dispatch({ type: 'SET_THUMBNAIL_UPLOAD', payload: uploadResult.url });
            dispatch({ type: 'SET_UPLOAD_THUMBNAIL_COMPLETE', payload: true });
        } catch (error) {
            console.log("Error uploading thumnail:", error);
        }
    }

    const handleSaveProductImages = async (product_id) => {
        const savePromiseProductImages = state.list_product_images.map(url => {
            const payload = { product_id, url };
            return saveProductImages(payload);
        });
        try {
            const saveResults = await Promise.all(savePromiseProductImages);
            console.log("Save Product Images: ", saveResults);
        } catch (error) {
            console.log("Error Save Product Images: ", error);
        }
    };
    const handleSubmit = async () => {
        await handleUploadProductImages();
        await handleUploadThumnail();
        if (state.saleInfo.add_product_level === 2) {
            await handleUploadClassifyThumnail(state.saleInfo.classifyImage);
        }
    }

    const addProductAndSaveImages = async (payload) => {
        try {
            const res = await addProduct(payload);
            console.log("Add Product: ", res);
            if (res.success) {
                const product_id = res.data.product_id;
                // save product images
                await handleSaveProductImages(product_id);
                // save product varient
                const payload = {
                    product_id: product_id,
                    price: res.data.base_price,
                    stock: res.data.stock,
                    sale_percents: res.data.sale_percents,
                    height: state.shippingInfo.height,
                    lenght: state.shippingInfo.length,
                    width: state.shippingInfo.width,
                    weight: state.shippingInfo.weight,
                }
                addProductVarient(payload).then(res => {
                    console.log("Add Product Varient: ", res);
                });
                dispatch({ type: 'SET_LOADING', payload: false });
                message.success("Thêm sản phẩm thành công");
                navigate('/seller/product-management/all');
            }

        } catch (err) {
            console.log("Error Add Product: ", err);
            message.error("Thêm sản phẩm thất bại");
            dispatch({ type: 'SET_LOADING', payload: false });
            navigate('/seller/product-management/all');
        }
    };

    // const addProductLevel2 = async (payload) => {
    //     try {
    //         const res = await addProduct(payload);
    //         console.log("Add Product: ", res);
    //         if (res.success) {
    //             const product_id = res.data.product_id;
    //             await handleSaveProductImages(product_id);
    //             const promises = [];
    //             // add classify
    //             for (let i = 0; i < state.saleInfo.allClassifyName.length; i++) {
    //                 const payload = {
    //                     product_id: product_id,
    //                     product_classify_name: state.saleInfo.allClassifyName[i],
    //                     type_name: state.saleInfo.classifyTypeName,
    //                     thumbnail: state.classify_thumnail[i],
    //                 };
    //                 promises.push(addProductClassify(payload));
    //             }
    //             Promise.all(promises)
    //                 .then(results => {
    //                     results.forEach(res => {
    //                         console.log("Add Product Classify: ", res);
    //                     });
    //                     // find classify id and add product varient for each classify
    //                     findClassifiesID({ product_id: product_id }).then(res => {
    //                         console.log("Find Classify ID: ", res);
    //                         if (res.success) {
    //                             const classify_ids = res.data;
    //                             for (let i = 0; i < classify_ids.length; i++) {
    //                                 const payload = {
    //                                     product_id: product_id,
    //                                     product_classify_id: classify_ids[i].product_classify_id,
    //                                     price: state.saleInfo.prices[i],
    //                                     stock: state.saleInfo.stocks[i],
    //                                     sale_percents: state.saleInfo.sale_percent[i],
    //                                     height: state.shippingInfo.height,
    //                                     lenght: state.shippingInfo.length,
    //                                     width: state.shippingInfo.width,
    //                                     weight: state.shippingInfo.weight,
    //                                 }
    //                                 promises.push(addProductVarient(payload));
    //                             }
    //                             console.log("Checkkk promises varients: ", promises);
    //                             Promise.all(promises)
    //                                 .then(results => {
    //                                     results.forEach(res => {
    //                                         console.log("Add Product Varient: ", res);
    //                                     });
    //                                     dispatch({ type: 'SET_LOADING', payload: false });
    //                                     message.success("Thêm sản phẩm thành công");
    //                                     navigate('/seller/product-management/all');
    //                                 })
    //                                 .catch(error => {
    //                                     console.error("Error adding product varient: ", error);
    //                                     dispatch({ type: 'SET_LOADING', payload: false });
    //                                     message.error("Thêm sản phẩm thất bại");
    //                                     navigate('/seller/product-management/all');
    //                                 });
    //                         }
    //                     })
    //                         .catch(error => {
    //                             console.error("Error adding product classify: ", error);
    //                             dispatch({ type: 'SET_LOADING', payload: false });
    //                             message.error("Thêm sản phẩm thất bại");
    //                             navigate('/seller/product-management/all');
    //                         });
    //                 })

    //         }
    //     } catch (error) {
    //         console.error("Error adding product: ", error);
    //         dispatch({ type: 'SET_LOADING', payload: false });
    //         message.error("Thêm sản phẩm thất bại");
    //         navigate('/seller/product-management/all');
    //     }
    // }
    const addProductLevel2 = async (payload) => {
        try {
            const res = await addProduct(payload);
            console.log("Add Product: ", res);

            if (res.success) {
                const product_id = res.data.product_id;

                // Save product images
                await handleSaveProductImages(product_id);

                // Prepare to add classifications
                const classifyPromises = state.saleInfo.allClassifyName.map((classifyName, i) => {
                    const classifyPayload = {
                        product_id: product_id,
                        product_classify_name: classifyName,
                        type_name: state.saleInfo.classifyTypeName,
                        thumbnail: state.classify_thumnail[i],
                    };
                    return addProductClassify(classifyPayload);
                });

                // Add classifications
                const classifyResults = await Promise.all(classifyPromises);
                classifyResults.forEach(res => console.log("Add Product Classify: ", res));

                // Find classify IDs and add variants
                const classifyRes = await findClassifiesID({ product_id: product_id });
                console.log("Find Classify ID: ", classifyRes);

                if (classifyRes.success) {
                    const classify_ids = classifyRes.data;

                    // Prepare to add product variants
                    const variantPromises = classify_ids.map((classify, i) => {
                        const variantPayload = {
                            product_id: product_id,
                            product_classify_id: classify.product_classify_id,
                            price: state.saleInfo.prices[i],
                            stock: state.saleInfo.stocks[i],
                            sale_percents: state.saleInfo.sale_percent[i],
                            height: state.shippingInfo.height,
                            length: state.shippingInfo.length,
                            width: state.shippingInfo.width,
                            weight: state.shippingInfo.weight,
                        };
                        return addProductVarient(variantPayload);
                    });

                    // Add variants
                    const variantResults = await Promise.all(variantPromises);
                    variantResults.forEach(res => console.log("Add Product Variant: ", res));

                    dispatch({ type: 'SET_LOADING', payload: false });
                    message.success("Thêm sản phẩm thành công");
                    navigate('/seller/product-management/all');
                }
            }
        } catch (error) {
            console.error("Error adding product: ", error);
            dispatch({ type: 'SET_LOADING', payload: false });
            message.error("Thêm sản phẩm thất bại");
            navigate('/seller/product-management/all');
        }
    };


    useEffect(() => {
        let payload = {}
        if (state.saleInfo != null && state.saleInfo.add_product_level === 1) {
            payload = {
                shop_id: shop.shop_id,
                sub_category_id: state.basicInfo.sub_category_id,
                product_name: state.basicInfo.product_name,
                brand: state.basicInfo.brand,
                description: state.basicInfo.description,
                gender_object: state.basicInfo.gender,
                origin: state.basicInfo.origin,
                thumbnail: state.thumbail_upload,
                base_price: state.saleInfo.price,
                sale_percents: state.saleInfo.sale_percent,
                stock: state.saleInfo.stock,
            }
            if (state.uploadComplete && state.uploadThumbnailComplete) {
                console.log("Checkkk image product uploaded:", state.list_product_images);
                console.log("Checkkk thumbnail uploaded", state.thumbail_upload);
                (async () => {
                    await addProductAndSaveImages(payload);
                })();
            }
        } else if (state.saleInfo != null && state.saleInfo.add_product_level === 2) {
            payload = {
                shop_id: shop.shop_id,
                sub_category_id: state.basicInfo.sub_category_id,
                product_name: state.basicInfo.product_name,
                brand: state.basicInfo.brand,
                description: state.basicInfo.description,
                gender_object: state.basicInfo.gender,
                origin: state.basicInfo.origin,
                thumbnail: state.thumbail_upload,
                base_price: Array.isArray(state.saleInfo.prices) ? Math.min(...state.saleInfo.prices) : 0,
                // trigger update stock
                stock: 0,
                sale_percents: 0,
            }
            console.log("Check payload level 2: ", payload);
            if (state.uploadComplete && state.uploadThumbnailComplete && state.upload_classify_thumbnails_complete) {
                (async () => {
                    await addProductLevel2(payload);
                })();
            }
        }

    }, [
        state.list_product_images,
        state.uploadComplete,
        state.thumbail_upload,
        state.saleInfo,
        state.uploadThumbnailComplete,
        state.upload_classify_thumbnails_complete
    ]);




    useEffect(() => {
        dispatch({ type: 'SET_BASIC_INFO_ENABLE_SUBMIT', payload: false });
        dispatch({ type: 'SET_SALE_INFO_ENABLE_SUBMIT', payload: false });
        dispatch({ type: 'SET_SHIPPING_INFO_ENABLE_SUBMIT', payload: false });
        const noErrorBasicInfo = state.basicInfo ? state.basicInfo.noErrorBasicInfo : false;
        const noErrorSaleInfo = state.saleInfo ? state.saleInfo.noErrorSaleInfo : false;
        const noErrorShippingInfo = state.shippingInfo ? state.shippingInfo.noErrorShippingInfo : false;
        // Basic Info
        if (noErrorBasicInfo) {
            dispatch({ type: 'SET_BASIC_INFO_ENABLE_SUBMIT', payload: true });
            // console.log("Basic Info: ", state.basicInfo);
        }
        else {
            // console.log("Basic Info: ", state.basicInfo);
        }
        // Sale Info
        if (noErrorSaleInfo) {
            dispatch({ type: 'SET_SALE_INFO_ENABLE_SUBMIT', payload: true });
            console.log("Sale Info: ", state.saleInfo);
        }
        else {
            console.log("Sale Info: ", state.saleInfo);
        }
        // Shipping Info
        if (noErrorShippingInfo) {
            dispatch({ type: 'SET_SHIPPING_INFO_ENABLE_SUBMIT', payload: true });
            // console.log("Shipping Info: ", state.shippingInfo);
        }
        else {
            // console.log("Shipping Info: ", state.shippingInfo);
        }

        if (noErrorBasicInfo && noErrorSaleInfo && noErrorShippingInfo) {
            console.log("Enable Submit", noErrorBasicInfo && noErrorSaleInfo && noErrorShippingInfo);
            dispatch({ type: 'SET_ENABLE_SUBMIT', payload: true });
        }
        else {
            dispatch({ type: 'SET_ENABLE_SUBMIT', payload: false });
        }

    }, [state.basicInfo, state.saleInfo, state.shippingInfo]);



    return (
        <div className='mb-32'>
            <Menu
                mode="horizontal"
                theme="light"
                items={items}
                className="custom-menu-seller-product bg-white sticky-menu"
                defaultSelectedKeys={['1']}
                onClick={handleFocusMenu}
            />
            <div ref={basicInfoRef} className="section bg-white mt-3 border rounded p-5">
                <BasicInformation onData={handleBasicInfo} />
            </div>
            <div ref={salesInfoRef} className="section bg-white mt-3 border rounded p-5">
                <SaleInformation onData={handleSaleInfo} />
            </div>
            <div ref={shippingInfoRef} className="section bg-white mt-3 border rounded p-5">
                <ShippingProductInformation onData={handleShippingInfo} />
            </div>
            <div className='flex gap-3 mt-5 justify-end'>
                <Button
                    type="primary"
                    onClick={() => navigate('/seller/product-management/all')}
                >Hủy</Button>
                <Button
                    onClick={handleSubmit}
                    type="primary"
                    disabled={!state.enable_submit}
                >Lưu</Button>
            </div>
            <LoadingModal visible={state.loading} />
        </div>
    );
};

export default DetailProduct;