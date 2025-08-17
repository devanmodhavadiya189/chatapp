import jwt from "jsonwebtoken";
import user from "../models/user.model.js";

const protectroute = async (req,res,next) => {

    try
    {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];;
        if(!token)
        {
            return res.status(401).json(
                {
                    message:"Unauthorized request. If this error persists, please logout and login again."
                }
            )
        }
        const decoded = jwt.verify(token , process.env.jwt_secret);
        if(!decoded)
        {
            return res.status(401).json(
                {
                    message:"Unauthorized request. If this error persists, please logout and login again."
                });
        }
        const person = await user.findById(decoded.userid).select("-password");
        if(!person)
        {
            return res.status(404).json(
                {
                    message:"User Not Found.If this error persists, please logout and login again.",
                    
                }
            )
        }
        req.user = person;
        next();
    }
    catch(err)
    {
        if(err.name === "TokenExpiredError")
        {
         return res.status(401).json({msg:"Token expired, please login again"});
        }
         console.log("Error Occur in protect route" , err);
        res.status(500).json(
            {
                message:"Internal server Error"
            }
        )
    }
}

const logRequest = (req, res, next) => {
  next();
};


export default {protectroute,logRequest};