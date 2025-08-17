import express from "express";
import middleware from "../middleware/auth.middleware.js";
import messageController from "../controllers/messagefun.js";

const router = express.Router();

router.use(middleware.protectroute);

router.get("/users", messageController.getusersidebar);

router.get("/:id", messageController.getmessage);

router.post("/upload", (req, res, next) => {
    req.app.locals.upload.single('file')(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                message: err.message || "file upload error"
            });
        }
        next();
    });
}, messageController.uploadFile);

router.post("/send/:id", messageController.sendmessage);

router.patch("/seen/:id", messageController.markMessagesSeen);

export default router;
