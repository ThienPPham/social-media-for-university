import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import NewCourse from "scenes/createCoursePage";
import CourseDetail from "scenes/courseDetailPage";
// import MainContent from "components/MainContentCourse";
// import Sidebar from "components/SideBar/SideBarComponent";
// import CoursePage from "scenes/coursePage";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

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
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
            />

            {/* <Route
              path="/course/:userId"
              element={isAuth ? <CoursePage /> : <Navigate to="/" />}
            /> */}
            <Route path="/course/create" element={<NewCourse />} />
            {/* <Route path="/course/:userId/detail" element={<CourseDetail />} /> */}
            <Route path="/course/:courseId" element={<CourseDetail />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
