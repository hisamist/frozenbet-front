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

interface NavbarProps {
  onLoginClick: () => void;
  notifications?: Notification[]; // optionnel pour SSR
}

export default function Navbar({ onLoginClick, notifications = [] }: NavbarProps) {
  const [mounted, setMounted] = useState(false); // pour éviter le SSR mismatch
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [clientNotifications, setClientNotifications] = useState<Notification[]>([]);

  const open = Boolean(anchorEl);

  useEffect(() => {
    // ⚡️ marquer que le composant est monté côté client
    setMounted(true);
    setClientNotifications(notifications); // initialiser les notifications côté client
  }, [notifications]);

  const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!mounted) return null; // on ne rend rien côté serveur

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
            <Button component={Link} href="/" color="inherit">
              Accueil
            </Button>
            <Button color="inherit" onClick={onLoginClick}>
              Login
            </Button>
          </Box>

          <IconButton color="inherit" onClick={handleNotificationsClick}>
            <Badge badgeContent={clientNotifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton color="inherit" sx={{ ml: 1 }}>
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Popover séparé */}
      <NotificationsPopover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        notifications={clientNotifications}
      />
    </>
  );
}
