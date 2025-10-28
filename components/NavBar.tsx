"use client";

import { NotificationsModal } from "@/components/NotificationsModal";
import { useAuth } from "@/context/AuthContext";
import { useLiveScores } from "@/context/LiveScoresContext";
import { getUnreadNotificationsCount } from "@/services/APIService";
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
import { useCallback, useEffect, useMemo, useState } from "react";

interface NavbarProps {
  onLoginClick: () => void;
}

export default function Navbar({ onLoginClick }: NavbarProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const { getUnreadCount: getLiveScoresUnreadCount } = useLiveScores();
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [invitationUnreadCount, setInvitationUnreadCount] = useState(0);

  // Fonction pour récupérer le username depuis localStorage
  const getUsername = (): string => {
    if (typeof window === "undefined") return "";

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        return userData.username || userData.email?.split("@")[0] || "";
      } catch (err) {
        console.error("Error parsing user from localStorage:", err);
        return "";
      }
    }
    return "";
  };

  const username = getUsername();

  useEffect(() => {
    let isMounted = true;

    const loadUnreadCount = async () => {
      if (!isAuthenticated) {
        setInvitationUnreadCount(0);
        return;
      }
      try {
        const count = await getUnreadNotificationsCount();
        if (isMounted) {
          setInvitationUnreadCount(count);
        }
      } catch (err) {
        console.error("Error loading unread notifications count:", err);
      }
    };

    loadUnreadCount();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const loadUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const count = await getUnreadNotificationsCount();
      setInvitationUnreadCount(count);
    } catch (err) {
      console.error("Error loading unread notifications count:", err);
    }
  }, [isAuthenticated]);

  // Combine invitation and match notifications counts
  const totalUnreadCount = useMemo(() => {
    return invitationUnreadCount + getLiveScoresUnreadCount();
  }, [invitationUnreadCount, getLiveScoresUnreadCount]);

  const handleAuthClick = () => {
    if (user) {
      logout();
    } else {
      onLoginClick();
    }
  };

  const handleNotificationsClick = () => {
    setNotificationsModalOpen(true);
  };

  const handleNotificationsModalClose = () => {
    setNotificationsModalOpen(false);
    loadUnreadCount();
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

          <Box sx={{ display: "flex", gap: 2, mr: 2 }}>
            <Button color="inherit" onClick={handleAuthClick}>
              {user ? "Logout" : "Login"}
            </Button>
          </Box>

          {isAuthenticated ? (
            <>
              <IconButton color="inherit" onClick={handleNotificationsClick}>
                <Badge badgeContent={totalUnreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  ml: 1,
                  cursor: "default",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                <AccountCircleIcon />
                <Typography
                  variant="body1"
                  sx={{
                    color: "inherit",
                    fontWeight: 500,
                  }}
                >
                  {username}
                </Typography>
              </Box>
            </>
          ) : null}
        </Toolbar>
      </AppBar>

      {user && (
        <NotificationsModal
          open={notificationsModalOpen}
          onClose={handleNotificationsModalClose}
          onNotificationUpdate={loadUnreadCount}
        />
      )}
    </>
  );
}
