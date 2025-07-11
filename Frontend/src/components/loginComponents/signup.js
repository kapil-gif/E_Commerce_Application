import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./signup.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function Signup({ handleSignup }) {
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile_no, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [roleId] = useState("2"); // Default role
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (password !== confirm) {
                alert("Passwords must match");
                return;
            }

            const res = await axios.post(
                'http://localhost:8080/user/signup',
                {
                    firstname,
                    lastname,
                    mobile_no,
                    email,
                    password,
                    roleId // Send role to backend
                }
            );

            alert("Account created successfully!");
            navigate("/login");
            // Optionally call a callback
            // handleSignup({ firstname, lastname, email, mobile_no, password, role });
        } catch (err) {
            console.error("API error:", err.response || err);
            alert("Signup failed: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="signup-page d-flex justify-content-center align-items-center vh-100">
            <form onSubmit={handleSubmit} className="signup-form bg-white p-4 rounded shadow">
                <h2 className="text-center mb-4">Sign Up</h2>

                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="First Name"
                        value={firstname}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Last Name"
                        value={lastname}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="tel"
                        className="form-control form-control-lg"
                        placeholder="Mobile number"
                        value={mobile_no}
                        onChange={(e) => setMobile(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="email"
                        className="form-control form-control-lg"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="password"
                        className="form-control form-control-lg"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <input
                        type="password"
                        className="form-control form-control-lg"
                        placeholder="Confirm Password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                    />
                </div>

                {/* No need to show role field in UI. Default is customer. */}

                <button type="submit" className="btn btn-primary btn-lg w-100">
                    Sign Up
                </button>

                <p className="mt-3 text-center">
                    Already have an account? <a href="/login">Sign in</a>
                </p>
            </form>
        </div>
    );
}
