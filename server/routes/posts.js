import express from 'express';
import { getFeedPosts, getUserPosts, likePost, createPostInCourse, deletePost, updatePost, getPostDetail, getAllPostsNotInCourse, getDetailPost } from "../controllers/posts.js";
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// READ
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
// router.get('/:userId/:postId', getPostDetail);
router.get("/not-in-course", getAllPostsNotInCourse);
router.get("/:postId", verifyToken, getDetailPost);

// UPDATE
router.patch("/:id/like", verifyToken, likePost);

// Delete

router.delete("/:id", verifyToken, deletePost);


export default router;