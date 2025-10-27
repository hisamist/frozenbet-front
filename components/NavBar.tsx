"use client";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Link from "next/link";
import { useState } from "react";
import { Notification } from "@/types";

interface NavbarProps {
  onLoginClick: () => void;
  notifications: Notification[];
}

export default function Navbar({ onLoginClick, notifications }: NavbarProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "notifications-popover" : undefined;

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {/* Logo */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
            FrozenBet
          </Link>
        </Typography>

        {/* Navigation */}
        <Box sx={{ display: "flex", gap: 2, mr: 2 }}>
          <Link href="/" passHref>
            <Button color="inherit">Accueil</Button>
          </Link>
          <Button color="inherit" onClick={onLoginClick}>
            Login
          </Button>
        </Box>

        {/* Notifications */}
        <IconButton color="inherit" onClick={handleNotificationsClick}>
          <Badge badgeContent={notifications.length} color="error">
            🔔
          </Badge>
        </IconButton>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            style: { maxHeight: 300, width: 250, overflow: "auto" },
          }}
        >
          <List>
            {notifications.length === 0 ? (
              <ListItem>
                <ListItemText primary="Pas de notifications" />
              </ListItem>
            ) : (
              notifications.map((notif: Notification) => (
                <ListItem key={notif.resultId} disablePadding>
                  <ListItemButton
                    component={Link}
                    href={`/result/${notif.resultId}`}
                    onClick={handleClose}
                  >
                    <ListItemText primary={notif.message} />
                  </ListItemButton>
                </ListItem>
              ))
            )}
          </List>
        </Popover>

        {/* User icon */}
        <IconButton color="inherit" sx={{ ml: 1 }}>
          👤
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
