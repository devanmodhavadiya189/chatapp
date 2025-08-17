import mongoose from 'mongoose';
const messageschema = new mongoose.Schema(
    {
        senderid:
        {
            type : mongoose.Schema.Types.ObjectId,
            ref:"user",
            required:true
        },
        reciverid:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user",
            required:true
        },
        text:
        {
            type:String
        },
        file:
        {
            url: { type: String },
            mimetype: String,
            filename: String,
            size: Number
        },
        seen:
        {
            type: Boolean,
            default: false
        },
        seenAt:
        {
            type: Date
        }
    },
    {
        timestamps:true
    }
);

messageschema.pre('validate', function(next) {
  if (!this.text && !this.file?.url) {
    next(new Error("Message must contain text or a file"));
  } else {
    next();
  }
});


const Message = mongoose.model("Message",messageschema)

export default Message;