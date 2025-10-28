"use client";

import { InvitationsListModal } from "@/components/InvitationsListModal";
import { useAuth } from "@/context/AuthContext";
import { getReceivedInvitations } from "@/services/APIService";
import { GroupInvitation, Notification } from "@/types";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
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
  const [invitationsModalOpen, setInvitationsModalOpen] = useState(false);
  const [pendingInvitationsCount, setPendingInvitationsCount] = useState(0);
  const open = Boolean(anchorEl);

  const loadPendingInvitationsCount = useCallback(async () => {
    try {
      const invitations = await getReceivedInvitations();
      const pending = invitations.filter((inv: GroupInvitation) => inv.status === "pending");
      setPendingInvitationsCount(pending.length);
    } catch (err) {
      console.error("Error loading pending invitations:", err);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setClientNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    if (isAuthenticated) {
      loadPendingInvitationsCount();
    }
  }, [isAuthenticated, loadPendingInvitationsCount]);

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

  const handleInvitationsClick = () => {
    setInvitationsModalOpen(true);
  };

  const handleInvitationsModalClose = () => {
    setInvitationsModalOpen(false);
    loadPendingInvitationsCount(); // Refresh count after closing modal
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
              <IconButton color="inherit" onClick={handleInvitationsClick}>
                <Badge badgeContent={pendingInvitationsCount} color="error">
                  <MailIcon />
                </Badge>
              </IconButton>

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
        <>
          <NotificationsPopover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            notifications={clientNotifications}
          />
          <InvitationsListModal
            open={invitationsModalOpen}
            onClose={handleInvitationsModalClose}
            onInvitationAccepted={loadPendingInvitationsCount}
          />
        </>
      )}
    </>
  );
}
