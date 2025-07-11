// // components/Admincomponents/PendingUsers.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// import AdminNavbar from "./adminNavbar";

// function PendingUsers() {
//     const [users, setUsers] = useState([]);

//     const fetchPendingUsers = async () => {
//         const token = localStorage.getItem("authtoken");

//         try {
//             const res = await axios.get("http://localhost:8080/admin/pending-users", {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setUsers(res.data.users || []);
//         } catch (error) {
//             console.error("Failed to fetch users:", error);
//             toast.error("Could not fetch pending users");
//         }
//     };

//     const activateUser = async (id) => {
//         const token = localStorage.getItem("authtoken");

//         try {
//             await axios.put(`http://localhost:8080/admin/activate-user/${id}`, {}, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             toast.success("User activated successfully");
//             fetchPendingUsers(); // Refresh list
//         } catch (error) {
//             console.error("Error activating user:", error);
//             toast.error("Failed to activate user");
//         }
//     };

//     useEffect(() => {
//         fetchPendingUsers();
//     }, []);

//     return (
//         <>
//             <AdminNavbar fixedTop={true} />
//             <div className="container mt-5 pt-5">
//                 <h2 className="mb-4">Pending Users</h2>
//                 {users.length === 0 ? (
//                     <p>No pending users.</p>
//                 ) : (
//                     <table className="table table-bordered shadow">
//                         <thead className="table-light">
//                             <tr>
//                                 <th>ID</th>
//                                 <th>Name</th>
//                                 <th>Email</th>
//                                 <th>Status</th>
//                                 <th>Activate</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {users.map((user) => (
//                                 <tr key={user.id}>
//                                     <td>{user.id}</td>
//                                     <td>{user.firstname} {user.lastname}</td>
//                                     <td>{user.email}</td>
//                                     <td>{user.status}</td>
//                                     <td>
//                                         <button
//                                             className="btn btn-success btn-sm"
//                                             onClick={() => activateUser(user.id)}
//                                         >
//                                             Approve
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 )}
//             </div>
//         </>
//     );
// }

// export default PendingUsers;
