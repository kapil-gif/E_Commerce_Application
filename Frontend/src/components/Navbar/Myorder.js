import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import './myorder.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import * as bootstrap from 'bootstrap';

function Myorder() {
    window.bootstrap = bootstrap;
    const user_id = localStorage.getItem("userId");
    const token = localStorage.getItem("authtoken");

    const [orders, setOrders] = useState([]);
    const [orderToCancel, setOrderToCancel] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await axios.get("http://localhost:8080/products/fetchMyorder", {
                headers: { Authorization: `Bearer ${token}` },
                params: { userid: user_id }
            });

            setOrders(res.data.orders || []);
        } catch (err) {
            console.error("Error fetching orders:", err);
            toast.info(err.response?.data?.message || "Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token && user_id) fetchOrders();
    }, [user_id, token]);

    const confirmRemove = (orderId) => {
        setOrderToCancel(orderId);
        const modal = new window.bootstrap.Modal(document.getElementById("confirmModal"));
        modal.show();
    };

    const handleConfirmCancel = () => {
        if (!orderToCancel) return;
        handleCancelOrder(orderToCancel);
        setOrderToCancel(null);
    };

    const handleCancelOrder = async (orderId) => {
        try {
            setLoading(true);
            await axios.delete("http://localhost:8080/order/cancleorder", {
                params: { orderId: orderId },
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Order cancelled successfully");
            fetchOrders();
        } catch (error) {
            console.error("Cancel order failed:", error);
            toast.error("Failed to cancel order");
        } finally {
            setLoading(false);
        }
    };

    const handleOrderDetails = (order) => {
        const secretKey = "your-secret-key";
        const encrypted = CryptoJS.AES.encrypt(String(order.order_id), secretKey).toString();
        const encoded = encodeURIComponent(encrypted);
        navigate(`/orderproductsdetails/${encoded}`);
    };

    return (
        <>
            <Navbar fixedTop={true} />

            {loading && (
                <div className="loader-overlay">
                    <div className="loader-spinner"></div>
                </div>
            )}

            <div className="container py-5" style={{ marginTop: "5rem" }}>
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <div
                            className="card mb-5 border-0 shadow-lg rounded-4 animate__animated animate__fadeIn"
                            key={order.order_id}
                            style={{
                                transition: "transform 0.3s ease",
                                background: "#ffffff",
                                border: "1px solid #e3e6f0",
                            }}
                        >
                            <div
                                className="d-flex justify-content-between align-items-center px-4 py-3 rounded-top-4"
                                style={{
                                    background: "linear-gradient(135deg, rgb(101, 155, 237), rgb(131, 214, 239))",
                                    color: "#fff",
                                    boxShadow: "inset 0 -2px 8px rgba(0, 0, 0, 0.1)",
                                }}
                            >
                                <div>
                                    <h5 className="mb-1 fw-bold">🧾 Order #{order.order_id}</h5>
                                    <small className="d-block text-light" style={{ opacity: 0.9 }}>
                                        📅 {new Date(order.created_at).toLocaleDateString()}
                                    </small>
                                </div>

                                <button
                                    className="btn btn-sm btn-outline-light d-flex align-items-center gap-1 px-3 fw-semibold"
                                    onClick={() => confirmRemove(order.order_id)}
                                >
                                    ❌ <span className="d-none d-md-inline">Cancel Order</span>
                                </button>
                            </div>

                            <div className="card-body">
                                <div
                                    className="d-flex overflow-auto gap-3 py-3 px-2"
                                    style={{
                                        scrollSnapType: "x mandatory",
                                        scrollbarWidth: "thin",
                                    }}
                                >
                                    {order.products.map((item, index) => {
                                        const img = Array.isArray(item.product_img)
                                            ? item.product_img[0]
                                            : typeof item.product_img === "string"
                                                ? JSON.parse(item.product_img)[0]
                                                : "https://via.placeholder.com/200";

                                        return (
                                            <div
                                                key={index}
                                                className="card border-0 shadow-sm rounded-4 p-2 bg-light"
                                                style={{
                                                    minWidth: "180px",
                                                    scrollSnapAlign: "center",
                                                    transition: "transform 0.3s ease",
                                                }}
                                            >
                                                <div
                                                    className="overflow-hidden rounded-3 position-relative"
                                                    style={{ height: "140px" }}
                                                >
                                                    <img
                                                        src={img}
                                                        alt={item.product_title}
                                                        className="img-fluid w-100 h-100"
                                                        style={{
                                                            objectFit: "cover",
                                                            transition: "transform 0.3s ease",
                                                        }}
                                                        onMouseOver={(e) =>
                                                            (e.currentTarget.style.transform = "scale(1.05)")
                                                        }
                                                        onMouseOut={(e) =>
                                                            (e.currentTarget.style.transform = "scale(1)")
                                                        }
                                                    />
                                                </div>
                                                <div className="mt-2 text-center">
                                                    <small
                                                        className="fw-bold text-dark d-block text-truncate"
                                                        title={item.product_title}
                                                    >
                                                        {item.product_title}
                                                    </small>
                                                    <small className="text-muted d-block">
                                                        Qty: {item.quantity || 1}
                                                    </small>
                                                    <small className="text-success fw-semibold">
                                                        ₹{item.price}
                                                    </small>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <p className="mb-0 text-dark fw-bold">
                                        🛍️ Total Items: {order.products.length}
                                    </p>
                                    <button
                                        className="btn btn-outline-primary btn-sm fw-semibold"
                                        onClick={() => handleOrderDetails(order)}
                                    >
                                        🔍 View Order Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div
                        className="text-center py-5 animate__animated animate__fadeInUp"
                        style={{
                            background: "linear-gradient(145deg, #e0e5ec, #ffffff)",
                            borderRadius: "20px",
                            boxShadow: "20px 20px 60px #d1d9e6, -20px -20px 60px #ffffff",
                            marginTop: "50px",
                            padding: "60px 20px",
                            transition: "all 0.4s ease",
                        }}
                    >
                        <img
                            src="https://cdn.dribbble.com/users/317817/screenshots/5587216/media/1a37c6c45bcd0d310a91ae4e20e8ed3c.gif"
                            alt="Empty Orders"
                            className="img-fluid mb-4"
                            style={{ maxWidth: "300px" }}
                        />
                        <h3 className="fw-bold text-primary">You haven’t placed any orders yet!</h3>
                        <p className="text-muted fs-5">
                            When you do, they’ll appear right here. Let’s go shopping! 🛒
                        </p>
                        <a href="/dashboard" className="btn btn-primary btn-lg mt-3 px-4 rounded-3 shadow-sm">
                            🛍️ Browse Products
                        </a>
                    </div>
                )}

                {/* Cancel Order Modal */}
                <div
                    className="modal fade"
                    id="confirmModal"
                    tabIndex="-1"
                    aria-labelledby="confirmModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-3">
                            <div className="modal-header bg-warning">
                                <h5 className="modal-title fw-bold" id="confirmModalLabel">
                                    Cancel Order
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to cancel this order?
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    No
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    data-bs-dismiss="modal"
                                    onClick={handleConfirmCancel}
                                >
                                    Yes, Cancel Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Myorder;
