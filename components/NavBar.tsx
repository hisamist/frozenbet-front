"use client";

import { NotificationsModal } from "@/components/NotificationsModal";
import { useAuth } from "@/context/AuthContext";
import { useLiveScores } from "@/context/LiveScoresContext";
import { getUnreadNotificationsCount } from "@/services/APIService";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
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

  // Récupère le username depuis localStorage (client only)
  const getUsername = (): string => {
    if (typeof window === "undefined") return "";
    const savedUser = localStorage.getItem("user");
    if (!savedUser) return "";
    try {
      const userData = JSON.parse(savedUser);
      return userData.username || userData.email?.split("@")[0] || "";
    } catch (err) {
      console.error("Error parsing user from localStorage:", err);
      return "";
    }
  };

  // Recalcule le username quand l'état d'auth change
  const username = useMemo(() => getUsername(), [isAuthenticated, user]);

  // Initiale sécurisée
  const usernameInitial = useMemo(
    () => username?.trim()?.charAt(0)?.toUpperCase() || "?",
    [username]
  );

  useEffect(() => {
    let isMounted = true;

    const loadUnreadCount = async () => {
      if (!isAuthenticated) {
        if (isMounted) setInvitationUnreadCount(0);
        return;
      }
      try {
        const count = await getUnreadNotificationsCount();
        if (isMounted) setInvitationUnreadCount(count);
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

  // Combine les notifications d’invitations + live scores
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

              {/* Avatar (initiale) + username complet */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  ml: 1,
                }}
              >
                <Avatar sx={{ width: 32, height: 32, fontSize: 16 }}>{usernameInitial}</Avatar>
                <Typography variant="body1" sx={{ color: "inherit", fontWeight: 500 }}>
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
