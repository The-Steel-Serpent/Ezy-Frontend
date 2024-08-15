/* eslint-disable jsx-a11y/anchor-is-valid */
import { Input, Dropdown, Space } from "antd";
import React, { useCallback, useState, memo } from "react";
import { DownOutlined, SearchOutlined } from "@ant-design/icons";
const items = [
  {
    label: "Tất cả",
    key: "0",
  },
  {
    label: "Chưa đọc",
    key: "1",
  },
  {
    label: "Đã Ghim",
    key: "3",
  },
];
const ChatBox = () => {
  const [openChatBox, setOpenChatBox] = useState(false);
  const [expandChatBox, setExpandChatBox] = useState(true);
  const [selectedDropdownSortByLabel, setSelectedDropdownSortByLabel] =
    useState("Tất cả");
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
  const handleSelectedDropdownSortByLabel = useCallback(
    (e) => {
      const label = e.domEvent.target.innerText;
      setSelectedDropdownSortByLabel(label);
    },
    [items]
  );
  return (
    <div className="fixed right-2 bottom-0 z-[99999] font-[400]">
      {/**Modal Chatbox*/}
      <div
        className={`${
          openChatBox ? `w-0 h-0 hidden` : `w-[100px] h-12`
        } fill-white bg-primary items-center flex rounded-t-[4px] shadow-md  relative justify-center transform-cpu translate-x-0  transition-all duration-150 ease-out transform-origin-bottom-right`}
        onClick={handleOpenChatBox}
      >
        <div className="bg-primary border border-solid border-white rounded-[9px] text-white text-xs h-[18px] overflow-hidden px-[5px] absolute -right-1 -top-[9px]">
          39
        </div>
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
            <div className="text-primary text-[12px] pl-2 pb-1 font-semibold">
              (39)
            </div>
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
        <div className="flex h-[460px]">
          <div className="left-chatbox">
            <div className="w-full h-12 flex items-center box-border px-3 py-2">
              <Input
                className="search-chatbox"
                prefix={<SearchOutlined className="text-slate-500" />}
                placeholder="Tìm kiếm"
              />
              <Dropdown
                menu={{
                  items,
                  onClick: handleSelectedDropdownSortByLabel,
                }}
                trigger={["click"]}
                className="ml-[18px] sort-by-label"
              >
                <a onClick={(e) => e.preventDefault()}>
                  <Space className="text-[12px] w-max">
                    {selectedDropdownSortByLabel}
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>
            </div>
          </div>
          <div className={`${expandChatBox ? "" : "hidden"} right-chatbox `}>
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
                Chào mừng bạn đến với Shopee Chat
              </div>
              <div>Bắt đầu trả lời người mua!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ChatBox);
