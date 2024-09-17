import { Skeleton } from "antd";
import React, { Suspense } from "react";
import LoadingPage from "../../components/LoadingPage";

const withSuspense = (Component) => {
  return (props) => (
    <Suspense fallback={<LoadingPage />}>
      <Component {...props} />
    </Suspense>
  );
};

export default withSuspense;
