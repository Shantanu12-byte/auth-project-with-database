import { Router } from "express";
import register from "../controllers/auth.controller.js";
import * as  authcontroller from  "../controllers/auth.controller.js"

const authrouter = Router();

authrouter.post("/register", register);



authrouter.get("/get-me", authcontroller.getme)

authrouter.get("/refresh-token", authcontroller.refreshToken)

export default authrouter;