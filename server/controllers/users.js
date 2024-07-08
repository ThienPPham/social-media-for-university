import User from "../models/User.js";

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
//addUserIntoCourse

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
