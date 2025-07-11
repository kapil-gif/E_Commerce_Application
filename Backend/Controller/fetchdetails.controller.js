import { fecthdetails } from "../models/detailsfetch.model.js";
export const detailfecth = async (req, res) => {
    const product_id = req.body;
    //console.log("product_id :", product_id);
    const res_details = await fecthdetails(product_id);
    if (res_details) {
        //console.log("api responce product detsila fetch : ", res_details);

        return res.status(200).json({
            success: "true",
            code: "200",
            message: "fetch the detials",
            res_details
        })
    } else {
        return res.status(404).json({
            success: "false",
            code: "404",
            message: "Not fetch the detials",
        })
    }
    //console.log("response details :", res_details);

}












