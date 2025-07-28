// src/components/Navbar/Navbar.jsx
import React, { useContext, useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
//import "bootstrap/dist/css/bootstrap.min.css";
import "./navbar.css";
import { CartContext } from "./Carts";
import { SearchContext } from "../../App";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = ({ fixedTop }) => {
    const [Category, setCategory] = useState("");
    const { cartCount } = useContext(CartContext);
    const { setSearchResults } = useContext(SearchContext);
    const [permissions, setPermissions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedPermissions = JSON.parse(localStorage.getItem("userPermissions") || "[]");
        const normalized = storedPermissions.map((p) =>
            p.toLowerCase().replace(/\s+/g, "_")
        );
        setPermissions(normalized);
    }, []);

    const hasPermission = (perm) => permissions.includes(perm);

    const searchBoxsubmit = async (e) => {
        e.preventDefault();

        // If search field is empty, navigate to dashboard and clear results
        if (!Category || Category.trim() === "") {
            setSearchResults([]);        // Clear previous search results

            return;
        }

        try {
            const token = localStorage.getItem("authtoken");

            const res = await axios.get("http://localhost:8080/profile/searchCategory", {
                headers: { Authorization: `Bearer ${token}` },
                params: { category: Category },
            });

            if (res.data.data.code === "404") {
                setSearchResults([]);
            } else {
                setSearchResults(res.data.data);
            }
        } catch (err) {
            if (err.response?.data?.code === "404") {
                toast.info("No products found for the given category");
            }
            console.error("Search error:", err);
            setSearchResults([]);
        }
    };


    const logoutfunction = () => {
        localStorage.clear();
        navigate("/login");
    };

    const changeTheme = () => {
        document.body.classList.toggle("dark-mode");
        const nav = document.querySelector(".navbar");
        if (nav) {
            nav.classList.toggle("navbar-dark");
            nav.classList.toggle("navbar-light");
        }
    };

    const location = useLocation();
    const showsearchBox = location.pathname === '/dashboard'

    return (
        <nav className={`navbar navbar-expand-lg ${fixedTop ? "fixed-top" : ""} navbar-dark bg-gradient-custom`}>
            <div className="container-fluid px-4">
                <NavLink className="navbar-brand fw-bold text-uppercase" to="/myshop">
                    🛍️ My Shop
                </NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon" />
                </button>


                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {hasPermission("view_products") && (
                            <li className="nav-item">
                                <NavLink to="/dashboard" className="nav-link custom-nav-link">Products</NavLink>
                            </li>
                        )}
                        {hasPermission("view_cart") && (
                            <li className="nav-item">
                                <NavLink to="/carts" className="nav-link custom-nav-link">🛒 Carts ({cartCount})</NavLink>
                            </li>
                        )}
                        {hasPermission("view_orders") && (
                            <li className="nav-item">
                                <NavLink to="/myorder" className="nav-link custom-nav-link">My Orders</NavLink>
                            </li>
                        )}
                        {hasPermission("view_wishlist") && (
                            <li className="nav-item">
                                <NavLink to="/wishlistproduct" className="nav-link custom-nav-link">Wishlist</NavLink>
                            </li>
                        )}
                        {hasPermission("view_profile") && (
                            <li className="nav-item">
                                <NavLink to="/myprofile" className="nav-link custom-nav-link">Profile</NavLink>
                            </li>
                        )}
                        {hasPermission("add_product") && (
                            <li className="nav-item">
                                <NavLink to="/addproduct" className="nav-link custom-nav-link">Add Product</NavLink>
                            </li>
                        )}
                        {hasPermission("view_userlist") && (
                            <li className="nav-item dropdown custom-dropdown ">
                                <a
                                    className="nav-link dropdown-toggle custom-nav-link nav-item "
                                    href="#"
                                    id="userListDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    👥 User List
                                </a>
                                <ul className="dropdown-menu animate-dropdown" aria-labelledby="userListDropdown">
                                    <li><NavLink to="/admin/allusers" className="dropdown-item"> All Users</NavLink></li>
                                    <li><NavLink to="/admin/userlist" className="dropdown-item">⏳ Pending Users</NavLink></li>

                                </ul>
                            </li>
                        )}



                        {hasPermission("view_myproduct") && (
                            <li className="nav-item">
                                <NavLink to="/admin/myporducts" className="nav-link custom-nav-link">MyProduct</NavLink>
                            </li>
                        )}
                    </ul>

                    {showsearchBox && (<form className="d-flex me-3" onSubmit={searchBoxsubmit}>
                        <input
                            className="form-control me-2 search-box"
                            type="search"
                            placeholder="Search"
                            value={Category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                        <button className="btn btn-outline-light" type="submit">Search</button>
                    </form>
                    )}

                    <button className="btn btn-sm btn-light me-2 theme-toggle-btn" onClick={changeTheme}>
                        🌗
                    </button>

                    <button onClick={logoutfunction} className="btn btn-outline-warning btn-sm">
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
