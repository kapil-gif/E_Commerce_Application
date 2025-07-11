import pool from "../config/DbConnection.config.js";


export function fetchdataprofile(id) {
    // console.log("user id in model :", id);

    const fetchdataquery = `select * from user where id=?`
    return new Promise((resolve, reject) => {
        pool.query(fetchdataquery, [id], (err, result) => {

            if (err) {
                return reject(err);
            }
            return resolve(result);
        })
    })
}


















