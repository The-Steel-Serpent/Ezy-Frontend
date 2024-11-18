import React, { useEffect, useReducer, useState } from 'react';
import { useSelector } from 'react-redux';
import { getCustomizeShop } from '../../../services/customizeShopService';
import { Popconfirm, Upload, Button } from 'antd';
import ImgCrop from 'antd-img-crop';
import { IoTrashBin } from "react-icons/io5";
import { RiFolderAddFill } from "react-icons/ri";
import { Empty } from 'antd';

const CustomShop = () => {
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'SET_CUSTOMIZES':
          return { ...state, customizes: action.payload };
        case 'SET_IMG_CUSTOM':
          return {
            ...state,
            img_custom: { ...state.img_custom, ...action.payload },
          };
        case 'SET_HAS_CHANGES':
          return {
            ...state,
            hasChanges: { ...state.hasChanges, [action.payload.customize_shop_id]: action.payload.value }
          };
        default:
          return state;
      }
    },
    {
      customizes: [],
      img_custom: {},
      hasChanges: {},
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

  const handleSaveChanges = (customizeShopId) => {
    // Handle saving the changes
    console.log(`Saving changes for banner ${customizeShopId}`);
    // Set hasChanges to false after saving
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
                  onConfirm={() => {
                    setLocalState({
                      type: 'SET_CUSTOMIZES',
                      payload: localState.customizes.filter(banner => banner.customize_shop_id !== custom.customize_shop_id),
                    });
                  }}
                >
                  <IoTrashBin className="text-red-500 cursor-pointer hover:text-red-700 transition-all" size={25} />
                </Popconfirm>
              </div>
              <ImgCrop rotate>
                <Upload
                  listType="picture-card"
                  fileList={localState.img_custom[custom.customize_shop_id] || []}
                  onChange={({ fileList }) =>
                    handleUploadChange(fileList, custom.customize_shop_id)
                  }
                  className="upload-grid"
                >
                  {(localState.img_custom[custom.customize_shop_id]?.length || 0) < 5 && (
                    <div className="text-blue-500 hover:text-blue-700">
                      + Thêm ảnh
                    </div>
                  )}
                </Upload>
              </ImgCrop>

              {/* Show save button if there are changes */}
              {localState.hasChanges[custom.customize_shop_id] && (
                <div className="mt-4">
                  <Button
                    type="primary"
                    onClick={() => handleSaveChanges(custom.customize_shop_id)}
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
      </div>
    </div>
  );
};

export default CustomShop;
