import { React, useState, useEffect } from "react";
import styles from "./announcement.module.css";
import { Box, Typography, Divider } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import Navbar from "scenes/navbar";

function Announcement() {
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [user, setUser] = useState(null);

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
  }, []);

  const handleStatus = async (announcementId) => {
    // alert(announcementId);
    const response = await fetch(
      `http://localhost:3001/users/${_id}/announcementStatus`,
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
      getUser();
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    // alert(announcementId);
    try {
      const response = await fetch(
        `http://localhost:3001/users/${_id}/deleteAnnouncement`,
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
        getUser();
      }
    } catch (error) {
      alert("Has some error");
      console.error("Error fetching course data:", error);
    }
  };
  return (
    <>
      <Navbar />
      <Box
        p="1rem 0"
        maxWidth="75%"
        marginTop="50px"
        marginLeft="10%"
        border="1px solid #E5D6AA"
        borderRadius="10px"
        style={{ backgroundColor: "#E5D6AA" }}
      >
        <Typography
          fontSize="1.25rem"
          fontWeight="500"
          mb="0.5rem"
          marginBottom="10px"
          marginLeft="35px"
          textAlign="center"
        >
          Thông Báo Dành Cho Bạn
        </Typography>
        {user !== null
          ? user.announcement.map((announcement) => (
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
