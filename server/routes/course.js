import express from 'express';
import { createCourse, getCourses, getUserCourses, updateCourse } from "../controllers/course.js";
import { verifyToken } from '../middleware/auth.js';


const router = express.Router();

// router.post('/courses', createCourse);
// router.get('/courses', getCourses);
// router.get('/courses/user/:userId', getUserCourses);
// router.put('/courses/:id', updateCourse);


// READ
router.get("/", verifyToken, getCourses);
router.post("/create", verifyToken, createCourse);

router.get('/:userId/courses', getUserCourses);




// router.get("/", verifyToken, getFeedPosts);
// router.get("/:userId/posts", verifyToken, getUserPosts);

export default router;