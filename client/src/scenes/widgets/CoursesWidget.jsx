import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";

const CoursesWidget = ({ courseId, isCourse = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  // const [course, setCourse] = useState("");
  const token = useSelector((state) => state.token);

  const getPosts = async () => {
    const response = await fetch("http://localhost:3001/posts", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  const getUserCourses = async () => {
    const response = await fetch(
      `http://localhost:3001/courses/${courseId}/posts`,
      {
        method: "GET",
        // headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
    console.log('««««« data1 »»»»»', data);

  };

  useEffect(() => {
    if (isCourse) {
      getUserCourses();
    } else {
      getPosts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    // <>
    //   {posts.map(
    //     ({
    //       _id,
    //       userId,
    //       firstName,
    //       lastName,
    //       description,
    //       location,
    //       picturePath,
    //       userPicturePath,
    //       likes,
    //       comments,
    //     }) => (
    //       <PostWidget
    //         key={_id}
    //         postId={_id}
    //         postUserId={userId}
    //         name={`${firstName} ${lastName}`}
    //         description={description}
    //         location={location}
    //         picturePath={picturePath}
    //         userPicturePath={userPicturePath}
    //         likes={likes}
    //         comments={comments}
    //       />
    //     )
    //   )}
    // </>
    <>
      {Array.isArray(posts) ? (
        posts.map(
          ({
            _id,
            userId,
            firstName,
            lastName,
            description,
            location,
            picturePath,
            userPicturePath,
            likes,
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
        )
      ) : (
        <p>No posts available</p> // Render a message or handle this case appropriately
      )}
    </>
  );
};

export default CoursesWidget;
