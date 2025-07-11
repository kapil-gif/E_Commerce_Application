
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handlesubmit(e) {
        e.preventDefault();

        const getuser = { email, password };
        //console.log("login data user :", getuser);

        try {
            const response = await axios.post("http://localhost:8080/user/login", getuser);
            //console.log("login api responce response.data.data.rolle_id:", response.data);
            const roleId = response.data.data.role_id;
            const { token, data, message } = response.data;

            if (!data || !token) {
                toast.error("Invalid login response");
                return;
            }
            // console.log("permissions calling api :", response.data.data.permissions);

            // const findRoleresponse = await axios.get(`http://localhost:8080/admin/role`, {
            //     params: { roleId },
            //     headers: {
            //         Authorization: `Bearer ${token}`
            //     }
            // });
            //console.log("api find role api :", findRoleresponse.data.role);


            const user_Id = data.id;
            const userRole = response.data.data.role;
            const userPermissions = response.data.data.permissions;
            //console.log("User userPermissions:", userPermissions);

            localStorage.setItem("authtoken", token);
            localStorage.setItem("userId", user_Id);
            localStorage.setItem("userRole", userRole);
            localStorage.setItem("userPermissions", JSON.stringify(userPermissions));
            toast.success(message);

            // setTimeout(() => {
            //     window.location.href = "/dashboard";  // full reload to re-evaluate ProtectRoute
            // }, 100);

            //navigate("/dashboard");
            if (userRole?.toLowerCase().trim() === "admin") {
                navigate("/admin/userlist");
            } else if (userRole?.toLowerCase().trim() === "customer") {
                console.log("in Custmor ");
                navigate("/dashboard");
            } else {
                toast.error("Unknown role. Contact support.");
            }


        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.response?.data?.message || "Login failed. Try again.");
            console.error("Error fetching role:", error.findroleresponse?.data || error.message);
        }
    }

    return (
        <div className="login-page d-flex justify-content-center align-items-center vh-100">
            <form onSubmit={handlesubmit} className="login-form bg-white p-4 rounded shadow">
                <h2 className="text-center mb-4">Login</h2>

                <div className="mb-3">
                    <input
                        type="email"
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control form-control-lg"
                        placeholder="Email"
                        required
                    />
                </div>

                <div className="mb-4">
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control form-control-lg"
                        placeholder="Password"
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary btn-lg w-100">
                    Login
                </button>

                <p className="mt-3 text-center">
                    <a href="/signup">Signup</a>
                </p>
            </form>
        </div>
    );
}

export default LoginForm;


