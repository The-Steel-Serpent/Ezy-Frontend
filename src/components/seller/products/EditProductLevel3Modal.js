import { Button, Col, Input, message, Modal, Popconfirm, Row, Upload } from 'antd'
import React, { forwardRef, useEffect, useImperativeHandle, useReducer, useRef } from 'react'
import { GoPlus } from "react-icons/go";
import { RiImageAddFill } from 'react-icons/ri';
import { MdOutlineLeakRemove } from "react-icons/md";
import { CiSquarePlus, CiSquareRemove } from "react-icons/ci";
import uploadFile from '../../../helpers/uploadFile';
import {
    addSomeClassify,
    addSomeProductSize,
    addSomeProductVarientLevel3,
    deleteSomeProductClassify,
    deleteSomeProductSize,
    deleteSomeProductVarientsByClassify,
    deleteSomeProductVarientsBySize,
    findClassifiesID,
    getProductSize,
    updateClassifyTypeName,
    updateProductClassify
} from '../../../services/productService';
const initialState = {
    classify_type: null,
    classifies_name: [],
    classifies_image: [],
    classify_rows: [],
    visible_btn_add_varient: false,
    varient_type: null,
    varient_rows: [],
    varient_name: [],
    errors: {
        classify_type: 'Chưa nhập tên phân loại',
        varient_type: 'Chưa nhập tên phân loại'
    },
    touchs: {
        classify_type: false,
        varient_type: false
    },
    enable_submit: false,
    submit_loading: false,
    initial_data: null,
    down_to_level_1: false

}
const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_CLASSIFY_TYPE':
            return { ...state, classify_type: action.payload }
        case 'SET_CLASSIFY_NAME':
            return { ...state, classifies_name: action.payload }
        case 'SET_CLASSIFY_IMAGE':
            return { ...state, classifies_image: action.payload }
        case 'SET_CLASSIFY_ROWS':
            return { ...state, classify_rows: action.payload };
        case 'SET_VISIBLE_ADD_VARIENT':
            return { ...state, visible_btn_add_varient: action.payload }
        case 'SET_VARIENT_ROWS':
            return { ...state, varient_rows: action.payload }
        case 'SET_VARIENT_TYPE':
            return { ...state, varient_type: action.payload }
        case 'SET_VARIENTS_NAME':
            return { ...state, varient_name: action.payload }
        case 'SET_ERROR':
            return { ...state, errors: { ...state.errors, [action.payload.name]: action.payload.value } }
        case 'SET_TOUCH':
            return { ...state, touchs: { ...state.touchs, [action.payload.name]: action.payload.value } }
        case 'SET_ENABLE_SUBMIT':
            return { ...state, enable_submit: action.payload }
        case 'SET_SUBMIT_LOADING':
            return { ...state, submit_loading: action.payload }
        case 'SET_INITIAL_DATA':
            return { ...state, initial_data: action.payload }
        case 'SET_DOWN_TO_LEVEL_1':
            return { ...state, down_to_level_1: action.payload }
        case 'RESET':
            return initialState
        default:
            return state
    }
}
const EditProductLevel3Modal = forwardRef(({ visible, onCancel, product, resetDataSource }, ref) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const prevClassifyRowsRef = useRef([]);
    const prevVarientRowsRef = useRef([]);
    const resetState = () => {
        dispatch({ type: 'RESET' })
    }

    useImperativeHandle(ref, () => ({
        resetState,
    }));

    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
            className='mt-2'
        >
            {<RiImageAddFill size={30} />}
        </button>
    );

    const beforeUpload = file => {
        const isImage = file.type.startsWith('image/');
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isImage) {
            message.error('Bạn chỉ có thể tải lên tệp hình ảnh!');
            return Upload.LIST_IGNORE;
        }
        if (!isLt2M) {
            message.error('Kích thước tập tin vượt quá 2.0 MB');
            return Upload.LIST_IGNORE;
        }
        return true;
    };

    const handleClassifyTypeChange = (value) => {
        dispatch({ type: 'SET_TOUCH', payload: { name: 'classify_type', value: true } })
        dispatch({ type: 'SET_CLASSIFY_TYPE', payload: value })
        if (value === '') {
            dispatch({ type: 'SET_ERROR', payload: { name: 'classify_type', value: 'Hãy nhập tên phân loại' } })
        }
        else {
            dispatch({ type: 'SET_ERROR', payload: { name: 'classify_type', value: '' } })
        }
        validateSubmit();
    }
    // classify
    const handleAddClassifyRow = () => {
        const newClassifyRow = {
            key: state.classify_rows.length + 1,
            classify_image: [],
            classify_name: '',
            error_classify_name: '',
            error_classify_image: 'Hãy chọn ảnh của phân loại',
            touch: false
        };
        dispatch({ type: 'SET_CLASSIFY_ROWS', payload: [...state.classify_rows, newClassifyRow] });
    };

    const handleRemoveClassifyRow = (key) => {
        const newClassifyRows = state.classify_rows.filter(row => row.key !== key)
        dispatch({ type: 'SET_CLASSIFY_ROWS', payload: newClassifyRows })
    }

    const handleInputClassifyNameChange = (key, value) => {
        const isDuplicate = value !== '' && state.classify_rows.some(row => row.classify_name === value && row.key !== key);
        const updatedRows = state.classify_rows.map(row =>
            row.key === key
                ? {
                    ...row,
                    classify_name: value,
                    error_classify_name: value === '' ? 'Hãy nhập phân loại' : isDuplicate ? 'Phân loại không được trùng' : '',
                    touch: true,
                }
                : row
        );
        dispatch({ type: 'SET_CLASSIFY_ROWS', payload: updatedRows });
    };
    const handleUploadClassifyImageChange = (key, { fileList }) => {
        const updatedRows = state.classify_rows.map(row =>
            row.key === key ? {
                ...row,
                classify_image: fileList,
                error_classify_image: fileList.length === 0 ? 'Hãy chọn ảnh của phân loại' : '',
                touch: true,
            } : row
        );
        dispatch({ type: 'SET_CLASSIFY_ROWS', payload: updatedRows });
    };

    const handleRemoveClassifyImage = (key) => {
        const newClassifyImage = state.classifies_image.filter((image, index) => index !== key)
        dispatch({ type: 'SET_CLASSIFIES_IMAGE', payload: newClassifyImage })
    }

    // varient

    const handleAddVarient = () => {
        dispatch({ type: 'SET_VISIBLE_ADD_VARIENT', payload: !state.visible_btn_add_varient })
        if (!state.visible_btn_add_varient) {
            // reset state
            dispatch({ type: 'SET_VARIENT_TYPE', payload: null })
            dispatch({ type: 'SET_TOUCH', payload: { name: 'varient_type', value: false } })
            dispatch({ type: 'SET_ERROR', payload: { name: 'varient_type', value: 'Hãy nhập tên phân loại' } })
            dispatch({ type: 'SET_VARIENT_ROWS', payload: [] });
        }
    }

    const handleVarientTypeChange = (value) => {
        dispatch({ type: 'SET_TOUCH', payload: { name: 'varient_type', value: true } })
        dispatch({ type: 'SET_VARIENT_TYPE', payload: value })
        if (value === '') {
            dispatch({ type: 'SET_ERROR', payload: { name: 'varient_type', value: 'Hãy nhập tên phân loại' } })
        }
        else {
            dispatch({ type: 'SET_ERROR', payload: { name: 'varient_type', value: '' } })
        }
    }

    const handleAddVarientRow = () => {
        const newVarientRow = {
            key: state.varient_rows.length + 1,
            varient_name: '',
            error_varient_name: '',
            touch: false
        };
        dispatch({ type: 'SET_VARIENT_ROWS', payload: [...state.varient_rows, newVarientRow] });
    };

    const handleRemoveVarientRow = (key) => {
        const newVarientRows = state.varient_rows.filter(row => row.key !== key)
        dispatch({ type: 'SET_VARIENT_ROWS', payload: newVarientRows })
    }

    const handleInputVarientNameChange = (key, value) => {
        const isDuplicate = value !== '' && state.varient_rows.some(row => row.varient_name === value && row.key !== key);
        const updatedRows = state.varient_rows.map(row =>
            row.key === key
                ? {
                    ...row,
                    varient_name: value,
                    error_varient_name: value === '' ? 'Hãy nhập phân loại' : isDuplicate ? 'Phân loại không được trùng' : '',
                    touch: true,
                }
                : row
        );
        dispatch({ type: 'SET_VARIENT_ROWS', payload: updatedRows });
        validateSubmit();
    };

    const validateSubmit = () => {
        // Validate classify fields
        const classifyTypeValid = state.classify_type !== '';
        let enableSubmit = false;
        let classifyRowsValid = state.classify_rows.every(row =>
            row.classify_name !== '' &&
            row.classify_image.length > 0 &&
            row.error_classify_name === '' &&
            row.error_classify_image === ''
        );

        if (state.classify_rows.length === 0) {
            classifyRowsValid = false;
        }

        let varientTypeValid = false;
        let varientRowsValid = false;
        if (!state.visible_btn_add_varient) {
            varientTypeValid = state.varient_type !== '';
            varientRowsValid = state.varient_rows.every(row =>
                row.varient_name !== '' &&
                row.error_varient_name === ''
            );
            if (state.varient_rows.length === 0) {
                varientRowsValid = false
            }
        }
        else {
            varientTypeValid = true;
            varientRowsValid = true;
        }

        if (classifyTypeValid && classifyRowsValid && varientTypeValid && varientRowsValid) {
            enableSubmit = true;
        }
        dispatch({ type: 'SET_ENABLE_SUBMIT', payload: enableSubmit });
    };

    const checkThumbnailChanges = (update_classify_rows, initial_classify_rows) => {
        let updatedClassifyRows = [];
        update_classify_rows.map((updateRow) => {
            initial_classify_rows.map((initialRow) => {
                if (updateRow.key === initialRow.key) {
                    if (updateRow.classify_image[0].uid !== initialRow.classify_image[0].uid) {
                        updatedClassifyRows.push(updateRow)
                    }
                }
            })
        })
        return updatedClassifyRows;
    }

    const uploadClassifyThumnail = async (thumnails) => {
        const uploadPromises = thumnails.map(file => uploadFile(file.originFileObj, 'seller-img'));
        try {
            const uploadResults = await Promise.all(uploadPromises);
            console.log("Upload Classify Thumnail: ", uploadResults);
            const uploadUrls = uploadResults.map(file => file.url);
            return uploadUrls;
        } catch (error) {
            console.log("Error uploading classify thumbnail:", error);
            return [];
        }
    }

    const updateClassifyThumbnailChanges = async (updatedClassifyRows, new_thumbnails) => {
        try {
            const thumbnails = await uploadClassifyThumnail(new_thumbnails);
            if (thumbnails.length === 0) {
                console.error("Failed to upload thumbnails.");
                message.error("Cập nhật phân loại thất bại");
                return false;
            }
            const updatePromises = thumbnails.map((thumbnail, index) => {
                if (updatedClassifyRows[index]) {
                    const update_classify_promise = {
                        product_classify_id: updatedClassifyRows[index].product_classify_id,
                        thumbnail: thumbnail,
                        type_name: state.classify_type,
                        product_classify_name: updatedClassifyRows[index].classify_name,
                    };
                    return updateProductClassify(update_classify_promise);
                }
            }).filter(Boolean);

            if (updatePromises.length > 0) {
                await Promise.all(updatePromises);
                console.log("All updates completed successfully.");
                message.success("Cập nhật thành công " + updatePromises.length + " phân loại");
                return true;
            } else {
                console.log("No updates were made.");
                message.error("Cập nhật phân loại thất bại");
                return false;
            }
        } catch (error) {
            console.error("Error updating product classify:", error);
            message.error("Cập nhật phân loại thất bại");
            return false;
        }
    };

    const updateClassifyNonThumbnailChanges = async (updatedClassifyRows) => {
        try {
            const updatePromises = updatedClassifyRows.map((row) => {
                const update_classify_promise = {
                    product_classify_id: row.product_classify_id,
                    type_name: state.classify_type,
                    product_classify_name: row.classify_name,
                };
                return updateProductClassify(update_classify_promise);
            });
            if (updatePromises.length > 0) {
                await Promise.all(updatePromises);
                console.log("All updates completed successfully.");
                message.success("Cập nhật thành công " + updatePromises.length + " phân loại");
                return true;
            } else {
                console.log("No updates were made.");
                message.error("Cập nhật phân loại thất bại");
                return false;
            }
        } catch (error) {
            console.error("Error updating product classify:", error);
            message.error("Cập nhật phân loại thất bại");
            return false;
        }
    }

    // delete classify
    const deleteProductClassifyVarients = async (product_classify_ids) => {
        const deleteVarientsResult = await deleteSomeProductVarientsByClassify(product_classify_ids);
        if (deleteVarientsResult.success) {
            console.log("Delete product varients successfully");
            const deteleClassifyResult = await deleteSomeProductClassify(product_classify_ids);
            if (deteleClassifyResult.success) {
                console.log("Delete product classify successfully");
                message.success("Xóa thành công " + product_classify_ids.length + " phân loại");
                return true;
            } else {
                console.error("Delete product classify failed");
                message.error("Cập nhật phân loại thất bại");
                return false;
            }
        } else {
            if (deleteVarientsResult?.status === 400) {
                message.error('Có phân loại đang được sử dụng không thể xóa');
                console.error("Helloooooooooooooo", deleteVarientsResult);
                return false;
            }
            else {
                console.error("Delete product varients failed");
                message.error("Cập nhật phân loại thất bại");
                return false;
            }
        }
    }

    // add classify
    const addProductClassify = async (addedClassifyRows) => {
        const added_thumbnails = addedClassifyRows.map((item) => item.classify_image[0]);
        const added_classify_names = addedClassifyRows.map((item) => item.classify_name);
        const thumbnails = await uploadClassifyThumnail(added_thumbnails);
        if (thumbnails.length === 0) {
            console.error("Failed to upload thumbnails.");
            message.error("Cập nhật phân loại thất bại");
            return false;
        }
        else {
            let addSomeClassifyResult, addSomeProductVarientLevel3Result;
            addSomeClassifyResult = await addSomeClassify({
                product_id: product.product_id,
                product_classify_names: added_classify_names,
                type_name: state.classify_type,
                thumbnails: thumbnails
            });
            if (addSomeClassifyResult.success) {
                console.log("Add product classify successfully", addSomeClassifyResult.data);
                const sizeRes = await getProductSize({ product_id: product.product_id });
                console.log("Check product classify ids:", addSomeClassifyResult.data.map(item => item.product_classify_id));
                console.log("Check product size ids:", sizeRes.data.map(item => item.product_size_id));
                addSomeProductVarientLevel3Result = await addSomeProductVarientLevel3({
                    product_id: product.product_id,
                    product_classify_ids: addSomeClassifyResult.data.map(item => item.product_classify_id),
                    product_size_ids: sizeRes.data.map(item => item.product_size_id),
                    price: 0,
                    stock: 0,
                    sale_percents: 0,
                    height: 0,
                    length: 0,
                    width: 0,
                    weight: 0
                });
                if (addSomeProductVarientLevel3Result.success) {
                    console.log("Add product varient successfully", addSomeProductVarientLevel3Result.data);
                    message.success("Thêm thành công " + addSomeClassifyResult.data.length + " phân loại");
                    return true;
                } else {
                    console.error("Add product varient failed", addSomeProductVarientLevel3Result);
                    message.error("Cập nhật phân loại thất bại");
                    return false;
                }
            } else {
                console.error("Add product classify failed", addSomeClassifyResult);
                message.error("Cập nhật phân loại thất bại");
                return false;
            }
        }
    }

    // add varient

    const handelAddProductVarient = async (addedVarientRows) => {
        const addSomeSizeResult = await addSomeProductSize({
            product_id: product.product_id,
            product_size_names: addedVarientRows.map(item => item.varient_name),
            type_of_size: state.varient_type
        });
        if (addSomeSizeResult.success) {
            console.log("Add product size successfully", addSomeSizeResult.data);
            const classifyIdsRes = await findClassifiesID({ product_id: product.product_id });
            if(classifyIdsRes.success) {
                const addSomeProductVarientLevel3Result = await addSomeProductVarientLevel3({
                    product_id: product.product_id,
                    product_classify_ids: classifyIdsRes.data.map(item => item.product_classify_id),
                    product_size_ids: addSomeSizeResult.data.map(item => item.product_size_id),
                    price: 0,
                    stock: 0,
                    sale_percents: 0,
                    height: 0,
                    length: 0,
                    width: 0,
                    weight: 0
                });
                if (addSomeProductVarientLevel3Result.success) {
                    console.log("Add product varient successfully", addSomeProductVarientLevel3Result.data);
                    message.success("Thêm thành công " + addSomeSizeResult.data.length + " phân loại");
                    return true;
                } else {
                    console.error("Add product varient failed", addSomeProductVarientLevel3Result);
                    message.error("Cập nhật phân loại thất bại");
                    return false;
                }
            }

        } else {
            console.error("Add product size failed", addSomeSizeResult);
            message.error("Cập nhật phân loại thất bại");
            return false;
        }
    }

    // delete varient
    const handleDeleteVarient = async (product_size_ids) => {
        const deleteSomeProductVarientsBySizeResult = await deleteSomeProductVarientsBySize(product_size_ids);
        if (deleteSomeProductVarientsBySizeResult.success) {
            console.log("Delete product varients successfully");
            const deleteSomeProductSizeResult = await deleteSomeProductSize(product_size_ids);
            if (deleteSomeProductSizeResult.success) {
                console.log("Delete product size successfully");
                message.success("Xóa thành công " + product_size_ids.length + " phân loại");
                return true;
            } else {
                console.error("Delete product size failed");
                message.error("Cập nhật phân loại thất bại");
                return false;
            }
        }
        else {
            if (deleteSomeProductVarientsBySizeResult?.status === 400) {
                message.error('Có phân loại đang được sử dụng không thể xóa');
                return false;
            }
            else {
                console.error("Delete product varients failed");
                message.error("Cập nhật phân loại thất bại");
                return false;
            }
        }
    }
    const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

    const resetDataSourceAndCancel = () => {
        resetDataSource();
        onCancel();
    };

    const handleSubmit = async () => {
        // Xác định các hàng phân loại được thêm, xóa và cập nhật với so sánh sâu
        const addedClassifyRows = state.classify_rows.filter(
            row => !state.initial_data.classify_rows.some(
                initialRow => initialRow.product_varient_id === row.product_varient_id && initialRow.key === row.key
            )
        );

        const removedClassifyRows = state.initial_data.classify_rows.filter(
            initialRow => !state.classify_rows.some(
                row => row.product_varient_id === initialRow.product_varient_id && row.key === initialRow.key
            )
        );

        const updatedClassifyRows = state.classify_rows.filter(
            row => state.initial_data.classify_rows.some(
                initialRow => initialRow.product_varient_id === row.product_varient_id &&
                    initialRow.key === row.key &&
                    !isEqual(initialRow, row)
            )
        );

        // Lọc các hàng biến thể
        const addedVarientRows = state.varient_rows.filter(
            row => !state.initial_data.varient_rows.some(
                initialRow => initialRow.product_varient_id === row.product_varient_id && initialRow.key === row.key
            )
        );

        const removedVarientRows = state.initial_data.varient_rows.filter(
            initialRow => !state.varient_rows.some(
                row => row.product_varient_id === initialRow.product_varient_id && row.key === initialRow.key
            )
        );

        const updatedVarientRows = state.varient_rows.filter(
            row => state.initial_data.varient_rows.some(
                initialRow => initialRow.product_varient_id === row.product_varient_id &&
                    initialRow.key === row.key &&
                    !isEqual(initialRow, row)
            )
        );
        let check;

        // Xử lý các hàng phân loại cập nhật
        if (updatedClassifyRows.length > 0) {
            console.log('Updated classify rows action is performed:', updatedClassifyRows);
            const checkThumb = checkThumbnailChanges(updatedClassifyRows, state.initial_data.classify_rows);
            if (checkThumb.length > 0) {
                const update_thumbnail = checkThumb.map((item) => item.classify_image[0]);
                check = await updateClassifyThumbnailChanges(updatedClassifyRows, update_thumbnail);
                if (!check) return resetDataSourceAndCancel();
            } else {
                check = await updateClassifyNonThumbnailChanges(updatedClassifyRows);
                if (!check) return resetDataSourceAndCancel();
            }
        }

        // Xử lý các hàng phân loại xóa
        if (removedClassifyRows.length > 0) {
            console.log('Removed classify rows action is performed:', removedClassifyRows);
            const product_classify_ids = removedClassifyRows.map(row => row.product_classify_id);
            check = await deleteProductClassifyVarients(product_classify_ids);
            if (!check) return resetDataSourceAndCancel();
        }

        // Xử lý các hàng phân loại thêm
        if (addedClassifyRows.length > 0) {
            console.log('Added classify rows action is performed:', addedClassifyRows);
            check = await addProductClassify(addedClassifyRows);
            if (!check) return resetDataSourceAndCancel();
        }

        // Xử lý các hàng biến thể cập nhật
        if (updatedVarientRows.length > 0) {
            console.log('Updated variant rows action is performed:', updatedVarientRows);
            // Thêm các xử lý khác nếu cần
        }

        // Xử lý các hàng biến thể thêm
        if (addedVarientRows.length > 0) {
            console.log('Added variant rows action is performed:', addedVarientRows);
            check = await handelAddProductVarient(addedVarientRows);
            if (!check) return resetDataSourceAndCancel();
        }

        // Xử lý các hàng biến thể xóa
        if (removedVarientRows.length > 0) {
            console.log('Removed variant rows action is performed:', removedVarientRows);
            const product_size_ids = removedVarientRows.map(row => row.product_size_id);
            check = await handleDeleteVarient(product_size_ids);
            if (!check) return resetDataSourceAndCancel();
        }

        // Kiểm tra nếu không có thay đổi nào
        if (
            addedClassifyRows.length === 0 &&
            removedClassifyRows.length === 0 &&
            updatedClassifyRows.length === 0 &&
            addedVarientRows.length === 0 &&
            removedVarientRows.length === 0 &&
            updatedVarientRows.length === 0
        ) {
            console.log('No action is performed');
        }

        // Cập nhật loại phân loại nếu cần thiết
        if (state.classify_type !== product.ProductVarients[0]?.ProductClassify?.type_name) {
            const update_type_name_result = await updateClassifyTypeName({
                product_id: product.product_id,
                type_name: state.classify_type
            });

            if (update_type_name_result.success) {
                console.log('Update type name successfully');
            } else {
                console.error('Update type name failed');
                message.error('Cập nhật phân loại thất bại');
                return resetDataSourceAndCancel();
            }
        }

        // Hoàn thành, tắt trạng thái submit loading và reset lại nguồn dữ liệu
        dispatch({ type: 'SET_SUBMIT_LOADING', payload: false });
        resetDataSource();
        onCancel();
    };


    const handleDownToLevel1 = () => {
        dispatch({ type: 'SET_CLASSIFY_TYPE', payload: '' });
        dispatch({ type: 'SET_CLASSIFY_ROWS', payload: [] });
        dispatch({ type: 'SET_VARIENT_TYPE', payload: '' });
        dispatch({ type: 'SET_VARIENT_ROWS', payload: [] });
        dispatch({ type: 'SET_DOWN_TO_LEVEL_1', payload: true });
    }

    useEffect(() => {
        const hasClassifyRowsChanged = state.classify_rows.some((row, index) => {
            const prevRow = prevClassifyRowsRef.current[index] || {};
            return (
                row.classify_name !== prevRow.classify_name ||
                row.classify_image.length !== prevRow.classify_image?.length ||
                row.error_classify_name !== prevRow.error_classify_name ||
                row.error_classify_image !== prevRow.error_classify_image
            );
        });

        const hasVarientRowsChanged = state.varient_rows.some((row, index) => {
            const prevRow = prevVarientRowsRef.current[index] || {};
            return (
                row.varient_name !== prevRow.varient_name ||
                row.error_varient_name !== prevRow.error_varient_name
            );
        });

        if (
            hasClassifyRowsChanged ||
            hasVarientRowsChanged ||
            state.classify_type !== prevClassifyRowsRef.current.classify_type ||
            state.varient_type !== prevVarientRowsRef.current.varient_type
        ) {
            validateSubmit();
            prevClassifyRowsRef.current = [...state.classify_rows];
            prevVarientRowsRef.current = [...state.varient_rows];
        }
    }, [
        state.classify_rows,
        state.classify_type,
        state.varient_rows,
        state.varient_type,
        state.visible_btn_add_varient,
        state.down_to_level_1
    ]);

    useEffect(() => {
        if (product && product?.ProductVarients[0]?.ProductClassify) {
            console.log('Nhan level 3 duoc roi nha cam on:', product);
            // classify
            dispatch({ type: 'SET_CLASSIFY_TYPE', payload: product.ProductVarients[0]?.ProductClassify?.type_name });
            console.log('Type:', product.ProductVarients[0]?.ProductClassify?.type_name);

            const classify_name_set = new Set(); // Set to track unique classify names
            const classify_rows = [];

            product.ProductVarients.forEach((item) => {
                const classify_name = item.ProductClassify.product_classify_name;
                if (!classify_name_set.has(classify_name)) {
                    classify_name_set.add(classify_name);
                    classify_rows.push({
                        key: classify_rows.length + 1,
                        classify_name,
                        classify_image: [{
                            url: item.ProductClassify.thumbnail,
                            uid: item.ProductClassify.id,
                            status: 'done'
                        }],
                        error_classify_name: '',
                        error_classify_image: '',
                        touch: false,
                        product_varient_id: item.product_varients_id,
                        product_classify_id: item.ProductClassify.product_classify_id
                    });
                }
                // console.log('Item:', classify_name);
            });

            dispatch({ type: 'SET_CLASSIFY_ROWS', payload: classify_rows });


            // varient
            dispatch({ type: 'SET_VARIENT_TYPE', payload: product.ProductVarients[0]?.ProductSize?.type_of_size });

            const varient_name_set = new Set(); // Set to track unique varient names
            const varient_rows = [];

            product.ProductVarients.forEach((item) => {
                const varient_name = item.ProductSize.product_size_name;
                if (!varient_name_set.has(varient_name)) {
                    varient_name_set.add(varient_name);
                    varient_rows.push({
                        key: varient_rows.length + 1,
                        varient_name,
                        error_varient_name: '',
                        touch: false,
                        product_size_id: item.ProductSize.product_size_id,
                        product_varient_id: item.product_varients_id
                    });
                }
                // console.log('Item:', varient_name);
            });

            dispatch({ type: 'SET_VARIENT_ROWS', payload: varient_rows });
            dispatch({ type: 'SET_INITIAL_DATA', payload: { classify_rows, varient_rows } })
            console.log('Classify Rows:', classify_rows);
            console.log('Varient Rows:', varient_rows);

        }
    }, [product]);



    return (
        <div>
            <Modal
                open={visible}
                title="Chỉnh sửa phân loại"
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
            >
                <Row className='flex items-center mb-5 mt-5'>
                    <Col span={4}>
                        <div className='font-semibold'>Phân loại 1</div>
                    </Col>
                    <Col span={18}>
                        <Input
                            showCount
                            maxLength={15}
                            placeholder="Nhập tên phân loại"
                            value={state.classify_type}
                            onChange={(e) => handleClassifyTypeChange(e.target.value)}
                        />
                        {state.errors.classify_type && state.touchs.classify_type && (<div className='text-red-500 text-sm'>{state.errors.classify_type}</div>)}
                    </Col>
                    <Col span={2}>
                        <Popconfirm
                            title="Lưu ý"
                            description="Tùy chọn này sẽ xóa tất cả các phân loại. Bạn có chắc chắn muốn thực hiện không?"
                            onConfirm={handleDownToLevel1}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <MdOutlineLeakRemove
                                size={25}
                                className='cursor-pointer'
                                // onClick={() => handleRemoveClassifyRow(row.key)}
                                color='#ff4d4f' />
                        </Popconfirm>
                    </Col>
                </Row>
                {state.classify_rows.map((row) => (
                    <Row key={row.key} className='flex items-center mb-2' gutter={10}>
                        <Col span={6}>
                            <Upload
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={true}
                                fileList={row.classify_image}
                                maxCount={1}
                                beforeUpload={beforeUpload}
                                onChange={({ fileList }) => handleUploadClassifyImageChange(row.key, { fileList })}
                                onRemove={() => handleRemoveClassifyImage(row.key)}
                            >
                                {row.classify_image.length < 1 && (
                                    uploadButton
                                )}
                            </Upload>
                        </Col>
                        <Col span={16}>
                            <Input
                                value={row.classify_name}
                                showCount
                                maxLength={20}
                                placeholder="Nhập phân loại"
                                onChange={(e) => handleInputClassifyNameChange(row.key, e.target.value)}
                            />
                            {row.error_classify_name && row.touch && (<div className='text-red-500 text-sm'>{row.error_classify_name}</div>)}
                            {row.error_classify_image && row.touch && (<div className='text-red-500 text-sm'>{row.error_classify_image}</div>)}
                        </Col>
                        <Col span={2}>
                            <CiSquareRemove
                                size={25}
                                className='cursor-pointer'
                                onClick={() => handleRemoveClassifyRow(row.key)}
                                color='#ff4d4f' />
                        </Col>
                    </Row>
                ))}
                <CiSquarePlus
                    size={30}
                    onClick={handleAddClassifyRow}
                    className='mx-auto cursor-pointer'
                    color='#327bb3'
                />
                {state.visible_btn_add_varient ? (
                    <div>
                        <p className='font-semibold'>Phân loại 2</p>
                        <Button
                            type="dashed"
                            icon={<GoPlus size={25} />}
                            className='text-sm'
                            onClick={handleAddVarient}
                        >
                            Thêm nhóm phân loại 2
                        </Button>
                    </div>
                ) : (
                    <div>
                        <Row className='flex items-center mb-5 mt-5' gutter={10}>
                            <Col span={4}>
                                <div className='font-semibold'>Phân loại 2</div>
                            </Col>
                            <Col span={18}>
                                <Input
                                    showCount
                                    maxLength={15}
                                    placeholder="Nhập tên phân loại"
                                    value={state.varient_type}
                                    onChange={(e) => handleVarientTypeChange(e.target.value)}
                                />
                                {state.errors.varient_type && state.touchs.varient_type && (<div className='text-red-500 text-sm'>{state.errors.varient_type}</div>)}
                            </Col>
                            <Col span={2}>
                                <CiSquareRemove
                                    size={25}
                                    className='cursor-pointer'
                                    onClick={handleAddVarient}
                                    color='#ff4d4f' />
                            </Col>
                        </Row>
                        {state.varient_rows.map((row) => (
                            <Row key={row.key} className='flex items-center mb-2' gutter={10}>
                                <Col span={22}>
                                    <Input
                                        value={row.varient_name}
                                        showCount
                                        maxLength={20}
                                        placeholder="Nhập phân loại"
                                        onChange={(e) => handleInputVarientNameChange(row.key, e.target.value)}
                                    />
                                    {row.error_varient_name && row.touch && (<div className='text-red-500 text-sm'>{row.error_varient_name}</div>)}
                                </Col>
                                <Col span={2}>
                                    <CiSquareRemove
                                        size={25}
                                        className='cursor-pointer'
                                        onClick={() => handleRemoveVarientRow(row.key)}
                                        color='#ff4d4f' />
                                </Col>
                            </Row>
                        ))}
                        <CiSquarePlus
                            size={30}
                            onClick={handleAddVarientRow}
                            className='mx-auto cursor-pointer'
                            color='#327bb3'
                        />
                    </div>
                )}
            </Modal>
        </div>
    )
});


export default EditProductLevel3Modal