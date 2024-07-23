import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import AdminApp from "AdminApp";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import NewCourse from "scenes/createCoursePage";
import CourseDetail from "scenes/courseDetailPage";
import MemberManagement from "scenes/courseManagement/memberManagement";
import GroupManagement from "scenes/courseManagement/groupManagement";
import Announcement from "scenes/courseManagement/Announcement";
import AnnouncementUser from "scenes/announcement/index";
import CourseManagementLayout from "scenes/courseManagement/courseManagementLayout";
import PrivateRoute from "scenes/PrivateRoute/PrivateRoute";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));
  const isAdmin = useSelector((state) => state.user?.admin);
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/home"
              element={isAuth ? <HomePage /> : <Navigate to="/" />}
            />
            <Route
              path="/announcement"
              element={isAuth ? <AnnouncementUser /> : <Navigate to="/" />}
            />
            <Route
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
            />
            <Route
              path="/course/create"
              element={isAuth ? <NewCourse /> : <Navigate to="/" />}
            />

            <Route
              path="/courses/:courseId"
              element={isAuth ? <CourseDetail /> : <Navigate to="/" />}
            />
            <Route
              path="/courses/:courseId/ManageGroup"
              element={
                isAuth ? <CourseManagementLayout /> : <Navigate to="/" />
              }
            >
              <Route
                path="/courses/:courseId/ManageGroup/member"
                element={isAuth ? <MemberManagement /> : <Navigate to="/" />}
              />

              <Route
                path="/courses/:courseId/ManageGroup/group"
                element={isAuth ? <GroupManagement /> : <Navigate to="/" />}
              />

              <Route
                path="/courses/:courseId/ManageGroup/announcement"
                element={isAuth ? <Announcement /> : <Navigate to="/" />}
              />
            </Route>
            <Route
              path="/admin/*"
              element={<PrivateRoute element={<AdminApp />} requiredRole={true} />}
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
