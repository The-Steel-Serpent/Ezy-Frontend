import React, { lazy, useEffect } from "react";
import withSuspense from "../hooks/HOC/withSuspense";
const PrimaryHeader = withSuspense(
  lazy(() => import("../components/PrimaryHeader"))
);
const SecondaryHeader = withSuspense(
  lazy(() => import("../components/SecondaryHeader"))
);

const AuthLayout = ({ children }) => {
  const pathname = window.location.pathname;
  const useType = pathname.split("/")[1];
  useEffect(() => {
    console.log(useType);
  }, [useType]);
  return (
    <>
      {useType === "buyer" && <SecondaryHeader />}
      {useType === "" && <PrimaryHeader />}
      {children}
    </>
  );
};

export default AuthLayout;
