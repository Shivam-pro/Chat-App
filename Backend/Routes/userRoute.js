import express from 'express';
import { checkAuth, loginUser, registerUser, updateProfile } from '../Controllers/userController.js';
import authmiddleware from '../middleware/authuser.js';

const userRouter = express.Router();
userRouter.post("/login", loginUser);
userRouter.post("/signin", registerUser);
userRouter.put("/profile",authmiddleware ,updateProfile);
userRouter.get("/check",authmiddleware ,checkAuth);

export default userRouter;
