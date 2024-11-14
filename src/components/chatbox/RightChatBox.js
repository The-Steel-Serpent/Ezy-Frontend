import { DownOutlined } from "@ant-design/icons";
import { Divider, Dropdown, Image, Menu, Space, Spin, Switch } from "antd";
import React, {
  lazy,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import withSuspense from "../../hooks/HOC/withSuspense";
import { BiSend } from "react-icons/bi";
import { FaAngleRight, FaPlus } from "react-icons/fa6";
import { LuShoppingBag } from "react-icons/lu";
import { MdEventNote, MdOutlineEmojiEmotions } from "react-icons/md";
import { RiImage2Line, RiVideoLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useMessages } from "../../providers/MessagesProvider";
import {
  getUserInfo,
  markMessagesAsRead,
  sendMessage,
  subscribeToMessages,
  uploadFile,
} from "../../firebase/messageFirebase";
import toast from "react-hot-toast";
import { se } from "date-fns/locale";
import ModalReport from "../report-user/ModalReport";
const ImageChatbox = withSuspense(lazy(() => import("./ImageChatbox")));

const RightChatBox = (props) => {
  //Redux State
  const {
    state,
    selectedUserRef,
    cache,
    handleOpenModalReport,
    handleOnCloseModalReport,
  } = useMessages();
  const user = useSelector((state) => state?.user);
  const [dataUser, setDataUser] = useState(null);
  const [allMessage, setAllMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });

  //**Ref */
  const currMessage = useRef(null);
  const inputRef = useRef(null);
  const chatboxRef = useRef(null);
  const unsubscribeRef = useRef(null);
  const loadMoreRef = useRef(null);
  const selectedUserIDRef = useRef(state.selectedUserID);
  //Handlers
  const handleOnChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setMessage((preve) => {
        return {
          ...preve,
          text: value,
        };
      });
    },
    [message]
  );

  const handleUploadFiles = (filesArray) => {
    const files = Array.from(filesArray);
    const validFiles = [];
    console.log(files);

    const videoPromises = files.map((file) => {
      return new Promise((resolve) => {
        if (file.type.includes("image") && file.size <= 2 * 1024 * 1024) {
          validFiles.push(file);
          resolve(); // Hoàn thành kiểm tra file hình ảnh
        } else if (file.type.includes("video")) {
          const video = document.createElement("video");
          video.src = URL.createObjectURL(file);
          video.onloadedmetadata = () => {
            if (video.duration <= 5 * 60) {
              validFiles.push(file);
            } else {
              toast.error("Video phải có thời lượng tối đa 5 phút");
            }
            URL.revokeObjectURL(video.src); // Giải phóng bộ nhớ
            resolve(); // Hoàn thành kiểm tra file video
          };
        } else {
          toast.error("Hình ảnh phải có dung lượng tối đa 2MB.");
          resolve(); // Đảm bảo Promise luôn được hoàn thành
        }
      });
    });

    // Khi tất cả các Promise đã hoàn thành
    Promise.all(videoPromises).then(() => {
      setFiles((prevFile) => [...prevFile, ...validFiles]);
    });
  };
  const handleRemoveAllFiles = useCallback(() => {
    setFiles([]);
  }, []);

  const handleSendMessage = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const sendMessages = [];
        if (message.text.trim() !== "") {
          console.log("Gửi tin nhắn thành công");
          sendMessages.push(
            sendMessage(
              message.text,
              "",
              "",
              user?.user_id,
              state.selectedUserID
            )
          );
        }
        if (files.length > 0) {
          for (const file of files) {
            if (file.type.startsWith("image/")) {
              const imgUrl = await uploadFile(file, "image");
              sendMessages.push(
                sendMessage(
                  "",
                  "image",
                  imgUrl,
                  user?.user_id,
                  state.selectedUserID
                )
              );
              console.log("Gửi tin nhắn thành công");
            }
          }
        }

        if (files.length > 0) {
          for (const file of files) {
            if (file.type.startsWith("video/")) {
              const videoUrl = await uploadFile(file, "video");
              sendMessages.push(
                sendMessage(
                  "",
                  "video",
                  videoUrl,
                  user?.user_id,
                  state.selectedUserID
                )
              );
            }
          }
        }

        await Promise.all(sendMessages);
      } catch (error) {
        console.log("Gửi tin nhắn thất bại: ", error);
      } finally {
        setMessage({
          text: "",
        });

        setFiles([]);
      }
    },
    [files, message.text, state.selectedUserID, user?.user_id]
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
  const handleRemoveFile = useCallback((key) => {
    setFiles((prevFileList) =>
      prevFileList.filter((_, index) => index !== key)
    );
  }, []);
  const handleMessageClick = async () => {
    const unreadMessages = allMessage.filter((message) => !message.isRead);
    if (unreadMessages.length > 0) {
      const conversationIds = new Set(
        unreadMessages.map((message) => message.id)
      );
      await markMessagesAsRead(Array.from(conversationIds), user.user_id);
    }
  };
  const handleUploadFilesInput = (e) => {
    const { files } = e.target;
    handleUploadFiles(files);
    e.target.value = "";
  };
  const handlePaste = (e) => {
    const items = e.clipboardData.items;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file) {
          handleUploadFiles([file]);
        }
      }
    }
  };

  //********************* */
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const user = await getUserInfo(state.selectedUserID);
        setLoading(false);
        setDataUser(user);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    if (state.selectedUserID) {
      fetchUserData();
    } else {
      setDataUser(null);
    }
  }, [state.selectedUserID]);

  useEffect(() => {
    const initializeSubscription = async () => {
      const { unsubscribe, loadMore } = await subscribeToMessages(
        user?.user_id,
        state.selectedUserID,
        (newMessages) => {
          const isMessageFromSelectedUser = newMessages.every(
            (msg) =>
              (msg.sender_id === selectedUserIDRef.current &&
                msg.receiver_id === user?.user_id) ||
              (msg.receiver_id === selectedUserIDRef.current &&
                msg.sender_id === user?.user_id)
          );

          if (isMessageFromSelectedUser && Array.isArray(newMessages)) {
            setAllMessage((prevMessages) => {
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
        },
        (moreMessages) => {
          const isMoreMessagesFromSelectedUser = moreMessages.every(
            (msg) =>
              (msg.sender_id === selectedUserIDRef.current &&
                msg.receiver_id === user?.user_id) ||
              (msg.receiver_id === selectedUserIDRef.current &&
                msg.sender_id === user?.user_id)
          );
          if (isMoreMessagesFromSelectedUser && Array.isArray(moreMessages)) {
            setAllMessage((prevMessages) => [...moreMessages, ...prevMessages]);
          }
        }
      );

      unsubscribeRef.current = unsubscribe;
      loadMoreRef.current = loadMore;
    };

    if (
      user?.user_id &&
      state.selectedUserID &&
      state.openChatBox &&
      state.expandChatBox &&
      !unsubscribeRef.current
    ) {
      initializeSubscription();
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [user, state.selectedUserID, state.openChatBox, state.expandChatBox]);
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
  }, [allMessage]);
  useEffect(() => {
    selectedUserIDRef.current = state.selectedUserID;
    setAllMessage([]);
  }, [state.selectedUserID]);
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

  const conversationDropdownItems = (props) => (
    <Menu
      className="hover-dropdown"
      style={{ padding: "16px", width: "215px" }}
    >
      <Menu.Item style={{ padding: "0px" }}>
        <div className="flex justify-start items-center gap-3 cursor-default">
          <img className="size-8 rounded-full" src={props.img} />
          <span className="text-base">{props.name}</span>
        </div>
      </Menu.Item>
      <Menu.Item style={{ padding: "8px 0px", marginTop: "4px" }}>
        <div
          className="w-full flex justify-between items-center"
          onClick={handleOpenModalReport}
        >
          <span className="text-xs text-[#333]">Tố cáo người dùng</span>
          <FaAngleRight className="text-[#999]" />
        </div>
      </Menu.Item>
      <Menu.Item style={{ padding: "0px" }}>
        <Divider className="mt-2 mb-0" />
      </Menu.Item>
      <Menu.Item style={{ padding: "8px 0px" }}>
        <div
          className="w-full flex justify-between items-center"
          onClick={() => (window.location.href = `/shop/${props.username}`)}
        >
          <span className="text-xs text-[#333]">Xem thông tin cá nhân</span>
          <FaAngleRight className="text-[#999]" />
        </div>
      </Menu.Item>
    </Menu>
  );
  return (
    <>
      <div
        className={`${props.expandChatBox ? "" : "hidden"} right-chatbox `}
        ref={chatboxRef}
        onClick={user?.user_id && handleMessageClick}
      >
        {/**Primary Bg Content */}
        {!dataUser?.user_id && (
          <div className="w-full h-full bg-[#f3f3f3] flex justify-center items-center flex-col">
            <i
              class="h-[120px] w-[200px] inline-block"
              style={{ lineHeight: 0 }}
            >
              <svg
                width="200"
                height="120"
                viewBox="0 0 301 180"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.5 162C4.5 160.895 5.39543 160 6.5 160H282.5C283.605 160 284.5 160.895 284.5 162C284.5 163.105 283.605 164 282.5 164H6.5C5.39543 164 4.5 163.105 4.5 162Z"
                  fill="#666666"
                ></path>
                <path
                  d="M69.6355 28.0653C70.1235 21.8195 75.3341 17 81.5991 17H239.627C246.585 17 252.085 22.9 251.597 29.8417L243.5 145H60.5L69.6355 28.0653Z"
                  fill="#B7B7B7"
                ></path>
                <path
                  d="M78.2114 33.6879C78.3743 31.6062 80.1111 30 82.1992 30H237.212C239.531 30 241.363 31.9648 241.202 34.2776L233.5 145H69.5L78.2114 33.6879Z"
                  fill="white"
                ></path>
                <path
                  d="M56.5 148H243.5L243.171 149.973C242.207 155.759 237.201 160 231.334 160H56.5V148Z"
                  fill="#666666"
                ></path>
                <path
                  d="M27.5 150.4C27.5 149.075 28.5745 148 29.9 148H221.5C221.5 154.627 216.127 160 209.5 160H37.1C31.7981 160 27.5 155.702 27.5 150.4Z"
                  fill="#B7B7B7"
                ></path>
                <path
                  d="M96.5 148H152.5C152.5 151.866 149.366 155 145.5 155H103.5C99.634 155 96.5 151.866 96.5 148Z"
                  fill="#666666"
                ></path>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M98.0769 44C94.933 44 92.3223 46.4267 92.0929 49.5621L89.9709 78.5621C89.7165 82.039 92.4687 85 95.9549 85H176.923C180.067 85 182.677 82.5733 182.907 79.4379L185.029 50.4379C185.283 46.961 182.531 44 179.045 44H98.0769ZM103.5 59.5C103.5 58.6716 104.171 58 105 58H166C166.828 58 167.5 58.6716 167.5 59.5C167.5 60.3284 166.828 61 166 61H105C104.171 61 103.5 60.3284 103.5 59.5ZM102.5 69.5C102.5 68.6716 103.171 68 104 68H141C141.828 68 142.5 68.6716 142.5 69.5C142.5 70.3284 141.828 71 141 71H104C103.171 71 102.5 70.3284 102.5 69.5Z"
                  fill="#2673DD"
                ></path>
                <path
                  d="M90.5 98.5C90.5 97.6716 91.1716 97 92 97H167C167.828 97 168.5 97.6716 168.5 98.5C168.5 99.3284 167.828 100 167 100H92C91.1716 100 90.5 99.3284 90.5 98.5Z"
                  fill="#B7B7B7"
                ></path>
                <path
                  d="M89.5 108.5C89.5 107.672 90.1716 107 91 107H152C152.828 107 153.5 107.672 153.5 108.5C153.5 109.328 152.828 110 152 110H91C90.1716 110 89.5 109.328 89.5 108.5Z"
                  fill="#B7B7B7"
                ></path>
                <path
                  d="M90 117C89.1716 117 88.5 117.672 88.5 118.5C88.5 119.328 89.1716 120 90 120H118C118.828 120 119.5 119.328 119.5 118.5C119.5 117.672 118.828 117 118 117H90Z"
                  fill="#B7B7B7"
                ></path>
                <path
                  d="M202.239 80C198.129 80 194.688 83.1144 194.279 87.204L193.266 97.3377L184.954 100.455C184.273 100.71 184.084 101.584 184.598 102.098L192.045 109.545L190.879 121.204C190.408 125.913 194.107 130 198.839 130H264.614C268.785 130 272.256 126.796 272.589 122.638L275.309 88.638C275.681 83.983 272.004 80 267.334 80H202.239Z"
                  fill="#EE4D2D"
                ></path>
                <path
                  d="M218 104C218 106.209 216.209 108 214 108C211.791 108 210 106.209 210 104C210 101.791 211.791 100 214 100C216.209 100 218 101.791 218 104Z"
                  fill="white"
                ></path>
                <path
                  d="M235 104C235 106.209 233.209 108 231 108C228.791 108 227 106.209 227 104C227 101.791 228.791 100 231 100C233.209 100 235 101.791 235 104Z"
                  fill="white"
                ></path>
                <path
                  d="M249 108C251.209 108 253 106.209 253 104C253 101.791 251.209 100 249 100C246.791 100 245 101.791 245 104C245 106.209 246.791 108 249 108Z"
                  fill="white"
                ></path>
              </svg>
            </i>
            <div className="text-base mt-4 text-[#333] font-[500] my-2 select-none">
              Chào mừng bạn đến với Ezy Chat
            </div>
            <div>Bắt đầu trả lời người mua!</div>
          </div>
        )}

        {/**Conversation*/}
        {dataUser?.user_id && (
          <div className="conversation">
            <div className="flex justify-start items-center h-full pl-3">
              {dataUser.role_id === 2 ? (
                <>
                  <Dropdown
                    overlay={conversationDropdownItems({
                      name:
                        dataUser.role_id === 2
                          ? dataUser.Shop.shop_name
                          : dataUser.username,
                      img:
                        dataUser.role_id === 2
                          ? dataUser.Shop.logo_url
                          : dataUser.avatar,
                      username: dataUser.username,
                    })}
                    trigger={["click"]}
                  >
                    <a onClick={(e) => e.preventDefault()}>
                      <Space className="text-sm text-[#333] whitespace-nowrap text-ellipsis overflow-hidden max-w-[248px] ">
                        {dataUser.role_id === 2
                          ? dataUser.Shop.shop_name
                          : dataUser.username}
                        <DownOutlined className="text-[12px]" />
                      </Space>
                    </a>
                  </Dropdown>
                </>
              ) : (
                <span className="text-sm text-[#333] whitespace-nowrap text-ellipsis overflow-hidden max-w-[248px]">
                  {dataUser.role_id === 2
                    ? dataUser.Shop.shop_name
                    : dataUser.username}
                </span>
              )}
            </div>
            <div className="flex flex-col w-full relative">
              <div className="bg-[#f3f3f3] min-w-[6px] flex-1 border-t-[1px] border-solid border-[eee]">
                <div className="flex size-full flex-col">
                  <div
                    className={`${
                      files.length === 0 ? "h-[330px]" : "h-[266px]"
                    }`}
                  >
                    <div
                      className={`w-full max-h-full overflow-y-auto custom-scrollbar`}
                      onScroll={handleScroll}
                    >
                      {loading && (
                        <div className="w-full h-full flex justify-center items-center ">
                          <Spin className="text-primary" />
                        </div>
                      )}
                      {allMessage?.map((message) => {
                        return (
                          <div
                            className={`message-container ${
                              user?.user_id === message.sender_id
                                ? "sender"
                                : "receiver"
                            }`}
                            key={message.id}
                            id={message.id}
                          >
                            <div className="message">
                              {message.text && <span>{message?.text}</span>}
                              {message.mediaUrl &&
                                message.mediaType === "image" && (
                                  <Image
                                    src={message.mediaUrl}
                                    className="size-32"
                                  />
                                )}
                              {message.mediaUrl &&
                                message.mediaType === "video" && (
                                  <video
                                    src={message.mediaUrl}
                                    controls
                                    className="size-32"
                                  />
                                )}
                              <span className="text-[#666] text-xs text-end static mt-1">
                                {handleFormatTime(message?.createdAt)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              {files.length > 0 && (
                <section className="static w-full h-16 flex bg-white border-t-[1px] border-solid border-[#e4e6e8] box-border ">
                  <div className="ml-[9px] flex flex-auto py-[9px] overflow-y-hidden box-border h-16 custom-scrollbar-x">
                    <div className="inline-flex items-center gap-[10px]">
                      <ImageChatbox
                        loading={loading}
                        setLoading={setLoading}
                        files={files}
                        handleRemoveFile={handleRemoveFile}
                      />
                      <label
                        className="size-[46px] border border-solid rounded border-[#eff2f4] flex justify-center items-center cursor-pointer"
                        title="Thêm hình ảnh/ video"
                      >
                        <input
                          accept="video/*,.flv,.3gp,.rm,.rmvb,.asf,.mp4,.webm,image/png,image/jpeg,image/jpg"
                          multiple
                          type="file"
                          className="hidden"
                          onChange={handleUploadFilesInput}
                        />
                        <FaPlus className="text-[#a09e9e]" size={12} />
                      </label>
                    </div>
                  </div>
                  <div
                    className="w-6 h-16 flex flex-col items-center flex-shrink-0 flex-grow-0 text-[#a09e9e] pt-1"
                    style={{ flexBasis: "auto" }}
                  >
                    <IoClose size={17} onClick={handleRemoveAllFiles} />
                  </div>
                </section>
              )}
              <div className="min-h-[88px] border-t-[1px] border-sold border-[#e4e6e8] w-full z-[11]">
                <div className="size-full box-border relative">
                  <div className="h-[88px] bg-white relative">
                    <div className="h-full flex flex-col justify-end">
                      <form
                        className="flex-1 overflow-y-auto p-2"
                        onSubmit={handleSendMessage}
                      >
                        <div className="flex flex-col w-full h-full">
                          <input
                            className="w-full flex-grow text-[#333] text-sm resize-none border-none outline-none box-border overflow-y-auto"
                            style={{ wordBreak: "break-word" }}
                            placeholder="Nhập nội dung tin nhắn"
                            onChange={handleOnChange}
                            value={message.text}
                            onPaste={handlePaste}
                            onFocus={handleMessageClick}
                          />
                        </div>
                        <div className="absolute right-2 bottom-[10px]">
                          <button
                            className={`${
                              message.text || message.imgUrl || message.videoUrl
                                ? "text-[#ee4d2d]"
                                : "text-[#ccc] pointer-events-none cursor-not-allowed"
                            } size-[18px]  transition-colors duration-200 ease-in`}
                            type="submit"
                            ref={inputRef}
                            onSubmit={handleSendMessage}
                          >
                            <BiSend size={18} />
                          </button>
                        </div>
                      </form>
                      <div className="w-full h-[30px]">
                        <div className="flex h-full flex-row box-border flex-nowrap justify-between bg-white pb-[6px] pl-2">
                          <div className="flex flex-nowrap justify-start">
                            <div
                              className="flex justify-center items-center size-18 mr-2 transition-colors duration-200 text-[#8ea4d1] "
                              title="Hình ảnh"
                            >
                              <label>
                                <input
                                  type="file"
                                  className="hidden"
                                  id="uploadImage"
                                  name="uploadImage"
                                  onChange={handleUploadFilesInput}
                                  multiple
                                />
                                <RiImage2Line
                                  className="cursor-pointer"
                                  size={18}
                                />
                              </label>
                            </div>
                            <div
                              className="flex justify-center items-center size-18 mr-2 transition-colors duration-200 text-[#8ea4d1] "
                              title="Video"
                            >
                              <label>
                                <input
                                  type="file"
                                  className="hidden"
                                  id="uploadVideo"
                                  name="uploadVideo"
                                  onChange={handleUploadFilesInput}
                                  multiple
                                />
                                <RiVideoLine
                                  className="cursor-pointer"
                                  size={18}
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {dataUser?.user_id && (
        <ModalReport
          openModal={state.openModalReport}
          onCloseModal={handleOnCloseModalReport}
          userId={state.selectedUserID}
          type={dataUser?.role_id === 2 ? "shop" : "user"}
        />
      )}
    </>
  );
};

export default memo(RightChatBox);
