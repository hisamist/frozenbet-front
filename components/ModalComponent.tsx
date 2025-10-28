"use client";

import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import * as React from "react";

interface ModalComponentProps {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  title?: string;
}

export default function ModalComponent({ children, open, onClose }: ModalComponentProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "auto",
          maxWidth: "90vw",
          maxHeight: "90vh",
          overflow: "auto",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "text.secondary",
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
          aria-label="Fermer"
        >
          <CloseIcon />
        </IconButton>
        {children}
      </Box>
    </Modal>
  );
}
