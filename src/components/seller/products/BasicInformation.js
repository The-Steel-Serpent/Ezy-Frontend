import React, { useEffect, useState } from 'react'
import { Form, Input, Upload, Button, Modal, Table } from 'antd';
import { RiImageAddFill } from "react-icons/ri";
import { RightOutlined } from '@ant-design/icons';
import axios from 'axios';

export const BasicInformation = () => {
    const [fileListProduct, setFileListProduct] = useState([]);
    const [thumbnail, setThumbnail] = useState([]);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [previewVisible, setPreviewVisible] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isCatModalVisible, setIsCatModalVisible] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedCategoryPath, setSelectedCategoryPath] = useState('');
    const [selectedMainCategory, setSelectedMainCategory] = useState('');
    const [isRowClicked, setIsRowClicked] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const showCatModal = () => {
        setIsCatModalVisible(true);
        setIsSubmitted(false);
    };

    const handleCatOK = () => {
        setIsCatModalVisible(false);
        setIsSubmitted(true);
    }

    const handleCatCancel = () => {
        setIsCatModalVisible(false);
    }

    const onCatSelect = (record) => {
        if (record && record.category_name) {
            setSelectedMainCategory(record.category_name); // Store the main category name
            setSubCategories(record.SubCategories || []);
            setSelectedCategoryPath(record.category_name); // Reset the path to the main category
        } else {
            console.error('Category record is undefined or missing category_name');
        }
    };
    const onSubCatSelect = (record) => {
        if (record && record.sub_category_name) {
            setSelectedCategoryPath(prevPath => {
                const pathArray = prevPath.split(' > ');
                if (pathArray[0] !== selectedMainCategory) {
                    // If the main category has changed, reset the path
                    return `${selectedMainCategory} > ${record.sub_category_name}`;
                }
                // Replace the last sub-category with the new one
                if (pathArray.length > 1) {
                    pathArray[pathArray.length - 1] = record.sub_category_name;
                } else {
                    pathArray.push(record.sub_category_name);
                }
                return pathArray.join(' > ');
            });
        } else {
            console.error('Subcategory record is undefined or missing sub_category_name');
        }
    };

    const handleRowCatClick = (record) => {
        onCatSelect(record);
        setIsRowClicked(false);
    };

    const handleRowSubCatClick = (record) => {
        onSubCatSelect(record);
        setIsRowClicked(true);
    };


    const handleUploadListProductChange = ({ fileList: newFileList }) => {
        setFileListProduct(newFileList);
    };

    const handleUploadThumbnailChange = ({ fileList: newList }) => {
        setThumbnail(newList);
    }

    const handlePreview = async file => {
        setPreviewImage(file.url || file.thumbUrl);
        setPreviewVisible(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    }

    const handleCancel = () => setPreviewVisible(false);

    const handleErrorCancel = () => setErrorVisible(false);

    const beforeUpload = file => {
        const isImage = file.type.startsWith('image/');
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isImage) {
            setErrorMessage('Bạn chỉ có thể tải lên tệp hình ảnh!');
            setErrorVisible(true);
            return Upload.LIST_IGNORE;
        }
        if (!isLt2M) {
            setErrorMessage('Kích thước tập tin vượt quá 2.0 MB');
            setErrorVisible(true);
            return Upload.LIST_IGNORE;
        }
        return true;
    };



    // get categories 
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const URL = `${process.env.REACT_APP_BACKEND_URL}/api/categories-sub`;
                const res = await axios({
                    method: "GET",
                    url: URL,
                    withCredentials: true
                });
                if (res.data && Array.isArray(res.data.data)) {
                    setCategories(res.data.data);
                    console.log("data", categories);
                } else {
                    console.error("API response is not an array:", res.data);
                }
            } catch (error) {
                console.log("Error:", error);
            }
        }
        fetchCategories();
    }, []);

    const categoryColumns = [
        {
            title: 'Category Name',
            dataIndex: 'category_name',
            key: 'category_name',
            render: (text) => (
                <div className='flex justify-between'>
                    <span>{text}</span>
                    <RightOutlined />
                </div>
            ),
        }
    ];

    const subCategoryColumns = [
        {
            title: 'Subcategory Name',
            dataIndex: 'sub_category_name',
            key: 'sub_category_name',
        }
    ];
    return (
        <div>
            <h3 className='text-lg'>Thông tin cơ bản</h3>
            <Form layout='vertical' className='ml-5 gap-10'>
                <Form.Item
                    label="Hình ảnh sản phẩm"
                    required>
                    <Upload
                        listType="picture-card"
                        maxCount={5}
                        fileList={fileListProduct}
                        onChange={handleUploadListProductChange}
                        onPreview={handlePreview}
                        beforeUpload={beforeUpload}
                        className='custom-upload'
                    >
                        {fileListProduct.length < 5 && (
                            <div className='flex flex-col items-center'>
                                <RiImageAddFill size={20} color='#EE4D2D' />
                                <div className='text-[#EE4D2D]'>Thêm hình ảnh {fileListProduct.length}/5</div>
                            </div>
                        )}
                    </Upload>
                </Form.Item>
                <Form.Item
                    label="Ảnh bìa"
                    required>
                    <div className='flex items-center space-x-4'>
                        <Upload
                            listType="picture-card"
                            fileList={thumbnail}
                            onChange={handleUploadThumbnailChange}
                            maxCount={1}
                            className='custom-upload'>
                            {thumbnail.length < 1 && (
                                <div className='flex flex-col items-center '>
                                    <RiImageAddFill size={20} color='#EE4D2D' />
                                    <div className='text-[#EE4D2D]'>Thêm ảnh bìa {thumbnail.length}/1</div>
                                </div>
                            )}
                        </Upload>
                        <div className='description'>
                            <ul className='list-disc pl-5 text-[14px] text-gray-400'>
                                <li>Tải lên hình ảnh 1:1.</li>
                                <li>Ảnh bìa sẽ được hiển thị tại các trang Kết quả tìm kiếm, Gợi ý hôm nay,... Việc sử dụng ảnh bìa đẹp sẽ thu hút thêm lượt truy cập vào sản phẩm của bạn</li>
                            </ul>
                        </div>
                    </div>

                </Form.Item>

                {/* Ngành hàng */}
                <Form.Item label="Ngành hàng" required>
                    <Input
                        value={isSubmitted ? selectedCategoryPath : ''}
                        readOnly
                        onClick={showCatModal}
                        placeholder="Chọn ngành hàng"
                        className='border rounded-md'
                    />
                </Form.Item>

                <Form.Item
                    label="Tên sản phẩm"
                    name="productName"
                    rules={[
                        { required: true, message: 'Không được để ô trống' },
                        { min: 10, message: 'Tên sản phẩm của bạn quá ngắn. Vui lòng nhập ít nhất 10 kí tự' }
                    ]}
                >
                    <Input showCount maxLength={120} className='border rounded-md' />
                </Form.Item>

                {/* Mô tả sản phẩm */}
                <Form.Item
                    label="Mô tả sản phẩm"
                    name="productDescription"
                    rules={[
                        { required: true, message: 'Không được để ô trống' },
                        { min: 50, message: 'Mô tả sản phẩm của bạn quá ngắn. Vui lòng nhập ít nhất 50 kí tự' }
                    ]}
                >
                    <Input.TextArea showCount rows={9} maxLength={3000} />
                </Form.Item>


            </Form>
            {/* Modal */}
            <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
            >
                <img alt="example" className='w-[100%]' src={previewImage} />
            </Modal>
            <Modal
                visible={errorVisible}
                title="Lưu ý"
                footer={[
                    <Button
                        key="ok"
                        type='primary'
                        onClick={handleErrorCancel}>
                        Xác nhận
                    </Button>
                ]}
                onCancel={handleErrorCancel}
            >
                <p>{errorMessage}</p>
            </Modal>

            <Modal
                title="Chọn ngành hàng"
                visible={isCatModalVisible}
                onOk={handleCatOK}
                onCancel={handleCatCancel}
                footer={[
                    <Button key="cancel" onClick={handleCatCancel}>Cancel</Button>,
                    <Button disabled={!isRowClicked} key="confirm" type="primary" onClick={handleCatOK}>Confirm</Button>

                ]}
            >
                <div className='flex h-72 overflow-hidden'>
                    <Table
                        columns={categoryColumns}
                        dataSource={categories}
                        pagination={false}
                        rowKey="category_id"
                        showHeader={false}
                        className='w-[50%] overflow-y-auto custom-scrollbar'
                        onRow={(record) => ({
                            onClick: () => handleRowCatClick(record),
                        })}
                    />
                    <Table
                        columns={subCategoryColumns}
                        dataSource={subCategories}
                        pagination={false}
                        rowKey="sub_category_id"
                        showHeader={false}
                        className='w-[50%] overflow-y-auto custom-scrollbar'
                        onRow={(record) => ({
                            onClick: () => handleRowSubCatClick(record),
                        })}
                    />
                </div>
                <div className='mt-4'>
                    <p>Đã chọn: {selectedCategoryPath}</p>
                </div>
            </Modal>


        </div>

    )
}
