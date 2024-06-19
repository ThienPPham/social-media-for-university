import express from 'express';
import { createCourse, getCourses, getUserCourses, updateCourse, getCoursesById, getCoursePosts } from "../controllers/course.js";
import { verifyToken } from '../middleware/auth.js';


const router = express.Router();


// READ
router.get("/", verifyToken, getCourses);
router.post("/create", verifyToken, createCourse);

router.get('/:userId/detail', getUserCourses);
router.get('/:courseId', getCoursesById);

router.get('/:courseId/posts', getCoursePosts);
// router.post('/:courseId/posts', createPostInCourse);

router.put('/update/:id', verifyToken, updateCourse);


// router.get("/", verifyToken, getFeedPosts);
// router.get("/:userId/posts", verifyToken, getUserPosts);

export default router;