import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  addUserIntoCourse,
  leaveCourse,
  getAllUserJoinCourse,
  banUserFromCourse,
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

//DELETE
router.delete("/:userId/leaveCourse", verifyToken, leaveCourse);

export default router;
