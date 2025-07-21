import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./signup.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Signup() {
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile_no, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [roleId] = useState("2");
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false); // Loader state

    const validatePasswordStrength = (pwd) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return regex.test(pwd);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirm) {
            toast.error("Passwords do not match");
            return;
        }

        if (!validatePasswordStrength(password)) {
            toast.error("Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.");
            return;
        }

        try {
            setLoading(true); // Start loader

            const res = await axios.post("http://localhost:8080/user/signup", {
                firstname,
                lastname,
                mobile_no,
                email,
                password,
                roleId
            });

            toast.success("Account created successfully!", {
                onClose: () => navigate("/login"),
                autoClose: 2000
            });

        } catch (err) {
            const message = err.response?.data?.message || err.message;
            if (message.includes("duplicate") || message.code === 'ER_DUP_ENTRY') {
                toast.error("Email or mobile already registered.");
            } else {
                toast.error("Signup failed: " + message);
            }
        } finally {
            setLoading(false); // Stop loader
        }
    };

    return (
        <div className="signup-page d-flex justify-content-center align-items-center vh-100 position-relative">
            {loading && (
                <div className="loader-overlay">
                    <div
                        className="spinner-border text-primary"
                        role="status"
                        style={{ width: "4rem", height: "4rem" }}
                    >
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}


            <form
                onSubmit={handleSubmit}
                className="signup-form bg-white p-4 rounded shadow"
                style={{
                    minWidth: "360px",
                    opacity: loading ? 0.6 : 1,
                    pointerEvents: loading ? "none" : "auto",
                    transition: "opacity 0.3s"
                }}
            >


                <h2 className="text-center mb-4">Sign Up</h2>

                {/* All your input fields here remain the same */}
                {/* ... */}

                <div className="mb-3">
                    <input type="text" className="form-control form-control-lg" placeholder="First Name" value={firstname} onChange={(e) => setFirstName(e.target.value)} required />
                </div>

                <div className="mb-3">
                    <input type="text" className="form-control form-control-lg" placeholder="Last Name" value={lastname} onChange={(e) => setLastName(e.target.value)} required />
                </div>

                <div className="mb-3">
                    <input type="tel" className="form-control form-control-lg" placeholder="Mobile number" value={mobile_no} onChange={(e) => setMobile(e.target.value)} required />
                </div>

                <div className="mb-3">
                    <input type="email" className="form-control form-control-lg" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div className="mb-3 position-relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        className="form-control form-control-lg pe-5"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <span
                        className="position-absolute top-50 end-0 translate-middle-y me-3"
                        style={{ cursor: "pointer", zIndex: 5 }}
                        onClick={() => setShowPassword((prev) => !prev)}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>

                <div className="mb-4 position-relative">
                    <input
                        type={showConfirm ? "text" : "password"}
                        className="form-control form-control-lg pe-5"
                        placeholder="Confirm Password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                    />
                    <span
                        className="position-absolute top-50 end-0 translate-middle-y me-3"
                        style={{ cursor: "pointer", zIndex: 5 }}
                        onClick={() => setShowConfirm((prev) => !prev)}
                    >
                        {showConfirm ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>

                <button type="submit" className="btn btn-primary btn-lg w-100">
                    Sign Up
                </button>

                <p className="mt-3 text-center">
                    Already have an account? <a href="/login">Sign in</a>
                </p>
            </form>

            <ToastContainer position="top-right" />
        </div>
    );
}
