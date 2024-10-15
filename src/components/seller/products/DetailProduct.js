import React, { useEffect, useReducer, useRef, useState } from 'react';
import { Button, Menu, message } from 'antd';
import { BasicInformation } from './BasicInformation';
import SaleInformation from './SaleInformation';
import ShippingProductInformation from './ShippingProductInformation';
import uploadFile from '../../../helpers/uploadFile';
import { useSelector } from 'react-redux';
import { addProduct, addProductClassify, addProductSize, addProductVarient, findClassifiesID, getProductSize, saveProductImages } from '../../../services/productService';
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
    ready_add_product_level2: [],
    ready_add_product_level3: [],
    product_id: null,
    id_classifyLevel3: [],
    id_productSize: [],
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
        case 'SET_READY_ADD_PRODUCT_LEVEL2':
            return { ...state, ready_add_product_level2: action.payload };
        case 'SET_READY_ADD_PRODUCT_LEVEL3':
            return { ...state, ready_add_product_level3: action.payload };
        case 'SET_PRODUCT_ID':
            return { ...state, product_id: action.payload };
        case 'SET_ID_CLASSIFY_LEVEL3':
            return { ...state, id_classifyLevel3: action.payload };
        case 'SET_ID_PRODUCT_SIZE':
            return { ...state, id_productSize: action.payload };
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
        console.log("Classify Thumn: ", thumnails);
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
        if (state.saleInfo.add_product_level === 2 || state.saleInfo.add_product_level === 3) {
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

    // add product level 2
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
                    dispatch({ type: 'SET_READY_ADD_PRODUCT_LEVEL2', payload: classify_ids });
                    dispatch({ type: 'SET_PRODUCT_ID', payload: product_id });
                    // countinue to add product variants with useEffect
                }
            }
        } catch (error) {
            console.error("Error adding product: ", error);
            dispatch({ type: 'SET_LOADING', payload: false });
            message.error("Thêm sản phẩm thất bại");
            navigate('/seller/product-management/all');
        }
    };

    const retryAddProductVariant = async (variantPayload, retries = 3) => {
        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                return await addProductVarient(variantPayload);
            } catch (error) {
                if (error.message.includes("Deadlock found")) {
                    console.warn("Deadlock occurred, retrying... attempt: ", attempt + 1);
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                } else {
                    throw error;
                }
            }
        }
        throw new Error("Failed after multiple retries due to deadlock");
    };

    useEffect(() => {
        const addProductVariants = async () => {
            for (let i = 0; i < state.ready_add_product_level2.length; i++) {
                const classify = state.ready_add_product_level2[i];
                const variantPayload = {
                    product_id: state.product_id,
                    product_classify_id: classify.product_classify_id,
                    price: state.saleInfo.prices[i],
                    stock: state.saleInfo.stocks[i],
                    sale_percents: state.saleInfo.sale_percent[i],
                    height: state.shippingInfo.height,
                    length: state.shippingInfo.length,
                    width: state.shippingInfo.width,
                    weight: state.shippingInfo.weight,
                };
                try {
                    const result = await retryAddProductVariant(variantPayload);
                    console.log("Success for Payload: ", variantPayload);
                } catch (error) {
                    console.error("Failed Payload: ", variantPayload, error);
                    message.error("Thêm sản phẩm thất bại");
                    break;
                }
            }
            dispatch({ type: 'SET_LOADING', payload: false });
            message.success("Thêm sản phẩm thành công");
            navigate('/seller/product-management/all');
        }

        if (state.ready_add_product_level2.length > 0 && state.product_id != null) {
            addProductVariants();
        }
    }, [state.ready_add_product_level2]);

    // add product level 2

    // add product level 3
    const addProductLevel3 = async (payload) => {
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
                // add product size
                const sizePromises = state.saleInfo.allVarientName.map(size => {
                    const sizePayload = {
                        product_id: product_id,
                        product_size_name: size,
                        type_of_size: state.saleInfo.variantName,
                    };
                    return addProductSize(sizePayload);
                });

                const sizeResults = await Promise.all(sizePromises);
                sizeResults.forEach(res => console.log("Add Product Size: ", res));

                const classifyRes = await findClassifiesID({ product_id: product_id });
                const sizeRes = await getProductSize({ product_id: product_id });
                if (classifyRes.success && sizeRes.success) {
                    dispatch({ type: 'SET_ID_CLASSIFY_LEVEL3', payload: classifyRes.data });
                    dispatch({ type: 'SET_ID_PRODUCT_SIZE', payload: sizeRes.data });
                    dispatch({ type: 'SET_PRODUCT_ID', payload: product_id });
                    dispatch({ type: 'SET_READY_ADD_PRODUCT_LEVEL3', payload: classifyRes.data });
                    console.log("Check ID Classify Level 3: ", classifyRes.data);
                    console.log("Check ID Product Size: ", sizeRes.data);
                    console.log("Check Product ID: ", product_id);
                }

            }
        } catch (error) {
            console.error("Error adding product: ", error);
            dispatch({ type: 'SET_LOADING', payload: false });
            message.error("Thêm sản phẩm thất bại");
            navigate('/seller/product-management/all');
        }
    }

    useEffect(() => {
        let count = 0;
        const maxRetries = 3; // Set how many times to retry

        // Retry wrapper function
        const retryAddProductVariant = async (payload, retriesLeft) => {
            try {
                const response = await addProductVarient(payload);
                console.log("Add Product Variant: ", response);
                return response; // Return response if successful
            } catch (error) {
                if (retriesLeft > 0) {
                    console.warn(`Retrying... attempts left: ${retriesLeft}`);
                    return retryAddProductVariant(payload, retriesLeft - 1); // Retry
                } else {
                    console.error("Failed after retries: ", error);
                    throw error; // If out of retries, throw error
                }
            }
        };

        if (state.id_classifyLevel3.length > 0 && state.id_productSize.length > 0) {
            const promises = [];
            for (let i = 0; i < state.id_classifyLevel3.length; i++) {
                for (let j = 0; j < state.id_productSize.length; j++) {
                    const payload = {
                        product_id: state.product_id,
                        product_classify_id: state.id_classifyLevel3[i].product_classify_id,
                        product_size_id: state.id_productSize[j].product_size_id,
                        price: state.saleInfo.price[count],
                        stock: state.saleInfo.stock[count],
                        sale_percents: state.saleInfo.sale_percent[count],
                        height: state.shippingInfo.height,
                        length: state.shippingInfo.length,
                        width: state.shippingInfo.width,
                        weight: state.shippingInfo.weight,
                    };
                    count++;
                    promises.push(retryAddProductVariant(payload, maxRetries));
                }
            }

            Promise.all(promises)
                .then(responses => {
                    console.log("All product variants added successfully:", responses);
                    dispatch({ type: 'SET_LOADING', payload: false });
                    message.success("Thêm sản phẩm thành công");
                    navigate('/seller/product-management/all');

                })
                .catch(error => {
                    console.error("Error adding product variants after retries:", error);
                    dispatch({ type: 'SET_LOADING', payload: false });
                    message.error("Thêm sản phẩm thất bại");
                    navigate('/seller/product-management/all');
                });
        }
    }, [state.ready_add_product_level3]);
    // add product level 3

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
            const prices = state.saleInfo.prices;
            if (Array.isArray(prices) && prices.length > 0) {
                const minPriceIndex = prices.reduce((minIndex, currentPrice, currentIndex, arr) =>
                    currentPrice < arr[minIndex] ? currentIndex : minIndex, 0);
                payload = {
                    shop_id: shop.shop_id,
                    sub_category_id: state.basicInfo.sub_category_id,
                    product_name: state.basicInfo.product_name,
                    brand: state.basicInfo.brand,
                    description: state.basicInfo.description,
                    gender_object: state.basicInfo.gender,
                    origin: state.basicInfo.origin,
                    thumbnail: state.thumbail_upload,
                    base_price: state.saleInfo.prices[minPriceIndex],
                    // trigger update stock
                    stock: 0,
                    sale_percents: state.saleInfo.sale_percent[minPriceIndex],
                }
                console.log("Check payload level 2: ", payload);
                if (state.uploadComplete && state.uploadThumbnailComplete && state.upload_classify_thumbnails_complete) {
                    (async () => {
                        await addProductLevel2(payload);
                    })();
                }
            } else {
                console.error("Prices is either not an array or is empty.");
            }
        }
        else if (state.saleInfo != null && state.saleInfo.add_product_level === 3) {
            const prices = state.saleInfo.price;
            if (Array.isArray(prices) && prices.length > 0) {
                const minPriceIndex = prices.reduce((minIndex, currentPrice, currentIndex, arr) =>
                    currentPrice < arr[minIndex] ? currentIndex : minIndex, 0);
                payload = {
                    shop_id: shop.shop_id,
                    sub_category_id: state.basicInfo.sub_category_id,
                    product_name: state.basicInfo.product_name,
                    brand: state.basicInfo.brand,
                    description: state.basicInfo.description,
                    gender_object: state.basicInfo.gender,
                    origin: state.basicInfo.origin,
                    thumbnail: state.thumbail_upload,
                    base_price: state.saleInfo.price[minPriceIndex],
                    stock: 0,
                    sale_percents: state.saleInfo.sale_percent[minPriceIndex],
                }
                console.log("Check payload level 3: ", payload);
                console.log("Check uploadComplete: ", state.uploadComplete);
                console.log("Check uploadThumbnailComplete: ", state.uploadThumbnailComplete);
                console.log("Check upload_classify_thumbnails_complete: ", state.upload_classify_thumbnails_complete);
                if (state.uploadComplete && state.uploadThumbnailComplete && state.upload_classify_thumbnails_complete) {
                    (
                        async () => {
                            await addProductLevel3(payload);
                        }
                    )();
                }
            } else {
                console.error("Prices is either not an array or is empty.");
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