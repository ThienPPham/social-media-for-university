import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  addUserIntoCourse,
  leaveCourse,
  getAllUserJoinCourse,
  banUserFromCourse,
  deleteJoinCourse,
  updateAnnouncement,
  updateAnnouncementStatus,
  deleteAnnouncement,
  // sendRequestJoinCourese,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// READ
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);
router.get("/:courseId/userJoinCourse", verifyToken, getAllUserJoinCourse);

//UPDATE
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

//PUT
router.put("/:userId/joinCourse", verifyToken, addUserIntoCourse);
router.put("/:courseId/banned", verifyToken, banUserFromCourse);
router.put("/:courseId/deleteJoinCourse", verifyToken, deleteJoinCourse);
router.put("/:userId/announcement", verifyToken, updateAnnouncement);
router.put(
  "/:userId/announcementStatus",
  verifyToken,
  updateAnnouncementStatus
);

//DELETE
router.delete("/:userId/leaveCourse", verifyToken, leaveCourse);
router.delete("/:userId/deleteAnnouncement", verifyToken, deleteAnnouncement);

export default router;
