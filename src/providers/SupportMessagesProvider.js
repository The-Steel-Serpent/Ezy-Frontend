import { message, Upload } from "antd";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import {
  closeRequest,
  getRequestById,
  sendRequestSupport,
} from "../services/requestSupportService";
const SupportMessageContext = createContext();
export const SupportMessageProvider = ({ children }) => {
  const [supportMessageState, setSupportMessageState] = useReducer(
    (state, action) => {
      return { ...state, [action.type]: action.payload };
    },
    {
      requestSupport: null,
      supporter: null,
      sender: null,
      loading: false,
      messages: [],
      fileList: [],
      openSupportChatbox: false,
      error: {
        message: "",
        fileList: "",
      },
      previewImage: "",
      previewVisible: false,
      previewTitle: "",
      previewOpen: false,
    }
  );
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    const isLt2M = file.size / 1024 / 1024 < 2;

    // Kiểm tra ảnh
    if (isImage) {
      if (!isLt2M) {
        setSupportMessageState({
          type: "error",
          payload: {
            ...supportMessageState.error,
            fileList: "Hình ảnh phải có dung lượng tối đa 2MB.",
          },
        });
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
            setSupportMessageState({
              type: "error",
              payload: {
                ...supportMessageState.error,
                fileList: "Video phải có thời lượng tối đa 5 phút.",
              },
            });
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
    setSupportMessageState({
      type: "error",
      payload: {
        ...supportMessageState.error,
        fileList: "Chỉ chấp nhận file ảnh hoặc video.",
      },
    });
    message.error("Chỉ chấp nhận file ảnh hoặc video.");
    return Upload.LIST_IGNORE;
  };

  const handleUploadFileListChange = ({ fileList: newFileList }) => {
    console.log("Updated fileList:", newFileList);
    setSupportMessageState({ type: "fileList", payload: newFileList });
  };
  const handleRemoveProductImage = (file) => {
    setSupportMessageState({
      type: "fileList",
      payload: supportMessageState.fileList.filter(
        (item) => item.uid !== file.uid
      ),
    });
  };
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setSupportMessageState({
      type: "previewImage",
      payload: file.url || file.preview,
    });
    setSupportMessageState({ type: "previewVisible", payload: true });
    setSupportMessageState({
      type: "previewTitle",
      payload: file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    });
    setSupportMessageState({ type: "previewOpen", payload: true });
  };
  const handleSendRequest = async (user_id) => {
    try {
      const res = await sendRequestSupport(user_id);
      if (res.success) {
        message.success("Gửi yêu cầu hỗ trợ thành công");
        localStorage.setItem("request_support_id", res.data.request_support_id);
        setSupportMessageState({ type: "requestSupport", payload: res.data });
      }
    } catch (error) {
      console.error("Error sending support request:", error);
      message.error("Đang gặp lỗi, vui lòng thử lại sau");
    }
  };

  const handleCloseRequest = async (request_support_id) => {
    try {
      const res = await closeRequest(request_support_id);
      if (res.success) {
        message.success("Đã đóng yêu cầu hỗ trợ");
      }
    } catch (error) {
      console.error("Error closing support request:", error);
      message.error("Đang gặp lỗi, vui lòng thử lại sau");
    }
  };

  const fetchSupportRequest = async (request_support_id) => {
    try {
      const res = await getRequestById(request_support_id);
      if (res.success) {
        console.log("Fetched support request:", res);
        setSupportMessageState({ type: "requestSupport", payload: res.data });
        setSupportMessageState({ type: "supporter", payload: res.supporter });
        setSupportMessageState({ type: "sender", payload: res.sender });
      }
    } catch (error) {
      console.error("Error fetching support request:", error);
      message.error("Đang gặp lỗi, vui lòng thử lại sau");
    }
  };
  useEffect(() => {
    const request_support_id = localStorage.getItem("request_support_id");
    if (request_support_id) {
      fetchSupportRequest(request_support_id);
    }
  }, []);
  return (
    <SupportMessageContext.Provider
      value={{
        supportMessageState,
        setSupportMessageState,
        handleUploadFileListChange,
        beforeUpload,
        handleRemoveProductImage,
        handlePreview,
        handleSendRequest,
        handleCloseRequest,
      }}
    >
      {children}
    </SupportMessageContext.Provider>
  );
};
export const useSupportMessage = () => {
  return useContext(SupportMessageContext);
};
