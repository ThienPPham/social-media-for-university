import mongoose from "mongoose";

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
    status: {
      type: String,
      default: "active",
    },
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number,
    phoneNumber: String,
  },
  { timestamps: true }
);
const User = mongoose.model("User", UserSchema);
export default User;
