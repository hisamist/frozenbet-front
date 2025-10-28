"use client";

import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Link from "next/link";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Notification } from "@/types";
import NotificationsPopover from "./NotificationPopover";

interface NavbarProps {
  onLoginClick: () => void;
  notifications: Notification[];
}

export default function Navbar({ onLoginClick, notifications }: NavbarProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
              FrozenBet
            </Link>
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mr: 2 }}>
            <Link href="/" passHref>
              <Button color="inherit">Accueil</Button>
            </Link>
            <Button color="inherit" onClick={onLoginClick}>
              Login
            </Button>
          </Box>

          <IconButton color="inherit" onClick={handleNotificationsClick}>
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton color="inherit" sx={{ ml: 1 }}>
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* ✅ Popover séparé du DOM principal */}
      <NotificationsPopover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        notifications={notifications}
      />
    </>
  );
}
