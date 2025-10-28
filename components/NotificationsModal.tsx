"use client";

import ModalComponent from "@/components/ModalComponent";
import { acceptInvitation, getAllNotifications, rejectInvitation } from "@/services/APIService";
import { Notification } from "@/types";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import MailIcon from "@mui/icons-material/Mail";
import SportsHockeyIcon from "@mui/icons-material/SportsHockey";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useEffect, useState } from "react";

interface NotificationsModalProps {
  open: boolean;
  onClose: () => void;
  onNotificationUpdate?: () => void;
}

export function NotificationsModal({
  open,
  onClose,
  onNotificationUpdate,
}: NotificationsModalProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const allNotifications = await getAllNotifications();
      setNotifications(allNotifications);
    } catch (err: any) {
      console.error("Error loading notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadNotifications();
    }
  }, [open]);

  const handleAccept = async (token: string) => {
    try {
      await acceptInvitation(token);
      alert("Invitation acceptée ✅");
      await loadNotifications();
      if (onNotificationUpdate) {
        onNotificationUpdate();
      }
    } catch (err: any) {
      alert(err.message || "Erreur lors de l'acceptation de l'invitation");
    }
  };

  const handleReject = async (token: string) => {
    try {
      await rejectInvitation(token);
      alert("Invitation refusée");
      await loadNotifications();
      if (onNotificationUpdate) {
        onNotificationUpdate();
      }
    } catch (err: any) {
      alert(err.message || "Erreur lors du rejet de l'invitation");
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "invitation":
        return <MailIcon />;
      case "match_result":
        return <SportsHockeyIcon />;
      default:
        return <MailIcon />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;

    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const renderNotificationActions = (notification: Notification) => {
    if (notification.type === "invitation" && !notification.isRead) {
      return (
        <Box sx={{ display: "flex", gap: 1, ml: 3 }}>
          <IconButton
            size="small"
            color="success"
            onClick={(e) => {
              e.stopPropagation();
              handleAccept(notification.invitationToken!);
            }}
            title="Accepter"
          >
            <CheckIcon />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              handleReject(notification.invitationToken!);
            }}
            title="Refuser"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      );
    }
    return null;
  };

  const renderNotificationItem = (notification: Notification) => {
    const hasLink = notification.link || notification.resultId || notification.groupId;
    const link =
      notification.link ||
      (notification.resultId ? `/result/${notification.resultId}` : null) ||
      (notification.groupId ? `/group/${notification.groupId}` : null);

    const content = (
      <ListItem
        key={notification.id}
        sx={{
          bgcolor: notification.isRead ? "transparent" : "action.hover",
          borderRadius: 1,
          mb: 1,
          "&:hover": { bgcolor: "action.selected" },
          cursor: hasLink ? "pointer" : "default",
          pr: notification.type === "invitation" && !notification.isRead ? 12 : 2,
        }}
        secondaryAction={renderNotificationActions(notification)}
      >
        <ListItemIcon sx={{ color: "text.primary" }}>
          {getNotificationIcon(notification.type)}
        </ListItemIcon>
        <ListItemText
          primary={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                component="span"
                variant="body2"
                fontWeight={notification.isRead ? "normal" : "bold"}
                color="text.primary"
              >
                {notification.title}
              </Typography>
              {!notification.isRead && <Chip label="Nouveau" color="primary" size="small" />}
            </Box>
          }
          secondary={
            <Box component="span">
              <Typography component="span" variant="body2" color="text.secondary" display="block">
                {notification.message}
              </Typography>
              <Typography component="span" variant="caption" color="text.secondary" display="block">
                {formatDate(notification.createdAt)}
              </Typography>
            </Box>
          }
        />
      </ListItem>
    );

    if (hasLink && link) {
      return (
        <Link
          key={notification.id}
          href={link}
          style={{ textDecoration: "none", color: "inherit" }}
          onClick={onClose}
        >
          {content}
        </Link>
      );
    }

    return content;
  };

  return (
    <ModalComponent open={open} onClose={onClose}>
      <Box sx={{ p: 4, minWidth: 500, maxWidth: 700, bgcolor: "background.paper" }}>
        <Typography variant="h5" sx={{ mb: 3, color: "text.primary" }}>
          Notifications
        </Typography>

        {loading ? (
          <Typography sx={{ textAlign: "center", py: 3, color: "text.primary" }}>
            Chargement...
          </Typography>
        ) : notifications.length === 0 ? (
          <Typography sx={{ textAlign: "center", py: 3, color: "text.secondary" }}>
            Aucune notification
          </Typography>
        ) : (
          <List sx={{ maxHeight: 500, overflow: "auto" }}>
            {notifications.map((notification) => renderNotificationItem(notification))}
          </List>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button variant="outlined" onClick={onClose}>
            Fermer
          </Button>
        </Box>
      </Box>
    </ModalComponent>
  );
}
