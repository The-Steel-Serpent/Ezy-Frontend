import React, { lazy, useEffect } from "react";
import PrimaryHeader from "../components/PrimaryHeader";

const AuthLayout = ({ children }) => {
  const pathname = window.location.pathname;
  const useType = pathname.split("/")[1];
  useEffect(() => {
    console.log(useType);
  }, [useType]);
  return (
    <>
      {useType !== "buyer" && <PrimaryHeader />}
      {children}
    </>
  );
};

export default AuthLayout;
