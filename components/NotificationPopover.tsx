"use client";

import React from "react";
import { Popover, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import Link from "next/link";
import { Notification } from "@/types";

interface NotificationsPopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  notifications: Notification[];
}

export default function NotificationsPopover({
  open,
  anchorEl,
  onClose,
  notifications,
}: NotificationsPopoverProps) {
  const id = open ? "notifications-popover" : undefined;

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
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
          notifications.map((notif) => (
            <ListItem key={notif.resultId} disablePadding>
              <ListItemButton component={Link} href={`/result/${notif.resultId}`} onClick={onClose}>
                <ListItemText primary={notif.message} />
              </ListItemButton>
            </ListItem>
          ))
        )}
      </List>
    </Popover>
  );
}
