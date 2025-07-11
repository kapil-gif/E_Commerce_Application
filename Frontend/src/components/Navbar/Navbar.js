import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./navbar.css";
import { CartContext } from "./Carts";
import { SearchContext } from "../../App";
import axios from "axios";

const Navbar = ({ fixedTop }) => {
    const [Category, setCategory] = useState("");
    const { cartCount } = useContext(CartContext);
    const { setSearchResults } = useContext(SearchContext);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    // Get user role from localStorage
    useEffect(() => {
        const role = localStorage.getItem("userRole");
        setUserRole(role);
    }, []);

    const searchBoxsubmit = async (e) => {
        e.preventDefault();

        if (!Category || Category.trim() === "") {
            console.warn("Search input is empty.");
            setSearchResults([]);
            return;
        }

        const token = localStorage.getItem("authtoken");

        try {
            const res = await axios.get("http://localhost:8080/profile/searchCategory", {
                headers: { Authorization: `Bearer ${token}` },
                params: { category: Category }
            });

            if (res.data.data.code === "404") {
                setSearchResults([]);
            } else {
                setSearchResults(res.data.data);
            }
        } catch (err) {
            console.error("Search error:", err);
            setSearchResults([]);
        }
    };

    const logoutfunction = () => {
        localStorage.removeItem("authtoken");
        localStorage.removeItem("user_Id");
        localStorage.removeItem("userRole");

        localStorage.clear();
        navigate("/login");
        window.location.reload()


    };

    const changeTheam = () => {
        document.body.classList.toggle("dark-mode");
    };

    return (
        <nav className={`navbar navbar-expand-lg ${fixedTop ? 'fixed-top' : ''} navbar-dark bg-gradient-custom`}>
            <div className="container">
                <NavLink className="navbar-brand fw-bold text-uppercase" to="/Myshop">
                    🛍️ My Shop
                </NavLink>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="nav nav-pills flex-column flex-sm-row me-auto mb-2 mb-lg-0">
                        {[
                            { to: "/dashboard", label: "Products" },
                            { to: "/carts", label: `🛒 Carts (${cartCount})` },
                            { to: "/Myorder", label: "My Order" },
                            { to: "/wishlistproduct", label: "Wishlist" },
                            { to: "/MyProfile", label: "Profile" },
                            { to: "/AddProduct", label: "Add Product" },
                        ].map(nav => (
                            <li className="nav-item flex-sm-fill text-sm-center" key={nav.to}>
                                <NavLink
                                    to={nav.to}
                                    className={({ isActive }) =>
                                        `nav-link custom-nav-link ${isActive ? "active" : ""}`
                                    }
                                >
                                    {nav.label}
                                </NavLink>
                            </li>
                        ))}


                    </ul>

                    <form className="d-flex" onSubmit={searchBoxsubmit}>
                        <input
                            className="form-control me-2 search-box"
                            type="search"
                            placeholder="Search"
                            value={Category}
                            onChange={e => setCategory(e.target.value)}
                        />
                        <button className="btn btn-outline-light" type="submit">
                            Search
                        </button>
                    </form>
                </div>

                <div className="ms-13">
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-brightness-high-fill" viewBox="0 0 16 16" onClick={changeTheam}>
                        <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708" />
                    </svg>
                </div>

                <button onClick={logoutfunction} className="btn btn-info btn-sm mx-3">
                    <span className="glyphicon glyphicon-log-out"></span> Log out
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
