import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import "./adminproduct.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { SearchContext } from '../../App.js';
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import NProgress from "nprogress";
import 'nprogress/nprogress.css';
import '../../App.css';


function AdminProduct() {
    const [products, setProducts] = useState([]);
    const { searchResults } = useContext(SearchContext);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);


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
        const userPermissions = localStorage.getItem("userPermissions");


        //console.log("userPermissions in dhasbard :", userPermissions);

        if (!storedUserId || !storedToken) {
            navigate("/login");

        } else if (!isCalled) {
            isCalled = true;
            fetchInitialData(storedUserId, storedToken);

        }

        return () => {
            isCalled = true;
        };
    }, []);



    const fetchInitialData = async (userId, token) => {
        fetchData(userId, token);
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



    const displayProducts = (searchResults.length > 0 ? searchResults : products).map(item => ({
        ...item,
        img: typeof item.img === "string" ? JSON.parse(item.img) : item.img
    }));

    return (
        <div >
            <Navbar fixedTop={true} />

            <div className="container mt-5 pt-5">
                <div className="row g-4">
                    {displayProducts.length === 0 ? (
                        <div className="text-center mt-5">
                            <h5>No matching products found.</h5>
                        </div>
                    ) : (
                        displayProducts.map((product, index) => {

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
                                        </div>

                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title">{product.title}</h5>
                                            <p className="card-text">{product.description || "No description available."}</p>
                                            <p className="card-text"><strong>Price:</strong> ₹{product.price}</p>
                                            <p className="card-text"><strong>Category:</strong> {product.category}</p>
                                            <div className="mt-auto d-flex justify-content-between">
                                                <div className="d-flex gap-3 mt-3">
                                                    <p className="text-muted">Click on card to view details</p>
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

export default AdminProduct;