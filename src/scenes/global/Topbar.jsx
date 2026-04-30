import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { AuthContext } from "../../context/AuthContext";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";


import { useState } from "react";
import { Tooltip } from "@mui/material";





import { useRef } from "react";
import { useMediaQuery } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Topbar = ({onMenuClick}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { logout } = useContext(AuthContext);


  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };
  const iconStyle = {
    borderRadius: "8px",
    padding: "8px",
    transition: "background 0.2s ease, transform 0.15s ease",
    "&:hover": {
      backgroundColor: colors.primary[400],
      transform: "translateY(-1px)",
    },
    "&:active": {
      transform: "scale(0.93)",
    },
  };

  // Wrapper del grupo de iconos
  const iconGroupStyle = {
    display: "flex",
    alignItems: "center",
    gap: isMobile ? "2px" : "4px",
    backgroundColor: colors.primary[400],
    borderRadius: "10px",
    padding: "4px 6px",
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>


      {/* IZQUIERDA: BOTÓN + SEARCH */}
      <Box display="flex" alignItems="center" gap="10px">

        {/* 🔥 BOTÓN HAMBURGUESA */}
        <IconButton
          onClick={onMenuClick}
          sx={{
            backgroundColor: colors.primary[400],
            borderRadius: "8px",
            width: 40,
            height: 40,
            color: colors.grey[100],
            "&:hover": {
              backgroundColor: colors.primary[300],
            },
          }}
        >
          <MenuOutlinedIcon />
        </IconButton>

        {/* SEARCH BAR */}
        <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="3px">
          <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>

      </Box>

      {/* ICON GROUP */}
      <Box sx={iconGroupStyle}>

        {/* Divider helper */}
        {[
          {
            tip: theme.palette.mode === "dark" ? "Light mode" : "Dark mode",
            icon: theme.palette.mode === "dark" ? <DarkModeOutlinedIcon fontSize="small" /> : <LightModeOutlinedIcon fontSize="small" />,
            onClick: colorMode.toggleColorMode,
          },
          {
            tip: "Notifications",
            icon: <NotificationsOutlinedIcon fontSize="small" />,
          },
          {
            tip: "Settings",
            icon: <SettingsOutlinedIcon fontSize="small" />,
            onClick: () => navigate("/configuracion"),
            divider: !isMobile, // separador visual antes de perfil/logout
          },
          {
            tip: "Profile",
            icon: <PersonOutlinedIcon fontSize="small" />,
          },
          {
            tip: "Logout",
            icon: <LogoutIcon fontSize="small" />,
            onClick: handleLogout,
            danger: true,
          },
        ].map(({ tip, icon, onClick, divider, danger }, i) => (
          <Box key={i} display="flex" alignItems="center">
            {divider && (
              <Box
                sx={{
                  width: "1px",
                  height: "20px",
                  backgroundColor: colors.primary[300],
                  mx: "4px",
                  opacity: 0.5,
                }}
              />
            )}
            <Tooltip title={tip} placement="bottom" arrow>
              <IconButton
                onClick={onClick}
                size={isMobile ? "small" : "medium"}
                sx={{
                  ...iconStyle,
                  ...(danger && {
                    color: "error.main",
                    "&:hover": {
                      backgroundColor: "rgba(211,47,47,0.08)",
                      transform: "translateY(-1px)",
                    },
                  }),
                }}
              >
                {icon}
              </IconButton>
            </Tooltip>
          </Box>
        ))}
      </Box>

    </Box>
  );
};

export default Topbar;