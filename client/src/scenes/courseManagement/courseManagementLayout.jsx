import React from "react";
import { Outlet } from "react-router-dom";
import CourseManagement from "./index";

const CourseManagementLayout = () => {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        // position: "fixed",
      }}
    >
      <CourseManagement />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default CourseManagementLayout;
