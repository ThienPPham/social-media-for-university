import mongoose from "mongoose";

// const roles = ["user", "host", "admin"];

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    // role: {
    //     type: String,
    //     required: true,
    //     enum: roles,
    //     default: "user",
    // },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    picturePath: {
      type: String,
      default: "",
    },
    friends: {
      type: Array,
      default: [],
    },
    courseJoin: {
      type: Array,
      default: [],
    },
    // requestJoinCourse: [
    //   {
    //     ID: {
    //       type: String,
    //     },
    //     status: {
    //       type: String,
    //       default: "pending",
    //     },
    //   },
    // ],
    admin: {
      type: Boolean,
      default: false,
    },
    host: {
      type: Boolean,
      default: false,
    },
    banned: {
      type: Array,
      default: [],
    },
    announcement: [
      {
        date: {
          type: String,
        },
        mess: {
          type: String,
        },
        isNew: {
          type: Boolean,
          default: true,
        },
      },
    ],
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number,
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
