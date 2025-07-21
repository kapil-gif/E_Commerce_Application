import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";

const Passwordforeget = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    //const token = localStorage.getItem("authtoken");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email) return toast.error("Please enter your email.");
        try {
            setLoading(true);
            console.log("email fronehned :", email);

            await axios.post("http://localhost:8080/user/forget-password", { email });
            toast.success("OTP sent to your email.");
            setShowOtpModal(true); // open OTP modal
        } catch (err) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!otp || !newPassword || !confirmPassword) {
            return toast.error("Please fill in all fields.");
        }

        if (newPassword !== confirmPassword) {
            return toast.error("Passwords do not match.");
        }

        try {
            const res = await axios.put('http://localhost:8080/user/update_password', {
                email, otp,
                password: newPassword,
            });

            if (res.data.success) {
                toast.success("Password updated successfully.");
                setShowOtpModal(false);
            } else {
                toast.error(res.data.message || "Failed to update password.");
            }

        } catch (error) {
            const message = error?.response?.data?.message || "Something went wrong.";
            console.error("Password reset error:", error);
            toast.error(message);
        }
    };


    return (
        <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
                <h3 className="text-center mb-4">Forgot Password</h3>
                <form onSubmit={handleSendOtp}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Enter your registered email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? "Sending..." : "Send OTP"}
                    </button>
                </form>

                <div className="text-center mt-3">
                    <small>
                        Back to <Link to="/login">Login</Link>
                    </small>
                </div>
            </div>

            {/* OTP Modal */}
            <Modal show={showOtpModal} onHide={() => setShowOtpModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Verify OTP</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleResetPassword}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Enter OTP</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="6-digit code"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowOtpModal(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            Reset Password
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default Passwordforeget;
