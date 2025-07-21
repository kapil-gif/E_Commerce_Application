import { toast } from "react-toastify";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import { useEffect, useState } from "react";
//import "animate.css";

const AllUserList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const fetchPendingUsers = async () => {
        const token = localStorage.getItem("authtoken");
        try {
            const res = await axios.get("http://localhost:8080/admin/allusers", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data.data || []);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            toast.error("Could not fetch pending users");
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "active":
                return <span className="badge bg-success">Active</span>;
            case "pending":
                return <span className="badge bg-warning text-dark">Pending</span>;
            case "inactive":
                return <span className="badge bg-secondary">Inactive</span>;
            default:
                return <span className="badge bg-dark">Unknown</span>;
        }
    };

    return (
        <>
            <Navbar fixedTop={true} />

            <div className="container py-5">
                <div className="card shadow border-0 animate__animated animate__fadeIn">
                    <div className="card-header bg-dark text-white text-center">
                        <h4 className="mb-0">
                            <i className="bi bi-people-fill me-2"></i>All Registered Users
                        </h4>
                    </div>

                    <div className="card-body">
                        {users.length === 0 ? (
                            <p className="text-center text-muted mb-0">No users found 🎉</p>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-bordered table-hover align-middle mb-0">
                                    <thead className="table-light text-uppercase">
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col"><i className="bi bi-person-fill"></i> Name</th>
                                            <th scope="col"><i className="bi bi-envelope-fill"></i> Email</th>
                                            <th scope="col"><i className="bi bi-circle-fill"></i> Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user, index) => (
                                            <tr key={user.id} className="animate__animated animate__fadeInUp">
                                                <td>{index + 1}</td>
                                                <td>{user.full_name} {user.last_name || ""}</td>
                                                <td>{user.email}</td>
                                                <td>{getStatusBadge(user.status)}</td>
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
};

export default AllUserList;
