import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../layout";
import App from "../App";
import Home from "../pages/Home";
import BuyerLogin from "../pages/buyer/BuyerLogin";
import BuyerRegister from "../pages/buyer/BuyerRegister";
import SellerLogin from "../pages/seller/SellerLogin";
import SellerRegister from "../pages/seller/SellerRegister";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import SellerAuthLayout from "../layout/seller";
import SellerHome from "../pages/seller/SellerHome";
import AllOrder from "../pages/seller/AllOrders";
import OrderCancelled from "../pages/seller/OrderCancelled";
import AdminAuthLayout from "../layout/admin";
import AllProduct from '../pages/seller/product_management/AllProduct'
import AddProduct from '../pages/seller/product_management/AddProduct'
import WorkingProducts from "../pages/seller/product_management/WorkingProducts";
import InfringingProduct from "../pages/seller/product_management/InfringingProduct";
import PendingProducts from "../pages/seller/product_management/PendingProducts";
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
        path: "seller/product-management/all",
        element: (
          <SellerAuthLayout>
            <AllProduct />
          </SellerAuthLayout>
        )
      },
      {
        path: "seller/product-management/working-products",
        element: (
          <SellerAuthLayout>
            <WorkingProducts />
          </SellerAuthLayout>
        )
      },
      {
        path: "seller/product-management/infringing-products",
        element: (
          <SellerAuthLayout>
            <InfringingProduct />
          </SellerAuthLayout>
        )
      },
      {
        path: "seller/product-management/pending-products",
        element: (
          <SellerAuthLayout>
            <PendingProducts />
          </SellerAuthLayout>
        )
      },
      {
        path: "seller/product-management/add-product",
        element: (
          <SellerAuthLayout>
            <AddProduct />
          </SellerAuthLayout>
        )
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
