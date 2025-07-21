import express from "express";
import { loginmodel, signupdata, updatepassword, findUserByEmail } from "../models/login.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendEmailToAdmin } from "../utils/sendEmail.js";
import bcrypt from "bcrypt";
import { sentOTP } from "../utils/sendEmail.js"
dotenv.config();


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const user = await loginmodel(email); // Only email passed now

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        //  Compare plain password with hashed password
        //console.log(`password :${password} , user.password : ${user.password}`);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        if (user.status !== "active") {
            return res.status(403).json({
                code: "403",
                success: false,
                message: "Your account is not active. Please wait for admin approval.",
            });


        }

        const permissionArray = user.permissions
            ? user.permissions.split(",").map(p => p.trim())
            : [];

        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
            role_id: user.role_id,
            permissions: permissionArray
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            data: payload,
            token
        });

    } catch (error) {

        console.error("Login Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const signup = async (req, res) => {
    const { firstname, lastname, mobile_no, email, password, roleId } = req.body;

    if (!firstname || !lastname || !mobile_no || !email || !password || !roleId) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Strong password policy check
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            success: false,
            message:
                "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const SignAPIRes = await signupdata(firstname, lastname, mobile_no, email, hashedPassword, roleId);

        if (SignAPIRes) {
            //  Only send email if signup was successful
            await sendEmailToAdmin({
                full_name: firstname,
                last_name: lastname,
                email,
                mobile_no
            });

            return res.status(201).json({
                success: true,
                statusCode: 201,
                message: "Signup Successful",
                data: SignAPIRes
            });
        }

        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: "Signup Failed"
        });

    } catch (error) {
        console.error("Signup Error:", error);

        // Handle MySQL duplicate entry errors
        if (error.code === "ER_DUP_ENTRY") {
            if (error.sqlMessage.includes("mobile_no")) {
                return res.status(409).json({ success: false, message: "Mobile number already exists" });
            }
            if (error.sqlMessage.includes("email")) {
                return res.status(409).json({ success: false, message: "Email already exists" });
            }
            return res.status(409).json({ success: false, message: "Duplicate entry" });
        }

        return res.status(500).json({ success: false, message: "Server Error" });
    }
};





export const forgetpassword = async (req, res) => {
    try {
        const { email } = req.body;

        // 1. Validate email format
        if (!email) {
            return res.status(400).json({
                code: "400",
                success: false,
                message: "Invalid email format",
            });
        }

        // 2. Check if user exists
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({
                code: "404",
                success: false,
                message: "No account found with this email",
            });
        }


        const otp = Math.floor(1000 + Math.random() * 9000); // 4-digit OTP

        await sentOTP(email, otp);

        res.status(200).json({
            code: "200",
            success: true,
            message: "OTP has been sent to your email.",
        });

    } catch (error) {
        console.error("Forget password error:", error);
        res.status(500).json({
            code: "500",
            success: false,
            message: "Could not send OTP. Please try again later.",
        });
    }
};



export const updatePassword = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        // console.log("password :", password, email);

        const Salt = bcrypt.genSaltSync(10);
        const hascodepassword = await bcrypt.hash(password, Salt);

        // console.log("hashcode password ", hascodepassword);
        // console.log("password esend to model  :", email, hascodepassword);
        const Apiresupdatepassword = await updatepassword(email, hascodepassword);
        //console.log("respocnse api :", Apiresupdatepassword);

        if (Apiresupdatepassword && Apiresupdatepassword.affectedRows > 0) {
            res.status(200).json({
                code: "200",
                success: true,
                message: "Password reset successfully.",
                response: Apiresupdatepassword
            });
        } else {
            res.status(404).json({
                code: "404",
                success: false,
                message: "User not found or password unchanged."
            });
        }


    } catch (error) {
        console.log("error forget password controller : ", error);
        res.status(500).json({
            code: "500",
            success: false,
            message: "could not update the password  "

        })
    }


}
