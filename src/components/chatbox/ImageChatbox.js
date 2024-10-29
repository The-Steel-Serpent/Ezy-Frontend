import { PlayCircleOutlined } from "@ant-design/icons";
import { Image, Skeleton } from "antd";
import React, { memo, useEffect, useRef, useState } from "react";
import { IoCloseCircle } from "react-icons/io5";

const ImageChatbox = ({ loading, setLoading, files, handleRemoveFile }) => {
  const [thumbnails, setThumbnails] = useState({});
  useEffect(() => {
    if (files.length > 0) {
      const timer = setTimeout(() => setLoading(false), 3000);
      files.forEach((file, index) => {
        if (file.type.includes("video")) {
          createThumbnail(file, index);
        }
      });
      return () => {
        clearTimeout(timer); // Xóa timer khi unmount
        files.forEach((file) => URL.revokeObjectURL(URL.createObjectURL(file)));
      };
    }
  }, [files]);
  const createThumbnail = (file, index) => {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);
    video.currentTime = 1; // Lấy khung hình tại giây thứ 1

    video.onloadeddata = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const thumbnail = canvas.toDataURL("image/png");
      setThumbnails((prev) => ({ ...prev, [index]: thumbnail }));
      URL.revokeObjectURL(video.src); // Giải phóng bộ nhớ
    };
  };
  return (
    <>
      {files.map((file, key) =>
        loading ? (
          <Skeleton.Image key={key} className="rounded size-12" />
        ) : (
          <div className="image-list-item" key={key}>
            {file.type.includes("video") ? (
              <div className="relative">
                <img
                  src={thumbnails[key]}
                  alt="Video Thumbnail"
                  className="rounded size-[46px]"
                />
                <div className="absolute top-3 left-3">
                  <PlayCircleOutlined className="text-white text-2xl" />
                </div>
              </div>
            ) : (
              <Image
                width={46}
                height={46}
                className="rounded"
                src={URL.createObjectURL(file)} // Sử dụng URL từ urlsRef
                onLoad={() => setLoading(false)} // Đặt loading thành false khi hình ảnh đã tải xong
              />
            )}

            <IoCloseCircle
              className="btn-remove-image"
              onClick={() => handleRemoveFile(key)}
            />
          </div>
        )
      )}
    </>
  );
};

export default memo(ImageChatbox);
