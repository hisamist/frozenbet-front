"use client";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";
import { Notification } from "@/types";

export default function NotificationPopover({ notifications }: { notifications: Notification[] }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={notifications?.length ?? 0} color="error">
          🔔
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box sx={{ p: 2, maxHeight: 300, overflowY: "auto", width: 300 }}>
          {notifications.length === 0 ? (
            <Typography>Aucune notification</Typography>
          ) : (
            notifications.map((notif) => (
              <Box
                key={notif.resultId}
                sx={{
                  mb: 1,
                  p: 1,
                  borderBottom: "1px solid #ddd",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ mr: 1 }}>{notif.message}</Typography>
                <Link href={`/result/${notif.resultId}`} passHref>
                  <Button size="small" variant="outlined" onClick={handleClose}>
                    Voir résultat
                  </Button>
                </Link>
              </Box>
            ))
          )}
        </Box>
      </Popover>
    </>
  );
}
