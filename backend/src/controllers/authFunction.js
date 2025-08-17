import user from "../models/user.model.js";
import bcrypt from "bcryptjs";
import util from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js";


const login = async (req, res) => {
    const data = req.body;
    console.log("New signin request:", data, "\n\n");
   
    try
    {
        const person = await user.findOne(
        {
            email : data.email
        });
        if(!person)
        {
            res.cookie("token","This_website_is_built_by_Devan_R_Modhavadiya_For_Testing_Learning_Purpose",
            {
                maxAge: 0
            });
            return res.status(404).json(
                {
                    message:"Invalid email or password"
                }
            )
        }
        else
        {
            const pass = await bcrypt.compare(data.password,person.password);
            if(!pass)
            {
                res.status(404).json(
                    {
                        message:"Invalid email or password"
                    }
                )
                return ;
            }
            util.gentoken(person._id,res);
            res.status(200).json(
                {
                    _id:person._id,
                    email:data.email,
                    profilephoto:person.profilephoto,
                    fullname:person.fullname 
                }
            )
        }
    }

    catch (err) 
    {
        console.log("Error occur while login" , err,"\n\n");
        res.status(500).json(
            {
                message :"Internal server error"
            }
        )
    }
}

const logout = (req, res) => {

    console.log(`Logout request from `,req.body,"\n\n");

    try
    {
        res.cookie("token","This_website_is_built_by_Devan_R_Modhavadiya_For_Testing_Learning_Purpose",
        {
            maxAge: 0
        });
        res.status(200).json(
            {
                message:"Logged Out SuccessFully"
            }
        )
    }
    catch(err)
    {
        console.log("Error Occur while logout" , err);
        res.status(500).json(
            {
                message:"Internal Server Error"
            }
        )
    }
}

const signup = async (req, res) => {


    const data = req.body;
    
    console.log("New sign up request:", data, "\n\n");

    if (!data || !data.email || !data.password || !data.fullname) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (!data || typeof data.email !== "string" || typeof data.password !== "string" || typeof data.fullname !== "string") {
        return res.status(400).json({ message: "Invalid or missing input fields" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }
   
    try {
        if (data.password.length < 8) {
            return res.status(400).json(
                {
                    message: "Password is too short",
                }
            )
        }

        const person = await user.findOne({ email: data.email })
        if (person) {
            return res.status(400).json(
                {
                    message: "User already exists",
                }
            )
        }

        const key = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(data.password, key);
        const newuser = new user(
            {
                fullname: data.fullname,
                email: data.email,
                password: hashedpassword
            }

        )
        if (newuser) {
            util.gentoken(newuser._id, res);
            await newuser.save();
            res.status(201).json(
                {
                    _id: newuser._id,
                    fullname: newuser.fullname,
                    email: newuser.email,
                    profilephoto: newuser.profilephoto
                }
            )
        }
        else {
            res.status(400).json(
                {
                    message: "Invalid Data . Please verify your input and try again"
                }
            )
        }
    }

    catch (err) {
        console.log("There is some error occur in Signup controller", err);
        res.status(500).json(
            {
                message: "Internal server error . Sorry for inconvenience We are trying to solve it as early as posible."
            })
    }
}

const updateprofile = async(req,res)=> {
    try
    {
        const data = req.body;
        const userid = req.user._id;
        const updateData = {};

        if (data.profilephoto) {
            
            let photoUrl = data.profilephoto;
            if (typeof data.profilephoto === 'object' && data.profilephoto.url) {
                photoUrl = data.profilephoto.url;
            }
            
            if (photoUrl && typeof photoUrl === 'string' && photoUrl.startsWith('data:')) {
                try {
                    const uploadresponse = await cloudinary.uploader.upload(photoUrl);
                    updateData.profilephoto = uploadresponse.secure_url;
                } catch (uploadError) {
                    console.log("Cloudinary upload failed:", uploadError);
                    throw uploadError;
                }
            } else if (photoUrl && typeof photoUrl === 'string') {
                updateData.profilephoto = photoUrl;
            }
        }

        if (data.fullname && data.fullname.trim()) {
            updateData.fullname = data.fullname.trim();
        }

        if (data.email && data.email.trim()) {
            const existingUser = await user.findOne({ email: data.email.trim(), _id: { $ne: userid } });
            if (existingUser) {
                return res.status(400).json({
                    message: "Email already exists"
                });
            }
            updateData.email = data.email.trim();
        }

        if (data.currentPassword && data.newPassword) {
            const currentUser = await user.findById(userid);
            if (!currentUser) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            const isPasswordValid = await bcrypt.compare(data.currentPassword, currentUser.password);
            if (!isPasswordValid) {
                return res.status(400).json({
                    message: "Current password is incorrect"
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(data.newPassword, salt);
            updateData.password = hashedPassword;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "No updates provided"
            });
        }

        const updateuser = await user.findByIdAndUpdate(
            userid,
            updateData,
            {
                new: true,
            }
        ).select("-password");

        return res.status(200).json(updateuser);
    }
    catch(err)
    {
        console.log("There is some error occur in update profile controller", err);
        res.status(500).json(
            {
                message: "Internal server error . Sorry for inconvenience We are trying to solve it as early as posible."
            })
    }
}

const checkauth = (req,res)=>{
    console.log("New check request reciverd",req.user);
   
    try
    {
        return res.status(200).json(req.user);
    }
    catch(err)
    {
        console.log("Error in check route" , err);
        res.status(500).json(
            {
                message: "Internal server error . Sorry for inconvenience We are trying to solve it as early as posible."
            }
        )
    }

}

export default { login, logout, signup, updateprofile , checkauth };