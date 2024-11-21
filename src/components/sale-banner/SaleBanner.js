import React, { memo, useEffect, useState } from "react";
import { Modal } from "antd";
import BannerFlashSale from "../../assets/goat-flash-sale-bg.png";
const SaleBanner = ({ thumbnail, status }) => {
  const [isBannerVisible, setBannerVisible] = useState(false);
  useEffect(() => {
    const lastShown = localStorage.getItem("saleBannerLastShown");
    const currentTime = new Date().getTime();

    if (
      (!lastShown || currentTime - lastShown > 24 * 60 * 60 * 1000) &&
      status !== "ended"
    ) {
      setBannerVisible(true);
      localStorage.setItem("saleBannerLastShown", currentTime.toString());
    }
  }, [status]);

  const handleCloseBanner = () => {
    setBannerVisible(false);
  };
  return (
    <>
      {/* {isBannerVisible && (
        <Modal open={true} className="sale-banner-modal">
          <img src={BannerFlashSale} />
        </Modal>
      )} */}

      <Modal
        open={isBannerVisible}
        className="sale-banner-modal "
        footer={null}
        onCancel={handleCloseBanner}
        onClose={handleCloseBanner}
      >
        <img
          src={thumbnail}
          alt="flash sale"
          className="rounded-md size-[520px]"
        />
      </Modal>
    </>
  );
};

export default memo(SaleBanner);
