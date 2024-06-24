import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCourses } from "state";
import PostWidget from "./PostWidget";

const GroupWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses);
  const token = useSelector((state) => state.token);

  const getCourses = async () => {
    const response = await fetch("http://localhost:3001/courses", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setCourses({ courses: data }));
  };

  const getUserCourses = async () => {
    const response = await fetch(
      `http://localhost:3001/courses/${userId}/courses`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setCourses({ posts: data }));
  };

  useEffect(() => {
    if (isProfile) {
        getUserCourses();
    } else {
        getCourses();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {posts.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          price,
          name,
          date,
          numberOfMembers,
          comments,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
          />
        )
      )}
    </>
  );
};

export default GroupWidget;
