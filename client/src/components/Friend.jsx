import {
  PersonAddOutlined,
  PersonRemoveOutlined,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import styles from "./Friend.module.css";

const Friend = ({
  friendId,
  name,
  subtitle,
  userPicturePath,
  deletePost,
  handleDeleteClick,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFriend = friends.find((friend) => friend._id === friendId);

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const patchFriend = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${_id}/${friendId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  return (
    <>
      <FlexBetween>
        <FlexBetween gap="1rem">
          <UserImage image={userPicturePath} size="55px" />
          <Box
            onClick={() => {
              navigate(`/profile/${friendId}`);
              navigate(0);
            }}
          >
            <Typography
              color={main}
              variant="h5"
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {name}
            </Typography>
            <Typography color={medium} fontSize="0.75rem">
              {subtitle}
            </Typography>
          </Box>
        </FlexBetween>
        <FlexBetween>
          <IconButton
            onClick={() => patchFriend()}
            sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
          >
            {isFriend ? (
              <PersonRemoveOutlined sx={{ color: primaryDark }} />
            ) : (
              <PersonAddOutlined sx={{ color: primaryDark }} />
            )}
          </IconButton>
          {friendId === _id && (
            <IconButton
              onClick={handleDeleteClick}
              sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
            >
              <DeleteIcon sx={{ color: primaryDark }} />
            </IconButton>
          )}

          {/* {friendId === _id && (
            <IconButton
              onClick={handleOpen}
              sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
            >
              <EditIcon sx={{ color: primaryDark }} />
            </IconButton>
          )} */}
        </FlexBetween>
      </FlexBetween>

      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "44%",
              transform: "translate(-50%, -50%)",
              width: 400,
              // bgcolor: "background.paper",
              // boxShadow: 24,
              p: 4,
              borderRadius: 1,
            }}
          >
            <div className={styles.post}>
              <div className={styles.header}>
                <img
                  src="https://d1hjkbq40fs2x4.cloudfront.net/2016-01-31/files/1045-2.jpg"
                  className={styles.profilePic}
                />
                <div className={styles.userInfo}>
                  <span className={styles.username}>Nguyễn Xuân Quang</span>
                  <span className={styles.badge}>Test</span>
                </div>
              </div>
              <div className={styles.content}>
                <p>trời đẹp quá</p>
                <img
                  src="https://d1hjkbq40fs2x4.cloudfront.net/2016-01-31/files/1045-2.jpg"
                  className={styles.postImage}
                />
              </div>
              <div className={styles.actions}>
                <button>Thêm vào bài viết của bạn</button>
                <div className={styles.icons}>
                  <span className={styles.icon}>🖼️</span>
                  <span className={styles.icon}>👥</span>
                  <span className={styles.icon}>📍</span>
                  <span className={styles.icon}>🙂</span>
                </div>
              </div>
              <button className={styles.saveButton}>Lưu</button>
            </div>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default Friend;
