import { useEffect, useState } from 'react';
import { Box, Typography, Button, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../adminTheme";
import { mockDataTeam } from 'data/mockData';
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

  const columns = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'name',
      headerName: 'First Name',
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'age',
      headerName: 'Age',
      flex: 1,
    },
    {
      field: 'phone',
      headerName: 'Phone Number',
      flex: 1,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
    },
    {
      field: 'accessLevel',
      headerName: 'Access Level',
      flex: 1,
      renderCell: ({ row: { admin, host } }) => {
        const access = admin ? 'admin' : host ? 'manager' : 'user';
        return (
          <Box
            width="60%"
            m="0 auto"
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
        return (
          <Button
            variant="contained"
            color="secondary"
            href={`banUser?userID=${row.id}`}
          >
            Restrictions
          </Button>
        );
      },
    },
  ];  

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
        <DataGrid checkboxSelection rows={mockDataTeam} columns={columns} />
      </Box>
    </Box>
  );
};

export default Team;
