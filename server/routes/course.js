import express from "express";
import {
  createCourse,
  getCourses,
  getUserCourses,
  updateCourse,
  getCoursesById,
  getCoursePosts,
  getNewestCourse,
  deleteCourse,
  sendRequestJoinCourse,
  getDataUserRequest,
  deleteRequestJoinCourese,
} from "../controllers/course.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// READ
router.get("/", verifyToken, getCourses);
router.post("/create", verifyToken, createCourse);

router.get("/:userId/detail", getUserCourses);
router.get("/:courseId", getCoursesById);
router.get("/:courseId/posts", getCoursePosts);
router.get("/:userId/newestCourse", getNewestCourse);
router.get("/:courseId/userRequest", getDataUserRequest);
// Update
// router.put("/update/:id", verifyToken, updateCourse);

// Delete
router.delete("/:courseId", verifyToken, deleteCourse);

router.delete(
  "/:userId/deleteRequestJoinCourese",
  verifyToken,
  deleteRequestJoinCourese
);

//PUT
router.put("/:courseId/requestJoinCourse", verifyToken, sendRequestJoinCourse);

export default router;
