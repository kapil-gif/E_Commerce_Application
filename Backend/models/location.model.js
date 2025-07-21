
import pool from "../config/DbConnection.config.js";

// Insert a new location
export const insertLocation = (name, latitude, longitude) => {
    console.log("insert location model :", name, latitude, longitude);

    const sql = "INSERT INTO locations (name, latitude, longitude) VALUES (?, ?, ?)";
    return new Promise((resolve, reject) => {
        pool.query(sql, [name, latitude, longitude], (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    })
};

// Fetch all locations
export const getAllLocations = () => {
    //console.log("get Allllocation model :", callback);
    const selectsql = "SELECT * FROM locations";
    return new Promise((resolve, reject) => {
        pool.query(selectsql, (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    })
};
