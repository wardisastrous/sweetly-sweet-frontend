import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import PrivateRoute from "./components/layout/PrivateRoute";
import AdminRoute from "./components/layout/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import OrderHistory from "./pages/OrderHistory";
import OrderDetail from "./pages/OrderDetail";
import Profile from "./pages/Profile";

import About from "./pages/About";
import ShippingPolicy from "./pages/ShippingPolicy";
import ReturnPolicy from "./pages/ReturnPolicy";
import Contact from "./pages/Contact";
import Faqs from "./pages/Faqs";

import AdminOverview from "./pages/admin/AdminOverview";
import AddProduct from "./pages/admin/AddProduct";
import ManageProducts from "./pages/admin/ManageProducts";
import ManageOrders from "./pages/admin/ManageOrders";
import ManageCoupons from "./pages/admin/ManageCoupons";
import ManageUsers from "./pages/admin/ManageUsers";
import ScrollToTop from "./components/layout/ScrollToTop";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "./api/axiosInstance";
import { setWishlist } from "./features/wishlist/wishlistSlice";
import Wishlist from "./pages/Wishlist";
import EditProduct from "./pages/admin/EditProduct";

export default function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) return;

    axiosInstance
      .get("/api/wishlist/ids")
      .then((res) => dispatch(setWishlist(res.data)))
      .catch(() => {});
  }, [token, dispatch]);
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />

      <ScrollToTop />

      <Routes>
        <Route path="/admin/users" element={<ManageUsers />} />
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="products/new" element={<AddProduct />} />
          <Route path="orders" element={<ManageOrders />} />
          <Route path="coupons" element={<ManageCoupons />} />
        </Route>

        {/* Customer Routes */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex flex-col bg-beige-100">
              <Navbar />

              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />

                  <Route path="/login" element={<Login />} />

                  <Route path="/register" element={<Register />} />

                  <Route path="/products" element={<Products />} />

                  <Route
                    path="/products/:id"
                    element={<ProductDetail />}
                  />

                  <Route
                    path="/about"
                    element={<About />}
                  />

                  <Route
                    path="/shipping-policy"
                    element={<ShippingPolicy />}
                  />

                  <Route
                    path="/return-policy"
                    element={<ReturnPolicy />}
                  />

                  <Route
                    path="/contact"
                    element={<Contact />}
                  />

                  <Route
                    path="/faqs"
                    element={<Faqs />}
                  />

                  <Route
                    path="/cart"
                    element={
                      <PrivateRoute>
                        <Cart />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/checkout"
                    element={
                      <PrivateRoute>
                        <Checkout />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/order-success"
                    element={
                      <PrivateRoute>
                        <OrderSuccess />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/orders"
                    element={
                      <PrivateRoute>
                        <OrderHistory />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/orders/:id"
                    element={
                      <PrivateRoute>
                        <OrderDetail />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/wishlist"
                    element={
                      <PrivateRoute>
                        <Wishlist />
                      </PrivateRoute>
                    }
                  />
                  <Route
                      path="/admin/products/:id/edit"
                      element={<EditProduct />}
                  />
                </Routes>
              </main>

              <Footer />
            </div>
          }
        />
      </Routes>
    </>
  );
}