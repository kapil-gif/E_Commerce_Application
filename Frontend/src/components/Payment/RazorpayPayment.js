// components/Payment/RazorpayPayment.jsx
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
//import dotenv from "dotenv";

function RazorpayPayment({ amount, onSuccess, onFailure }) {
    useEffect(() => {
        const loadRazorpayScript = () => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            document.body.appendChild(script);
        };
        loadRazorpayScript();
    }, []);

    const startPayment = async () => {
        try {
            const token = localStorage.getItem("authtoken");
            //console.log("token :", token, amount);

            const res = await axios.post(
                "http://localhost:8080/api/payment/create-order",
                { amount: amount * 100 }, // Amount in paisa
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const order = res.data.response;
            console.log("Order received:", res);

            const options = {
                key: "rzp_test_jX3x6atpuTWhMx", //  Your Razorpay test key
                amount: order.amount,       // Use amount from backend
                currency: order.currency,
                name: "Test Payment",
                order_id: order.id,         // Use backend order ID
                handler: function (response) {
                    console.log("Payment success:", response);
                    toast.success("Payment successful!");
                    onSuccess?.(response);
                },
                prefill: {
                    name: "Test User",
                    email: "test@example.com",
                    contact: "9999999999",
                },
                theme: {
                    color: "#3399cc"
                },
                enable_save: false
            };

            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", function (response) {
                console.log("Payment failed:", response.error);
                toast.error("Payment failed.");
                onFailure?.(response);
            });
            rzp.open();
        } catch (err) {
            console.error("Payment error:", err);
            toast.error("Payment error. Please try again.");
        }
    };

    return (
        <button className="btn btn-primary" onClick={startPayment}>
            Pay Now
        </button>
    );
}


export default RazorpayPayment;
