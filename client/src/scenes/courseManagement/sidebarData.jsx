import { Icon } from "@mui/material";
import React from "react";
import PeopleIcon from "@mui/icons-material/People";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";

export const SideBarData = [
  {
    title: "Quản lý Thành Viên Nhóm",
    icon: <PeopleIcon />,
    link: "/member",
  },
  {
    title: "Quản lý Nhóm",
    icon: <GroupWorkIcon />,
    link: "/group",
  },
  {
    title: "Thông báo",
    icon: <NotificationImportantIcon />,
    link: "/announcement",
  },
];
