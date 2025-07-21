import { useEffect, useState } from "react";
import "./orderConfirm.css";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../Navbar/Navbar";
import RazorpayPayment from "../Payment/RazorpayPayment";

function OrderConfirmation() {
    const token = localStorage.getItem("authtoken");
    const user_id = localStorage.getItem("userId");
    const navigate = useNavigate();
    const location = useLocation();

    const {
        selectedProducts = [],
        price = 0,
    } = location.state || {};

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        shipping_address: "",
        billing_address: "",
        payment_method: "cod",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitAfterPayment = async (paymentInfo = {}) => {
        setLoading(true);

        const orderData = {
            user_id,
            total_amount: price,
            shipping_address: form.shipping_address,
            billing_address: form.billing_address,
            payment_method: form.payment_method,
            razorpay_payment_id: paymentInfo.razorpay_payment_id || null,
        };

        try {
            const orderRes = await axios.post('http://localhost:8080/order/comformOrder', orderData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const createdOrderId = orderRes.data.responce.insertId;

            const orderItems = selectedProducts.map(product => ({
                order_id: createdOrderId,
                user_id,
                product_id: product.id || product._id || product.product_id,
                product_title: product.title,
                product_img: product.image || product.img || "".split(",")[0],
                quantity: product.quantity,
                price: product.price
            }));

            await axios.post('http://localhost:8080/order/inserdataorder', orderItems, {
                headers: { Authorization: `Bearer ${token}` },
            });

            for (const item of orderItems) {
                await axios.delete('http://localhost:8080/order/orderSucesRemoveCart', {
                    data: { product_id: item.product_id },
                    headers: { Authorization: `Bearer ${token}` },
                });
            }

            toast.success("Order placed successfully!");
            navigate('/dashboard');
        } catch (error) {
            toast.error("Order failed!");
            console.error("Order Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar fixedTop={true} />

            {/* Custom Loader Overlay */}
            {loading && (
                <div className="loader-overlay position-fixed w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: "rgba(255, 255, 255, 0.6)", zIndex: 1050 }}>
                    <div className="spinner-border text-primary" role="status" style={{ width: "4rem", height: "4rem" }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            <div className="container min-vh-100 d-flex align-items-center justify-content-center">
                <div className="row w-100 align-items-center">
                    <div className="col-md-6 d-flex justify-content-center mb-3 mb-md-0">
                        <img src="./order2.png" alt="Order" className="img-fluid" style={{ width: '100%', height: 'auto' }} />
                    </div>

                    <div className="col-md-6">
                        <div className="order-card shadow-lg animate__animated animate__fadeInUp">
                            <div className="card-header gradient-header text-center">
                                <h4 className="mb-0">🛒 Confirm Your Order</h4>
                            </div>
                            <div className="card-body">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        if (form.payment_method === "cod") {
                                            handleSubmitAfterPayment();
                                        } else {
                                            toast.info("Please complete the online payment first.");
                                        }
                                    }}
                                >
                                    <div className="mb-3">
                                        <label className="form-label">Shipping Address</label>
                                        <textarea
                                            name="shipping_address"
                                            className="form-control glass-input"
                                            rows="3"
                                            value={form.shipping_address}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Billing Address (optional)</label>
                                        <textarea
                                            name="billing_address"
                                            className="form-control glass-input"
                                            rows="2"
                                            value={form.billing_address}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="d-flex align-items-center justify-content-center mb-4 live-location-box">
                                        <div className="pulse-icon me-2">
                                            📍
                                        </div>
                                        <span className="text-muted fw-bold">Set to <Link to={'/map_location'}>Live location</Link> </span>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label d-block mb-2">Select Payment Method</label>
                                        <div className="d-flex flex-wrap gap-3 justify-content-start">
                                            {[{ label: "Cash on Delivery", value: "cod", icon: "💵" },
                                            { label: "Online Payment", value: "online", icon: "💳" }].map(method => (
                                                <div
                                                    key={method.value}
                                                    className={`payment-option ${form.payment_method === method.value ? 'active' : ''}`}
                                                    onClick={() => setForm(prev => ({ ...prev, payment_method: method.value }))}
                                                >
                                                    <span className="icon">{method.icon}</span>
                                                    <span className="label">{method.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-3 text-end">
                                        <h5 className="text-primary">Total: ₹{parseFloat(price).toFixed(2)}</h5>
                                    </div>

                                    <div className="text-end">
                                        {form.payment_method === 'cod' ? (
                                            <button type="submit" className="btn btn-gradient px-4 py-2" disabled={loading}>
                                                Confirm COD Order
                                            </button>
                                        ) : (
                                            <RazorpayPayment
                                                amount={price}
                                                onSuccess={handleSubmitAfterPayment}
                                                onFailure={(err) => console.error("Payment failed", err)}
                                            />
                                        )}
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OrderConfirmation;
