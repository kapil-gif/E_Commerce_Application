import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); // Loader state
    async function handlesubmit(e) {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8080/user/login", {
                email,
                password
            });

            const { token, data, message } = response.data;

            if (!data || !token) {
                toast.error("Invalid login response");
                return;
            }

            const { id: userId, role: userRole, permissions } = data;

            localStorage.setItem("authtoken", token);
            localStorage.setItem("userId", userId);
            localStorage.setItem("userRole", userRole);
            localStorage.setItem("userPermissions", JSON.stringify(permissions));

            toast.success(message);

            // Navigate based on role
            const role = userRole.toLowerCase().trim();
            if (role === "admin") {
                navigate("/admin/userlist");
            } else if (role === "customer") {
                navigate("/dashboard");
            } else {
                toast.error("Unknown role. Contact support.");
            }
            console.log("responce api :", response);

        } catch (error) {
            console.log("Login error: ", error);

            // Safely access the HTTP status code
            const statusCode = error?.response?.status;
            // console.log("status code : ", statusCode);
            const message = error?.response?.data?.message || "Login failed. Please try again.";
            console.log("message : ", message);

            // toast.error("Account inactive. Wait for admin approval.");


            if (statusCode == 403) {
                toast.error("Account inactive. Wait for admin approval.");
            } else if (statusCode == 401) {
                toast.error("Invalid email or password.");
            } else {
                toast.error(message);
            }
        }

    }

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



            <div className="card p-4 shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
                <h3 className="text-center mb-4">Login to Your Account</h3>
                <form onSubmit={handlesubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 mt-2">
                        Login
                    </button>


                </form>
                <div className="text-center mt-3">
                    <small>
                        Don't have an account? <Link to="/signup">Sign up</Link>
                    </small>
                    <br></br>
                    <small>
                        password ? <Link to="/password/forget">forget</Link>
                    </small>

                </div>
            </div>
        </div>
    );
}

export default LoginForm;
