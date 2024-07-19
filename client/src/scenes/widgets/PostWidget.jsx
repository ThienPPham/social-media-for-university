import React, { useState, useEffect } from "react";
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
  Modal,
  Backdrop,
  Fade,
  TextField,
} from "@mui/material";
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  Delete as DeleteIcon,
  Edit as EditIcon,
  EditOutlined,
  DeleteOutlined,
} from "@mui/icons-material";
import CommentBox from "components/CommentBox/CommentBox";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import ReplyComment from "components/ReplyComment/ReplyComment";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import FriendComment from "components/FriendComment";
import styles from "../../components/Friend.module.css";
import Dropzone from "react-dropzone";

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
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;

  // State for comments and replies
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [open, setOpen] = useState(false);
  const [postDetail, setPostDetail] = useState(null); // State to hold post detail
  const [openModal, setOpenModal] = useState(false); // State to manage modal open/close
  const [image, setImage] = useState(null);

  // Fetch post detail function
  const getDetailPost = async () => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const postData = await response.json();
        setPostDetail(postData);
      } else {
        setError("Failed to fetch post detail");
      }
    } catch (error) {
      console.error("Error fetching post detail:", error);
      setError("Error fetching post detail. Please try again later.");
    }
  };

  useEffect(() => {
    getDetailPost(); // Fetch post detail when component mounts
  }, []);

  // Fetch comments function
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

  // Toggle comments visibility
  const toggleComments = () => {
    setShowComments(!showComments);
    if (!showComments) {
      fetchComments();
    }
  };

  // Handle like action
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

  // Handle comment addition
  const handleCommentAdded = (newComment) => {
    setComments((prevComments) => [...prevComments, newComment]);
  };

  // Fetch replies of a comment
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
        const updatedComments = comments.map((comment) =>
          comment._id === commentId
            ? { ...comment, replies: repliesData }
            : comment
        );
        setComments(updatedComments);
      } else {
        console.error("Failed to fetch replies:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching replies:", error);
    }
  };

  // Handle delete post
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
        console.error("Failed to delete post:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // Handle delete confirmation dialog
  const handleDeleteClick = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleConfirmDelete = () => {
    deletePost();
    setOpen(false);
  };

  // Handle edit icon click
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  // Update post details
  const updatePost = async () => {
    const formData = new FormData();
    formData.append("description", postDetail.description);
    if (image) {
      formData.append("picture", image);
    }

    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setPostDetail(updatedPost); // Update post detail state
        setOpenModal(false); // Close modal after update
      } else {
        console.error("Failed to update post:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
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
        <IconButton
          onClick={handleOpenModal}
          sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
        >
          <EditIcon sx={{ color: primaryDark }} />
        </IconButton>
      </FlexBetween>

      {showComments && (
        <>
          <CommentBox postId={postId} onCommentAdded={handleCommentAdded} />
          {loading && <Typography>Loading comments...</Typography>}
          {error && <Typography color="error">{error}</Typography>}
          {!loading && !error && comments.length === 0 && (
            <Typography>No comments yet.</Typography>
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
                      onReplyAdded={(reply) => {
                        // Update replies immediately
                        const updatedComments = comments.map((c) =>
                          c._id === comment._id
                            ? { ...c, replies: [...c.replies, reply] }
                            : c
                        );
                        setComments(updatedComments);
                      }}
                      fetchReplies={fetchReplies}
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

      {/* Delete post confirmation dialog */}
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

      {/* Modal for post detail */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <Box
            sx={{
              position: "absolute",
              top: "45%",
              left: "45%",
              transform: "translate(-50%, -50%)",
              width: 400,
              p: 4,
            }}
          >
            {postDetail && (
              <div className={styles.post}>
                <div className={styles.header}>
                  <img
                    src={`http://localhost:3001/assets/${postDetail.userPicturePath}`}
                    className={styles.profilePic}
                  />
                  <div className={styles.userInfo}>
                    <span className={styles.username}>
                      {postDetail.firstName} {postDetail.lastName}
                    </span>
                    <span className={styles.badge}>{postDetail.userBadge}</span>
                  </div>
                </div>
                <TextField
                  label="Description"
                  variant="outlined"
                  fullWidth
                  value={postDetail.description}
                  onChange={(e) =>
                    setPostDetail({
                      ...postDetail,
                      description: e.target.value,
                    })
                  }
                  multiline
                  rows={4}
                  sx={{ mb: 2 }}
                />
                <Dropzone
                  acceptedFiles=".jpg,.jpeg,.png"
                  multiple={false}
                  onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
                >
                  {({ getRootProps, getInputProps }) => (
                    <FlexBetween>
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        width="100%"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!image ? (
                          <p>Edit image here</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{image.name}</Typography>
                            <EditOutlined />
                          </FlexBetween>
                        )}
                      </Box>
                      {image && (
                        <IconButton
                          onClick={() => setImage(null)}
                          sx={{ width: "15%" }}
                        >
                          <DeleteOutlined />
                        </IconButton>
                      )}
                    </FlexBetween>
                  )}
                </Dropzone>

                <div className={styles.actions}>
                  <button onClick={updatePost} className={styles.saveButton}>
                    Save
                  </button>
                  <div className={styles.icons}>
                    <span className={styles.icon}>🖼️</span>
                    <span className={styles.icon}>👥</span>
                    <span className={styles.icon}>📍</span>
                    <span className={styles.icon}>🙂</span>
                  </div>
                </div>
              </div>
            )}
          </Box>
        </Fade>
      </Modal>
    </WidgetWrapper>
  );
};

export default PostWidget;
