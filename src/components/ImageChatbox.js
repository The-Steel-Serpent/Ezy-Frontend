import { Image, Skeleton } from "antd";
import React, { memo, useEffect, useRef } from "react";
import { IoCloseCircle } from "react-icons/io5";

const ImageChatbox = ({ loading, setLoading, files, handleRemoveFile }) => {
  useEffect(() => {
    if (files.length > 0) {
      return () => {
        files.forEach((file) => URL.revokeObjectURL(URL.createObjectURL(file)));
      };
    }
  }, [files]);
  return (
    <>
      {files.map((file, key) =>
        loading ? (
          <Skeleton.Image key={key} className="rounded size-12" />
        ) : (
          <div className="image-list-item" key={key}>
            <Image
              width={46}
              height={46}
              className="rounded"
              src={URL.createObjectURL(file)} // Sử dụng URL từ urlsRef
              onLoad={() => setLoading(false)} // Đặt loading thành false khi hình ảnh đã tải xong
            />
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
