import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./courseManagement.module.css";
import { Box, Typography, Divider } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function Announcement() {
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [course, setCourse] = useState(null);
  const { courseId } = useParams();

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

  const handleDeleteAnnouncement = async (announcementId) => {
    // alert(announcementId);
    try {
      const response = await fetch(
        `http://localhost:3001/courses/${courseId}/deleteAnnouncement`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ announcementId }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete Announcement!!!");
      } else {
        getCourse();
      }
    } catch (error) {
      alert("Has some error");
      console.error("Error fetching course data:", error);
    }
  };

  const handleStatus = async (announcementId) => {
    // alert(announcementId);
    const response = await fetch(
      `http://localhost:3001/courses/${courseId}/announcementStatus`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ announcementId }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to delete Announcement!!!");
    } else {
      getCourse();
    }
  };

  return (
    <>
      <Box p="1rem 0" maxWidth="auto" marginTop="50px" marginLeft="10%">
        <Typography
          fontSize="1.25rem"
          fontWeight="500"
          mb="0.5rem"
          marginBottom="10px"
        >
          Thông Báo Nhóm
        </Typography>
        {course !== null
          ? course.announcement.map((announcement) => (
              <div
                className={announcement.isNew ? styles.new : styles.old}
                onClick={() => handleStatus(announcement._id)}
              >
                <div style={{ marginTop: "15px", color: "grey " }}>
                  {" "}
                  {announcement.date}{" "}
                </div>
                <Box
                  // key={data._id}
                  display="flex"
                  alignItems="center"
                  gap="1rem"
                  mb="0.5rem"
                  marginBottom="10px"
                  marginTop="10px"
                  style={{ cursor: "pointer" }}
                >
                  <span> {announcement.mess} </span>
                  {/* <button
                    className={styles.kickButton}
                    style={{ padding: "5px 10px", fontSize: "13px" }}
                    // onClick={() => handleAccept(data._id)}
                  >
                    Xóa
                  </button> */}
                  <span
                    className={
                      announcement.isNew ? styles.newText : styles.oldText
                    }
                  >
                    {" "}
                    New !!!{" "}
                  </span>
                  <DeleteIcon
                    style={{ marginLeft: "auto", marginRight: "20px" }}
                    onClick={() => handleDeleteAnnouncement(announcement._id)}
                  />
                </Box>
                <Divider />
              </div>
            ))
          : "Loading ...."}
      </Box>
    </>
  );
}

export default Announcement;
