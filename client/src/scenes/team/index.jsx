import { useEffect, useState } from 'react';
import { Box, Typography, Button, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../adminTheme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import axios from 'axios';

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [users, setUsers] = useState([]);

  // Function to fetch users data from backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const formattedUsers = users.map(user => ({
    admin: user.admin,
    host: user.host,
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullname:user.firstName+" "+user.lastName,
    email: user.email,
    password: user.password,
    picturePath: user.picturePath,
    friends: user.friends,
    location: user.location,
    occupation: user.occupation,
    viewedProfile: user.viewedProfile,
    impressions: user.impressions,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    status: user.status
  }));

  const columns = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'fullname',
      headerName: 'Full Name',
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
    },
    {
      field: 'location',
      headerName: 'Location',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
    },
    {
      field: 'accessLevel',
      headerName: 'Access Level',
      flex: 1,
      renderCell: ({ row: { admin, host } }) => {
        const access = admin ? 'admin' : host ? 'host' : 'user';
        return (
          <Box
            width="60%"
            m="10px auto 0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              admin
                ? colors.greenAccent[600]
                : host
                ? colors.greenAccent[700]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {admin && <AdminPanelSettingsOutlinedIcon />}
            {host && <SecurityOutlinedIcon />}
            {!admin && !host && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: '5px' }}>
              {access}
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
        const isUserActive = row.status === 'active';
        return (
          <Button
            variant="contained"
            color={isUserActive ? "error" : "secondary"}
            onClick={() => updateUserStatus(row.id, isUserActive ? "inactive" : "active")}
          >
            {isUserActive ? "Restrictions" : "Active"}
          </Button>
        );
      },
    },
  ];  

  const updateUserStatus = async (userID, status) => {
    try {
      await axios.put(`http://localhost:3001/users/${userID}/status`, { status });
      fetchUsers(); 
    } catch (error) {
    }
  };

  return (
    <Box m="20px">
      <Header title="User" subtitle="Managing the list of User" />
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
        }}
      >
        <DataGrid checkboxSelection rows={formattedUsers} columns={columns} />
      </Box>
    </Box>
  );
};

export default Team;
