import { Skeleton, Spin } from "antd";
import React, { Suspense } from "react";
import LoadingPage from "../../components/LoadingPage";

const withSuspense = (Component) => {
  return (props) => (
    <Suspense
      fallback={
        <div className="w-screen h-screen flex justify-center items-center">
          <Spin size="large" />
        </div>
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default withSuspense;
