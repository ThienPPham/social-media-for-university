import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./courseManagement.module.css";
import {
  Box,
  Button,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  Divider,
  InputBase,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";

function MemberManagement() {
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const { courseId } = useParams();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSearch, setFilterSearch] = useState([]);
  const { palette } = useTheme();
  const medium = palette.neutral.medium;
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;

  const getAllUserJoinCourse = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${courseId}/userJoinCourse`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setUsers(data);
      setFilterSearch(data);
    } catch (error) {
      console.error("Error fetching users data:", error);
    }
  };

  useEffect(() => {
    getAllUserJoinCourse();
  }, [courseId]);

  const handleLeaveCourse = (userId) => {
    // alert(userId + " has to leave this course !");
    const leaveCourse = async (courseId, userId) => {
      try {
        const response = await fetch(
          `http://localhost:3001/users/${userId}/leaveCourse`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ courseId }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to kick the user out of the group  !!!");
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error kick the user out of the group:", error);
        alert("There was an error kicking the user out of the group.");
      }
    };
    const leaveResult = leaveCourse(courseId, userId);
    if (leaveResult) {
      alert("Successfully Kick User Out Of The Group !");
      getAllUserJoinCourse();
    }
  };

  const handleBan = (userId) => {
    // alert(userId + " is banned forever !");
    const leaveCourse = async (courseId, userId) => {
      try {
        const response = await fetch(
          `http://localhost:3001/users/${userId}/leaveCourse`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ courseId }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to kick the user out of the group  !!!");
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error kick the user out of the group:", error);
        alert("There was an error kicking the user out of the group.");
      }
    };
    const leaveResult = leaveCourse(courseId, userId);
    if (leaveResult) {
      alert("Successfully Kick User Out Of The Group !");
      getAllUserJoinCourse();
    }

    const banUserFromCourse = async (userId) => {
      try {
        const response = await fetch(
          `http://localhost:3001/users/${courseId}/banned`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ userId }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to ban the user out of the group  !!!");
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error ban the user out of the group:", error);
        alert("There was an error banning the user out of the group.");
      }
    };

    const banResult = banUserFromCourse(userId);
    if (banResult) {
      alert("Successfully Ban User Out Of The Group !");
      getAllUserJoinCourse();
    }
  };

  const handleNavigate = (userId) => {
    navigate(`/profile/${userId}`);
  };

  useEffect(() => {
    console.log(searchQuery);
    if (searchQuery.trim() !== "") {
      const resultSearch = users.filter((user) => {
        if (user._id.toString() !== _id.toString()) {
          const userName =
            user.firstName.toLowerCase() + " " + user.lastName.toLowerCase();
          return userName.includes(searchQuery.trim().toLowerCase());
        }
      });
      setFilterSearch(resultSearch);
    } else {
      setFilterSearch(users);
    }
  }, [searchQuery, users]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <Box marginTop="30px" marginLeft="70%">
        <FlexBetween
          backgroundColor={neutralLight}
          borderRadius="9px"
          gap="3rem"
          padding="0.1rem 1.5rem"
          border="3px solid lightblue"
          maxWidth="290px"
        >
          <InputBase
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => handleSearch(e)}
          />
          <IconButton>
            <Search />
          </IconButton>
        </FlexBetween>
      </Box>
      <Box p="1rem 0" maxWidth="auto" marginTop="50px" marginLeft="10%">
        <Typography
          fontSize="1.25rem"
          fontWeight="500"
          mb="0.5rem"
          marginBottom="50px"
        >
          Quản Lý Thành Viên Nhóm
        </Typography>
        {filterSearch.length > 0 ? (
          filterSearch.map((data) => (
            <>
              {data._id.toString() === _id.toString() ? (
                ""
              ) : (
                <>
                  <Box
                    key={data._id}
                    display="flex"
                    alignItems="center"
                    gap="1rem"
                    mb="0.5rem"
                    width="100%"
                    marginBottom="10px"
                    marginTop="30px"
                    style={{ cursor: "pointer" }}
                  >
                    <UserImage image={data.picturePath} marginLeft="10%" />
                    <span onClick={() => handleNavigate(data._id)}>
                      {" "}
                      {data.firstName + " " + data.lastName}{" "}
                    </span>
                    {/* </Typography> */}
                    <button
                      className={styles.kickButton}
                      style={{ padding: "5px 10px", fontSize: "13px" }}
                      onClick={() => handleLeaveCourse(data._id)}
                    >
                      Rời Khỏi Nhóm
                    </button>
                    <button
                      className={styles.banButton}
                      style={{ padding: "5px 10px", fontSize: "13px" }}
                      onClick={() => handleBan(data._id)}
                    >
                      Cấm Vĩnh Viễn
                    </button>
                  </Box>

                  <Divider />
                </>
              )}
            </>
          ))
        ) : (
          <Typography color={medium}>
            Không Có Thành Viên Nào Hiển Thị Ở Đây Hết !
          </Typography>
        )}
      </Box>
    </>
  );
}

export default MemberManagement;
