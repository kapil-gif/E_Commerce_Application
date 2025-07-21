import pool from "../config/DbConnection.config.js";

export const paymentsave = (payment) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, status, user_id } = payment;

    const query = `
    INSERT INTO payments 
    (razorpay_order_id, razorpay_payment_id, razorpay_signature, status, user_id) 
    VALUES (?, ?, ?, ?, ?)
  `;

    const values = [razorpay_order_id, razorpay_payment_id, razorpay_signature, status, user_id];

    return new Promise((resolve, reject) => {
        pool.execute(query, values, (err, result) => {
            if (err) {
                console.log("Payment DB Save Error:", err);
                return reject(err);
            }
            console.log("Payment saved:", result);
            resolve(result);
        });
    });
};
