
import pool from "../config/DbConnection.config.js";

// Get all pending users
export const fetchPendingUsers = () => {
    const query = "SELECT * FROM user WHERE status = 'pending'";
    return new Promise((resolve, reject) => {
        pool.query(query, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// Activate a specific user by ID
export const activateUserById = (userId) => {
    const query = "UPDATE user SET status = 'active' WHERE id = ?";
    return new Promise((resolve, reject) => {
        pool.query(query, [userId], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

export const InactivateUserById = (Id) => {
    const query = "UPDATE user SET status ='Inactive' WHERE id = ?";
    return new Promise((resolve, reject) => {
        // console.log("user id model :", Id);
        pool.query(query, [Id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

export const getRoleNameById = (roleId) => {
    return new Promise((resolve, reject) => {
        const query = "SELECT name FROM roles WHERE id = ?";
        pool.query(query, [roleId], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result[0]); // Return first result (object with role_name)
        });
    });
};

export const fetchAllusers = () => {
    const fetchAlluser = `SELECT * FROM USER WHERE ROLE_ID = 2`;
    return new Promise((resolve, reject) => {
        pool.query(fetchAlluser, (err, result) => {
            if (err) {
                // console.log("error: ", err);
                return reject(err);
            }
            return resolve(result);
        });
    });
};
