import { useTheme } from "@emotion/react";
import { Close, DarkMode, Help, LightMode, Menu, Message, Notifications, Search } from "@mui/icons-material";
import { Box, FormControl, IconButton, InputBase, MenuItem, Select, Typography, useMediaQuery } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLogout, setMode } from "state";

const Navbar = () => {
    const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    const theme = useTheme();

    return <div>Navbar</div>;
};

export default Navbar;