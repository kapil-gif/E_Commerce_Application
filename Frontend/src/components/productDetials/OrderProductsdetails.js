import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import CryptoJS from "crypto-js";
import "./OrderProductsDetails.css";

function OrderProductsDetails() {
    const { id } = useParams();
    const secretKey = "your-secret-key";
    const token = localStorage.getItem("authtoken");
    const [itemDetails, setItemDetails] = useState([]);

    useEffect(() => {
        async function fetchDetails() {
            try {
                const decrypted = CryptoJS.AES.decrypt(decodeURIComponent(id), secretKey);
                const orderItemId = decrypted.toString(CryptoJS.enc.Utf8);

                const { data } = await axios.get("http://localhost:8080/products/fetchsingleproductdetials", {
                    params: { orderItemId },
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (Array.isArray(data.fetchOrder)) {
                    setItemDetails(data.fetchOrder);
                }
            } catch (err) {
                console.error(err);
            }
        }

        fetchDetails();
    }, [id, token]);

    if (!itemDetails.length) {
        return (
            <>
                <Navbar fixedTop />
                <div className="container text-center mt-5">
                    Loading product details…
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar fixedTop />
            <div className="container mt-5 mb-5">
                <h3 className="text-center mb-4">Order Details</h3>

                {itemDetails.length > 0 && (
                    <div className="row">
                        {/* Left: Product List */}
                        <div className="col-md-8">
                            <div className="card shadow-sm p-4">
                                {itemDetails.map((item, index) => {
                                    const {
                                        product_img, product_title, price, quantity, total
                                    } = item;

                                    let imgSrc = "https://via.placeholder.com/250";
                                    try {
                                        if (Array.isArray(product_img)) imgSrc = product_img[0];
                                        else if (typeof product_img === "string") {
                                            const parsed = JSON.parse(product_img);
                                            if (Array.isArray(parsed)) imgSrc = parsed[0];
                                        }
                                    } catch (e) {
                                        console.warn("Invalid product_img:", e);
                                    }

                                    return (
                                        <div className="product-item row align-items-center mb-4 border-bottom pb-4" key={index}>
                                            <div className="col-md-4 col-12 mb-3 mb-md-0">
                                                <img src={imgSrc} className="img-fluid rounded product-img" alt={product_title} />
                                            </div>
                                            <div className="col-md-8 col-12">
                                                <h5 className="mb-2">{product_title}</h5>
                                                <p className="mb-1"><strong>Price:</strong> ₹{price}</p>
                                                <p className="mb-1"><strong>Quantity:</strong> {quantity}</p>
                                                <p className="text-success"><strong>Subtotal:</strong> ₹{total}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right: Order Info */}
                        <div className="col-md-4 mt-4 mt-md-0">
                            <div className="order-summary bg-light border rounded p-4 h-100">
                                <h5 className="mb-3">Order Information</h5>
                                <p><strong>Total Amount:</strong> ₹{itemDetails[0].total_amount}</p>
                                <p><strong>Payment Method:</strong> {itemDetails[0].payment_method}</p>
                                <p><strong>Shipping Address:</strong> {itemDetails[0].shipping_address}</p>
                                <p><strong>Billing Address:</strong> {itemDetails[0].billing_address}</p>
                                <p className="text-muted"><strong>Order Date:</strong> {itemDetails[0].created_at?.split("T")[0]}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );

}

export default OrderProductsDetails;
