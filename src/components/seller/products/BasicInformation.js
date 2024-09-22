import React, { useState } from 'react'
import { Form, Input, Upload, Button, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';


export const BasicInformation = () => {
    const [fileListProduct, setFileListProduct] = useState([]);
    const [thumbnail, setThumbnail] = useState([]);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [previewVisible, setPreviewVisible] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

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
    return (
        <div className=''>
            <h3 className='text-lg'>Thông tin cơ bản</h3>
            <Form layout="vertical">
                <Form.Item label="Hình ảnh sản phẩm" required>
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
                            <div>
                                <UploadOutlined />
                                <div>Thêm hình ảnh {fileListProduct.length}/5</div>
                            </div>
                        )}
                    </Upload>
                </Form.Item>
                <Form.Item label="Ảnh bìa" required>
                    <Upload
                        listType="picture-card"
                        fileList={thumbnail}
                        onChange={handleUploadThumbnailChange}
                        maxCount={1}
                        className='custom-upload'>
                        {thumbnail.length < 1 && (
                            <div>
                                <UploadOutlined />
                                <div>Thêm ảnh bìa {thumbnail.length}/1</div>
                            </div>
                        )}
                    </Upload>
                </Form.Item>

                <Form.Item label="Tên sản phẩm" required>
                    <Input placeholder="Nhập tên sản phẩm" />
                </Form.Item>

                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form>
            {/* Modal */}
            <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
            >
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
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
        </div>

    )
}
