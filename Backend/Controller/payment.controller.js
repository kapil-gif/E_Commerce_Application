import razorpay from "../config/razorpay.congif.js"; // Make sure the filename is correct
import { paymentsave } from "../models/payment.model.js";
import crypto from "crypto";

export const createOrder = async (req, res) => {
    try {
        let amount = req.body.amount;

        // 💡 Ensure amount is converted to integer paise
        amount = Math.round(Number(amount) * 100); // e.g. 1998.99 => 199899

        console.log("Final amount in paise:", amount);

        const options = {
            amount: amount, // integer (paise)
            currency: "INR",
            receipt: `order_rcptid_${Math.floor(Math.random() * 10000)}`
        };

        const order = await razorpay.orders.create(options);

        return res.status(200).json({
            success: true,
            response: order
        });
    } catch (err) {
        console.error("Error creating Razorpay order:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to create Razorpay order",
            error: err.message
        });
    }
};


export const verify = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(sign)
        .digest("hex");

    const isAuthentic = razorpay_signature === expectedSign;

    if (isAuthentic) {
        const payment = {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            status: "paid",
            user_id: req.user?.id || null
        };

        try {
            await paymentsave(payment);
            return res.status(200).json({
                success: true,
                message: "Payment verified and saved successfully."
            });
        } catch (err) {
            console.error("Error saving payment:", err);
            return res.status(500).json({ success: false, message: "Error saving payment." });
        }
    } else {
        return res.status(400).json({
            success: false,
            message: "Invalid payment signature. Verification failed."
        });
    }
};
