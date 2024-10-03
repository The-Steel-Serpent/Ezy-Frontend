import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import withSuspense from "../hooks/HOC/withSuspense";
import App from "../App";
import AuthenticationLayout from "../layout/AuthenticationLayout";
import SellerAuthLayout from "../layout/seller";
import AdminAuthLayout from "../layout/admin";
import withSuspenseNonFallback from "../hooks/HOC/withSuspenseNonFallback";
import PrivateRouteSeller from "../components/authentication/PrivateRouteSeller";

const AuthLayout = withSuspenseNonFallback(lazy(() => import("../layout")));
const Categories = withSuspense(
  lazy(() => import("../pages/buyer/product-pages/Categories"))
);
const WorkingProducts = withSuspense(
  lazy(() => import("../pages/seller/product_management/WorkingProducts"))
);
const InfringingProduct = withSuspense(
  lazy(() => import("../pages/seller/product_management/InfringingProduct"))
);
const PendingProducts = withSuspense(
  lazy(() => import("../pages/seller/product_management/PendingProducts"))
);

const Home = withSuspense(lazy(() => import("../pages/Home")));
const DetailsProduct = withSuspense(
  lazy(() => import("../pages/buyer/product-pages/DetailsProduct"))
);
const BuyerLogin = withSuspense(
  lazy(() => import("../pages/buyer/user-pages/BuyerLogin"))
);
const BuyerRegister = withSuspense(
  lazy(() => import("../pages/buyer/user-pages/BuyerRegister"))
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

const SellerSetup = withSuspense(
  lazy(() => import("../pages/seller/SellerSetup"))
);
const SuggestProduct = withSuspense(
  lazy(() => import("../pages/buyer/product-pages/SuggestProduct"))
);
const AllOrders = withSuspense(
  lazy(() => import("../pages/seller/orders/AllOrders"))
);
const OrderCancelled = withSuspense(
  lazy(() => import("../pages/seller/orders/OrderCancelled"))
);
const AllProduct = withSuspense(
  lazy(() => import("../pages/seller/product_management/AllProduct"))
);
const AddProduct = withSuspense(
  lazy(() => import("../pages/seller/product_management/AddProduct"))
);
const SearchPage = withSuspense(
  lazy(() => import("../pages/buyer/product-pages/SearchPage"))
);
const SearchShop = withSuspense(
  lazy(() => import("../pages/buyer/shop-pages/ShopSearchPage"))
);

const ShopDetails = withSuspense(
  lazy(() => import("../pages/buyer/shop-pages/ShopDetails"))
);
const ShopRecommendations = withSuspense(
  lazy(() => import("../pages/buyer/shop-pages/ShopRecommendations"))
);
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
      // Product & Category
      {
        path: "/product-details/:id",
        element: (
          <AuthLayout>
            <DetailsProduct />
            {/* <LoadingPage /> */}
          </AuthLayout>
        ),
      },
      {
        path: "/suggest-products",
        element: (
          <AuthLayout>
            <SuggestProduct />
          </AuthLayout>
        ),
      },
      {
        path: "/categories/:cat_id",
        element: (
          <AuthLayout>
            <Categories />
          </AuthLayout>
        ),
      },
      {
        path: "/search",
        element: (
          <AuthLayout>
            <SearchPage />
          </AuthLayout>
        ),
      },
      // Shops
      {
        path: "/search_shop",
        element: (
          <AuthLayout>
            <SearchShop />
          </AuthLayout>
        ),
      },
      {
        path: "/shop/:shop_username",
        element: (
          <AuthLayout>
            <ShopDetails />
          </AuthLayout>
        ),
      },
      {
        path: "/shop/shop_recommendations/:shop_id",
        element: (
          <AuthLayout>
            <ShopRecommendations />
          </AuthLayout>
        ),
      },

      //Seller
      //login && register
      {
        path: "seller",
        element: (
          <PrivateRouteSeller>
            <SellerAuthLayout>
              <SellerHome />
            </SellerAuthLayout>
          </PrivateRouteSeller>
        ),
      },
      {
        path: "seller/seller-setup",
        element: (
          <PrivateRouteSeller>
            <SellerAuthLayout>
              <SellerSetup />
            </SellerAuthLayout>
          </PrivateRouteSeller>
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
          <PrivateRouteSeller>
            <SellerAuthLayout>
              <AllOrders />
            </SellerAuthLayout>
          </PrivateRouteSeller>
        ),
      },
      {
        path: "seller/order/ordercancelled",
        element: (
          <PrivateRouteSeller>
            <SellerAuthLayout>
              <OrderCancelled />
            </SellerAuthLayout>
          </PrivateRouteSeller>
        ),
      },
      //seller/order
      {
        path: "seller/product-management/all",
        element: (
          <PrivateRouteSeller>
            <SellerAuthLayout>
              <AllProduct />
            </SellerAuthLayout>
          </PrivateRouteSeller>
        ),
      },
      {
        path: "seller/product-management/working-products",
        element: (
          <PrivateRouteSeller>
            <SellerAuthLayout>
              <WorkingProducts />
            </SellerAuthLayout>
          </PrivateRouteSeller>
        ),
      },
      {
        path: "seller/product-management/infringing-products",
        element: (
          <PrivateRouteSeller>
            <SellerAuthLayout>
              <InfringingProduct />
            </SellerAuthLayout>
          </PrivateRouteSeller>
        ),
      },
      {
        path: "seller/product-management/pending-products",
        element: (
          <PrivateRouteSeller>
            <SellerAuthLayout>
              <PendingProducts />
            </SellerAuthLayout>
          </PrivateRouteSeller>
        ),
      },
      {
        path: "seller/product-management/add-product",
        element: (
          <PrivateRouteSeller>
            <SellerAuthLayout>
              <AddProduct />
            </SellerAuthLayout>
          </PrivateRouteSeller>
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
