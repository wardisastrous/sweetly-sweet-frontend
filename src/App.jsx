import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import PrivateRoute from "./components/layout/PrivateRoute";
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
import AdminProducts from "./pages/AdminProducts";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-beige-100">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/login"         element={<Login />} />
          <Route path="/register"      element={<Register />} />
          <Route path="/products"      element={<Products />} />
          <Route path="/products/:id"  element={<ProductDetail />} />
          <Route path="/cart"          element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/checkout"      element={<PrivateRoute><Checkout /></PrivateRoute>} />
          <Route path="/order-success" element={<PrivateRoute><OrderSuccess /></PrivateRoute>} />
          <Route path="/orders"        element={<PrivateRoute><OrderHistory /></PrivateRoute>} />
          <Route path="/orders/:id"    element={<PrivateRoute><OrderDetail /></PrivateRoute>} />
          <Route path="/profile"       element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/admin/products" element={ <PrivateRoute adminOnly={true}> <AdminProducts /> </PrivateRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}