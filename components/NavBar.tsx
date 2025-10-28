"use client";

import { useState, useEffect } from "react";
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
import NotificationsPopover from "./NotificationPopover";
import { Notification } from "@/types";
import { useAuth } from "@/context/AuthContext";

interface NavbarProps {
  onLoginClick: () => void; // ouvre AuthModal
  notifications?: Notification[];
}

export default function Navbar({ onLoginClick, notifications = [] }: NavbarProps) {
  const { user, logout } = useAuth(); // hook AuthProvider
  const [mounted, setMounted] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [clientNotifications, setClientNotifications] = useState<Notification[]>([]);
  const open = Boolean(anchorEl);

  useEffect(() => {
    setMounted(true);
    setClientNotifications(notifications);
  }, [notifications]);

  const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleAuthClick = () => {
    if (user) {
      logout(); // si connecté, bouton devient logout
    } else {
      onLoginClick(); // si pas connecté, ouvre AuthModal
    }
  };

  if (!mounted) return null;

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
              FrozenBet
            </Link>
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mr: 2 }}>
            <Button color="inherit" onClick={handleAuthClick}>
              {user ? "Logout" : "Login"}
            </Button>
          </Box>

          {user && (
            <>
              <IconButton color="inherit" onClick={handleNotificationsClick}>
                <Badge badgeContent={clientNotifications.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton color="inherit" sx={{ ml: 1 }}>
                <AccountCircleIcon />
              </IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>

      {user && (
        <NotificationsPopover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          notifications={clientNotifications}
        />
      )}
    </>
  );
}
