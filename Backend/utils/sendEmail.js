
import { text } from "express";
import nodemailer from "nodemailer";

export const sendEmailToAdmin = async (userData) => {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.ADMIN_EMAIL,
                pass: process.env.ADMIN_EMAIL_PASS
            }
        });
        transporter.verify((error, success) => {
            if (error) {
                console.log("Email config error:", error);
            } else {
                console.log("Email transporter is ready");
            }
        });

        const mailOptions = {
            from: `"E-Commerce App" <${process.env.ADMIN_EMAIL}>`,
            to: process.env.ADMIN_NOTIFY_TO,
            subject: "New User Signup - Approval Needed",
            text: `User  has just signed up!`,
            html: `
                <h3>New User Signup Request</h3>
                <p><strong>Name:</strong> ${userData.full_name} ${userData.last_name}</p>
                <p><strong>Email:</strong> ${userData.email}</p>
                <p><strong>Mobile:</strong> ${userData.mobile_no}</p>
                <p>Please login to the admin panel to approve this user.</p>
            `
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Email send error:", error);
    }
};




export const sendEmailToUser = async (userdata) => {
    try {
        if (!Array.isArray(userdata) || userdata.length === 0) {
            console.error(" Invalid userdata array.");
            return;
        }

        const firstItem = userdata[0];

        const {
            full_name,
            last_name,
            email,
            mobile_no,
            shipping_address,
            billing_address,
            payment_method,
            total_amount
        } = firstItem;

        if (!email) {
            console.error(" Email is missing — cannot send email.");
            return;
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.ADMIN_EMAIL,
                pass: process.env.ADMIN_EMAIL_PASS
            }
        });

        // Format HTML rows for each product
        const productRows = userdata.map(p => {
            const image = JSON.parse(p.product_img)[0]; // Parse image from JSON string
            return `
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">
                        ${p.product_title}<br/>
                        <img src="${image}" alt="Product Image" width="80"/>
                    </td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${p.quantity}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">₹${p.price}</td>
                </tr>
            `;
        }).join('');

        const mailOptions = {
            from: `"E-Commerce App" <${process.env.ADMIN_EMAIL}>`,
            to: email,
            subject: "🧾 Your Order Confirmation - E-Commerce App",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #4CAF50;">Thank you for your order!</h2>
                    <p>Hello <strong>${full_name} ${last_name}</strong>,</p>
                    <p>We have received your order and it's being processed. Here are the details:</p>

                    <h3 style="margin-top: 20px;">🛒 Order Summary</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                        <thead>
                            <tr style="background-color: #f2f2f2;">
                                <th style="border: 1px solid #ddd; padding: 8px;">Product</th>
                                <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
                                <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${productRows}
                        </tbody>
                    </table>

                    <h3 style="margin-top: 30px;">📦 Shipping & Payment Info</h3>
                    <p><strong>Name:</strong> ${full_name} ${last_name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Mobile:</strong> ${mobile_no}</p>
                    <p><strong>Shipping Address:</strong> ${shipping_address}</p>
                    <p><strong>Billing Address:</strong> ${billing_address}</p>
                    <p><strong>Payment Method:</strong> ${payment_method}</p>
                    <p><strong>Total Amount:</strong> ₹${total_amount}</p>

                    <p style="margin-top: 30px;">We’ll notify you once your order is shipped.</p>
                    <p style="color: #999;">If you have any questions, just reply to this email.</p>

                    <hr style="margin-top: 40px;"/>
                    <p style="font-size: 12px; color: #999;">E-Commerce App Team</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        //console.log(" Order confirmation email sent to:", email);

    } catch (error) {
        console.error(" Email send error:", error);
    }
};


export const sentOTP = async (email, otp) => {
    console.log("in util emial otp :", email, otp);

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.ADMIN_EMAIL,
                pass: process.env.ADMIN_EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"E-Commerce App" <${process.env.ADMIN_EMAIL}>`,
            to: email,
            subject: "Reset Your Password - OTP Inside",
            html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 30px;">
                <h2 style="color: #4a90e2; text-align: center;">Password Reset Request</h2>
                <p style="font-size: 16px; color: #333;">Hi,</p>
                <p style="font-size: 16px; color: #333;">
                    We received a request to reset the password for your account. Please use the OTP below to proceed:
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <span style="display: inline-block; background-color: #f1f1f1; color: #111; font-size: 24px; letter-spacing: 4px; padding: 15px 25px; border-radius: 6px; font-weight: bold;">
                        ${otp}
                    </span>
                </div>
                <p style="font-size: 16px; color: #333;">
                    This OTP is valid for the next 10 minutes. If you did not request this, you can safely ignore this email.
                </p>
                <p style="font-size: 16px; color: #333;">Thanks,<br/>The E-Commerce Team</p>
                <hr style="margin-top: 30px;"/>
                <p style="font-size: 12px; color: #aaa; text-align: center;">
                    &copy; ${new Date().getFullYear()} E-Commerce App. All rights reserved.
                </p>
            </div>
        </div>
    `
        };
        await transporter.sendMail(mailOptions);

    } catch (error) {
        console.log("email error: ", error);

    }
}




