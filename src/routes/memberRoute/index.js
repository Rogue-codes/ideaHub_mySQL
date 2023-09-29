import express from "express";
import {
  addMember,
  getHubMembers,
  memberLogin,
  removeMember,
} from "../../controllers/member/index.js";
import { adminMiddleware } from "../../middleware/adminMiddleware.js";
const memebrRoute = express.Router();

memebrRoute.post("/member/add", adminMiddleware, addMember);
memebrRoute.get("/member/all/:id", getHubMembers);
memebrRoute.delete("/member/remove", adminMiddleware, removeMember);
memebrRoute.post("/member/login", memberLogin);

export default memebrRoute;
