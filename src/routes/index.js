import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../layout";
import App from "../App";
import Home from "../pages/Home";
import BuyerLogin from "../pages/buyer/BuyerLogin";
import BuyerRegister from "../pages/buyer/BuyerRegister";
import SellerLogin from "../pages/seller/SellerLogin";
import SellerRegister from "../pages/seller/SellerRegister";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: (
          <AuthLayout>
            <Home />
          </AuthLayout>
        ),
      },
      //Buyer
      //login && register
      {
        path: "buyer/login",
        element: (
          <AuthLayout>
            <BuyerLogin />
          </AuthLayout>
        ),
      },
      {
        path: "buyer/register",
        element: (
          <AuthLayout>
            <BuyerRegister />
          </AuthLayout>
        ),
      },
      //Seller
      //login && register
      {
        path: "seller/login",
        element: (
          <AuthLayout>
            <SellerLogin />
          </AuthLayout>
        ),
      },
      {
        path: "seller/register",
        element: (
          <AuthLayout>
            <SellerRegister />
          </AuthLayout>
        ),
      },
    ],
  },
]);

export default router;
