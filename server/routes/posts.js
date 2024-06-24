import express from 'express';
import multer from "multer";
import { getFeedPosts, getUserPosts, likePost, createPostInCourse, deletePost } from "../controllers/posts.js";
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// READ
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
// router.post("/:courseId/posts", verifyToken, createPostInCourse);

// UPDATE
router.patch("/:id/like", verifyToken, likePost);

// Delete

router.delete("/:id", verifyToken, deletePost);


export default router;