import { fetchdataprofile } from "../models/profile.model.js";


export const profileupdate = async (req, res) => {
    try {
        const id = req.query.user_id;
        //console.log("user id in controler :", id);

        const fetchprofiledata = await fetchdataprofile(id);
        // console.log("fetchprofiledata", fetchprofiledata);

        if (fetchprofiledata) {
            res.status(200).json({
                succuss: true,
                code: "200",
                message: "user data fetch the detials",
                fetchprofiledata
            })
        }
    } catch (error) {
        console.log("Error controller ", error);
        res.status(500).json({
            succuss: false,
            code: "500",
            message: "user data  not fetch the detials",
            error
        })
    }
}









