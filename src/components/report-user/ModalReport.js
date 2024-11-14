import { Button, Image, message, Modal, Radio, Upload } from "antd";
import React, { memo, useCallback, useEffect, useReducer } from "react";
import {
  getViolationTypes,
  sendViolation,
} from "../../services/violationServices";
import TextArea from "antd/es/input/TextArea";
import { set } from "lodash";
import { PlusOutlined } from "@ant-design/icons";
import { RiImageAddFill } from "react-icons/ri";
import uploadFile from "../../helpers/uploadFile";
import { ca } from "date-fns/locale";
import { useSelector } from "react-redux";

const ModalReport = (props) => {
  const { openModal, onCloseModal, userId, type } = props;
  const user = useSelector((state) => state.user);
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      return { ...state, [action.type]: action.payload };
    },
    {
      loading: false,
      violationTypes: [],
      selectedViolationType: null,
      notes: "",
      error: {
        selectedViolationType: "",
        notes: "",
        imgList: "",
      },
      imgList: [],
      previewOpen: false,
      previewImage: "",
      previewVisible: false,
      previewTitle: "",
    }
  );
  const handleCloseModal = () => {
    onCloseModal();
    setLocalState({ type: "selectedViolationType", payload: null });
    setLocalState({ type: "notes", payload: "" });
    setLocalState({ type: "imgList", payload: [] });
    setLocalState({
      type: "error",
      payload: { selectedViolationType: "", notes: "", imgList: "" },
    });
  };

  const handleOnViolationTypeChange = useCallback((e) => {
    const value = e.target.value;
    setLocalState({ type: "selectedViolationType", payload: value });
  }, []);

  const handleOnNotesChange = useCallback((e) => {
    const value = e.target.value;
    setLocalState({ type: "notes", payload: value });
  }, []);

  const handleUploadImgListChange = ({ fileList: newFileList }) => {
    setLocalState({ type: "imgList", payload: newFileList });
  };
  const handlePreview = async (file) => {
    setLocalState({ type: "previewImage", payload: file.url || file.thumbUrl });
    setLocalState({ type: "previewVisible", payload: true });
    setLocalState({
      type: "previewTitle",
      payload: file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    });
    setLocalState({ type: "previewOpen", payload: true });
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isImage) {
      setLocalState({
        type: "error",
        payload: {
          ...localState.error,
          imgList: "Chỉ chấp nhận file ảnh",
        },
      });
      return Upload.LIST_IGNORE;
    }
    if (!isLt2M) {
      setLocalState({
        type: "error",
        payload: {
          ...localState.error,
          imgList: "Kích thước vượt quá 2MB",
        },
      });
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const handleRemoveProductImage = (file) => {
    setLocalState({
      type: "SET_FILE_LIST_PRODUCT",
      payload: localState.imgList.filter((item) => item.uid !== file.uid),
    });
  };

  useEffect(() => {
    const fetchViolationTypes = async () => {
      try {
        const res = await getViolationTypes(type);
        if (res.success) {
          setLocalState({ type: "violationTypes", payload: res.data });
        }
      } catch (error) {
        console.error("Error fetching violation types:", error);
      }
    };
    if (openModal) {
      fetchViolationTypes();
    }
  }, [openModal]);

  const validateForm = () => {
    const localError = {
      selectedViolationType: "",
      notes: "",
      imgList: "",
    };
    if (localState.selectedViolationType === null) {
      localError.selectedViolationType = "Vui lòng chọn lý do tố cáo";
    }
    if (localState.notes.length === 0) {
      localError.notes = "Vui lòng nhập mô tả vấn đề";
    } else if (localState.notes.length > 255) {
      localError.notes = "Mô tả không được vượt quá 255 ký tự";
    }
    if (localState.imgList.length === 0) {
      localError.imgList = "Vui lòng tải lên ít nhất 1 hình ảnh";
    }
    const hasError = Object.values(localError).some(
      (error) => error.length > 0
    );
    if (hasError) {
      setLocalState({ type: "error", payload: localError });
      return false;
    }
    return true;
  };

  const handleOnSubmit = async () => {
    try {
      const isValid = validateForm();
      if (!isValid) return;
      const uploadPromises = localState.imgList.map((file) =>
        uploadFile(file.originFileObj, "report-violations")
      );
      const uploadedImages = await Promise.all(uploadPromises);
      const data = {
        user_id: userId,
        sender_id: user.user_id,
        violation_type_id: localState.selectedViolationType,
        notes: localState.notes,
        imgs: uploadedImages.map((image) => image.url),
      };
      console.log("Data to send: ", data);
      const res = await sendViolation(data);
      if (res.success) {
        message.success("Tố cáo đã được gửi thành công");
        handleCloseModal();
      }
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại sau");
    }
  };

  return (
    <Modal
      width={800}
      title={`Tố Cáo ${type === "shop" ? "Cửa Hàng" : "Người Dùng"}`}
      open={openModal}
      onClose={handleCloseModal}
      onCancel={handleCloseModal}
      footer={
        <div className="w-full flex justify-end items-center">
          <Button
            size="large"
            className="bg-primary text-white hover:opacity-80"
            onClick={handleOnSubmit}
          >
            Tố Cáo
          </Button>
        </div>
      }
    >
      <div className="w-full flex flex-col gap-3 pb-3">
        <div className="flex flex-col gap-2">
          <span className="text-lg font-semibold text-neutral-500">
            Lý do:{" "}
          </span>
          <Radio.Group
            className="flex flex-col justify-start items-start"
            onChange={handleOnViolationTypeChange}
            value={localState.selectedViolationType}
          >
            {localState.violationTypes.map((violationType) => (
              <Radio value={violationType.violation_type_id}>
                {violationType.violation_name}
              </Radio>
            ))}
          </Radio.Group>
          <span className="text-red-500">
            {localState.error.selectedViolationType}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-lg font-semibold text-neutral-500">
            Mô tả (bắt buộc):{" "}
          </span>
          <TextArea
            autoSize={{
              minRows: 8,
              maxRows: 12,
            }}
            value={localState.notes}
            onChange={handleOnNotesChange}
            count={{
              show: true,
              max: 255,
            }}
            className="text-base"
            placeholder="Vui lòng nêu rõ vấn đề bạn gặp phải với lý do đã chọn"
          />
          <span className="text-red-500">{localState.error.notes}</span>
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-lg font-semibold text-neutral-500">
            Hình ảnh minh chứng (bắt buộc):{" "}
          </span>
          <div>
            <Upload
              listType="picture-card"
              maxCount={6}
              fileList={localState.imgList}
              onChange={handleUploadImgListChange}
              onPreview={handlePreview}
              beforeUpload={beforeUpload}
              onRemove={handleRemoveProductImage}
              className="custom-upload"
            >
              {localState.imgList.length < 5 && (
                <div className="flex flex-col items-center">
                  <RiImageAddFill size={20} color="#EE4D2D" />
                  <div className="text-[#EE4D2D]">
                    Thêm hình ảnh {localState.imgList.length}/6
                  </div>
                </div>
              )}
            </Upload>

            {localState.previewImage && (
              <Image
                wrapperStyle={{
                  display: "none",
                }}
                preview={{
                  visible: localState.previewOpen,
                  onVisibleChange: (visible) =>
                    setLocalState({ type: "previewOpen", payload: visible }),
                  afterOpenChange: (visible) =>
                    !visible &&
                    setLocalState({ type: "previewImage", payload: "" }),
                }}
                src={localState.previewImage}
              />
            )}
            <span className="text-red-500">{localState.error.imgList}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default memo(ModalReport);
