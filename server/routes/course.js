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
  updateAnnouncement,
  deleteAnnouncement,
  updateAnnouncementStatus,
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

router.delete("/:courseId/deleteAnnouncement", verifyToken, deleteAnnouncement);

//PUT
router.put("/:courseId/requestJoinCourse", verifyToken, sendRequestJoinCourse);
router.put("/:courseId/announcement", verifyToken, updateAnnouncement);
router.put(
  "/:courseId/announcementStatus",
  verifyToken,
  updateAnnouncementStatus
);

export default router;
