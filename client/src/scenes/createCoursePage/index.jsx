import React from "react";
import styles from "./createCourse.module.css";
import { Box, useMediaQuery } from "@mui/material";
import Navbar from "scenes/navbar";
import { useHistory } from "react-router-dom";

//import of upload image

import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
  AltRoute,
} from "@mui/icons-material";
import {
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const NewCourse = () => {
  const [isImage, setIsImage] = useState(true);
  const [image, setImage] = useState(null);
  const { palette } = useTheme();
  const medium = palette.neutral.medium;
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [nameCourse, setNameCourse] = useState("");
  const [desCourse, setDesCourse] = useState("");
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  //Get User (Start)
  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${_id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;
  //Get User (End)

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageName;
    let picture;
    if (image) {
      // alert(image.name);
      imageName = image.name;
      picture = image;
    }
    const response = await fetch("http://localhost:3001/courses/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Attach the token to the request
      },
      body: JSON.stringify({
        userId: _id,
        name: nameCourse,
        imageBanner: imageName,
        picture: picture,
        description: desCourse,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Course created successfully:", data);
      setImage(null);
      setNameCourse(null);
      setDesCourse(null);

      const getNewestCourse = async () => {
        const response = await fetch(
          `http://localhost:3001/courses/${_id}/newestCourse`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        return data;
      };
      const newestCourseData = await getNewestCourse();

      const updateUserCourseJoin = async (userId, courseId) => {
        await fetch(`http://localhost:3001/users/${userId}/joinCourse`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ courseId }),
        });
      };

      await updateUserCourseJoin(_id, newestCourseData);

      navigate(`/courses/${newestCourseData}`);
    } else {
      console.error("Error creating course:", data.message);
    }
  };
  return (
    <Box>
      <Navbar />

      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <div className={styles.registrationContainer}>
          <h1>Tạo nhóm</h1>
          <div className={styles.userInfo}>
            <div>
              <img
                src="../../assets/group.png"
                alt="User Icon"
                className={styles.userIcon}
              />
            </div>
            <div>
              <p className={styles.userName}>
                {user.firstName + " " + user.lastName}
              </p>
              <p className={styles.userRole}>Quản trị viên</p>
            </div>
          </div>
          <form
            // action="#"
            // method="post"
            className={styles.registrationForm}
          >
            <label htmlFor="course-name">Tên khóa học:</label>
            <input
              type="text"
              id="course-name"
              name="course-name"
              onChange={(e) => setNameCourse(e.target.value)}
              placeholder="Nhập tên khóa học"
              value={nameCourse}
              required
            />
            <label htmlFor="course-des">Mô tả khóa học:</label>
            <input
              type="text"
              id="course-description"
              name="course-description"
              onChange={(e) => setDesCourse(e.target.value)}
              value={desCourse}
              placeholder="Nhập Mô tả khóa học"
              required
            />

            <label htmlFor="course-image">Ảnh của khóa học:</label>
            {/* <input
              type="text"
              id="course-image"
              name="course-image"
              placeholder="Nhập URL ảnh của khóa học"
              required
            /> */}

            {isImage && (
              <Box
                border={`1px solid ${medium}`}
                borderRadius="5px"
                mt="1rem"
                p="1rem"
              >
                <Dropzone
                  acceptedFiles=".jpg,.jpeg,.png"
                  multiple={false}
                  onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
                >
                  {({ getRootProps, getInputProps }) => (
                    <FlexBetween>
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        width="100%"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!image ? (
                          <p>Add Image Here</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{image.name}</Typography>
                            <EditOutlined />
                          </FlexBetween>
                        )}
                      </Box>
                      {image && (
                        <IconButton
                          onClick={() => setImage(null)}
                          // sx={{ width: "15%" }}
                          style={{
                            width: "15%",
                            marginLeft: "10px",
                            marginBottom: "7px",
                          }}
                        >
                          <DeleteOutlined style={{ width: "15%" }} />
                        </IconButton>
                      )}
                    </FlexBetween>
                  )}
                </Dropzone>
              </Box>
            )}

            <button onClick={handleSubmit}>Tạo</button>
          </form>
        </div>
      </Box>
    </Box>
  );
};

export default NewCourse;
