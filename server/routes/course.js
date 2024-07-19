import express from 'express';
import { createCourse, getCourses, getUserCourses, updateCourse, getCoursesById, getCoursePosts, deleteCourse } from "../controllers/course.js";
import { verifyToken } from '../middleware/auth.js';


const router = express.Router();


// READ
router.get("/", verifyToken, getCourses);
router.post("/create", verifyToken, createCourse);

router.get('/:userId/detail', getUserCourses);
router.get('/:courseId', getCoursesById);
router.get('/:courseId/posts', getCoursePosts);

// Update
router.put('/update/:id', verifyToken, updateCourse);

// Delete
router.delete('/:id', verifyToken, deleteCourse);


export default router;