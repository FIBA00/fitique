/* Lavender Lookbook app routing: a coherent boutique route map prioritizing discovery, Fit Check, and purchase confidence. */
import { lazy, Suspense } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router";
import { Toaster } from "sonner";

// ! internal imports 
import AppLayout from "./components/layout/AppLayout";
import PageLoader from "./components/loader.jsx";

const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./features/products/pages/Products.jsx"));
const ProductDetails = lazy(() => import("./features/products/pages/ProductDetails.jsx"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderConfirmation = lazy(() => import("./features/orders/pages/OrderConfirmation.jsx"));
const Orders = lazy(() => import("./features/orders/pages/Orders.jsx"));
const OrderDetails = lazy(() => import("./features/orders/pages/OrderDetails.jsx"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Profile = lazy(() => import("./features/auth/pages/Profile.jsx"));
const Login = lazy(() => import("./features/auth/pages/auth.login.jsx"));
const Register = lazy(() => import("./features/auth/pages/Register.jsx"));
const FitCheck = lazy(() => import("./pages/FitCheck"));
const FitHistory = lazy(() => import("./pages/FitHistory"));
const NotFound = lazy(() => import("./pages/NotFound"));

function StorefrontLayout() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

export default function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          className:
            "!rounded-none !border-fitique-line !bg-fitique-ivory !text-fitique-ink",
        }}
      />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<StorefrontLayout />}>
            <Route path="/" element={<Home />} />
            
            <Route path="/products" element={ <Products /> } />
            <Route path="/products/:productId" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route
              path="/order-confirmation/:orderId"
              element={<OrderConfirmation />}
            />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:orderId" element={<OrderDetails />} />
            <Route path="/wishlist" element={ <Wishlist /> } />
            
            <Route path="/profile" element={<Profile />} />
            <Route path="/fit-check" element={<FitCheck />} />
            <Route path="/fit-history" element={ <FitHistory /> } />
            
          </Route>
          {/* ! auth related */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />


          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}
