/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {
  useCallback,
  useState,
  memo,
  useEffect,
  useRef,
  lazy,
} from "react";
import withSuspense from "../../hooks/HOC/withSuspense";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import IconNotLogin from "../../assets/icon-not-login.png";
import { setOnlineUser, setSocketConnection } from "../../redux/userSlice";
const LeftChatBox = withSuspense(lazy(() => import("./LeftChatBox")));
const RightChatBox = withSuspense(lazy(() => import("./RightChatBox")));

const ChatBox = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const socketC = useSelector((state) => state?.user?.socketConnection);
  //States
  const [unseenMessagesCount, setUnseenMessagesCount] = useState(0);
  const [openChatBox, setOpenChatBox] = useState(false);
  const [expandChatBox, setExpandChatBox] = useState(true);
  const [selectedUserID, setSelectedUserID] = useState(null);
  const selectedUserRef = useRef();
  //Handler
  const handleOpenChatBox = useCallback(() => {
    setOpenChatBox((preve) => {
      return !preve;
    });
  }, []);
  const handleExpandChatBox = useCallback(() => {
    setExpandChatBox((preve) => {
      return !preve;
    });
  }, []);
  const handleUserSelected = useCallback(
    (userID) => {
      setSelectedUserID(userID);
    },
    [selectedUserID]
  );
  //Effects
  useEffect(() => {
    if (!user) return;
    const socketConnection = io(process.env.REACT_APP_BACKEND_URL, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });
    socketConnection.on("onlineUser", (data) => {
      console.log(data);
      dispatch(setOnlineUser(data));
    });

    dispatch(setSocketConnection(socketConnection));
    return () => {
      socketConnection.disconnect();
    };
  }, []);
  useEffect(() => {
    if (!socketC) return;
    console.log("Da ket noi socket");
    socketC.emit("count-unseen-messages", user._id);
    socketC.on("total-unseen-message", (data) => {
      setUnseenMessagesCount(data);
    });
  }, [socketC, user?._id]);
  return (
    <>
      <div className="fixed right-2 bottom-0 z-[99999] font-[400]">
        {/**Modal Chatbox*/}
        <div
          className={`${openChatBox ? `w-0 h-0 hidden` : `w-[100px] h-12`} ${
            user._id ? "fill-white bg-primary" : "fill-primary bg-transparent"
          }  items-center flex rounded-t-[4px] shadow-md  relative justify-center transform-cpu translate-x-0  transition-all duration-150 ease-out transform-origin-bottom-right`}
          onClick={handleOpenChatBox}
        >
          {user?._id && (
            <div className="total-unseen-messages bg-primary border border-solid border-white rounded-[9px] text-white text-xs h-[18px] overflow-hidden px-[5px] absolute -right-1 -top-[9px]">
              {unseenMessagesCount}
            </div>
          )}

          <i className="h-3 mr-2 opacity-100 w-6 pb-6">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M18 6.07a1 1 0 01.993.883L19 7.07v10.365a1 1 0 01-1.64.768l-1.6-1.333H6.42a1 1 0 01-.98-.8l-.016-.117-.149-1.783h9.292a1.8 1.8 0 001.776-1.508l.018-.154.494-6.438H18zm-2.78-4.5a1 1 0 011 1l-.003.077-.746 9.7a1 1 0 01-.997.923H4.24l-1.6 1.333a1 1 0 01-.5.222l-.14.01a1 1 0 01-.993-.883L1 13.835V2.57a1 1 0 011-1h13.22zm-4.638 5.082c-.223.222-.53.397-.903.526A4.61 4.61 0 018.2 7.42a4.61 4.61 0 01-1.48-.242c-.372-.129-.68-.304-.902-.526a.45.45 0 00-.636.636c.329.33.753.571 1.246.74A5.448 5.448 0 008.2 8.32c.51 0 1.126-.068 1.772-.291.493-.17.917-.412 1.246-.74a.45.45 0 00-.636-.637z"></path>
            </svg>
          </i>
          <i className="h-[22px] w-[44px]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 22">
              <path d="M9.286 6.001c1.161 0 2.276.365 3.164 1.033.092.064.137.107.252.194.09.085.158.064.203 0 .046-.043.182-.194.251-.26.182-.17.433-.43.752-.752a.445.445 0 00.159-.323c0-.172-.092-.3-.227-.365A7.517 7.517 0 009.286 4C5.278 4 2 7.077 2 10.885s3.256 6.885 7.286 6.885a7.49 7.49 0 004.508-1.484l.022-.043a.411.411 0 00.046-.71v-.022a25.083 25.083 0 00-.957-.946.156.156 0 00-.227 0c-.933.796-2.117 1.205-3.392 1.205-2.846 0-5.169-2.196-5.169-4.885C4.117 8.195 6.417 6 9.286 6zm32.27 9.998h-.736c-.69 0-1.247-.54-1.247-1.209v-3.715h1.96a.44.44 0 00.445-.433V9.347h-2.45V7.035c-.021-.043-.066-.065-.111-.043l-1.603.583a.423.423 0 00-.29.41v1.362h-1.781v1.295c0 .238.2.433.445.433h1.337v4.19c0 1.382 1.158 2.505 2.583 2.505H42v-1.339a.44.44 0 00-.445-.432zm-21.901-6.62c-.739 0-1.41.172-2.013.496V4.43a.44.44 0 00-.446-.43h-1.788v13.77h2.234v-4.303c0-1.076.895-1.936 2.013-1.936 1.117 0 2.01.86 2.01 1.936v4.239h2.234v-4.561l-.021-.043c-.202-2.088-2.012-3.723-4.223-3.723zm10.054 6.785c-1.475 0-2.681-1.12-2.681-2.525 0-1.383 1.206-2.524 2.681-2.524 1.476 0 2.682 1.12 2.682 2.524 0 1.405-1.206 2.525-2.682 2.525zm2.884-6.224v.603a4.786 4.786 0 00-2.985-1.035c-2.533 0-4.591 1.897-4.591 4.246 0 2.35 2.058 4.246 4.59 4.246 1.131 0 2.194-.388 2.986-1.035v.604c0 .237.203.431.453.431h1.356V9.508h-1.356c-.25 0-.453.173-.453.432z"></path>
            </svg>
          </i>
        </div>

        {/**Chatbox Window*/}
        <div
          className={`${
            openChatBox
              ? expandChatBox
                ? "w-[642px] h-[502px] border border-solid"
                : "w-[226px] h-[502px] border border-solid"
              : "w-0 h-0 border-0"
          } chat-box`}
        >
          {/**Top Chatbox*/}
          <div className="flex items-center shadow-sm h-10 justify-between w-full rounded-t-[4px] box-border">
            <div className="flex items-center justify-start px-3 fill-primary">
              <i className="h-[22px] w-[44px]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 22">
                  <path d="M9.286 6.001c1.161 0 2.276.365 3.164 1.033.092.064.137.107.252.194.09.085.158.064.203 0 .046-.043.182-.194.251-.26.182-.17.433-.43.752-.752a.445.445 0 00.159-.323c0-.172-.092-.3-.227-.365A7.517 7.517 0 009.286 4C5.278 4 2 7.077 2 10.885s3.256 6.885 7.286 6.885a7.49 7.49 0 004.508-1.484l.022-.043a.411.411 0 00.046-.71v-.022a25.083 25.083 0 00-.957-.946.156.156 0 00-.227 0c-.933.796-2.117 1.205-3.392 1.205-2.846 0-5.169-2.196-5.169-4.885C4.117 8.195 6.417 6 9.286 6zm32.27 9.998h-.736c-.69 0-1.247-.54-1.247-1.209v-3.715h1.96a.44.44 0 00.445-.433V9.347h-2.45V7.035c-.021-.043-.066-.065-.111-.043l-1.603.583a.423.423 0 00-.29.41v1.362h-1.781v1.295c0 .238.2.433.445.433h1.337v4.19c0 1.382 1.158 2.505 2.583 2.505H42v-1.339a.44.44 0 00-.445-.432zm-21.901-6.62c-.739 0-1.41.172-2.013.496V4.43a.44.44 0 00-.446-.43h-1.788v13.77h2.234v-4.303c0-1.076.895-1.936 2.013-1.936 1.117 0 2.01.86 2.01 1.936v4.239h2.234v-4.561l-.021-.043c-.202-2.088-2.012-3.723-4.223-3.723zm10.054 6.785c-1.475 0-2.681-1.12-2.681-2.525 0-1.383 1.206-2.524 2.681-2.524 1.476 0 2.682 1.12 2.682 2.524 0 1.405-1.206 2.525-2.682 2.525zm2.884-6.224v.603a4.786 4.786 0 00-2.985-1.035c-2.533 0-4.591 1.897-4.591 4.246 0 2.35 2.058 4.246 4.59 4.246 1.131 0 2.194-.388 2.986-1.035v.604c0 .237.203.431.453.431h1.356V9.508h-1.356c-.25 0-.453.173-.453.432z"></path>
                </svg>
              </i>
              {user?._id && (
                <div className="text-primary text-[12px] pl-2 pb-1 font-semibold">
                  ({unseenMessagesCount})
                </div>
              )}
            </div>
            <div className="flex items-center justify-end mr-3 fill-[#333]">
              <div
                className="btn-chatwindow btn-chat-minimize"
                onClick={handleExpandChatBox}
              >
                <i class="cursor-pointer size-4">
                  {!expandChatBox && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      class="chat-icon"
                    >
                      <path d="M14 1a1 1 0 011 1v12a1 1 0 01-1 1H9v-1h5V2H9V1h5zM2 13v1h1v1H2a1 1 0 01-.993-.883L1 14v-1h1zm6 1v1H4v-1h4zM2 3.999V12H1V3.999h1zm4.975 1.319a.5.5 0 01.707.707L5.707 8h4.621a.5.5 0 010 1h-4.62l1.974 1.975a.5.5 0 01-.707.707L4.146 8.854a.5.5 0 010-.708zM3 1v1H2v.999H1V2a1 1 0 01.883-.993L2 1h1zm5 0v1H4V1h4z"></path>
                    </svg>
                  )}
                  {expandChatBox && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      class="chat-icon"
                    >
                      <path d="M14 1a1 1 0 011 1v12a1 1 0 01-1 1H9v-1h5V2H9V1h5zM2 13v1h1v1H2a1 1 0 01-.993-.883L1 14v-1h1zm6 1v1H4v-1h4zM2 3.999V12H1V3.999h1zm5.854 1.319l2.828 2.828a.5.5 0 010 .708l-2.828 2.828a.5.5 0 11-.708-.707L9.121 9H4.5a.5.5 0 010-1h4.621L7.146 6.025a.5.5 0 11.708-.707zM3 1v1H2v.999H1V2a1 1 0 01.883-.993L2 1h1zm5 0v1H4V1h4z"></path>
                    </svg>
                  )}
                </i>
                <div className="arial-button arial-expand">
                  {expandChatBox ? "Ẩn Cửa Sổ Chat" : "Xem Cửa Sổ Chat"}
                </div>
              </div>
              <div
                className="btn-chatwindow btn-chat-close"
                onClick={handleOpenChatBox}
              >
                <i class="cursor-pointer size-4">
                  <svg
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                    class="chat-icon"
                  >
                    <path d="M14 1a1 1 0 011 1v12a1 1 0 01-1 1H2a1 1 0 01-1-1V2a1 1 0 011-1h12zm0 1H2v12h12V2zm-2.904 5.268l-2.828 2.828a.5.5 0 01-.707 0L4.732 7.268a.5.5 0 11.707-.707l2.475 2.475L10.39 6.56a.5.5 0 11.707.707z"></path>
                  </svg>
                </i>
                <div className="arial-button arial-close">Thu gọn</div>
              </div>
            </div>
          </div>
          {/**Chatbox Container*/}
          <div className="flex h-[460px] ">
            {!user?._id && (
              <div className="flex justify-center items-center w-full">
                <div className="flex flex-col justify-center items-center">
                  <img
                    src={IconNotLogin}
                    className="h-[80px] select-none w-[94px]"
                  />
                  <span className="text-[#333] text-base font-[500] text-center mx-[auto] mt-6 mb-4">
                    Oops, có lỗi xảy ra
                  </span>
                  <button
                    onClick={() => {
                      window.location.reload();
                    }}
                    className="bg-primary border border-solid border-[#e5e5e5] rounded box-border text-white cursor-pointer text-sm font-[500] h-8 relative transition-all duration-200 ease-in-out px-4"
                  >
                    Nhấn để tải lại
                  </button>
                </div>
              </div>
            )}
            {user?._id && (
              <>
                {/**Left-Chatbox */}
                <LeftChatBox
                  onUserSelected={handleUserSelected}
                  selectedUserRef={selectedUserID}
                />
                {/**Right-Chatbox */}
                <RightChatBox
                  expandChatBox={expandChatBox}
                  selectedUserID={selectedUserID}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(ChatBox);
