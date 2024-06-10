import { Box, useMediaQuery } from "@mui/material";
import MainContent from "components/MainContentCourse";
import SidebarCourse from "components/SideBarCourse";
import React from "react";
import Navbar from "scenes/navbar";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";


const CourseDetail = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  return (
    <Box>
      <Navbar />

      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        // justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <SidebarCourse />
        </Box>

        <Box
          flexBasis={isNonMobileScreens ? "68%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MainContent />
          {/* <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        > */}
          <MyPostWidget  />
          <PostsWidget  />
        {/* </Box> */}
         
        </Box>
      </Box>
    </Box>
  );
};

export default CourseDetail;
