import mongoose from "mongoose";

const userschema = new mongoose.Schema(
    {
        fullname:
        {
            type: String,
            required: true,
        },
        email:
        {
            type: String,
            required: true,
            unique: true,
        },
        password:
        {
            type: String,
            required: true,
            minlength: 8,
        },
        profilephoto:
        {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true
    }
);

const user = mongoose.model("user", userschema);
export default user;