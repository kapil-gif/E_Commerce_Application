// components/Admincomponents/PendingUsers.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../Navbar/Navbar";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Userlist.css"; // Update this too

function UserList() {
    const [users, setUsers] = useState([]);
    const token = localStorage.getItem("authtoken");

    const fetchPendingUsers = async () => {
        try {
            const res = await axios.get("http://localhost:8080/admin/pending-users", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data.users || []);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            toast.error("Could not fetch pending users");
        }
    };

    const activateUser = async (id) => {
        try {
            await axios.put(`http://localhost:8080/admin/activate-user/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("User activated successfully!");
            fetchPendingUsers();
        } catch (error) {
            console.error("Error activating user:", error);
            toast.error("Failed to activate user");
        }
    };

    const inActivateUser = async (id) => {
        try {
            await axios.put(`http://localhost:8080/admin/inactivate_user`, { id }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("User inactivated successfully!");
            fetchPendingUsers();
        } catch (error) {
            console.error("Error inactivating user:", error);
            toast.error("Failed to inactivate user");
        }
    };

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    return (
        <>
            <Navbar fixedTop={true} />
            <div className="container mt-5 pt-5">
                <div className="card glass-effect shadow-lg border-0 animate__animated animate__fadeIn">
                    <div className="card-body">
                        <h2 className="mb-4 text-center text-gradient">
                            <i className="bi bi-people-fill me-2"></i>Pending Users
                        </h2>

                        {users.length > 0 && (
                            <div className="alert alert-info text-center animate__animated animate__fadeInDown">
                                Please  approve or reject the pending users.
                            </div>
                        )}

                        {users.length === 0 ? (
                            <div className="d-flex justify-content-center align-items-center mt-5">
                                <div className="card text-center border-0 shadow-lg no-users-card animate__animated animate__fadeInUp">
                                    <div className="card-body py-5 px-4">
                                        <i className="bi bi-patch-check-fill text-success display-3 mb-3"></i>
                                        <h4 className="card-title text-success">All Good! 🎉</h4>
                                        <p className="card-text text-muted">
                                            There are no pending users at the moment. Everyone is approved and active.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle rounded overflow-hidden">
                                    <thead className="table-dark text-uppercase">
                                        <tr>
                                            <th>S.no</th>
                                            <th><i className="bi bi-person-fill"></i> Name</th>
                                            <th><i className="bi bi-envelope-fill"></i> Email</th>
                                            <th><i className="bi bi-circle-fill"></i> Status</th>
                                            <th><i className="bi bi-person-check-fill"></i> Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user, index) => (
                                            <tr key={user.id} className="animate__animated animate__fadeInUp">
                                                <td>{index + 1}</td>
                                                <td>{user.full_name} {user.lastname}</td>
                                                <td>{user.email}</td>
                                                <td>
                                                    <span className="badge bg-warning text-dark">{user.status}</span>
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <button
                                                            className="btn btn-success btn-sm glow"
                                                            onClick={() => activateUser(user.id)}
                                                        >
                                                            <i className="bi bi-check-circle me-1"></i> Approve
                                                        </button>
                                                        <button
                                                            className="btn btn-danger btn-sm glow"
                                                            onClick={() => inActivateUser(user.id)}
                                                        >
                                                            <i className="bi bi-x-circle me-1"></i> Reject
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserList;
