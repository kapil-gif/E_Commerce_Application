import express from "express";
import { loginmodel, signupdata } from "../models/login.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// LOGIN CONTROLLER
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }
        const user = await loginmodel(email, password);
        //console.log("login controller api responce :", user);

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

        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
            role_id: user.role_id,
            permissions: user.permissions
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Login Successful",
            data: payload,
            token,
            user
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};


// SIGNUP CONTROLLER
export const signup = async (req, res) => {


    const { firstname, lastname, mobile_no, email, password, roleId } = req.body;
    // console.log(" res body data controller :", firstname, lastname, mobile_no, email, password, roleId);
    if (!firstname || !lastname || !mobile_no || !email || !password || !roleId) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const SignAPIRes = await signupdata(firstname, lastname, mobile_no, email, password, roleId);

        if (SignAPIRes) {
            return res.status(200).json({
                success: true,
                statusCode: 200,
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
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};
