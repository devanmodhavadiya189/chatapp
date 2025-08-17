import user from "../models/user.model.js";
import Message from "../models/message.model.js"
import claudinary from "../lib/cloudinary.js"

const getusersidebar = async(req,res)=>{
    try
    {
        const currentuser = req.user._id;
        const users = await user.find(
            {
                _id:
                {
                    $ne:currentuser
                }
            }
        ).select("-password");

        const usersWithUnseenCounts = await Promise.all(
            users.map(async (chatUser) => {
                const unseenCount = await Message.countDocuments({
                    senderid: chatUser._id,
                    reciverid: currentuser,
                    seen: false
                });
                
                return {
                    ...chatUser.toObject(),
                    unseenCount
                };
            })
        );

        res.status(200).json(usersWithUnseenCounts);


    }
    catch(err)
    {
        console.log("error in getusersidebar " , err,"\n\n")
        res.status(500).json(
            {
                message:"Internal server error. please try after some time",
            }
        )
    }
}

const getmessage = async (req,res)=>{
    try
    {
        const reciver = req.params.id;
        const sender = req.user._id;

        const messages = await Message.find(
            {
                $or:[
                    {
                        senderid:sender,
                        reciverid:reciver
                    },
                    {
                        senderid:reciver,
                        reciverid:sender
                    }
                ]
            }
        ).sort({ createdAt: 1 });
        
        await Message.updateMany(
            {
                senderid: reciver,
                reciverid: sender,
                seen: false
            },
            {
                seen: true,
                seenAt: new Date()
            }
        );
        
        try {
            const { emitMessagesSeen } = await import("../lib/socket.js");
            emitMessagesSeen(sender, reciver);
        } catch (e) {
            console.error("Socket emit for seen status failed", e);
        }
        
        res.status(200).json(messages);
    }
    catch(err)
    {
        console.log("error in get message route:\n",err,"\n\n");
        res.status(500).json(
            {
                message:"Internal server error. Please try after sometime"
            }
        )
    }
}

const uploadFile = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded"
            });
        }

        const base64Data = req.file.buffer.toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${base64Data}`;

        let resourceType = "auto";
        if (req.file.mimetype === 'application/pdf') {
            resourceType = "raw";
        }

        const uploadresponse = await claudinary.uploader.upload(dataURI, {
            resource_type: resourceType,
            folder: "chat-files",
            format: req.file.mimetype === 'application/pdf' ? 'pdf' : undefined,
        });

        const fileData = {
            url: uploadresponse.secure_url,
            mimetype: req.file.mimetype,
            filename: req.file.originalname,
            size: req.file.size,
            public_id: uploadresponse.public_id
        };

        res.status(200).json({
            message: "File uploaded successfully",
            file: fileData
        });

    } catch (err) {
        console.log("Error in uploadFile:", err);
        res.status(500).json({
            message: "Failed to upload file",
            error: err.message
        });
    }
};

const markMessagesSeen = async (req, res) => {
    try {
        const senderId = req.params.id;
        const receiverId = req.user._id;
        
        const result = await Message.updateMany(
            {
                senderid: senderId,
                reciverid: receiverId,
                seen: false
            },
            {
                seen: true,
                seenAt: new Date()
            }
        );
        
        try {
            const { emitMessagesSeen } = await import("../lib/socket.js");
            emitMessagesSeen(receiverId, senderId);
        } catch (e) {
            console.error("Socket emit for seen status failed", e);
        }
        
        res.status(200).json({
            message: "Messages marked as seen",
            updatedCount: result.modifiedCount
        });
    } catch (err) {
        console.log("Error in markMessagesSeen:", err);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

const sendmessage = async (req,res)=>
{
    try
    {
        const {text , file} = req.body || {};
        if(!text && !file)
        {
            return res.status(400).json(
                {
                    message:"Please provide either text or file to send a message or Both."
                }
            )
        }
        const reciver = req.params.id;
        const sender = req.user._id;
        let filedata = null;
        
        if(file)
        {
            if (file.url && !file.url.startsWith('data:')) {
                filedata = file;
            } else if (file.url && file.url.startsWith('data:')) {
                let resourceType = "auto";
                if (file.mimetype === 'application/pdf') {
                    resourceType = "raw";
                }

                const uploadresponse = await claudinary.uploader.upload(file.url, {
                    resource_type: resourceType,
                    folder: "chat-files",
                    format: file.mimetype === 'application/pdf' ? 'pdf' : undefined,
                });

                filedata = {
                    url: uploadresponse.secure_url,
                    mimetype: file.mimetype || 'application/octet-stream',
                    filename: uploadresponse.original_filename || file.filename,
                    size: uploadresponse.bytes || file.size,
                    public_id: uploadresponse.public_id
                };
            }
        }
        
        const newmessage = await Message.create({
            senderid: sender,
            reciverid: reciver,
            text: text || "",
            file: filedata
        });
        
        try {
            const { emitNewMessage } = await import("../lib/socket.js");
            await emitNewMessage({
                _id: newmessage._id,
                senderid: newmessage.senderid.toString(),
                reciverid: newmessage.reciverid.toString(),
                text: newmessage.text,
                file: newmessage.file,
                seen: newmessage.seen,
                createdAt: newmessage.createdAt
            });
        } catch (e) {
            console.error("socket emit failed", e);
        }

        res.status(201).json({
            message: "Message sent successfully",
        });
    }
    catch(err)
    {
        console.log("Error in sendmessage route:\n",err,"\n\n");
        res.status(500).json(
            {
                message:"Internal server error please try after some time"
            }
        )
    }
}

export default{getusersidebar,getmessage,sendmessage,uploadFile,markMessagesSeen}
