import React, { useEffect, useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import { json, useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import PostsWidget from "scenes/widgets/PostsWidget";
import styles from "./courseDetail.module.css";
import UserWidget from "scenes/widgets/UserWidget";
import MyCourseWidget from "scenes/widgets/MyCourseWidget";
import CoursesWidget from "scenes/widgets/CoursesWidget";
import { AltRoute, AlternateEmail } from "@mui/icons-material";
import UserImage from "components/UserImage";
import { useNavigate } from "react-router-dom";

const CourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [userJoinCourse, setUserJoinCourse] = useState([]);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath, courseJoin } = useSelector((state) => state.user);
  const [user, setUser] = useState(null);
  const [checkAnnouncemenet, setAnnouncemenet] = useState(false);
  const [checkBanned, setCheckBanned] = useState(false);
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
  }, []);

  // if (!user) return null;
  //Get User (End)

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
      setUserJoinCourse(data);
    } catch (error) {
      console.error("Error fetching users data:", error);
    }
  };

  useEffect(() => {
    getAllUserJoinCourse();
  }, [courseId]);

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
      console.log("Course data:", data); // Log the data to verify the response
      setCourse(data);
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  useEffect(() => {
    getCourse();
  }, [courseId]);

  useEffect(() => {
    if (course) {
      const isUserInRequest = course.IdUserRequest.some(
        (userId) => userId === _id.toString()
      );
      setAnnouncemenet(isUserInRequest);
    }
  }, [course, _id]);

  useEffect(() => {
    if (user) {
      const isUserBanned = user.banned.some(
        (item) => item === courseId.toString()
      );
      setCheckBanned(isUserBanned);
    }
  }, [user, courseId]);

  if (!course) {
    return <div>Loading...</div>;
  }

  const handleClickJoinCourse = () => {
    // alert("vao nhom");
    const sendRequestJoinCourse = async (courseId, userId) => {
      try {
        const response = await fetch(
          `http://localhost:3001/courses/${courseId}/requestJoinCourse`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ userId }),
          }
        );
        const data = await response.json();
        console.log("Course data:", data);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };
    sendRequestJoinCourse(courseId, _id);

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
        const mess =
          user.firstName +
          " " +
          user.lastName +
          " đã gửi yêu cầu tham gia nhóm";
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
          " Bạn đã gửi yêu cầu tham gia nhóm " + course.name;
        const response = fetch(
          `http://localhost:3001/users/${_id}/announcement`,
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

    window.location.reload();
  };

  const handleClickLeaveCourse = () => {
    const leaveCourse = async (courseId) => {
      try {
        const response = await fetch(
          `http://localhost:3001/users/${_id}/leaveCourse`,
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
          throw new Error("Failed to delete user course join !!!");
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error deleting user course join:", error);
        alert("There was an error deleting the user course join.");
      }
    };
    const leaveResult = leaveCourse(courseId);
    if (leaveResult) {
      alert("You have just left course !");
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
          const mess = user.firstName + " " + user.lastName + " đã rời nhóm";
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
          const mess = "Bạn đã rời nhóm " + course.name;
          const response = fetch(
            `http://localhost:3001/users/${_id}/announcement`,
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
      navigate(`/home`);
    }
  };

  return (
    <>
      {user !== null ? (
        <Box>
          <Navbar />
          <Box
            width="100%"
            padding="2rem 6%"
            display={isNonMobileScreens ? "flex" : "block"}
            gap="2rem"
          >
            <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
              <UserWidget
                userId={_id}
                picturePath={picturePath}
                // courseId={courseId}
              />
            </Box>

            <Box
              flexBasis={isNonMobileScreens ? "68%" : undefined}
              mt={isNonMobileScreens ? undefined : "2rem"}
            >
              <div>
                <main className={styles.mainContent}>
                  <div className={styles.mainHeader}>
                    <img
                      src={`http://localhost:3001/assets/${course.picturePath}`}
                      alt="Main Image 123"
                      className={styles.mainImage}
                    />
                    <h1>{course.name}</h1>
                    <p>Private Group · {course.numberOfMembers} members</p>
                  </div>
                  <div className={styles.middleHeader}>
                  <div className={styles.memberImage}>
                  {userJoinCourse.map((data) => (
                    <UserImage image={data.picturePath} />
                  ))}
                </div>
                    {checkBanned ? (
                      <h3 id={styles.banned}>
                        {" "}
                        Bạn Đã Bị Cấm Vào Nhóm Vĩnh Viễn !{" "}
                      </h3>
                    ) : checkAnnouncemenet ? (
                      <h3 id={styles.announcement}>
                        Vui Lòng Đợi Admin Phê Duyệt Vào Nhóm !
                      </h3>
                    ) : user.courseJoin.includes(courseId) ? (
                      <button
                        className={styles.inviteButton}
                        id="leaveButton"
                        onClick={handleClickLeaveCourse}
                      >
                        Rời nhóm
                      </button>
                    ) : (
                      <button
                        className={styles.inviteButton}
                        id="inviteButton"
                        onClick={handleClickJoinCourse}
                      >
                        Vào Nhóm
                      </button>
                    )}
                  </div>
                  <div className={styles.description}>
                    <p>{course.description}</p>
                  </div>
                </main>
              </div>
              {user.courseJoin.includes(courseId) ? (
                <>
                  <MyCourseWidget
                    picturePath={picturePath}
                    courseId={courseId}
                  />
                  <CoursesWidget courseId={courseId} isCourse />
                </>
              ) : null}
            </Box>
          </Box>
        </Box>
      ) : (
        ""
      )}
    </>
  );
};

export default CourseDetail;
//user.courseJoin.includes(_id)
