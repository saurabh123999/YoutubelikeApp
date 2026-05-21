import {asyncHandler} from "../utils/asyncHander.js";

const registerUser = asyncHandler(async (req , res)=>{
    res.status(200).json({
        message:"chai or code"
    })
})

export {registerUser}