import { Server } from "socket.io";
import Message from "../models/message.model.js";

let ioInstance = null;
const onlineUsers = new Map();

export function setupSocket(server) {
  const allowedOrigins = [
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "https://chatapp-4vr7.onrender.com"
  ];

  if (process.env.CLIENT_URL) {
    allowedOrigins.push(process.env.CLIENT_URL);
  }
  if (process.env.NODE_ENV === 'production' && process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }

  ioInstance = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
      methods: ["GET", "POST"]
    }
  });

  ioInstance.on("connection", (socket) => {
    
    socket.on("join_user", (userId) => {
      socket.userId = userId;
      onlineUsers.set(userId, { socketId: socket.id, activeChat: null });
    });
    
    socket.on("join_chat", async (chatData) => {
      const { userId, chatUserId } = chatData;
      
      if (onlineUsers.has(userId)) {
        onlineUsers.get(userId).activeChat = chatUserId;
        
        try {
          const result = await Message.updateMany(
            {
              senderid: chatUserId,
              reciverid: userId,
              seen: false
            },
            {
              seen: true,
              seenAt: new Date()
            }
          );
          
          if (result.modifiedCount > 0) {
            const senderUser = onlineUsers.get(chatUserId);
            if (senderUser) {
              ioInstance.to(senderUser.socketId).emit("messages_seen", {
                receiverId: userId,
                senderId: chatUserId,
                seenAt: new Date()
              });
            }
          }
        } catch (error) {
          console.error("error auto-marking messages as seen:", error);
        }
      }
    });
    
    socket.on("leave_chat", (userId) => {
      if (onlineUsers.has(userId)) {
        onlineUsers.get(userId).activeChat = null;
      }
    });
    
    socket.on("send_message", (data) => {
      ioInstance.emit("receive_message", data);
    });

    socket.on("disconnect", () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
      }
    });
  });
}

export async function emitNewMessage(message) {
  if (ioInstance) {
    const receiverId = message.reciverid.toString();
    const senderId = message.senderid.toString();
    
    const receiverUser = onlineUsers.get(receiverId);
    let messageToEmit = { ...message };
    
    if (receiverUser && receiverUser.activeChat === senderId) {
      try {
        await Message.updateOne(
          { _id: message._id },
          { seen: true, seenAt: new Date() }
        );
        messageToEmit.seen = true;
        messageToEmit.seenAt = new Date();
      } catch (error) {
        console.error("error auto-marking message as seen:", error);
      }
    }
    
    ioInstance.emit("receive_message", messageToEmit);
  }
}

export function emitMessagesSeen(receiverId, senderId) {
  if (ioInstance) {
    ioInstance.emit("messages_seen", {
      receiverId,
      senderId,
      seenAt: new Date()
    });
  }
}
