import { Spin } from "antd";
import React, { Suspense } from "react";

const withChildSuspense = (Component) => {
  return (props) => (
    <Suspense
      fallback={
        <div className="w-full flex justify-center items-center">
          <Spin size="large" />
        </div>
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default withChildSuspense;
