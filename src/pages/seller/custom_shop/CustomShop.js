import React, { useEffect, useReducer, useState } from 'react';
import { useSelector } from 'react-redux';
import { addImageCustom, createCustomize, deleteCustomizeShop, deleteImageCustom, getCustomizeShop } from '../../../services/customizeShopService';
import { Popconfirm, Upload, Button, message, Modal } from 'antd';
import ImgCrop from 'antd-img-crop';
import { IoTrashBin } from "react-icons/io5";
import { RiFolderAddFill } from "react-icons/ri";
import { Empty } from 'antd';
import uploadFile from '../../../helpers/uploadFile';
import Cropper from 'react-easy-crop'
const CustomShop = () => {
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'SET_CUSTOMIZES':
          return { ...state, customizes: action.payload };
        case 'SET_IMG_CUSTOM':
          return { ...state, img_custom: { ...state.img_custom, ...action.payload }, };
        case 'SET_HAS_CHANGES':
          return { ...state, hasChanges: { ...state.hasChanges, [action.payload.customize_shop_id]: action.payload.value } };
        case 'SET_IMAGES_DELETE':
          return { ...state, images_delete: action.payload };
        case 'SET_PREVIEW_IMAGE':
          return { ...state, previewImage: action.payload };
        case 'SET_PREVIEW_VISIBLE':
          return { ...state, previewVisible: action.payload };
        case 'SET_PREVIEW_TITLE':
          return { ...state, previewTitle: action.payload };
        case 'SET_LOADING':
          return { ...state, loading: action.payload };
        case 'SET_IMAGE_DIMENSIONS':
          return { ...state, imageDimensions: action.payload };
        default:
          return state;
      }
    },
    {
      customizes: [],
      img_custom: {},
      hasChanges: {},
      loading: false,
      images_delete: [],
      previewImage: '',
      previewVisible: false,
      previewTitle: '',
      imageDimensions: { width: 0, height: 0 },
    }
  );

  const shop = useSelector(state => state.shop);

  const handleGetCustomShop = async (shop_id) => {
    try {
      const res = await getCustomizeShop(shop_id);
      if (res.success) {
        console.log('Customize fetched', res.data);
        return res.data;
      }
    } catch (error) {
      console.error('Error when fetching customize shop:', error);
    }
    return [];
  };

  const handleDeleteBanner = async (customizeShopId) => {
    // Handle deleting the banner
    setLocalState({ type: 'SET_LOADING', payload: true });
    console.log(`Deleting banner ${customizeShopId}`);
    try {
      const res = await deleteCustomizeShop({ customize_shop_id: customizeShopId });
      if (res.success) {
        message.success("Xóa banner thành công");
        const newCustomizes = localState.customizes.filter(custom => custom.customize_shop_id !== customizeShopId);
        setLocalState({ type: 'SET_CUSTOMIZES', payload: newCustomizes });
      }
      else {
        if (res.status === 404) {
          const newCustomizes = localState.customizes.filter(custom => custom.customize_shop_id !== customizeShopId);
          setLocalState({ type: 'SET_CUSTOMIZES', payload: newCustomizes });
          return;
        }
        console.error("Error when deleting banner:", res.message);
        message.error("Xóa banner thất bại");
      }
    } catch (error) {
      console.error("Error when deleting banner:", error);
      message.error("Xóa banner thất bại");
    }
    setLocalState({ type: 'SET_LOADING', payload: false });
  }


  const handleAddImagesBanner = async (customize_shop_id, img_urls) => {
    try {
      const payload = {
        customize_shop_id: customize_shop_id,
        img_urls: img_urls
      }
      const res = await addImageCustom(payload);
      if (res.success) {
        message.success("Thêm ảnh thành công " + res?.data?.length);
        console.log("Add images to banner:", res.data);
      }
      else {
        if (res.status === 404) {
          const payload_create = {
            shop_id: shop.shop_id,
            img_urls: img_urls
          }
          try {
            const res_create = await createCustomize(payload_create);
            if (res_create.success) {
              message.success("Thêm Banner thành công");
            }
            else {
              console.error("Error when adding images to banner:", res_create.message);
            }
          } catch (error) {
            console.error("Error when adding images to banner:", error);
          }
        }
        console.error("Error when adding images to banner:", res.message);
      }
    } catch (error) {
      console.error("Error when adding images to banner:", error);
    }
  }

  const handleDeleteImagesBanner = async (img_customize_shop_ids) => {
    try {
      const res = await deleteImageCustom({ img_customize_shop_ids: img_customize_shop_ids });
      if (res.success) {
        message.success("Xóa ảnh thành công " + res?.data?.length);
      }
      else {
        console.error("Error when deleting images from banner:", res.message);
      }
    } catch (error) {
      console.error("Error when deleting images from banner:", error);
    }
  }


  const handleUploadChange = (fileList, customizeShopId) => {
    setLocalState({
      type: 'SET_IMG_CUSTOM',
      payload: { [customizeShopId]: fileList },
    });

    // Set hasChanges to true when the image list is updated
    setLocalState({
      type: 'SET_HAS_CHANGES',
      payload: { customize_shop_id: customizeShopId, value: true },
    });
  };
  const beforeUpload = (file) => {
    console.log("file", file);
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Chỉ cho phép file hình ảnh!');
      return Upload.LIST_IGNORE; // Prevent file from being uploaded
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Hình ảnh phải nhỏ hơn 2MB!');
      return Upload.LIST_IGNORE; // Prevent file from being uploaded
    }

    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        const isCorrectDimensions = image.width === 1200 && image.height === 800;
        if (!isCorrectDimensions) {
          message.error('Hình ảnh phải có kích thước là 1200x800!');
          console.log("image", image.width, image.height);
          return Upload.LIST_IGNORE; // Prevent file from being uploaded
        } else {
          resolve(); // Allow file to be uploaded
        }
      };
      image.onerror = () => {
        message.error('Không thể tải hình ảnh!');
        return Upload.LIST_IGNORE; // Prevent file from being uploaded
      };
    });
  };


  const handlePreview = async (file) => {
    setLocalState({ type: 'SET_PREVIEW_IMAGE', payload: file.url || (await getBase64(file.originFileObj)) });
    setLocalState({ type: 'SET_PREVIEW_VISIBLE', payload: true });
    setLocalState({ type: 'SET_PREVIEW_TITLE', payload: file.name || file.url.substring(file.url.lastIndexOf('/') + 1) });
  };


  const beforeCrop = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      return false; // Ngừng crop tệp không phải hình ảnh
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      return false; // Ngừng nếu ảnh lớn hơn 2MB
    }

    // Lấy kích thước của ảnh khi load ảnh
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = () => {
      const width = image.width;
      const height = image.height;

      // Cập nhật kích thước ảnh vào state
      setLocalState({
        type: 'SET_IMAGE_DIMENSIONS',
        payload: { width, height }
      });

      // Cập nhật tiêu đề của modal crop
      setLocalState({
        type: 'SET_PREVIEW_TITLE',
        payload: `Kích thước ảnh: ${width}x${height}`
      });
    };

    return true; // Cho phép crop ảnh
  };


  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });


  const handleRemoveImage = (file) => {
    const { uid, originFileObj } = file;

    if (uid && !originFileObj) {
      setLocalState({
        type: 'SET_IMAGES_DELETE',
        payload: [...localState.images_delete, uid],
      });
    }
  };

  const uploadCustomShopImages = async (images) => {
    const uploadPromises = images.map(file => uploadFile(file.originFileObj, 'seller-img'));
    try {
      const uploadResults = await Promise.all(uploadPromises);
      console.log("Upload customize shop images: ", uploadResults);
      const uploadUrls = uploadResults.map(file => file.url);
      return uploadUrls;
    } catch (error) {
      console.log("Error uploading images:", error);
      return [];
    }
  }

  const handleSaveChanges = async (customizeShopId) => {
    // Handle saving the changes
    setLocalState({ type: 'SET_LOADING', payload: true });
    console.log(`Saving changes for banner ${customizeShopId}`);
    // Set hasChanges to false after saving


    const img_upload = localState.img_custom[customizeShopId];
    const filter_images = img_upload.filter(img => img.originFileObj !== undefined);
    console.log("upload nhaaaa", filter_images);
    const uploadedUrls = await uploadCustomShopImages(filter_images);
    await handleAddImagesBanner(customizeShopId, uploadedUrls);
    const delete_images = localState.images_delete;
    console.log("delete nhaaaa", delete_images);
    await handleDeleteImagesBanner(delete_images);
    setLocalState({ type: 'SET_LOADING', payload: false });
    setLocalState({
      type: 'SET_HAS_CHANGES',
      payload: { customize_shop_id: customizeShopId, value: false },
    });
  };

  const handleAddBanner = () => {
    const newBannerId = Date.now(); // Unique ID for new banner
    setLocalState({
      type: 'SET_CUSTOMIZES',
      payload: [
        ...localState.customizes,
        { customize_shop_id: newBannerId, ImgCustomizeShops: [] },
      ],
    });
  };
  const handleCropChange = (croppedArea, croppedAreaPixels) => {
    console.log('Cropped area:', croppedArea);
    console.log('Cropped area pixels:', croppedAreaPixels);
    // You can update your state or perform other actions here
  };
  useEffect(() => {
    if (shop?.shop_id) {
      const fetchCustomShop = async () => {
        const customs = await handleGetCustomShop(shop.shop_id);
        setLocalState({ type: 'SET_CUSTOMIZES', payload: customs });

        const img_custom = customs.reduce((acc, custom) => {
          acc[custom.customize_shop_id] = custom.ImgCustomizeShops.map(img => ({
            uid: img.img_customize_shop_id,
            name: img.img_customize_shop_id,
            status: 'done',
            url: img.img_url,
          }));
          return acc;
        }, {});

        setLocalState({ type: 'SET_IMG_CUSTOM', payload: img_custom });
      };

      fetchCustomShop();
    }
  }, [shop]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Trang trí Shop</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {localState.customizes.length > 0 ?
          localState.customizes.map((custom, index) => (
            <div
              key={custom.customize_shop_id}
              className="bg-white p-5 shadow-lg rounded-lg transition-all hover:shadow-2xl hover:scale-105"
            >
              <div className='flex justify-between items-center mb-4'>
                <h3 className="text-xl font-semibold text-gray-700">
                  Banner {index + 1}
                </h3>
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa banner này?"
                  onConfirm={() => handleDeleteBanner(custom.customize_shop_id)}
                >
                  <IoTrashBin className="text-red-500 cursor-pointer hover:text-red-700 transition-all" size={25} />
                </Popconfirm>
              </div>

              <Upload
                listType="picture-card"
                fileList={localState.img_custom[custom.customize_shop_id] || []}
                onChange={({ fileList }) => handleUploadChange(fileList, custom.customize_shop_id)}
                beforeUpload={beforeUpload}
                onRemove={(file) => handleRemoveImage(file, custom.customize_shop_id)}
                className="upload-grid"
                onPreview={handlePreview}
              >
                {(localState.img_custom[custom.customize_shop_id]?.length || 0) < 5 && (
                  <div className="text-blue-500 hover:text-blue-700">
                    + Thêm ảnh
                  </div>
                )}
              </Upload>

              <Modal
                open={localState.previewVisible}
                title={localState.previewTitle}
                footer={null}
                onCancel={() => setLocalState({ type: 'SET_PREVIEW_VISIBLE', payload: false })}
              >
                <img alt="example" style={{ width: '100%' }} src={localState.previewImage} />
              </Modal>

              {/* Show save button if there are changes */}
              {localState.hasChanges[custom.customize_shop_id] && (
                <div className="mt-4">
                  <Button
                    type="primary"
                    onClick={() => handleSaveChanges(custom.customize_shop_id)}
                    loading={localState.loading}
                  >
                    Lưu Thay Đổi
                  </Button>
                </div>
              )}
            </div>
          )) : (
            <div className="text-center text-gray-500 col-span-full">
              <Empty description="Chưa có banner nào" />
            </div>
          )}

        {/* Add Banner Button */}
        {
          localState.customizes.length < 6 && (
            <div className="col-span-full text-center mt-6 mx-auto">
              <Button
                onClick={handleAddBanner}
                icon={<RiFolderAddFill />}
                type="primary"
                size="large"
                className="flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all"

              >
                Tạo Banner
              </Button>
            </div>
          )
        }

      </div>
    </div>
  );
};

export default CustomShop;
