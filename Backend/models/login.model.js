
import pool from "../config/DbConnection.config.js"

export const loginmodel = (email) => {
    return new Promise((resolve, reject) => {
        const getUserQuery = `
            SELECT 
                u.id,
                u.full_name,
                u.last_name,
                u.mobile_no,
                u.email,
                u.password,  -- include hashed password
                u.status,
                u.role_id,
                r.name AS role,
                GROUP_CONCAT(p.name) AS permissions
            FROM user u
            JOIN roles r ON u.role_id = r.id
            LEFT JOIN role_permissions rp ON rp.role_id = r.id
            LEFT JOIN permissions p ON rp.permission_id = p.id
            WHERE u.email = ?
            GROUP BY u.id;
        `;

        pool.query(getUserQuery, [email], (err, result) => {
            if (err) {
                reject(err);
            } else {
                //console.log("result in model login : ", result);
                resolve(result[0]);  // Return first user
            }
        });
    });
};


export const signupdata = (full_name, last_name, mobile_no, email, password) => {
    //console.log(" insert data in model :", full_name, last_name, mobile_no, email, password);

    const signupdataquery = `INSERT INTO user (full_name, last_name, mobile_no, email, password)
VALUES (?, ?, ?, ?, ?)`;

    return new Promise((resolve, reject) => {
        pool.execute(signupdataquery, [full_name, last_name, mobile_no, email, password], (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    })
}

export const updatepassword = (email, hascodepassword) => {
    console.log("update password model:", email, hascodepassword);

    const updatequery = `UPDATE user SET password = ? WHERE email = ?`;
    return new Promise((resolve, reject) => {
        pool.query(updatequery, [hascodepassword, email], (err, result) => {
            if (err) {
                return reject(err);
            }
            console.log("result :", result);
            return resolve(result);
        });
    });
};

export const findUserByEmail = (email) => {
    const query = `SELECT * FROM user WHERE email = ?`;
    return new Promise((resolve, reject) => {
        pool.query(query, [email], (err, result) => {
            if (err) return reject(err);
            resolve(result[0]);
        });
    });
};


