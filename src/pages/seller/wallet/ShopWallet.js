import { Skeleton } from "antd";
import React, { lazy, Suspense } from "react";

const WalletSection = lazy(() =>
  import("../../../components/wallet/WalletSection")
);

const ShopWallet = () => {
  return (
    <div>
      <Suspense fallback={<Skeleton.Node active={true} className="w-full" />}>
        <WalletSection />
      </Suspense>
    </div>
  )
}

export default ShopWallet