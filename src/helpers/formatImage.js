import { Upload } from 'antd';

const formatImage = (file, setErrorMessage, setErrorVisible) => {
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

export default formatImage;