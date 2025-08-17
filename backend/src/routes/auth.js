import express, { Router } from "express";
import authfun from "../controllers/authFunction.js"
import middleware from "../middleware/auth.middleware.js"
const router = express.Router();

router.post("/login",authfun.login)

router.post("/signup",authfun.signup);

router.post("/logout",authfun.logout);

router.put("/update-profile" ,middleware.protectroute , authfun.updateprofile);

router.get("/check",middleware.protectroute,authfun.checkauth);

export default router;