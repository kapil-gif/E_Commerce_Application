import pool from "../config/DbConnection.config.js"

export const loginmodel = (email, password) => {

    return new Promise((resolve, reject) => {
        const getUserQuery = `
  SELECT 
    u.id,
    u.full_name,
    u.last_name,
    u.mobile_no,
    u.email,
    u.status,
    u.role_id,
    r.name AS role,
    GROUP_CONCAT(p.name) AS permissions
  FROM user u
  JOIN roles r ON u.role_id = r.id
  JOIN role_permissions rp ON rp.role_id = r.id
  JOIN permissions p ON rp.permission_id = p.id
  WHERE u.email = ? AND u.password = ?
  GROUP BY u.id;
`;

        // console.log("email pasword in model login :", email, password);
        pool.query(getUserQuery, [email, password], (err, result) => {
            if (err) {
                reject(err);
            } else {
                //console.log("result in model login : ", result);
                resolve(result);
            }

        });
    }).then(Response => {
        return Response[0];
    }).catch(err => {
        return err;
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