import React, { useEffect, useRef, useState } from "react";
import WhitePhoto from "../assets/image (1) (2).png";
import { Spin } from "antd";
import { useLocation } from "react-router-dom";

const LoadingPage = () => {
  const [progress, setProgress] = useState(0);
  const imgRef = useRef(null);
  const location = useLocation();

  return (
    <div className="h-screen max-h-full bg-primary flex justify-center items-center flex-col">
      <img
        ref={imgRef}
        src={WhitePhoto}
        width={350}
        height={400}
        alt="Loading"
      />
      <Spin className="LoadingPage" size="large" />
    </div>
  );
};

export default LoadingPage;
