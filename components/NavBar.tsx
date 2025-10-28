"use client";

import { Notification } from "@/types";
import { useAuth } from "@/context/AuthContext";
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
import { useState } from "react";
import NotificationsPopover from "./NotificationPopover";

interface NavbarProps {
  onLoginClick: () => void;
  notifications: Notification[];
}

export default function Navbar({ onLoginClick, notifications }: NavbarProps) {
  const { isAuthenticated } = useAuth();
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

          {!isAuthenticated ? (
            <Box sx={{ display: "flex", gap: 2, mr: 2 }}>
              <Button color="inherit" onClick={onLoginClick}>
                Login
              </Button>
            </Box>
          ) : (
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
          )}
        </Toolbar>
      </AppBar>

      {/* ✅ Popover séparé du DOM principal */}
      {isAuthenticated && (
        <NotificationsPopover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          notifications={notifications}
        />
      )}
    </>
  );
}
