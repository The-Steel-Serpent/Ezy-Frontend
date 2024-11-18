import {
  CloseCircleFilled,
  CloseOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Input, Modal, Upload } from "antd";
import React, { memo, useEffect } from "react";
import { FaImage } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { useSupportMessage } from "../../providers/SupportMessagesProvider";
import { RiImageAddFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const SupportChatbox = () => {
  const {
    supportMessageState,
    setSupportMessageState,
    handleUploadFileListChange,
    beforeUpload,
    handleRemoveProductImage,
    handlePreview,
    handleSendRequest,
    handleCloseRequest,
  } = useSupportMessage();

  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (!user.user_id || user.user_id === "") {
      return;
    }
    const socket = io.connect(process.env.REACT_APP_BACKEND_URL, {
      query: { user_id: user.user_id },
    });

    socket.on("supportRequestAccepted", (data) => {
      console.log("support data: ", data);
      localStorage.setItem(
        "request_support_id",
        data.requestSupport.request_support_id
      );
      setSupportMessageState({
        type: "requestSupport",
        payload: data.requestSupport,
      });
      setSupportMessageState({ type: "sender", payload: data.sender });
      setSupportMessageState({ type: "supporter", payload: data.supporter });
    });
    socket.on("supportRequestClosed", (data) => {
      console.log(data);
      localStorage.removeItem("request_support_id");
      setSupportMessageState({
        type: "requestSupport",
        payload: null,
      });
      setSupportMessageState({ type: "sender", payload: null });
      setSupportMessageState({ type: "supporter", payload: null });
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return (
    <div className="w-[700px] h-[572px] z-[999999999]">
      <div className="w-full p-5 border-b-[1px] rounded flex justify-between items-center">
        <div className="gap-2 flex items-center">
          <Avatar
            className="bg-primary"
            size={50}
            icon={<UserOutlined className="text-white" />}
          />
          <span className="text-lg font-semibold">Hỗ trợ trực tuyến</span>
        </div>
        <CloseOutlined
          className="text-[26px] cursor-pointer"
          onClick={() =>
            setSupportMessageState({
              type: "openSupportChatbox",
              payload: !supportMessageState.openSupportChatbox,
            })
          }
        />
      </div>
      <div className="w-full h-[420px] relative">
        <div
          className={`${
            supportMessageState.fileList.length === 0 ? "h-full" : "h-[266px]"
          } overflow-y-auto flex flex-col gap-2 p-5`}
        >
          <div className="flex justify-end">
            <div className="bg-third p-2 rounded max-w-[400px] justify-start break-words flex flex-col gap-2">
              <div className="text-primary font-semibold">Bạn</div>
              <span className="">
                Heheeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
              </span>
              <span className="text-neutral-500">18:48 04/11/2024</span>
            </div>
          </div>
          <div className="flex justify-start">
            <div className="bg-slate-100 w-fit p-2 rounded flex justify-end flex-col  max-w-[400px] break-words">
              <span className="text-primary font-semibold">
                Nhân viên{" "}
                {supportMessageState?.supporter?.full_name?.split(" ").pop()}
              </span>
              <span>Hehe</span>
              <span className="text-neutral-500">18:48 04/11/2024</span>
            </div>
          </div>
        </div>
        {supportMessageState.requestSupport?.status === "processing" && (
          <Button
            className="absolute bottom-3 left-[42%] rounded-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            onClick={() =>
              handleCloseRequest(
                supportMessageState.requestSupport?.request_support_id
              )
            }
          >
            Kết thúc trò chuyện
          </Button>
        )}
        {supportMessageState.requestSupport?.status !== "processing" &&
          user?.role_id === 1 && (
            <Button
              className="absolute bottom-3 left-[42%] rounded-full"
              onClick={() => handleSendRequest(user.user_id)}
              loading={supportMessageState.requestSupport?.status === "waiting"}
            >
              {supportMessageState.requestSupport?.status === "waiting"
                ? "Đang chờ..."
                : supportMessageState.requestSupport?.status === "processing"
                ? "Kết thúc trò chuyện"
                : "Gửi yêu cầu hỗ trợ"}
            </Button>
          )}

        {supportMessageState.fileList.length > 0 && (
          <section className="static w-full h-16 pt-2 flex bg-white border-t-[1px] border-solid border-[#e4e6e8] box-border ">
            <Upload
              listType="picture-card"
              maxCount={6}
              fileList={supportMessageState.fileList}
              onChange={handleUploadFileListChange}
              onPreview={handlePreview}
              beforeUpload={beforeUpload}
              onRemove={handleRemoveProductImage}
              className="custom-upload"
              accept="image/*,video/*"
            >
              {supportMessageState.fileList.length < 6 && (
                <div className="flex flex-col items-center">
                  <RiImageAddFill size={20} color="#EE4D2D" />
                  <div className="text-[#EE4D2D]">
                    Thêm hình ảnh {supportMessageState.fileList.length}/6
                  </div>
                </div>
              )}
            </Upload>
          </section>
        )}
      </div>
      <div className="flex gap-2">
        <div className="flex justify-center items-center gap-3 text-primary">
          <Upload
            beforeUpload={beforeUpload}
            fileList={supportMessageState.fileList}
            onChange={handleUploadFileListChange}
            onRemove={handleRemoveProductImage}
            showUploadList={false}
            accept="image/*"
          >
            <FaImage
              size={27}
              className="hover:rounded-full p-1 hover:bg-primary hover:text-white cursor-pointer"
            />
          </Upload>
          <Upload
            beforeUpload={beforeUpload}
            onChange={handleUploadFileListChange}
            fileList={supportMessageState.fileList}
            onRemove={handleRemoveProductImage}
            showUploadList={false}
            accept="video/*"
          >
            <FaVideo
              size={27}
              className="hover:rounded-full p-1 hover:bg-primary hover:text-white cursor-pointer"
            />
          </Upload>
        </div>
        <Input className="rounded-full" placeholder="Nhập vào tin nhắn" />
        <div className="flex justify-center items-center text-primary">
          <IoMdSend
            size={27}
            className="hover:rounded-full p-1 hover:bg-primary hover:text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default memo(SupportChatbox);
