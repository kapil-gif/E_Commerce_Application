import express from "express";
import { loginmodel, signupdata } from "../models/login.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
//import { sendEmailToAdmin } from "../utils/sendEmail.js"
dotenv.config();

// ================== LOGIN CONTROLLER ==================
// LOGIN CONTROLLER
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        //console.log("req.body login controller :", email, password);

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const user = await loginmodel(email, password);
        // console.log("login Api responce controller:", user);

        if (!user || !user.id) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        if (user.status !== "active") {
            return res.status(403).json({
                success: false,
                message: "Your account is not active. Please wait for admin approval.",
                data: user,
                token: null,
            });
        }

        // Convert permission string to array
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
            statusCode: 200,
            message: "Login Successful",
            data: payload,
            token

        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};


// ================== SIGNUP CONTROLLER ==================
// adjust path as needed

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
        const SignAPIRes = await signupdata(firstname, lastname, mobile_no, email, password, roleId);


        // Send email to admin
        // await sendEmailToAdmin({
        //     full_name: firstname,
        //     last_name: lastname,
        //     email,
        //     mobile_no
        // });

        if (SignAPIRes) {
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

