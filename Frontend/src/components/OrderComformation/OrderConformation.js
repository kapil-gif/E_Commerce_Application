import { useEffect, useState } from "react";
import "./orderConfirm.css";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import { toast } from "react-toastify";



function OrderConfirmation() {
    const token = localStorage.getItem("authtoken");
    const location = useLocation();
    const user_id = localStorage.getItem("userId");
    const navigate = useNavigate();
    const {
        selectedProducts = [],
        product_ids = [],
        price = 0,
        user_Id
    } = location.state || {};

    const [form, setForm] = useState({
        shipping_address: "",
        billing_address: "",
        payment_method: "cod",
    });

    //  Console Logs
    // console.log(" Order Confirmation Console Logs:");
    // console.log(" User ID:", user_id);
    // console.log(" Product IDs confirmation page:", product_ids);
    // console.log(" Total Price:", price);
    // console.log(" Selected Products:", selectedProducts);

    // selectedProducts.forEach((product, index) => {
    //     console.log(` Product ${index + 1}:`);
    //     console.log("   ID:", product.id || product._id || product.product_id);
    //     console.log("   Title:", product.title);
    //     console.log("   Quantity:", product.quantity);
    //     console.log("   Price per unit:", product.price);
    //     console.log("   Subtotal:", product.quantity * product.price);
    // });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const orderData = {
            user_id,
            total_amount: price,
            shipping_address: form.shipping_address,
            billing_address: form.billing_address,
            payment_method: form.payment_method
        };

        try {
            // 1. Submit order
            const orderResponse = await axios.post('http://localhost:8080/order/comformOrder', orderData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const createdOrderId = orderResponse.data.responce.insertId;

            // 2. Prepare order_items
            const orderItems = selectedProducts.map((product) => ({
                order_id: createdOrderId,
                user_id: user_id,
                product_id: product.id || product._id || product.product_id,
                product_title: product.title,
                product_img: product.image || product.product_img || product.img || "".split(",")[0],
                quantity: product.quantity,
                price: product.price
            }));

            // 3. Insert order_items
            await axios.post('http://localhost:8080/order/inserdataorder', orderItems, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // 4. Remove products from cart (one by one, correctly)
            for (const item of orderItems) {
                const product_id = item.product_id;

                await axios.delete('http://localhost:8080/order/orderSucesRemoveCart', {
                    data: { product_id },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }

            // 5. Final success
            toast.success("Order placed successfully!");
            navigate('/dashboard');

        } catch (error) {
            console.log("errror in cart remove order :", error);

            // toast.error("Something went wrong placing the order.");
        }
    };


    return (
        <div className="order-page">
            <div className="overlay"></div>
            <div className="container d-flex justify-content-center align-items-center min-vh-100">
                <div className="card order-card shadow-lg">
                    <div className="card-header">
                        <h4 className="mb-0">Order Confirmation</h4>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Shipping Address</label>
                                <textarea
                                    name="shipping_address"
                                    className="form-control"
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
                                    className="form-control"
                                    rows="2"
                                    value={form.billing_address}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label d-block">Payment Method</label>
                                {["cod", "credit_card", "paypal"].map(method => (
                                    <div className="form-check form-check-inline" key={method}>
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="payment_method"
                                            value={method}
                                            checked={form.payment_method === method}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label text-capitalize">{method.replace("_", " ")}</label>
                                    </div>
                                ))}
                            </div>
                            <hr />
                            <div className="mb-3">
                                <h5>Total Amount: ₹{price}</h5>
                            </div>
                            <div className="text-end">
                                <button type="submit" className="btn btn-success px-4">
                                    Confirm Order
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderConfirmation;
