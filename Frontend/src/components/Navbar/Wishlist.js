import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import "./wishlist.css"
function Wishlist() {
    const [allProducts, setAllProducts] = useState([]);
    const [wishlistProductIds, setWishlistProductIds] = useState([]);

    const user_id = localStorage.getItem("userId");
    const token = localStorage.getItem("authtoken");

    const fetchWishlist = async () => {
        try {
            const wishlistRes = await axios.get("http://localhost:8080/wishlistproduct/fetchwishlist", {
                params: { user_id },
                headers: { Authorization: `Bearer ${token}` }
            });

            const wishlist = wishlistRes.data.fectchwishlistApi || [];
            // console.log("exist product : ", wishlist);

            // Extract products and product IDs
            const products = wishlist.map(item => item.productid || item); // adapt if structure differs
            const ids = wishlist.map(item => String(item.productid || item._id || item.id));

            setAllProducts(products);
            setWishlistProductIds(ids);

        } catch (error) {
            console.error("Error fetching wishlist data:", error);
        }
    };

    useEffect(() => {
        if (!user_id || !token) return;

        fetchWishlist();
        // toggleWishlist();
    }, [user_id, token]);

    const toggleWishlist = async (productId) => {
        const normalizedId = String(productId);
        const isWishlisted = wishlistProductIds.includes(normalizedId);

        try {
            if (isWishlisted) {
                await axios.delete('http://localhost:8080/wishlistproduct/removeproductwishlist', {
                    headers: { Authorization: `Bearer ${token}` },
                    data: { userid: user_id, productid: productId }
                });
                setWishlistProductIds(prev => prev.filter(id => id !== normalizedId));
                fetchWishlist();
            } else {
                await axios.post('http://localhost:8080/wishlistproduct/addtowishlist', {
                    userid: user_id,
                    productid: productId
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setWishlistProductIds(prev => [...prev, normalizedId]);
                fetchWishlist();
            }
        } catch (error) {
            console.error("Wishlist toggle error:", error);
        }
    };

    return (
        <>
            <Navbar fixedTop={true} />
            <div className="container mt-4">
                {allProducts.length === 0 ? (
                    <div className="empty-wishlist d-flex flex-column align-items-center justify-content-center text-center">
                        <img
                            src="https://cdn.dribbble.com/userupload/20690016/file/original-a6f6e18b0fba708e37637f70157b28c8.gif"
                            alt="Empty Wishlist"
                            className="empty-animation"
                        />
                        <h3 className="mt-4">Your wishlist is empty</h3>
                        <p className="text-muted">Start adding items you love 💖</p>
                    </div>
                ) : (
                    <div className="row">
                        {allProducts.map((item, index) => {
                            const productId = String(item.id || item._id);
                            const isWishlisted = wishlistProductIds.includes(productId);

                            return (
                                <div key={index} className="col-md-4 col-sm-6 mb-4">
                                    <div className="card h-100 shadow-sm">
                                        <img
                                            src={
                                                Array.isArray(item.img)
                                                    ? item.img[0]
                                                    : typeof item.img === "string"
                                                        ? JSON.parse(item.img)[0]
                                                        : "https://via.placeholder.com/250"
                                            }
                                            className="card-img-top"
                                            alt={item.title}
                                            style={{ objectFit: "cover", height: "250px" }}
                                        />

                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title">{item.title}</h5>
                                            <p className="card-text">Price: ₹{item.price}</p>
                                            <p className="card-text">Category: {item.category}</p>
                                            <div className="mt-auto d-flex justify-content-end">
                                                <i
                                                    className={`fa${isWishlisted ? 's' : 'r'} fa-heart`}
                                                    style={{
                                                        color: isWishlisted ? "red" : "#ccc",
                                                        fontSize: "20px",
                                                        cursor: "pointer"
                                                    }}
                                                    onClick={() => toggleWishlist(productId)}
                                                ></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>


        </>
    );
}

export default Wishlist;
