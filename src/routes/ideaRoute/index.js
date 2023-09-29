import express from "express";
import {
  createIdea,
  deleteIdea,
  getCampaignIdeas,
  getIdea,
  updateIdea,
} from "../../controllers/idea/index.js";
import { memberMiddleware } from "../../middleware/adminMiddleware.js";

const IdeaRoute = express.Router();

IdeaRoute.post("/idea/add", memberMiddleware, createIdea);
IdeaRoute.get("/idea/all/:id", getCampaignIdeas);
IdeaRoute.get("/idea/:id", getIdea);
IdeaRoute.put("/idea/update/:id", memberMiddleware, updateIdea);
IdeaRoute.delete("/idea/delete/:id", memberMiddleware, deleteIdea);

export default IdeaRoute;
