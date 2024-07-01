import express from "express";
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
    getAllUsers,
    updateUserStatus
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// READ
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);
// GET ALL USERS
router.get("/", getAllUsers);

// UPDATE USER STATUS
router.put('/:id/status', updateUserStatus);

// UPDATE
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;
