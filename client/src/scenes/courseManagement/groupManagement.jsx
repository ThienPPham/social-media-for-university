import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SideBar from "./index";
import styles from "./courseManagement.module.css";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  useTheme,
} from "@mui/material";

import { EditOutlined, DeleteOutlined } from "@mui/icons-material";

const GroupManagement = () => {
  const { courseId } = useParams();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [course, setCourse] = useState(null);
  const [isImage, setIsImage] = useState(true);
  const [image, setImage] = useState(null);
  const { palette } = useTheme();
  const medium = palette.neutral.medium;
  const [nameUpdate, setNameUpdate] = useState(null);
  const [descriptionUpdate, setDescriptionUpdate] = useState(null);
  const navigate = useNavigate();

  const getCourse = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/courses/${courseId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setCourse(data);
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  useEffect(() => {
    getCourse();
  }, [courseId]);

  const handleUpdateGroup = async () => {
    const name = nameUpdate;
    const description = descriptionUpdate;
    let imageBanner = null;
    if (image !== null) {
      imageBanner = image.name;
    }

    const picture = image;
    const response = await fetch(
      `http://localhost:3001/courses/${courseId}/update`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description, imageBanner, picture }),
      }
    );
    const data = await response.json();
    if (response.ok) {
      alert("Course is updated successfully !");
      setNameUpdate(null);
      setDescriptionUpdate(null);
      setImage(null);
    } else {
      console.error("Error creating course:", data.message);
    }
    // };
  };

  const handleDeleteGroup = async () => {
    // alert("Delete Group");
    const response = await fetch(`http://localhost:3001/courses/${courseId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      alert("Delete course successfully !");
      navigate(`/home`);
    } else {
      console.error("Error deleting course:", data.message);
    }

    const responseDeleteJoinCourse = await fetch(
      `http://localhost:3001/users/${courseId}/deleteJoinCourse`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const dataDeleteJoinCourse = await responseDeleteJoinCourse.json();
    if (!responseDeleteJoinCourse.ok) {
      console.error("Error deleting course:", dataDeleteJoinCourse.message);
    }
  };

  return (
    <>
      <Box
        component="form"
        sx={{ marginLeft: 35, marginTop: 10, width: "40%" }}
      >
        <Typography variant="h4" gutterBottom>
          Quản Lý Nhóm
        </Typography>
        {course ? (
          <>
            <TextField
              label="Tên Nhóm"
              placeholder={course.name}
              name="name"
              value={nameUpdate}
              onChange={(e) => {
                setNameUpdate(e.target.value);
              }}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Mô tả"
              placeholder={course.description}
              name="description"
              value={descriptionUpdate}
              onChange={(e) => {
                setDescriptionUpdate(e.target.value);
              }}
              fullWidth
              margin="normal"
              multiline
              rows={4}
            />

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
                          <p>Thay Ảnh Bìa Tại Đây</p>
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
                          style={{
                            width: "10%",
                            marginLeft: "10px",
                            marginBottom: "7px",
                          }}
                        >
                          <DeleteOutlined style={{ width: "100%" }} />
                        </IconButton>
                      )}
                    </FlexBetween>
                  )}
                </Dropzone>
              </Box>
            )}
            {/* <FormControl fullWidth margin="normal">
              <InputLabel id="state-label">Trạng Thái Nhóm</InputLabel>
              <Select labelId="state-label" name="state" sx={{ marginTop: 2 }}>
                <MenuItem value="public">Công Khai</MenuItem>
                <MenuItem value="private">Riêng Tư</MenuItem>
              </Select>
            </FormControl> */}
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={handleUpdateGroup}
            >
              Cập Nhật
            </Button>

            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, marginLeft: 5 }}
              onClick={handleDeleteGroup}
            >
              Xóa Nhóm
            </Button>
          </>
        ) : (
          <Typography>Loading...</Typography>
        )}
      </Box>
    </>
  );
};

export default GroupManagement;
