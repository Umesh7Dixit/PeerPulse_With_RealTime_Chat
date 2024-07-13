import express from 'express';
import protectRoute from '../middlewares/protectRoute.js';
import { sendMessage, getMessages, getConversations } from "../controllers/messageController.js";


const router = express.Router();

router.get("/conversations", protectRoute, getConversations);
router.get("/:otherUserId", protectRoute, getMessages);  //see message between two users
router.post("/", protectRoute, sendMessage);  //send message to other user
// router.get('/conversations',protectRoute, getConversations);   //see conversation between two users


// without login you cannot use these routes

export default router;