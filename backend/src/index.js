import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import authRoute from "./routes/auth.js";
import messageroute from "./routes/message.js";
import db from "./lib/db.js";
import middleware from "./middleware/auth.middleware.js";
import cors from "cors";
import cookiesparser from "cookie-parser";
import multer from "multer";
import path from "path";
import { setupSocket } from "./lib/socket.js";

const app = express();
const server = http.createServer(app);

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    cb(null, true);
  }
});

const allowedOrigins = [
  'http://127.0.0.1:3000',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  "https://chat.onrender.com",
  "https://chatapp-4vr7.onrender.com"
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}
if (process.env.NODE_ENV === 'production' && process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}



app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  exposedHeaders: ['set-cookie']
}));

app.use(express.json({ limit: '10mb' }));
app.use(cookiesparser());
// Add this before your message routes
app.use((req, res, next) => {
  console.log('Message route received cookies:', req.cookies,"\n\n\n");
  next();
});
app.locals.upload = upload;

const PORT = process.env.PORT||8004; 

app.use(middleware.logRequest);

app.get("/", (req, res) => {
  res.send("Server is alive!");
});

app.use("/api/auth",authRoute);
app.use("/api/message",messageroute);

server.listen(PORT, () => {
  console.log("server is running on port : ", PORT);
  db.connectdb();
  setupSocket(server);
});
