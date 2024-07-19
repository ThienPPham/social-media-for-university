import { useEffect, useState } from 'react';
import { Box ,Button,Typography} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../adminTheme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import axios from 'axios';
const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [posts, setPosts] = useState([]);

  // Function to fetch posts data from backend
  const fetchPosts = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:3001/posts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const formattedPosts = posts.map(post => ({
    id: post._id,
    userId: post.userId,
    firstName: post.firstName,
    lastName: post.lastName,
    fullname:post.firstName+" "+post.lastName,
    location: post.location,
    description: post.description,
    picturePath: post.picturePath,
    userPicturePath: post.userPicturePath,
    report: post.report,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  }));
  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "fullname", headerName: "Người đăng" },
    {
      field: "description",
      headerName: "Nội dung",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "createdAt",
      headerName: "Ngày đăng",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "picturePath",
      headerName: "Hình ảnh",
      flex: 1,
    },
    {
      field: 'report',
      headerName: 'Report',
      flex: 1,
      renderCell: ({ row }) => {
        const isReported = row.report === true;
        return (
          <Box
            width="60%"
            m="10px 0 0 0"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={isReported ? colors.redAccent[600] : colors.greenAccent[600]}
            borderRadius="4px"
          >
            <Typography color={colors.grey[100]} sx={{ ml: '5px' }}>
              {isReported ? "True" : "False"}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      renderCell: ({ row }) => {
        return (
          <Button
            variant="contained"
            color={"error"}
            onClick={() => deletePost(row.id)}
          >
            Delete
          </Button>
        );
      },
    },
  ];
// Function to delete post
const deletePost = async (postId) => {
  const token = localStorage.getItem('token');
  try {
    await axios.delete(`http://localhost:3001/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Update the posts state after deletion
    setPosts(posts.filter(post => post._id !== postId));
  } catch (error) {
    console.error('Error deleting post:', error);
  }
};

  return (
    <Box m="20px">
      <Header
        title="Post"
        subtitle="Manager list reported post"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          checkboxSelection
          rows={formattedPosts}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Contacts;
