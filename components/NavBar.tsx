"use client";

import { useAuth } from "@/context/AuthContext";
import { Notification } from "@/types";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useEffect, useState } from "react";
import NotificationsPopover from "./NotificationPopover";

interface NavbarProps {
  onLoginClick: () => void; // ouvre AuthModal
  notifications?: Notification[];
}

export default function Navbar({ onLoginClick, notifications = [] }: NavbarProps) {
  const { user, logout } = useAuth(); // hook AuthProvider
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [clientNotifications, setClientNotifications] = useState<Notification[]>([]);
  const open = Boolean(anchorEl);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
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
          <Link href="/" className="text-inherit no-underline flex items-center grow">
            <img
              src="/logo-frozenbet.png"
              alt="FrozenBet Logo"
              width={40}
              height={40}
              className="mr-3"
            />
            <Typography variant="h6" component="span">
              FrozenBet
            </Typography>
          </Link>

          <Box sx={{ display: "flex", gap: 2, mr: 2 }}>
            <Button color="inherit" onClick={handleAuthClick}>
              {user ? "Logout" : "Login"}
            </Button>
          </Box>

          {isAuthenticated ? (
            <>
              <IconButton color="inherit" onClick={handleNotificationsClick}>
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              <IconButton color="inherit" sx={{ ml: 1 }}>
                <AccountCircleIcon />
              </IconButton>
            </>
          ) : null}
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
