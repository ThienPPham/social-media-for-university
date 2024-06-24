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

function App() {
  // const { postId } = useParams();
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

            <Route
              path="/course/create"
              element={isAuth ? <NewCourse /> : <Navigate to="/" />}
            />

            <Route
              path="/courses/:courseId"
              element={isAuth ? <CourseDetail /> : <Navigate to="/" />}
            />

            {/* <Route path="/course/create" element={<NewCourse />} />
            <Route path="/courses/:courseId" element={<CourseDetail />} /> */}
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
