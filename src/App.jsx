/* Lavender Lookbook app routing: a coherent boutique route map prioritizing discovery, Fit Check, and purchase confidence. */
import { lazy, Suspense } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router";
import { Toaster } from "sonner";

// ! internal imports 
import AppLayout from "./components/layout/AppLayout";
import PageLoader from "./components/loader.jsx";

// # main
const Home = lazy( () => import( "./pages/Home" ) );

// # auth related
const Profile = lazy(() => import("./features/auth/pages/auth.profile.jsx"));
const Login = lazy(() => import("./features/auth/pages/auth.login.jsx"));
const Register = lazy( () => import( "./features/auth/pages/auth.signup.jsx" ) );

// # products related
const Products = lazy(() => import("./features/products/pages/products.jsx"));
const ProductDetails = lazy(() => import("./features/products/pages/product.Details.jsx"));

// # commerce relaed 
const Cart = lazy( () => import( "./features/commerce/pages/commerce.cart.jsx" ) );
const Checkout = lazy( () => import( "./features/commerce/pages/commerce.checkout.jsx" ) );
const OrderConfirmation = lazy(() => import("./features/commerce/pages/commerce.orderConfirmation.jsx"));
const Orders = lazy(() => import("./features/commerce/pages/commerce.orders.jsx"));
const OrderDetails = lazy( () => import( "./features/commerce/pages/commerce.orderDetails.jsx" ) );

// # user related
const Wishlist = lazy( () => import( "./features/user/pages/user.wishlist.jsx" ) );
const FitCheck = lazy(() => import("./features/user/pages/user.fitCheck.jsx"));
const FitHistory = lazy(() => import("./features/user/pages/user.fitHistory.jsx"));
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
            {/* ! products related */}
            <Route path="/products" element={ <Products /> } />
            <Route path="/products/:productId" element={ <ProductDetails /> } />
            
            {/* ! shoping and commerce related  */ }
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
