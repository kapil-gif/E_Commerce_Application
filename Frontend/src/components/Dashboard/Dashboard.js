import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { SearchContext } from '../../App.js';
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import NProgress from "nprogress";
import 'nprogress/nprogress.css';
import '../../App.css';
import { CartContext } from "../Navbar/Carts";

function Dashboard() {
    const [wishlistProductIds, setWishlistProductIds] = useState([]);
    const [products, setProducts] = useState([]);
    const { searchResults } = useContext(SearchContext);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const { setCartCount } = useContext(CartContext);

    const navigate = useNavigate();

    const showCustomLoader = () => {
        document.getElementById('custom-loader').style.display = 'flex';
    };

    const hideCustomLoader = () => {
        document.getElementById('custom-loader').style.display = 'none';
    };

    useEffect(() => {
        let isCalled = false;
        const storedUserId = localStorage.getItem("userId");
        const storedToken = localStorage.getItem("authtoken");

        if (!storedUserId || !storedToken) {
            navigate("/login");

        } else if (!isCalled) {
            isCalled = true;
            fetchInitialData(storedUserId, storedToken);
            updateCartCount();
        }

        return () => {
            isCalled = true;
        };
    }, []);

    const updateCartCount = async () => {
        try {
            const user_id = localStorage.getItem("userId");
            const token = localStorage.getItem("authtoken");

            const res = await axios.get("http://localhost:8080/products/fetchcart", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: { user_id },
            });

            setCartCount(res.data.products.length);
        } catch (error) {
            console.error("Error updating cart count:", error);
        }
    };

    const fetchInitialData = async (userId, token) => {
        await fetchWishlist(userId, token);
        fetchData(userId, token);
    };

    const fetchWishlist = async (userId, token) => {
        try {
            NProgress.start();
            showCustomLoader();
            const res = await axios.get("http://localhost:8080/wishlistproduct/fetchwishlist", {
                params: { user_id: userId },
                headers: { Authorization: `Bearer ${token}` }
            });

            const wishlistItems = res.data.fectchwishlistApi || [];
            const wishlistIds = wishlistItems.map((item) => item.id.toString());
            setWishlistProductIds(wishlistIds);
        } catch (err) {
            console.error("Wishlist fetch error:", err);
        } finally {
            NProgress.done();
            hideCustomLoader();
        }
    };

    const fetchData = async (userId = localStorage.getItem("userId"), token = localStorage.getItem("authtoken")) => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        NProgress.start();
        showCustomLoader();

        try {
            const res = await axios.get(`http://localhost:8080/products/fetchproducts?page=${page}&limit=6`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // console.log("fetch product frontend :", res);

            const newProducts = (res.data.allproducts || []).map((item) => ({
                ...item,
                img: typeof item.img === "string" ? JSON.parse(item.img) : item.img
            }));

            if (newProducts.length === 0) {
                setHasMore(false);
            } else {
                setProducts((prev) => [...prev, ...newProducts]);
                setPage((prev) => prev + 1);
            }
        } catch (err) {
            console.error("Error fetching products:", err);
        } finally {
            setIsLoading(false);
            NProgress.done();
            hideCustomLoader();
        }
    };

    const productDetails = (product) => {
        navigate(`/productsdetails/${product.id}`);
    };

    const addtoCart = async (product) => {
        const product_id = parseInt(product.id);
        const qty = 1;
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("authtoken");

        try {
            const res = await axios.post(
                'http://localhost:8080/products/addtocart',
                { product_id, user_id: userId, quantity: qty, price: product.price },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.info(res.data.message);

            updateCartCount();
        } catch (err) {
            if (err.response?.status === 409) {
                toast.info("This product is already in your cart.");
            } else if (err.response?.status === 401) {
                toast.warn("Please login first.");
            } else {
                toast.error("Failed to add to cart.");
            }
        }
    };

    const toggleWishlist = async (productId) => {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("authtoken");
        const idStr = productId.toString();
        const isWishlisted = wishlistProductIds.includes(idStr);

        try {
            if (!isWishlisted) {
                await axios.post("http://localhost:8080/wishlistproduct/addtowishlist", {
                    userid: userId,
                    productid: productId
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setWishlistProductIds(prev => [...prev, idStr]);
            } else {
                await axios.delete("http://localhost:8080/wishlistproduct/removeproductwishlist", {
                    headers: { Authorization: `Bearer ${token}` },
                    data: { userid: userId, productid: productId }
                });
                setWishlistProductIds(prev => prev.filter(id => id !== idStr));
            }
        } catch (err) {
            console.error("Wishlist toggle failed:", err);
            toast.error("Failed to update wishlist.");
        }
    };

    const moveconfrompage = (product) => {
        const userId = localStorage.getItem("userId");
        const selectedItem = {
            product_id: product.id || product.product_id,
            title: product.title || product.name,
            img: product.img,
            price: product.price,
            category: product.category,
            user_id: userId,
            quantity: 1
        };

        navigate('/ordercomformation', {
            state: {
                user_id: userId,
                product_ids: [selectedItem.product_id],
                selectedProducts: [selectedItem],
                price: selectedItem.price
            }
        });
    };

    const displayProducts = (searchResults.length > 0 ? searchResults : products).map(item => ({
        ...item,
        img: typeof item.img === "string" ? JSON.parse(item.img) : item.img
    }));

    return (
        <div className="dashboard-page">
            <Navbar fixedTop={true} />

            <div className="container mt-5 pt-5">
                <div className="row g-4">
                    {displayProducts.length === 0 ? (
                        <div className="text-center mt-5">
                            <h5>No matching products found.</h5>
                        </div>
                    ) : (
                        displayProducts.map((product, index) => {
                            const isInWishlist = wishlistProductIds.includes(product.id.toString());
                            return (
                                <div className="col-md-4" key={product._id || index}>
                                    <div className="card h-100 shadow-sm position-relative">
                                        <div className="card-img-wrapper position-relative">
                                            <img
                                                src={
                                                    product?.img[0]?.startsWith("http")
                                                        ? product.img[0]
                                                        : `http://localhost:8080/Images/${product.img[0]}`
                                                }
                                                className="card-img-top product-img"
                                                alt={product.name} onClick={() => productDetails(product)}
                                            />


                                            <div
                                                className="favorite-icon"
                                                onClick={() => toggleWishlist(product.id)}
                                                style={{
                                                    color: isInWishlist ? "red" : "gray",
                                                    cursor: "pointer",
                                                    position: "absolute",
                                                    top: "10px",
                                                    right: "10px",
                                                    fontSize: "1.5rem"
                                                }}
                                            >
                                                {isInWishlist ? <FaHeart /> : <FaRegHeart />}
                                            </div>
                                        </div>

                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title">{product.name}</h5>
                                            <p className="card-text">{product.description || "No description available."}</p>
                                            <p className="card-text"><strong>Price:</strong> ₹{product.price}</p>
                                            <p className="card-text"><strong>Category:</strong> {product.category}</p>
                                            <div className="mt-auto d-flex justify-content-between">
                                                <div className="d-flex gap-3 mt-3">
                                                    <button className="btn btn-outline-primary" onClick={() => addtoCart(product)}>
                                                        <i className="bi bi-cart-plus me-2"></i> Add to Cart
                                                    </button>
                                                    <button className="btn btn-primary" onClick={() => moveconfrompage(product)}>
                                                        <i className="bi bi-lightning-fill me-2"></i> Buy Now
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <InfiniteScroll
                dataLength={products.length}
                next={fetchData}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={<p className="text-center mt-3">No more products to show.</p>}
            />

            <div className="loading-overlay" id="custom-loader" style={{ display: 'none' }}>
                <div className="loading-bar-container">
                    <div className="loading-bar"></div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;