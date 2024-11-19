import { message, Upload } from "antd";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  closeRequest,
  getRequestById,
  sendRequestSupport,
} from "../services/requestSupportService";
import { sendMessage } from "../firebase/messageFirebase";
import { useDispatch, useSelector } from "react-redux";
import {
  closeSupportRequest,
  sendSupportRequest,
  setPreviewImage,
  setSupportMessageState,
} from "../redux/supportMessageSlice";
const SupportMessageContext = createContext();
export const SupportMessageProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [fileList, setFileList] = useState([]);
  const supportMessageState = useSelector((state) => state.supportMessage);

  const beforeUpload = useCallback(
    (file) => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      const isLt2M = file.size / 1024 / 1024 < 2;
      const currentFileList = fileList || [];
      if (currentFileList.length >= 6) {
        message.error("Chỉ được phép tải lên tối đa 6 file.");
        return Upload.LIST_IGNORE;
      }
      // Kiểm tra ảnh
      if (isImage) {
        if (!isLt2M) {
          message.error("Hình ảnh phải có dung lượng tối đa 2MB.");
          return Upload.LIST_IGNORE;
        }
        return true;
      }

      // Kiểm tra video
      if (isVideo) {
        const video = document.createElement("video");
        video.src = URL.createObjectURL(file);
        return new Promise((resolve) => {
          video.onloadedmetadata = () => {
            if (video.duration > 5 * 60) {
              message.error("Video phải có thời lượng tối đa 5 phút.");
              resolve(Upload.LIST_IGNORE);
            } else {
              resolve(true);
            }
            URL.revokeObjectURL(video.src); // Giải phóng bộ nhớ
          };
        });
      }

      // Nếu không phải ảnh hoặc video
      message.error("Chỉ chấp nhận file ảnh hoặc video.");
      return Upload.LIST_IGNORE;
    },
    [fileList]
  );
  const handleUploadFileListChange = useCallback(
    ({ fileList: newFileList }) => {
      console.log("newFileList", newFileList);
      setFileList(newFileList);
    },
    []
  );
  const handleRemoveProductImage = useCallback(
    (file) => {
      const fileToRemove = fileList.find((item) => item.uid === file.uid);
      if (fileToRemove?.url) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      setFileList(fileList.filter((item) => item.uid !== file.uid));
    },
    [fileList]
  );

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handlePreview = useCallback(async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    dispatch(
      setPreviewImage({
        previewImage: file.url || file.preview,
        previewVisible: true,
        previewOpen: true,
      })
    );
  }, []);
  const handleSendRequest = async (user_id) => {
    dispatch(sendSupportRequest(user_id));
  };

  const handleCloseRequest = async (request_support_id) => {
    dispatch(closeSupportRequest(request_support_id));
  };

  const handlePaste = useCallback(
    (e) => {
      const items = e.clipboardData.items;
      const currentFileList = fileList || [];
      const maxFiles = 6;

      if (currentFileList.length >= maxFiles) {
        message.error("Chỉ được phép tải lên tối đa 6 file.");
        return;
      }

      const newFileList = [...currentFileList];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (item.kind === "file") {
          const file = item.getAsFile();
          if (file) {
            const validate = beforeUpload(file);
            if (validate instanceof Promise) {
              validate.then((isValid) => {
                if (isValid && newFileList.length < maxFiles) {
                  const newFile = {
                    uid: `${file.name}-${Date.now()}`,
                    name: file.name,
                    status: "done",
                    url: URL.createObjectURL(file), // Tạo URL hiển thị thumbnail
                    originFileObj: file,
                  };
                  fileList.push(newFile);
                  handleUploadFileListChange({ fileList });
                }
              });
            } else if (validate && newFileList.length < maxFiles) {
              const newFile = {
                uid: `${file.name}-${Date.now()}`,
                name: file.name,
                status: "done",
                url: URL.createObjectURL(file),
                originFileObj: file,
              };
              newFileList.push(newFile);
              handleUploadFileListChange({ newFileList });
            }
          }
        }
      }
    },
    [beforeUpload, handleUploadFileListChange, fileList]
  );
  const value = useMemo(() => {
    return {
      fileList,
      setFileList,
      handleUploadFileListChange,
      beforeUpload,
      handleRemoveProductImage,
      handlePreview,
      handleSendRequest,
      handleCloseRequest,
      handlePaste,
    };
  }, [
    fileList,
    handleUploadFileListChange,
    beforeUpload,
    handleRemoveProductImage,
    handlePreview,
    handleSendRequest,
    handleCloseRequest,
    handlePaste,
  ]);

  return (
    <SupportMessageContext.Provider value={value}>
      {children}
    </SupportMessageContext.Provider>
  );
};
export const useSupportMessage = () => {
  return useContext(SupportMessageContext);
};
