import User from "../models/User.js";
import Course from "../models/Course.js";

// READ
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

//Add user into a course
export const addUserIntoCourse = async (req, res) => {
  const { userId } = req.params;
  const { courseId } = req.body;

  // if (req.user.id !== userId) {
  //   return res.status(403).json({ error: "Access denied" });
  // }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { courseJoin: courseId } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Error updating user" });
  }
};

// Ban User Out Of Group (Course)
export const banUserFromCourse = async (req, res) => {
  try {
    const { userId } = req.body;
    const { courseId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { banned: courseId } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error updating ban user:", err);
    res.status(500).json({ error: "Error updating ban user" });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getAllUserJoinCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const users = await User.find(
      { courseJoin: courseId },
      "firstName lastName picturePath"
    );

    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }
    //, users.lastName, users.picturePath, users._id
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Course That User had Joined

export const getAllCourseJoining = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    const course = await Course.find();
    let courseJoining = [];
    for (let i = 0; i < course.length; i++) {
      for (let j = 0; j < user.courseJoin.length; j++) {
        if (course[i]._id.toString() === user.courseJoin[j]) {
          courseJoining.push(course[i]);
        }
      }
    }
    res.status(200).json(courseJoining);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//UPDATE
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = user.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
// GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// UPDATE USER STATUS
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Lấy status từ body của request

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Trả về tài liệu đã cập nhật
    );

    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const { userId } = req.params;
    const { date, mess } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          announcement: {
            $each: [{ date, mess }],
            $position: 0,
          },
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user announcement:", err);
    res.status(500).json({
      message: "An error occurred while updating the announcement of user",
    });
  }
};

// Update Announcement Status

export const updateAnnouncementStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { announcementId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    const announcementIndex = user.announcement.findIndex((announcement) => {
      return announcement._id.toString() === announcementId;
    });

    if (announcementIndex > -1) {
      user.announcement[announcementIndex].isNew = false;

      user.markModified(`announcement.${announcementIndex}.isNew`);

      await user.save();

      res
        .status(200)
        .json({ message: "Announcement status updated successfully" });
    } else {
      console.log("Announcement not found");
      res
        .status(404)
        .json({ error: "Announcement not found in announcement list" });
    }
  } catch (error) {
    console.error("Error updating announcement status:", error);
    res.status(500).json({ error: "Error updating announcement status" });
  }
};

//Delete Join Course

export const deleteJoinCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const users = await User.updateMany(
      { courseJoin: courseId },
      { $pull: { courseJoin: courseId } }
    );
    res.status(200).json({ message: "Delete Join Course Successfully !" });
  } catch (error) {
    res.status(404).json({ message: err.message });
  }
};

// Delete USer's Course Joining

export const leaveCourse = async (req, res) => {
  try {
    const { userId } = req.params;
    const { courseId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      console.log("Not found User");
      return res.status(404).json({ error: "User not found" });
    }
    const courseIndex = user.courseJoin.findIndex(
      (course) => course.toString() === courseId
    );

    if (courseIndex > -1) {
      user.courseJoin.splice(courseIndex, 1);
      await user.save();
      res.status(200).json({ message: "course join removed from user" });
    } else {
      console.log("Not found Course");
      res.status(404).json({ error: "Course not found in courseJoin list" });
    }
  } catch (error) {
    console.error("Error removing courseJoin from user:", error);
    res.status(500).json({ error: "Error removing courseJoin from user" });
  }
};

// Delete Announecement

export const deleteAnnouncement = async (req, res) => {
  try {
    const { userId } = req.params;
    const { announcementId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      console.log("Not found User");
      return res.status(404).json({ error: "User not found" });
    }

    const announcementIndex = user.announcement.findIndex(
      (announcement) => announcement._id.toString() === announcementId
    );

    if (announcementIndex > -1) {
      user.announcement.splice(announcementIndex, 1);

      await user.save();

      res.status(200).json({ message: "Announcement removed from user" });
    } else {
      console.log("Not found announcement");
      res
        .status(404)
        .json({ error: "Announcement not found in announcement list" });
    }
  } catch (error) {
    console.error("Error removing Announcement from user:", error);
    res.status(500).json({ error: "Error removing Announcement from user" });
  }
};
