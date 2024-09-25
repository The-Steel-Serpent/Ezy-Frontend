import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import AuthLayout from "../layout";
import { lazy } from "react";
import WorkingProducts from "../pages/seller/product_management/WorkingProducts";
import InfringingProduct from "../pages/seller/product_management/InfringingProduct";
import PendingProducts from "../pages/seller/product_management/PendingProducts";
import LoadingPage from "../components/LoadingPage";
import AuthenticationLayout from "../layout/AuthenticationLayout";
const DetailsProduct = lazy(() => import("../pages/buyer/DetailsProduct"));

const Home = lazy(() => import("../pages/Home"));
const BuyerLogin = lazy(() => import("../pages/buyer/BuyerLogin"));
const BuyerRegister = lazy(() => import("../pages/buyer/BuyerRegister"));
const SellerLogin = lazy(() => import("../pages/seller/SellerLogin"));
const SellerRegister = lazy(() => import("../pages/seller/SellerRegister"));
const AdminLogin = lazy(() => import("../pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const SellerHome = lazy(() => import("../pages/seller/SellerHome"));
const AllOrder = lazy(() => import("../pages/seller/orders/AllOrders"));
const OrderCancelled = lazy(() =>
  import("../pages/seller/orders/OrderCancelled")
);
const AllProduct = lazy(() =>
  import("../pages/seller/product_management/AllProduct")
);
const AddProduct = lazy(() =>
  import("../pages/seller/product_management/AddProduct")
);
const SellerAuthLayout = lazy(() => import("../layout/seller"));
const AdminAuthLayout = lazy(() => import("../layout/admin"));
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
      {
        path: "/product-details/:id",
        element: (
          <AuthLayout>
            <DetailsProduct />
            {/* <LoadingPage /> */}
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
          <AuthenticationLayout>
            <SellerLogin />
          </AuthenticationLayout>
        ),
      },
      {
        path: "seller/register",
        element: (
          <AuthenticationLayout>
            <SellerRegister />
          </AuthenticationLayout>
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
        path: "seller/product-management/all",
        element: (
          <SellerAuthLayout>
            <AllProduct />
          </SellerAuthLayout>
        ),
      },
      {
        path: "seller/product-management/working-products",
        element: (
          <SellerAuthLayout>
            <WorkingProducts />
          </SellerAuthLayout>
        ),
      },
      {
        path: "seller/product-management/infringing-products",
        element: (
          <SellerAuthLayout>
            <InfringingProduct />
          </SellerAuthLayout>
        ),
      },
      {
        path: "seller/product-management/pending-products",
        element: (
          <SellerAuthLayout>
            <PendingProducts />
          </SellerAuthLayout>
        ),
      },
      {
        path: "seller/product-management/add-product",
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
