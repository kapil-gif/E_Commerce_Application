// src/App.js
import { useState, useEffect, createContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";

import LoginForm from './components/loginComponents/loginForm';
import Signup from "./components/loginComponents/signup";
import Dashboard from './components/Dashboard/Dashboard';
import Productsdetails from './components/productDetials/productDetail';
import Myshop from "./components/Navbar/Myshop";
import Carts, { CartContext } from "./components/Navbar/Carts";
import Myorder from "./components/Navbar/Myorder";
import Profile from "./components/Navbar/Profile";
import OrderConfirmation from "./components/OrderComformation/OrderConformation";
import Wishlist from "./components/Navbar/Wishlist";
import OrderProductsdetails from "./components/productDetials/OrderProductsdetails";
import AddProduct from "./components/AddProduct/addproduct";
import PendingUsers from "./components/Admincomponents/PendingUsers";
import { ProtectRoute } from "./components/ProtectRoutes/ProtectRoute";
import UserList from "./components/Admincomponents/UserList"
export const SearchContext = createContext();

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchCartCount = async () => {
      const user_Id = localStorage.getItem("user_Id");
      const token = localStorage.getItem("authtoken");

      if (!user_Id || !token) return;

      try {
        const { data } = await axios.get("http://localhost:8080/products/fetchcart", {
          headers: { Authorization: `Bearer ${token}` },
          params: { user_id: user_Id },
        });
        setCartCount(data.products?.length || 0);
      } catch (error) {
        console.error("Failed to fetch cart count:", error);
      }
    };

    fetchCartCount();
  }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={2500} />
      <SearchContext.Provider value={{ searchResults, setSearchResults }}>
        <CartContext.Provider value={{ cartCount, setCartCount }}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<LoginForm />} />

              <Route path="/signup" element={<Signup />} />

              <Route path="/dashboard" element={
                <ProtectRoute>
                  <Dashboard />
                </ProtectRoute>
              } />

              <Route path="/productsdetails/:id" element={<ProtectRoute><Productsdetails /></ProtectRoute>} />
              <Route path="/myshop" element={<ProtectRoute><Myshop /></ProtectRoute>} />
              <Route path="/carts" element={<ProtectRoute><Carts /></ProtectRoute>} />
              <Route path="/myorder" element={<ProtectRoute><Myorder /></ProtectRoute>} />
              <Route path="/myprofile" element={<ProtectRoute><Profile /></ProtectRoute>} />
              <Route path="/ordercomformation" element={<ProtectRoute><OrderConfirmation /></ProtectRoute>} />
              <Route path="/wishlistproduct" element={<ProtectRoute><Wishlist /></ProtectRoute>} />
              <Route path="/orderproductsdetails/:id" element={<ProtectRoute><OrderProductsdetails /></ProtectRoute>} />
              <Route path="/addproduct" element={<ProtectRoute ><AddProduct /></ProtectRoute>} />
              <Route path="/admin/pending-users" element={<ProtectRoute allowedRoles={["admin"]}><PendingUsers /></ProtectRoute>} />
              <Route path="/admin/userlist" element={<ProtectRoute> <UserList /> </ProtectRoute>} />
            </Routes>
          </BrowserRouter>
        </CartContext.Provider>
      </SearchContext.Provider>
    </>
  );
}

export default App;
