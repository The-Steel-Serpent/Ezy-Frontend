import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import AuthLayout from "../layout";
import WorkingProducts from "../pages/seller/product_management/WorkingProducts";
import InfringingProduct from "../pages/seller/product_management/InfringingProduct";
import PendingProducts from "../pages/seller/product_management/PendingProducts";
import AuthenticationLayout from "../layout/AuthenticationLayout";
import DetailsProduct from "../pages/buyer/product-pages/DetailsProduct";
import Home from "../pages/Home";
import BuyerLogin from "../pages/buyer/user-pages/BuyerLogin";
import BuyerRegister from "../pages/buyer/user-pages/BuyerRegister";
import SellerLogin from "../pages/seller/SellerLogin";
import SellerRegister from "../pages/seller/SellerRegister";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import SellerHome from "../pages/seller/SellerHome";
import AllOrders from "../pages/seller/orders/AllOrders";
import OrderCancelled from "../pages/seller/orders/OrderCancelled";
import AllProduct from "../pages/seller/product_management/AllProduct";
import AddProduct from "../pages/seller/product_management/AddProduct";
import SellerAuthLayout from "../layout/seller";
import AdminAuthLayout from "../layout/admin";
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
            <AllOrders />
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
