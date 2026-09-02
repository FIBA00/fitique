/* Lavender Lookbook app routing: a coherent boutique route map prioritizing discovery, Fit Check, and purchase confidence. */
import { lazy, Suspense } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router";
import { Toaster } from "sonner";
import AppLayout from "./components/layout/AppLayout";

const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const Orders = lazy(() => import("./pages/Orders"));
const OrderDetails = lazy(() => import("./pages/OrderDetails"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Profile = lazy(() => import("./pages/Profile"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
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
function PageLoader() {
  return (
    <div className="content-shell grid min-h-[50vh] place-items-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-fitique-lilac border-t-fitique-plum" />
    </div>
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
            <Route path="/products" element={<Products />} />
            <Route path="/products/:productId" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route
              path="/order-confirmation/:orderId"
              element={<OrderConfirmation />}
            />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:orderId" element={<OrderDetails />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/fit-check" element={<FitCheck />} />
            <Route path="/fit-history" element={<FitHistory />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}
