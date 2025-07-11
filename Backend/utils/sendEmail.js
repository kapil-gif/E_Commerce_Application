
import nodemailer from "nodemailer";

export const sendEmailToAdmin = async (userData) => {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail', // or your SMTP provider
            auth: {
                user: process.env.ADMIN_EMAIL,  // e.g., yourappadmin@gmail.com
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

        // const mailOptions = {
        //     from: `"E-Commerce App" <${process.env.ADMIN_EMAIL}>`,
        //     to: process.env.ADMIN_NOTIFY_TO, // Admin email to notify
        //     subject: "New User Signup - Approval Needed",
        //     html: `
        //         <h3>New User Signup Request</h3>
        //         <p><strong>Name:</strong> ${userData.full_name} ${userData.last_name}</p>
        //         <p><strong>Email:</strong> ${userData.email}</p>
        //         <p><strong>Mobile:</strong> ${userData.mobile_no}</p>
        //         <p>Please login to the admin panel to approve this user.</p>
        //     `
        // };

        // await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Email send error:", error);
    }
};








