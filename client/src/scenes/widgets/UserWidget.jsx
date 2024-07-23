import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
  School,
  AltRoute,
} from "@mui/icons-material";
// import {SchoolIcon} from '@mui/icons-material/School';
import { Box, Typography, Divider, useTheme } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../courseDetailPage/courseDetail.module.css";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";

const UserWidget = ({ picturePath }) => {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState("");
  const [courseJoining, setCourseJoining] = useState([]);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const [course2, setCourse2] = useState([]);
  const [userDataRequest, setUserDataRequest] = useState([]);
  const { courseId } = useParams();
  const { _id } = useSelector((state) => state.user);
  // const userId = _id;

  const getUserDataRequest = async () => {
    const response = await fetch(
      `http://localhost:3001/courses/${courseId}/userRequest`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    setUserDataRequest(data);
  };

  // useEffect(() => {
  getUserDataRequest();
  // }, [courseId]);

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
      console.log("Course data:", data);
      setCourse2(data);
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  useEffect(() => {
    getCourse();
  }, [courseId]);

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${_id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  const getUserCourses = async () => {
    const response = await fetch(
      `http://localhost:3001/courses/${_id}/detail`,
      {
        method: "GET",
        // headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    return data;
  };

  useEffect(() => {
    const fetchData = async () => {
      await getUser();
      const userCourses = await getUserCourses();
      setCourses(userCourses);
    };

    fetchData();
  }, []);

  const getAllCourseJoining = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${_id}/courseJoining`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    return data;
  };

  useEffect(() => {
    const fetchData = async () => {
      const userCoursesJoining = await getAllCourseJoining();
      setCourseJoining(userCoursesJoining);
    };

    fetchData();
  }, []);

  const handleClick = () => {
    navigate("/course/create");
  };

  // useEffect(() => {
  //   getUser();
  // }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const {
    firstName,
    lastName,
    location,
    occupation,
    viewedProfile,
    impressions,
    friends,
  } = user;

  const handleAccept = async (userId_test, firstName, lastName) => {
    // alert(userId);
    // alert(courseId);
    const userId = userId_test;

    const updateUserCourseJoin = async (userId, courseId) => {
      try {
        const response = await fetch(
          `http://localhost:3001/users/${userId}/joinCourse`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ courseId }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update user course join !!!");
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error updating user course join:", error);
        alert("There was an error updating the user's course join status.");
      }
    };

    const result = await updateUserCourseJoin(userId, courseId);
    if (result) {
      // alert("User course join status updated successfully!");
    }

    const deleteRequestJoinCourese = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/courses/${userId}/deleteRequestJoinCourese`,
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
          throw new Error("Failed to delete request join course !!!");
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error deleting request join course:", error);
        alert("There was an error deleting the request join course.");
      }
    };
    const deleteResult = await deleteRequestJoinCourese();
    if (deleteResult) {
      // alert("User course join status deleted successfully!");
      // announcement code write here

      const updateAnnouncement = async () => {
        try {
          const d = new Date();
          const month = d.getMonth() + 1;
          let minutes = "";
          let minutesTemp = d.getMinutes();
          minutes = minutesTemp;
          if (minutesTemp < 10) {
            minutes = "0" + minutesTemp;
          }
          const date =
            d.getDate() +
            "/" +
            month +
            "/" +
            d.getFullYear() +
            " " +
            d.getHours() +
            ":" +
            minutes;
          const mess = firstName + " " + lastName + " đã tham gia nhóm";
          const response = fetch(
            `http://localhost:3001/courses/${courseId}/announcement`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ date, mess }),
            }
          );
          if (!response.ok) {
            throw new Error("Failed to update Announcement!!!");
          }
        } catch (error) {
          console.error("Error updating Announcement:", error);
        }
      };
      updateAnnouncement();

      const updateAnnouncementUser = async () => {
        try {
          const d = new Date();
          const month = d.getMonth() + 1;
          let minutes = "";
          let minutesTemp = d.getMinutes();
          minutes = minutesTemp;
          if (minutesTemp < 10) {
            minutes = "0" + minutesTemp;
          }
          const date =
            d.getDate() +
            "/" +
            month +
            "/" +
            d.getFullYear() +
            " " +
            d.getHours() +
            ":" +
            minutes;
          const mess =
            // user.firstName +
            // " " +
            // user.lastName +
            " Bạn đã được tham gia nhóm " + course2.name;
          const response = fetch(
            `http://localhost:3001/users/${userId}/announcement`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ date, mess }),
            }
          );
          if (!response.ok) {
            throw new Error("Failed to update Announcement!!!");
          }
        } catch (error) {
          console.error("Error updating Announcement:", error);
        }
      };
      updateAnnouncementUser();
    }

    // getUserDataRequest();
  };

  const handleDeny = async (userId_test) => {
    const userId = userId_test;
    const deleteRequestJoinCourese = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/courses/${userId}/deleteRequestJoinCourese`,
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
          throw new Error("Failed to delete request join course !!!");
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error deleting request join course:", error);
        alert("There was an error deleting the request join course.");
      }
    };
    const deleteResult = await deleteRequestJoinCourese();
    if (deleteResult) {
      // alert("User course join status deleted successfully!");
      const updateAnnouncementUser = async () => {
        try {
          const d = new Date();
          const month = d.getMonth() + 1;
          let minutes = "";
          let minutesTemp = d.getMinutes();
          minutes = minutesTemp;
          if (minutesTemp < 10) {
            minutes = "0" + minutesTemp;
          }
          const date =
            d.getDate() +
            "/" +
            month +
            "/" +
            d.getFullYear() +
            " " +
            d.getHours() +
            ":" +
            minutes;
          const mess =
            // user.firstName +
            // " " +
            // user.lastName +
            " Bạn đã không được chấp nhận tham gia nhóm " + course2.name;
          const response = fetch(
            `http://localhost:3001/users/${userId}/announcement`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ date, mess }),
            }
          );
          if (!response.ok) {
            throw new Error("Failed to update Announcement!!!");
          }
        } catch (error) {
          console.error("Error updating Announcement:", error);
        }
      };
      updateAnnouncementUser();
    }
    // getUserDataRequest();
  };

  const handleManageGroup = () => {
    navigate(`/courses/${courseId}/ManageGroup`);
  };

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        // onClick={() => navigate(`/profile/${userId}`)}
        onClick={() => navigate(`/profile/${_id}`)}
      >
        <FlexBetween gap="1rem">
          <UserImage image={picturePath} />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {firstName} {lastName}
            </Typography>
            <Typography color={medium}>{friends.length} friends</Typography>
          </Box>
        </FlexBetween>
        <ManageAccountsOutlined />
      </FlexBetween>

      <Divider />

      {/* SECOND ROW */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{location}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{occupation}</Typography>
        </Box>
      </Box>

      <Divider />

      {/* THIRD ROW */}
      {/* <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <School fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>khóa học môn Lab</Typography>
          <EditOutlined sx={{ color: main }} />
        </Box>
        
      </Box> */}
      <Box p="1rem 0">
        <Typography fontSize="1.25rem" fontWeight="500" mb="0.5rem">
          Khóa học do bạn quản lí
        </Typography>
        {courses.length > 0 ? (
          courses.map((course) => (
            <Box
              display="flex"
              alignItems="center"
              gap="1rem"
              mb="0.5rem"
              onClick={() => navigate(`/courses/${course._id}`)}
              style={{ cursor: "pointer" }}
            >
              <SupervisorAccountIcon fontSize="large" sx={{ color: main }} />
              {/* <School fontSize="large" sx={{ color: main }} /> */}
              <Typography color={dark} fontWeight="500">
                {course.name}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography color={medium}>No courses available</Typography>
        )}
      </Box>

      <Divider />

      {_id === course2.userId ? (
        <>
          <Box p="1rem 0">
            <Typography fontSize="1.25rem" fontWeight="500" mb="0.5rem">
              Yêu cầu tham gia nhóm
            </Typography>
            {userDataRequest.length > 0 ? (
              userDataRequest.map((data) => (
                <Box
                  key={data._id}
                  display="flex"
                  alignItems="center"
                  gap="1rem"
                  mb="0.5rem"
                  style={{ cursor: "pointer" }}
                >
                  {/* <School fontSize="large" sx={{ color: main }} /> */}
                  {/* <Typography color={dark} fontWeight="500"> */}
                  <UserImage image={data.picturePath} />
                  {data.firstName + " " + data.lastName}
                  {/* </Typography> */}
                  <button
                    className={styles.inviteButton}
                    style={{ padding: "5px 10px", fontSize: "13px" }}
                    onClick={() =>
                      handleAccept(data._id, data.firstName, data.lastName)
                    }
                  >
                    Accept
                  </button>
                  <button
                    className={styles.inviteButton}
                    style={{ padding: "5px 10px", fontSize: "13px" }}
                    onClick={() => handleDeny(data._id)}
                  >
                    Deny
                  </button>
                </Box>
              ))
            ) : (
              <Typography color={medium}>No requests available</Typography>
            )}
          </Box>

          <Divider />

          {/* Manage Group */}

          <Box p="1rem 0">
            <Typography
              fontSize="1.25rem"
              fontWeight="500"
              mb="0.5rem"
              onClick={handleManageGroup}
              style={{ cursor: "pointer" }}
            >
              Quản lý nhóm
            </Typography>
          </Box>

          <Divider />
        </>
      ) : null}

      <Box p="1rem 0">
        <Typography fontSize="1.25rem" fontWeight="500" mb="0.5rem">
          Khóa học mà bạn tham gia
        </Typography>
        {courseJoining.length > 0 ? (
          courseJoining.map((course) => (
            <Box
              display="flex"
              alignItems="center"
              gap="1rem"
              mb="0.5rem"
              onClick={() => navigate(`/courses/${course._id}`)}
              style={{ cursor: "pointer" }}
            >
              <School fontSize="large" sx={{ color: main }} />
              <Typography color={dark} fontWeight="500">
                {course.name}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography color={medium}>No courses available</Typography>
        )}
      </Box>

      <Divider />

      <Box p="1rem 0">
        <Typography
          fontSize="1.25rem"
          fontWeight="500"
          mb="0.5rem"
          onClick={handleClick}
          style={{ cursor: "pointer" }}
        >
          Tạo khóa học
        </Typography>
      </Box>

      {/* FIVE ROW */}
      <Box p="1rem 0">
        <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
          Social Profiles
        </Typography>

        <FlexBetween gap="1rem" mb="0.5rem">
          <FlexBetween gap="1rem">
            <img src="../assets/twitter.png" alt="twitter" />
            <Box>
              <Typography color={main} fontWeight="500">
                Twitter
              </Typography>
              <Typography color={medium}>Social Network</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: main }} />
        </FlexBetween>

        <FlexBetween gap="1rem">
          <FlexBetween gap="1rem">
            <img src="../assets/linkedin.png" alt="linkedin" />
            <Box>
              <Typography color={main} fontWeight="500">
                Linkedin
              </Typography>
              <Typography color={medium}>Network Platform</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: main }} />
        </FlexBetween>
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;
