import { Skeleton } from "antd";
import React, { Suspense } from "react";

const withSuspense = (Component) => {
  return (props) => (
    <Suspense fallback={<Skeleton style={{ width: "100%", height: "100%" }} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default withSuspense;
