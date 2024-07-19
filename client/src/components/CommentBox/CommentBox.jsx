import UserImage from "components/UserImage";
import React, { useState } from "react";
import FlexBetween from "components/FlexBetween";
import { Box, InputBase, useTheme, Button } from "@mui/material";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";

const CommentBox = ({ postId, onCommentAdded }) => {
  const [post, setPost] = useState("");
  const { _id, picturePath, firstName, lastName } = useSelector((state) => state.user);
  const { palette } = useTheme();

  const handlePost = async () => {
    try {
      const response = await fetch(`http://localhost:3001/comments/${postId}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: _id,
          comment: post,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} - ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log("Response from server:", responseData);

      setPost("");

      // Gọi callback để thêm comment mới vào danh sách comments
      onCommentAdded({
        _id: responseData._id,
        userId: { _id, firstName, lastName, picturePath },
        comment: post,
      });
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <WidgetWrapper mt="1rem">
          <FlexBetween gap="1rem">
            <UserImage image={picturePath} />
            <InputBase
              placeholder="Viết bình luận"
              value={post}
              onChange={(e) => setPost(e.target.value)}
              sx={{
                width: "100%",
                backgroundColor: palette.neutral.light,
                borderRadius: "2rem",
                padding: "0.5rem 1rem",
              }}
            />
            <Button
              disabled={!post}
              onClick={handlePost}
              sx={{
                color: palette.background.alt,
                backgroundColor: palette.primary.main,
                borderRadius: "3rem",
                minWidth: "5rem",
              }}
            >
              Post
            </Button>
          </FlexBetween>
        </WidgetWrapper>
  );
};

export default CommentBox;
