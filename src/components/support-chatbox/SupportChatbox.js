import {
  CloseCircleFilled,
  CloseOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Form,
  Image,
  Input,
  message,
  Modal,
  Upload,
} from "antd";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { FaImage } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { useSupportMessage } from "../../providers/SupportMessagesProvider";
import { RiImageAddFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import {
  sendMessage,
  subscribeToMessages,
  uploadFile,
} from "../../firebase/messageFirebase";
import { getRequestById } from "../../services/requestSupportService";
import {
  setAcceptRequest,
  setSupportMessageState,
} from "../../redux/supportMessageSlice";

const SupportChatbox = () => {
  const {
    fileList,
    setFileList,
    handleUploadFileListChange,
    beforeUpload,
    handleRemoveProductImage,
    handlePreview,
    handleSendRequest,
    handleCloseRequest,
    // handleOnMessageChange,
    handlePaste,
  } = useSupportMessage();

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  const user = useSelector((state) => state.user);
  const supportMessageState = useSelector((state) => state.supportMessage);
  const dispatch = useDispatch();
  const currMessage = useRef(null);
  const unsubscribeRef = useRef(null);
  const loadMoreRef = useRef(null);
  const selectedUserIDRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    selectedUserIDRef.current = supportMessageState.selectedUserID;
    console.log("selectedUserIDRef.current: ", selectedUserIDRef.current);
    console.log(
      "supportMessageState.selectedUserID: ",
      supportMessageState.selectedUserID
    );
  }, [supportMessageState.selectedUserID]);

  useEffect(() => {
    if (supportMessageState.isClosed) {
      setMessages([]);
      console.log(supportMessageState.selectedUserID);
      console.log("Hủy rồi nè: ");
    }
  }, [supportMessageState.isClosed]);

  useEffect(() => {
    const initializeSubscription = async () => {
      const { unsubscribe, loadMore } = await subscribeToMessages(
        user?.user_id,
        selectedUserIDRef.current,
        (newMessages) => {
          if (Array.isArray(newMessages) && newMessages.length > 0) {
            const isMessageFromSelectedUser = newMessages.every(
              (msg) =>
                (msg?.sender_id === selectedUserIDRef.current &&
                  msg?.receiver_id === user?.user_id) ||
                (msg?.receiver_id === selectedUserIDRef.current &&
                  msg?.sender_id === user?.user_id)
            );

            if (isMessageFromSelectedUser) {
              setMessages((prevMessages) => {
                const existingMessageIds = new Set(
                  prevMessages.map((msg) => msg.id)
                );
                const uniqueNewMessages = newMessages.filter(
                  (msg) =>
                    !existingMessageIds.has(msg.id) && msg.createdAt !== null
                );

                if (uniqueNewMessages.length > 0) {
                  currMessage.current = uniqueNewMessages[0]?.id;
                  return [...prevMessages, ...uniqueNewMessages];
                }

                return prevMessages;
              });
            }
          }
        },
        (moreMessages) => {
          if (Array.isArray(moreMessages) && moreMessages.length > 0) {
            const isMoreMessagesFromSelectedUser = moreMessages.every(
              (msg) =>
                (msg?.sender_id === selectedUserIDRef.current &&
                  msg?.receiver_id === user?.user_id) ||
                (msg?.receiver_id === selectedUserIDRef.current &&
                  msg?.sender_id === user?.user_id)
            );
            if (isMoreMessagesFromSelectedUser) {
              setMessages((prevMessages) => [...moreMessages, ...prevMessages]);
            }
          }
        }
      );

      unsubscribeRef.current = unsubscribe;
      loadMoreRef.current = loadMore;
    };

    if (
      supportMessageState.openSupportChatbox &&
      user?.user_id !== "" &&
      !unsubscribeRef.current &&
      selectedUserIDRef.current !== null
    ) {
      initializeSubscription();
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [
    selectedUserIDRef,
    supportMessageState.selectedUserID,
    supportMessageState.openSupportChatbox,
    user?.user_id,
  ]);

  useEffect(() => {
    if (currMessage.current) {
      const element = document.getElementById(currMessage.current);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }
  }, [messages]);

  const fetchSupportRequest = useCallback(
    async (request_support_id) => {
      try {
        const res = await getRequestById(request_support_id);
        if (res.success) {
          dispatch(
            setAcceptRequest({
              selectedUserID:
                user?.role_id === 1 || user?.role_id === 2
                  ? res.supporter?.user_id
                  : res.sender?.user_id,
              requestSupport: res.data,
              sender: res.sender,
              supporter: res.supporter,
            })
          );
          // setSupportMessageState({ type: "requestSupport", payload: res.data });
          // setSupportMessageState({ type: "supporter", payload: res.supporter });
          // setSupportMessageState({ type: "sender", payload: res.sender });

          // setSelectedUserID(

          // );
        }
      } catch (error) {
        console.error("Error fetching support request:", error);
        message.error("Đang gặp lỗi, vui lòng thử lại sau");
      }
    },
    [dispatch, user?.role_id]
  );

  useEffect(() => {
    const request_support_id = localStorage.getItem("request_support_id");
    if (request_support_id) {
      fetchSupportRequest(request_support_id);
    }
  }, [fetchSupportRequest]);

  const handleOnMessageChange = useCallback((e) => {
    setMessageText(e.target.value);
  }, []);
  const handleScroll = async (e) => {
    const { scrollTop } = e.target;

    if (
      scrollTop === 0 &&
      !loading &&
      typeof loadMoreRef.current === "function"
    ) {
      setLoading(true);
      try {
        await loadMoreRef.current();
      } catch (error) {
        console.error("Error loading more messages:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSendMessage = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const sendMessages = [];
        if (messageText.trim() !== "") {
          console.log("Gửi tin nhắn thành công");
          sendMessages.push(
            sendMessage(
              messageText.trim(),
              "",
              "",
              user?.user_id,
              selectedUserIDRef.current,
              "support"
            )
          );
        }
        if (fileList.length > 0) {
          for (const file of fileList) {
            if (file && file.originFileObj.type.startsWith("image/")) {
              console.log("file: ", file);
              const imgUrl = await uploadFile(file.originFileObj, "image");
              sendMessages.push(
                sendMessage(
                  "",
                  "image",
                  imgUrl,
                  user?.user_id,
                  selectedUserIDRef.current,
                  "support"
                )
              );
              console.log("Gửi tin nhắn thành công");
            }
          }
        }

        if (fileList.length > 0) {
          for (const file of fileList) {
            if (file && file.originFileObj.type.startsWith("video/")) {
              const videoUrl = await uploadFile(file.originFileObj, "video");
              sendMessages.push(
                sendMessage(
                  "",
                  "video",
                  videoUrl,
                  user?.user_id,
                  selectedUserIDRef.current,
                  "support"
                )
              );
            }
          }
        }

        await Promise.all(sendMessages);
      } catch (error) {
        console.log("Gửi tin nhắn thất bại: ", error);
      } finally {
        setMessageText("");
        setFileList([]);
      }
    },
    [dispatch, fileList, messageText, user?.user_id]
  );

  const handleFormatTime = useCallback((time) => {
    if (!time || !time.seconds || !time.nanoseconds) {
      return ""; // Hoặc giá trị mặc định khác nếu muốn
    }
    const date = new Date(time.seconds * 1000 + time.nanoseconds / 1000000);

    const now = new Date(); // Ngày giờ hiện tại
    let hours = date.getHours();
    let minutes = date.getMinutes();
    hours = hours.toString().padStart(2, "0");
    minutes = minutes.toString().padStart(2, "0");
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) {
      return `${hours}:${minutes}`;
    } else {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
      const year = date.getFullYear();
      return `${hours}:${minutes} ${day}/${month}/${year}`;
    }
  }, []);

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
            dispatch(
              setSupportMessageState({
                openSupportChatbox: !supportMessageState.openSupportChatbox,
              })
            )
          }
        />
      </div>
      <div className="w-full h-[420px] relative">
        <div
          className={`${
            fileList.length === 0 ? "h-full" : "h-[266px]"
          } overflow-y-auto flex flex-col gap-2 p-5`}
          onScroll={handleScroll}
        >
          {loading && <div>Loading...</div>}
          {Array.isArray(messages) &&
            messages?.map((message, index) => (
              <div
                className={`flex ${
                  user?.user_id === message.sender_id
                    ? "justify-end"
                    : "justify-start"
                } `}
                key={message.id}
                id={message.id}
              >
                <div
                  className={`p-2 max-w-[400px] rounded  break-words flex flex-col gap-2 ${
                    user?.user_id === message.sender_id
                      ? "justify-start bg-third"
                      : "justify-end bg-slate-100"
                  }`}
                >
                  <span className="text-primary font-semibold">
                    {user?.user_id === message.sender_id
                      ? "Bạn"
                      : user?.user_id !== message.sender_id &&
                        (user?.role_id === 1 || user?.role_id === 2)
                      ? `Nhân viên ${supportMessageState?.supporter?.full_name
                          ?.split(" ")
                          .pop()}`
                      : `Khách hàng ${supportMessageState?.sender?.full_name}`}
                  </span>
                  {message.text && <span>{message.text}</span>}
                  {message.mediaUrl && message.mediaType === "image" && (
                    <Image src={message.mediaUrl} className="size-32" />
                  )}
                  {message.mediaUrl && message.mediaType === "video" && (
                    <video
                      src={message.mediaUrl}
                      controls
                      className="size-32"
                    />
                  )}
                  <span className="text-neutral-500">
                    {" "}
                    {handleFormatTime(message?.createdAt)}
                  </span>
                </div>
              </div>
            ))}
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
          (user?.role_id === 1 || user?.role_id === 2) && (
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

        {fileList.length > 0 && (
          <section className="static w-full h-16 pt-2 flex bg-white border-t-[1px] border-solid border-[#e4e6e8] box-border ">
            <Upload
              listType="picture-card"
              maxCount={6}
              fileList={fileList}
              onChange={handleUploadFileListChange}
              onPreview={handlePreview}
              beforeUpload={beforeUpload}
              onRemove={handleRemoveProductImage}
              className="custom-upload"
              accept="image/*,video/*"
            >
              {fileList.length < 6 && (
                <div className="flex flex-col items-center">
                  <RiImageAddFill size={20} color="#EE4D2D" />
                  <div className="text-[#EE4D2D]">
                    Thêm hình ảnh {fileList.length}/6
                  </div>
                </div>
              )}
            </Upload>
            {supportMessageState.previewImage && (
              <Image
                wrapperStyle={{
                  display: "none",
                }}
                preview={{
                  visible: supportMessageState.previewOpen,
                  onVisibleChange: (visible) =>
                    dispatch(
                      setSupportMessageState({
                        previewOpen: visible,
                      })
                    ),
                  afterOpenChange: (visible) =>
                    !visible &&
                    dispatch(
                      setSupportMessageState({
                        previewImage: "",
                      })
                    ),
                }}
                src={supportMessageState.previewImage}
              />
            )}
          </section>
        )}
      </div>
      <div className="flex gap-2 items-center">
        <div className="flex justify-center items-center gap-3 text-primary">
          <Upload
            beforeUpload={beforeUpload}
            fileList={fileList}
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
            fileList={fileList}
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
        <form className="w-full flex gap-2" onSubmit={handleSendMessage}>
          <Input
            className="rounded-full"
            placeholder="Nhập vào tin nhắn"
            onChange={handleOnMessageChange}
            onPaste={handlePaste}
            onSubmit={handleSendMessage}
            value={messageText}
            disabled={supportMessageState.requestSupport?.status === "waiting"}
          />
          <Button
            className="flex justify-center items-center text-primary rounded-full w-fit"
            htmlType="submit"
            onSubmit={handleSendMessage}
            disabled={
              supportMessageState.requestSupport?.status === "waiting"
              // ||
              // message.trim() === "" ||
              // fileList.length === 0
            }
          >
            <IoMdSend
              size={27}
              className="hover:rounded-full p-1 hover:bg-primary hover:text-white"
            />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default memo(SupportChatbox);
