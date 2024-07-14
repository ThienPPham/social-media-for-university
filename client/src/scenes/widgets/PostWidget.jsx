import React, { useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import CommentBox from "components/CommentBox/CommentBox";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import ReplyComment from "components/ReplyComment/ReplyComment";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import FriendComment from "components/FriendComment";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  onDelete,
}) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`http://localhost:3001/comments/${postId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const commentsData = await response.json();
        setComments(commentsData);
      } else {
        setError("Failed to fetch comments");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Error fetching comments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
    if (!showComments) {
      fetchComments();
    }
  };

  const patchLike = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/posts/${postId}/like`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: loggedInUserId }),
        }
      );
      if (response.ok) {
        const updatedPost = await response.json();
        dispatch(setPost({ post: updatedPost }));
      } else {
        console.error("Failed to update like:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments((prevComments) => [...prevComments, newComment]);
  };

  // Function to fetch all replies of a comment
  const fetchReplies = async (commentId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/comments/${commentId}/replies`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const repliesData = await response.json();
        // Find the comment in state and update its replies
        const updatedComments = comments.map((comment) => {
          if (comment._id === commentId) {
            return { ...comment, replies: repliesData };
          }
          return comment;
        });
        setComments(updatedComments);
      } else {
        console.error("Failed to fetch replies:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching replies:", error);
    }
  };

  const deletePost = async () => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        onDelete(postId); // Notify parent component to remove the post from its state
      } else {
        // Handle error
        console.error("Failed to delete post:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleDeleteClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmDelete = () => {
    deletePost();
    setOpen(false);
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
        deletePost={deletePost}
        handleDeleteClick={handleDeleteClick}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>
          <IconButton onClick={toggleComments}>
            <ChatBubbleOutlineOutlined />
          </IconButton>
        </FlexBetween>
        {/* <IconButton onClick={patchLike}>
          <ShareOutlined />
        </IconButton> */}
      </FlexBetween>

      {showComments && (
        <>
          <CommentBox postId={postId} onCommentAdded={handleCommentAdded} />
          {loading && <Typography>Loading comments...</Typography>}
          {error && <Typography color="error">{error}</Typography>}
          {!loading && !error && comments.length === 0 && (
            <Typography></Typography>
          )}
          {!loading && !error && comments.length > 0 && (
            <Box mt="1rem">
              {comments.map((comment) => (
                <div key={comment._id}>
                  <FriendComment
                    friendId={comment.userId._id}
                    name={`${comment.userId.firstName} ${comment.userId.lastName}`}
                    userPicturePath={comment.userId.picturePath}
                  />
                  <Typography
                    variant="body2"
                    color={main}
                    style={{ marginLeft: "72px" }}
                  >
                    {comment.comment}
                    <ReplyComment
                      commentId={comment._id}
                      onReplyAdded={handleCommentAdded}
                      fetchReplies={fetchReplies} // Pass fetchReplies function to ReplyComment
                    />
                    {/* Render replies */}
                    {comment.replies &&
                      comment.replies.map((reply) => (
                        <Box key={reply._id} mt={1}>
                          <Friend
                            friendId={reply.userId._id}
                            name={`${reply.userId.firstName} ${reply.userId.lastName}`}
                            userPicturePath={reply.userId.picturePath}
                          />
                          <Typography
                            variant="body2"
                            color={main}
                            style={{ marginLeft: "72px" }}
                          >
                            {reply.reply}
                          </Typography>
                        </Box>
                      ))}
                  </Typography>
                </div>
              ))}
            </Box>
          )}
        </>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </WidgetWrapper>
  );
};

export default PostWidget;
