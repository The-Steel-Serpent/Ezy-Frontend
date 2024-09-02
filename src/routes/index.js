import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../layout";
import { lazy } from "react";
import App from "../App";
import withSuspense from "../hooks/HOC/withSuspense";

const Home = withSuspense(lazy(() => import("../pages/Home")));
const BuyerLogin = withSuspense(
  lazy(() => import("../pages/buyer/BuyerLogin"))
);
const BuyerRegister = withSuspense(
  lazy(() => import("../pages/buyer/BuyerRegister"))
);
const SellerLogin = withSuspense(
  lazy(() => import("../pages/seller/SellerLogin"))
);
const SellerRegister = withSuspense(
  lazy(() => import("../pages/seller/SellerRegister"))
);
const AdminLogin = withSuspense(
  lazy(() => import("../pages/admin/AdminLogin"))
);
const AdminDashboard = withSuspense(
  lazy(() => import("../pages/admin/AdminDashboard"))
);
const SellerHome = withSuspense(
  lazy(() => import("../pages/seller/SellerHome"))
);
const AllOrder = withSuspense(lazy(() => import("../pages/seller/AllOrders")));
const OrderCancelled = withSuspense(
  lazy(() => import("../pages/seller/OrderCancelled"))
);
const AllProduct = withSuspense(
  lazy(() => import("../pages/seller/AllProduct"))
);
const AddProduct = withSuspense(
  lazy(() => import("../pages/seller/AddProduct"))
);
const SellerAuthLayout = withSuspense(lazy(() => import("../layout/seller")));
const AdminAuthLayout = withSuspense(lazy(() => import("../layout/admin")));
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
        path: "seller",
        element: (
          <SellerAuthLayout>
            <SellerHome />
          </SellerAuthLayout>
        ),
      },
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
      //seller/order
      {
        path: "seller/order/all",
        element: (
          <SellerAuthLayout>
            <AllOrder />
          </SellerAuthLayout>
        ),
      },
      {
        path: "seller/order/ordercancelled",
        element: (
          <SellerAuthLayout>
            <OrderCancelled />
          </SellerAuthLayout>
        ),
      },
      //seller/order
      {
        path: "seller/product/all",
        element: (
          <SellerAuthLayout>
            <AllProduct />
          </SellerAuthLayout>
        ),
      },
      {
        path: "seller/product/add-product",
        element: (
          <SellerAuthLayout>
            <AddProduct />
          </SellerAuthLayout>
        ),
      },
      //Admin
      //login && dashboard
      {
        path: "admin/login",
        element: (
          <AuthLayout>
            <AdminLogin />
          </AuthLayout>
        ),
      },
      {
        path: "admin/dashboard",
        element: (
          <AdminAuthLayout>
            <AdminDashboard />
          </AdminAuthLayout>
        ),
      },
    ],
  },
]);

export default router;
