import React, { useState } from "react";
import { Button, InputBase, useTheme } from "@mui/material";
import WidgetWrapper from "components/WidgetWrapper";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";
import { useSelector } from "react-redux";

const ReplyComment = ({ commentId, onReplyAdded, fetchReplies }) => {
  const { palette } = useTheme();
  const [post, setPost] = useState("");
  const [showReply, setShowReply] = useState(false);
  const { _id, picturePath } = useSelector((state) => state.user);

  const handlePost = async () => {
    try {
      const response = await fetch(`http://localhost:3001/comments/${commentId}/reply`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ userId: _id, reply: post }),
      });

      if (response.ok) {
        const newReply = await response.json();
        onReplyAdded(newReply); // Cập nhật giao diện khi reply thành công
        fetchReplies(commentId); // Gọi để lấy lại danh sách replies mới
        setPost(""); // Xóa nội dung trong ô input
        setShowReply(false); // Ẩn phần reply sau khi thành công
      } else {
        console.error("Failed to add reply:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  return (
    <div>
      <Button
        onClick={() => setShowReply(true)}
        sx={{
          color: palette.background.alt,
          backgroundColor: palette.primary.main,
          borderRadius: "3rem",
          marginTop: "1rem",
        }}
      >
        Reply
      </Button>
      {showReply && (
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
      )}
    </div>
  );
};

export default ReplyComment;
