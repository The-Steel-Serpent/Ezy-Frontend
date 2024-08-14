import React, { useEffect } from "react";
import PrimaryHeader from "../components/PrimaryHeader";
import SecondaryHeader from "../components/SecondaryHeader";

const AuthLayout = ({ children }) => {
  const pathname = window.location.pathname;
  const useType = pathname.split("/")[1];
  useEffect(() => {
    console.log(useType);
  }, [useType]);
  return (
    <>
      {useType !== "" && <SecondaryHeader />}
      {useType === "" && <PrimaryHeader />}
      {children}
    </>
  );
};

export default AuthLayout;
