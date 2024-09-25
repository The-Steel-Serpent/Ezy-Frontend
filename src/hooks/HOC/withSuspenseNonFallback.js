import React, { Suspense } from "react";

const withSuspenseNonFallback = (Component) => {
  return (props) => (
    <Suspense>
      <Component {...props} />
    </Suspense>
  );
};

export default withSuspenseNonFallback;
